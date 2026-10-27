import { useId, type ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Share the Dosa — fractions as EQUAL parts of one specified whole.
 *
 * Concept (advisor, maths 6 / game 8): a half is one of two EQUAL pieces of
 * the same dosa, not "one of two pieces". The misconceptions it targets, from
 * the charter: any two pieces are halves; more pieces means more food; a
 * quarter must beat a half because four beats two.
 *
 * Levels:
 *  1. Halves only. Pick the cut that gives Arjun and Mia the same amount, or
 *     say whether two pieces are halves. Off-centre cuts and a bent cut that
 *     still passes through the middle are the distractors.
 *  2. Thirds and quarters. Every distractor has the RIGHT number of pieces
 *     but unequal ones — an off-centre cross, two cuts through the middle that
 *     are not square, four strips of equal width — or equal pieces of the
 *     wrong number. Counting pieces is no longer enough.
 *  3. Compare and combine. Which shaded part is more dosa (a half or a
 *     quarter, a quarter or a third, a half or two quarters, two thirds or
 *     three quarters, and half of a small dosa against a quarter of a big
 *     one); how many quarters cover a half; how many thirds make a whole.
 *
 * Control: tap-to-choose only.
 * Evidence: on 'hint' the dosa he chose (every dosa, if he chose none) shows
 * its smallest piece folded over a cut onto its neighbour (a dashed blue
 * copy) — the paper-folding test from the charter. Equal pieces cover
 * exactly; unequal ones leave a gap. A cut with the wrong number of pieces is
 * numbered instead of folded. On 'worked'
 * the right dosa's pieces are labelled 1/2, 1/3 or 1/4. In the compare and
 * combine rounds the hint lays one share on the other (or lays as many unit
 * pieces as he chose), and 'worked' lays down the right number, numbered.
 * Fixed SVG states only.
 */

export type Parts = 2 | 3 | 4;

/**
 * How a dosa is cut, in screen coordinates on a dosa of radius 1 (y points
 * down), then turned `turn` degrees clockwise.
 * - fan: straight cuts from the centre out; `angles` are the pieces' angles,
 *   clockwise from the top. Two pieces of 180 make one straight cut.
 * - strips: parallel up-and-down cuts at x = each of `at`.
 * - cross: one up-and-down and one across cut, meeting at (x, y).
 */
export type Cut =
  | { readonly kind: 'fan'; readonly angles: readonly number[]; readonly turn: number }
  | { readonly kind: 'strips'; readonly at: readonly number[]; readonly turn: number }
  | { readonly kind: 'cross'; readonly x: number; readonly y: number; readonly turn: number };

/**
 * Someone's share: `k` of `n` equal pieces of a dosa, full size or half as
 * wide, drawn solid while the rest of that dosa stays as a dashed ghost, so
 * the whole is always on the board. The share starts `turn` degrees
 * clockwise from the top, so two dosas on one board never line up by accident.
 */
export interface Share {
  readonly n: Parts | 1;
  readonly k: number;
  readonly small: boolean;
  readonly turn: number;
}

export type Round =
  | { readonly kind: 'pick'; readonly n: Parts; readonly options: readonly Cut[] }
  | { readonly kind: 'judge'; readonly n: Parts; readonly cut: Cut }
  | { readonly kind: 'compare'; readonly a: Share; readonly b: Share }
  | { readonly kind: 'cover'; readonly unit: 3 | 4; readonly target: 'half' | 'whole'; readonly choices: readonly number[] }
  /** Two loose quarters: which plate (one Share per option) holds as much dosa? */
  | { readonly kind: 'join'; readonly options: readonly Share[] };

/** The index of the tapped choice. */
export type Answer = number | null;

const fan = (angles: readonly number[], turn = 0): Cut => ({ kind: 'fan', angles, turn });
const strips = (at: readonly number[], turn = 0): Cut => ({ kind: 'strips', at, turn });
const cross = (x: number, y: number, turn = 0): Cut => ({ kind: 'cross', x, y, turn });
const share = (n: Parts | 1, k: number, turn: number, small = false): Share => ({ n, k, small, turn });

const HALVES = (turn: number) => strips([0], turn);
const THIRDS = (turn: number) => fan([120, 120, 120], turn);
const QUARTERS = (turn: number) => fan([90, 90, 90, 90], turn);
/** The fair cut for each number of pieces, for the worked answer beside an unfair one. */
const FAIR: Record<Parts, (turn: number) => Cut> = { 2: HALVES, 3: THIRDS, 4: QUARTERS };
const THIRD = 1 / 3;

/** Deterministic variety without Math.random: one table per level, walked by index. */
const TABLE: Record<Level, readonly Round[]> = {
  1: [
    // Halves only. Two pick rounds have a bent cut or near-middle cut as bait.
    { kind: 'pick', n: 2, options: [strips([0.36], 90), HALVES(0), strips([-0.3], 30)] },
    { kind: 'judge', n: 2, cut: strips([0.32], 0) },
    { kind: 'pick', n: 2, options: [HALVES(45), fan([130, 230], 90), strips([0.2], 135)] },
    { kind: 'judge', n: 2, cut: HALVES(60) },
    { kind: 'pick', n: 2, options: [strips([-0.42], 0), strips([0.22], 90), HALVES(120)] },
    { kind: 'judge', n: 2, cut: fan([150, 210], 90) },
  ],
  2: [
    // Every wrong cut has the right count of pieces, or equal pieces of the wrong count.
    { kind: 'pick', n: 4, options: [QUARTERS(0), cross(0.3, 0.25), strips([-0.5, 0, 0.5])] },
    { kind: 'judge', n: 3, cut: strips([-THIRD, THIRD], 90) },
    { kind: 'pick', n: 3, options: [strips([-THIRD, THIRD]), THIRDS(90), QUARTERS(45)] },
    { kind: 'judge', n: 4, cut: cross(0, 0, 20) },
    { kind: 'pick', n: 4, options: [fan([60, 120, 60, 120], 30), THIRDS(90), cross(0, 0, 45)] },
    { kind: 'judge', n: 4, cut: fan([60, 120, 60, 120]) },
    { kind: 'judge', n: 3, cut: THIRDS(30) },
  ],
  3: [
    // Compare and combine. Index 2 (a small dosa) is the "half of WHAT?" round;
    // index 4 is two thirds against three quarters, each one piece short of a
    // whole, where the missing pieces have to be compared, not the counts.
    { kind: 'compare', a: share(2, 1, 0), b: share(4, 1, 135) },
    { kind: 'cover', unit: 4, target: 'half', choices: [1, 2, 3, 4] },
    { kind: 'compare', a: share(2, 1, 90, true), b: share(4, 1, 0) },
    { kind: 'join', options: [share(1, 1, 0), share(4, 1, 60), share(2, 1, 210)] },
    { kind: 'compare', a: share(3, 2, 300), b: share(4, 3, 45) },
    { kind: 'compare', a: share(4, 1, 200), b: share(3, 1, 30) },
    { kind: 'cover', unit: 3, target: 'whole', choices: [1, 2, 3, 4] },
    { kind: 'compare', a: share(2, 1, 270), b: share(4, 2, 0) },
  ],
};

export function generate(level: Level, index: number): Round {
  const table = TABLE[level];
  return table[index % table.length];
}


/* ------------------------------------------------------------- geometry -- */

/** A point in dosa radii, centre at 0, y pointing down the screen. */
type Pt = readonly [number, number];

/** The small dosa in the "half of WHAT?" round is half as wide as the others. */
const SMALL = 0.5;
const RAD = Math.PI / 180;

/** The point `deg` degrees clockwise from the top, `r` from the centre. */
const rim = (deg: number, r = 1): Pt => [r * Math.sin(deg * RAD), -r * Math.cos(deg * RAD)];

/** Rim points from a0 to a1 degrees, clockwise, at most 3 degrees apart. */
function arc(a0: number, a1: number, r = 1): Pt[] {
  const steps = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 3));
  return Array.from({ length: steps + 1 }, (_, i) => rim(a0 + ((a1 - a0) * i) / steps, r));
}

