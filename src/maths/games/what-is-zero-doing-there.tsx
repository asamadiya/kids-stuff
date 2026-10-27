import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Tray } from '../../play/parts';

/**
 * What Is Zero Doing There? — zero as a placeholder.
 *
 * Concept (advisor, maths 6): zero marks an empty place. In 105 the 0 says
 * "no tens", and it is the 0 that keeps the 1 in the hundreds place. Leave it
 * out and the same blocks read 15. The misconception it challenges: zero is
 * "nothing", so it can be skipped, or it needs a block of its own.
 *
 * The board is a place-value mat in the fixed Montessori colours: red
 * hundreds, blue tens, green ones. Each place holds 0 to 9 blocks, so a
 * built mat has exactly one way to be written down.
 *
 * Levels:
 *  1. Tens and ones, with 0 ones (30, 50, 20 ...). The digits stand over
 *     their columns, so the 0 sits plainly over an empty ones place.
 *  2. Hundreds, tens and ones, with 0 tens (105, 204, 307 ...). The hole is
 *     in the middle now: he fills both sides and leaves the middle empty.
 *  3. Read the digits and build. The number is no longer split over the
 *     columns, and a built neighbour sits above it for comparison: 13 beside
 *     103, 103 beside 130, 20 beside 200. This is where "103" gets built as
 *     13. The two-zero rounds (200, 600) sit at k = 2 and 5, the tens-zero
 *     rounds at 0 and 4, the ones-zero rounds at 1, 3 and 6: no category
 *     sits in two adjacent slots of the cycle of seven, so any five in a row
 *     (the shell's serial does not restart at 0) holds all three.
 *
 * Control: tap-to-add/remove only. Tapping a block in the tray puts one on
 * its place; tapping a block on the mat takes it off.
 */

export interface Round {
  /** The number he builds. Always has at least one 0 that must be written. */
  readonly target: number;
  /** Columns on the mat: 2 = tens and ones, 3 = hundreds, tens and ones. */
  readonly places: 2 | 3;
  /** The target's digits stand over their columns from the start. */
  readonly aligned: boolean;
  /** Level 3: an already-built number to compare with. */
  readonly ref?: number;
}

/** How many blocks are on each place of the mat. */
export interface Answer {
  readonly h: number;
  readonly t: number;
  readonly o: number;
}

type Place = 'h' | 't' | 'o';

type Stage = BoardProps<Round, Answer>['stage'];

interface PlaceInfo {
  readonly key: Place;
  readonly name: string;
  readonly unit: string;
  readonly hue: 'hundreds' | 'tens' | 'ones';
  readonly value: number;
}

const PLACES: readonly PlaceInfo[] = [
  { key: 'h', name: 'hundreds', unit: 'hundred', hue: 'hundreds', value: 100 },
  { key: 't', name: 'tens', unit: 'ten', hue: 'tens', value: 10 },
  { key: 'o', name: 'ones', unit: 'one', hue: 'ones', value: 1 },
];

/** A place holds nine at most; ten would need a bundle, which is another game. */
const MAX = 9;

export const split = (n: number): Answer => ({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 });
const valueOf = (a: Answer) => a.h * 100 + a.t * 10 + a.o;
const placesOf = (round: Round): readonly PlaceInfo[] => (round.places === 3 ? PLACES : PLACES.slice(1));

/**
 * The digit a place shows when n is written down. A leading empty place is
 * not written at all (13, never 013); an empty place after the first digit
 * is written 0. That difference is the whole game.
 */
export function written(n: number, p: PlaceInfo): string {
  if (p.key !== 'o' && n < p.value) return '';
  return String(split(n)[p.key]);
}

/** The places whose written digit is 0 — the zeros that do a job. */
const zeroPlaces = (n: number) => PLACES.filter((p) => written(n, p) === '0');

const count = (k: number, p: PlaceInfo) => `${k} ${k === 1 ? p.unit : p.name}`;

const join = (xs: readonly string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** "1 hundred, 0 tens and 5 ones" — only the places the number is written with. */
export function describe(n: number): string {
  return join(PLACES.filter((p) => written(n, p) !== '').map((p) => count(split(n)[p.key], p)));
}

/** The same digits with the zeros dropped: what the number would say without them. */
const withoutZeros = (n: number) => Number(String(n).replace(/0/g, ''));

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = index % 7;
  if (level === 1) {
    return { target: [30, 50, 20, 70, 40, 60, 90][k], places: 2, aligned: true };
  }
  if (level === 2) {
    return { target: [105, 204, 307, 102, 406, 208, 301][k], places: 3, aligned: true };
  }
  // [built neighbour, number to build]: the zero appears, moves, or doubles.
  const [ref, target] = [
    [13, 103], [103, 130], [20, 200], [405, 450], [31, 301], [6, 600], [506, 560],
  ][k];
  return { target, places: 3, aligned: false, ref };
}

