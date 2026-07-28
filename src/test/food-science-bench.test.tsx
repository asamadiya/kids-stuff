import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodScienceGame from '../components/FoodScienceGame';
import {
  EGG_PARTS,
  blockCheck,
  eggPart,
  eggPartAt,
  foodById,
  plateTotals,
  serve,
} from '../games/food-science';

vi.mock('../workshop/say', () => ({
  say: vi.fn(),
  canSpeak: () => true,
  stopSpeaking: vi.fn(),
}));

const bench = (name: string) => screen.getByRole('button', { name });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('the food science bench', () => {
  it('opens on the plate and offers the three benches', () => {
    render(<FoodScienceGame />);
    expect(screen.getByRole('heading', { name: 'What Food Is Made Of' })).toBeInTheDocument();
    for (const name of ['Build a plate', 'Inside an egg', 'Milk into curd']) {
      expect(bench(name)).toBeInTheDocument();
    }
  });

  it('reads back what the plate supplies, summed from the table', async () => {
    const user = userEvent.setup();
    render(<FoodScienceGame />);
    await user.click(screen.getByRole('button', { name: /^Put bowl of rajma on the plate/ }));
    await user.click(screen.getByRole('button', { name: /^Put bowl of rice on the plate/ }));

    const expected = plateTotals(serve(serve({}, 'rajma'), 'rice'));
    expect(screen.getByRole('button', { name: `Protein, about ${expected.protein} g` })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Fibre, about ${expected.fibre} g` })).toBeInTheDocument();
  });

  it('states that rajma and rice cover each other rather than scoring the plate', async () => {
    const user = userEvent.setup();
    render(<FoodScienceGame />);
    await user.click(screen.getByRole('button', { name: /^Put bowl of rajma on the plate/ }));
    expect(blockCheck(serve({}, 'rajma')).complete).toBe(false);
    expect(screen.getAllByText(/short of the same block: methionine/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /^Put bowl of rice on the plate/ }));
    expect(screen.getAllByText(/All nine building blocks are here/).length).toBeGreaterThan(0);
  });

  it('takes a serving back off again', async () => {
    const user = userEvent.setup();
    render(<FoodScienceGame />);
    await user.click(screen.getByRole('button', { name: /^Put egg on the plate/ }));
    expect(screen.getByRole('button', { name: /Take one egg back off the plate/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Take one egg back off the plate/ }));
    expect(screen.queryByRole('button', { name: /Take one egg back off the plate/ })).toBeNull();
  });

  it('shows nothing that reads as a score, a mark or praise', async () => {
    const user = userEvent.setup();
    const { container } = render(<FoodScienceGame />);
    await user.click(screen.getByRole('button', { name: /^Put bowl of dal on the plate/ }));
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/\bscore\b/i);
    expect(text).not.toMatch(/\bcorrect\b/i);
    expect(text).not.toMatch(/\bwell done\b/i);
    expect(text).not.toMatch(/!/);
    expect(text).not.toMatch(/\b(healthy|unhealthy|junk|treat|good for you|bad for you)\b/i);
  });

  it('says the food fact aloud, because he does not read fluently', async () => {
    const user = userEvent.setup();
    const { say } = await import('../workshop/say');
    render(<FoodScienceGame />);
    await user.click(screen.getByRole('button', { name: /^Put spoon of ghee on the plate/ }));
    expect(vi.mocked(say)).toHaveBeenCalledWith(expect.stringContaining(foodById('ghee')!.fact));
  });
});

describe('the egg plate as it is actually drawn', () => {
  /**
   * The gate for the defect this repo shipped last time: hand-typed label
   * coordinates over a drawing they did not match, so a leader pointed at a
   * bookshelf. Here the rendered leader lines are read back out of the DOM and
   * checked against the anchors the geometry module computed. Replace either
   * with a typed number and these fail.
   */
  const openEgg = async (): Promise<HTMLElement> => {
    const user = userEvent.setup();
    const { container } = render(<FoodScienceGame />);
    await user.click(bench('Inside an egg'));
    return container;
  };

  it('draws one leader per part, starting exactly at that part\'s anchor', async () => {
    const container = await openEgg();
    const leaders = [...container.querySelectorAll('[data-leader]')];
    expect(leaders).toHaveLength(EGG_PARTS.length);
    for (const part of EGG_PARTS) {
      const line = container.querySelector(`[data-leader="${part.id}"]`);
      expect(line, part.id).not.toBeNull();
      const start = (line!.getAttribute('points') ?? '').split(' ')[0];
      // The leader begins at the anchor the geometry computed, and the anchor
      // resolves to this part — so the line cannot point at a neighbour.
      expect(start, part.id).toBe(`${part.anchor.x},${part.anchor.y}`);
      expect(eggPartAt(part.anchor), part.id).toBe(part.id);
    }
  });

  it('labels every part, and says what each one is for', async () => {
    const user = userEvent.setup();
    const { say } = await import('../workshop/say');
    const container = await openEgg();
    const stage = container.querySelector('svg')!;
    for (const part of EGG_PARTS) {
      expect(within(stage as unknown as HTMLElement).getByText(part.label)).toBeInTheDocument();
    }
    await user.click(bench('Yolk'));
    expect(vi.mocked(say)).toHaveBeenCalledWith(expect.stringContaining(eggPart('yolk').what));
  });

  it('paints the shell first and the air cell last, so nothing hides what claims it', async () => {
    const container = await openEgg();
    const svg = container.querySelector('svg')!;
    const order = [...svg.querySelectorAll('path, circle, line')]
      .map((el) => el.getAttribute('fill'))
      .filter((f): f is string => f !== null && f !== 'none');
    expect(order[0]).toBe(eggPart('shell').color);
    expect(order.indexOf(eggPart('white').color)).toBeGreaterThan(0);
  });
});

describe('milk into curd', () => {
  it('walks from charged bundles to one mesh, and says why', async () => {
    const user = userEvent.setup();
    const { say } = await import('../workshop/say');
    const { container } = render(<FoodScienceGame />);
    await user.click(bench('Milk into curd'));
    expect(container.textContent).toContain('casein');
    await user.click(bench('Curd'));
    expect(vi.mocked(say)).toHaveBeenCalledWith(expect.stringContaining('No charge left'));
    expect(container.textContent).toContain('0 charges left on each');
  });
});