/** A slice from the centre, between two rim angles. */
const sector = (a0: number, a1: number, r = 1): Pt[] => [[0, 0], ...arc(a0, a1, r)];

/** Turn about the centre, clockwise on screen. */
const turnPt =
  (deg: number) =>
  ([x, y]: Pt): Pt => {
    const c = Math.cos(deg * RAD);
    const s = Math.sin(deg * RAD);
    return [x * c - y * s, x * s + y * c];
  };

/** Mirror across the line through q along unit direction u: a piece folded over a cut. */
const mirror =
  (q: Pt, u: Pt) =>
  ([x, y]: Pt): Pt => {
    const vx = x - q[0];
    const vy = y - q[1];
    const along = vx * u[0] + vy * u[1];
    return [q[0] + 2 * along * u[0] - vx, q[1] + 2 * along * u[1] - vy];
  };

/** Shoelace area. */
export function area(pts: readonly Pt[]): number {
  let s = 0;
  pts.forEach(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  });
  return Math.abs(s) / 2;
}

/** Centre of mass of a polygon: where a piece's label sits. */
function centroid(pts: readonly Pt[]): Pt {
  let a = 0;
  let cx = 0;
  let cy = 0;
  pts.forEach(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    const f = x1 * y2 - x2 * y1;
    a += f;
    cx += (x1 + x2) * f;
    cy += (y1 + y2) * f;
  });
  return [cx / (3 * a), cy / (3 * a)];
}

const asinDeg = (v: number) => Math.asin(v) / RAD;
const acosDeg = (v: number) => Math.acos(v) / RAD;
const DOWN: Pt = [0, 1];

/** What a cut does to a dosa: its pieces, the fold test, and whether the pieces match. */
export interface Cutting {
  readonly pieces: readonly Pt[][];
  /** The smallest piece folded over one of its cuts, onto the piece beside it. */
  readonly fold: Pt[];
  readonly equal: boolean;
}

/** Pieces from a hub (the centre, or where a cross meets) out to the rim angles `spokes`. */
const hubPieces = (hub: Pt, spokes: readonly number[]): Pt[][] =>
  spokes.map((s, i) => [hub, ...arc(s, i + 1 < spokes.length ? spokes[i + 1] : spokes[0] + 360)]);

function smallest(pieces: readonly Pt[][]): number {
  const areas = pieces.map(area);
  return areas.reduce((best, a, i) => (a < areas[best] - 1e-9 ? i : best), 0);
}

export function cutDosa(cut: Cut): Cutting {
  let pieces: Pt[][];
  let fold: Pt[];
  if (cut.kind === 'fan') {
    const spokes = cut.angles.map((_, i) => cut.angles.slice(0, i).reduce((a, b) => a + b, 0));
    pieces = hubPieces([0, 0], spokes);
    const i = smallest(pieces);
    // Over the cut on its clockwise side: the neighbour there is no smaller.
    fold = pieces[i].map(mirror([0, 0], rim(i + 1 < spokes.length ? spokes[i + 1] : 0)));
  } else if (cut.kind === 'cross') {
    // Where the two cuts meet the rim, clockwise from the top.
    const top = asinDeg(cut.x);
    const right = acosDeg(-cut.y);
    pieces = hubPieces([cut.x, cut.y], [top, right, 180 - top, 360 - right]);
    // The smallest piece lies on the far side of both cuts from the centre, so
    // folded over the up-and-down cut it lands inside the piece beside it.
    fold = pieces[smallest(pieces)].map(mirror([cut.x, cut.y], DOWN));
  } else {
    const edges = [-1, ...cut.at, 1];
    pieces = edges.slice(1).map((r, i) => {
      const l = edges[i];
      return [...arc(asinDeg(l), asinDeg(r)), ...arc(180 - asinDeg(r), 180 - asinDeg(l))];
    });
    const i = smallest(pieces);
    fold = pieces[i].map(mirror([cut.at[i === 0 ? 0 : i - 1], 0], DOWN));
  }
  const areas = pieces.map(area);
  const mean = areas.reduce((a, b) => a + b, 0) / areas.length;
  const t = turnPt(cut.turn);
  return {
    pieces: pieces.map((p) => p.map(t)),
    fold: fold.map(t),
    equal: areas.every((a) => Math.abs(a - mean) / mean < 0.015),
  };
}

/** How much of a full-size dosa a share is. */
export const amount = (s: Share) => (s.k / s.n) * (s.small ? SMALL * SMALL : 1);

/** A share's dosa cut into its n equal slices (one, uncut, for a whole). */
function slices(s: Share): Pt[][] {
  const r = s.small ? SMALL : 1;
  if (s.n === 1) return [arc(0, 360, r)];
  const step = 360 / s.n;
  return Array.from({ length: s.n }, (_, i) => sector(s.turn + step * i, s.turn + step * (i + 1), r));
}

/**
 * Share `x` laid on share `y`'s dosa, from y's first cut, one piece per
 * slice so the cuts still show. Half of the small dosa goes with its straight
 * edge along that cut: a semicircle on a radius fits inside a right angle,
 * so it sits wholly inside a big quarter.
 */
