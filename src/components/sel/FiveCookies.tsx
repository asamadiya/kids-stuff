import { useMemo, useRef, useState } from 'react';
import {
  FIVE_COOKIES_META, SCENARIOS,
  adjust, claimLines, compareLines, emptyShares, isComplete, outcomes,
  placed, plateLines, plateTitle, remaining, scenarioById, servedLines, splitLine, word,
} from '../../sel/five-cookies';
import type { Outcome, Scenario, Shares } from '../../sel/five-cookies';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptServing extends Kept {
  readonly scenario: string;
  readonly title: string;
  readonly first: readonly number[];
  readonly second: readonly number[] | null;
}
const rack = drawer<KeptServing>('five-cookies');

const PAPER = '#f4f0e6', RAISED = '#fbf9f4', SUNKEN = '#eae4d5';
const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4';
const TERRA = '#9e4b27', OCHRE = '#8a6416', TEAL = '#2a5957';

const boardArt = (id: string) => `${import.meta.env.BASE_URL}games/sel/${id}.png`;
const faceArt = (id: string) => `${import.meta.env.BASE_URL}games/faces/${id}.png`;

const ROWS = 2, ROW_H = 158, HEAD_H = 58, SUM_W = 720;

/** The ink mark under a portrait on the exported plate: up, flat, or down. */
function markPath(o: Outcome, x: number, y: number): string {
  if (o === 'met') return `M ${x - 13} ${y + 4} Q ${x} ${y - 9} ${x + 13} ${y + 4}`;
  if (o === 'none') return `M ${x - 13} ${y - 4} Q ${x} ${y + 9} ${x + 13} ${y - 4}`;
  return `M ${x - 13} ${y} L ${x + 13} ${y}`;
}

