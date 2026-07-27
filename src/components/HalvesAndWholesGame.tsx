import { useState } from 'react';
import {
  HALVES_AND_WHOLES_META,
  HALVES_ROUNDS,
  fractionLabel,
  getHalvesFeedback,
  isOneHalf,
  type FractionShape,
} from '../games/halves-and-wholes';

const EYEBROW = 'Fractions';
const TITLE = HALVES_AND_WHOLES_META.title;

const SHADE = '#d6337a';
const EMPTY = '#ffffff';
const STROKE = '#7a2247';

// Wedge path for a pie slice of a circle (used for circle fractions).
function wedge(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

function CircleShape({ shape }: { shape: FractionShape }): JSX.Element {
  const cx = 40;
  const cy = 40;
  const r = 34;
  if (shape.parts <= 1) {
    return (
      <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill={shape.shaded >= 1 ? SHADE : EMPTY} stroke={STROKE} strokeWidth={3} />
      </svg>
    );
  }
  const slices: JSX.Element[] = [];
  // Unequal split: only supported for 2 parts — draw a lopsided divider.
  if (!shape.equal && shape.parts === 2) {
    const split = (2 * Math.PI) * 0.28; // small shaded slice, clearly not half
    slices.push(
      <path key="u0" d={wedge(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + split)} fill={SHADE} stroke={STROKE} strokeWidth={2} />,
    );
    slices.push(
      <path key="u1" d={wedge(cx, cy, r, -Math.PI / 2 + split, -Math.PI / 2 + 2 * Math.PI)} fill={EMPTY} stroke={STROKE} strokeWidth={2} />,
    );
    return (
      <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-hidden="true">
        {slices}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={3} />
      </svg>
    );
  }
  const step = (2 * Math.PI) / shape.parts;
  for (let i = 0; i < shape.parts; i += 1) {
    const a0 = -Math.PI / 2 + i * step;
    const a1 = a0 + step;
    slices.push(
      <path
        key={i}
        d={wedge(cx, cy, r, a0, a1)}
        fill={i < shape.shaded ? SHADE : EMPTY}
        stroke={STROKE}
        strokeWidth={2}
      />,
    );
  }
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-hidden="true">
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={3} />
    </svg>
  );
}

function RectShape({ shape }: { shape: FractionShape }): JSX.Element {
  const w = 76;
  const h = 56;
  const x = 2;
  const y = 12;
  const cells: JSX.Element[] = [];
  if (shape.parts <= 1) {
    cells.push(
      <rect key="whole" x={x} y={y} width={w} height={h} fill={shape.shaded >= 1 ? SHADE : EMPTY} stroke={STROKE} strokeWidth={3} />,
    );
  } else if (!shape.equal && shape.parts === 2) {
    // Lopsided vertical split: small shaded slice on the left, clearly not half.
    const left = w * 0.3;
    cells.push(<rect key="u0" x={x} y={y} width={left} height={h} fill={SHADE} stroke={STROKE} strokeWidth={2} />);
    cells.push(<rect key="u1" x={x + left} y={y} width={w - left} height={h} fill={EMPTY} stroke={STROKE} strokeWidth={2} />);
    cells.push(<rect key="frame" x={x} y={y} width={w} height={h} fill="none" stroke={STROKE} strokeWidth={3} />);
  } else {
    const cw = w / shape.parts;
    for (let i = 0; i < shape.parts; i += 1) {
      cells.push(
        <rect
          key={i}
          x={x + i * cw}
          y={y}
          width={cw}
          height={h}
          fill={i < shape.shaded ? SHADE : EMPTY}
          stroke={STROKE}
          strokeWidth={2}
        />,
      );
    }
    cells.push(<rect key="frame" x={x} y={y} width={w} height={h} fill="none" stroke={STROKE} strokeWidth={3} />);
  }
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-hidden="true">
      {cells}
    </svg>
  );
}

function Shape({ shape }: { shape: FractionShape }): JSX.Element {
  return shape.kind === 'circle' ? <CircleShape shape={shape} /> : <RectShape shape={shape} />;
}

export function HalvesAndWholesGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const round = HALVES_ROUNDS[index % HALVES_ROUNDS.length];
  const answered = chosen !== null;
  const opts = round.options;
  const answerId = round.answerId;

  function choose(id: string): void {
    if (answered) return;
    setChosen(id);
    if (id === answerId) setScore((s) => s + 1);
  }

  function next(): void {
    setChosen(null);
    setIndex((i) => (i + 1) % HALVES_ROUNDS.length);
  }

  const feedback = answered ? getHalvesFeedback(round, chosen) : '';
  const hint = 'Look for 2 equal parts with just one part colored in.';

  return (
    <section className="mini-game" aria-labelledby="halves-and-wholes-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="halves-and-wholes-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">½</span>
        <div className="mini-game__seq" aria-hidden="true">
          {opts.map((o) => (
            <Shape key={`vis-${o.id}`} shape={o} />
          ))}
        </div>
      </div>

      <p className="mini-game__prompt">{round.prompt}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={`mini-option${chosen === o.id ? ' is-chosen' : ''}${answered && o.id === answerId ? ' is-correct' : ''}`}
            aria-pressed={chosen === o.id}
            aria-label={`Shape ${i + 1}: ${fractionLabel(o)}`}
            aria-disabled={answered}
            onClick={() => choose(o.id)}
          >
            <Shape shape={o} />
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{feedback}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">{hint}</p>
      )}
    </section>
  );
}

// Silence unused-import lint in strict setups while keeping the helper exported for tests.
void isOneHalf;

export default HalvesAndWholesGame;
