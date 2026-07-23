import { useState } from 'react';
import {
  JUMP_ROUNDS,
  NUMBER_LINE_JUMP_META,
  NUMBER_LINE_MIN,
  NUMBER_LINE_MAX,
  getJumpFeedback,
  getJumpOptions,
  jumpHint,
  jumpOptionLabel,
  jumpPrompt,
  landOn,
} from '../games/number-line-jump';

const EYEBROW = 'Math • Number Line';
const TITLE = NUMBER_LINE_JUMP_META.title;

// SVG geometry for the 0..20 number line.
const VB_W = 520;
const VB_H = 120;
const PAD = 20;
const BASE_Y = 78;
const SPAN = NUMBER_LINE_MAX - NUMBER_LINE_MIN;

function tickX(n: number): number {
  return PAD + ((n - NUMBER_LINE_MIN) / SPAN) * (VB_W - PAD * 2);
}

export function NumberLineJumpGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = JUMP_ROUNDS[index % JUMP_ROUNDS.length];
  const answer = landOn(round);
  const opts = getJumpOptions(index);
  const answered = chosen !== null;

  const question = jumpPrompt(round);
  const hint = jumpHint(round);
  const feedback = answered ? getJumpFeedback(round, chosen) : '';

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % JUMP_ROUNDS.length);
    setChosen(null);
  }

  const startX = tickX(round.start);
  const endX = tickX(answer);
  const forward = round.dir === 'forward';
  // Arc control point sits above the line, bowing toward the jump direction.
  const midX = (startX + endX) / 2;
  const arcTopY = BASE_Y - 42;

  const ticks: number[] = [];
  for (let n = NUMBER_LINE_MIN; n <= NUMBER_LINE_MAX; n += 1) ticks.push(n);

  return (
    <section className="mini-game" aria-labelledby="number-line-jump-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="number-line-jump-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} solved`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">
          {round.start} {forward ? '→' : '←'} {round.jump}
        </span>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label={`Number line from ${NUMBER_LINE_MIN} to ${NUMBER_LINE_MAX}. Marker starts at ${round.start}, jumping ${round.jump} ${forward ? 'forward' : 'back'}.`}
          style={{ width: '100%', height: 'auto', maxWidth: '640px' }}
        >
          <defs>
            <marker
              id="nlj-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          {/* base line */}
          <line
            x1={tickX(NUMBER_LINE_MIN)}
            y1={BASE_Y}
            x2={tickX(NUMBER_LINE_MAX)}
            y2={BASE_Y}
            stroke="currentColor"
            strokeWidth={2}
            markerEnd="url(#nlj-arrow)"
            markerStart="url(#nlj-arrow)"
          />

          {/* ticks + labels */}
          {ticks.map((n) => {
            const x = tickX(n);
            const major = n % 5 === 0;
            return (
              <g key={n}>
                <line
                  x1={x}
                  y1={BASE_Y - (major ? 8 : 5)}
                  x2={x}
                  y2={BASE_Y + (major ? 8 : 5)}
                  stroke="currentColor"
                  strokeWidth={major ? 2 : 1}
                  opacity={major ? 1 : 0.55}
                />
                {major && (
                  <text
                    x={x}
                    y={BASE_Y + 24}
                    textAnchor="middle"
                    fontSize={13}
                    fill="currentColor"
                  >
                    {n}
                  </text>
                )}
              </g>
            );
          })}

          {/* jump arc */}
          <path
            d={`M ${startX} ${BASE_Y - 6} Q ${midX} ${arcTopY} ${endX} ${BASE_Y - 6}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeDasharray="5 4"
            markerEnd="url(#nlj-arrow)"
            opacity={0.85}
          />

          {/* start marker */}
          <circle cx={startX} cy={BASE_Y} r={7} fill="currentColor" />
          <text x={startX} y={arcTopY - 6} textAnchor="middle" fontSize={14} fill="currentColor">
            start {round.start}
          </text>

          {/* landing marker (revealed after answering) */}
          {answered && (
            <>
              <circle
                cx={endX}
                cy={BASE_Y}
                r={9}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
              />
              <text x={endX} y={BASE_Y + 42} textAnchor="middle" fontSize={14} fill="currentColor">
                land {answer}
              </text>
            </>
          )}
        </svg>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            disabled={answered}
            onClick={() => choose(o)}
          >
            {jumpOptionLabel(o)}
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

export default NumberLineJumpGame;
