import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Stepper } from '../../play/parts';

/**
 * What's Under the Cup? — maths game 3 (advisor catalogue).
 *
 * Concept (charter, maths 2): parts combine, and subtraction reverses
 * addition. The board is two fixed pictures of one woven mat. "Before" holds
 * every mango Dadi put down; "Now" holds the same mangoes after her brass cup
 * covers some. Nothing is taken away, so the whole and the visible part fix
 * the hidden part: 4 + ? = 6, which is 6 − 4.
 *
 * Levels:
 *  1. Wholes of 4 to 6, drawn in the Before row. He can still match one to one.
 *  2. Wholes of 7 to 10, drawn. Matching gets slow; counting on from the
 *     visible part starts to pay.
 *  3. Wholes of 13 to 28, given only as a numeral on a slate. The visible part
 *     sits in ten-frames, and EVERY round crosses a ten: through 10 (6 on the
 *     mat, 13 in all) or through 20 (16 on the mat, 22 in all). Counting on in
 *     ones gets long and slips; "16 and 4 is 20, and 2 more" does not.
 *
 * Control: the Stepper only — two big buttons set how many are under the cup.
 *
 * Hint: a strip appears under the scene. Top row, all of them; bottom row,
 * the mat's mangoes followed by his number as dashed mangoes, cell under
 * cell. A short row leaves bold empty squares; an overshoot spills past the
 * end of the top row into dashed squares. Worked: the cup lifts, the hidden
 * mangoes are ringed where it stood, the strip fits exactly, and both
 * equations are written out.
 *
 * No round hides zero mangoes: the empty answer is 0 and must be wrong.
 */

export interface Round {
  /** Every mango Dadi put down. */
  readonly whole: number;
  /** How many the cup covers. Always at least 1. */
  readonly hidden: number;
  /** How the whole is shown: drawn in the Before row, or as a numeral only. */
  readonly wholeAs: 'picture' | 'numeral';
}

/** How many he says are under the cup. */
export type Answer = number;

/** [whole, hidden] per level, walked by index. */
const TABLE: Record<Level, readonly (readonly [number, number])[]> = {
  1: [[6, 2], [5, 3], [6, 4], [4, 1], [5, 2], [6, 1], [4, 3]],
  2: [[8, 3], [10, 4], [9, 6], [7, 5], [10, 7], [8, 5], [9, 2]],
  // Mat part 6-19 (at most two ten-frames), hidden 6-9 (fits the cup's pile),
  // and the hidden part always crosses the next ten above the mat part.
  3: [[13, 7], [23, 8], [17, 9], [26, 9], [22, 6], [28, 9], [25, 7]],
};

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = ((index % 7) + 7) % 7;
  const [whole, hidden] = TABLE[level][k];
  return { whole, hidden, wholeAs: level === 3 ? 'numeral' : 'picture' };
}

/** The mangoes still on the mat. */
const outOf = (round: Round) => round.whole - round.hidden;

function prompt(round: Round): string {
  if (round.wholeAs === 'numeral') return `${round.whole} mangoes in all. How many are under the cup?`;
  return 'Nothing was taken away. How many mangoes are under the cup?';
}

/** A fact about the board: his two parts, their total, and the real whole. */
export function partsLine(round: Round, answer: Answer): string {
  const out = outOf(round);
  return `${out} on the mat and ${answer} under the cup make ${out + answer}. All of them: ${round.whole}.`;
}

function check(round: Round, answer: Answer): Verdict {
  if (answer === round.hidden) return { ok: true };
  return { ok: false, hint: partsLine(round, answer) };
}

function explain(round: Round): string {
  const out = outOf(round);
  return `${out} + ${round.hidden} = ${round.whole}, so ${round.whole} − ${out} = ${round.hidden}. The cup hid ${round.hidden}; none were taken away.`;
}

/* ------------------------------------------------------------ drawing --- */

const INK = '#24170F';
const SOFT = '#5A4636';
const RULE = '#C9AD86';
const BRASS = '#C9962B';
const BRASS_DARK = '#8A5A14';
const BRASS_LIGHT = '#EBC65E';
const MAT = '#E7C47E';
const MAT_EDGE = '#B8862B';
const MAT_WEAVE = '#D4A85A';
const ONES = '#27813B';
const TENS = '#1C6DD0';
const RING = '#F2A900';

