import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  FIGURES,
  SHAPE_NAMES,
  SHAPE_OPTION_COUNT,
  SHAPE_ROUNDS,
  getShapeFeedback,
  getShapeOptions,
  mostExactName,
  nameRank,
  roundFigure,
  shapeAnswer,
  shapeLabel,
  trueNames,
  type Figure,
  type Point,
  type ShapeName,
} from '../games/shape-hunt';
import { ShapeHuntGame } from '../components/ShapeHuntGame';

afterEach(cleanup);

const game = () => createElement(ShapeHuntGame);

/**
 * The shipped defect: `getShapeOptions(9)` returned [square, rectangle, oval]
 * over a `<rect width="72" height="72">`. A square is a rectangle, so the round
 * had two correct buttons and scored one of them wrong.
 *
 * The gate below is the plan's: the names OFFERED, intersected with the names
 * TRUE of the figure actually drawn, must be exactly the one scored answer. It
 * is computed from the rendered SVG rather than from the round record, so a
 * round-index shift, a re-ordered figure table or a hand-edited drawing all
 * fail it.
 */

/** Rebuild a Figure from what the component actually painted. */
function drawnFigure(svg: Element): Figure {
  const poly = svg.querySelector('polygon');
  if (poly) {
    const points = (poly.getAttribute('points') ?? '')
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [x, y] = pair.split(',').map(Number);
        return [x, y] as Point;
      });
    return { kind: 'polygon', points };
  }
  const el = svg.querySelector('ellipse');
  if (!el) throw new Error('the stage drew neither a polygon nor an ellipse');
  const num = (name: string) => Number(el.getAttribute(name));
  return { kind: 'ellipse', cx: num('cx'), cy: num('cy'), rx: num('rx'), ry: num('ry') };
}

/** The offered names that are true of the figure. Should always be just the answer. */
function offeredTruths(figure: Figure, offered: readonly ShapeName[]): ShapeName[] {
  const truths = new Set(trueNames(figure));
  return offered.filter((name) => truths.has(name));
}

describe('the figure is the only fact', () => {
  it('gives every figure exactly one most-exact name', () => {
    for (const [id, figure] of Object.entries(FIGURES)) {
      const names = trueNames(figure);
      expect(names.length, id).toBeGreaterThan(0);
      const best = mostExactName(figure);
      expect(names, id).toContain(best);
      // Exactly one name may sit at the top, or "the most exact name" is a toss-up.
      const top = Math.max(...names.map(nameRank));
      expect(names.filter((n) => nameRank(n) === top), id).toEqual([best]);
    }
  });

  it('reads the real taxonomy off the geometry, not off a label', () => {
    expect([...trueNames(FIGURES.square)].sort()).toEqual(
      ['quadrilateral', 'rectangle', 'rhombus', 'square'].sort(),
    );
    expect([...trueNames(FIGURES.rectangle)].sort()).toEqual(['quadrilateral', 'rectangle'].sort());
    // Four equal sides, corners not square: a rhombus, and it is called one.
    expect([...trueNames(FIGURES.rhombus)].sort()).toEqual(['quadrilateral', 'rhombus'].sort());
    expect(mostExactName(FIGURES.rhombus)).toBe('rhombus');
    expect([...trueNames(FIGURES.trapezoid)].sort()).toEqual(['quadrilateral', 'trapezoid'].sort());
    expect(trueNames(FIGURES.quadrilateral)).toEqual(['quadrilateral']);
    expect([...trueNames(FIGURES.circle)].sort()).toEqual(['circle', 'ellipse'].sort());
    expect(mostExactName(FIGURES.circle)).toBe('circle');
    expect(trueNames(FIGURES.ellipse)).toEqual(['ellipse']);
    expect(trueNames(FIGURES.triangle)).toEqual(['triangle']);
    expect(trueNames(FIGURES.pentagon)).toEqual(['pentagon']);
    expect(trueNames(FIGURES.hexagon)).toEqual(['hexagon']);
  });

  it('uses the academic names, so "diamond" and "oval" are gone', () => {
    const names: readonly string[] = SHAPE_NAMES;
    expect(names).not.toContain('diamond');
    expect(names).not.toContain('oval');
    expect(names).toContain('rhombus');
    expect(names).toContain('ellipse');
    for (const round of SHAPE_ROUNDS) expect(names).toContain(shapeAnswer(round));
  });
});

