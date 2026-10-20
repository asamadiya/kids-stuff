import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Where Does That Number Go? — maths game 13 (advisor catalogue).
 *
 * Concept: a number's place on a line is its distance from 0 in equal jumps.
 * 7 sits most of the way to 10; 14 sits past the middle of 0 to 20; a 15
 * stone three jumps out makes every jump 5. The line is drawn as a road with
 * Indian kilometre stones (white body, yellow cap). A few stones are planted;
 * one waits beside the road, and he taps the arrow under its spot.
 *
 * Every line has eleven ticks, so every tick is a full-size target at every
 * level. What changes is what one jump is worth:
 *  1. 0 to 10, a jump is 1. Stones at 0 and 10, sometimes 5. The classic
 *     error is counting the 0 tick as "one" and landing one short.
 *  2. 0 to 20, a jump is 2. Stones at 0 and 20, sometimes 10. Counting ticks
 *     as ones breaks here: 14 read as "four past 10" lands on 18.
 *  3. A jump is 5 or 10, and nothing says which. Only two stones: 0 and one
 *     stone inside the road (15 three ticks out, 30 three ticks out), so he
 *     must work out a jump from them before he can place anything. Targets
 *     sit past the inner stone or back towards 0. A 0-to-100 road with stones
 *     at 0 and 100 was only a 0-to-10 road with a zero written on every
 *     number; inferring the unit is the stretch a bright 7-year-old needs.
 *
 * Every number is also beads, so a numeral never stands alone for an amount.
 * The road is beaded from 0 as far as the last planted stone, one bead per
 * unit, red and white in fives like a rekenrek: a stone's number is the beads
 * from 0 up to it, and a jump's worth is the beads inside it, shown rather
 * than stated. Beside the waiting stone lie its own beads in rows of five,
 * two rows to a tray of ten, coloured the same way: 7 is a red five and two
 * white, 14 a tray of ten and four red, matched against the road by counting.
 * At level 3 the beads stop at the inner stone, so a jump's worth is visible
 * on the known stretch and he must carry it on past the beads himself; the
 * trays group by tens whatever the jump, so they do not give the jump away.
 *
 * Control: tap-to-choose only — one Choice under each tick. The stone he is
 * placing stands beside the road with its number on it, so the task reads
 * from the board without the prompt. A tap lights that tick on the road in
 * the selected arrow's gold, and plants a trial stone there if it is empty.
 * Hint: the jumps from 0 to the tick he has chosen, each marked with what it
 * is worth; the sentence names that tick's number.
 * Worked: the jumps from the nearest stone to the right tick, each landing
 * numbered, and the missing stone planted.
 */

export interface Round {
  /** The line runs from 0 to `end`, always ten jumps. */
  readonly end: 10 | 20 | 50 | 100;
  /** What one jump between neighbouring ticks is worth. */
  readonly step: 1 | 2 | 5 | 10;
  /** Values that already have a stone, ascending. Always includes 0. */
  readonly labels: readonly number[];
  /** The missing stone. A multiple of `step`, never one of `labels`. */
  readonly target: number;
}

/** The index of the tick he tapped (0 is the left end), or nothing yet. */
export type Answer = number | null;

const L1_TARGETS = [7, 3, 8, 2, 6, 5, 4] as const;
const L2_TARGETS = [14, 6, 18, 4, 12, 16, 8] as const;
// [step, inner stone, target]. The inner stone is the only clue to the jump:
// 15 and 30 both stand three ticks out, so the tick alone says nothing.
const L3_ROUNDS: ReadonlyArray<readonly [5 | 10, number, number]> = [
  [5, 15, 35],
  [10, 30, 80],
  [5, 25, 40],
  [10, 40, 20],
  [5, 20, 45],
  [10, 60, 90],
  [5, 35, 10],
];

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = index % 7;
  if (level === 1) {
    return { end: 10, step: 1, labels: k % 3 === 0 ? [0, 5, 10] : [0, 10], target: L1_TARGETS[k] };
  }
  if (level === 2) {
    return { end: 20, step: 2, labels: k % 2 === 0 ? [0, 10, 20] : [0, 20], target: L2_TARGETS[k] };
  }
  const [step, inner, target] = L3_ROUNDS[k];
  return { end: step === 5 ? 50 : 100, step, labels: [0, inner], target };
}

export const tickCount = (r: Round) => r.end / r.step + 1;

const range = (a: number, b: number) => Array.from({ length: b - a }, (_, i) => a + i);

/** Level 3: the far end has no stone, so nothing says what a jump is worth. */
const unitHidden = (r: Round) => !r.labels.includes(r.end);