/** Level 3's line over the built neighbour, and the start of its prompt. */
const thisIs = (n: number) => `This is ${n}.`;

function prompt(round: Round): string {
  return round.ref === undefined ? `Build ${round.target} on the mat.` : `${thisIs(round.ref)} Build ${round.target}.`;
}

/** The highest place where the mat and the target disagree. */
const firstMismatch = (round: Round, answer: Answer) => {
  const want = split(round.target);
  return placesOf(round).find((p) => answer[p.key] !== want[p.key]);
};

const EMPTY_MAT = 'The mat is empty.';

/** A hint's first sentence: what the blocks on the mat add up to. */
const lead = (made: number) => (made === 0 ? EMPTY_MAT : `The blocks make ${made}.`);

/** A hint's second sentence: one place, in the number and on the mat. */
const compare = (target: number, p: PlaceInfo, k: number) => `${target} has ${count(split(target)[p.key], p)}; the mat has ${count(k, p)}.`;

/**
 * A miss names one place, the highest one that differs: a fact about the
 * mat, not the whole decomposition. For 105 built as 150 that is the tens.
 */
function check(round: Round, answer: Answer): Verdict {
  const made = valueOf(answer);
  if (made === round.target) return { ok: true };
  const p = firstMismatch(round, answer) as PlaceInfo;
  return { ok: false, hint: `${lead(made)} ${compare(round.target, p, answer[p.key])}` };
}

/**
 * Read-aloud: every hint sentence `check` can give for this round, split as
 * the shell splits it. The second sentence names the highest place that
 * differs and its count on the mat, 0 to MAX, any of which the tray can make:
 * finite, so all of them are listed. The first is "The mat is empty." or
 * "The blocks make N." with N up to 999; the board draws N at 'hint' ("The
 * blocks on the mat make N:" over the mat's digits), so only the empty-mat
 * sentence is listed and the number sentence is left to the board.
 */
function hints(round: Round): readonly string[] {
  const want = split(round.target);
  const counts = Array.from({ length: MAX + 1 }, (_, k) => k);
  return [EMPTY_MAT, ...placesOf(round).flatMap((p) => counts.filter((k) => k !== want[p.key]).map((k) => compare(round.target, p, k)))];
}

/** "The 0 marks the empty tens place" / "The 0s mark the empty tens and ones places". */
function marks(n: number): string {
  const zeros = zeroPlaces(n);
  const many = zeros.length > 1;
  return `The ${many ? '0s mark' : '0 marks'} the empty ${join(zeros.map((p) => p.name))} ${many ? 'places' : 'place'}`;
}

/**
 * Levels 1-2: what the 0 marks, what it keeps in place, and what the digits
 * would say without it. Level 3: both numbers by place, side by side.
 * Every branch stays under thirty words at its longest (560 beside 506).
 */
function explain(round: Round): string {
  const { target, ref } = round;
  if (ref !== undefined) return `${target} is ${describe(target)}. ${ref} is ${describe(ref)}. ${marks(target)} in ${target}.`;
  const zeros = zeroPlaces(target);
  const above = PLACES[PLACES.indexOf(zeros[0]) - 1];
  const it = zeros.length > 1 ? 'them' : 'it';
  return `${target} is ${describe(target)}. ${marks(target)}, keeping the ${split(target)[above.key]} in the ${above.name} place. Without ${it}, the digits say ${withoutZeros(target)}.`;
}

// ------------------------------------------------------------------ drawing --

/** Place-value colours, the same as --hundreds/--tens/--ones in tokens.css. */
const HUE: Record<Place, string> = { h: '#c8372d', t: '#1c6dd0', o: '#27813b' };
/** A pale ground for each column, and a dark ink for text on it (≥ 4.5:1). */
const TINT: Record<Place, string> = { h: '#fbe4e0', t: '#e2eefc', o: '#e1f2e4' };
const DEEP: Record<Place, string> = { h: '#8f2219', t: '#0f4790', o: '#1a5c2a' };

/** The dark line every drawn block is outlined in. */
const LINE = '#24170f';

const TICKS = [6, 10, 14, 18, 22, 26, 30, 34, 38];

