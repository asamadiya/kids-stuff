import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_SLOTS, PUT_IT_BACK_TOGETHER_META, ROLE_WORD, SCENARIOS,
  alternativeFrames, coverageOf, endingKey, isAccepted, isFull, lastLineOf, lift, looseRoles,
  narrate, orderOf, panelOf, place, placeAt, plateLines, plateTitle, runOf, scatterOf, shift,
} from '../../sel/put-it-back-together';
import type { Frame, PanelRole, Scenario, Slots } from '../../sel/put-it-back-together';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptStrip extends Kept {
  readonly scenario: string;
  readonly title: string;
  readonly order: readonly PanelRole[];
  readonly ending: string;
  readonly last: string;
}
const rack = drawer<KeptStrip>('put-it-back-together');

const BASE = import.meta.env.BASE_URL;
const src = (image: string) => `${BASE}games/sel/${image}.png`;

const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4', PAPER = '#f4f0e6';
const TEAL = '#2a5957', TERRA = '#9e4b27';

const FRAME_MS = 2200;

/** A small ink mark for each move, so the plate reads without letters. */
function RoleMark({ role, x, y }: { role: PanelRole; x: number; y: number }) {
  const c = INK;
  switch (role) {
    case 'stop':
      return <path d={`M ${x - 13} ${y} H ${x + 13}`} stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" />;
    case 'notice':
      return (
        <g>
          <path d={`M ${x - 14} ${y} q 14 -11 28 0 q -14 11 -28 0 z`} stroke={c} strokeWidth="1.6" fill="none" />
          <circle cx={x} cy={y} r="3.2" fill={c} />
        </g>
      );
    case 'own':
      return (
        <g>
          <circle cx={x - 9} cy={y} r="3.2" fill={c} />
          <path d={`M ${x - 3} ${y} H ${x + 14}`} stroke={c} strokeWidth="1.6" fill="none" />
          <path d={`M ${x - 3} ${y - 6} H ${x + 9}`} stroke={c} strokeWidth="1.6" fill="none" />
        </g>
      );
    case 'offer':
      return (
        <g>
          <path d={`M ${x - 14} ${y + 6} q 7 -14 13 -2`} stroke={c} strokeWidth="1.8" fill="none" />
          <path d={`M ${x + 1} ${y + 4} q 6 -12 13 2`} stroke={c} strokeWidth="1.8" fill="none" />
        </g>
      );
    case 'check':
      return <path d={`M ${x + 11} ${y} a 11 11 0 1 1 -7 -10`} stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  }
}

