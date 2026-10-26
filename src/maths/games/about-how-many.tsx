import { useState, type ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * About How Many? — maths game 14 (advisor catalogue).
 *
 * Concept (advisor): estimate quantities using familiar groups. Estimation is
 * finding a reasonable range, not guessing a hidden exact count. Two glass
 * jars of dried beans stand on the kitchen shelf at home: the left jar holds
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
 * a dashed line where the amount he checked would reach; the bands under the
 * line are its tens. The line stays put
 * when he taps a new amount, so it is evidence, not a tester he can slide
 * onto the beans. The worked answer (and a
 * right answer) rings every complete ten, counts on beside the jar, and draws
 * a number line with the three amounts and the real count. The count lies
 * along the line too, one blue-ringed ten per stretch of ten and the loose
 * beans after, with empty dashed places on to the largest amount, so "30" on
 * the line is three tens.
 *
 * The jar of 10's ten beans are ringed in blue from the start. That ring of
 * two rows of five is the unit everywhere else: on the buttons, on the card,
 * round each ten in the reveal and along the number line.
 *
 * Control: tap-to-choose only. Three amounts under the jars, each drawn as
 * that many blue-ringed tens in a frame five wide (top row first, like a
 * ten-frame, the same number of places in all three) with "about 30" small
 * underneath. The amount he taps appears at once on a gold card high up
 * beside the jar he is judging, the same tens in the same frame. The card is
 * small and fixed in size, so its height is never a ruler for the beans. On
 * the worked answer the card turns blue and shows the closest amount.
 */

/**
 * Rajma (red kidney beans) or alasanda (black-eyed beans; alasandalu in
 * Nanna's Telugu, karamani in Amma's Tamil): two pantry beans of about the
 * same size.
 */
export type Bean = 'rajma' | 'alasanda';
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
  return { count, choices, jar, bean: k % 2 === 0 ? 'rajma' : 'alasanda' };
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

type Stage = BoardProps<Round, Answer>['stage'];

/** The worked answer and a right answer draw the same reveal. */
const revealed = (stage: Stage) => stage === 'worked' || stage === 'solved';

/** An amount in words, as the buttons, the card and the number line all write it. */
const about = (n: number) => `about ${n}`;

/** The caption under the board at the hint stage. */
function hintCaption(round: Round): string {
  return round.jar === 'wide'
    ? 'Each gold band of one thin half holds as many as the jar of 10.'
    : 'Each gold band holds as many as the jar of 10.';
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

/** Every answer the board can hold: nothing yet, or one of the three amounts (a second tap keeps it). */
const offered = (round: Round): readonly Answer[] => [null, ...round.choices];

/** Read-aloud: every hint check() can give on this round, over every answer the board can hold. */
function hints(round: Round): readonly string[] {
  return [...new Set(offered(round).flatMap((a) => check(round, a).hint ?? []))];
}

/**
 * Read-aloud: the board's words in screen order. On the worked answer (and a
 * right answer) the card names the closest amount first; then the three
 * amounts under the buttons; at 'hint' the caption under them. The jar tags,
 * the dashed line's number, the count-on and the number line's ticks are
 * numbers the picture carries. The card before the reveal shows his own tap,
 * which the board's words never depend on.
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  return [
    ...(revealed(stage) ? [about(nearest(round))] : []),
    ...round.choices.map(about),
    ...(stage === 'hint' ? [hintCaption(round)] : []),
  ];
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
const GOLD_TINT = '#fff1c9';
const PLACE = '#cdbfa6';
const GLASS = '#eef7f6';
const BRASS = '#c99231';
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

/** Rajma: a dark red kidney. Alasanda: a cream bean with its black eye. */
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
      <rect x={g.x} y={JAR_TOP} width={g.w} height={h} rx="18" fill={GLASS} />
      <rect x={g.x + 7} y={JAR_TOP + 16} width="5" height={h - 44} rx="2.5" fill="#ffffff" />
      {children}
      <rect x={g.x} y={JAR_TOP} width={g.w} height={h} rx="18" fill="none" stroke={INK} strokeWidth="4" />
      <rect x={g.x - 6} y={JAR_TOP - 22} width={g.w + 12} height="24" rx="6" fill={BRASS} stroke={INK} strokeWidth="4" />
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

/** A bean too small to draw as a bean: a dot in its colour. */
const DOT: Record<Bean, { readonly fill: string; readonly stroke?: string; readonly strokeWidth?: number }> = {
  rajma: { fill: '#8e1b25' },
  alasanda: { fill: '#f1e6c8', stroke: '#6b5a3a', strokeWidth: 0.8 },
};

/**
 * One ten as the jar of 10 holds it: two rows of five beans in a blue ring.
 * Fewer beans, top row first, in a green ring are loose ones; none at all is
 * a dashed place where a ten could go.
 */
function TenMark({ x, y, w, h, bean, beans = 10 }: {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly bean: Bean;
  readonly beans?: number;
}) {
  const sw = Math.max(1.4, Math.min(3, h / 9));
  if (beans === 0) {
    return <rect x={x} y={y} width={w} height={h} rx={h / 3} fill="none" stroke={PLACE} strokeWidth={sw} strokeDasharray={`${2 * sw} ${1.5 * sw}`} />;
  }
  const r = Math.min(w / 11, h / 6);
  const ring = beans === 10 ? TENS : ONES;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 3} fill={ring} fillOpacity="0.1" stroke={ring} strokeWidth={sw} />
      {Array.from({ length: beans }, (_, i) => {
        const cx = x + (w * ((i % 5) + 0.5)) / 5;
        const cy = y + (h * (Math.floor(i / 5) + 0.5)) / 2;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} {...DOT[bean]} />
            {bean === 'alasanda' ? <circle cx={cx} cy={cy} r={r * 0.45} fill="#1f1a17" /> : null}
          </g>
        );
      })}
    </g>
  );
}

