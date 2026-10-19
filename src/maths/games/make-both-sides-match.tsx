import type { BoardProps, Level, SolveGame } from '../../play/types';
import { Tray, Piece } from '../../play/parts';

/**
 * Make Both Sides Match — the reference maths game.
 *
 * Every other maths game copies this file's shape. Read it first.
 *
 * Concept (advisor, maths 3): equality is a relationship, not "the answer
 * comes next". Dadi's brass pan balance holds the problem; the child loads
 * weights onto the lighter pan until the beam is level. The beam has three
 * drawn states and switches instantly — no motion.
 *
 * Levels:
 *  1. One side is a single number (7 = ?). He loads singles: equality as same amount.
 *  2. Both sides are sums (4 + 3 = 5 + ?). The missing part is on the right.
 *  3. The unknown can be on EITHER side, and the totals are teens (? + 6 = 9 + 5).
 *     Level 3 is where "=" stops meaning "write the answer next".
 *
 * Control: tap-to-add/remove only. Tapping a weight in the tray drops it on
 * the open pan; tapping a weight on the pan takes it off.
 */

export interface Round {
  /** Weights fixed on the left pan, as given (shown, not editable). */
  readonly left: readonly number[];
  /** Weights fixed on the right pan. */
  readonly right: readonly number[];
  /** Which pan he loads. */
  readonly open: 'left' | 'right';
  /** What the open pan needs in total. */
  readonly need: number;
}

/** The weights he has put on the open pan. */
export type Answer = readonly number[];

const WEIGHTS = [1, 2, 5] as const;

const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = index % 7;
  if (level === 1) {
    const n = [7, 4, 9, 6, 8, 5, 10][k];
    return { left: [n], right: [], open: 'right', need: n };
  }
  if (level === 2) {
    const [a, b, c] = [
      [4, 3, 5], [6, 2, 3], [5, 5, 4], [3, 6, 2], [7, 2, 6], [2, 8, 4], [6, 6, 5],
    ][k];
    return { left: [a, b], right: [c], open: 'right', need: a + b - c };
  }
  const [a, b, c] = [
    [6, 9, 5], [7, 8, 4], [5, 9, 6], [8, 7, 3], [4, 9, 8], [9, 6, 7], [7, 7, 6],
  ][k];
  // ? + a = b + c, with the unknown on the left half the time.
  const unknownLeft = k % 2 === 0;
  return unknownLeft
    ? { left: [a], right: [b, c], open: 'left', need: b + c - a }
    : { left: [b, c], right: [a], open: 'right', need: b + c - a };
}

function prompt(round: Round): string {
  return round.open === 'right' ? 'Load the right pan until the beam is level.' : 'Load the left pan until the beam is level.';
}

function check(round: Round, answer: Answer) {
  const placed = sum(answer);
  const leftTotal = sum(round.left) + (round.open === 'left' ? placed : 0);
  const rightTotal = sum(round.right) + (round.open === 'right' ? placed : 0);
  if (leftTotal === rightTotal) return { ok: true };
  return { ok: false, hint: `Left pan ${leftTotal}, right pan ${rightTotal}.` };
}

function explain(round: Round): string {
  const l = round.left.join(' + ');
  const r = round.right.join(' + ');
  if (round.open === 'right') {
    return `${l} = ${r ? `${r} + ` : ''}${round.need}. Both pans weigh ${sum(round.left)}.`;
  }
  return `${round.need} + ${l} = ${r}. Both pans weigh ${sum(round.right)}.`;
}