function layOn(x: Share, y: Share): Pt[][] {
  if (x.small) {
    const [cx, cy] = rim(y.turn, SMALL);
    return [arc(y.turn, y.turn + 180, SMALL).map(([px, py]): Pt => [cx + px, cy + py])];
  }
  if (x.n === 1) return [arc(0, 360)];
  const step = 360 / x.n;
  return Array.from({ length: x.k }, (_, i) => sector(y.turn + step * i, y.turn + step * (i + 1)));
}

/** `count` slices of 1/unit laid side by side from `from` degrees, going round. */
const laid = (unit: number, count: number, from: number): Pt[][] =>
  Array.from({ length: count }, (_, i) => sector(from + (360 / unit) * i, from + (360 / unit) * (i + 1)));

/* ------------------------------------------------------------- the rules -- */

const WORD = ['no', 'one', 'two', 'three', 'four', 'five'] as const;
const UNIT: Record<Parts, string> = { 2: 'half', 3: 'third', 4: 'quarter' };
const PLURAL: Record<Parts, string> = { 2: 'halves', 3: 'thirds', 4: 'quarters' };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** Who cut the dosa in a judge round: whichever parent made it. */
const CUTTER: Record<Parts, string> = { 2: 'Nanna', 3: 'Amma', 4: 'Nanna' };

/** Who holds each share in a compare round. */
const WHO = ['Arjun', 'Mia'] as const;

/** A share as it is said aloud: "a half", "two quarters", "half a small dosa". */
function said(s: Share): string {
  if (s.n === 1) return 'a whole dosa';
  const part = s.k === 1 ? UNIT[s.n] : `${WORD[s.k]} ${PLURAL[s.n]}`;
  if (s.small) return s.k === 1 && s.n === 2 ? 'half a small dosa' : `${part} of a small dosa`;
  return s.k === 1 ? `a ${part}` : part;
}

/** The same, after a possessive: "Mia's quarter", "Arjun's half of the small dosa". */
function owned(s: Share): string {
  if (s.n === 1) return 'whole dosa';
  const part = s.k === 1 ? UNIT[s.n] : `${WORD[s.k]} ${PLURAL[s.n]}`;
  return s.small ? `${part} of the small dosa` : part;
}

/** How many unit pieces the cover round needs. */
const needed = (r: Extract<Round, { kind: 'cover' }>) => (r.target === 'half' ? r.unit / 2 : r.unit);

/** What Mia's two quarters come to, as a part of one dosa. */
const TWO_QUARTERS = 1 / 2;

/** The index of the right choice. Every round in TABLE has exactly one. */
export function correct(round: Round): number {
  switch (round.kind) {
    case 'pick':
      return round.options.findIndex((cut) => {
        const c = cutDosa(cut);
        return c.equal && c.pieces.length === round.n;
      });
    case 'judge': {
      const c = cutDosa(round.cut);
      return c.equal && c.pieces.length === round.n ? 0 : 1;
    }
    case 'compare': {
      const a = amount(round.a);
      const b = amount(round.b);
      return same(a, b) ? 2 : a > b ? 0 : 1;
    }
    case 'cover':
      return round.choices.indexOf(needed(round));
    case 'join':
      return round.options.findIndex((s) => same(amount(s), TWO_QUARTERS));
  }
}

function prompt(round: Round): string {
  switch (round.kind) {
    case 'pick':
      return {
        2: 'Arjun and Mia share one dosa. Which cut makes halves?',
        3: 'Arjun, Mia and Amma share a dosa. Which cut makes thirds?',
        4: 'Amma, Nanna, Arjun and Mia share a dosa. Which cut makes quarters?',
      }[round.n];
    case 'judge':
      return `${CUTTER[round.n]} cut this dosa into ${WORD[round.n]} pieces. Are they ${PLURAL[round.n]}?`;
    case 'compare':
      return `Arjun has ${said(round.a)}, Mia ${said(round.b)}. Who has more?`;
    case 'cover':
      return round.target === 'half'
        ? `How many ${PLURAL[round.unit]} cover half the dosa?`
        : `How many ${PLURAL[round.unit]} make the whole dosa?`;
    case 'join':
      return 'Mia has two quarters. Which plate holds the same amount?';
  }
}

/** The smaller share of a compare round, laid on the larger (Mia's on Arjun's when equal). */
function laying(round: Extract<Round, { kind: 'compare' }>): { readonly from: 0 | 1; readonly onto: 0 | 1 } {
  return amount(round.a) < amount(round.b) ? { from: 0, onto: 1 } : { from: 1, onto: 0 };
}

const FOLD_NOTE = 'Each blue shape is the smallest piece, folded over its cut.';

/** A fact about what the board now shows, for the choice he made. */
export function hintFor(round: Round, answer: Answer): string {
  switch (round.kind) {
    case 'pick': {
      if (answer === null) {
        // Cuts with the wrong number of pieces are counted, not folded: their
        // pieces may be equal, so a fold alone would say they fit.
        const miscounted = round.options.some((cut) => cutDosa(cut).pieces.length !== round.n);
        return miscounted ? 'Blue shapes are pieces folded over a cut. Numbers count the pieces.' : FOLD_NOTE;
      }
      const c = cutDosa(round.options[answer]);
      const count = c.pieces.length;
      if (count !== round.n) return `That cut makes ${WORD[count]} pieces, not ${WORD[round.n]}.`;
      return `That cut makes ${WORD[count]} pieces. Folded over, the blue piece leaves a gap.`;
    }
    case 'judge': {
      const c = cutDosa(round.cut);
      return c.equal
        ? 'Folded over the cut, the blue piece covers the next one exactly.'
        : 'Folded over the cut, the blue piece leaves a gap.';
    }
    case 'compare': {
      const { from, onto } = laying(round);
      const x = from === 0 ? round.a : round.b;
      const y = onto === 0 ? round.a : round.b;
      const it = x.k > 1 ? 'They cover' : 'It covers';
      const under = y.k > 1 ? 'them' : 'it';
      const fit = same(amount(x), amount(y)) ? `${it} ${under} exactly.` : `${it} only part of ${under}.`;
      return `In blue, ${WHO[from]}'s ${owned(x)} ${x.k > 1 ? 'are' : 'is'} laid on ${WHO[onto]}'s ${owned(y)}. ${fit}`;
    }
    case 'cover': {
      const count = answer === null ? 1 : round.choices[answer];
      const pieces = `${cap(WORD[count])} ${count === 1 ? UNIT[round.unit] : PLURAL[round.unit]} laid down`;
      const over = count - needed(round);
      const whole = round.target === 'half' ? 'the half' : 'the dosa';
      if (over === 0) return `${pieces} in blue. They cover ${whole} exactly.`;
      if (over < 0) return `${pieces} in blue. Part of ${whole} is still bare.`;
      const red = over === 1 ? 'The red one' : `The ${WORD[over]} red ones`;
      return round.target === 'half'
        ? `${pieces}. ${red} ${over === 1 ? 'runs' : 'run'} past the half.`
        : `${pieces}. ${red} ${over === 1 ? 'lands' : 'land'} on top of the first.`;
    }
    case 'join': {
      if (answer === null) return "Mia's two quarters are laid on every plate.";
      const s = round.options[answer];
      return amount(s) > TWO_QUARTERS
        ? `Laid on the ${owned(s)}, Mia's two quarters cover only half of it.`
        : `Laid on the ${owned(s)}, Mia's second quarter, in red, has no dosa under it.`;
    }
  }
}

