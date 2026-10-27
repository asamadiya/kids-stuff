import { useMemo, useRef, useState, type ReactElement, type RefObject } from 'react';
import { ReadAloud } from '../../audio/ReadAloud';
import { useStopOnInteraction } from '../../audio/useStopOnInteraction';
import { drawer } from '../../lib/drawer';
import { exportPlate, printPlate } from '../../lib/plate';
import {
  LANDINGS,
  LISTEN,
  MEANT_AND_LANDED_META,
  MOMENTS,
  SIDE_KEYS,
  SIDE_LABEL,
  THOUGHTS,
  assemble,
  coverageReadout,
  isJoined,
  landingById,
  pickOf,
  plateFilename,
  plateLines,
  sentenceText,
  sideId,
  sideOf,
  thoughtById,
  trayHeadLanded,
  trayHeadMeant,
  type Landing,
  type MeantRecord,
  type Moment,
  type Pick,
  type SideKey,
  type Thought,
  type ThoughtGlyph,
} from '../../sel/meant-and-landed';

const store = drawer<MeantRecord>('meant-and-landed');

const PAPER = '#f4f0e6';
const RAISED = '#fbf9f4';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TERRACOTTA = '#9e4b27';
const TEAL = '#2a5957';

const picturePath = (name: string): string => `${import.meta.env.BASE_URL}games/${name}.png`;

/* -------------------------------------------------------- the six chip marks */

const GLYPH_PATHS: Readonly<Record<ThoughtGlyph, readonly string[]>> = {
  joke: ['M12 3 v5', 'M12 16 v5', 'M3 12 h5', 'M16 12 h5', 'M6 6 l3.5 3.5', 'M18 6 l-3.5 3.5', 'M6 18 l3.5 -3.5', 'M18 18 l-3.5 -3.5'],
  help: ['M4 13 a8 8 0 0 0 16 0', 'M12 12 v-9', 'M8 7 l4 -4 l4 4'],
  win: ['M6 21 v-18', 'M6 4 l12 3.5 l-12 3.5 z'],
  back: ['M19 17 C17 6 10 4 6 11', 'M6 11 l6 -1', 'M6 11 l1 6'],
  blank: ['M12 4 a8 8 0 1 0 0.01 0'],
  hidden: ['M10 2 v20', 'M14 8 a4 4 0 0 1 0 8', 'M14 16 v5'],
};

function glyphMark(kind: ThoughtGlyph, x: number, y: number, size: number, color: string): ReactElement {
  const s = size / 24;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={1.6 / s}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={kind === 'blank' ? `${3 / s} ${3.5 / s}` : undefined}
    >
      {GLYPH_PATHS[kind].map((d, i) => (
        <path key={i} d={d} fill={kind === 'win' && i === 1 ? color : 'none'} />
      ))}
    </g>
  );
}

/** The thought bubble itself: one hairline tile and two trailing beads. */
function bubble(x: number, y: number, w: number, h: number): ReactElement {
  return (
    <g fill={RAISED} stroke={RULE} strokeWidth={1}>
      <rect x={x} y={y} width={w} height={h} rx={h / 3} />
      <circle cx={x + 12} cy={y + h + 9} r={4.5} />
      <circle cx={x + 3} cy={y + h + 19} r={2.5} />
    </g>
  );
}

function chipButtonMark(kind: ThoughtGlyph): ReactElement {
  return (
    <svg viewBox="0 0 56 46" width={44} height={36} aria-hidden="true" focusable="false">
      {bubble(2, 2, 52, 30)}
      {glyphMark(kind, 16, 5, 24, INK)}
    </svg>
  );
}

/* ------------------------------------------------------------- the join plate */

interface JoinProps {
  readonly moment: Moment;
  readonly sideKey: SideKey;
  readonly thought: Thought | null;
  readonly landing: Landing | null;
  readonly clauses: readonly string[];
  readonly svgRef: RefObject<SVGSVGElement>;
}