/** One block, in a 44-unit box: a small cube, a rod of ten, a flat of a hundred. */
function Glyph({ place, fill, stroke }: { readonly place: Place; readonly fill: string; readonly stroke: string }) {
  if (place === 'o') return <rect x="13" y="13" width="18" height="18" rx="2" fill={fill} stroke={stroke} strokeWidth="3" />;
  if (place === 't') {
    return (
      <g>
        <rect x="16" y="2" width="12" height="40" rx="1.5" fill={fill} stroke={stroke} strokeWidth="2.5" />
        {TICKS.map((y) => (
          <line key={y} x1="16" x2="28" y1={y} y2={y} stroke={stroke} strokeWidth="1.2" />
        ))}
      </g>
    );
  }
  return (
    <g>
      <rect x="2" y="2" width="40" height="40" rx="1.5" fill={fill} stroke={stroke} strokeWidth="2.5" />
      {TICKS.map((v) => (
        <g key={v}>
          <line x1="2" x2="42" y1={v} y2={v} stroke={stroke} strokeWidth="0.9" />
          <line x1={v} x2={v} y1="2" y2="42" stroke={stroke} strokeWidth="0.9" />
        </g>
      ))}
    </g>
  );
}

function BlockIcon({ place }: { readonly place: Place }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <Glyph place={place} fill="none" stroke="currentColor" />
    </svg>
  );
}

/** A tray button's face: a plus, the block it adds, and its value small underneath. */
function AddIcon({ p }: { readonly p: PlaceInfo }) {
  return (
    <span style={{ display: 'grid', justifyItems: 'center', gap: 2 }}>
      <svg viewBox="0 0 60 44" style={{ width: 60, height: 44 }} aria-hidden="true">
        <path d="M2 22 H14 M8 16 V28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <g transform="translate(16 0)">
          <Glyph place={p.key} fill="none" stroke="currentColor" />
        </g>
      </svg>
      <span style={{ fontSize: 'var(--t-sm)' }}>{p.value}</span>
    </span>
  );
}

/** A column's name as a picture: its block in its colour, the word small underneath. */
function Heading({ p }: { readonly p: PlaceInfo }) {
  return (
    <span style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s1)', color: DEEP[p.key] }}>
      <svg viewBox="0 0 44 44" style={{ width: 44, height: 44 }} aria-hidden="true">
        <Glyph place={p.key} fill={HUE[p.key]} stroke={LINE} />
      </svg>
      <span style={{ fontWeight: 700, fontSize: 'var(--t-sm)' }}>{p.name}</span>
    </span>
  );
}

/** The label on an empty place: "no tens". */
const none = (p: PlaceInfo) => `no ${p.name}`;

/** The places of n with no blocks, leading ones included (13 has no hundreds). */
const emptyPlaces = (n: number, places: readonly PlaceInfo[]) => places.filter((p) => split(n)[p.key] === 0);

/**
 * Does the arrow to the 0 stand in place p, holding k blocks? After Check, in
 * an empty place the target writes as 0, unless that place is flagged.
 */
const pointsAt = (round: Round, p: PlaceInfo, k: number, stage: Stage, flags?: ReadonlySet<Place>) =>
  k === 0 && stage !== 'answering' && written(round.target, p) === '0' && !flags?.has(p.key);

/**
 * In an empty place after Check: an arrow from the emptiness up to the 0
 * written over it. No outline of a missing block — zero does not get a block.
 */
function PointsTo0({ p }: { readonly p: PlaceInfo }) {
  return (
    <span role="img" aria-label={`No ${p.name}: the 0 above marks this place`} style={{ alignSelf: 'center', display: 'grid', justifyItems: 'center', gap: 'var(--s1)', color: DEEP[p.key] }}>
      <svg viewBox="0 0 32 64" style={{ width: 32, height: 64 }} aria-hidden="true">
        <line x1="16" y1="60" x2="16" y2="8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M4 20 L16 5 L28 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: 'var(--t-xs)' }}>{none(p)}</span>
    </span>
  );
}

/**
 * A digit in a box, standing over its column. An empty string is a place the
 * number does not write at all (the hundreds of 13): a dashed, blank box.
 * `flag` marks a column where the mat and the number disagree; `ring` circles
 * a 0 that is doing its job.
 */
function Digit({ d, place, flag, ring }: { readonly d: string; readonly place: Place; readonly flag?: boolean; readonly ring?: boolean }) {
  const style: CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    justifySelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 14,
    border: `3px ${d === '' ? 'dashed' : 'solid'} ${flag ? 'var(--ink)' : DEEP[place]}`,
    background: flag ? 'var(--gold-tint)' : 'var(--raised)',
    outline: ring ? '5px solid var(--gold)' : undefined,
    outlineOffset: 3,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 1,
    color: DEEP[place],
  };
  return <span style={style}>{d}</span>;
}

