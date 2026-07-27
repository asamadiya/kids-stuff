import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CHIPS, EMPTY_PICK, GLYPHS, HOLDTHELINE_META, SCENARIOS, SLOT_LABELS,
  chipById, chipsFor, heldLabel, isComplete, lineOf, nextKindOf, outcomeOf,
  panelFor, plateLines, plateTitle, readout, wordsFor, wrapText,
} from '../../sel/hold-the-line';
import type { ChipId, GlyphId, Outcome, Pick, Scenario, SlotKind } from '../../sel/hold-the-line';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptLine extends Kept {
  readonly scenario: string;
  readonly where: string;
  readonly line: string;
  readonly outcome: Outcome;
  readonly heldMs: number;
}
const rack = drawer<KeptLine>('hold-the-line');

const PAPER = '#f4f0e6', RAISED = '#fbf9f4', SUNKEN = '#eae4d5';
const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4';
const TEAL = '#2a5957', TERRA = '#9e4b27';

const SLOTS: readonly SlotKind[] = ['name', 'ask', 'next'];
const W = 720, H = 372;
const SLOT_X: Readonly<Record<SlotKind, number>> = { name: 24, ask: 256, next: 488 };
const SLOT_W = 208;

function withSlot(pick: Pick, slot: SlotKind, id: ChipId | null): Pick {
  if (slot === 'name') return { ...pick, name: id };
  if (slot === 'ask') return { ...pick, ask: id };
  return { ...pick, next: id };
}

/** A wordless mark, drawn on its 32 by 32 field. */
function mark(glyph: GlyphId, stroke: string) {
  return GLYPHS[glyph].map((d, i) => (
    <path key={i} d={d} fill="none" stroke={stroke} strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" />
  ));
}

