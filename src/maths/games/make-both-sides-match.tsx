import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame } from '../../play/types';
import { Tray, Piece } from '../../play/parts';

/**
 * Make Both Sides Match — the reference maths game.
 *
 * Every other maths game copies this file's shape. Read it first.
 *
 * Concept (advisor, maths 3): equality is a relationship, not "the answer
 * comes next". The brass pan balance Tatayya brought from Hyderabad on his
 * last visit holds the problem; the child loads weights onto the lighter pan
 * until the beam is level. The beam has three drawn states and switches
 * instantly — no motion.
 *
 * Levels:
 *  1. One side is a single number (7 = ?). He loads singles: equality as same amount.
 *  2. Both sides are sums (4 + 3 = 5 + ?). The missing part is on the right.
 *  3. The unknown can be on EITHER side, and the totals are teens (? + 6 = 9 + 5).
 *     Level 3 is where "=" stops meaning "write the answer next".
 *
 * Control: tap-to-add/remove only. Tapping a weight in the tray drops it on
 * the open pan; tapping a weight on the pan takes it off.
 *
 * Representation (advisor: "too much reading"): a weight is never a bare
 * numeral. Every weight is drawn as its units — identical green dots in rows
 * of five — sitting ON the pan where the beam compares them, on the tray
 * buttons, and on the take-off buttons. The numeral is only a small label
 * under the dots. Fixed weights live only on the drawn pan, so nothing is
 * shown twice and counted twice.
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

/**
 * Read-aloud. The hint is one sentence of two numbers, the pan totals, and the
 * open pan takes any number of weights, so it is unbounded and has no fixed
 * sentence to list. The board draws both totals under the pans from the hint
 * stage on, so that sentence is left to the picture. (The empty-pan hint still
 * gets a clip: gameLines probes `check` with the empty answer.)
 *
 * No `board`: its only words are the tray label "Weights" and number tags
 * (the numeral under each weight, the pan totals), which the dots carry.
 */
function hints(): readonly string[] {
  return [];
}

function explain(round: Round): string {
  const l = round.left.join(' + ');
  const r = round.right.join(' + ');
  if (round.open === 'right') {
    return `${l} = ${r ? `${r} + ` : ''}${round.need}. Both pans weigh ${sum(round.left)}.`;
  }
  return `${round.need} + ${l} = ${r}. Both pans weigh ${sum(round.right)}.`;
}

/**
 * One weight drawn as its units: identical green dots in rows of five, so a
 * 7 reads as five and two. The numeral is a small label underneath.
 */
const PITCH = 18;

function Weight({ w }: { w: number }) {
  const cols = Math.min(w, 5);
  const rows = Math.ceil(w / 5);
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} style={{ width: cols * PITCH, height: rows * PITCH }} aria-hidden="true">
        {Array.from({ length: w }, (_, i) => (
          <circle key={i} cx={(i % 5) * 10 + 5} cy={Math.floor(i / 5) * 10 + 5} r="4" fill="var(--ones)" stroke="var(--ink)" strokeWidth="1" />
        ))}
      </svg>
      <span style={{ fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1 }}>{w}</span>
    </span>
  );
}

/*
 * Geometry of the balance. Across, the beam strip is in percent of the board
 * (preserveAspectRatio none) and the two pans are the two halves of a gap-free
 * grid, so a beam end at 25% / 75% is always over its pan's centre at any
 * width. Down, everything is CSS px, so a beam end and the chain under it
 * always meet. No coordinate is placed over a picture by hand.
 */
const BEAM_H = 96;
const BEAM_MID = 50;
const DROP = 28;
const CHAIN = 24;

/** tilt -1 means the LEFT pan is lower: a LARGER y on the left. */
const endY = (side: 'left' | 'right', tilt: -1 | 0 | 1) => BEAM_MID + DROP * (side === 'left' ? -tilt : tilt);