/** The planted stone nearest the target; on a tie, the lower one. */
export function landmark(r: Round): number {
  return r.labels.reduce((best, v) => (Math.abs(v - r.target) < Math.abs(best - r.target) ? v : best));
}

/**
 * Where the worked answer starts (a tick) and every tick it lands on. With
 * the far end planted a jump is already known, so it counts on or back from
 * the nearest stone. At level 3 it counts from 0 past both the inner stone
 * and the target: landing on the inner stone is what proves the jump's size.
 */
export function workedPath(r: Round): { readonly from: number; readonly ticks: readonly number[] } {
  const to = r.target / r.step;
  if (unitHidden(r)) return { from: 0, ticks: range(1, Math.max(to, r.labels[r.labels.length - 1] / r.step) + 1) };
  const from = landmark(r) / r.step;
  const dir = to > from ? 1 : -1;
  const ticks: number[] = [];
  for (let i = from + dir; i !== to + dir; i += dir) ticks.push(i);
  return { from, ticks };
}

export function workedLine(r: Round): string {
  const { from, ticks } = workedPath(r);
  const values = ticks.map((i) => i * r.step).join(', ');
  if (unitHidden(r)) return `Jumps of ${r.step} from 0: ${values}.`;
  const stone = from * r.step;
  return stone < r.target ? `From the ${stone} stone: ${values}.` : `Back from the ${stone} stone: ${values}.`;
}

function prompt(round: Round): string {
  return `Where does the ${round.target} stone go? Tap the arrow under its spot.`;
}

/**
 * A fact about the tick he checked: what it is, measured in jumps from 0.
 * "The spot you checked", not "that spot": the board's jumps follow his next
 * tap, so the sentence must still name the one it was about. "Spot" and
 * "arrow", never "tick": in Indian English a tick is a check mark, and the
 * drawn ticks on the road are not what he taps.
 */
export function hintFor(r: Round, tick: Answer): string {
  if (tick === null) return `No spot is chosen yet. Each jump on this road is ${r.step}.`;
  const v = tick * r.step;
  if (r.labels.includes(v)) return `The spot you checked already has the ${v} stone.`;
  return r.step === 1
    ? `The spot you checked is ${v} jumps from 0.`
    : `The spot you checked is ${v}: ${tick} jumps of ${r.step} from 0.`;
}

function check(round: Round, answer: Answer): Verdict {
  if (answer !== null && answer * round.step === round.target) return { ok: true };
  return { ok: false, hint: hintFor(round, answer) };
}

/**
 * Restated against stones he can see. Levels 1-2: 0 and the far end. Level 3:
 * how the inner stone fixes the jump, then the target in those jumps.
 */
function explain(r: Round): string {
  const k = r.target / r.step;
  const far = r.labels[r.labels.length - 1];
  if (unitHidden(r)) {
    return `${far} is ${far / r.step} jumps from 0, so one jump is ${r.step}. ${r.target} is ${k} jumps of ${r.step}.`;
  }
  const gap = Math.abs(far - r.target) / r.step;
  const jumps = r.step === 1 ? `${k} jumps` : `${k} jumps of ${r.step}`;
  const rest = `${gap} ${gap === 1 ? 'jump' : 'jumps'} ${far > r.target ? 'back from' : 'past'} ${far}`;
  return `${r.target} is ${jumps} from 0, and ${rest}.`;
}

/* ------------------------------------------------------------- drawing -- */

// Eleven ticks in eleven equal columns: tick i sits at the centre of column i,
// so the Choice row under the picture lines up with the ticks at any width.
const COL = 90;
const W = COL * 11;
const LINE_Y = 100;
const tickX = (i: number) => COL / 2 + COL * i;

const INK = '#24170f';
const INK_SOFT = '#5a4636';
const ROAD = '#dcc49b';
const CAP = '#f2b705';
const HINT = '#1c6dd0';
const WORKED = '#27813b';
const GOLD = '#f2a900';
const BEAD_RED = '#d2462f';
const BEAD_WHITE = '#fffaf0';

/** Rekenrek colouring, the same on the road and in the trays: 1-5 red, 6-10 white, 11-15 red... */
const beadFill = (k: number) => (Math.floor((k - 1) / 5) % 2 === 0 ? BEAD_RED : BEAD_WHITE);

/**
 * Bead size, spacing inside one jump, and height on the road. Every bead stays
 * clear of the ticks, the stones' feet and the jump arcs under the road.
 */
