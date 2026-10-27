import { useMemo, useRef, useState } from 'react';
import { PAINT_ORDER, VIEW, regionPath } from '../../sel/body-figure';
import { drawer } from '../../lib/drawer';
import { exportPlate, printPlate } from '../../lib/plate';
import { ReadAloud } from '../../audio/ReadAloud';
import { useStopOnInteraction } from '../../audio/useStopOnInteraction';
import {
  BODYCHECK_META,
  BREATH_CARDS,
  CHECKS,
  COUNT_LENGTHS,
  DOTS_PER_ROW,
  FIGURE_ASK,
  LISTEN,
  PALETTE,
  REGIONS,
  REMEDY_NAME,
  TRAY_LABEL,
  WAIT_THINGS,
  breathAt,
  checkById,
  countCue,
  countOne,
  countWord,
  coverage,
  coverageLine,
  formatDay,
  markPhrase,
  plateLines,
  regionById,
  toggleCheck,
  toggleRegion,
  waitThingById,
  type BodyCheckRecord,
  type CheckId,
  type FigureAsk,
  type RegionId,
  type RemedyRun,
  type WaitThingId,
} from '../../sel/body-check';

const rack = drawer<BodyCheckRecord>('body-check');

type Phase = 'before' | 'checks' | 'remedy' | 'after' | 'done';
type Remedy = 'breath' | 'count' | null;

/* The two still cards share one geometry: a full disc for in, a small one for out. */
const DISC = { cx: 170, cy: 140, full: 104, small: 36 } as const;
const BREATH_DOT = { x: 40, y: 284, gap: 26, r: 8, row: 24 } as const;
const COUNT_DOT = { x: 50, y: 92, gap: 60, r: 22, row: 60 } as const;
const SANS = 'Inter, system-ui, sans-serif';

/*
 * The kept plate fits each figure between the rule under the title and the
 * BEFORE / AFTER labels. The scale is read off the figure's own drawing box, so
 * the figure cannot outgrow the plate when that box changes. It once did: the
 * scale was written for a 100 by 125 stroke figure and kept when the region
 * figure, 300 by 440, replaced it, and the two figures ran off the plate.
 */
const PLATE_FIGURE_TOP = 76;
const PLATE_FIGURE_SCALE = (326 - PLATE_FIGURE_TOP) / VIEW.height;

/** The name under a picture or glyph choice: the words its read button says, now on screen. */
const CHOICE = { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' } as const;
const CHOICE_NAME = { display: 'block', maxWidth: '7rem', fontSize: 'var(--step--1)', lineHeight: 1.25, textAlign: 'center' } as const;

/** A tray's label with the button that reads the label and every choice under it. */
function TrayHead(props: { readonly id: string; readonly label: string; readonly texts: readonly string[] }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
      <p className="bench__tray-label" style={{ width: 'auto', flex: '1 1 16rem' }}>{props.label}</p>
      <ReadAloud id={props.id} texts={props.texts} label="Read these out" />
    </div>
  );
}

/**
 * The figure, drawn by the code.
 *
 * This replaced a painted plate with six hand-typed points on top of it. On
 * that plate `hands` sat entirely off the child outside the printed border,
 * `throat` landed on the face and `legs` landed on the cast shadow, because
 * the coordinates were written from the prompt sent to an image model and the
 * model composed a different picture.
 *
 * A mark is a region, never a point: tapping fills the whole region, and the
 * shape that fills is the same vertex array the hit test and the geometry
 * tests use. There is nothing left for a person to keep in sync.
 */
