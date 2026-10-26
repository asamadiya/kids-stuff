import { useMemo, useRef, useState } from 'react';
import {
  CHIPS, DOORWAY_NOTE, EMPTY_PICK, GLYPHS, HOLDTHELINE_META, LISTEN, SCENARIOS, SLOTS, SLOT_LABELS,
  allSaid, chipById, chipsFor, isComplete, lineOf, nextKindOf, outcomeOf,
  panelFor, plateLines, plateTitle, promptText, readout, saidLabel, sayPart, showsDoorwayNote,
  shownPanel, wordsFor, wrapText,
} from '../../sel/hold-the-line';
import type { ChipId, GlyphId, Outcome, Pick, Scenario, SlotKind } from '../../sel/hold-the-line';
import { drawer } from '../../lib/drawer';
import type { Kept } from '../../lib/drawer';
import { pluck, step } from '../../lib/tone';
import { exportPlate, printPlate } from '../../lib/plate';
import { ReadAloud } from '../../audio/ReadAloud';
import { useStopOnInteraction } from '../../audio/useStopOnInteraction';

interface KeptLine extends Kept {
  readonly scenario: string;
  readonly where: string;
  readonly line: string;
  readonly outcome: Outcome;
  /** Times the line was said out loud here. Lines kept before the dots carry none. */
  readonly times?: number;
}
const rack = drawer<KeptLine>('hold-the-line');

const PAPER = '#f4f0e6', RAISED = '#fbf9f4', SUNKEN = '#eae4d5';
const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4';
const TEAL = '#2a5957', TERRA = '#9e4b27';