/** The balance, drawn. Three states only: left-down, level, right-down. */
function Beam({ tilt }: { tilt: -1 | 0 | 1 }) {
  // Pan heights are fixed per state, so nothing tweens between them. tilt -1
  // means the LEFT pan is lower, which on screen is a LARGER y on the left —
  // the first draft had the sign backwards and drew the heavy side going up.
  const dy = -26 * tilt;
  return (
    <svg className="balance" viewBox="0 0 960 360" role="img" aria-label={tilt === 0 ? 'The beam is level.' : tilt < 0 ? 'The left pan is lower.' : 'The right pan is lower.'}>
      <rect x="455" y="90" width="50" height="230" rx="8" className="balance__post" />
      <rect x="380" y="316" width="200" height="22" rx="10" className="balance__foot" />
      <line x1="200" y1={110 + dy} x2="760" y2={110 - dy} className="balance__beam" />
      <circle cx="480" cy="110" r="16" className="balance__pivot" />
      <line x1="200" y1={110 + dy} x2="200" y2={210 + dy} className="balance__chain" />
      <line x1="760" y1={110 - dy} x2="760" y2={210 - dy} className="balance__chain" />
      <path d={`M90 ${210 + dy} h220 l-30 34 h-160 z`} className="balance__pan" />
      <path d={`M650 ${210 - dy} h220 l-30 34 h-160 z`} className="balance__pan" />
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const placed = sum(answer);
  const leftTotal = sum(round.left) + (round.open === 'left' ? placed : 0);
  const rightTotal = sum(round.right) + (round.open === 'right' ? placed : 0);
  const tilt: -1 | 0 | 1 = leftTotal === rightTotal ? 0 : leftTotal > rightTotal ? -1 : 1;
  const showTotals = stage !== 'answering';
  const locked = stage === 'solved' || stage === 'worked';
  // The worked answer is drawn ON the pan: the fewest weights that make it.
  const worked = stage === 'worked' ? decompose(round.need) : null;
  const onOpen = worked ?? answer;

  const pan = (side: 'left' | 'right') => {
    const fixed = side === 'left' ? round.left : round.right;
    const open = round.open === side;
    return (
      <div className={`balance-pan balance-pan--${side}${open ? ' is-open' : ''}`}>
        <div className="balance-pan__weights">
          {fixed.map((w, i) => (
            <Piece key={`f${i}`} label={String(w)} tone="fixed" />
          ))}
          {open
            ? onOpen.map((w, i) => (
                <Piece
                  key={`p${i}`}
                  label={String(w)}
                  tone={worked ? 'worked' : 'placed'}
                  onTap={locked ? undefined : () => setAnswer(answer.filter((_, j) => j !== i))}
                  ariaLabel={`Take off the ${w}`}
                />
              ))
            : null}
          {open && onOpen.length === 0 ? <span className="balance-pan__empty">tap a weight</span> : null}
        </div>
        {showTotals ? <p className="balance-pan__total">{side === 'left' ? leftTotal : rightTotal}</p> : null}
      </div>
    );
  };

  return (
    <div className="board board--balance">
      <Beam tilt={worked ? 0 : tilt} />
      <div className="balance-pans">
        {pan('left')}
        {pan('right')}
      </div>
      <Tray label="Weights">
        {WEIGHTS.map((w) => (
          <Piece
            key={w}
            label={String(w)}
            tone="source"
            onTap={locked ? undefined : () => setAnswer([...answer, w])}
            ariaLabel={`Put a ${w} on the ${round.open} pan`}
          />
        ))}
      </Tray>
    </div>
  );
}

/** The fewest 5s, 2s and 1s that make n. */
export function decompose(n: number): number[] {
  const out: number[] = [];
  let rest = n;
  for (const w of [5, 2, 1]) {
    while (rest >= w) {
      out.push(w);
      rest -= w;
    }
  }
  return out;
}

export const makeBothSidesMatch: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'make-both-sides-match',
  title: 'Make Both Sides Match',
  hook: "Level Dadi's brass balance.",
  group: 'together',
  levels: ['Match one', 'Two each side', 'Either side'],
  generate,
  prompt,
  emptyAnswer: () => [],
  Board,
  check,
  explain,
  cover: 'art/games/make-both-sides-match.png',
  note: {
    what: "A pan balance with weights already on one side. He taps weights in the tray to load the other pan until the beam is level.",
    expect: "At level 1 he will match by eye and count. At level 2, many children add the left and forget the weight already on the right — the beam stays tipped and the totals appear. At level 3 the unknown moves to the left, and that is where it usually breaks.",
    practising: "The equals sign as 'both sides have the same value', not 'the answer comes next'. Also addition, and making a number from 5s, 2s and 1s.",
    ask: "Before he checks: 'Which pan is heavier right now? How much heavier?'",
    next: "Use a coat hanger with two cups on strings and pennies. Put 3 + 4 pennies on one side, 5 on the other, and ask what is missing.",
    honest: "Balancing correctly here does not mean he reads 7 = 3 + 4 on paper as a true statement. Write a few equations with the sum on the RIGHT and ask if they are true.",
    easier: "Stay on level 1 and use only the 1-weights, so every weight is counted.",
    harder: "On level 3, ask him to say the equation aloud before he loads anything.",
  },
};

export default makeBothSidesMatch;