const font = { fontFamily: 'var(--font-display)', fontWeight: 700 } as const;

/** One mango, about 47 x 35 at scale 1, centred on (0, 0): oblong, stem up, beak low left. */
const BODY = 'M-21 -4C-18 -14 -6 -18 6 -16C18 -14 24 -5 23 5C22 14 13 18 3 17C-5 16 -9 11 -15 12C-21 13 -24 5 -21 -4Z';
const LEAF = 'M-9 -16C-6 -25 4 -28 11 -25C5 -20 -3 -17 -9 -16Z';

/**
 * ripe: a mango on a mat. found: one the lifted cup uncovered, ringed.
 * guess: his number, dashed and empty. pale: "all of them", for comparison.
 */
type Look = 'ripe' | 'found' | 'guess' | 'pale';

function Mango({ x, y, s = 1, look = 'ripe' }: { x: number; y: number; s?: number; look?: Look }) {
  const real = look === 'ripe' || look === 'found';
  const fill = real ? '#F5A623' : look === 'guess' ? '#FFF1C9' : '#FBE6BE';
  const stroke = real ? INK : look === 'guess' ? BRASS_DARK : RULE;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {look === 'found' ? <circle r="27" fill="none" stroke={RING} strokeWidth="5" /> : null}
      <path d={BODY} fill={fill} stroke={stroke} strokeWidth="3" strokeDasharray={look === 'guess' ? '6 4' : undefined} />
      {real ? <ellipse cx="10" cy="-5" rx="9" ry="6" fill="#E4572E" opacity="0.45" /> : null}
      {real ? <path d={LEAF} fill="#2E8B3A" stroke={INK} strokeWidth="2" /> : null}
      {real ? <line x1="-9" y1="-16" x2="-11" y2="-21" stroke={INK} strokeWidth="2.5" strokeLinecap="round" /> : null}
    </g>
  );
}

/** A woven chatai mat. */
function Mat({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill={MAT} stroke={MAT_EDGE} strokeWidth="3" />
      {Array.from({ length: Math.floor((h - 16) / 18) }, (_, i) => (
        <line key={i} x1={x + 12} x2={x + w - 12} y1={y + 17 + i * 18} y2={y + 17 + i * 18} stroke={MAT_WEAVE} strokeWidth="2" />
      ))}
    </g>
  );
}

/**
 * Dadi's brass cup, mouth down, its mouth centred on (x, y). Lifted, it
 * hangs 140 above the mat, tipped, so what it covered shows underneath.
 */
function Cup({ x, y, lifted }: { x: number; y: number; lifted: boolean }) {
  const ty = lifted ? y - 140 : y;
  return (
    <g>
      {lifted ? null : <ellipse cx={x} cy={y + 4} rx="100" ry="9" fill="rgba(36,23,15,0.22)" />}
      <g transform={`translate(${x} ${ty})${lifted ? ' rotate(-10)' : ''}`}>
        <path d="M-90 0 L-62 -128 L62 -128 L90 0 Z" fill={BRASS} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <line x1="-79" y1="-48" x2="79" y2="-48" stroke={BRASS_DARK} strokeWidth="3" />
        <line x1="-71" y1="-88" x2="71" y2="-88" stroke={BRASS_DARK} strokeWidth="3" />
        <path d="M-64 -22 L-46 -108" stroke={BRASS_LIGHT} strokeWidth="10" strokeLinecap="round" />
        <rect x="-66" y="-138" width="132" height="12" rx="5" fill={BRASS_DARK} stroke={INK} strokeWidth="3" />
        <rect x="-95" y="-13" width="190" height="15" rx="6" fill={BRASS_DARK} stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** Mangoes in rows of five, centred on (cx, cy). Both mats use this, at one spacing. */
function Rows({ n, cx, cy }: { n: number; cx: number; cy: number }) {
  const rows = Math.ceil(n / 5);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / 5);
        const inRow = Math.min(5, n - row * 5);
        return <Mango key={i} x={cx + ((i % 5) - (inRow - 1) / 2) * 52} y={cy + (row - (rows - 1) / 2) * 70} s={1.1} />;
      })}
    </g>
  );
}