/** Places for tens, five to a row: enough for the largest choice, the same for all three. */
const placesFor = (round: Round) => Math.ceil(round.choices[2] / 50) * 5;

/** n beans (a whole number of tens) as tens in `places` places, filled top row first, left to right. */
function TenFrame({ n, places, x, y, w, h, gap, bean }: {
  readonly n: number;
  readonly places: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly gap: number;
  readonly bean: Bean;
}) {
  return (
    <g>
      {Array.from({ length: places }, (_, k) => (
        <TenMark key={k} x={x + (k % 5) * (w + gap)} y={y + Math.floor(k / 5) * (h + gap)} w={w} h={h} bean={bean} beans={k < n / 10 ? 10 : 0} />
      ))}
    </g>
  );
}

/* Button picture: tens 22 x 14, 3 apart, 3 from the edge, five to a row. */
const PIC_W = 22;
const PIC_H = 14;
const PIC_GAP = 3;
const PIC_PAD = 3;
const PIC_PX = 120;

/** The picture on an answer button: the amount as tens, in the frame every button shares. */
function AmountPicture({ n, places, bean }: { readonly n: number; readonly places: number; readonly bean: Bean }) {
  const rows = places / 5;
  const vw = 5 * PIC_W + 4 * PIC_GAP + 2 * PIC_PAD;
  const vh = rows * PIC_H + (rows - 1) * PIC_GAP + 2 * PIC_PAD;
  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={PIC_PX} height={Math.round((PIC_PX * vh) / vw)} aria-hidden="true">
      <TenFrame n={n} places={places} x={PIC_PAD} y={PIC_PAD} w={PIC_W} h={PIC_H} gap={PIC_GAP} bean={bean} />
    </svg>
  );
}

/* The card on the shelf: the same frame a little larger, centred in the gap between the jars, below the lids. */
const CARD_Y = 92;
const CARD_W = 26;
const CARD_H = 16;
const CARD_GAP = 4;
const CARD_PAD = 6;
const CARD_OUTER = 5 * CARD_W + 4 * CARD_GAP + 2 * CARD_PAD;
const cardX = (round: Round) => (REF_X + THIN_W + targetGeom(round).x - CARD_OUTER) / 2;