const grid = (n: number): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
  gap: 'var(--s3)',
  alignItems: 'start',
});

/** One number written over the place columns, right-aligned by place. */
function DigitRow({ n, places, flags, ring, label }: {
  readonly n: number;
  readonly places: readonly PlaceInfo[];
  readonly flags?: ReadonlySet<Place>;
  readonly ring?: boolean;
  readonly label: string;
}) {
  return (
    <div style={grid(places.length)} role="img" aria-label={label}>
      {places.map((p) => {
        const d = written(n, p);
        return <Digit key={p.key} d={d} place={p.key} flag={flags?.has(p.key)} ring={ring && d === '0'} />;
      })}
    </div>
  );
}

/** A fixed picture of k blocks of one place, five to a row: the built neighbour. */
function Stack({ k, place }: { readonly k: number; readonly place: Place }) {
  if (k === 0) return null;
  const rows = Math.ceil(k / 5);
  const w = Math.min(k, 5) * 30;
  return (
    <svg viewBox={`0 0 ${w} ${rows * 30}`} width={w} height={rows * 30} aria-hidden="true" style={{ justifySelf: 'center' }}>
      {Array.from({ length: k }, (_, i) => (
        <g key={i} transform={`translate(${(i % 5) * 30} ${Math.floor(i / 5) * 30}) scale(0.68)`}>
          <Glyph place={place} fill={HUE[place]} stroke={LINE} />
        </g>
      ))}
    </svg>
  );
}

const caption = (text: string) => <p className="board-caption" style={{ margin: 0 }}>{text}</p>;

/** Places where the mat and the target disagree. */
function mismatches(round: Round, answer: Answer): ReadonlySet<Place> {
  const want = split(round.target);
  return new Set(placesOf(round).filter((p) => answer[p.key] !== want[p.key]).map((p) => p.key));
}

