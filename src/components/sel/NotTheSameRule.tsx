import { useMemo, useRef, useState } from 'react';
import {
  CHIPS, COLUMNS, KEY_STANDS, NOT_THE_SAME_RULE_META, RULE_CARDS, SLOTS,
  cardsIn, chipById, chipsFor, coverage, describeKey, divergenceLine,
  pickChip, picksComplete, picksSet, place, plateLines, rackCards, rackEmpty,
  reverseLine, ruleSentence, sortedCount, unplace, wrapLines,
} from '../../sel/not-the-same-rule';
import type { ChipMark, ColumnId, Picks, Placements, RuleCard } from '../../sel/not-the-same-rule';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptRule extends Kept {
  readonly sentence: string;
  readonly where: string;
}
const rack = drawer<KeptRule>('not-the-same-rule');

const BASE = import.meta.env.BASE_URL;
const PAPER = '#f4f0e6', SUNKEN = '#eae4d5', INK = '#22211b', FAINT = '#6b6757';
const RULE = '#ddd6c4', TERRACOTTA = '#9e4b27', OCHRE = '#8a6416', TEAL = '#2a5957';

/** A hairline glyph, so a chip can be told apart without reading it. */
function Mark({ mark, size = 16, color = TEAL }: { mark: ChipMark; size?: number; color?: string }) {
  const s = size, m = s / 2;
  const common = { fill: 'none', stroke: color, strokeWidth: 1.4 } as const;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true" focusable="false"
      style={{ display: 'inline-block', verticalAlign: '-0.2em', marginRight: '0.35rem' }}>
      {mark === 'ring' && <circle cx={m} cy={m} r={m - 2.4} {...common} />}
      {mark === 'dot' && <circle cx={m} cy={m} r={m - 5} fill={color} />}
      {mark === 'bar' && <rect x={2.4} y={m - 2} width={s - 4.8} height={4} fill={color} />}
      {mark === 'square' && <rect x={2.8} y={2.8} width={s - 5.6} height={s - 5.6} {...common} />}
      {mark === 'cross' && (
        <g {...common}>
          <line x1={3} y1={3} x2={s - 3} y2={s - 3} /><line x1={s - 3} y1={3} x2={3} y2={s - 3} />
        </g>
      )}
      {mark === 'chevron' && <polyline points={`${m - 3},3 ${m + 3},${m} ${m - 3},${s - 3}`} {...common} />}
      {mark === 'arc' && <path d={`M3 ${s - 4} A ${m - 2} ${m - 2} 0 0 1 ${s - 3} ${s - 4}`} {...common} />}
      {mark === 'line' && <line x1={2.4} y1={m} x2={s - 2.4} y2={m} {...common} />}
    </svg>
  );
}

function CardPicture({ card, width }: { card: RuleCard; width: number }) {
  return (
    <img src={`${BASE}games/sel/${card.id}.png`} alt={card.alt} width={width}
      style={{ width: `${width}px`, maxWidth: '100%', height: 'auto', display: 'block', border: `1px solid ${RULE}` }} />
  );
}

