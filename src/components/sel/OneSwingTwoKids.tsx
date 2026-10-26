import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  CHOICES, LISTEN, ONE_SWING_TWO_KIDS_META, SCENARIOS,
  addPlayed, choiceLabel, choose, coverageText, framesOf, isSettled, pathText, pictureOf,
  plateLines, replyOf, scenarioById, storyLine, trayLine,
} from '../../sel/one-swing-two-kids';
import type { ChoiceId, Scenario, Thing, Who } from '../../sel/one-swing-two-kids';
import { drawer } from '../../lib/drawer';
import type { Kept } from '../../lib/drawer';
import { pluck, step } from '../../lib/tone';
import { exportPlate, printPlate } from '../../lib/plate';
import { ReadAloud } from '../../audio/ReadAloud';
import { useStopOnInteraction } from '../../audio/useStopOnInteraction';

interface KeptRound extends Kept {
  readonly scenario: string;
  readonly tried: readonly ChoiceId[];
}
/* Version 2: rounds kept by the old bargaining version held a split, not a path. */
const shelf = drawer<KeptRound>('one-swing-two-kids', 2);

const BASE = import.meta.env.BASE_URL;

/* Paper, ink and hairlines. Colour says who is who; it never decorates. */
const PAPER = '#f4f0e6';
const RAISED = '#fbf9f4';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TERRA = '#9e4b27';
const OCHRE = '#8a6416';
const TEAL = '#2a5957';
const SANS = 'Inter, sans-serif';

const PICTURE = { width: '100%', maxWidth: '20rem', height: 'auto', border: `1px solid ${RULE}` } as const;
const THUMB = { display: 'block', width: '6rem', height: 'auto', border: `1px solid ${RULE}` } as const;

/* One plan is two frames and an arrow; the grown-up is one wide frame. */
const PLAN_W = 316;
const PLAN_H = 150;
const FRAME_W = 140;
const GAP = PLAN_W - FRAME_W * 2;
const GROUND = 96;

const colourOf = (who: Who): string => (who === 'you' ? TEAL : TERRA);

/** How tall a plan is drawn: only the take-turns plan needs room for its dots and its loop. */
const planHeight = (s: Scenario, c: ChoiceId): number =>
  c !== 'grown-up' && framesOf(s, c).loops ? PLAN_H : GROUND + 22;

/* ------------------------------------------------------------------ figures */

type Pose = 'stand' | 'hold' | 'sit' | 'arms-out';

/**
 * A child or a grown-up, drawn as a few strokes. `y` is the ground for a
 * standing figure and the seat for a sitting one. Size 1 is a five-year-old.
 */
function Person(props: { x: number; y: number; size: number; colour: string; pose: Pose }) {
  const { x, y, size: k, colour, pose } = props;
  const sw = 1.6;
  const seat = pose === 'sit';
  const hip = seat ? y : y - 14 * k;
  const top = hip - 24 * k;
  const r = 7 * k;
  const arms =
    pose === 'hold'
      ? [`M${x - 8 * k} ${top + 4 * k}L${x - 3 * k} ${top + 13 * k}`, `M${x + 8 * k} ${top + 4 * k}L${x + 3 * k} ${top + 13 * k}`]
      : pose === 'sit'
        ? [`M${x - 8 * k} ${top + 4 * k}L${x - 12 * k} ${top - 6 * k}`, `M${x + 8 * k} ${top + 4 * k}L${x + 12 * k} ${top - 6 * k}`]
        : pose === 'arms-out'
          ? [`M${x - 8 * k} ${top + 4 * k}L${x - 24 * k} ${top + 14 * k}`, `M${x + 8 * k} ${top + 4 * k}L${x + 24 * k} ${top + 14 * k}`]
          : [`M${x - 8 * k} ${top + 4 * k}L${x - 11 * k} ${top + 18 * k}`, `M${x + 8 * k} ${top + 4 * k}L${x + 11 * k} ${top + 18 * k}`];
  const legs = seat
    ? [`M${x - 3 * k} ${y}H${x + 9 * k}V${y + 12 * k}`]
    : [`M${x - 4 * k} ${hip}L${x - 5 * k} ${y}`, `M${x + 4 * k} ${hip}L${x + 5 * k} ${y}`];
  return (
    <g stroke={colour} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {[...arms, ...legs].map((d) => <path key={d} d={d} fill="none" />)}
      <rect x={x - 8 * k} y={top} width={16 * k} height={24 * k} rx={6 * k} fill={colour} fillOpacity={0.18} />
      <circle cx={x} cy={top - r - 1.5} r={r} fill={RAISED} />
    </g>
  );
}