function FigurePlate(props: {
  readonly marks: readonly RegionId[];
  readonly onTap: ((id: RegionId) => void) | null;
  /** The question he is answering on this figure, or the first reading shown beside the second. */
  readonly label: FigureAsk | 'before';
}) {
  const { marks, onTap, label } = props;
  return (
    <div className="bench__figure">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        width="100%"
        style={{ display: 'block', maxWidth: '17rem', margin: '0 auto', background: 'var(--paper-raised)', border: '1px solid var(--rule)' }}
        role={onTap ? 'group' : 'img'}
        aria-label={onTap ? undefined : 'A figure of a child with the marked places filled.'}
      >
        {PAINT_ORDER.map((id) => {
          const region = regionById(id);
          const on = marks.includes(id);
          const shape = (
            <path
              d={regionPath(id)}
              fill={on ? 'var(--terracotta)' : 'var(--paper-sunken)'}
              fillOpacity={on ? 0.55 : 1}
              stroke="var(--ink)"
              strokeWidth={1.2}
              strokeLinejoin="round"
            />
          );
          if (!onTap) return <g key={id} aria-hidden="true">{shape}</g>;
          return (
            <g
              key={id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${region.place}. ${region.signal}.`}
              style={{ cursor: 'pointer' }}
              onClick={() => onTap(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTap(id);
                }
              }}
            >
              {shape}
            </g>
          );
        })}
      </svg>
      {label === 'before' ? (
        <p className="bench__figure-caption">Before</p>
      ) : (
        <div className="bench__row" style={{ justifyContent: 'center' }}>
          <p className="bench__figure-caption">{FIGURE_ASK[label]}</p>
          <ReadAloud id={`sel/body-check/ask/${label}`} texts={LISTEN.ask(label)} label="Read the question" compact />
        </div>
      )}
    </div>
  );
}

function Glyph(props: { readonly paths: readonly string[]; readonly size?: number }) {
  const size = props.size ?? 30;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke={PALETTE.ink}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', width: size, height: size }}
    >
      {props.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** The saved plate draws the same polygons, so sheet and screen cannot disagree. */
function InkFigure(props: {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly marks: readonly RegionId[];
}) {
  const { x, y, scale, marks } = props;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {PAINT_ORDER.map((id) => (
        <path
          key={id}
          d={regionPath(id)}
          fill={marks.includes(id) ? PALETTE.terracotta : 'none'}
          fillOpacity={marks.includes(id) ? 0.55 : 1}
          stroke={PALETTE.ink}
          strokeWidth={1.4 / scale}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

export function BodyCheck() {
  const [phase, setPhase] = useState<Phase>('before');
  const [before, setBefore] = useState<readonly RegionId[]>([]);
  const [after, setAfter] = useState<readonly RegionId[]>([]);
  const [checks, setChecks] = useState<readonly CheckId[]>([]);
  const [remedy, setRemedy] = useState<Remedy>(null);
  /* Every change to the remedy drawings is one of these taps. Nothing runs on a clock. */
  const [breathTaps, setBreathTaps] = useState(0);
  const [countTo, setCountTo] = useState(COUNT_LENGTHS[1]);
  const [countThing, setCountThing] = useState<WaitThingId | null>(null);
  const [counted, setCounted] = useState(0);
  const [kept, setKept] = useState<BodyCheckRecord[]>(() => rack.list());
  const [shown, setShown] = useState<BodyCheckRecord | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  useStopOnInteraction(benchRef);

  const breath = breathAt(breathTaps);
  const card = BREATH_CARDS[breath.phase];
  const countDone = counted >= countTo;
  const cue = countCue(countThing !== null, counted, countTo);
  const cover = useMemo(() => coverage(kept), [kept]);

  const draft: BodyCheckRecord = useMemo(() => {
    const run: RemedyRun =
      remedy === 'breath'
        ? { kind: 'breath', whole: breathAt(breathTaps).whole }
        : remedy === 'count' && countThing
          ? { kind: 'count', to: countTo, thing: countThing, counted }
          : { kind: 'none' };
    return { id: 'draft', made: new Date().toISOString(), before, after, checks, remedy: run };
  }, [remedy, breathTaps, countThing, countTo, counted, before, after, checks]);

  const plate = shown ?? draft;
  const lines = plateLines(plate);
  const title = `Body check, ${formatDay(plate.made)}`;

  const reset = () => {
    setPhase('before');
    setBefore([]);
    setAfter([]);
    setChecks([]);
    setRemedy(null);
    setBreathTaps(0);
    setCounted(0);
    setCountThing(null);
    setShown(null);
  };

  /** One half-breath done: the next still card comes up. */
  const breathed = () => {
    setBreathTaps(breathTaps + 1);
  };

  /** One number said out loud: the next dot fills. */
  const countedOne = () => {
    if (countThing === null || countDone) return;
    const next = countOne(counted, countTo);
    setCounted(next);
  };

  const tapBefore = (id: RegionId) => {
    const next = toggleRegion(before, id);
    setBefore(next);
  };
  const tapAfter = (id: RegionId) => {
    const next = toggleRegion(after, id);
    setAfter(next);
  };

  const keep = () => {
    const made = rack.add({ before, after, checks, remedy: draft.remedy });
    setKept(rack.list());
    setShown(made);
    setPhase('done');
  };

  /* ------------------------------------------------------------------ stage */

  const breathRows = Math.ceil((breath.whole + 1) / DOTS_PER_ROW);
  const breathH = BREATH_DOT.y + breathRows * BREATH_DOT.row;
  const countRows = Math.ceil(countTo / DOTS_PER_ROW);
  const countH = COUNT_DOT.y + countRows * COUNT_DOT.row - 18;
  const breathCount = breath.whole === 1 ? 'one slow breath' : `${countWord(breath.whole)} slow breaths`;

  return (
    <section ref={benchRef} className="bench" aria-labelledby="body-check-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{BODYCHECK_META.eyebrow}</p>
          <h2 id="body-check-title" className="bench__title">{BODYCHECK_META.title}</h2>
          <p className="bench__note">{BODYCHECK_META.note}</p>
          <ReadAloud id="sel/body-check/head" texts={LISTEN.head()} />
        </div>
        <p className="bench__readout">{coverageLine(cover)}</p>
      </div>

      <div className="bench__stage">
        {(phase === 'before' || phase === 'checks') && (
          <div className="bench__row" style={{ justifyContent: 'center' }}>
            <FigurePlate marks={before} onTap={phase === 'before' ? tapBefore : null} label="first" />
          </div>
        )}

        {phase === 'after' && (
          <div className="bench__row" style={{ justifyContent: 'center' }}>
            <FigurePlate marks={before} onTap={null} label="before" />
            <FigurePlate marks={after} onTap={tapAfter} label="again" />
          </div>
        )}

        {/*
          * Two still cards, never a moving disc. The full disc means breathe
          * in, the small one breathe out; he turns the card with a tap when the
          * half-breath is done, and the grown-up's count sets the pace.
          */}
        {phase === 'remedy' && remedy === 'breath' && (
          <div className="bench__figure" style={{ maxWidth: '22rem' }}>
            <svg
              viewBox={`0 0 340 ${breathH}`}
              role="img"
              aria-label={`${breath.phase === 'in' ? 'A full, wide disc' : 'A small disc'}. ${card.title}. ${breathCount} so far.`}
            >
              <rect x={0} y={0} width={340} height={breathH} fill={PALETTE.raised} />
              <circle cx={DISC.cx} cy={DISC.cy} r={DISC.full} fill="none" stroke={PALETTE.rule} strokeWidth={1} />
              <circle cx={DISC.cx} cy={DISC.cy} r={DISC.small} fill="none" stroke={PALETTE.rule} strokeWidth={1} />
              <circle
                cx={DISC.cx}
                cy={DISC.cy}
                r={breath.phase === 'in' ? DISC.full : DISC.small}
                fill={breath.phase === 'in' ? 'rgba(42, 89, 87, 0.16)' : 'rgba(158, 75, 39, 0.14)'}
                stroke={breath.phase === 'in' ? PALETTE.teal : PALETTE.terracotta}
                strokeWidth={2}
              />
              <line x1={BREATH_DOT.x - 14} y1={BREATH_DOT.y - 24} x2={340 - BREATH_DOT.x + 14} y2={BREATH_DOT.y - 24} stroke={PALETTE.rule} strokeWidth={1} />
              {/* one dot per whole breath, and a hollow one for the breath under way */}
              {Array.from({ length: breath.whole + 1 }, (_, i) => (
                <circle
                  key={i}
                  cx={BREATH_DOT.x + 6 + (i % DOTS_PER_ROW) * BREATH_DOT.gap}
                  cy={BREATH_DOT.y + Math.floor(i / DOTS_PER_ROW) * BREATH_DOT.row}
                  r={BREATH_DOT.r}
                  fill={i < breath.whole ? PALETTE.ink : 'none'}
                  stroke={i < breath.whole ? PALETTE.ink : PALETTE.faint}
                  strokeWidth={1.4}
                />
              ))}
            </svg>
            <h3 className="bench__title" style={{ margin: 0 }}>{card.title}</h3>
            <p className="bench__note" style={{ textAlign: 'center', marginTop: 0 }}>{card.how}</p>
            <ReadAloud id="sel/body-check/breath" texts={LISTEN.breath(breath.phase)} />
            <button
              type="button"
              className="bench-btn bench-btn--primary"
              style={{ minHeight: '4rem', minWidth: '14rem', fontSize: 'var(--step-1)' }}
              onClick={breathed}
            >
              {card.done}
            </button>
            <p className="bench__figure-caption">{breathCount}</p>
          </div>
        )}

        {/*
          * A slow count, one dot per number. He says the number out loud with
          * his grown-up, then taps; the dot fills because he tapped, not because
          * a second went by.
          */}
        {phase === 'remedy' && remedy === 'count' && (
          <div className="bench__figure" style={{ maxWidth: '40rem', width: '100%' }}>
            <svg
              viewBox={`0 0 640 ${countH}`}
              role="group"
              aria-label={`${countTo} dots, one for each number. ${counted} counted.`}
            >
              <rect x={0} y={0} width={640} height={countH} fill={PALETTE.raised} />
              <text x={COUNT_DOT.x - COUNT_DOT.r} y={36} fontFamily={SANS} fontSize={17} fill={PALETTE.faint}>
                {counted} of {countTo}
              </text>
              {countThing && (
                <text x={640 - COUNT_DOT.x + COUNT_DOT.r} y={36} textAnchor="end" fontFamily={SANS} fontSize={17} fill={PALETTE.faint}>
                  {waitThingById(countThing).label}
                </text>
              )}
              {Array.from({ length: countTo }, (_, i) => {
                const n = i + 1;
                const cx = COUNT_DOT.x + (i % DOTS_PER_ROW) * COUNT_DOT.gap;
                const cy = COUNT_DOT.y + Math.floor(i / DOTS_PER_ROW) * COUNT_DOT.row;
                const on = n <= counted;
                const dot = (
                  <>
                    <circle cx={cx} cy={cy} r={COUNT_DOT.r} fill={on ? PALETTE.teal : PALETTE.sunken} stroke={on ? PALETTE.teal : PALETTE.faint} strokeWidth={1.4} />
                    <text x={cx} y={cy + 6} textAnchor="middle" fontFamily={SANS} fontSize={17} fill={on ? PALETTE.raised : PALETTE.faint}>
                      {n}
                    </text>
                  </>
                );
                // Only the next dot takes a tap, so they fill strictly in order.
                if (n !== counted + 1 || countThing === null) return <g key={n} aria-hidden="true">{dot}</g>;
                return (
                  <g
                    key={n}
                    role="button"
                    tabIndex={0}
                    aria-label={`I said ${n}`}
                    style={{ cursor: 'pointer' }}
                    onClick={countedOne}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        countedOne();
                      }
                    }}
                  >
                    {dot}
                  </g>
                );
              })}
            </svg>
            <div className="bench__row" style={{ justifyContent: 'center' }}>
              {cue.kind === 'say' ? (
                <p className="bench__note" style={{ textAlign: 'center', marginTop: 0, maxWidth: 'none' }}>{cue.line}</p>
              ) : (
                <p className="bench__figure-caption">{cue.line}</p>
              )}
              <ReadAloud id="sel/body-check/count" texts={LISTEN.count(cue)} compact />
            </div>
            {cue.kind === 'say' && (
              <button
                type="button"
                className="bench-btn bench-btn--primary"
                style={{ minHeight: '4rem', minWidth: '14rem', fontSize: 'var(--step-1)' }}
                onClick={countedOne}
              >
                {`I said ${counted + 1}`}
              </button>
            )}
          </div>
        )}

        {phase === 'done' && (
          <svg ref={svgRef} viewBox="0 0 640 460" role="img" aria-label={`A plate with two figures. ${lines.join(' ')}`}>
            <rect x={0} y={0} width={640} height={460} fill={PALETTE.paper} />
            <rect x={10} y={10} width={620} height={430} fill={PALETTE.raised} stroke={PALETTE.rule} strokeWidth={1} />
            <text x={34} y={46} fontFamily="Literata, Georgia, serif" fontSize={22} fill={PALETTE.ink}>
              {BODYCHECK_META.title}
            </text>
            <text x={606} y={46} textAnchor="end" fontFamily="Inter, system-ui, sans-serif" fontSize={15} fill={PALETTE.faint}>
              {formatDay(plate.made)}
            </text>
            <line x1={34} y1={60} x2={606} y2={60} stroke={PALETTE.rule} strokeWidth={1} />
            {[162, 452].map((cx, i) => (
              <InkFigure
                key={cx}
                x={cx - (VIEW.width * PLATE_FIGURE_SCALE) / 2}
                y={PLATE_FIGURE_TOP}
                scale={PLATE_FIGURE_SCALE}
                marks={i === 0 ? plate.before : plate.after}
              />
            ))}
            {[
              { x: 162, label: 'before', count: plate.before.length },
              { x: 452, label: 'after', count: plate.after.length },
            ].map((c) => (
              <g key={c.label}>
                <text x={c.x} y={344} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={13} letterSpacing="0.12em" fill={PALETTE.faint}>
                  {c.label.toUpperCase()}
                </text>
                <text x={c.x} y={368} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={16} fill={PALETTE.ink}>
                  {markPhrase(c.count)}
                </text>
              </g>
            ))}
            <line x1={34} y1={386} x2={606} y2={386} stroke={PALETTE.rule} strokeWidth={1} />
            {plate.checks.length === 0 ? (
              <text x={34} y={414} fontFamily="Inter, system-ui, sans-serif" fontSize={16} fill={PALETTE.faint}>
                none of the five marked
              </text>
            ) : (
              plate.checks.map((id, i) => (
                <g key={id} transform={`translate(${34 + i * 42} 396)`} fill="none" stroke={PALETTE.ink} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                  {checkById(id).glyph.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
              ))
            )}
          </svg>
        )}
      </div>

      {phase === 'before' && (
        <div className="bench__tray">
          <TrayHead id="sel/body-check/places" label={TRAY_LABEL.places} texts={LISTEN.places()} />
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`bench-part${before.includes(r.id) ? ' is-set' : ''}`}
              style={CHOICE}
              aria-pressed={before.includes(r.id)}
              aria-label={r.signal}
              onClick={() => tapBefore(r.id)}
            >
              <img
                src={`${import.meta.env.BASE_URL}games/sel/${r.inset}.png`}
                alt={r.alt}
                style={{ display: 'block', width: '5rem', height: '5rem', border: `1px solid ${PALETTE.rule}` }}
              />
              <span style={CHOICE_NAME}>{r.signal}</span>
            </button>
          ))}
        </div>
      )}

      {phase === 'checks' && (
        <div className="bench__tray">
          <TrayHead id="sel/body-check/checks" label={TRAY_LABEL.checks} texts={LISTEN.checks()} />
          {CHECKS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`bench-part${checks.includes(c.id) ? ' is-set' : ''}`}
              style={CHOICE}
              aria-pressed={checks.includes(c.id)}
              aria-label={c.label}
              onClick={() => {
                setChecks(toggleCheck(checks, c.id));
              }}
            >
              <Glyph paths={c.glyph} />
              <span style={CHOICE_NAME}>{c.label}</span>
            </button>
          ))}
        </div>
      )}

      {phase === 'remedy' && (
        <div className="bench__tray">
          <TrayHead id="sel/body-check/remedy" label={TRAY_LABEL.remedy} texts={LISTEN.remedy()} />
          <button
            type="button"
            className={`bench-part bench-part--wide${remedy === 'breath' ? ' is-set' : ''}`}
            aria-pressed={remedy === 'breath'}
            onClick={() => setRemedy('breath')}
          >
            {REMEDY_NAME.breath}
          </button>
          <button
            type="button"
            className={`bench-part bench-part--wide${remedy === 'count' ? ' is-set' : ''}`}
            aria-pressed={remedy === 'count'}
            onClick={() => { setRemedy('count'); setCounted(0); }}
          >
            {REMEDY_NAME.count}
          </button>
        </div>
      )}

      {phase === 'remedy' && remedy === 'count' && (
        <>
          <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
            <TrayHead id="sel/body-check/count-to" label={TRAY_LABEL.countTo} texts={LISTEN.countTo()} />
            {COUNT_LENGTHS.map((n) => (
              <button
                key={n}
                type="button"
                className={`bench-part${n === countTo ? ' is-set' : ''}`}
                aria-pressed={n === countTo}
                aria-label={`Count to ${n}`}
                onClick={() => { setCountTo(n); setCounted(0); }}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
            <TrayHead id="sel/body-check/wait" label={TRAY_LABEL.wait} texts={LISTEN.wait()} />
            {WAIT_THINGS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`bench-part${w.id === countThing ? ' is-set' : ''}`}
                style={CHOICE}
                aria-pressed={w.id === countThing}
                aria-label={w.label}
                onClick={() => setCountThing(w.id)}
              >
                <Glyph paths={w.glyph} />
                <span style={CHOICE_NAME}>{w.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="bench__actions">
        {phase === 'before' && (
          <button type="button" className="bench-btn bench-btn--primary" onClick={() => setPhase('checks')}>
            Next
          </button>
        )}

        {phase === 'checks' && (
          <>
            <button type="button" className="bench-btn bench-btn--primary" onClick={() => setPhase('remedy')}>
              Next
            </button>
            <button type="button" className="bench-btn" onClick={() => setPhase('before')}>
              Back to the marks
            </button>
          </>
        )}

        {phase === 'remedy' && (
          <>
            <button type="button" className="bench-btn" onClick={() => setPhase('after')}>
              Check again
            </button>
            <button type="button" className="bench-btn" onClick={() => setPhase('checks')}>
              Back
            </button>
          </>
        )}

        {phase === 'after' && (
          <>
            <button type="button" className="bench-btn bench-btn--primary" onClick={keep}>
              Keep this reading
            </button>
            <button type="button" className="bench-btn" onClick={() => setPhase('remedy')}>
              Back
            </button>
          </>
        )}

        {phase === 'done' && (
          <>
            <button
              type="button"
              className="bench-btn"
              onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title, lines }, 'body-check'); }}
            >
              Save as a picture
            </button>
            <button type="button" className="bench-btn" onClick={printPlate}>
              Print
            </button>
            <button type="button" className="bench-btn bench-btn--primary" onClick={reset}>
              Start again
            </button>
          </>
        )}
      </div>

      {(phase === 'checks' || phase === 'remedy' || phase === 'after') && (
        <div className="bench__shelf">
          <p className="bench__shelf-title">The reading so far</p>
          <ul className="bench__shelf-list" style={{ display: 'block' }}>
            {LISTEN.reading(before, checks).map((l) => (
              <li key={l} className="bench__kept-meta" style={{ display: 'block', marginTop: '0.35rem' }}>{l}</li>
            ))}
          </ul>
          <ReadAloud id="sel/body-check/reading" texts={LISTEN.reading(before, checks)} />
        </div>
      )}

      {phase === 'done' && (
        <div className="bench__shelf">
          <p className="bench__shelf-title">What the plate says</p>
          <ul className="bench__shelf-list" style={{ display: 'block' }}>
            {lines.map((l) => (
              <li key={l} className="bench__kept-meta" style={{ display: 'block', marginTop: '0.35rem' }}>{l}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bench__shelf">
        <p className="bench__shelf-title">Kept readings</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">Nothing kept yet.</li>}
          {kept.slice(-8).reverse().map((k) => (
            <li key={k.id} className="bench__kept">
              <button type="button" className="bench-btn" onClick={() => { setShown(k); setPhase('done'); }}>
                <span className="bench__kept-name">{formatDay(k.made)}</span>{' '}
                <span className="bench__kept-meta">{markPhrase(k.before.length)} then {markPhrase(k.after.length)}</span>
              </button>
              <button type="button" className="bench-btn" aria-label={`Discard the reading from ${formatDay(k.made)}`} onClick={() => { rack.remove(k.id); setKept(rack.list()); }}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{title}</p>
        {lines.map((l) => (
          <p key={l} className="plate-print__line">{l}</p>
        ))}
      </div>
    </section>
  );
}

export default BodyCheck;