function check(round: Round, answer: Answer): Verdict {
  if (answer !== null && answer === correct(round)) return { ok: true };
  return { ok: false, hint: hintFor(round, answer) };
}

/* ------------------------------------------------------ words on boards -- */

/** The words under a judge round's two answer pictures: yes, equal pieces; no. */
const judgeChoices = (round: Extract<Round, { kind: 'judge' }>) => [`Yes, ${PLURAL[round.n]}`, 'No, not equal'] as const;

/** The labels under the two dosas when an unfair cut's worked answer puts a fair one beside it. */
const fairCaptions = (round: Extract<Round, { kind: 'judge' }>) => [`${CUTTER[round.n]}'s cut`, `Equal ${PLURAL[round.n]}`] as const;

/** The words under a compare round's three answer pictures. */
const COMPARE_CHOICES = [...WHO, 'The same'] as const;

/** The label under the two loose quarters in the join round. */
const MIAS_CAPTION = 'Mia’s two quarters';

/** How many answer buttons the round's board has. */
function choiceCount(round: Round): number {
  switch (round.kind) {
    case 'pick':
    case 'join':
      return round.options.length;
    case 'judge':
      return judgeChoices(round).length;
    case 'compare':
      return COMPARE_CHOICES.length;
    case 'cover':
      return round.choices.length;
  }
}

/** Every hint `check` gives for this round: with nothing chosen, and for each button. */
function hints(round: Round): readonly string[] {
  const answers: Answer[] = [null, ...Array.from({ length: choiceCount(round) }, (_, i) => i)];
  const out = new Set<string>();
  for (const a of answers) {
    const v = check(round, a);
    if (!v.ok && v.hint) out.add(v.hint);
  }
  return [...out];
}

/**
 * The words each board shows, in screen order: the join round's label over
 * Mia's quarters, the judge round's labels under its two dosas (worked, unfair
 * cut only), the answer words (judge and compare; the cut, cover and plate
 * buttons are pictures and numbers only), then the worked caption. The
 * children's names under the compare plates are left out: the answer buttons
 * under them say the same names with the same faces.
 */
function board(round: Round, _level: Level, stage: BoardProps<Round, Answer>['stage']): readonly string[] {
  const worked = stage === 'worked' ? [explain(round)] : [];
  switch (round.kind) {
    case 'pick':
    case 'cover':
      return worked;
    case 'judge': {
      const fair = stage === 'worked' && !cutDosa(round.cut).equal;
      return [...(fair ? fairCaptions(round) : []), ...judgeChoices(round), ...worked];
    }
    case 'compare':
      return [...COMPARE_CHOICES, ...worked];
    case 'join':
      return [MIAS_CAPTION, ...worked];
  }
}

function explain(round: Round): string {
  switch (round.kind) {
    case 'pick':
      return `${cap(WORD[round.n])} equal pieces of one dosa are ${PLURAL[round.n]}. Folded over a cut, each piece covers the next exactly.`;
    case 'judge': {
      const n = round.n;
      return cutDosa(round.cut).equal
        ? `The ${WORD[n]} pieces are the same size, so each is one ${UNIT[n]} of the dosa.`
        : `The ${WORD[n]} pieces are not the same size, so they are not ${PLURAL[n]}. ${cap(PLURAL[n])} must be equal.`;
    }
    case 'compare': {
      const { a, b } = round;
      if (a.small || b.small) return 'Half of the small dosa is less than a quarter of the big one. A half is half of its own dosa.';
      if (same(amount(a), amount(b))) return 'Two quarters cover exactly one half: 1/4 + 1/4 = 1/2.';
      if (a.k === a.n - 1 && b.k === b.n - 1 && a.k > 1 && b.k > 1) {
        // Each is one piece short of the whole: the smaller missing piece wins.
        const [more, less] = a.n > b.n ? [a, b] : [b, a];
        return `${cap(said(less))} is one ${UNIT[less.n as Parts]} short of the whole; ${said(more)} is one ${UNIT[more.n as Parts]} short. A ${UNIT[more.n as Parts]} is less than a ${UNIT[less.n as Parts]}, so ${said(more)} is more.`;
      }
      const [big, little] = (a.n < b.n ? [a.n, b.n] : [b.n, a.n]) as [Parts, Parts];
      return `A ${UNIT[big]} is 1 of ${big} equal pieces; a ${UNIT[little]} is 1 of ${little}. More pieces of one dosa means smaller pieces.`;
    }
    case 'cover':
      return round.target === 'half'
        ? 'Two quarters cover one half: 1/4 + 1/4 = 1/2.'
        : 'Three thirds make the whole dosa: 1/3 + 1/3 + 1/3 = 1.';
    case 'join':
      return 'Two quarters make one half: 1/4 + 1/4 = 1/2.';
  }
}

/* -------------------------------------------------------------- drawing -- */

const CRISP = '#e9b765';
const CRUST = '#8a5212';
const BROWNED = '#a8642a';
const GHOST = '#f8eedb';
const STEEL = '#dfe5ea';
const STEEL_RIM = '#8d99a3';
const BLUE = '#1c6dd0';
const BLUE_WASH = 'rgba(28, 109, 208, 0.2)';
const RED = '#c8372d';
const RED_WASH = 'rgba(200, 55, 45, 0.22)';
const INK = '#24170f';