describe('GATE: no round offers two names that are both true of the drawn figure', () => {
  it('holds for every round, measured against the rendered SVG', async () => {
    const user = userEvent.setup();
    render(game());

    for (let i = 0; i < SHAPE_ROUNDS.length; i += 1) {
      const figure = drawnFigure(screen.getByTestId('figure'));
      const buttons = screen.getAllByTestId('option');
      const offered = buttons.map((b) => b.getAttribute('data-name') as ShapeName);

      expect(offered, `round ${i}`).toHaveLength(SHAPE_OPTION_COUNT);
      expect(offeredTruths(figure, offered), `round ${i}`).toEqual([shapeAnswer(SHAPE_ROUNDS[i])]);

      await user.click(buttons[0]);
      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  });

  it('would have failed on the shipped round 9, which is what makes the gate load-bearing', () => {
    // <rect x="14" y="14" width="72" height="72"> as the component drew it.
    const shipped: Figure = {
      kind: 'polygon',
      points: [
        [14, 14],
        [86, 14],
        [86, 86],
        [14, 86],
      ],
    };
    const shippedOffer: ShapeName[] = ['square', 'rectangle'];
    expect(offeredTruths(shipped, shippedOffer)).toHaveLength(2);
    expect(offeredTruths(shipped, shippedOffer)).not.toEqual([mostExactName(shipped)]);
  });
});

describe('options', () => {
  it('contain the answer exactly once and are distinct', () => {
    SHAPE_ROUNDS.forEach((round, i) => {
      const opts = getShapeOptions(i);
      expect(opts).toHaveLength(SHAPE_OPTION_COUNT);
      expect(new Set(opts).size).toBe(opts.length);
      expect(opts.filter((o) => o === shapeAnswer(round))).toHaveLength(1);
    });
  });

  it('are deterministic and wrap by modulo', () => {
    SHAPE_ROUNDS.forEach((_, i) => {
      expect(getShapeOptions(i)).toEqual(getShapeOptions(i));
      expect(getShapeOptions(i)).toEqual(getShapeOptions(i + SHAPE_ROUNDS.length));
    });
  });

  it('do not park the answer in one slot', () => {
    const counts = new Map<number, number>();
    SHAPE_ROUNDS.forEach((round, i) => {
      const slot = getShapeOptions(i).indexOf(shapeAnswer(round));
      expect(slot).toBeGreaterThanOrEqual(0);
      counts.set(slot, (counts.get(slot) ?? 0) + 1);
    });
    const worst = Math.max(...counts.values());
    expect(worst).toBeLessThanOrEqual(Math.ceil(SHAPE_ROUNDS.length / SHAPE_OPTION_COUNT) + 1);
  });

  it('put the near misses first, so the round is a real discrimination', () => {
    const rhombusRounds = SHAPE_ROUNDS.map((r, i) => [r, i] as const).filter(
      ([r]) => r.figure === 'rhombus',
    );
    expect(rhombusRounds.length).toBeGreaterThan(0);
    for (const [, i] of rhombusRounds) {
      const others = getShapeOptions(i).filter((o) => o !== 'rhombus');
      expect(others.some((o) => o === 'square' || o === 'rectangle' || o === 'trapezoid')).toBe(true);
    }
  });
});

describe('the figure is described without being named', () => {
  it('labels the drawing by its side count, never by its answer', () => {
    render(game());
    const label = (screen.getByTestId('figure').getAttribute('aria-label') ?? '').toLowerCase();
    expect(label.length).toBeGreaterThan(0);
    for (const name of SHAPE_NAMES) expect(label).not.toContain(name);
  });

  it('does not print any shape name in the prompt', () => {
    render(game());
    const prompt = (screen.getByText(/what is this figure/i).textContent ?? '').toLowerCase();
    for (const name of SHAPE_NAMES) expect(prompt).not.toContain(name);
  });

  it('draws the figure the round declares', () => {
    render(game());
    expect(drawnFigure(screen.getByTestId('figure'))).toEqual(roundFigure(SHAPE_ROUNDS[0]));
  });
});

describe('what the child is told', () => {
  it('teaches the wider names the figure is also true of', () => {
    const squareRound = SHAPE_ROUNDS.find((r) => r.figure === 'square');
    if (!squareRound) throw new Error('expected a square round');
    const text = getShapeFeedback(squareRound, 'square');
    expect(text).toContain('rectangle');
    expect(text).toContain('rhombus');
    expect(text).toContain('most exact');
  });

  it('names the answer for any choice', () => {
    SHAPE_ROUNDS.forEach((round) => {
      for (const name of SHAPE_NAMES) {
        expect(getShapeFeedback(round, name)).toContain(shapeAnswer(round));
      }
    });
  });

  it('keeps the register: no praise, no exclamation marks', () => {
    const praise = /\b(great|good job|well done|awesome|amazing|super|yay|clever|brilliant)\b/i;
    SHAPE_ROUNDS.forEach((round) => {
      expect(round.example).not.toContain('!');
      for (const name of SHAPE_NAMES) {
        const text = getShapeFeedback(round, name);
        expect(praise.test(text), text).toBe(false);
        expect(text).not.toContain('!');
      }
    });
  });
});

describe('labels', () => {
  it('capitalises a name without changing it', () => {
    for (const name of SHAPE_NAMES) {
      expect(shapeLabel(name).toLowerCase()).toBe(name);
      expect(shapeLabel(name)[0]).toBe(name[0].toUpperCase());
    }
  });
});