export function NotTheSameRule() {
  const [placements, setPlacements] = useState<Placements>({});
  const [held, setHeld] = useState<string | null>(null);
  const [turned, setTurned] = useState<string | null>(null);
  const [noticed, setNoticed] = useState(false);
  const [picks, setPicks] = useState<Picks>({});
  const [rules, setRules] = useState<KeptRule[]>(() => rack.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const rackLeft = useMemo(() => rackCards(placements), [placements]);
  const sentence = useMemo(() => ruleSentence(picks), [picks]);
  const turnedCard = turned ? RULE_CARDS.find((c) => c.id === turned) : undefined;
  const showNotice = rackEmpty(placements) && !noticed;

  const putDown = (cardId: string, column: ColumnId) => {
    setPlacements((p) => place(p, cardId, column));
    setHeld((h) => (h === cardId ? null : h));
    setTurned(null);
    pluck(step(column === 'everyone' ? -5 : 2), 0.2);
  };

  const holdCard = (card: RuleCard) => {
    setHeld(card.id);
    say(card.front);
    pluck(step(0), 0.16);
  };

  const turnOver = (card: RuleCard) => {
    if (turned === card.id) { setTurned(null); return; }
    setTurned(card.id);
    say(reverseLine(card, placements[card.id]));
  };

  const takeChip = (chipId: string) => {
    setPicks((p) => pickChip(p, chipId));
    const chip = chipById(chipId);
    if (chip) say(chip.label);
    pluck(step(4), 0.14);
  };

  const keepRule = () => {
    if (!sentence) return;
    const where = chipById(picks.place ?? '')?.label ?? 'somewhere';
    rack.add({ sentence, where });
    setRules(rack.list());
    setPicks({});
    say(sentence);
  };

  const lines = plateLines(placements, sentence);
  const sentenceLines = sentence ? wrapLines(sentence, 58).slice(0, 4) : ['No rule written yet.'];

  return (
    <section className="bench" aria-labelledby="not-the-same-rule-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{NOT_THE_SAME_RULE_META.eyebrow}</p>
          <h2 id="not-the-same-rule-title" className="bench__title">{NOT_THE_SAME_RULE_META.title}</h2>
          <p className="bench__note">{NOT_THE_SAME_RULE_META.note}</p>
        </div>
        <p className="bench__readout">{coverage(placements, rules.length)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row" style={{ alignItems: 'stretch', gap: '1rem' }}>
          {COLUMNS.map((col) => (
            <div key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                if (id) putDown(id, col.id);
              }}
              style={{
                flex: '1 1 16rem', minWidth: '14rem', padding: '0.75rem',
                background: SUNKEN, border: `1px solid ${RULE}`,
              }}>
              <p className="bench__figure-caption" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
                {col.label}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.6rem' }}>
                {cardsIn(placements, col.id).map((card) => (
                  <li key={card.id}>
                    <button type="button" className="bench-part bench-part--wide"
                      aria-expanded={turned === card.id}
                      onClick={() => turnOver(card)}>
                      <CardPicture card={card} width={132} />
                      <span style={{ display: 'block', marginTop: '0.35rem' }}>{card.short}</span>
                      <span className="bench__kept-meta" style={{ display: 'block' }}>
                        {turned === card.id ? 'Turn it back' : 'Turn it over'}
                      </span>
                    </button>
                    <button type="button" className="bench-btn" style={{ marginTop: '0.3rem' }}
                      onClick={() => { setPlacements((p) => unplace(p, card.id)); setTurned(null); }}>
                      Back to the rack
                    </button>
                  </li>
                ))}
                {cardsIn(placements, col.id).length === 0 && (
                  <li className="bench__kept-meta">Nothing here yet.</li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <svg ref={svgRef} viewBox="0 0 640 400" role="img"
          aria-label={describeKey(placements, sentence)} style={{ marginTop: '1rem' }}>
          <rect x="0" y="0" width="640" height="400" fill={PAPER} />
          <rect x="8" y="8" width="624" height="384" fill="none" stroke={RULE} strokeWidth="1" />
          <text x="24" y="38" fontFamily="Literata, Georgia, serif" fontSize="18" fill={INK}>My rule key</text>
          <line x1="24" y1="52" x2="616" y2="52" stroke={RULE} strokeWidth="1" />
          <line x1="320" y1="60" x2="320" y2="262" stroke={RULE} strokeWidth="1" />
          {COLUMNS.map((col, ci) => (
            <g key={col.id}>
              <text x={ci === 0 ? 24 : 336} y="78" fontFamily="Inter, sans-serif" fontSize="11"
                fill={TERRACOTTA} letterSpacing="1">{col.label.toUpperCase()}</text>
              {cardsIn(placements, col.id).map((card, i) => {
                const x = ci === 0 ? 24 : 336, y = 104 + i * 26;
                return (
                  <g key={card.id}>
                    {col.id === 'everyone'
                      ? <circle cx={x + 6} cy={y - 4} r="5" fill="none" stroke={TEAL} strokeWidth="1.4" />
                      : <rect x={x + 1} y={y - 9} width="10" height="10" fill={OCHRE} />}
                    <text x={x + 22} y={y} fontFamily="Inter, sans-serif" fontSize="13" fill={INK}>{card.short}</text>
                  </g>
                );
              })}
              {cardsIn(placements, col.id).length === 0 && (
                <text x={ci === 0 ? 24 : 336} y="104" fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
                  nothing here yet
                </text>
              )}
            </g>
          ))}
          <line x1="24" y1="278" x2="616" y2="278" stroke={RULE} strokeWidth="1" />
          <text x="24" y="300" fontFamily="Inter, sans-serif" fontSize="11" fill={TERRACOTTA} letterSpacing="1">
            A RULE OF MY OWN
          </text>
          {sentenceLines.map((l, i) => (
            <text key={l} x="24" y={326 + i * 22} fontFamily="Literata, Georgia, serif" fontSize="15" fill={INK}>{l}</text>
          ))}
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">
          {rackLeft.length > 0
            ? 'Take a card, then drop it in a column. Drag it, or tap it and tap a column.'
            : 'Every card is in a column. Turn one over to read the reason on the back.'}
        </p>
        {rackLeft.map((card) => (
          <button key={card.id} type="button" draggable
            className={`bench-part${held === card.id ? ' is-set' : ''}`}
            onDragStart={(e) => { e.dataTransfer.setData('text/plain', card.id); setHeld(card.id); }}
            onClick={() => holdCard(card)}>
            <CardPicture card={card} width={116} />
            <span style={{ display: 'block', marginTop: '0.35rem' }}>{card.short}</span>
          </button>
        ))}
      </div>

      {held && (
        <div className="bench__tray" style={{ marginTop: '0.75rem' }}>
          <p className="bench__tray-label">Where does this one go?</p>
          {COLUMNS.map((col) => (
            <button key={col.id} type="button" className="bench-part"
              onClick={() => putDown(held, col.id)}>{col.label}</button>
          ))}
          <button type="button" className="bench-btn" onClick={() => setHeld(null)}>Put it back</button>
        </div>
      )}

      <div aria-live="polite">
        {turnedCard && (
          <div className="bench__shelf">
            <p className="bench__shelf-title">The back of the card</p>
            <p className="bench__note">{reverseLine(turnedCard, placements[turnedCard.id])}</p>
          </div>
        )}
        {showNotice && (
          <div className="bench__shelf">
            <p className="bench__shelf-title">Two keys, side by side</p>
            <p className="bench__note">{divergenceLine(placements)} {KEY_STANDS}</p>
            <div className="bench__actions">
              <button type="button" className="bench-btn" onClick={() => setNoticed(true)}>Put that away</button>
            </div>
          </div>
        )}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">The last card is blank. Build a rule of your own.</p>
        {SLOTS.map((slot) => (
          <div key={slot.id} className="bench__tray">
            <p className="bench__tray-label">{slot.label} — {slot.ask}</p>
            {chipsFor(slot.id).map((chip) => (
              <button key={chip.id} type="button"
                className={`bench-part${picks[slot.id] === chip.id ? ' is-set' : ''}`}
                aria-pressed={picks[slot.id] === chip.id}
                onClick={() => takeChip(chip.id)}>
                <Mark mark={chip.mark} color={picks[slot.id] === chip.id ? TERRACOTTA : TEAL} />
                {chip.label}
              </button>
            ))}
          </div>
        ))}
        <p className="bench__readout" style={{ marginTop: '0.5rem' }}>
          {picksSet(picks)} of {SLOTS.length} parts chosen · {CHIPS.length} chips on the bench
        </p>
        {sentence && <p className="bench__note">{sentence}</p>}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" aria-disabled={!picksComplete(picks)}
          onClick={keepRule}>Keep this rule</button>
        <button type="button" className="bench-btn"
          onClick={() => {
            if (svgRef.current) {
              void exportPlate(svgRef.current, { title: 'My rule key', lines }, 'not-the-same-rule');
            }
          }}>Save as a picture</button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print it for a grown-up</button>
        <button type="button" className="bench-btn"
          onClick={() => { setPlacements({}); setHeld(null); setTurned(null); setNoticed(false); }}>
          Sort the deck again
        </button>
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Rules kept</p>
        <ul className="bench__shelf-list">
          {rules.length === 0 && <li className="bench__kept-meta">No rules written yet.</li>}
          {rules.slice(-6).reverse().map((r) => (
            <li key={r.id} className="bench__kept">
              <span className="bench__kept-name">{r.where}</span>{' '}
              <span className="bench__kept-meta">{r.sentence}</span>
              <button type="button" className="bench-btn" aria-label={`Discard the rule for ${r.where}`}
                onClick={() => { rack.remove(r.id); setRules(rack.list()); }}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">My rule key</p>
        <p className="plate-print__line">{sortedCount(placements)} of {RULE_CARDS.length} cards sorted.</p>
        {lines.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default NotTheSameRule;