/** Browned spots from the pan, as [x, y, r] on a dosa of radius 1. Fixed, so nothing shifts between stages. */
const SPOTS: readonly (readonly [number, number, number])[] = [
  [-0.52, -0.38, 0.08], [0.12, -0.62, 0.06], [0.58, -0.22, 0.07], [-0.18, -0.05, 0.05],
  [0.3, 0.28, 0.09], [-0.6, 0.3, 0.06], [-0.08, 0.66, 0.07], [0.66, 0.5, 0.05],
  [0.02, 0.25, 0.04], [-0.35, -0.72, 0.04], [0.42, -0.6, 0.04], [-0.82, -0.05, 0.04],
];

/** An SVG path for a polygon in dosa radii, centred at c and scaled by R pixels. */
function path(pts: readonly Pt[], c: Pt, R: number): string {
  return `${pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(c[0] + x * R).toFixed(1)} ${(c[1] + y * R).toFixed(1)}`).join(' ')} Z`;
}

/** A clipPath id that is safe inside url(#...). */
const useClip = () => `dosa${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

interface DosaProps {
  readonly c: Pt;
  /** Pixels per dosa radius. */
  readonly R: number;
  /** The pieces, in dosa radii. */
  readonly pieces: readonly (readonly Pt[])[];
  /** Which pieces are there; the rest are drawn as a pale dashed ghost. Default: all. */
  readonly solid?: readonly boolean[];
  /** Radius of the whole dosa, in dosa radii (0.5 for the small one). */
  readonly size?: number;
  /** Draw the whole dosa's outline behind the pieces. Off for a loose piece. */
  readonly whole?: boolean;
}

/** One dosa: the whole as a pale ghost, the pieces that are there golden, the cuts in brown. */
function Dosa({ c, R, pieces, solid, size = 1, whole = true }: DosaProps) {
  const clip = useClip();
  const on = (i: number) => solid?.[i] ?? true;
  return (
    <g>
      {whole ? <circle cx={c[0]} cy={c[1]} r={size * R} fill={GHOST} /> : null}
      <clipPath id={clip}>{pieces.map((p, i) => (on(i) ? <path key={i} d={path(p, c, R)} /> : null))}</clipPath>
      {pieces.map((p, i) => (on(i) ? <path key={i} d={path(p, c, R)} fill={CRISP} /> : null))}
      <g clipPath={`url(#${clip})`}>
        {SPOTS.map(([x, y, r], i) => (
          <ellipse key={i} cx={c[0] + x * size * R} cy={c[1] + y * size * R} rx={r * size * R * 1.3} ry={r * size * R} fill={BROWNED} opacity={0.5} />
        ))}
      </g>
      {pieces.map((p, i) => (
        <path
          key={i}
          d={path(p, c, R)}
          fill="none"
          stroke={CRUST}
          strokeWidth={on(i) ? 3 : 2}
          strokeDasharray={on(i) ? undefined : '7 6'}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

/** A steel plate from the kitchen shelf under a dosa. */
function Plate({ c, R }: { readonly c: Pt; readonly R: number }) {
  return (
    <g>
      <circle cx={c[0]} cy={c[1]} r={R * 1.14} fill={STEEL} stroke={STEEL_RIM} strokeWidth={3} />
      <circle cx={c[0]} cy={c[1]} r={R * 1.05} fill="none" stroke={STEEL_RIM} strokeWidth={1.5} />
    </g>
  );
}

/** A piece laid over the dosa as evidence: blue where it fits, red where it does not. */
function Overlay({ pts, c, R, red, dashed = true }: { readonly pts: readonly Pt[]; readonly c: Pt; readonly R: number; readonly red?: boolean; readonly dashed?: boolean }) {
  return (
    <path
      d={path(pts, c, R)}
      fill={red ? RED_WASH : BLUE_WASH}
      stroke={red ? RED : BLUE}
      strokeWidth={4}
      strokeDasharray={dashed ? '10 6' : undefined}
      strokeLinejoin="round"
    />
  );
}

/** A fraction written the proper way, one over n, at a point. */
function Frac({ at, n, size }: { readonly at: Pt; readonly n: number; readonly size: number }) {
  const [x, y] = at;
  return (
    <g fill={INK} fontWeight={700} fontSize={size} textAnchor="middle">
      <rect x={x - size * 0.55} y={y - size * 1.1} width={size * 1.1} height={size * 2.2} rx={size * 0.25} fill="rgba(255, 255, 255, 0.85)" />
      <text x={x} y={y - size * 0.15}>1</text>
      <line x1={x - size * 0.35} y1={y} x2={x + size * 0.35} y2={y} stroke={INK} strokeWidth={Math.max(2, size / 9)} />
      <text x={x} y={y + size * 0.85}>{n}</text>
    </g>
  );
}

/** A small number in a ring, for counting laid pieces in the worked answer. */
function Tag({ at, k, size }: { readonly at: Pt; readonly k: number; readonly size: number }) {
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={size * 0.7} fill="#ffffff" stroke={BLUE} strokeWidth={3} />
      <text x={at[0]} y={at[1] + size * 0.35} textAnchor="middle" fontSize={size} fontWeight={700} fill={INK}>
        {k}
      </text>
    </g>
  );
}

/** Where a piece's label goes, in pixels. */
const labelAt = (pts: readonly Pt[], c: Pt, R: number): Pt => {
  const [x, y] = centroid(pts);
  return [c[0] + x * R, c[1] + y * R];
};

/** A board picture. Inside a Choice it is hidden from screen readers: the Choice says it. */
function Svg({ w, h, width, label, children }: { readonly w: number; readonly h: number; readonly width: number; readonly label?: string; readonly children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: 'block', width, maxWidth: '100%', height: 'auto', margin: '0 auto' }}
    >
      {children}
    </svg>
  );
}

/** A dosa cut one way, on its plate, with the fold test, counted pieces or fractions on top. */
function CutView({ cut, c, R, fold, tags, fractions }: { readonly cut: Cut; readonly c: Pt; readonly R: number; readonly fold?: boolean; readonly tags?: boolean; readonly fractions?: boolean }) {
  const k = cutDosa(cut);
  return (
    <g>
      <Plate c={c} R={R} />
      <Dosa c={c} R={R} pieces={k.pieces} />
      {fold ? <Overlay pts={k.fold} c={c} R={R} /> : null}
      {tags ? k.pieces.map((p, i) => <Tag key={i} at={labelAt(p, c, R)} k={i + 1} size={R / 5} />) : null}
      {fractions ? k.pieces.map((p, i) => <Frac key={i} at={labelAt(p, c, R)} n={k.pieces.length} size={R / 4.4} />) : null}
    </g>
  );
}

/** A share on its own plate: its pieces solid, the rest of its dosa a dashed ghost. */
function ShareView({ s, c, R }: { readonly s: Share; readonly c: Pt; readonly R: number }) {
  const pieces = slices(s);
  const size = s.small ? SMALL : 1;
  return (
    <g>
      <Plate c={c} R={R * size} />
      <Dosa c={c} R={R} pieces={pieces} solid={pieces.map((_, i) => i < s.k)} size={size} />
    </g>
  );
}

/** 1/n on each piece of a share, drawn last so no overlay tints it. */
function ShareLabels({ s, c, R }: { readonly s: Share; readonly c: Pt; readonly R: number }) {
  if (s.n === 1) return null;
  return (
    <g>
      {slices(s)
        .slice(0, s.k)
        .map((p, i) => (
          <Frac key={i} at={labelAt(p, c, R)} n={s.n} size={(R / 4.6) * (s.small ? 0.7 : 1)} />
        ))}
    </g>
  );
}

const LETTER = ['A', 'B', 'C', 'D'] as const;

/** The view of a board one kind of round gets. */
type Sub<K extends Round['kind']> = Omit<BoardProps<Round, Answer>, 'round'> & { readonly round: Extract<Round, { kind: K }> };

/** Selected, marked and locked the same way on every board. */
function choose(i: number, right: number, { answer, setAnswer, stage }: Omit<Sub<Round['kind']>, 'round' | 'level'>) {
  const worked = stage === 'worked';
  return {
    selected: worked ? i === right : answer === i,
    onTap: () => setAnswer(i),
    disabled: stage === 'solved' || worked,
    mark: worked && i === right ? ('right' as const) : null,
  };
}

const Worked =({ round }: { readonly round: Round }) => <p className="board-caption">{explain(round)}</p>;

/** The label under a dosa, inside its picture. */
function Caption({ x, y, children }: { readonly x: number; readonly y: number; readonly children: ReactNode }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={26} fontWeight={700} fill={INK}>
      {children}
    </text>
  );
}

/** A drawn answer with its word kept small underneath, for a child who cannot read it yet. */
function Pic({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s1)' }}>
      {children}
      <span style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 }}>{label}</span>
    </span>
  );
}