/** Level 3: the neighbour, already built and written, for comparison. */
function Neighbour({ n, places }: { readonly n: number; readonly places: readonly PlaceInfo[] }) {
  const k = split(n);
  const gaps = emptyPlaces(n, places);
  return (
    <section
      aria-label={`This is ${n}: ${describe(n)}.`}
      style={{ display: 'grid', gap: 'var(--s2)', padding: 'var(--s3)', borderRadius: 'var(--radius-sm)', background: 'var(--paper-2)', border: '2px solid var(--rule-strong)' }}
    >
      {caption(thisIs(n))}
      <DigitRow n={n} places={places} label={`${n} written in places`} />
      <div style={grid(places.length)} aria-hidden="true">
        {places.map((p) => {
          const empty = gaps.includes(p);
          return (
            <div
              key={p.key}
              style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: 52,
                padding: 'var(--s2)',
                borderRadius: 'var(--radius-sm)',
                background: TINT[p.key],
                border: `2px ${empty ? 'dashed' : 'solid'} ${DEEP[p.key]}`,
              }}
            >
              {empty ? <span style={{ color: DEEP[p.key], fontWeight: 600, fontSize: 'var(--t-xs)' }}>{none(p)}</span> : <Stack k={k[p.key]} place={p.key} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const places = placesOf(round);
  const locked = stage === 'solved' || stage === 'worked';
  const worked = stage === 'worked';
  // The worked answer is drawn ON the mat: exactly the blocks the number names.
  const shown = worked ? split(round.target) : answer;
  const made = valueOf(answer);
  const flags = stage === 'hint' ? mismatches(round, answer) : undefined;
  const showDigits = round.aligned || stage !== 'answering';
  const ringZeros = stage === 'worked' || stage === 'solved';

  const add = (p: Place) => setAnswer({ ...answer, [p]: answer[p] + 1 });
  const remove = (p: Place) => setAnswer({ ...answer, [p]: answer[p] - 1 });

  return (
    <div className="board board--zero">
      {round.ref !== undefined ? <Neighbour n={round.ref} places={places} /> : null}

      <div style={grid(places.length)} aria-hidden="true">
        {places.map((p) => (
          <Heading key={p.key} p={p} />
        ))}
      </div>

      {showDigits ? (
        <DigitRow
          n={round.target}
          places={places}
          flags={flags}
          ring={ringZeros}
          label={`${round.target} written in places: ${describe(round.target)}`}
        />
      ) : (
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <span
            role="img"
            aria-label={`Build ${round.target}`}
            style={{ padding: 'var(--s2) var(--s5)', borderRadius: 14, border: '3px solid var(--ink)', background: 'var(--raised)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, lineHeight: 1.1, letterSpacing: '0.08em' }}
          >
            {round.target}
          </span>
        </div>
      )}

      {stage === 'hint' ? (
        <>
          {caption(`The blocks on the mat make ${made}:`)}
          <DigitRow n={made} places={places} flags={flags} label={`The mat: ${made}`} />
        </>
      ) : null}

      <div style={grid(places.length)}>
        {places.map((p) => {
          const k = shown[p.key];
          return (
            <div
              key={p.key}
              role="group"
              aria-label={`${p.name} place: ${count(k, p)}`}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'flex-start',
                justifyContent: 'center',
                gap: 'var(--s2)',
                minHeight: 168,
                padding: 'var(--s3)',
                borderRadius: 'var(--radius-sm)',
                background: TINT[p.key],
                border: `3px solid ${flags?.has(p.key) ? 'var(--ink)' : DEEP[p.key]}`,
              }}
            >
              {Array.from({ length: k }, (_, i) => (
                <Piece
                  key={i}
                  hue={p.hue}
                  tone={worked ? 'worked' : 'placed'}
                  onTap={locked ? undefined : () => remove(p.key)}
                  ariaLabel={worked ? `${p.unit} block` : `Take a ${p.unit} off`}
                >
                  <BlockIcon place={p.key} />
                </Piece>
              ))}
              {pointsAt(round, p, k, stage, flags) ? <PointsTo0 p={p} /> : null}
            </div>
          );
        })}
      </div>

      <Tray label="Blocks">
        {places.map((p) => {
          const full = answer[p.key] >= MAX;
          return (
            <Piece
              key={p.key}
              hue={p.hue}
              tone={full ? 'ghost' : 'source'}
              onTap={locked || full ? undefined : () => add(p.key)}
              ariaLabel={full ? `The ${p.name} place holds ${MAX} at most` : `Put a ${p.unit} on the mat`}
            >
              <AddIcon p={p} />
            </Piece>
          );
        })}
      </Tray>
    </div>
  );
}

/**
 * Read-aloud: the board's words a non-reader needs, in screen order. Level 3:
 * the line over the built neighbour and the label on each of its empty
 * places. On 'worked' and 'solved': the label under each arrow to a 0. The mat
 * then holds exactly the target's blocks (drawn on 'worked'; the only answer
 * that solves), so the arrows depend on the round alone. On 'hint' the arrows
 * and "The blocks on the mat make N:" follow his blocks, and the column names,
 * digits, tray label and block values are left to the picture.
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  const places = placesOf(round);
  const neighbour = round.ref === undefined ? [] : [thisIs(round.ref), ...emptyPlaces(round.ref, places).map(none)];
  if (stage !== 'worked' && stage !== 'solved') return neighbour;
  const built = split(round.target);
  return [...neighbour, ...places.filter((p) => pointsAt(round, p, built[p.key], stage)).map(none)];
}

export const whatIsZeroDoingThere: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'what-is-zero-doing-there',
  title: 'What Is Zero Doing There?',
  hook: 'Build numbers with an empty place.',
  group: 'numbers',
  levels: ['Tens, no ones', 'Hundreds, no tens', 'Read and build'],
  generate,
  prompt,
  emptyAnswer: () => ({ h: 0, t: 0, o: 0 }),
  Board,
  board,
  check,
  hints,
  explain,
  cover: 'art/games/what-is-zero-doing-there.png',
  note: {
    what: 'A place-value mat with hundreds, tens and ones columns. He taps blocks in the tray to build numbers such as 30, 105 and 600, where a place stays empty and is written 0. At level 3 a built neighbour (13 beside 103) sits above for comparison.',
    expect: "At levels 1 and 2 the digits stand over their columns, so he can succeed by matching each digit to the blocks under it before he knows why. Level 3 is where it usually breaks: with the digits off the columns, he reads 103 as 'one, oh, three', passes over the 0 and builds 13.",
    practising: 'Zero as a placeholder: an empty place is still written, and its 0 keeps every other digit in its place. Also reading three-digit numbers and building them from hundreds, tens and ones.',
    ask: "When a 0 stands over an empty column: 'There are no blocks there. Why do we still write something?'",
    next: 'Bundle ice-cream sticks in tens with rubber bands, and ten bundles into a hundred. Lay out 13, then 103, on three paper columns and ask what the 0 changed.',
    honest: "Building 105 here does not mean he can write it from hearing it: many children who build it correctly still write 'one hundred and five' as 1005. Say numbers aloud and have him write them on paper.",
    easier: "Stay on level 1 and say each number in tens as he builds it: 'fifty is five tens and no ones.'",
    harder: 'On level 3, before he taps anything, ask him to say how many hundreds, tens and ones the number has, and which place is empty.',
  },
};

export default whatIsZeroDoingThere;
