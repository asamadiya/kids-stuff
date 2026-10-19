import { useState, type ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * About How Many? — maths game 14 (advisor catalogue).
 *
 * Concept (advisor): estimate quantities using familiar groups. Estimation is
 * finding a reasonable range, not guessing a hidden exact count. Two glass
 * jars of dried beans stand on Dadi's kitchen shelf: the left jar holds
 * exactly 10, the right one holds many more. He judges the right jar against
 * the jar of 10 and taps the closest of three amounts ("about 30"). After
 * Check the beans are ringed in tens and counted on — 10, 20, 30, 32 — and a
 * number line shows which stretch the real count falls in.
 *
 * Levels:
 *  1. About 10, 30 or 100, the same three every round, same-size jars. At 30
 *     he can still count; at 100 counting one by one falls apart, which is
 *     where the jar of 10 starts to earn its place.
 *  2. Closer choices that change every round (about 20 / 50 / 80, about
 *     10 / 40 / 70 ...). He has to read the height in tens, not just "a bit"
 *     or "a lot".
 *  3. Some jars are exactly two thin jars wide. Each band of height then
 *     holds 20, not 10. A child who reads height alone picks half the real
 *     amount; the thin-jar rounds in between keep him checking the width.
 *     The jars are drawn one bean deep, so every bean shows and the drawn
 *     count is the real count. That is why doubling the width doubles each
 *     band here; a real round jar twice as wide holds about four times as
 *     much per band. Nothing child-facing states "twice as wide, twice as
 *     many" as a rule — explain() names this jar's bands, a board fact.
 *
 * Stages: the hint draws the jar of 10's level as gold bands up both jars and
 * a dashed line where the amount he checked would reach. The line stays put
 * when he taps a new amount, so it is evidence, not a tester he can slide
 * onto the beans. The worked answer (and a
 * right answer) rings every complete ten, counts on beside the jar, and draws
 * a number line with the three amounts and the real count.
 *
 * Control: tap-to-choose only. Three amounts under the jars.
 */

/** Rajma (red kidney beans) or lobia (black-eyed beans): two pantry beans of about the same size. */
export type Bean = 'rajma' | 'lobia';
/** 'wide' is exactly two thin jars side by side, so one band holds 20. */
export type JarWidth = 'thin' | 'wide';

export interface Round {
  /** Beans in the jar he estimates. Shown as a number only after Check. */
  readonly count: number;
  /** The three amounts he chooses between, smallest first. */
  readonly choices: readonly [number, number, number];
  readonly jar: JarWidth;
  readonly bean: Bean;
}

/** The amount he has tapped, or nothing yet. */
export type Answer = number | null;

type Three = readonly [number, number, number];
type Row = readonly [count: number, choices: Three, jar: JarWidth];

const TEN_THIRTY_HUNDRED: Three = [10, 30, 100];

/**
 * Every count sits well inside the stretch nearest its right choice, never
 * near a halfway point, so "closest" has one honest answer. No count is a
 * whole number of tens: the reveal always ends on a few loose beans.
 */
const TABLE: Record<Level, readonly Row[]> = {
  1: [
    [32, TEN_THIRTY_HUNDRED, 'thin'],
    [96, TEN_THIRTY_HUNDRED, 'thin'],
    [11, TEN_THIRTY_HUNDRED, 'thin'],
    [28, TEN_THIRTY_HUNDRED, 'thin'],
    [104, TEN_THIRTY_HUNDRED, 'thin'],
    [9, TEN_THIRTY_HUNDRED, 'thin'],
    [34, TEN_THIRTY_HUNDRED, 'thin'],
  ],
  2: [
    [47, [20, 50, 80], 'thin'],
    [72, [10, 40, 70], 'thin'],
    [33, [30, 60, 90], 'thin'],
    [18, [20, 50, 80], 'thin'],
    [88, [30, 60, 90], 'thin'],
    [43, [10, 40, 70], 'thin'],
    [77, [20, 50, 80], 'thin'],
  ],
  // Wide jars: reading the height alone as tens (bands x 10) lands on a
  // wrong choice every time — 58 reads as 30, 118 as 60, 41 as 20, 98 as 50,
  // 79 as 40. The right choice moves between first, middle and last place.
  3: [
    [58, [30, 40, 60], 'wide'],
    [62, [60, 80, 100], 'thin'],
    [118, [60, 90, 120], 'wide'],
    [41, [20, 40, 60], 'wide'],
    [52, [50, 70, 90], 'thin'],
    [98, [50, 100, 150], 'wide'],
    [79, [40, 80, 120], 'wide'],
  ],
};

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const rows = TABLE[level];
  const k = index % rows.length;
  const [count, choices, jar] = rows[k];
  return { count, choices, jar, bean: k % 2 === 0 ? 'rajma' : 'lobia' };
}