/** The thing, in the hands of a standing child whose hands meet at (x, y). */
function Held({ thing, x, y }: { thing: Thing; x: number; y: number }) {
  if (thing === 'controller') {
    return (
      <g stroke={INK} strokeWidth={1.4}>
        <rect x={x - 9} y={y - 4} width={18} height={9} rx={4} fill={RAISED} />
        <circle cx={x - 4} cy={y} r={1.2} fill={INK} />
        <circle cx={x + 4} cy={y} r={1.2} fill={INK} />
      </g>
    );
  }
  if (thing === 'tablet') {
    return <rect x={x - 7} y={y - 10} width={14} height={18} rx={2} fill={INK} fillOpacity={0.75} stroke={INK} strokeWidth={1.4} />;
  }
  return (
    <g stroke={INK} strokeWidth={1.4}>
      <rect x={x - 9} y={y - 6} width={18} height={13} fill={RAISED} />
      <path d={`M${x - 9} ${y - 6}l3 -5h12l3 5`} fill="none" />
    </g>
  );
}

const Name = ({ x, children }: { x: number; children: string }) => (
  <text x={x} y={GROUND + 15} textAnchor="middle" fontFamily={SANS} fontSize={12} fill={FAINT}>{children}</text>
);

/** One frame of a plan: `has` has the thing, the other one waits. */
function Frame({ s, has }: { s: Scenario; has: Who }) {
  const waits: Who = has === 'you' ? 'them' : 'you';
  const sizeOf = (w: Who): number => (w === 'them' && s.little ? 0.72 : 1);
  const nameOf = (w: Who): string => (w === 'you' ? 'you' : s.other);
  const ground = <path d={`M0 ${GROUND}H${FRAME_W}`} stroke={RULE} strokeWidth={1} />;

  if (s.thing === 'swing') {
    return (
      <g>
        {ground}
        <g stroke={INK} strokeWidth={1.6} strokeLinecap="round" fill="none">
          <path d={`M16 12H92M16 12L8 ${GROUND}M16 12L24 ${GROUND}M92 12L84 ${GROUND}M92 12L100 ${GROUND}`} />
          <path d="M42 12V60M66 12V60" strokeWidth={1} />
          <path d="M36 60H72" strokeWidth={3} />
        </g>
        <Person x={54} y={60} size={sizeOf(has)} colour={colourOf(has)} pose="sit" />
        <Person x={122} y={GROUND} size={sizeOf(waits)} colour={colourOf(waits)} pose="stand" />
        <Name x={54}>{nameOf(has)}</Name>
        <Name x={122}>{nameOf(waits)}</Name>
      </g>
    );
  }

  if (s.thing === 'seat') {
    return (
      <g>
        <rect x={4} y={34} width={FRAME_W - 8} height={46} rx={10} fill="none" stroke={RULE} strokeWidth={1.2} />
        <rect x={10} y={8} width={46} height={26} rx={5} fill={RAISED} stroke={INK} strokeWidth={1.4} />
        <path d="M10 21H56" stroke={RULE} strokeWidth={1} />
        <path d={`M4 80H${FRAME_W - 4}`} stroke={INK} strokeWidth={1.6} />
        <Person x={34} y={80} size={sizeOf(has)} colour={colourOf(has)} pose="stand" />
        <Person x={98} y={80} size={sizeOf(waits)} colour={colourOf(waits)} pose="stand" />
        <Name x={34}>{nameOf(has)}</Name>
        <Name x={98}>{nameOf(waits)}</Name>
      </g>
    );
  }

  const hx = 52;
  const k = sizeOf(has);
  return (
    <g>
      {ground}
      {s.thing === 'controller' && (
        <g stroke={INK} strokeWidth={1.4} fill="none">
          <rect x={4} y={34} width={26} height={18} rx={2} />
          <path d={`M17 52V${GROUND}`} />
        </g>
      )}
      {s.thing === 'crackers' && <path d={`M4 70H30M8 70V${GROUND}M26 70V${GROUND}`} stroke={INK} strokeWidth={1.4} fill="none" />}
      <Person x={hx} y={GROUND} size={k} colour={colourOf(has)} pose="hold" />
      <Held thing={s.thing} x={hx} y={GROUND - 14 * k - 11 * k} />
      <Person x={114} y={GROUND} size={sizeOf(waits)} colour={colourOf(waits)} pose="stand" />
      <Name x={hx}>{nameOf(has)}</Name>
      <Name x={114}>{nameOf(waits)}</Name>
    </g>
  );
}

