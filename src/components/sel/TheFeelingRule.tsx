import { useCallback, useMemo, useRef, useState } from 'react';
import {
  AMBIGUITY_NOTE, FEELING_RULES, THE_FEELING_RULE_META,
  addPin, cardAt, cardById, clampPos, coverageLine, differenceLine, faceStrength,
  facePath, keptSummary, markerWord, nearestStop, pinLines, plateLines, posFromFraction,
  removePin, ruleById, ruleSummary, scenePath, stopAt, stopX,
} from '../../sel/the-feeling-rule';
import type { FeelingRule, Pin } from '../../sel/the-feeling-rule';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptRule extends Kept {
  readonly ruleId: string;
  readonly pins: readonly Pin[];
}
const shelf = drawer<KeptRule>('the-feeling-rule');

/* Paper, ink and hairlines. Colour identifies; it never decorates. */
const PAPER = '#f4f0e6';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TERRA = '#9e4b27';
const OCHRE = '#8a6416';
const TEAL = '#2a5957';

const VIEW_W = 760;
const VIEW_H = 300;
const X0 = 74;
const X1 = 686;
const RULE_Y = 128;

const BASE = `${import.meta.env.BASE_URL}`;
const trim = (s: string, n = 26): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function TheFeelingRule() {
  const [ruleId, setRuleId] = useState<string>(FEELING_RULES[0].id);
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [pins, setPins] = useState<readonly Pin[]>([]);
  const [told, setTold] = useState(false);
  const [kept, setKept] = useState<readonly KeptRule[]>(() => shelf.list());
  const svgRef = useRef<SVGSVGElement>(null);
  const spokenRef = useRef(0);

  const rule: FeelingRule = useMemo(() => ruleById(ruleId), [ruleId]);
  const card = useMemo(() => cardAt(ruleId, cursor), [ruleId, cursor]);
  const here = nearestStop(rule, pos);
  const word = markerWord(rule, pos);
  const lines = useMemo(() => plateLines(rule, pins), [rule, pins]);
  const reading = useMemo(() => pinLines(rule, pins), [rule, pins]);
  const difference = useMemo(() => differenceLine(rule, pins), [rule, pins]);
  const marked = useMemo(() => {
    const ids = new Set(kept.map((k) => k.ruleId));
    if (pins.length) ids.add(ruleId);
    return ids.size;
  }, [kept, pins, ruleId]);

  /* --------------------------------------------------------------- moving */

  /** Naming each stop as the marker passes under it; sound is incidental. */
  const land = useCallback(
    (next: number, spoken: boolean) => {
      const p = clampPos(rule, next);
      setPos(p);
      const i = nearestStop(rule, p);
      if (spoken && i !== spokenRef.current) {
        spokenRef.current = i;
        say(stopAt(rule, i).label);
        pluck(step(-4 + i * 3), 0.28);
      }
    },
    [rule],
  );

  const fractionFrom = useCallback((clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const box = svg.getBoundingClientRect();
    if (!box.width) return 0;
    const x = ((clientX - box.left) / box.width) * VIEW_W;
    return (x - X0) / (X1 - X0);
  }, []);

  const onRuleKey = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    let next: number | null = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = here - 1;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = here + 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = rule.stops.length - 1;
    if (next === null) return;
    e.preventDefault();
    land(next, true);
  };

  /* --------------------------------------------------------------- working */

  const chooseRule = (id: string): void => {
    setRuleId(id);
    setPos(0);
    setPins([]);
    setCursor(0);
    spokenRef.current = 0;
    const r = ruleById(id);
    say(`${r.label}. ${r.stops.map((s) => s.label).join(', ')}.`);
  };

  const dropPin = (): void => {
    const next = addPin(pins, { eventId: card.id, stop: here });
    setPins(next);
    setTold(true);
    setCursor((c) => c + 1);
    pluck(step(2 + here * 2), 0.36);
    const after = differenceLine(rule, next);
    say(after ? `${word}. ${after}` : word);
  };

  const dealAnother = (): void => {
    setCursor((c) => c + 1);
    say(cardAt(ruleId, cursor + 1).label);
  };

  const takeOff = (eventId: string): void => {
    setPins((p) => removePin(p, eventId));
  };

  const keep = (): void => {
    if (!pins.length) return;
    shelf.add({ ruleId, pins });
    setKept(shelf.list());
    say('kept on the shelf');
  };

  const load = (k: KeptRule): void => {
    setRuleId(k.ruleId);
    setPins(k.pins);
    setPos(k.pins.length ? k.pins[k.pins.length - 1].stop : 0);
    setCursor(0);
    setTold(true);
    say(keptSummary(ruleById(k.ruleId), k.pins));
  };

  const savePicture = (): void => {
    if (!svgRef.current) return;
    void exportPlate(
      svgRef.current,
      { title: `${THE_FEELING_RULE_META.title} — ${rule.label}`, lines },
      `the-feeling-rule-${ruleId}`,
    );
  };

  /* --------------------------------------------------------------- drawing */

  const markerX = stopX(pos, rule.stops.length, X0, X1);
  const rows = new Map<number, number>();

  return (
    <section className="bench" aria-labelledby="the-feeling-rule-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{THE_FEELING_RULE_META.eyebrow}</p>
          <h2 id="the-feeling-rule-title" className="bench__title">{THE_FEELING_RULE_META.title}</h2>
          <p className="bench__note">{THE_FEELING_RULE_META.note}</p>
        </div>
        <p className="bench__readout">{coverageLine(marked, pins.length)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row">
          {rule.stops.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={`bench-part${i === here ? ' is-set' : ''}`}
              style={{ opacity: faceStrength(i, pos) }}
              aria-label={`Move the marker to ${s.label}`}
              onClick={() => land(i, true)}
            >
              <img
                src={`${BASE}${facePath(s)}`}
                alt={`A painted portrait of a child who looks ${s.label.toLowerCase()}.`}
                style={{ display: 'block', width: '100%', maxWidth: '7.5rem', height: 'auto', border: `1px solid ${RULE}` }}
              />
              <span className="bench__figure-caption">{s.label}</span>
            </button>
          ))}
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={ruleSummary(rule, pins)}
        >
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={PAPER} />
          <text x={X0} y="38" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            {rule.label.toUpperCase()}
          </text>
          <text x={X0} y="60" fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
            small on the left, big on the right
          </text>

          {/* the rule itself */}
          <line x1={X0} y1={RULE_Y} x2={X1} y2={RULE_Y} stroke={INK} strokeWidth="1.5" />
          {rule.stops.map((s, i) => {
            const x = stopX(i, rule.stops.length, X0, X1);
            const h = 12 + s.intensity * 7;
            return (
              <g key={s.key}>
                <line x1={x} y1={RULE_Y} x2={x} y2={RULE_Y - h} stroke={i === here ? TEAL : INK} strokeWidth={i === here ? 2 : 1} />
                <text
                  x={x} y={RULE_Y + 24} textAnchor="middle" fontFamily="Inter, sans-serif"
                  fontSize="14" fill={i === here ? TEAL : FAINT}
                >
                  {s.label.toLowerCase()}
                </text>
              </g>
            );
          })}

          {/* the marker */}
          <line x1={markerX} y1={RULE_Y - 54} x2={markerX} y2={RULE_Y + 6} stroke={TERRA} strokeWidth="1.4" />
          <polygon
            points={`${markerX - 9},${RULE_Y - 54} ${markerX + 9},${RULE_Y - 54} ${markerX},${RULE_Y - 38}`}
            fill={TERRA}
          />

          {/* the pins */}
          <text x={X0} y="196" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            WHAT YOU PUT ON IT
          </text>
          {pins.length === 0 && (
            <text x={X0} y="228" fontFamily="Inter, sans-serif" fontSize="14" fill={FAINT}>
              Nothing on the rule yet.
            </text>
          )}
          {pins.map((p) => {
            const row = rows.get(p.stop) ?? 0;
            rows.set(p.stop, row + 1);
            const x = stopX(p.stop, rule.stops.length, X0, X1);
            const y = 216 + row * 26;
            return (
              <g key={p.eventId}>
                <line x1={x} y1={RULE_Y + 8} x2={x} y2={y} stroke={RULE} strokeWidth="1" />
                <circle cx={x} cy={y} r="5" fill={OCHRE} />
                <text x={x + 12} y={y + 5} fontFamily="Inter, sans-serif" fontSize="13" fill={INK}>
                  {trim(cardById(p.eventId).label)}
                </text>
              </g>
            );
          })}

          {/* drawn last so the whole band catches the pointer */}
          <rect
            x={X0 - 24} y={RULE_Y - 60} width={X1 - X0 + 48} height="96" fill="none" pointerEvents="all"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              land(posFromFraction(rule, fractionFrom(e.clientX)), true);
            }}
            onPointerMove={(e) => {
              if (dragging) land(posFromFraction(rule, fractionFrom(e.clientX)), true);
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              setDragging(false);
              land(nearestStop(rule, posFromFraction(rule, fractionFrom(e.clientX))), false);
            }}
            onPointerCancel={() => { setDragging(false); land(here, false); }}
          />
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">Which family of feelings</p>
        {FEELING_RULES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`bench-part${r.id === ruleId ? ' is-set' : ''}`}
            aria-pressed={r.id === ruleId}
            onClick={() => chooseRule(r.id)}
          >
            {r.label}
          </button>
        ))}

        <p className="bench__tray-label">The marker — drag it on the rule, or nudge it</p>
        <button
          type="button"
          className="bench-part bench-part--wide is-set"
          role="slider"
          aria-label="The marker on the rule. Use the left and right arrow keys."
          aria-valuemin={1}
          aria-valuemax={rule.stops.length}
          aria-valuenow={here + 1}
          aria-valuetext={word}
          onKeyDown={onRuleKey}
          onClick={() => say(word)}
        >
          {word}
        </button>

        <p className="bench__tray-label">This happened — tap it to put it where the marker is</p>
        <button
          type="button"
          className="bench-part bench-part--wide"
          aria-label={`Put ${card.label} on the rule at ${word}`}
          onClick={dropPin}
        >
          <img
            src={`${BASE}${scenePath(card)}`}
            alt={card.alt}
            style={{ display: 'block', width: '100%', maxWidth: '13rem', height: 'auto', border: `1px solid ${RULE}` }}
          />
          <span className="bench__figure-caption">{card.label}</span>
        </button>
        <button type="button" className="bench-btn" onClick={dealAnother}>
          A different one
        </button>
      </div>

      {!told && <p className="bench__note">{AMBIGUITY_NOTE}</p>}

      {reading.length > 0 && (
        <div className="bench__row">
          <p className="bench__readout">{reading.join(' ')}</p>
        </div>
      )}
      {difference && <p className="bench__note">{difference}</p>}

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={dropPin}>
          Put it here at {word.toLowerCase()}
        </button>
        <button type="button" className="bench-btn" aria-disabled={pins.length === 0} onClick={keep}>
          Keep this rule
        </button>
        <button type="button" className="bench-btn" onClick={savePicture}>Save as a picture</button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button
          type="button" className="bench-btn" aria-disabled={pins.length === 0}
          onClick={() => setPins([])}
        >
          Take everything off
        </button>
      </div>

      {pins.length > 0 && (
        <div className="bench__tray">
          <p className="bench__tray-label">On the rule now — tap to take one off</p>
          {pins.map((p) => (
            <button
              key={p.eventId}
              type="button"
              className="bench-part is-set"
              aria-label={`Take ${cardById(p.eventId).label} off the rule`}
              onClick={() => takeOff(p.eventId)}
            >
              <img
                src={`${BASE}${scenePath(cardById(p.eventId))}`}
                alt={cardById(p.eventId).alt}
                style={{ display: 'block', width: '100%', maxWidth: '5.5rem', height: 'auto', border: `1px solid ${RULE}` }}
              />
              <span className="bench__figure-caption">{stopAt(rule, p.stop).label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="bench__shelf">
        <p className="bench__shelf-title">Rules you kept</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">Nothing kept yet.</li>}
          {kept.slice(-8).reverse().map((k) => (
            <li key={k.id} className="bench__kept">
              <button type="button" className="bench-btn" onClick={() => load(k)}>
                <span className="bench__kept-name">{ruleById(k.ruleId).label}</span>{' '}
                <span className="bench__kept-meta">
                  {k.pins.length} {k.pins.length === 1 ? 'mark' : 'marks'}
                </span>
              </button>
              <button
                type="button" className="bench-btn" aria-label="Discard this rule"
                onClick={() => { shelf.remove(k.id); setKept(shelf.list()); }}
              >
                &#215;
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{THE_FEELING_RULE_META.title}</p>
        {lines.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default TheFeelingRule;