/** The beam, drawn. Three states only: left-down, level, right-down. */
function Beam({ tilt }: { tilt: -1 | 0 | 1 }) {
  const yl = endY('left', tilt);
  const yr = endY('right', tilt);
  return (
    <svg
      viewBox={`0 0 100 ${BEAM_H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={tilt === 0 ? 'The beam is level.' : tilt < 0 ? 'The left pan is lower.' : 'The right pan is lower.'}
      style={{ display: 'block', width: '100%', height: BEAM_H, position: 'relative', overflow: 'visible' }}
    >
      <line x1="25" y1={yl} x2="25" y2={BEAM_H} className="balance__chain" vectorEffect="non-scaling-stroke" />
      <line x1="75" y1={yr} x2="75" y2={BEAM_H} className="balance__chain" vectorEffect="non-scaling-stroke" />
      <line x1="25" y1={yl} x2="75" y2={yr} className="balance__beam" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const BRASS = '#b8862b';
const STAND: Record<'post' | 'foot' | 'pivot', CSSProperties> = {
  post: { position: 'absolute', left: '50%', top: BEAM_MID, bottom: 16, width: 24, transform: 'translateX(-50%)', background: BRASS, border: '3px solid var(--ink)', borderRadius: 8 },
  foot: { position: 'absolute', left: '50%', bottom: 0, width: 160, height: 22, transform: 'translateX(-50%)', background: BRASS, border: '3px solid var(--ink)', borderRadius: 10 },
  pivot: { position: 'absolute', left: '50%', top: BEAM_MID, width: 32, height: 32, transform: 'translate(-50%, -50%)', background: 'var(--gold)', border: '3px solid var(--ink)', borderRadius: '50%' },
};
const COLUMN: CSSProperties = { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 22px' };
const CHAIN_LINK: CSSProperties = { width: 0, borderLeft: '3px dashed var(--ink-soft)' };
const HANGER: CSSProperties = { display: 'block', width: '100%', maxWidth: 300, height: 28 };
/** The pan is a brass dish the weights sit IN, not a box beside a drawing. */
const DISH: CSSProperties = {
  boxSizing: 'border-box', width: '100%', maxWidth: 300, minHeight: 92,
  display: 'flex', flexWrap: 'wrap', alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'center', gap: 'var(--s2)',
  padding: 'var(--s2) var(--s2) var(--s3)',
  background: '#f6dfa8', border: '3px solid var(--ink)', borderBottomWidth: 7,
  borderRadius: '4px 4px 44px 44px / 4px 4px 20px 20px',
};
const DISH_OPEN: CSSProperties = { outline: '3px dashed var(--maths-deep)', outlineOffset: 4 };

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const showTotals = stage !== 'answering';
  const locked = stage === 'solved' || stage === 'worked';
  // The worked answer is drawn ON the pan: the fewest weights that make it.
  const worked = stage === 'worked' ? decompose(round.need) : null;
  const onOpen = worked ?? answer;
  // Beam and totals read what is drawn on the pan, so the worked board never
  // shows a level beam over two different totals.
  const placed = sum(onOpen);
  const leftTotal = sum(round.left) + (round.open === 'left' ? placed : 0);
  const rightTotal = sum(round.right) + (round.open === 'right' ? placed : 0);
  const tilt: -1 | 0 | 1 = leftTotal === rightTotal ? 0 : leftTotal > rightTotal ? -1 : 1;

  const pan = (side: 'left' | 'right') => {
    const fixed = side === 'left' ? round.left : round.right;
    const open = round.open === side;
    // The chain under each beam end has one length; the lower pan hangs lower.
    const chain = CHAIN + endY(side, tilt) - (BEAM_MID - DROP);
    return (
      <div style={COLUMN}>
        <span style={{ ...CHAIN_LINK, height: chain }} aria-hidden="true" />
        <svg viewBox="0 0 100 28" preserveAspectRatio="none" style={HANGER} aria-hidden="true">
          <path d="M50 0 L3 28 M50 0 L97 28" stroke="var(--ink-soft)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <div role="group" aria-label={`The ${side} pan`} style={open ? { ...DISH, ...DISH_OPEN } : DISH}>
          {fixed.map((w, i) => (
            <Piece key={`f${i}`} tone="fixed" ariaLabel={`${w}, already on the ${side} pan`}>
              <Weight w={w} />
            </Piece>
          ))}
          {open
            ? onOpen.map((w, i) => (
                <Piece
                  key={`p${i}`}
                  tone={worked ? 'worked' : 'placed'}
                  onTap={locked ? undefined : () => setAnswer(answer.filter((_, j) => j !== i))}
                  ariaLabel={locked ? `${w} on the ${side} pan` : `Take off the ${w}`}
                >
                  <Weight w={w} />
                </Piece>
              ))
            : null}
        </div>
        {showTotals ? <p className="balance-pan__total">{side === 'left' ? leftTotal : rightTotal}</p> : null}
      </div>
    );
  };

  return (
    <div className="board board--balance">
      <div style={{ position: 'relative', paddingBottom: 40 }}>
        <span style={STAND.post} aria-hidden="true" />
        <span style={STAND.foot} aria-hidden="true" />
        <Beam tilt={tilt} />
        <span style={STAND.pivot} aria-hidden="true" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
          {pan('left')}
          {pan('right')}
        </div>
      </div>
      <Tray label="Weights">
        {WEIGHTS.map((w) => (
          <Piece
            key={w}
            tone="source"
            onTap={locked ? undefined : () => setAnswer([...answer, w])}
            ariaLabel={`Put a ${w} on the ${round.open} pan`}
          >
            <Weight w={w} />
          </Piece>
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
  hook: "Level Tatayya's brass balance.",
  group: 'together',
  levels: ['Match one', 'Two each side', 'Either side'],
  generate,
  prompt,
  emptyAnswer: () => [],
  Board,
  check,
  hints,
  explain,
  cover: 'art/games/make-both-sides-match.png',
  note: {
    what: "The brass pan balance Tatayya brought on his last visit, with weights already on one side. He taps weights in the tray to load the other pan until the beam is level.",
    expect: "At level 1 he will match by eye and count. At level 2, many children add the left and forget the weight already on the right — the beam stays tipped and the totals appear. At level 3 the unknown moves to the left, and that is where it usually breaks.",
    practising: "The equals sign as 'both sides have the same value', not 'the answer comes next'. Also addition, and making a number from 5s, 2s and 1s.",
    ask: "Before he checks: 'Which pan is heavier right now? How much heavier?' Nanna or Tatayya can ask the first part in Telugu: 'Ye vaipu ekkuva baruvu undi?' (which side is heavier?).",
    next: "Use a coat hanger with two cups on strings and pennies. Put 3 + 4 pennies on one side, 5 on the other, and ask what is missing.",
    honest: "Balancing correctly here does not mean he reads 7 = 3 + 4 on paper as a true statement. Write a few equations with the sum on the RIGHT and ask if they are true.",
    easier: "Stay on level 1 and use only the 1-weights, so every weight is counted.",
    harder: "On level 3, ask him to say the equation aloud before he loads anything.",
  },
};

export default makeBothSidesMatch;