/** The choice closest to the real count. */
export function nearest(round: Round): number {
  return round.choices.reduce((best, c) => (Math.abs(c - round.count) < Math.abs(best - round.count) ? c : best));
}

/** Beans in one band of height: the jar of 10's level. A wide jar holds two thin jars' worth. */
const perBand = (jar: JarWidth) => (jar === 'wide' ? 20 : 10);

/** How many bands high the beans stand, to the nearest band. */
export function bandsHigh(round: Round): number {
  return Math.max(1, Math.round(round.count / perBand(round.jar)));
}

function prompt(round: Round): string {
  return round.jar === 'wide'
    ? 'Thin jar: 10 beans. About how many in the wide jar?'
    : 'Left jar: 10 beans. About how many in the right jar?';
}

/**
 * A fact about the board, never a verdict: where his checked amount would
 * reach (the hint stage draws that line, and it stays there) and whether the
 * beans stand above or below it.
 */
function check(round: Round, answer: Answer): Verdict {
  if (answer === nearest(round)) return { ok: true };
  const wide = round.jar === 'wide' ? ' This jar is two thin jars wide.' : '';
  if (answer === null) return { ok: false, hint: `No amount chosen yet. The jar of 10 fills one band.${wide}` };
  const side = answer < round.count ? 'higher' : 'lower';
  return { ok: false, hint: `The dashed line is where ${answer} beans would reach. The beans stand ${side}.${wide}` };
}

/**
 * The count split into tens, then why the closest amount is closest. On a
 * wide jar it names the height-only reading, which is always a wrong choice.
 */
