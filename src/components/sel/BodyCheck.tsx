import { useEffect, useMemo, useRef, useState } from 'react';
import { PAINT_ORDER, VIEW, regionPath } from '../../sel/body-figure';
import { drawer } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';
import {
  BODYCHECK_META,
  CHECKS,
  PALETTE,
  REGIONS,
  WAIT_LENGTHS,
  WAIT_THINGS,
  breathAt,
  checkById,
  coverage,
  coverageLine,
  describeMarks,
  formatDay,
  markPhrase,
  plateLines,
  readingLines,
  regionById,
  toggleCheck,
  toggleRegion,
  waitFraction,
  waitThingById,
  wholeSeconds,
  type BodyCheckRecord,
  type CheckId,
  type RegionId,
  type RemedyRun,
  type WaitThingId,
} from '../../sel/body-check';

const rack = drawer<BodyCheckRecord>('body-check');

type Phase = 'before' | 'checks' | 'remedy' | 'after' | 'done';
type Remedy = 'breath' | 'wait' | null;




/** The painted figure with the ink marks laid over it. */
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
  readonly caption: string;
}) {
  const { marks, onTap, caption } = props;
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
      <p className="bench__figure-caption">{caption}</p>
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
  const [held, setHeld] = useState(0);
  const [waitSeconds, setWaitSeconds] = useState(60);
  const [waitThing, setWaitThing] = useState<WaitThingId | null>(null);
  const [waitMs, setWaitMs] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [waitDone, setWaitDone] = useState(false);
  const [kept, setKept] = useState<BodyCheckRecord[]>(() => rack.list());
  const [shown, setShown] = useState<BodyCheckRecord | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const heldRef = useRef(0);
  const fromRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  useEffect(() => {
    if (!waiting) return;
    const total = waitSeconds * 1000;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const e = performance.now() - t0;
      if (e >= total) {
        setWaitMs(total);
        setWaitDone(true);
        setWaiting(false);
      } else {
        setWaitMs(e);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [waiting, waitSeconds]);

  const tick = () => {
    if (fromRef.current === null) return;
    setHeld(heldRef.current + (performance.now() - fromRef.current));
    rafRef.current = requestAnimationFrame(tick);
  };
  const holdOn = () => {
    if (fromRef.current !== null) return;
    fromRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  };
  const holdOff = () => {
    if (fromRef.current === null) return;
    heldRef.current += performance.now() - fromRef.current;
    fromRef.current = null;
    cancelAnimationFrame(rafRef.current);
    setHeld(heldRef.current);
  };

  const breath = breathAt(held);
  const band = waitFraction(waitMs, waitSeconds);
  const cover = useMemo(() => coverage(kept), [kept]);

  const draft: BodyCheckRecord = useMemo(() => {
    const run: RemedyRun =
      remedy === 'breath'
        ? { kind: 'breath', whole: breathAt(held).whole, heldMs: Math.round(held) }
        : remedy === 'wait' && waitThing
          ? { kind: 'wait', seconds: waitSeconds, thing: waitThing, elapsed: Math.round(waitMs), finished: waitDone }
          : { kind: 'none' };
    return { id: 'draft', made: new Date().toISOString(), before, after, checks, remedy: run };
  }, [remedy, held, waitThing, waitSeconds, waitMs, waitDone, before, after, checks]);

  const plate = shown ?? draft;
  const lines = plateLines(plate);
  const title = `Body check, ${formatDay(plate.made)}`;

  const reset = () => {
    setPhase('before');
    setBefore([]);
    setAfter([]);
    setChecks([]);
    setRemedy(null);
    setHeld(0);
    heldRef.current = 0;
    fromRef.current = null;
    setWaitMs(0);
    setWaiting(false);
    setWaitDone(false);
    setWaitThing(null);
    setShown(null);
  };

  const tapBefore = (id: RegionId) => {
    const next = toggleRegion(before, id);
    setBefore(next);
    pluck(step(-9), 0.22);
    say(describeMarks(next));
  };
  const tapAfter = (id: RegionId) => {
    const next = toggleRegion(after, id);
    setAfter(next);
    pluck(step(-9), 0.22);
    say(describeMarks(next));
  };

  const keep = () => {
    const made = rack.add({ before, after, checks, remedy: draft.remedy });
    setKept(rack.list());
    setShown(made);
    setPhase('done');
    pluck(step(-2), 0.4);
  };

  /* ------------------------------------------------------------------ stage */

  const discR = 34 + breath.open * 76;

  return (
    <section className="bench" aria-labelledby="body-check-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{BODYCHECK_META.eyebrow}</p>
          <h2 id="body-check-title" className="bench__title">{BODYCHECK_META.title}</h2>
          <p className="bench__note">{BODYCHECK_META.note}</p>
        </div>
        <p className="bench__readout">{coverageLine(cover)}</p>
      </div>

      <div className="bench__stage">
        {(phase === 'before' || phase === 'checks') && (
          <div className="bench__row" style={{ justifyContent: 'center' }}>
            <FigurePlate marks={before} onTap={phase === 'before' ? tapBefore : null} caption="Where is it right now?" />
          </div>
        )}

        {phase === 'after' && (
          <div className="bench__row" style={{ justifyContent: 'center' }}>
            <FigurePlate marks={before} onTap={null} caption="Before" />
            <FigurePlate marks={after} onTap={tapAfter} caption="Where is it now?" />
          </div>
        )}

        {phase === 'remedy' && remedy === 'breath' && (
          <svg viewBox="0 0 640 300" role="img" aria-label={`A disc that opens and shuts. ${breath.whole} whole breaths so far.`}>
            <rect x={0} y={0} width={640} height={300} fill={PALETTE.raised} />
            <circle cx={320} cy={150} r={112} fill="none" stroke={PALETTE.rule} strokeWidth={1} />
            <circle cx={320} cy={150} r={34} fill="none" stroke={PALETTE.rule} strokeWidth={1} />
            <circle
              cx={320}
              cy={150}
              r={discR}
              fill={breath.phase === 'in' ? 'rgba(42, 89, 87, 0.16)' : 'rgba(158, 75, 39, 0.14)'}
              stroke={breath.phase === 'in' ? PALETTE.teal : PALETTE.terracotta}
              strokeWidth={2}
            />
            <line x1={40} y1={266} x2={600} y2={266} stroke={PALETTE.rule} strokeWidth={1} />
            {Array.from({ length: breath.whole }, (_, i) => (
              <line key={i} x1={40 + i * 14} y1={252} x2={40 + i * 14} y2={266} stroke={PALETTE.ink} strokeWidth={2} />
            ))}
            <text x={600} y={288} textAnchor="end" fontFamily="Inter, system-ui, sans-serif" fontSize={16} fill={PALETTE.faint}>
              {breath.whole === 1 ? '1 whole breath' : `${breath.whole} whole breaths`}
            </text>
          </svg>
        )}

        {phase === 'remedy' && remedy === 'wait' && (
          <svg viewBox="0 0 640 200" role="img" aria-label={`A band that fills as the wait passes. ${wholeSeconds(waitMs)} seconds of ${waitSeconds}.`}>
            <rect x={0} y={0} width={640} height={200} fill={PALETTE.raised} />
            <rect x={40} y={70} width={560} height={54} fill={PALETTE.sunken} stroke={PALETTE.rule} strokeWidth={1} />
            <rect x={40} y={70} width={560 * band} height={54} fill="rgba(42, 89, 87, 0.28)" />
            {WAIT_LENGTHS.map((s) => (
              <line
                key={s}
                x1={40 + 560 * Math.min(1, s / waitSeconds)}
                y1={70}
                x2={40 + 560 * Math.min(1, s / waitSeconds)}
                y2={124}
                stroke={PALETTE.rule}
                strokeWidth={1}
              />
            ))}
            <line x1={40 + 560 * band} y1={58} x2={40 + 560 * band} y2={136} stroke={PALETTE.ink} strokeWidth={2} />
            <text x={40} y={168} fontFamily="Inter, system-ui, sans-serif" fontSize={17} fill={PALETTE.faint}>
              {wholeSeconds(waitMs)} of {waitSeconds} seconds
            </text>
            {waitThing && (
              <text x={600} y={168} textAnchor="end" fontFamily="Inter, system-ui, sans-serif" fontSize={17} fill={PALETTE.faint}>
                {waitThingById(waitThing).label}
              </text>
            )}
          </svg>
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
            <InkFigure x={70} y={84} scale={1.85} marks={plate.before} />
            <InkFigure x={360} y={84} scale={1.85} marks={plate.after} />
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
          <p className="bench__tray-label">Or tap the picture that matches. As many as are true.</p>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`bench-part${before.includes(r.id) ? ' is-set' : ''}`}
              aria-pressed={before.includes(r.id)}
              aria-label={r.signal}
              onClick={() => tapBefore(r.id)}
            >
              <img
                src={`${import.meta.env.BASE_URL}games/sel/${r.inset}.png`}
                alt={r.alt}
                style={{ display: 'block', width: '5rem', height: '5rem', border: `1px solid ${PALETTE.rule}` }}
              />
            </button>
          ))}
        </div>
      )}

      {phase === 'checks' && (
        <div className="bench__tray">
          <p className="bench__tray-label">What is true right now? Any of them, or none.</p>
          {CHECKS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`bench-part${checks.includes(c.id) ? ' is-set' : ''}`}
              aria-pressed={checks.includes(c.id)}
              aria-label={c.label}
              onClick={() => {
                const next = toggleCheck(checks, c.id);
                setChecks(next);
                pluck(step(-4), 0.2);
                say(c.label);
              }}
            >
              <Glyph paths={c.glyph} />
            </button>
          ))}
        </div>
      )}

      {phase === 'remedy' && (
        <div className="bench__tray">
          <p className="bench__tray-label">Run one of these. The disc only moves while you hold it; the band only fills in real time.</p>
          <button
            type="button"
            className={`bench-part bench-part--wide${remedy === 'breath' ? ' is-set' : ''}`}
            aria-pressed={remedy === 'breath'}
            onClick={() => { setRemedy('breath'); setWaiting(false); }}
          >
            The breath disc
          </button>
          <button
            type="button"
            className={`bench-part bench-part--wide${remedy === 'wait' ? ' is-set' : ''}`}
            aria-pressed={remedy === 'wait'}
            onClick={() => { setRemedy('wait'); setWaiting(false); setWaitMs(0); setWaitDone(false); }}
          >
            A wait
          </button>
        </div>
      )}

      {phase === 'remedy' && remedy === 'wait' && (
        <>
          <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
            <p className="bench__tray-label">How long?</p>
            {WAIT_LENGTHS.map((s) => (
              <button
                key={s}
                type="button"
                className={`bench-part${s === waitSeconds ? ' is-set' : ''}`}
                aria-pressed={s === waitSeconds}
                aria-label={`${s} seconds`}
                onClick={() => { setWaitSeconds(s); setWaitMs(0); setWaitDone(false); setWaiting(false); }}
              >
                {s}s
              </button>
            ))}
          </div>
          <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
            <p className="bench__tray-label">What will you do while you wait?</p>
            {WAIT_THINGS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`bench-part${w.id === waitThing ? ' is-set' : ''}`}
                aria-pressed={w.id === waitThing}
                aria-label={w.label}
                onClick={() => { setWaitThing(w.id); say(w.label); }}
              >
                <Glyph paths={w.glyph} />
              </button>
            ))}
          </div>
        </>
      )}

      <div className="bench__actions">
        {phase === 'before' && (
          <button type="button" className="bench-btn bench-btn--primary" onClick={() => { setPhase('checks'); say(describeMarks(before)); }}>
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

        {phase === 'remedy' && remedy === 'breath' && (
          <button
            type="button"
            className="bench-btn bench-btn--primary"
            onPointerDown={holdOn}
            onPointerUp={holdOff}
            onPointerLeave={holdOff}
            onPointerCancel={holdOff}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); holdOn(); } }}
            onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); holdOff(); } }}
          >
            Press and hold
          </button>
        )}

        {phase === 'remedy' && remedy === 'wait' && !waiting && !waitDone && (
          <button
            type="button"
            className="bench-btn bench-btn--primary"
            aria-disabled={waitThing === null}
            onClick={() => { if (waitThing === null) return; setWaitMs(0); setWaitDone(false); setWaiting(true); }}
          >
            Start the wait
          </button>
        )}

        {phase === 'remedy' && remedy === 'wait' && waiting && (
          <button type="button" className="bench-btn" onClick={() => setWaiting(false)}>
            Stop the wait
          </button>
        )}

        {phase === 'remedy' && (
          <>
            <button type="button" className="bench-btn" onClick={() => { holdOff(); setWaiting(false); setPhase('after'); }}>
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
            <button type="button" className="bench-btn" onClick={() => say(lines.join(' '))}>
              Read this out
            </button>
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
            {readingLines(before, checks).map((l) => (
              <li key={l} className="bench__kept-meta" style={{ display: 'block', marginTop: '0.35rem' }}>{l}</li>
            ))}
          </ul>
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