/** A plan, drawn: who has the thing first, who next, and whether it goes round. */
function PlanArt({ s, choice }: { s: Scenario; choice: ChoiceId }) {
  if (choice === 'grown-up') {
    const mid = PLAN_W / 2;
    return (
      <g>
        <path d={`M0 ${GROUND}H${PLAN_W}`} stroke={RULE} strokeWidth={1} />
        <Person x={mid} y={GROUND} size={1.45} colour={OCHRE} pose="arms-out" />
        <Person x={mid - 62} y={GROUND} size={1} colour={TEAL} pose="stand" />
        <Person x={mid + 62} y={GROUND} size={s.little ? 0.72 : 1} colour={TERRA} pose="stand" />
        <Name x={mid - 62}>you</Name>
        <Name x={mid}>{s.grownUp}</Name>
        <Name x={mid + 62}>{s.other}</Name>
      </g>
    );
  }
  const plan = framesOf(s, choice);
  const centre = (i: number): number => i * (FRAME_W + GAP) + FRAME_W / 2;
  const dotsY = GROUND + 30;
  return (
    <g>
      {plan.frames.map((who, i) => (
        <g key={`${who}-${i}`} transform={`translate(${i * (FRAME_W + GAP)} 0)`}>
          <Frame s={s} has={who} />
        </g>
      ))}
      <g stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${FRAME_W + 6} 52H${FRAME_W + GAP - 6}`} />
        <path d={`M${FRAME_W + GAP - 12} 46L${FRAME_W + GAP - 6} 52L${FRAME_W + GAP - 12} 58`} />
      </g>
      {/* one dot per unit of a turn, under the one whose turn it is */}
      {plan.ticks > 0 && plan.frames.map((who, i) =>
        Array.from({ length: plan.ticks }, (_, t) => (
          <circle
            key={`${i}-${t}`}
            cx={centre(i) - ((plan.ticks - 1) * 9) / 2 + t * 9}
            cy={dotsY}
            r={3}
            fill={colourOf(who)}
          />
        )))}
      {plan.loops && (
        <g stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${centre(1)} ${dotsY + 8}V${PLAN_H - 4}H${centre(0)}V${dotsY + 8}`} />
          <path d={`M${centre(0) - 5} ${dotsY + 14}L${centre(0)} ${dotsY + 8}L${centre(0) + 5} ${dotsY + 14}`} />
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------- bench */

export function OneSwingTwoKids() {
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);
  const [tried, setTried] = useState<readonly ChoiceId[]>([]);
  const [played, setPlayed] = useState<readonly string[]>(() =>
    shelf.list().reduce<readonly string[]>((acc, k) => addPlayed(acc, k.scenario), []));
  const [kept, setKept] = useState<readonly KeptRound[]>(() => shelf.list());
  const svgRef = useRef<SVGSVGElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  useStopOnInteraction(benchRef);

  const s: Scenario = scenarioById(scenarioId) ?? SCENARIOS[0];
  const settled = isSettled(s, tried);
  const last = tried[tried.length - 1];
  const after = last !== undefined ? pictureOf(s, last) : null;

  const begin = (next: Scenario): void => {
    setScenarioId(next.id);
    setTried([]);
  };

  const pick = (c: ChoiceId): void => {
    const next = choose(s, tried, c);
    if (next === tried) return;
    setTried(next);
    const reply = replyOf(s, c);
    pluck(step(reply.settled ? -7 : 2), reply.settled ? 0.6 : 0.22);
    if (reply.settled) setPlayed((p) => addPlayed(p, s.id));
  };

  const keep = (): void => {
    if (!settled) return;
    shelf.add({ scenario: s.id, tried });
    setKept(shelf.list());
  };

  const drop = (id: string): void => {
    shelf.remove(id);
    setKept(shelf.list());
  };

  const lines = plateLines(s, tried);
  const title = `${ONE_SWING_TWO_KIDS_META.title} — ${s.short}`;

  const savePicture = (): void => {
    if (!svgRef.current) return;
    void exportPlate(svgRef.current, { title, lines }, `one-swing-two-kids-${s.id}`);
  };

  /* The plate is the path he took, drawn: each plan he chose and what came of it. */
  const ROW = 104;
  const plateH = 56 + tried.length * ROW;
  const plateRows: ReactNode = tried.map((c, i) => {
    const y = 48 + i * ROW;
    const went = replyOf(s, c).settled;
    return (
      <g key={c}>
        <g transform={`translate(24 ${y}) scale(0.62)`}><PlanArt s={s} choice={c} /></g>
        <text x={240} y={y + 40} fontFamily={SANS} fontSize={17} fill={INK}>{choiceLabel(s, c)}</text>
        <text x={240} y={y + 64} fontFamily={SANS} fontSize={14} fill={went ? TEAL : TERRA}>
          {went ? 'This is what happened.' : `${s.other} did not go along with it.`}
        </text>
      </g>
    );
  });

  return (
    <section ref={benchRef} className="bench" aria-labelledby="one-swing-two-kids-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{ONE_SWING_TWO_KIDS_META.eyebrow}</p>
          <h2 id="one-swing-two-kids-title" className="bench__title">{ONE_SWING_TWO_KIDS_META.title}</h2>
          <p className="bench__note">{ONE_SWING_TWO_KIDS_META.note}</p>
          <ReadAloud id="sel/one-swing-two-kids/head" texts={LISTEN.head()} />
        </div>
        <p className="bench__readout">{coverageText(played)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row">
          <div style={{ display: 'grid', justifyItems: 'center', gap: '0.35rem' }}>
            <figure className="bench__figure">
              <img src={`${BASE}games/sel/${s.setup}.png`} alt={s.setupAlt} style={PICTURE} />
              <figcaption className="bench__figure-caption">{s.where}</figcaption>
            </figure>
            <ReadAloud
              id={`sel/one-swing-two-kids/${s.id}/setup`}
              texts={LISTEN.setup(s)}
              label="Read what is happening"
              compact
            />
          </div>
          {after && (
            <figure className="bench__figure">
              <img src={`${BASE}games/sel/${after.src}.png`} alt={after.alt} style={PICTURE} />
              <figcaption className="bench__figure-caption">Later</figcaption>
            </figure>
          )}
        </div>

        {settled && (
          <svg
            ref={svgRef}
            viewBox={`0 0 720 ${plateH}`}
            role="img"
            aria-label={`The plans you chose, in order. ${pathText(s, tried)}.`}
            style={{ marginTop: 'var(--space-4)' }}
          >
            <rect x={0} y={0} width={720} height={plateH} fill={PAPER} />
            <text x={24} y={30} fontFamily={SANS} fontSize={13} letterSpacing={1.6} fill={FAINT}>
              {s.short.toUpperCase()}
            </text>
            <path d="M24 40H696" stroke={RULE} strokeWidth={1} />
            {plateRows}
          </svg>
        )}
      </div>

      <p className="bench__note">{s.about}</p>
      {s.guide !== null && <p className="bench__note">{s.guide}</p>}
      {tried.map((c) => (
        <div key={c} className="bench__row" style={{ flexWrap: 'nowrap' }}>
          <p className="bench__note">{storyLine(s, c)}</p>
          <ReadAloud
            id={`sel/one-swing-two-kids/${s.id}/story/${c}`}
            texts={LISTEN.story(s, c)}
            label="Read this line"
            compact
          />
        </div>
      ))}

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <p className="bench__tray-label" style={{ width: 'auto', flex: '1 1 auto' }}>{trayLine(s, tried)}</p>
          <ReadAloud id={`sel/one-swing-two-kids/${s.id}/plans`} texts={LISTEN.plans(s, tried)} label="Read these out" />
        </div>
        {CHOICES.map((c) => {
          const chosen = tried.includes(c);
          const refused = chosen && !replyOf(s, c).settled;
          return (
            <button
              key={c}
              type="button"
              className={chosen ? 'bench-part is-set' : 'bench-part'}
              aria-pressed={chosen}
              aria-label={choiceLabel(s, c)}
              disabled={settled || chosen}
              onClick={() => pick(c)}
              style={{
                display: 'grid', justifyItems: 'center', alignContent: 'space-between', gap: '0.4rem',
                flex: '1 1 15rem', maxWidth: '22rem',
                padding: '0.6rem', opacity: refused || (settled && !chosen) ? 0.5 : 1,
                cursor: settled || chosen ? 'default' : 'pointer',
              }}
            >
              <svg viewBox={`0 0 ${PLAN_W} ${planHeight(s, c)}`} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
                <PlanArt s={s} choice={c} />
              </svg>
              <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-soft)' }}>{choiceLabel(s, c)}</span>
            </button>
          );
        })}
      </div>

      <div className="bench__actions">
        {settled && (
          <>
            <button type="button" className="bench-btn" onClick={keep}>Keep this</button>
            <button type="button" className="bench-btn" onClick={savePicture}>Save the picture</button>
            <button type="button" className="bench-btn" onClick={() => printPlate()}>Print</button>
          </>
        )}
        {tried.length > 0 && (
          <button type="button" className="bench-btn bench-btn--primary" onClick={() => begin(s)}>Play it again</button>
        )}
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">Choose a situation</p>
        {SCENARIOS.map((c) => (
          <button
            key={c.id} type="button"
            className={c.id === s.id ? 'bench-part is-set' : 'bench-part'}
            aria-pressed={c.id === s.id}
            onClick={() => begin(c)}
          >
            <img src={`${BASE}games/sel/${c.setup}.png`} alt={c.short} style={THUMB} />
          </button>
        ))}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">In the drawer</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept"><span className="bench__kept-meta">Nothing kept yet.</span></li>}
          {kept.map((k) => {
            const ks = scenarioById(k.scenario);
            return (
              <li className="bench__kept" key={k.id}>
                <span className="bench__kept-name">{ks?.short ?? k.scenario}</span>
                <span className="bench__kept-meta">{ks ? pathText(ks, k.tried) : ''}</span>
                <button
                  type="button" className="bench-part" onClick={() => drop(k.id)}
                  aria-label={`Take ${ks?.short ?? k.scenario} out of the drawer`}
                >
                  Take out
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{title}</p>
        {lines.map((line) => <p className="plate-print__line" key={line}>{line}</p>)}
      </div>
    </section>
  );
}

export default OneSwingTwoKids;