const BEADS: Record<Round['step'], { readonly r: number; readonly pitch: number; readonly y: number }> = {
  1: { r: 11, pitch: 0, y: LINE_Y },
  2: { r: 8, pitch: 32, y: LINE_Y + 2 },
  5: { r: 6, pitch: 16, y: LINE_Y + 1 },
  10: { r: 5.5, pitch: 13, y: LINE_Y },
};

/**
 * One bead per unit along the road, from 0 to `upTo`, each jump holding
 * `step` beads: the jump's worth is counted, not read. Jumps of 1, 2 and 5
 * thread one row; a jump of 10 is five over five, the same tray of ten the
 * waiting stone's beads come in, so one jump matches one tray by eye.
 */
function RoadBeads({ step, upTo }: { step: Round['step']; upTo: number }) {
  const { r, pitch, y } = BEADS[step];
  const perRow = Math.min(step, 5);
  const at = (k: number): readonly [number, number] => {
    const jump = Math.floor((k - 1) / step);
    const m = (k - 1) % step;
    const x = tickX(jump) + COL / 2 + ((m % perRow) - (perRow - 1) / 2) * pitch;
    return [x, m < perRow ? y : y + 12];
  };
  return (
    <g>
      {range(1, upTo + 1).map((k) => {
        const [cx, cy] = at(k);
        return <circle key={k} cx={cx} cy={cy} r={r} fill={beadFill(k)} stroke={INK} strokeWidth="2" />;
      })}
    </g>
  );
}

/** An Indian highway kilometre stone: yellow cap, white body, number painted on. */
function Stone({ x, value, look }: { x: number; value: number; look: 'planted' | 'ghost' | 'placed' }) {
  const top = LINE_Y - 86;
  const base = LINE_Y - 8;
  const body = `M${x - 28} ${base} V${top + 28} A28 28 0 0 1 ${x + 28} ${top + 28} V${base} Z`;
  const cap = `M${x - 28} ${top + 32} V${top + 28} A28 28 0 0 1 ${x + 28} ${top + 28} V${top + 32} Z`;
  const ghost = look === 'ghost';
  return (
    <g>
      {look === 'placed' ? <circle cx={x} cy={top + 44} r="46" fill="none" stroke={WORKED} strokeWidth="5" /> : null}
      <path d={body} fill={ghost ? 'rgba(255,255,255,0.6)' : '#ffffff'} stroke={ghost ? INK_SOFT : INK} strokeWidth="3" strokeDasharray={ghost ? '7 6' : undefined} />
      {ghost ? null : <path d={cap} fill={CAP} stroke={INK} strokeWidth="3" />}
      <text x={x} y={base - 14} textAnchor="middle" fontSize={value >= 100 ? 22 : 26} fontWeight="700" fill={ghost ? INK_SOFT : INK} fontFamily="Fredoka, sans-serif">
        {value}
      </text>
    </g>
  );
}