function explain(round: Round): string {
  const tens = Math.floor(round.count / 10);
  const ones = round.count % 10;
  const split =
    tens === 0
      ? `${round.count} beans, ${10 - round.count} short of a ten.`
      : `${round.count} beans: ${tens} ten${tens === 1 ? '' : 's'} and ${ones}.`;
  const best = nearest(round);
  if (round.jar === 'wide') {
    return `${split} Filled as high as the jar of 10, this jar holds 20, so about ${best}, not ${bandsHigh(round) * 10}.`;
  }
  const [a, b, c] = round.choices;
  return `${split} Of ${a}, ${b} and ${c}, it is closest to ${best}.`;
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#24170f';
const INK_SOFT = '#5a4636';
const GOLD = '#f2a900';
const TENS = '#1c6dd0';
const TENS_DEEP = '#0f4790';
const TENS_TINT = '#e2eefc';
const ONES = '#27813b';
const DISPLAY = { fontFamily: 'var(--font-display)' } as const;

/** Bottom of the bean area; the beans settle up from here. */
const BOTTOM = 460;
/** One row of beans. A band — the height the jar of 10 fills — is two rows. */
const ROW = 17;
const BAND = 2 * ROW;
/** The jar holds 22 rows: room for 110 beans in a thin jar, 220 in a wide one. */
const ROWS_MAX = 22;
const JAR_TOP = BOTTOM - ROWS_MAX * ROW - 8;
const THIN_W = 136;
const PAD = 8;
const REF_X = 152;

interface Geom {
  readonly x: number;
  /** Beans per row: 5 in a thin jar, 10 in a wide one. */
  readonly cols: 5 | 10;
  readonly w: number;
  readonly pitch: number;
}

function geom(x: number, width: JarWidth): Geom {
  const w = width === 'wide' ? 2 * THIN_W : THIN_W;
  const cols = width === 'wide' ? 10 : 5;
  return { x, cols, w, pitch: (w - 2 * PAD) / cols };
}

const targetGeom = (round: Round) => geom(round.jar === 'wide' ? 464 : 532, round.jar);

/** Height on the board of n beans in this jar: rows are full, so height is proportional to count. */
const levelY = (g: Geom, n: number) => BOTTOM - (n / g.cols) * ROW;

/**
 * Where bean i sits. Rows fill bottom-up, left to right, with a small fixed
 * jitter so the jar looks poured rather than stacked. The jitter never moves
 * a bean out of its row, so density — and therefore height — stays exact.
 */
function beanAt(g: Geom, i: number) {
  const row = Math.floor(i / g.cols);
  const col = i % g.cols;
  return {
    cx: g.x + PAD + g.pitch * (col + 0.5) + (((i * 7) % 5) - 2),
    cy: BOTTOM - ROW * (row + 0.5) + (((i * 11) % 3) - 1),
    rot: ((i * 37) % 51) - 25,
  };
}

/** Rajma: a dark red kidney. Lobia: a cream bean with its black eye. */
function BeanShape({ bean, cx, cy, rot }: { readonly bean: Bean; readonly cx: number; readonly cy: number; readonly rot: number }) {
  return (
    <g transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot})`}>
      {bean === 'rajma' ? (
        <>
          <path d="M-11 -1 C-11 -8 -2 -9 0 -5 C2 -9 11 -8 11 -1 C11 6 5 8 0 8 C-5 8 -11 6 -11 -1 Z" fill="#8e1b25" stroke="#4d0b12" strokeWidth="1.5" />
          <ellipse cx="-4.5" cy="-1.5" rx="3.4" ry="1.6" fill="#c2505a" />
        </>
      ) : (
        <>
          <ellipse rx="10.5" ry="7.5" fill="#f1e6c8" stroke="#6b5a3a" strokeWidth="1.5" />
          <ellipse cy="-3" rx="3.6" ry="2.3" fill="#1f1a17" />
          <ellipse cy="-3" rx="1.4" ry="0.8" fill="#d9c9a0" />
        </>
      )}
    </g>
  );
}

/** A glass jar with a brass lid and a paper tag on a string. */
function Jar({ g, tag, children }: { readonly g: Geom; readonly tag: string; readonly children?: ReactNode }) {
  const cx = g.x + g.w / 2;
  const h = BOTTOM + 8 - JAR_TOP;
  return (
    <g>
      <rect x={g.x} y={JAR_TOP} width={g.w} height={h} rx="18" fill="#eef7f6" />
      <rect x={g.x + 7} y={JAR_TOP + 16} width="5" height={h - 44} rx="2.5" fill="#ffffff" />
      {children}
      <rect x={g.x} y={JAR_TOP} width={g.w} height={h} rx="18" fill="none" stroke={INK} strokeWidth="4" />
      <rect x={g.x - 6} y={JAR_TOP - 22} width={g.w + 12} height="24" rx="6" fill="#c99231" stroke={INK} strokeWidth="4" />
      <line x1={cx} y1={JAR_TOP - 22} x2={cx} y2="48" stroke={INK_SOFT} strokeWidth="2.5" />
      <rect x={cx - 40} y="12" width="80" height="36" rx="8" fill="#fffaf0" stroke={INK} strokeWidth="3" />
      <text x={cx} y="31" textAnchor="middle" dominantBaseline="central" fontSize="25" fontWeight="700" fill={INK} style={DISPLAY}>
        {tag}
      </text>
    </g>
  );
}

function Beans({ g, n, bean }: { readonly g: Geom; readonly n: number; readonly bean: Bean }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const b = beanAt(g, i);
        return <BeanShape key={i} bean={bean} cx={b.cx} cy={b.cy} rot={b.rot} />;
      })}
    </>
  );
}

/**
 * The reveal: a blue ring round every complete ten, a green ring round each
 * loose bean, and the count-on beside the jar — 10, 20, 30, then the total.
 * In a wide jar each ten is one row, so the labels alternate sides to stay
 * readable; the right-hand column then reads 20, 40, 60 — one band each.
 */
function Reveal({ g, n }: { readonly g: Geom; readonly n: number }) {
  const tens = Math.floor(n / 10);
  const rowsPerTen = 10 / g.cols;
  const ringY = (k: number) => BOTTOM - (k + 0.5) * rowsPerTen * ROW;
  const onLeft = (k: number) => g.cols === 10 && k % 2 === 0;
  const rightLabels = Array.from({ length: tens }, (_, k) => k).filter((k) => !onLeft(k));
  const lastRight = rightLabels.length ? ringY(rightLabels[rightLabels.length - 1]) : BOTTOM + 30;
  const totalY = Math.min(levelY(g, n) - 14, lastRight - 32);
  return (
    <g>
      {Array.from({ length: tens }, (_, k) => (
        <rect
          key={`t${k}`}
          x={g.x + 3}
          y={BOTTOM - (k + 1) * rowsPerTen * ROW + 1.5}
          width={g.w - 6}
          height={rowsPerTen * ROW - 3}
          rx="8"
          fill={TENS}
          fillOpacity="0.1"
          stroke={TENS}
          strokeWidth="3"
        />
      ))}
      {Array.from({ length: n - tens * 10 }, (_, j) => {
        const b = beanAt(g, tens * 10 + j);
        return <ellipse key={`o${j}`} cx={b.cx} cy={b.cy} rx="12.5" ry="9.5" fill="none" stroke={ONES} strokeWidth="3" />;
      })}
      {Array.from({ length: tens }, (_, k) => (
        <text
          key={`l${k}`}
          x={onLeft(k) ? g.x - 14 : g.x + g.w + 14}
          y={ringY(k)}
          textAnchor={onLeft(k) ? 'end' : 'start'}
          dominantBaseline="central"
          fontSize="19"
          fontWeight="600"
          fill={TENS_DEEP}
          style={DISPLAY}
        >
          {(k + 1) * 10}
        </text>
      ))}
      {n % 10 ? (
        <text x={g.x + g.w + 14} y={totalY} dominantBaseline="central" fontSize="30" fontWeight="700" fill={INK} style={DISPLAY}>
          {n}
        </text>
      ) : null}
    </g>
  );
}

/** Gold lines at the height the jar of 10 fills, repeated up the jar; on a wide jar, the seam between its two thin halves. */
function Bands({ g }: { readonly g: Geom }) {
  const count = Math.floor((BOTTOM - JAR_TOP) / BAND);
  return (
    <g>
      {Array.from({ length: count }, (_, k) => (
        <line key={k} x1={g.x - 6} x2={g.x + g.w + 6} y1={BOTTOM - (k + 1) * BAND} y2={BOTTOM - (k + 1) * BAND} stroke={GOLD} strokeWidth="3.5" />
      ))}
      {g.cols === 10 ? (
        <line x1={g.x + g.w / 2} x2={g.x + g.w / 2} y1={JAR_TOP + 6} y2={BOTTOM + 4} stroke={GOLD} strokeWidth="3" strokeDasharray="8 6" />
      ) : null}
    </g>
  );
}

/** Where his chosen amount would reach in this jar. */
function AnswerLine({ g, n }: { readonly g: Geom; readonly n: number }) {
  const y = levelY(g, n);
  return (
    <g>
      <line x1={g.x - 14} x2={g.x + g.w + 14} y1={y} y2={y} stroke={INK} strokeWidth="3" strokeDasharray="10 7" />
      <text x={g.x + g.w + 20} y={y} dominantBaseline="central" fontSize="22" fontWeight="700" fill={INK} style={DISPLAY}>
        {n}
      </text>
    </g>
  );
}

/** The kitchen shelf, the jar of 10, and the jar he estimates — one SVG, one scale. */
function Shelf({ round, stage, answer }: { readonly round: Round; readonly stage: BoardProps<Round, Answer>['stage']; readonly answer: Answer }) {
  const ref = geom(REF_X, 'thin');
  const g = targetGeom(round);
  const hint = stage === 'hint';
  const shown = stage === 'worked' || stage === 'solved';
  const what = `${round.bean === 'rajma' ? 'Red rajma' : 'Black-eyed lobia'} beans. A thin jar holding 10, and a ${round.jar} jar of the same beans.`;
  return (
    <svg className="board-svg" viewBox="0 0 960 500" role="img" aria-label={shown ? `${what} Ringed in tens: ${round.count}.` : what}>
      <rect x="40" y={BOTTOM + 8} width="880" height="22" rx="5" fill="#b07a3c" stroke={INK} strokeWidth="3" />
      <Jar g={ref} tag="10">
        <Beans g={ref} n={10} bean={round.bean} />
        {hint ? <Bands g={ref} /> : null}
        {shown ? <Reveal g={ref} n={10} /> : null}
      </Jar>
      <Jar g={g} tag={shown ? String(round.count) : '?'}>
        <Beans g={g} n={round.count} bean={round.bean} />
        {hint ? <Bands g={g} /> : null}
        {shown ? <Reveal g={g} n={round.count} /> : null}
        {hint && answer !== null ? <AnswerLine g={g} n={answer} /> : null}
      </Jar>
    </svg>
  );
}

/**
 * The worked answer's number line: the three amounts as big ticks, the stretch
 * of numbers nearest the right one shaded, and the real count marked inside it.
 */
function NumberLine({ round }: { readonly round: Round }) {
  const [a, b, c] = round.choices;
  const top = Math.ceil(Math.max(c, round.count) / 10) * 10 + 10;
  const X0 = 60;
  const X1 = 900;
  const x = (n: number) => X0 + ((X1 - X0) * n) / top;
  const best = nearest(round);
  const i = round.choices.indexOf(best);
  const from = i === 0 ? 0 : (round.choices[i - 1] + best) / 2;
  const to = i === 2 ? top : (best + round.choices[i + 1]) / 2;
  const Y = 78;
  return (
    <svg
      className="board-svg"
      viewBox="0 0 960 150"
      role="img"
      aria-label={`A number line. ${round.count} is nearest to ${best}: closer than to ${[a, b, c].filter((n) => n !== best).join(' or ')}.`}
    >
      <rect x={x(from)} y={Y - 22} width={x(to) - x(from)} height="44" rx="8" fill={TENS_TINT} stroke={TENS} strokeWidth="2.5" />
      <line x1={X0} x2={X1} y1={Y} y2={Y} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {Array.from({ length: top / 10 + 1 }, (_, k) => (
        <line key={k} x1={x(k * 10)} x2={x(k * 10)} y1={Y - 7} y2={Y + 7} stroke={INK_SOFT} strokeWidth="2" />
      ))}
      <text x={x(0)} y={Y + 32} textAnchor="middle" fontSize="20" fill={INK_SOFT} style={DISPLAY}>
        0
      </text>
      {round.choices.map((n) => (
        <g key={n}>
          <line x1={x(n)} x2={x(n)} y1={Y - 16} y2={Y + 16} stroke={n === best ? TENS_DEEP : INK} strokeWidth="4" />
          <text x={x(n)} y={Y + 40} textAnchor="middle" fontSize="22" fontWeight={n === best ? 700 : 600} fill={n === best ? TENS_DEEP : INK} style={DISPLAY}>
            {`about ${n}`}
          </text>
        </g>
      ))}
      <path d={`M${x(round.count)} ${Y - 4} l-10 -18 h20 z`} fill="#8e1b25" stroke={INK} strokeWidth="2" />
      <text x={x(round.count)} y={Y - 32} textAnchor="middle" fontSize="26" fontWeight="700" fill={INK} style={DISPLAY}>
        {round.count}
      </text>
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const shown = stage === 'worked' || stage === 'solved';
  const best = nearest(round);
  // The dashed line stays on the amount he CHECKED. If it followed his taps
  // during the hint, tapping all three amounts would slide a labelled line
  // onto the top of the beans — the answer, with no estimating — and the hint
  // sentence ("where 30 beans would reach") would stop describing the board.
  const [checked, setChecked] = useState<Answer>(answer);
  if (stage === 'answering' && checked !== answer) setChecked(answer);
  return (
    <div className="board board--estimate">
      <Shelf round={round} stage={stage} answer={checked} />
      <div className="choices" role="group" aria-label="About how many">
        {round.choices.map((n) => (
          <Choice
            key={n}
            selected={answer === n}
            onTap={() => setAnswer(n)}
            disabled={shown}
            mark={shown && n === best ? 'right' : null}
            ariaLabel={`About ${n}`}
          >
            about {n}
          </Choice>
        ))}
      </div>
      {stage === 'hint' ? (
        <p className="board-caption">
          {round.jar === 'wide'
            ? 'Each gold band of one thin half holds as many as the jar of 10.'
            : 'Each gold band holds as many as the jar of 10.'}
        </p>
      ) : null}
      {shown ? <NumberLine round={round} /> : null}
    </div>
  );
}

export const aboutHowMany: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'about-how-many',
  title: 'About How Many?',
  hook: 'Judge a jar by ten.',
  group: 'numbers',
  levels: ['Ten, thirty, hundred', 'Closer choices', 'Wide jars too'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/about-how-many.png',
  note: {
    what: 'Two glass jars of dried beans on a shelf. The left jar holds exactly 10. He taps the closest of three amounts for the right jar: always 10, 30 or 100 at level 1; closer, changing choices at level 2; at level 3 some jars are twice as wide. Check rings the beans in tens and counts on.',
    expect: 'At first he will try to count every bean. That works at 30 and falls apart near 100, which is the point: he needs the jar of 10 as a ruler. At level 3 the wide jar holds 20 per band; reading the height alone gives half the real amount, and that is where it breaks.',
    practising: 'Estimation as choosing a sensible range from a known benchmark (a reference group of 10), not guessing an exact hidden number. Also counting on in tens and comparing distances on a number line.',
    ask: "Before he taps an amount: 'How many jars of 10 would it take to fill that jar to the same height?' Let him point at the heights, and on a wide jar at each half.",
    next: 'Pour 10 dried chana into a clear glass and mark the level with tape. Tip in a big handful more without counting, ask "about how many now?", then count them out in tens to check.',
    honest: 'Choosing "about 30" here does not show he can estimate when the reference group is missing, or when objects are different sizes. A jar of mixed beans or loose blocks on the floor will test that. The wide jar is drawn one bean deep, so two widths make twice as many per band; a real round jar twice as wide holds about four times as many, so keep real follow-ups in one glass.',
    easier: 'Pour 10 real beans into a glass beside the screen so he can hold the jar of 10, and stay on level 1.',
    harder: 'Before Check, ask him for a range in his own words — "more than 40, less than 60" — and see whether the count lands inside it.',
    safety: 'Dried beans are a choking hazard for the two-year-old: do the real-bean follow-up at a table she cannot reach, and count them back into the tin. Raw rajma is also toxic if chewed (four or five raw beans can cause severe vomiting), so use chana if anyone might taste.',
  },
};

export default aboutHowMany;