/**
 * His amount on the board as soon as he taps it. Its size never changes with
 * the amount and it stands clear of both jars, so it is not a ruler for the
 * beans. On the worked answer it turns blue and shows the closest amount.
 */
function GuessCard({ x, n, places, bean, shown }: { readonly x: number; readonly n: Answer; readonly places: number; readonly bean: Bean; readonly shown: boolean }) {
  const rows = places / 5;
  const frameH = rows * CARD_H + (rows - 1) * CARD_GAP;
  return (
    <g>
      <rect x={x} y={CARD_Y} width={CARD_OUTER} height={frameH + 2 * CARD_PAD + 32} rx="10" fill={shown ? TENS_TINT : GOLD_TINT} stroke={shown ? TENS : INK} strokeWidth="3" />
      <TenFrame n={n ?? 0} places={places} x={x + CARD_PAD} y={CARD_Y + CARD_PAD} w={CARD_W} h={CARD_H} gap={CARD_GAP} bean={bean} />
      <text
        x={x + CARD_OUTER / 2}
        y={CARD_Y + CARD_PAD + frameH + 20}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="22"
        fontWeight="700"
        fill={shown ? TENS_DEEP : INK}
        style={DISPLAY}
      >
        {n === null ? '?' : about(n)}
      </text>
    </g>
  );
}