/** One jump between neighbouring ticks, drawn under the road. */
function Jump({ from, to, colour, label }: { from: number; to: number; colour: string; label?: string }) {
  const x1 = tickX(from);
  const x2 = tickX(to);
  return (
    <g>
      <path d={`M${x1} ${LINE_Y + 14} Q${(x1 + x2) / 2} ${LINE_Y + 70} ${x2} ${LINE_Y + 14}`} fill="none" stroke={colour} strokeWidth="4" />
      {label ? (
        <text x={(x1 + x2) / 2} y={LINE_Y + 66} textAnchor="middle" fontSize="20" fontWeight="700" fill={colour} fontFamily="Fredoka, sans-serif">
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** A number written under its tick, below the jumps. */
function Under({ tick, value, colour }: { tick: number; value: number; colour: string }) {
  return (
    <text x={tickX(tick)} y={LINE_Y + 112} textAnchor="middle" fontSize="28" fontWeight="700" fill={colour} fontFamily="Fredoka, sans-serif">
      {value}
    </text>
  );
}

/** The road, the ticks and the stones: everything but the tap targets. */
function Line({ round, answer, stage }: Pick<BoardProps<Round, Answer>, 'round' | 'answer' | 'stage'>) {
  const n = tickCount(round);
  const targetTick = round.target / round.step;
  const worked = stage === 'worked';
  const solved = stage === 'solved';
  const showHint = stage === 'hint';
  // In the hint the jumps run from 0 to the tick he has chosen, each marked
  // with its worth; with no tick (or the 0 tick), one jump shows that worth.
  // They follow his choice, so after Help-then-Check they still sit on the
  // tick the hint sentence names. No total is printed: a number that followed
  // every tap would let him read ticks off until one matched, a lookup rather
  // than a count in jumps.
  const hintTo = showHint ? (answer === null || answer === 0 ? 1 : answer) : 0;
  const path = worked ? workedPath(round) : { from: 0, ticks: [] as readonly number[] };
  const chosen = !worked && !solved ? answer : null;
  const ghostAt = chosen !== null && !round.labels.includes(chosen * round.step) ? chosen : null;
  // Beads run to the last planted stone. In the hint they run on under every
  // hinted jump, so each "+5" has its five beads; once the answer is out they
  // run on to the new stone, so its number stays on the road as beads.
  const lastStone = round.labels[round.labels.length - 1];
  const beadEnd = Math.max(lastStone, hintTo * round.step, worked || solved ? round.target : 0);

  const label = [
    `A road from 0 with ${n} ticks, one jump apart.`,
    `Stones at ${round.labels.join(' and ')}.`,
    `${beadEnd} beads along the road from 0, ${round.step} in each jump.`,
    chosen !== null ? `Tick ${chosen + 1} from the left is lit.` : '',
    ghostAt !== null ? `The ${round.target} stone is tried at tick ${ghostAt + 1} from the left.` : '',
    worked || solved ? `The ${round.target} stone stands at tick ${targetTick + 1} from the left.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${W} 232`} role="img" aria-label={label} style={{ display: 'block', width: '100%', height: 'auto' }}>
      {chosen !== null ? (
        <rect x={tickX(chosen) - 16} y="4" width="32" height="228" rx="16" fill={GOLD} opacity="0.4" />
      ) : null}
      <rect x={tickX(0) - 36} y={LINE_Y - 7} width={tickX(n - 1) - tickX(0) + 72} height="14" rx="7" fill={ROAD} stroke={INK} strokeWidth="3" />
      {range(0, n).map((i) => (
        <line key={i} x1={tickX(i)} x2={tickX(i)} y1={LINE_Y - (i === 5 ? 20 : 13)} y2={LINE_Y + (i === 5 ? 20 : 13)} stroke={INK} strokeWidth={i === 5 ? 5 : 4} strokeLinecap="round" />
      ))}
      <RoadBeads step={round.step} upTo={beadEnd} />

      {showHint
        ? range(0, hintTo).map((i) => <Jump key={`h${i}`} from={i} to={i + 1} colour={HINT} label={`+${round.step}`} />)
        : null}

      {path.ticks.map((to, j) => {
        const prev = j === 0 ? path.from : path.ticks[j - 1];
        return <Jump key={`w${to}`} from={prev} to={to} colour={WORKED} label={`${to > prev ? '+' : '−'}${round.step}`} />;
      })}
      {path.ticks.map((to) => (
        <Under key={`u${to}`} tick={to} value={to * round.step} colour={WORKED} />
      ))}

      {round.labels.map((v) => (
        <Stone key={v} x={tickX(v / round.step)} value={v} look="planted" />
      ))}
      {ghostAt !== null ? <Stone x={tickX(ghostAt)} value={round.target} look="ghost" /> : null}
      {worked || solved ? <Stone x={tickX(targetTick)} value={round.target} look="placed" /> : null}
    </svg>
  );
}

/** An arrow pointing up at the spot above it: the word the prompt uses. */
const Pointer = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path d="M12 2 L22 13 H15.5 V22 H8.5 V13 H2 Z" fill={INK_SOFT} />
  </svg>
);

/**
 * The stone he is placing, waiting beside the road: the task without words.
 * Once it stands on the road (tried, worked or solved) its spot here is
 * empty, so there is never a second copy to read as a second answer.
 */
function Waiting({ value, out }: { value: number; out: boolean }) {
  return (
    <svg viewBox="-4 6 88 92" width="88" height="92" role="img" aria-label={out ? `The ${value} stone is on the road.` : `The ${value} stone, waiting to be planted.`}>
      {out ? null : <Stone x={40} value={value} look="planted" />}
    </svg>
  );
}

/**
 * The waiting stone's number as beads, in trays of ten: five over five,
 * coloured like the road so a tray matches ten road beads by eye. The last
 * tray shows its empty holes, so 7 reads as "three short of a full tray".
 */
function BeadTrays({ value }: { value: number }) {
  const trays = Math.ceil(value / 10);
  return (
    <div role="img" aria-label={`${value} beads, in trays of ten.`} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 5 * 86 }}>
      {range(0, trays).map((t) => (
        <svg key={t} viewBox="0 0 78 36" width="78" height="36" aria-hidden="true">
          <rect x="1.5" y="1.5" width="75" height="33" rx="7" fill="#e9d3a8" stroke={INK_SOFT} strokeWidth="3" />
          {range(0, 10).map((m) => {
            const k = t * 10 + m + 1;
            const cx = 11 + 14 * (m % 5);
            const cy = m < 5 ? 11.5 : 24.5;
            return k <= value ? (
              <circle key={m} cx={cx} cy={cy} r="6" fill={beadFill(k)} stroke={INK} strokeWidth="2" />
            ) : (
              <circle key={m} cx={cx} cy={cy} r="4" fill="none" stroke={INK_SOFT} strokeWidth="1.5" strokeDasharray="3 2" />
            );
          })}
        </svg>
      ))}
    </div>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const n = tickCount(round);
  const targetTick = round.target / round.step;
  const locked = stage === 'worked' || stage === 'solved';
  // The tap row shares the picture's eleven columns. Eleven 64px targets do
  // not fit a portrait tablet, so the row narrows play.css's --tap to 56px
  // (the advisor's floor, tokens --tap-sm) and drops the choice padding; on
  // anything narrower than 668px the whole line scrolls sideways rather than
  // shrink a target below 56.
  const row: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
    ['--tap' as string]: '56px',
    ['--s3' as string]: '4px',
    ['--s4' as string]: '0px',
  };
  return (
    <div className="board board--number-line">
      <div className="board-row" style={{ justifyContent: 'flex-start' }}>
        <Waiting value={round.target} out={locked || (answer !== null && !round.labels.includes(answer * round.step))} />
        <BeadTrays value={round.target} />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 668, background: '#fffdf7', border: '2px solid var(--rule)', borderRadius: 14, paddingBottom: 8 }}>
          <Line round={round} answer={answer} stage={stage} />
          <div style={row} role="group" aria-label="Ticks">
            {range(0, n).map((i) => (
              <div key={i} style={{ display: 'grid', padding: '0 2px' }}>
                <Choice
                  selected={!locked && answer === i}
                  onTap={() => setAnswer(answer === i ? null : i)}
                  ariaLabel={`Spot ${i + 1} from the left`}
                  mark={locked && i === targetTick ? 'right' : null}
                  disabled={locked}
                >
                  <Pointer />
                </Choice>
              </div>
            ))}
          </div>
        </div>
      </div>
      {stage === 'worked' ? <p className="board-caption">{workedLine(round)}</p> : null}
    </div>
  );
}