export function HoldTheLine() {
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [pick, setPick] = useState<Pick>(EMPTY_PICK);
  const [phase, setPhase] = useState<'build' | 'hold' | 'said'>('build');
  const [heldMs, setHeldMs] = useState(0);
  const [holding, setHolding] = useState(false);
  const [runs, setRuns] = useState(0);
  const [spoken, setSpoken] = useState<string[]>([]);
  const [kept, setKept] = useState<KeptLine[]>(() => rack.list());
  const started = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!holding) return;
    const t = window.setInterval(() => setHeldMs(Date.now() - started.current), 90);
    return () => window.clearInterval(t);
  }, [holding]);

  const line = lineOf(scenario, pick);
  const full = isComplete(pick);
  const outcome: Outcome | null = phase === 'said' ? outcomeOf(scenario, pick) : null;
  const shown = outcome ? panelFor(scenario, outcome) : scenario.setup;
  const leaving = nextKindOf(pick) === 'exit';

  const place = (slot: SlotKind, id: ChipId) => {
    if (phase === 'said') return;
    const next: Pick = withSlot(pick, slot, pick[slot] === id ? null : id);
    setPick(next);
    if (next[slot]) {
      say(wordsFor(scenario, id));
      pluck(step(slot === 'name' ? -5 : slot === 'ask' ? -1 : 2));
    }
    if (isComplete(next)) window.setTimeout(() => say(lineOf(scenario, next)), 700);
  };

  const goTo = (s: Scenario) => {
    setScenario(s); setPick(EMPTY_PICK); setPhase('build'); setHeldMs(0); setRuns(0);
    say(s.setup.says);
  };

  const beginHold = () => {
    if (!full || holding || phase === 'said') return;
    started.current = Date.now(); setHeldMs(0); setHolding(true); setPhase('hold');
  };

  const endHold = () => {
    if (!holding) return;
    const ms = Date.now() - started.current;
    setHolding(false); setHeldMs(ms); setPhase('said'); setRuns((r) => r + 1);
    setSpoken((s) => (s.includes(scenario.id) ? s : [...s, scenario.id]));
    pluck(step(4), 0.6);
    const o = outcomeOf(scenario, pick);
    if (o) window.setTimeout(() => say(panelFor(scenario, o).says), 500);
  };

  const runAgain = () => {
    setPick(withSlot(pick, 'next', null)); setPhase('build'); setHeldMs(0);
  };

  const keep = () => {
    if (!outcome) return;
    rack.add({ scenario: scenario.id, where: scenario.where, line, outcome, heldMs });
    setKept(rack.list());
  };

  const caption = outcome ? plateLines(scenario, pick, outcome, heldMs) : [];
  const sentenceRows = useMemo(() => wrapText(line, 74), [line]);
  const reactionRows = useMemo(
    () => (outcome ? wrapText(panelFor(scenario, outcome).says, 74) : []),
    [outcome, scenario],
  );
  const barW = Math.min(SLOT_W * 3 + 32, Math.round(Math.max(0, heldMs) / 12));

  return (
    <section className="bench" aria-labelledby="hold-the-line-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{HOLDTHELINE_META.eyebrow}</p>
          <h2 id="hold-the-line-title" className="bench__title">{HOLDTHELINE_META.title}</h2>
          <p className="bench__note">{HOLDTHELINE_META.note}</p>
        </div>
        <p className="bench__readout">{readout(spoken)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__figure">
          <img
            src={`${import.meta.env.BASE_URL}games/sel/${shown.panel}.png`}
            alt={shown.alt}
            style={{ display: 'block', width: '100%', maxWidth: '360px', height: 'auto', border: `1px solid ${RULE}` }}
          />
          <p className="bench__figure-caption">{scenario.where}</p>
        </div>

        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={full
            ? `The frame holds: ${line}`
            : 'A frame with three empty slots: name the thing, ask for the change, what next.'}>
          <rect x="0" y="0" width={W} height={H} fill={PAPER} />
          <text x="24" y="24" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="1.8" fill={FAINT}>
            THE LINE
          </text>
          <text x={W - 24} y="24" textAnchor="end" fontFamily="Inter, sans-serif" fontSize="12"
            letterSpacing="1.8" fill={FAINT}>
            {scenario.where.toUpperCase()}
          </text>
          <path d={`M24 34 H ${W - 24}`} stroke={RULE} strokeWidth="1" />

          {SLOTS.map((slot) => {
            const x = SLOT_X[slot];
            const id = pick[slot];
            const chip = id ? chipById(id) : undefined;
            return (
              <g key={slot}>
                <rect x={x} y="48" width={SLOT_W} height="156" fill={chip ? RAISED : SUNKEN}
                  stroke={chip ? TEAL : RULE} strokeWidth="1.2" />
                <text x={x + SLOT_W / 2} y="68" textAnchor="middle" fontFamily="Inter, sans-serif"
                  fontSize="10" letterSpacing="1.4" fill={FAINT}>
                  {SLOT_LABELS[slot].toUpperCase()}
                </text>
                {chip ? (
                  <>
                    <g transform={`translate(${x + SLOT_W / 2 - 24} 76) scale(1.5)`}>{mark(chip.glyph, INK)}</g>
                    {wrapText(wordsFor(scenario, chip.id), 26).slice(0, 4).map((row, i) => (
                      <text key={i} x={x + SLOT_W / 2} y={140 + i * 15} textAnchor="middle"
                        fontFamily="Inter, sans-serif" fontSize="12" fill={INK}>
                        {row}
                      </text>
                    ))}
                  </>
                ) : (
                  <path d={`M${x + 44} 132 h ${SLOT_W - 88}`} stroke={RULE} strokeWidth="1.4" strokeDasharray="6 6" />
                )}
              </g>
            );
          })}

          {sentenceRows.slice(0, 3).map((row, i) => (
            <text key={`s${i}`} x="24" y={232 + i * 20} fontFamily="Literata, Georgia, serif"
              fontSize="16" fill={INK}>
              {row}
            </text>
          ))}

          {reactionRows.slice(0, 2).map((row, i) => (
            <text key={`r${i}`} x="24" y={306 + i * 18} fontFamily="Inter, sans-serif" fontSize="13"
              fill={outcome === 'left' ? TERRA : FAINT}>
              {row}
            </text>
          ))}

          <path d={`M24 ${H - 22} H ${W - 24}`} stroke={RULE} strokeWidth="1" />
          {heldMs > 0 && (
            <>
              <path d={`M24 ${H - 22} h ${barW}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <text x="24" y={H - 6} fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}>
                {heldLabel(heldMs)}
              </text>
            </>
          )}
        </svg>
      </div>

      {phase !== 'said' && SLOTS.map((slot) => (
        <div className="bench__tray" key={slot} style={{ marginTop: 'var(--space-3)' }}>
          <p className="bench__tray-label">
            {SLOT_LABELS[slot]}
            {slot === 'next' && runs > 0 ? ' — the doorway chip is on the rack now' : ''}
          </p>
          {chipsFor(scenario, slot).map((chip) => (
            <button key={chip.id} type="button"
              className={`bench-part${pick[slot] === chip.id ? ' is-set' : ''}`}
              aria-pressed={pick[slot] === chip.id}
              aria-label={wordsFor(scenario, chip.id)}
              title={wordsFor(scenario, chip.id)}
              onClick={() => place(slot, chip.id)}>
              <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" focusable="false"
                style={{ display: 'block' }}>
                {mark(chip.glyph, pick[slot] === chip.id ? TEAL : INK)}
              </svg>
            </button>
          ))}
        </div>
      ))}

      <div className="bench__actions">
        {phase !== 'said' && (
          <button type="button" className="bench-btn bench-btn--primary"
            aria-disabled={!full} aria-pressed={holding}
            onPointerDown={beginHold} onPointerUp={endHold} onPointerLeave={endHold}
            onPointerCancel={endHold}
            onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); beginHold(); } }}
            onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); endHold(); } }}>
            {holding ? `Keep holding — ${heldLabel(heldMs)}` : 'Now say it out loud. Hold this while you say it.'}
          </button>
        )}
        {phase === 'said' && outcome === 'goes-on' && (
          <button type="button" className="bench-btn bench-btn--primary" onClick={runAgain}>
            Change the last part and say it again
          </button>
        )}
        {phase === 'said' && (
          <button type="button" className="bench-btn" onClick={keep}>Keep this line</button>
        )}
        <button type="button" className="bench-btn" onClick={() => say(scenario.setup.says)}>
          Read out what is happening
        </button>
        <button type="button" className="bench-btn" onClick={() => { if (full) say(line); }}
          aria-disabled={!full}>
          Say the line back to me
        </button>
        <button type="button" className="bench-btn"
          onClick={() => {
            if (svgRef.current) {
              void exportPlate(svgRef.current, { title: plateTitle(scenario), lines: caption }, `hold-the-line-${scenario.id}`);
            }
          }}
          aria-disabled={!outcome}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={() => goTo(scenario)}>Start this one again</button>
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">Somewhere else</p>
        {SCENARIOS.map((s) => (
          <button key={s.id} type="button"
            className={`bench-part${s.id === scenario.id ? ' is-set' : ''}`}
            style={{ padding: '0.35rem' }}
            onClick={() => goTo(s)}>
            <img src={`${import.meta.env.BASE_URL}games/sel/${s.setup.panel}.png`}
              alt={s.where}
              style={{ display: 'block', width: '84px', height: '58px', objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">
          Lines you have said out loud{leaving && phase === 'said' ? ' — this one ended by leaving' : ''}
        </p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && (
            <li className="bench__kept"><span className="bench__kept-meta">
              {CHIPS.length} chips on the rack. Nothing kept yet.
            </span></li>
          )}
          {kept.map((k) => (
            <li key={k.id} className="bench__kept">
              <span className="bench__kept-name">{k.line}</span>
              <span className="bench__kept-meta">{k.where} · {heldLabel(k.heldMs)}</span>
              <button type="button" className="bench-btn"
                onClick={() => { rack.remove(k.id); setKept(rack.list()); }}>
                Take off the shelf
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{plateTitle(scenario)}</p>
        {(caption.length > 0 ? caption : [scenario.setup.says]).map((l) => (
          <p key={l} className="plate-print__line">{l}</p>
        ))}
      </div>
    </section>
  );
}

export default HoldTheLine;