const GOLD = '#f2a900';
const SKIN = '#c68a5c';
const HAIR = '#2b1a10';
/** Arjun's shirt, Mia's shirt: the same colours on the board and on the answer buttons. */
const SHIRT = ['#2a7f62', '#c2457f'] as const;

/** Arjun (short hair, green shirt) or Mia (two plaits, pink shirt), drawn in a 60 x 60 box at (x, y). */
function Kid({ who, x = 0, y = 0 }: { readonly who: 0 | 1; readonly x?: number; readonly y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {who === 1 ? (
        <g>
          <circle cx={13} cy={30} r={6.5} fill={HAIR} />
          <circle cx={47} cy={30} r={6.5} fill={HAIR} />
          <circle cx={13} cy={37} r={2.6} fill={SHIRT[1]} />
          <circle cx={47} cy={37} r={2.6} fill={SHIRT[1]} />
        </g>
      ) : null}
      <path d="M7 60 Q7 43 30 43 Q53 43 53 60 Z" fill={SHIRT[who]} stroke={INK} strokeWidth={2} />
      <circle cx={30} cy={27} r={15} fill={SKIN} stroke={INK} strokeWidth={2} />
      <path
        d={who === 0 ? 'M15 25 Q15 10 30 10 Q45 10 45 25 Q40 17 30 18 Q20 17 15 25 Z' : 'M15 28 Q14 10 30 10 Q46 10 45 28 Q43 19 36 17 Q29 22 21 18 Q16 21 15 28 Z'}
        fill={HAIR}
      />
      <circle cx={24.5} cy={28} r={1.9} fill={INK} />
      <circle cx={35.5} cy={28} r={1.9} fill={INK} />
      <path d="M25 34 Q30 38.5 35 34" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

/** Arjun = Mia: both children with an equals sign between them, 150 x 60. */
function BothKids() {
  return (
    <g>
      <Kid who={0} />
      <rect x={65} y={22} width={20} height={5} rx={2} fill={INK} />
      <rect x={65} y={33} width={20} height={5} rx={2} fill={INK} />
      <Kid who={1} x={90} />
    </g>
  );
}

/** A cut dosa's pieces pulled a little apart from the centre, so their sizes sit side by side. */
function Apart({ cut, c, R }: { readonly cut: Cut; readonly c: Pt; readonly R: number }) {
  const pieces = cutDosa(cut).pieces.map((p) => {
    const [x, y] = centroid(p);
    const g = 0.22 / Math.hypot(x, y);
    return p.map(([px, py]): Pt => [px + x * g, py + y * g]);
  });
  return <Dosa c={c} R={R} pieces={pieces} whole={false} />;
}

/** The answer pictures for a judge round: the same number of pieces, all equal or not. */
const UNEQUAL: Record<Parts, Cut> = { 2: strips([0.42]), 3: fan([160, 110, 90]), 4: fan([130, 60, 100, 70]) };

/** Where loose piece j of a 2 x 2 pile has its point, in pixels; the pile's top-left corner is `o`. */
function pileSpot(j: number, R: number, o: Pt, g: number): Pt {
  const half = 0.866 * R;
  return [o[0] + g / 2 + half + (j % 2) * (2 * half + g), o[1] + g / 2 + R + Math.floor(j / 2) * (R + g)];
}

/**
 * `count` loose 1/unit pieces in a 2 x 2 pile, top row first: 2 * (1.73R + g)
 * wide, 2 * (R + g) tall. `moved`: the pieces have been laid on the dosa, so
 * only their dashed outlines stay behind and nothing is counted twice.
 */
function Pile({ unit, count, R, o, g, fractions, moved }: { readonly unit: 3 | 4; readonly count: number; readonly R: number; readonly o: Pt; readonly g: number; readonly fractions?: boolean; readonly moved?: boolean }) {
  const piece = sector(360 - 180 / unit, 360 + 180 / unit);
  return (
    <g>
      {Array.from({ length: count }, (_, j) => {
        const at = pileSpot(j, R, o, g);
        return (
          <g key={j}>
            <Dosa c={at} R={R} pieces={[piece]} solid={[!moved]} whole={false} />
            {fractions ? <Frac at={labelAt(piece, at, R)} n={unit} size={R / 4.6} /> : null}
          </g>
        );
      })}
    </g>
  );
}

/** How many unit pieces the cover board lays down at this stage. */
function coverCount(round: Extract<Round, { kind: 'cover' }>, answer: Answer, stage: BoardProps<Round, Answer>['stage']): number {
  if (stage === 'worked') return needed(round);
  if (stage === 'hint') return answer === null ? 1 : round.choices[answer];
  return 0;
}

/** A laid piece runs over when the pieces so far add up to more than the share under them. */
const over = (j: number, unit: number, under: number) => (j + 1) / unit > under + 1e-9;

/** Mia's two quarters in the join round. */
const MIAS = share(4, 2, 0);

/* --------------------------------------------------------------- boards -- */

/** Choice pictures: a 240 box drawn 180 wide, so every dosa in a round is the same size. */
const BOX = 240;
const BOX_C: Pt = [BOX / 2, BOX / 2];
const BOX_R = 92;
const BOX_PX = 180;

function PickBoard(p: Sub<'pick'>) {
  const { round, answer, stage } = p;
  const right = correct(round);
  return (
    <div className="board board--dosa">
      <div className="choices">
        {round.options.map((cut, i) => {
          const count = cutDosa(cut).pieces.length;
          const looked = stage === 'hint' && (answer === null || answer === i);
          // A cut with the wrong count gets its pieces numbered, never the fold:
          // its pieces may be equal (quarters offered for thirds), and a fold
          // that fits would point him at it. Any other cut gets the fold.
          const tags = looked && count !== round.n;
          const worked = stage === 'worked' && i === right;
          return (
            <Choice key={i} {...choose(i, right, p)} ariaLabel={`Cut ${LETTER[i]}: ${WORD[count]} pieces`}>
              <Svg w={BOX} h={BOX} width={BOX_PX}>
                <CutView cut={cut} c={BOX_C} R={BOX_R} fold={(looked && !tags) || worked} tags={tags} fractions={worked} />
              </Svg>
            </Choice>
          );
        })}
      </div>
      {stage === 'worked' ? <Worked round={round} /> : null}
    </div>
  );
}

function JudgeBoard(p: Sub<'judge'>) {
  const { round, stage } = p;
  const right = correct(round);
  const { equal } = cutDosa(round.cut);
  const worked = stage === 'worked';
  // The worked answer for an unfair cut puts a fair one beside it, same size.
  const fair = worked && !equal;
  const w = fair ? 640 : 320;
  const [theirs, fairName] = fairCaptions(round);
  const [yes, no] = judgeChoices(round);
  return (
    <div className="board board--dosa">
      <Svg w={w} h={330} width={fair ? 560 : 280} label={`${CUTTER[round.n]}'s dosa, cut into ${WORD[round.n]} pieces.`}>
        <CutView cut={round.cut} c={[160, 150]} R={120} fold={stage === 'hint' || worked} fractions={worked && equal} />
        {fair ? (
          <>
            <Caption x={160} y={318}>{theirs}</Caption>
            <CutView cut={FAIR[round.n](round.cut.turn)} c={[480, 150]} R={120} fractions />
            <Caption x={480} y={318}>{fairName}</Caption>
          </>
        ) : null}
      </Svg>
      <div className="choices">
        <Choice {...choose(0, right, p)}>
          <Pic label={yes}>
            <Svg w={110} h={110} width={96}>
              <Apart cut={FAIR[round.n](0)} c={[55, 55]} R={38} />
            </Svg>
          </Pic>
        </Choice>
        <Choice {...choose(1, right, p)}>
          <Pic label={no}>
            <Svg w={110} h={110} width={96}>
              <Apart cut={UNEQUAL[round.n]} c={[55, 55]} R={38} />
            </Svg>
          </Pic>
        </Choice>
      </div>
      {worked ? <Worked round={round} /> : null}
    </div>
  );
}

function CompareBoard(p: Sub<'compare'>) {
  const { round, answer, stage } = p;
  const right = correct(round);
  const shares = [round.a, round.b] as const;
  const { from, onto } = laying(round);
  const C: readonly Pt[] = [[170, 160], [490, 160]];
  const R = 120;
  // The child he tapped gets a gold ring round their plate (both, for "the same").
  const ringed = stage === 'worked' ? right : answer;
  return (
    <div className="board board--dosa">
      <Svg w={660} h={390} width={600} label={`Arjun has ${said(round.a)}. Mia has ${said(round.b)}.`}>
        {shares.map((s, i) => (
          <ShareView key={i} s={s} c={C[i]} R={R} />
        ))}
        {shares.map((s, i) =>
          ringed === i || ringed === 2 ? (
            <circle key={i} cx={C[i][0]} cy={C[i][1]} r={R * (s.small ? SMALL : 1) * 1.14 + 9} fill="none" stroke={GOLD} strokeWidth={7} />
          ) : null,
        )}
        {shares.map((_, i) => (
          <g key={i}>
            <Kid who={i as 0 | 1} x={C[i][0] - 78} y={318} />
            <Caption x={C[i][0] + 28} y={360}>
              {WHO[i]}
            </Caption>
          </g>
        ))}
        {stage === 'hint' || stage === 'worked'
          ? layOn(shares[from], shares[onto]).map((pts, j) => <Overlay key={j} pts={pts} c={C[onto]} R={R} />)
          : null}
        {stage === 'worked' ? shares.map((s, i) => <ShareLabels key={i} s={s} c={C[i]} R={R} />) : null}
      </Svg>
      <div className="choices">
        <Choice {...choose(0, right, p)} ariaLabel="Arjun has more">
          <Pic label={COMPARE_CHOICES[0]}>
            <Svg w={60} h={60} width={72}>
              <Kid who={0} />
            </Svg>
          </Pic>
        </Choice>
        <Choice {...choose(1, right, p)} ariaLabel="Mia has more">
          <Pic label={COMPARE_CHOICES[1]}>
            <Svg w={60} h={60} width={72}>
              <Kid who={1} />
            </Svg>
          </Pic>
        </Choice>
        <Choice {...choose(2, right, p)} ariaLabel="The same">
          <Pic label={COMPARE_CHOICES[2]}>
            <Svg w={150} h={60} width={150}>
              <BothKids />
            </Svg>
          </Pic>
        </Choice>
      </div>
      {stage === 'worked' ? <Worked round={round} /> : null}
    </div>
  );
}

function CoverBoard(p: Sub<'cover'>) {
  const { round, answer, stage } = p;
  const right = correct(round);
  const half = round.target === 'half';
  // The half is the top half of the dosa; the pieces are laid from its left end, clockwise.
  const target = half ? share(2, 1, 270) : share(1, 1, 0);
  const from = half ? 270 : 0;
  const count = coverCount(round, answer, stage);
  // The pieces he has chosen sit loose beside the dosa, same scale, from his
  // first tap: one before he chooses, so "a quarter" is on the board before
  // any hint. The question is how many of THESE fill that.
  const loose = stage === 'worked' ? needed(round) : answer === null ? 1 : round.choices[answer];
  const c: Pt = [140, 152];
  const R = 110;
  const pile: Pt = [292, 30];
  return (
    <div className="board board--dosa">
      <Svg
        w={710}
        h={300}
        width={560}
        label={`${half ? 'Half of a dosa' : 'A whole dosa'} on a steel plate, and ${WORD[loose]} ${loose === 1 ? UNIT[round.unit] : PLURAL[round.unit]} of a dosa beside it.`}
      >
        <ShareView s={target} c={c} R={R} />
        <Pile unit={round.unit} count={loose} R={R} o={pile} g={14} fractions moved={count > 0} />
        {laid(round.unit, count, from).map((pts, j) => (
          <Overlay key={j} pts={pts} c={c} R={R} red={over(j, round.unit, amount(target))} />
        ))}
        {laid(round.unit, count, from).map((pts, j) => {
          // A piece laid past the whole dosa lands on an earlier one: the later tag
          // moves out toward the rim, the earlier one in toward the centre.
          const [x, y] = labelAt(pts, c, R);
          const out = j >= round.unit ? 1.55 : j < count - round.unit ? 0.6 : 1;
          return <Tag key={j} at={[c[0] + (x - c[0]) * out, c[1] + (y - c[1]) * out]} k={j + 1} size={22} />;
        })}
      </Svg>
      <div className="choices">
        {round.choices.map((n, i) => (
          <Choice key={n} {...choose(i, right, p)} ariaLabel={`${n} ${n === 1 ? UNIT[round.unit] : PLURAL[round.unit]}`}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s1)' }}>
              <Svg w={160} h={100} width={96}>
                <Pile unit={round.unit} count={n} R={40} o={[0, 0]} g={10} />
              </Svg>
              <span>{n}</span>
            </span>
          </Choice>
        ))}
      </div>
      {stage === 'worked' ? <Worked round={round} /> : null}
    </div>
  );
}

/** Mia beside her two quarters: two separate pieces, not yet put together, named underneath. */
function LooseQuarters() {
  const R = 100;
  const piece = [sector(315, 405)];
  return (
    <Svg w={420} h={170} width={340} label="Mia's two quarters of a dosa, side by side.">
      <g transform="translate(0 38) scale(1.5)">
        <Kid who={1} />
      </g>
      <Dosa c={[170, 115]} R={R} pieces={piece} whole={false} />
      <Dosa c={[330, 115]} R={R} pieces={piece} whole={false} />
      <Caption x={250} y={158}>{MIAS_CAPTION}</Caption>
    </Svg>
  );
}

function JoinBoard(p: Sub<'join'>) {
  const { round, answer, stage } = p;
  const right = correct(round);
  return (
    <div className="board board--dosa">
      <LooseQuarters />
      <div className="choices">
        {round.options.map((s, i) => {
          // Mia's quarters laid on a plate, from its first cut; any that run past its dosa are red.
          const show = (stage === 'hint' && (answer === null || answer === i)) || (stage === 'worked' && i === right);
          return (
            <Choice key={i} {...choose(i, right, p)} ariaLabel={`A plate with ${said(s)}`}>
              <Svg w={BOX} h={BOX} width={BOX_PX}>
                <ShareView s={s} c={BOX_C} R={BOX_R} />
                {show
                  ? layOn(MIAS, s).map((pts, j) => <Overlay key={j} pts={pts} c={BOX_C} R={BOX_R} red={over(j, 4, amount(s))} />)
                  : null}
                {stage === 'worked' && i === right ? <ShareLabels s={s} c={BOX_C} R={BOX_R} /> : null}
              </Svg>
            </Choice>
          );
        })}
      </div>
      {stage === 'worked' ? <Worked round={round} /> : null}
    </div>
  );
}

function Board(props: BoardProps<Round, Answer>) {
  const { round } = props;
  switch (round.kind) {
    case 'pick':
      return <PickBoard {...props} round={round} />;
    case 'judge':
      return <JudgeBoard {...props} round={round} />;
    case 'compare':
      return <CompareBoard {...props} round={round} />;
    case 'cover':
      return <CoverBoard {...props} round={round} />;
    case 'join':
      return <JoinBoard {...props} round={round} />;
  }
}

export const shareTheDosa: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'share-the-dosa',
  title: 'Share the Dosa',
  hook: 'Halves must be equal pieces.',
  group: 'groups',
  levels: ['Fair halves', 'Thirds and quarters', 'Which is more?'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  hints,
  explain,
  board,
  cover: 'art/games/share-the-dosa.png',
  note: {
    what: 'Dosas on steel plates, cut in different ways. He taps the cut that makes equal halves, thirds or quarters, says whether a given cut is fair, and at level 3 compares shares (a half with a quarter, two thirds with three quarters) and finds how many quarters cover a half.',
    expect: "At level 1 he will often pick any cut with two pieces, including one well off the middle — 'two pieces' is what half means to most 5-year-olds. At level 2 every wrong cut has the right number of pieces, so counting stops working. At level 3 many children say a quarter is more than a half because four is more than two; the small-dosa round catches the opposite rule, that a half always wins. On two thirds against three quarters, expect 'thirds are bigger pieces, so two thirds' — the hint shows the sliver of Mia's dosa that Arjun's pieces do not reach.",
    practising: 'Fractions as equal parts of one named whole: halves, thirds and quarters of a circle, unit fractions getting smaller as the number of parts grows, 1/4 + 1/4 = 1/2, and comparing two thirds with three quarters by the piece each is missing. Also the folding test for equal pieces.',
    ask: "When a cut's pieces are folded over in blue at the hint: 'Does the folded piece cover the other one, or is there a gap? So are they the same size?'",
    next: 'At breakfast, tear a plain round dosa into two pieces, unequal on purpose, and ask whether those are halves. Then fold a paper circle in half and in half again, open it, and lay two of the quarters over one half.',
    honest: 'Picking the fair cut on a round dosa does not show he understands fractions in general. Ask for half of a rectangle of paper, half of 8 grapes, and whether half of a small apple equals half of a big one.',
    easier: 'Stay on level 1 and cut a real paper circle along each choice before he answers, so he can fold the pieces himself.',
    harder: "Ask him to cut a paper circle into thirds himself, then prove the pieces are equal by stacking them. Then ask what one piece of six would be called.",
  },
};

export default shareTheDosa;