export const whereDoesThatNumberGo: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'where-does-that-number-go',
  title: 'Where Does That Number Go?',
  hook: 'Plant the missing road stone.',
  group: 'numbers',
  levels: ['Zero to ten', 'Zero to twenty', 'Work out the jump'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/where-does-that-number-go.png',
  note: {
    what: "A road drawn as a number line, with eleven evenly spaced ticks and a few numbered road stones already planted. One stone waits beside the road with its number laid out in beads, trays of ten; he taps the tick where it belongs. The road is beaded too, one bead per unit, so a jump's worth can be counted. Level 1 runs 0 to 10, level 2 runs 0 to 20, and level 3 shows only 0 and one stone partway along.",
    expect: "At level 1 he will count ticks from the left, and the usual slip is counting the 0 tick as 'one', landing one short. At level 2 a jump is worth 2; counting four ticks on from the 10 stone puts 14 at the 18 tick. At level 3 he will likely read every jump as 10 out of habit; the 15 stone three ticks from 0 says a jump is 5, and it breaks when he does not test his guess against that stone.",
    practising: "Number-line magnitude: a number's position is its distance from 0 in equal jumps, so 7 is most of the way to 10 and 20 is halfway to 40. Also counting on and back from a landmark, skip counting by 2s, 5s and 10s, and working out a unit from one known point.",
    ask: "Before he taps, point at the middle tick and ask: 'What number lives here? Is yours before it or after it?'",
    next: "On a walk, chalk a line on the pavement with 0 at one end and 10 at the other, ten heel-to-toe steps apart. Call a number and have him stand where it goes, then walk the steps from 0 to check.",
    honest: "Tapping the right tick shows he can place a number on a line with ticks already drawn. It does not show he can place one on a blank line, where he must judge the distance himself. Draw a bare line with only 0 and 100 and ask where 30 goes.",
    easier: "Stay on level 1 and count the jumps aloud together from the 0 stone, touching each tick as you go.",
    harder: "On level 3, before he taps, ask him what one jump is worth on this road, how the inner stone tells him, and what number the last tick would be.",
  },
};

export default whereDoesThatNumberGo;