/**
 * The mangoes the cup covered, in at most two rows of five, inside a dashed
 * gold outline of where the cup's mouth stood.
 */
function Pile({ n, cx, floor }: { n: number; cx: number; floor: number }) {
  const cols = n <= 5 ? n : Math.ceil(n / 2);
  return (
    <g>
      <rect x={cx - 96} y={floor - 90} width="192" height="96" rx="14" fill="rgba(255,241,201,0.75)" stroke={RING}
        strokeWidth="4" strokeDasharray="10 6" />
      {Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / cols);
        const inRow = Math.min(cols, n - row * cols);
        return <Mango key={i} x={cx + ((i % cols) - (inRow - 1) / 2) * 36} y={floor - 22 - row * 38} s={0.78} />;
      })}
    </g>
  );
}

/** Ten-frames, stacked, holding n mangoes (level 3: the mat's part is shown as tens and ones). */
function Frames({ n, x, cy, cell }: { n: number; x: number; cy: number; cell: number }) {
  const frames = Math.max(1, Math.ceil(n / 10));
  const gap = 14;
  const top = cy - (frames * cell * 2 + (frames - 1) * gap) / 2;
  return (
    <g>
      {Array.from({ length: frames }, (_, f) => {
        const fy = top + f * (cell * 2 + gap);
        const here = Math.min(10, n - f * 10);
        return (
          <g key={f}>
            <rect x={x - 4} y={fy - 4} width={cell * 5 + 8} height={cell * 2 + 8} rx="6" fill="#FFFFFF"
              stroke={here === 10 ? TENS : ONES} strokeWidth="5" />
            {Array.from({ length: 10 }, (_, i) => {
              const cx = x + (i % 5) * cell;
              const cyy = fy + Math.floor(i / 5) * cell;
              return (
                <g key={i}>
                  <rect x={cx} y={cyy} width={cell} height={cell} fill="none" stroke={RULE} strokeWidth="1.5" />
                  {i < here ? <Mango x={cx + cell / 2} y={cyy + cell / 2 + 3} s={cell / 58} /> : null}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

/** A school slate (pati) with the whole written on it in chalk. */
function Slate({ n, cx, cy }: { n: number; cx: number; cy: number }) {
  return (
    <g>
      <rect x={cx - 120} y={cy - 95} width="240" height="190" rx="12" fill="#9C6A2E" stroke={INK} strokeWidth="3" />
      <rect x={cx - 104} y={cy - 79} width="208" height="158" rx="6" fill="#2F3B35" />
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize="104" fill="#F4F1E8" style={font}>{n}</text>
      <text x={cx} y={cy + 64} textAnchor="middle" fontSize="26" fill="#D9D4C4" style={font}>mangoes</text>
    </g>
  );
}

/* Scene geometry, in a 960 x 360 frame. */
const W = 960;
const H = 360;
const MAT_Y = 80;
const MAT_H = 250;
const MID_Y = MAT_Y + MAT_H / 2;
const LEFT = { x: 20, w: 290 } as const;
const RIGHT = { x: 370, w: 570 } as const;
const CUP_X = 800;
const FLOOR = 300;

/** Before and now, side by side, at one scale. */
function Scene({ round, lifted }: { round: Round; lifted: boolean }) {
  const out = outOf(round);
  const numeral = round.wholeAs === 'numeral';
  const before = numeral ? `The slate says ${round.whole} mangoes.` : `Before: ${round.whole} mangoes on the mat.`;
  const now = lifted
    ? `Now: ${out} on the mat, and the lifted cup shows ${round.hidden}.`
    : `Now: ${out} on the mat and an upside-down cup.`;
  return (
    <svg className="board-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${before} ${now}`}>
      <text x={LEFT.x + 10} y="56" fontSize="30" fill={SOFT} style={font}>{numeral ? 'All of them' : 'Before'}</text>
      <text x={RIGHT.x + 10} y="56" fontSize="30" fill={SOFT} style={font}>Now</text>
      {numeral ? (
        <Slate n={round.whole} cx={LEFT.x + LEFT.w / 2} cy={MID_Y} />
      ) : (
        <>
          <Mat x={LEFT.x} y={MAT_Y} w={LEFT.w} h={MAT_H} />
          <Rows n={round.whole} cx={LEFT.x + LEFT.w / 2} cy={MID_Y} />
        </>
      )}
      {/* Before, then now: an arrow a non-reader can follow. */}
      <path d={`M${LEFT.x + LEFT.w + 8} ${MID_Y} H${RIGHT.x - 18}`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${RIGHT.x - 24} ${MID_Y - 15} L${RIGHT.x - 6} ${MID_Y} L${RIGHT.x - 24} ${MID_Y + 15} Z`} fill={INK} />
      <Mat x={RIGHT.x} y={MAT_Y} w={RIGHT.w} h={MAT_H} />
      {numeral ? <Frames n={out} x={RIGHT.x + 40} cy={MID_Y} cell={46} /> : <Rows n={out} cx={RIGHT.x + 170} cy={MID_Y} />}
      {lifted ? <Pile n={round.hidden} cx={CUP_X} floor={FLOOR} /> : null}
      <Cup x={CUP_X} y={FLOOR} lifted={lifted} />
    </svg>
  );
}

/* The hint strip: "all of them" over "on the mat + under the cup", cell under cell. */
const STRIP_X = 20;
const STRIP_W = 920;
const GAP5 = 6;
const GAP10 = 12;
const extra = (i: number) => Math.floor(i / 5) * GAP5 + Math.floor(i / 10) * (GAP10 - GAP5);

/** One square of the strip: what sits in it, and how its edge is drawn. */
type Edge = 'plain' | 'short' | 'over';

function Cell({ i, y, cell, mango, edge }: { i: number; y: number; cell: number; mango: Look | null; edge: Edge }) {
  const x = STRIP_X + i * cell + extra(i);
  // An overshoot is drawn as squares with nothing above them, not in red:
  // red is the hundreds colour on every maths board, and a fact is not an alarm.
  const stroke = edge === 'plain' ? RULE : INK;
  return (
    <g>
      <rect x={x} y={y} width={cell} height={cell} rx="4" fill={edge === 'over' ? '#EFE6D8' : '#FFFFFF'} stroke={stroke}
        strokeWidth={edge === 'plain' ? 1.5 : 3} strokeDasharray={edge === 'over' ? '6 4' : undefined} />
      {mango ? <Mango x={x + cell / 2} y={y + cell / 2 + 3} s={cell / 60} look={mango} /> : null}
    </g>
  );
}

/**
 * Two rows on one grid. Top: the whole. Bottom: the mat's part, then his
 * number (dashed) or, worked, the hidden part (ringed). A short bottom row
 * leaves bold empty squares under the whole; a long one runs past its end.
 */
function Strip({ round, under, worked }: { round: Round; under: number; worked: boolean }) {
  const out = outOf(round);
  const made = out + under;
  const n = Math.max(round.whole, made);
  const cell = Math.min(44, Math.floor((STRIP_W - extra(n - 1)) / n));
  const y1 = 44;
  const y2 = y1 + cell + 50;
  const h = y2 + cell + 12;
  const label = `All of them: ${round.whole}. On the mat ${out}, under the cup ${under}: ${made}.`;
  return (
    <svg className="board-svg" viewBox={`0 0 ${W} ${h}`} role="img" aria-label={label} style={{ maxHeight: 200 }}>
      <text x={STRIP_X} y={y1 - 12} fontSize="24" fill={SOFT} style={font}>{`All of them: ${round.whole}`}</text>
      {Array.from({ length: round.whole }, (_, i) => (
        <Cell key={`w${i}`} i={i} y={y1} cell={cell} mango="pale" edge="plain" />
      ))}
      <text x={STRIP_X} y={y2 - 12} fontSize="24" fill={SOFT} style={font}>
        {`On the mat ${out} + under the cup ${under} = ${made}`}
      </text>
      {Array.from({ length: n }, (_, i) => {
        const mango: Look | null = i < out ? 'ripe' : i < made ? (worked ? 'found' : 'guess') : null;
        const edge: Edge = i >= round.whole ? 'over' : i >= made ? 'short' : 'plain';
        return <Cell key={`p${i}`} i={i} y={y2} cell={cell} mango={mango} edge={edge} />;
      })}
    </svg>
  );
}

/**
 * The worked sentence. A round whose hidden part crosses the next ten above
 * the mat part (level 3: 16, then 4 to make 20, then 2 more) is worked
 * through that ten; the others subtract.
 */
export function workedLine(round: Round): string {
  const out = outOf(round);
  const ten = (Math.floor(out / 10) + 1) * 10;
  if (out % 10 !== 0 && round.whole > ten) {
    const toTen = ten - out;
    const rest = round.whole - ten;
    return `${out} + ${toTen} = ${ten}, and ${ten} + ${rest} = ${round.whole}. So ${toTen} + ${rest} = ${round.hidden} are under the cup: ${round.whole} − ${out} = ${round.hidden}.`;
  }
  return `${out} + ${round.hidden} = ${round.whole}, so ${round.whole} − ${out} = ${round.hidden} are under the cup.`;
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const worked = stage === 'worked';
  const lifted = worked || stage === 'solved';
  const under = worked ? round.hidden : answer;
  return (
    <div className="board board--cup">
      <Scene round={round} lifted={lifted} />
      {stage === 'hint' || worked ? <Strip round={round} under={under} worked={worked} /> : null}
      {worked ? <p className="board-caption">{workedLine(round)}</p> : null}
      <div className="board-row">
        <svg viewBox="-100 -145 200 150" width="64" height="48" aria-hidden="true">
          <path d="M-90 0 L-62 -128 L62 -128 L90 0 Z" fill={BRASS} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
          <rect x="-95" y="-13" width="190" height="15" rx="6" fill={BRASS_DARK} stroke={INK} strokeWidth="6" />
        </svg>
        <span className="board-caption">Under the cup</span>
        <Stepper value={under} onChange={setAnswer} min={0} max={round.whole} label="Mangoes under the cup" disabled={lifted} />
      </div>
    </div>
  );
}

export const whatsUnderTheCup: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'whats-under-the-cup',
  title: "What's Under the Cup?",
  hook: "Dadi's brass cup hides some mangoes.",
  group: 'together',
  levels: ['Up to six', 'Up to ten', 'Up to thirty'],
  generate,
  prompt,
  emptyAnswer: () => 0,
  Board,
  check,
  explain,
  cover: 'art/games/whats-under-the-cup.png',
  note: {
    what: "Two pictures of the same mat. Before shows every mango Dadi put down; Now shows some of them and her brass cup turned over the rest. He sets how many are under the cup with the two big buttons.",
    expect: "At level 1 he will pair each mango in Before with one in Now and count the ones left without a partner. At level 2 the rows are long enough that pairing slips, and some children answer with the whole. At level 3 there is no Before picture, only a number on a slate, and every round crosses a ten (16 on the mat, 22 in all); counting on in ones from 16 to 22 is where he usually loses his place.",
    practising: "Part and whole: the mangoes on the mat plus the hidden ones make all of them, so the hidden part is the whole minus the part you can see. Subtraction as finding a missing part, not only taking away. At level 3, going through the next ten: 16 + 4 = 20, then 2 more.",
    ask: "Before he presses Check, point at the cup: 'Did Dadi take any mangoes away? Then where are the rest?'",
    next: "Count 7 dried beans onto a plate together, then cover some with a steel katori while he looks away. He says how many are hidden and lifts it to see. Then he hides and you answer, and he checks you.",
    honest: "Getting these right does not show he can do 9 − 4 or 4 + ? = 9 written on paper. After a round, write both forms down and ask which one the cup was.",
    easier: "Stay on level 1, and ask him to touch each mango in Before and find its partner in Now before he uses the buttons.",
    harder: "On level 3, ask for the number before he touches the buttons, and ask how he got from the ten-frames to the slate's number.",
    safety: "Dried beans are a choking hazard for his 2-year-old sister: do the katori game at a table she cannot reach and count the beans back into the tin.",
  },
};

export default whatsUnderTheCup;