const W = 720, H = 392;
const SLOT_X: Readonly<Record<SlotKind, number>> = { name: 24, ask: 256, next: 488 };
const SLOT_W = 208;
const DOT_Y = 226;

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
  const [phase, setPhase] = useState<'build' | 'said'>('build');
  /* Parts said out loud so far. Moves only on a tap; no clock touches it. */
  const [said, setSaid] = useState(0);
  const [runs, setRuns] = useState(0);
  const [spoken, setSpoken] = useState<string[]>([]);
  const [kept, setKept] = useState<KeptLine[]>(() => rack.list());
  const svgRef = useRef<SVGSVGElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  useStopOnInteraction(benchRef);

  const line = lineOf(scenario, pick);
  const full = isComplete(pick);
  const outcome: Outcome | null = phase === 'said' ? outcomeOf(scenario, pick) : null;
  const shown = shownPanel(scenario, outcome);
  const leaving = nextKindOf(pick) === 'exit';
  const sayingSlot: SlotKind | null = full && phase === 'build' && !allSaid(said) ? SLOTS[said] : null;
  const sayingId = sayingSlot ? pick[sayingSlot] : null;

  const place = (slot: SlotKind, id: ChipId) => {
    if (phase === 'said') return;
    const next: Pick = withSlot(pick, slot, pick[slot] === id ? null : id);
    setPick(next);
    // A changed line is a new line: it is said again from the first part.
    setSaid(0);
    if (next[slot]) pluck(step(slot === 'name' ? -5 : slot === 'ask' ? -1 : 2));
  };

  const goTo = (s: Scenario) => {
    setScenario(s); setPick(EMPTY_PICK); setPhase('build'); setSaid(0); setRuns(0);
  };

  /** He said the next part out loud; its dot fills. After the third, the other person answers. */
  const sayNext = () => {
    if (!sayingSlot) return;
    const next = sayPart(said);
    setSaid(next);
    pluck(step(SLOTS.indexOf(sayingSlot) * 3 - 2), 0.3);
    if (!allSaid(next)) return;
    setPhase('said'); setRuns((r) => r + 1);
    setSpoken((s) => (s.includes(scenario.id) ? s : [...s, scenario.id]));
    pluck(step(4), 0.6);
  };

  const runAgain = () => {
    setPick(withSlot(pick, 'next', null)); setPhase('build'); setSaid(0);
  };

  const keep = () => {
    if (!outcome) return;
    rack.add({ scenario: scenario.id, where: scenario.where, line, outcome, times: runs });
    setKept(rack.list());
  };

  const caption = outcome ? plateLines(scenario, pick, outcome, runs) : [];
  const sentenceRows = useMemo(() => wrapText(line, 74), [line]);
  const reactionRows = useMemo(
    () => (outcome ? wrapText(panelFor(scenario, outcome).says, 74) : []),
    [outcome, scenario],
  );

  return (
    <section ref={benchRef} className="bench" aria-labelledby="hold-the-line-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{HOLDTHELINE_META.eyebrow}</p>
          <div className="bench__row">
            <h2 id="hold-the-line-title" className="bench__title">{HOLDTHELINE_META.title}</h2>
            <ReadAloud id="sel/hold-the-line/title" texts={LISTEN.title()} compact />
          </div>
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
          {/* The setup used to be spoken and never shown. Once the line is said, what
              happened is in the frame (and on the phone cards), so it is not set twice. */}
          {outcome ? null : <p className="bench__figure-caption">{shown.says}</p>}
          <ReadAloud id="sel/hold-the-line/picture" texts={LISTEN.picture(scenario, outcome)}
            label="Read out what is happening" />
        </div>

        {/* Phones: the same frame as readable cards with a full-size button.
            The drawn frame below stays the one that prints and exports. */}
        <div className="hold-cards" role="group" aria-label="The line, in three parts">
          {SLOTS.map((slot, k) => {
            const id = pick[slot];
            const chip = id ? chipById(id) : undefined;
            const done = phase === 'said' || k < said;
            const now = slot === sayingSlot;
            return (
              <div key={slot} className={`hold-card${now ? ' is-now' : ''}${done ? ' is-done' : ''}`}>
                <p className="hold-card__label">{SLOT_LABELS[slot]}</p>
                {chip ? (
                  <div className="hold-card__body">
                    <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true" focusable="false">
                      {mark(chip.glyph, INK)}
                    </svg>
                    <p className="hold-card__words">{wordsFor(scenario, chip.id)}</p>
                  </div>
                ) : (
                  <p className="hold-card__empty">Pick a picture below</p>
                )}
                {now && id ? (
                  <button type="button" className="bench-btn bench-btn--primary hold-card__said" onClick={sayNext}>
                    I said it
                  </button>
                ) : done && chip ? (
                  <p className="hold-card__done" aria-label="Said">✓ said</p>
                ) : null}
              </div>
            );
          })}
          {outcome ? <p className={`hold-cards__reply${outcome === 'left' ? ' is-left' : ''}`}>{panelFor(scenario, outcome).says}</p> : null}
        </div>

        <svg ref={svgRef} className="hold-frame" viewBox={`0 0 ${W} ${H}`} role="group"
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

          {SLOTS.map((slot, k) => {
            const x = SLOT_X[slot];
            const id = pick[slot];
            const chip = id ? chipById(id) : undefined;
            const done = phase === 'said' || k < said;
            const now = slot === sayingSlot;
            const dot = (
              <circle cx={x + SLOT_W / 2} cy={DOT_Y} r={now ? 12 : 10}
                fill={done ? INK : now ? RAISED : SUNKEN}
                stroke={done ? INK : now ? TEAL : RULE} strokeWidth={now ? 2.4 : 1.4} />
            );
            return (
              <g key={slot}>
                <rect x={x} y="48" width={SLOT_W} height="156" fill={chip ? RAISED : SUNKEN}
                  stroke={now ? TEAL : chip ? TEAL : RULE} strokeWidth={now ? 2.6 : 1.2} />
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
                {/* One still dot per part. It fills when he taps it, having said that part. */}
                {now && id ? (
                  <g role="button" tabIndex={0} aria-label={`I said: ${wordsFor(scenario, id)}`}
                    style={{ cursor: 'pointer' }} onClick={sayNext}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sayNext(); } }}>
                    {dot}
                  </g>
                ) : (
                  <g aria-hidden="true">{dot}</g>
                )}
              </g>
            );
          })}

          {sentenceRows.slice(0, 3).map((row, i) => (
            <text key={`s${i}`} x="24" y={264 + i * 20} fontFamily="Literata, Georgia, serif"
              fontSize="16" fill={INK}>
              {row}
            </text>
          ))}

          {reactionRows.slice(0, 2).map((row, i) => (
            <text key={`r${i}`} x="24" y={334 + i * 18} fontFamily="Inter, sans-serif" fontSize="13"
              fill={outcome === 'left' ? TERRA : FAINT}>
              {row}
            </text>
          ))}

          <path d={`M24 ${H - 22} H ${W - 24}`} stroke={RULE} strokeWidth="1" />
          {runs > 0 && (
            <text x="24" y={H - 6} fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}>
              {saidLabel(runs)}
            </text>
          )}
        </svg>
      </div>

      {phase !== 'said' && SLOTS.map((slot) => (
        <div className="bench__tray" key={slot} style={{ marginTop: 'var(--space-3)' }}>
          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
            <p className="bench__tray-label" style={{ width: 'auto', flex: '1 1 auto' }}>
              {SLOT_LABELS[slot]}
              {showsDoorwayNote(slot, runs) ? ` — ${DOORWAY_NOTE}` : ''}
            </p>
            <ReadAloud id={`sel/hold-the-line/tray/${slot}`} texts={LISTEN.tray(scenario, slot, runs)}
              label="Read these out" />
          </div>
          {/* Each chip shows its words beside its mark: the tray's read button reads them, in this order. */}
          {chipsFor(scenario, slot).map((chip) => (
            <button key={chip.id} type="button"
              className={`bench-part${pick[slot] === chip.id ? ' is-set' : ''}`}
              aria-pressed={pick[slot] === chip.id}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: '16rem', textAlign: 'left' }}
              onClick={() => place(slot, chip.id)}>
              <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" focusable="false"
                style={{ display: 'block', flex: 'none' }}>
                {mark(chip.glyph, pick[slot] === chip.id ? TEAL : INK)}
              </svg>
              <span>{wordsFor(scenario, chip.id)}</span>
            </button>
          ))}
        </div>
      ))}

      <div className="bench__actions">
        {phase !== 'said' && (
          <button type="button" className="bench-btn bench-btn--primary"
            aria-disabled={!full} onClick={sayNext}
            style={{ minHeight: '3.5rem' }}>
            {promptText(scenario, sayingId)}
          </button>
        )}
        {phase !== 'said' && (
          <ReadAloud id="sel/hold-the-line/prompt" texts={LISTEN.prompt(scenario, sayingId)} compact />
        )}
        {phase === 'said' && outcome === 'goes-on' && (
          <button type="button" className="bench-btn bench-btn--primary" onClick={runAgain}>
            Change the last part and say it again
          </button>
        )}
        {phase === 'said' && (
          <button type="button" className="bench-btn" onClick={keep}>Keep this line</button>
        )}
        {full && (
          <ReadAloud id="sel/hold-the-line/line" texts={LISTEN.line(scenario, pick)} label="Say the line back to me" />
        )}
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
              <span className="bench__kept-meta">
                {k.where}{k.times ? ` · ${saidLabel(k.times)}` : ''}
              </span>
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