export function FiveCookies() {
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);
  const [shares, setShares] = useState<number[]>(() => emptyShares(SCENARIOS[0]));
  const [served, setServed] = useState(false);
  const [first, setFirst] = useState<number[] | null>(null);
  const [second, setSecond] = useState<number[] | null>(null);
  const [servings, setServings] = useState(0);
  const [kept, setKept] = useState<KeptServing[]>(() => rack.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const scenario: Scenario = useMemo(() => scenarioById(scenarioId), [scenarioId]);
  const left = remaining(scenario, shares);
  const done = isComplete(scenario, shares);
  const state = served ? outcomes(scenario, shares) : null;
  const attempt = first === null ? 'First way' : 'Second way';
  const totalServings = SCENARIOS.length * ROWS;

  const openBoard = (s: Scenario) => {
    setScenarioId(s.id);
    setShares(emptyShares(s));
    setServed(false);
    setFirst(null);
    setSecond(null);
    say(claimLines(s).join(' '));
  };

  const bump = (index: number, delta: number) => {
    if (served) return;
    setShares((cur) => adjust(scenario, cur, index, delta));
    pluck(step(delta > 0 ? 4 : -3), 0.18);
  };

  const serve = () => {
    if (!done || served) return;
    setServed(true);
    if (first === null) setFirst(shares);
    else setSecond(shares);
    setServings((n) => n + 1);
    say(servedLines(scenario, shares).join(' '));
  };

  const again = () => {
    if (!served || second !== null) return;
    setShares(emptyShares(scenario));
    setServed(false);
    say(`The same table again. ${scenario.setting}`);
  };

  const keep = () => {
    if (first === null) return;
    rack.add({ scenario: scenario.id, title: plateTitle(scenario), first, second });
    setKept(rack.list());
    say('kept');
  };

  const rows: { label: string; shares: Shares }[] = [];
  if (first) rows.push({ label: 'FIRST WAY', shares: first });
  if (second) rows.push({ label: 'SECOND WAY', shares: second });
  const sumH = HEAD_H + Math.max(1, rows.length) * ROW_H + 16;
  const colW = (SUM_W - 150) / scenario.claimants.length;
  const caption = plateLines(scenario, first ?? shares, second);

  return (
    <section className="bench" aria-labelledby="five-cookies-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{FIVE_COOKIES_META.eyebrow}</p>
          <h2 id="five-cookies-title" className="bench__title">{FIVE_COOKIES_META.title}</h2>
          <p className="bench__note">{FIVE_COOKIES_META.note}</p>
        </div>
        <p className="bench__readout">
          {servings} of {totalServings} servings laid out
        </p>
      </div>

      <div className="bench__stage">
        <img
          src={boardArt(scenario.plate)}
          alt={scenario.alt}
          style={{ display: 'block', width: '100%', maxWidth: '640px', margin: '0 auto',
            border: `1px solid ${RULE}`, background: RAISED }}
        />
        <p className="bench__figure-caption" style={{ textAlign: 'center', marginTop: '0.6rem' }}>
          {attempt}. {served ? splitLine(shares) : `${word(left)} ${left === 1 ? scenario.unit : scenario.unitPlural} still to hand out.`}
        </p>

        <div className="bench__row" style={{ justifyContent: 'center', marginTop: '0.9rem', alignItems: 'flex-start' }}>
          {scenario.claimants.map((c, i) => {
            const share = shares[i] ?? 0;
            const face = state ? c.portrait[state[i]] : c.portrait.waiting;
            return (
              <div
                key={c.id}
                className="bench__figure"
                style={{ flex: '1 1 9rem', maxWidth: '13rem', padding: '0.5rem',
                  border: `1px solid ${RULE}`, background: served ? SUNKEN : RAISED }}
                onDragOver={(e) => { if (!served && left > 0) e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); bump(i, 1); }}
              >
                <img
                  src={faceArt(face)}
                  alt={served
                    ? `${c.name}, after it was served`
                    : `${c.name}, waiting to see what they get`}
                  style={{ width: '84px', height: '84px', objectFit: 'cover',
                    border: `1px solid ${RULE}`, background: PAPER }}
                />
                <svg viewBox="0 0 132 58" role="img"
                  aria-label={`${c.name} has ${word(share)} ${share === 1 ? scenario.unit : scenario.unitPlural}`}
                  style={{ width: '100%', maxWidth: '132px' }}>
                  <ellipse cx="66" cy="44" rx="52" ry="11" fill="none" stroke={RULE} strokeWidth="1.2" />
                  <ellipse cx="66" cy="44" rx="42" ry="7" fill="none" stroke={RULE} strokeWidth="0.8" />
                  {Array.from({ length: share }, (_, k) => (
                    <circle key={k}
                      cx={66 + (k - (share - 1) / 2) * 15}
                      cy={share > 4 && k % 2 === 1 ? 22 : 33}
                      r="6.5" fill={c.isYou ? TEAL : TERRA} />
                  ))}
                </svg>
                <p className="bench__figure-caption" style={{ textAlign: 'center' }}>
                  {c.name} &middot; {word(share)}
                </p>
                <div className="bench__row" style={{ justifyContent: 'center' }}>
                  <button type="button" className="bench-btn"
                    aria-label={`Take one ${scenario.unit} back from ${c.name}`}
                    aria-disabled={served || share === 0}
                    onClick={() => bump(i, -1)}>&minus;</button>
                  <button type="button" className="bench-btn"
                    aria-label={`Give one more ${scenario.unit} to ${c.name}`}
                    aria-disabled={served || left === 0}
                    onClick={() => bump(i, 1)}>+</button>
                </div>
                {served && state && (
                  <p className="bench__kept-meta" style={{ textAlign: 'center' }}>
                    {c.reaction[state[i]]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">
          {served
            ? 'Served. Nothing left to move on this one.'
            : `Drag a ${scenario.unit} onto a plate, or use plus and minus. ${word(left)} left.`}
        </p>
        {!served && Array.from({ length: left }, (_, k) => (
          <span key={k} draggable aria-hidden="true"
            onDragStart={(e) => e.dataTransfer.setData('text/plain', scenario.unit)}
            style={{ display: 'inline-block', width: '26px', height: '26px', borderRadius: '50%',
              background: TERRA, border: `1px solid ${INK}`, cursor: 'grab' }} />
        ))}
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">What each person says</p>
        {scenario.claimants.map((c) => (
          <button key={c.id} type="button" className="bench-part bench-part--wide"
            onClick={() => say(c.claim)}>{c.claim}</button>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary"
          aria-disabled={!done || served} onClick={serve}>Serve it</button>
        <button type="button" className="bench-btn"
          aria-disabled={!served || second !== null} onClick={again}>Try it another way</button>
        <button type="button" className="bench-btn"
          aria-disabled={first === null} onClick={keep}>Keep this plate</button>
        <button type="button" className="bench-btn"
          onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title: plateTitle(scenario), lines: caption }, 'five-cookies'); }}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={() => openBoard(scenario)}>Start this one again</button>
      </div>

      <div className="bench__stage">
        <svg ref={svgRef} viewBox={`0 0 ${SUM_W} ${sumH}`} role="img"
          aria-label={first
            ? `The record: ${rows.map((r) => `${r.label.toLowerCase()}, ${splitLine(r.shares)}`).join(' ')}`
            : 'The record. Nothing served yet.'}>
          <rect x="0" y="0" width={SUM_W} height={sumH} fill={PAPER} />
          <text x="22" y="30" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            {plateTitle(scenario).toUpperCase()} &mdash; {scenario.claimants.length} PEOPLE
          </text>
          <line x1="22" y1="44" x2={SUM_W - 22} y2="44" stroke={RULE} strokeWidth="1" />
          {rows.length === 0 && (
            <text x="22" y={HEAD_H + 40} fontFamily="Inter, sans-serif" fontSize="14" fill={FAINT}>
              Nothing served yet.
            </text>
          )}
          {rows.map((row, r) => {
            const top = HEAD_H + r * ROW_H;
            const os = outcomes(scenario, row.shares);
            return (
              <g key={row.label}>
                <text x="22" y={top + 26} fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="1.4" fill={OCHRE}>
                  {row.label}
                </text>
                {r > 0 && <line x1="22" y1={top - 8} x2={SUM_W - 22} y2={top - 8} stroke={RULE} strokeWidth="1" />}
                {scenario.claimants.map((c, i) => {
                  const cx = 150 + colW * i + colW / 2;
                  const n = row.shares[i] ?? 0;
                  return (
                    <g key={c.id}>
                      {Array.from({ length: n }, (_, k) => (
                        <circle key={k} cx={cx + (k - (n - 1) / 2) * 14}
                          cy={n > 4 && k % 2 === 1 ? top + 26 : top + 40}
                          r="6" fill={c.isYou ? TEAL : TERRA} />
                      ))}
                      <ellipse cx={cx} cy={top + 56} rx="46" ry="10" fill="none" stroke={RULE} strokeWidth="1.2" />
                      <text x={cx} y={top + 86} textAnchor="middle" fontFamily="Literata, Georgia, serif"
                        fontSize="15" fill={INK}>{c.name}</text>
                      <text x={cx} y={top + 104} textAnchor="middle" fontFamily="Inter, sans-serif"
                        fontSize="12" fill={FAINT}>{word(n)}</text>
                      <path d={markPath(os[i], cx, top + 126)} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {first && second && (
        <div className="bench__shelf">
          <p className="bench__shelf-title">Two ways, side by side</p>
          <ul className="bench__shelf-list" style={{ display: 'block' }}>
            {compareLines(scenario, first, second).map((line) => (
              <li key={line} className="bench__kept-meta" style={{ display: 'block', marginTop: '0.35rem' }}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">A different table</p>
        {SCENARIOS.map((s) => (
          <button key={s.id} type="button"
            className={`bench-part${s.id === scenario.id ? ' is-set' : ''}`}
            onClick={() => openBoard(s)}>
            {plateTitle(s)}
          </button>
        ))}
      </div>

      {kept.length > 0 && (
        <div className="bench__shelf">
          <p className="bench__shelf-title">Plates you kept</p>
          <ul className="bench__shelf-list">
            {kept.map((k) => (
              <li key={k.id} className="bench__kept">
                <span className="bench__kept-name">{k.title}</span>
                <span className="bench__kept-meta">
                  {splitLine(k.first)}{k.second ? ` then ${splitLine(k.second)}` : ''}
                </span>
                <button type="button" className="bench-btn"
                  aria-label={`Take ${k.title} off the shelf`}
                  onClick={() => { rack.remove(k.id); setKept(rack.list()); }}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="plate-print">
        <p className="plate-print__title">{plateTitle(scenario)}</p>
        {caption.map((line) => (
          <p key={line} className="plate-print__line">{line}</p>
        ))}
        <p className="plate-print__line">
          {placed(shares)} of {scenario.units} {scenario.unitPlural} on plates.
        </p>
      </div>
    </section>
  );
}

export default FiveCookies;