/** The ring round the k-th ten of a jar: two rows in a thin jar, one row in a wide one. */
function tenBox(g: Geom, k: number) {
  const rowsPerTen = 10 / g.cols;
  return { x: g.x + 3, y: BOTTOM - (k + 1) * rowsPerTen * ROW + 1.5, width: g.w - 6, height: rowsPerTen * ROW - 3 };
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
        <rect key={`t${k}`} {...tenBox(g, k)} rx="8" fill={TENS} fillOpacity="0.1" stroke={TENS} strokeWidth="3" />
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

/**
 * The bottom band ringed in blue exactly as the jar of 10 is: one ring in a
 * thin jar, one ring in each half of a wide jar. That shows "one band holds
 * the jar of 10" (and, wide, "one band holds two of them") on the beans,
 * rather than only saying it. A ring is drawn only round ten real beans.
 */
function FirstBand({ g, n }: { readonly g: Geom; readonly n: number }) {
  const halves = g.cols === 10 ? 2 : 1;
  const w = g.w / halves;
  return (
    <g>
      {Array.from({ length: halves }, (_, h) => {
        // Ten beans in this ring: a thin jar needs 10; a wide jar's left half 15 (rows fill across), its right half 20.
        if (n < (halves === 1 ? 10 : 15 + 5 * h)) return null;
        const x0 = g.x + (h === 0 ? 3 : h * w + 1.5);
        const x1 = g.x + (h === halves - 1 ? g.w - 3 : (h + 1) * w - 1.5);
        return <rect key={h} x={x0} y={BOTTOM - BAND + 1.5} width={x1 - x0} height={BAND - 3} rx="8" fill={TENS} fillOpacity="0.1" stroke={TENS} strokeWidth="3" />;
      })}
    </g>
  );
}

/** Where his checked amount would reach in this jar, with that amount beside it as tens. */
function AnswerLine({ g, n, bean }: { readonly g: Geom; readonly n: number; readonly bean: Bean }) {
  const y = levelY(g, n);
  const tens = n / 10;
  const rows = Math.ceil(tens / 5);
  const frameH = rows * CARD_H + (rows - 1) * CARD_GAP;
  return (
    <g>
      <line x1={g.x - 14} x2={g.x + g.w + 14} y1={y} y2={y} stroke={INK} strokeWidth="3" strokeDasharray="10 7" />
      <text x={g.x + g.w + 20} y={y} dominantBaseline="central" fontSize="22" fontWeight="700" fill={INK} style={DISPLAY}>
        {n}
      </text>
      <TenFrame n={n} places={tens} x={g.x + g.w + 64} y={y - frameH / 2} w={CARD_W} h={CARD_H} gap={CARD_GAP} bean={bean} />
    </g>
  );
}

/** The kitchen shelf at home, the jar of 10, the jar he estimates and his amount — one SVG, one scale. */
function Shelf({ round, stage, answer, tapped }: {
  readonly round: Round;
  readonly stage: Stage;
  /** The amount he checked: where the hint's dashed line stays. */
  readonly answer: Answer;
  /** The amount he has tapped now: what the card shows. */
  readonly tapped: Answer;
}) {
  const ref = geom(REF_X, 'thin');
  const g = targetGeom(round);
  const hint = stage === 'hint';
  const shown = revealed(stage);
  const card = shown ? nearest(round) : tapped;
  const what = `${round.bean === 'rajma' ? 'Red rajma' : 'Black-eyed'} beans. A thin jar holding 10, ringed as one ten, and a ${round.jar} jar of the same beans.`;
  const cardSays = card === null ? ' No amount on the card yet.' : ` The card shows about ${card}: ${card / 10} rings of ten.`;
  return (
    <svg className="board-svg" viewBox="0 0 960 500" role="img" aria-label={`${what}${shown ? ` Ringed in tens: ${round.count}.` : ''}${cardSays}`}>
      <rect x="40" y={BOTTOM + 8} width="880" height="22" rx="5" fill="#b07a3c" stroke={INK} strokeWidth="3" />
      <Jar g={ref} tag="10">
        <Beans g={ref} n={10} bean={round.bean} />
        {hint ? <Bands g={ref} /> : null}
        {shown ? <Reveal g={ref} n={10} /> : <rect {...tenBox(ref, 0)} rx="8" fill={TENS} fillOpacity="0.1" stroke={TENS} strokeWidth="3" />}
      </Jar>
      <GuessCard x={cardX(round)} n={card} places={placesFor(round)} bean={round.bean} shown={shown} />
      <Jar g={g} tag={shown ? String(round.count) : '?'}>
        <Beans g={g} n={round.count} bean={round.bean} />
        {hint ? <Bands g={g} /> : null}
        {hint ? <FirstBand g={g} n={round.count} /> : null}
        {shown ? <Reveal g={g} n={round.count} /> : null}
        {hint && answer !== null ? <AnswerLine g={g} n={answer} bean={round.bean} /> : null}
      </Jar>
    </svg>
  );
}

/**
 * The worked answer's number line: the three amounts as big ticks, the stretch
 * of numbers nearest the right one shaded, and the real count marked inside it.
 * Under the line the count lies as objects, one ring per stretch of ten: blue
 * tens, then a green ring of the loose beans, then dashed empty places on to
 * the end, so each amount's tick sits over that many tens.
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
  const step = x(10) - x(0);
  const TY = Y + 58;
  const TH = Math.min(22, 0.6 * step);
  return (
    <svg
      className="board-svg"
      viewBox={`0 0 960 ${TY + TH + 12}`}
      role="img"
      aria-label={`A number line. ${round.count} is nearest to ${best}: closer than to ${[a, b, c].filter((n) => n !== best).join(' or ')}. Under it, ${Math.floor(round.count / 10)} rings of ten and ${round.count % 10} loose.`}
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
          <line x1={x(n)} x2={x(n)} y1={Y + 48} y2={TY + TH + 6} stroke={n === best ? TENS_DEEP : INK} strokeWidth={n === best ? 3 : 2} strokeDasharray={n === best ? undefined : '5 4'} />
          <line x1={x(n)} x2={x(n)} y1={Y - 16} y2={Y + 16} stroke={n === best ? TENS_DEEP : INK} strokeWidth="4" />
          <text x={x(n)} y={Y + 40} textAnchor="middle" fontSize="22" fontWeight={n === best ? 700 : 600} fill={n === best ? TENS_DEEP : INK} style={DISPLAY}>
            {about(n)}
          </text>
        </g>
      ))}
      {Array.from({ length: top / 10 }, (_, k) => (
        <TenMark
          key={`r${k}`}
          x={x(k * 10) + 0.08 * step}
          y={TY}
          w={0.84 * step}
          h={TH}
          bean={round.bean}
          beans={Math.max(0, Math.min(10, round.count - 10 * k))}
        />
      ))}
      <path d={`M${x(round.count)} ${Y - 4} l-10 -18 h20 z`} fill="#8e1b25" stroke={INK} strokeWidth="2" />
      <text x={x(round.count)} y={Y - 32} textAnchor="middle" fontSize="26" fontWeight="700" fill={INK} style={DISPLAY}>
        {round.count}
      </text>
    </svg>
  );
}

/** A choice button's face: the amount drawn as tens, the words small underneath. */
const FACE = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s1)' } as const;
const WORD = { fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 } as const;

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const shown = revealed(stage);
  const best = nearest(round);
  // The dashed line stays on the amount he CHECKED. If it followed his taps
  // during the hint, tapping all three amounts would slide a labelled line
  // onto the top of the beans — the answer, with no estimating — and the hint
  // sentence ("where 30 beans would reach") would stop describing the board.
  const [checked, setChecked] = useState<Answer>(answer);
  if (stage === 'answering' && checked !== answer) setChecked(answer);
  const places = placesFor(round);
  return (
    <div className="board board--estimate">
      <Shelf round={round} stage={stage} answer={checked} tapped={answer} />
      <div className="choices" role="group" aria-label="About how many">
        {round.choices.map((n) => (
          <Choice
            key={n}
            selected={answer === n}
            onTap={() => setAnswer(n)}
            disabled={shown}
            mark={shown && n === best ? 'right' : null}
            ariaLabel={`About ${n}: ${n / 10} rings of ten`}
          >
            <span style={FACE}>
              <AmountPicture n={n} places={places} bean={round.bean} />
              <span style={WORD}>{about(n)}</span>
            </span>
          </Choice>
        ))}
      </div>
      {stage === 'hint' ? <p className="board-caption">{hintCaption(round)}</p> : null}
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
  board,
  check,
  hints,
  explain,
  cover: 'art/games/about-how-many.png',
  note: {
    what: 'Two glass jars of dried beans on the kitchen shelf. The left jar holds exactly 10. He taps the closest of three amounts for the right jar: always 10, 30 or 100 at level 1; closer, changing choices at level 2; at level 3 some jars are twice as wide. Check rings the beans in tens and counts on.',
    expect: 'At first he will try to count every bean. That works at 30 and falls apart near 100, which is the point: he needs the jar of 10 as a ruler. At level 3 the wide jar holds 20 per band; reading the height alone gives half the real amount, and that is where it breaks.',
    practising: 'Estimation as choosing a sensible range from a known benchmark (a reference group of 10), not guessing an exact hidden number. Also counting on in tens and comparing distances on a number line.',
    ask: "Before he taps an amount: 'How many jars of 10 would it take to fill that jar to the same height?' Let him point at the heights, and on a wide jar at each half. Nanna can ask the game's own question in Telugu: 'Sumaaru enni untaayi?' (about how many are there?).",
    next: 'Pour 10 dried chickpeas into a clear glass and mark the level with tape. Tip in a big handful more without counting, ask "about how many now?", then count them out in tens to check.',
    honest: 'Choosing "about 30" here does not show he can estimate when the reference group is missing, or when objects are different sizes. A jar of mixed beans or loose blocks on the floor will test that. The wide jar is drawn one bean deep, so two widths make twice as many per band; a real round jar twice as wide holds about four times as many, so keep real follow-ups in one glass.',
    easier: 'Pour 10 real beans into a glass beside the screen so he can hold the jar of 10, and stay on level 1.',
    harder: 'Before Check, ask him for a range in his own words — "more than 40, less than 60" — and see whether the count lands inside it.',
    safety: 'Dried beans are a choking hazard for the two-year-old: do the real-bean follow-up at a table she cannot reach, and count them back into the tin. Raw rajma is also toxic if chewed (four or five raw beans can cause severe vomiting), so use chickpeas if anyone might taste.',
  },
};

export default aboutHowMany;