function Join({ moment, sideKey, thought, landing, clauses, svgRef }: JoinProps): ReactElement {
  return (
    <svg ref={svgRef} viewBox="0 0 640 356" role="img" aria-label={`${moment.title}, ${SIDE_LABEL[sideKey]}`}>
      <title>{`${moment.title} — ${SIDE_LABEL[sideKey]}`}</title>
      <rect x={0} y={0} width={640} height={356} fill={PAPER} />
      <rect x={0.5} y={0.5} width={639} height={355} fill="none" stroke={RULE} strokeWidth={1} />

      <text x={24} y={30} fontFamily="Inter, system-ui, sans-serif" fontSize={13} letterSpacing={1.6} fill={FAINT}>
        {SIDE_LABEL[sideKey].toUpperCase()}
      </text>

      {/* the upper rail: what was meant */}
      {thought ? (
        <g>
          {bubble(24, 48, 300, 46)}
          {glyphMark(thought.glyph, 38, 55, 32, TEAL)}
          <text x={86} y={78} fontFamily="Literata, Georgia, serif" fontSize={20} fill={INK}>
            {thought.label}
          </text>
        </g>
      ) : (
        <rect x={24} y={48} width={300} height={46} rx={15} fill="none" stroke={RULE} strokeWidth={1} strokeDasharray="5 6" />
      )}

      {/* the hairline the two rails meet on */}
      <line x1={24} y1={140} x2={288} y2={140} stroke={RULE} strokeWidth={1} />
      <text x={308} y={146} textAnchor="middle" fontFamily="Literata, Georgia, serif" fontSize={18} fill={FAINT}>
        and
      </text>
      <line x1={328} y1={140} x2={616} y2={140} stroke={RULE} strokeWidth={1} />

      {/* the lower rail: how it landed */}
      {landing ? (
        <g>
          <rect x={24} y={166} width={300} height={46} rx={6} fill={RAISED} stroke={RULE} strokeWidth={1} />
          <circle cx={52} cy={189} r={11} fill="none" stroke={TERRACOTTA} strokeWidth={1.6} />
          <circle cx={52} cy={189} r={4} fill={TERRACOTTA} />
          <text x={78} y={196} fontFamily="Literata, Georgia, serif" fontSize={20} fill={INK}>
            {landing.word}
          </text>
        </g>
      ) : (
        <rect x={24} y={166} width={300} height={46} rx={6} fill="none" stroke={RULE} strokeWidth={1} strokeDasharray="5 6" />
      )}

      <line x1={24} y1={240} x2={616} y2={240} stroke={RULE} strokeWidth={1} />

      {clauses.map((line, i) => (
        <text
          key={i}
          x={24}
          y={274 + i * 30}
          fontFamily="Literata, Georgia, serif"
          fontSize={21}
          fill={i === 2 ? FAINT : INK}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

/* --------------------------------------------------------------- the bench */

export function MeantAndLanded(): ReactElement {
  const [index, setIndex] = useState(0);
  const [sideKey, setSideKey] = useState<SideKey>('front');
  const [picks, setPicks] = useState<Readonly<Record<string, Pick>>>({});
  const [kept, setKept] = useState<MeantRecord[]>(() => store.list());
  const svgRef = useRef<SVGSVGElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  useStopOnInteraction(benchRef);

  const moment = MOMENTS[index];
  const side = sideOf(moment, sideKey);
  const key = sideId(moment.id, sideKey);
  const pick = pickOf(picks, key);
  const thought = thoughtById(pick.thought);
  const landing = landingById(pick.landing);

  const clauses = useMemo(
    () => (thought && landing ? LISTEN.joined(side, thought, landing) : []),
    [side, thought, landing],
  );

  const bothSides = useMemo(() => {
    const lines = SIDE_KEYS.map((k) => {
      const p = pickOf(picks, sideId(moment.id, k));
      const t = thoughtById(p.thought);
      const l = landingById(p.landing);
      return t && l ? sentenceText(assemble(sideOf(moment, k), t, l)) : null;
    });
    return plateLines(lines[0], lines[1]);
  }, [picks, moment]);

  const set = (part: Partial<Pick>): void => {
    const next: Pick = { ...pick, ...part };
    setPicks({ ...picks, [key]: next });
  };

  const goTo = (next: number): void => {
    const wrapped = (next + MOMENTS.length) % MOMENTS.length;
    setIndex(wrapped);
    setSideKey('front');
  };

  const flip = (): void => {
    const next: SideKey = sideKey === 'front' ? 'turned' : 'front';
    setSideKey(next);
  };

  const keepPlate = (): void => {
    store.add({ title: moment.title, lines: bothSides });
    setKept(store.list());
  };

  const dropPlate = (id: string): void => {
    store.remove(id);
    setKept(store.list());
  };

  const download = (): void => {
    const svg = svgRef.current;
    if (!svg) return;
    void exportPlate(svg, { title: moment.title, lines: bothSides }, plateFilename(moment));
  };

  return (
    <section ref={benchRef} className="bench" aria-labelledby="meant-and-landed-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{MEANT_AND_LANDED_META.eyebrow}</p>
          <div className="bench__row">
            <h2 id="meant-and-landed-title" className="bench__title">
              {MEANT_AND_LANDED_META.title}
            </h2>
            <ReadAloud id="sel/meant-and-landed/title" texts={LISTEN.title()} compact />
          </div>
          <p className="bench__note">{MEANT_AND_LANDED_META.note}</p>
        </div>
        <p className="bench__readout">{coverageReadout(picks)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row">
          <figure className="bench__figure">
            <img src={picturePath(moment.picture)} alt={moment.alt} width={320} height={249} />
            <figcaption className="bench__figure-caption">{moment.caption}</figcaption>
          </figure>
          <Join svgRef={svgRef} moment={moment} sideKey={sideKey} thought={thought} landing={landing} clauses={clauses} />
          {clauses.length ? <ReadAloud id="sel/meant-and-landed/join" texts={clauses} /> : null}
        </div>
        <div className="bench__row">
          <p className="bench__note">{side.ask}</p>
          <ReadAloud id="sel/meant-and-landed/situation" texts={LISTEN.ask(moment, side)} />
        </div>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">{trayHeadMeant(side)}</p>
        <ReadAloud id="sel/meant-and-landed/meant-tray" texts={LISTEN.meant(side)} label="Read these out" />
        {THOUGHTS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`bench-part${pick.thought === t.id ? ' is-set' : ''}`}
            aria-pressed={pick.thought === t.id}
            onClick={() => set({ thought: pick.thought === t.id ? null : t.id })}
          >
            {chipButtonMark(t.glyph)}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">{trayHeadLanded(side)}</p>
        <ReadAloud id="sel/meant-and-landed/landed-tray" texts={LISTEN.landed(side)} label="Read these out" />
        {LANDINGS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`bench-part${pick.landing === l.id ? ' is-set' : ''}`}
            aria-pressed={pick.landing === l.id}
            onClick={() => set({ landing: pick.landing === l.id ? null : l.id })}
          >
            <img src={picturePath(l.picture)} alt={l.alt} width={56} height={56} />
            <span>{l.word}</span>
          </button>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn" onClick={() => goTo(index - 1)}>
          the moment before
        </button>
        <button type="button" className="bench-btn" onClick={() => goTo(index + 1)}>
          the next moment
        </button>
        <button type="button" className="bench-btn bench-btn--primary" onClick={flip}>
          {side.flip}
        </button>
        <button
          type="button"
          className="bench-btn"
          onClick={() => setPicks({ ...picks, [key]: { thought: null, landing: null } })}
        >
          clear this side
        </button>
        <button
          type="button"
          className="bench-btn"
          onClick={keepPlate}
          disabled={!isJoined(pick)}
          aria-disabled={!isJoined(pick)}
        >
          keep this plate
        </button>
        <button type="button" className="bench-btn" onClick={download}>
          download the plate
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>
          print the plate
        </button>
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Plates kept</p>
        <ul className="bench__shelf-list">
          {kept.map((record) => (
            <li key={record.id} className="bench__kept">
              <span className="bench__kept-name">{record.title}</span>
              <span className="bench__kept-meta">{`${record.lines.length} of 2 sides`}</span>
              <button type="button" className="bench-btn" onClick={() => dropPlate(record.id)}>
                {`take ${record.title} off the shelf`}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{moment.title}</p>
        {bothSides.map((line) => (
          <p key={line} className="plate-print__line">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

export default MeantAndLanded;