export function PutItBackTogether() {
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [slots, setSlots] = useState<Slots>(EMPTY_SLOTS);
  const [phase, setPhase] = useState<'building' | 'running' | 'done'>('building');
  const [run, setRun] = useState<readonly Frame[]>([]);
  const [at, setAt] = useState(0);
  const [kept, setKept] = useState<KeptStrip[]>(() => rack.list());
  const [seen, setSeen] = useState<string[]>([]);
  const [saved, setSaved] = useState<string>('');
  const plateRef = useRef<SVGSVGElement>(null);

  const loose = looseRoles(slots);
  const order = orderOf(slots);
  const ready = isFull(slots);
  const coverage = useMemo(
    () => coverageOf([...kept.map((k) => k.ending), ...seen]),
    [kept, seen],
  );

  // ------------------------------------------------------------ playback --
  useEffect(() => {
    if (phase !== 'running') return;
    const frame = run[at];
    if (!frame) return;
    say(frame.line);
    pluck(step(at * 2 - 5), 0.28);
    const timer = window.setTimeout(() => {
      if (at + 1 < run.length) {
        setAt(at + 1);
        return;
      }
      setPhase('done');
      if (order) {
        const key = endingKey(scenario.id, isAccepted(scenario, order));
        setSeen((s) => (s.includes(key) ? s : [...s, key]));
      }
    }, FRAME_MS);
    return () => window.clearTimeout(timer);
  }, [phase, at, run, order, scenario]);

  // ------------------------------------------------------------- handling --
  /** Touching the strip after a run puts it back on the bench, keeping the order. */
  const backToBench = () => {
    if (phase !== 'done') return;
    setPhase('building');
    setRun([]);
    setAt(0);
    setSaved('');
  };
  const pick = (role: PanelRole) => {
    if (phase === 'running') return;
    backToBench();
    setSlots((s) => place(s, role));
    say(panelOf(scenario, role).line);
    pluck(step(2), 0.22);
  };
  const drop = (index: number, role: PanelRole) => {
    if (phase === 'running') return;
    backToBench();
    setSlots((s) => placeAt(s, index, role));
    say(panelOf(scenario, role).line);
  };
  const takeOut = (index: number) => {
    if (phase === 'running') return;
    backToBench();
    setSlots((s) => lift(s, index));
  };
  const nudge = (index: number, direction: -1 | 1) => {
    if (phase === 'running') return;
    backToBench();
    setSlots((s) => shift(s, index, direction));
  };
  const startOver = () => {
    setSlots(EMPTY_SLOTS);
    setPhase('building');
    setRun([]);
    setAt(0);
    setSaved('');
  };
  const chooseScenario = (next: Scenario) => {
    setScenario(next);
    setSlots(EMPTY_SLOTS);
    setPhase('building');
    setRun([]);
    setAt(0);
    setSaved('');
    say(next.opening.line);
  };
  const runIt = () => {
    if (!order) return;
    setRun(runOf(scenario, order));
    setAt(0);
    setPhase('running');
  };
  const keep = () => {
    if (!order || phase !== 'done') return;
    const item = rack.add({
      scenario: scenario.id,
      title: scenario.title,
      order: [...order],
      ending: endingKey(scenario.id, isAccepted(scenario, order)),
      last: lastLineOf(scenario, order),
    });
    setKept((k) => [...k, item]);
  };
  const forget = (id: string) => {
    rack.remove(id);
    setKept(rack.list());
  };
  const savePlate = async () => {
    if (!plateRef.current || !order) return;
    const ok = await exportPlate(
      plateRef.current,
      { title: plateTitle(scenario), lines: [...plateLines(scenario, order)] },
      `put-it-back-together-${scenario.id}`,
    );
    setSaved(ok ? 'The plate went to your downloads.' : 'This browser would not save the plate.');
  };

  const shown = phase === 'building' ? null : run[Math.min(at, run.length - 1)];
  const alt = alternativeFrames(scenario);
  const played = phase === 'done' ? run.length : at + 1;

  return (
    <section className="bench" aria-labelledby="put-it-back-together-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{PUT_IT_BACK_TOGETHER_META.eyebrow}</p>
          <h2 id="put-it-back-together-title" className="bench__title">{PUT_IT_BACK_TOGETHER_META.title}</h2>
          <p className="bench__note">{PUT_IT_BACK_TOGETHER_META.note}</p>
        </div>
        <p className="bench__readout">{coverage.line}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__figure">
          <img
            src={src(scenario.opening.image)}
            alt={scenario.opening.alt}
            style={{ display: 'block', width: '100%', maxWidth: '20rem', border: `1px solid ${RULE}` }}
          />
          <p className="bench__figure-caption">{scenario.opening.line}</p>
        </div>

        {phase !== 'building' && shown && (
          <div className="bench__figure">
            <img
              src={src(shown.image)}
              alt={shown.alt}
              style={{ display: 'block', width: '100%', maxWidth: '26rem', border: `1px solid ${RULE}` }}
            />
            <p className="bench__figure-caption" aria-live="polite">{shown.line}</p>
            <p className="bench__figure-caption">{played} of {run.length}</p>
          </div>
        )}

        {phase !== 'running' && (
          <div className="bench__row" role="group" aria-label="The five slots, in the order they will play">
            {slots.map((role, i) => (
              <div key={i} className="bench__figure">
                <button
                  type="button"
                  className={`bench-part${role ? ' is-set' : ''}`}
                  aria-label={role
                    ? `Slot ${i + 1}: ${ROLE_WORD[role]}. Press to take it back out.`
                    : `Slot ${i + 1}, empty.`}
                  onClick={() => role && takeOut(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dropped = e.dataTransfer.getData('text/plain') as PanelRole;
                    if (loose.includes(dropped) || slots.includes(dropped)) drop(i, dropped);
                  }}
                >
                  {role ? (
                    <img
                      src={src(panelOf(scenario, role).image)}
                      alt={panelOf(scenario, role).alt}
                      style={{ display: 'block', width: '7.5rem', border: `1px solid ${RULE}` }}
                    />
                  ) : (
                    <svg viewBox="0 0 120 94" width="120" height="94" role="img" aria-hidden="true">
                      <rect x="1" y="1" width="118" height="92" fill={PAPER} stroke={RULE} strokeDasharray="4 4" />
                      <text x="60" y="54" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22" fill={RULE}>
                        {i + 1}
                      </text>
                    </svg>
                  )}
                </button>
                {role && (
                  <span className="bench__row">
                    <button type="button" className="bench-part" aria-label={`Move ${ROLE_WORD[role]} earlier`}
                      onClick={() => nudge(i, -1)} disabled={i === 0}>←</button>
                    <button type="button" className="bench-part" aria-label={`Move ${ROLE_WORD[role]} later`}
                      onClick={() => nudge(i, 1)} disabled={i === slots.length - 1}>→</button>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {phase === 'done' && order && (
          <>
            <svg
              ref={plateRef}
              viewBox="0 0 720 250"
              role="img"
              aria-label={`A record of the order you made: ${order.map((r) => ROLE_WORD[r]).join(', ')}.`}
            >
              <rect x="0" y="0" width="720" height="250" fill={PAPER} />
              <text x="24" y="30" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
                {scenario.where.toUpperCase()}
              </text>
              <path d="M 24 44 H 696" stroke={RULE} strokeWidth="1" />
              {order.map((role, i) => {
                const x = 24 + i * 136;
                return (
                  <g key={role}>
                    <rect x={x} y={64} width="118" height="86" fill="none" stroke={RULE} strokeWidth="1.2" />
                    <text x={x + 8} y={82} fontFamily="Inter, sans-serif" fontSize="12" fill={FAINT}>{i + 1}</text>
                    <RoleMark role={role} x={x + 59} y={110} />
                    <text x={x + 59} y={142} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}>
                      {ROLE_WORD[role]}
                    </text>
                  </g>
                );
              })}
              <path d="M 24 176 H 696" stroke={RULE} strokeWidth="1" />
              <circle cx="34" cy="200" r="6" fill={isAccepted(scenario, order) ? TEAL : 'none'} stroke={TERRA} strokeWidth="1.6" />
              <text x="50" y="205" fontFamily="Inter, sans-serif" fontSize="13" fill={INK}>
                {(lastLineOf(scenario, order)).slice(0, 78)}
              </text>
            </svg>

            <div className="bench__row" aria-label="Some people do it this way" style={{ opacity: 0.45, marginTop: '1rem' }}>
              {alt.map((frame, i) => (
                <div key={frame.image} className="bench__figure">
                  <img
                    src={src(frame.image)}
                    alt={`${i + 1}. ${frame.alt}`}
                    style={{ display: 'block', width: '6rem', border: `1px solid ${RULE}`, filter: 'grayscale(1)' }}
                  />
                  <span className="bench__figure-caption">{i + 1}</span>
                </div>
              ))}
            </div>
            <p className="bench__figure-caption" style={{ opacity: 0.6 }}>Some people do it this way.</p>
          </>
        )}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">Which one?</p>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`bench-part${s.id === scenario.id ? ' is-set' : ''}`}
            aria-label={s.title}
            aria-pressed={s.id === scenario.id}
            onClick={() => chooseScenario(s)}
          >
            <img
              src={src(s.opening.image)}
              alt=""
              style={{ display: 'block', width: '5.5rem', border: `1px solid ${RULE}` }}
            />
          </button>
        ))}
      </div>

      {phase !== 'running' && (
        <div className="bench__tray">
          <p className="bench__tray-label">
            {loose.length > 0
              ? 'Five panels are loose on the paper. Put them in the order you want.'
              : 'All five are in. Run it and see how it ends.'}
          </p>
          {loose.map((role) => {
            const p = panelOf(scenario, role);
            const s = scatterOf(scenario.id, role);
            return (
              <button
                key={role}
                type="button"
                className="bench-part"
                aria-label={p.line}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', role)}
                onClick={() => pick(role)}
                style={{ transform: `translate(${s.dx}px, ${s.dy}px) rotate(${s.rot}deg)` }}
              >
                <img
                  src={src(p.image)}
                  alt={p.alt}
                  style={{ display: 'block', width: '7.5rem', border: `1px solid ${RULE}` }}
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="bench__actions">
        <button
          type="button"
          className="bench-btn bench-btn--primary"
          onClick={runIt}
          disabled={!ready || phase === 'running'}
        >
          ▶ Run it.
        </button>
        <button type="button" className="bench-btn" onClick={startOver} disabled={phase === 'running'}>
          Take it apart.
        </button>
        <button
          type="button"
          className="bench-btn"
          onClick={() => order && say(narrate(scenario, order))}
          disabled={phase !== 'done'}
        >
          Say it again.
        </button>
        <button type="button" className="bench-btn" onClick={keep} disabled={phase !== 'done'}>
          Keep this strip.
        </button>
        <button type="button" className="bench-btn" onClick={() => void savePlate()} disabled={phase !== 'done'}>
          Save a plate.
        </button>
        <button type="button" className="bench-btn" onClick={printPlate} disabled={phase !== 'done'}>
          Print it.
        </button>
        {saved && <p className="bench__figure-caption">{saved}</p>}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Strips you kept</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept"><span className="bench__kept-meta">Nothing kept yet.</span></li>}
          {kept.map((k) => (
            <li key={k.id} className="bench__kept">
              <span className="bench__kept-name">{k.title}</span>
              <span className="bench__kept-meta">{k.order.map((r) => ROLE_WORD[r]).join(', ')}</span>
              <button type="button" className="bench-part" aria-label={`Take ${k.title} off the shelf`} onClick={() => forget(k.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{plateTitle(scenario)}</p>
        {order
          ? plateLines(scenario, order).map((line) => <p key={line} className="plate-print__line">{line}</p>)
          : <p className="plate-print__line">{scenario.opening.line}</p>}
      </div>
    </section>
  );
}

export default PutItBackTogether;
