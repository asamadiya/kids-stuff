import { useMemo, useRef, useState } from 'react';
import {
  DEFAULTS, MAX_REPEAT, MAX_TOKENS, OPS, ORNAMENT_LATHE_META, SYMMETRIES,
  catalogueLine, deepest, draw, parse, stamp, strokeCount, toPath,
} from '../../workshop/ornament-lathe';
import type { Op, Symmetry, Token, TurtleSettings } from '../../workshop/ornament-lathe';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { pluck, step as pitch } from '../../workshop/tone';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptOrnament extends Kept {
  readonly tokens: Token[];
  readonly sym: Symmetry;
  readonly settings: TurtleSettings;
  readonly line: string;
}
const rack = drawer<KeptOrnament>('ornament-lathe');

const PAPER = "#f4f0e6", INK = "#22211b", FAINT = "#6b6757", RULE = "#ddd6c4";
const SIZE = 520;
const ENDPAPER_KEY = 'ks.workshop.endpaper';

export function OrnamentLathe() {
  const [tokens, setTokens] = useState<Token[]>([
    { kind: 'repeat', times: 6 }, { kind: 'op', op: 'forward' },
    { kind: 'op', op: 'left' }, { kind: 'op', op: 'forward' }, { kind: 'end' },
  ]);
  const [sym, setSym] = useState<Symmetry>('r6');
  const [settings, setSettings] = useState<TurtleSettings>(DEFAULTS);
  const [kept, setKept] = useState<KeptOrnament[]>(() => rack.list());
  const [installed, setInstalled] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const tree = useMemo(() => parse(tokens), [tokens]);
  const path = useMemo(() => stamp(draw(tree, settings), sym), [tree, sym, settings]);
  const d = useMemo(() => toPath(path, SIZE), [path]);
  const line = useMemo(() => catalogueLine(tree, sym, settings), [tree, sym, settings]);

  const push = (t: Token) => {
    if (tokens.length >= MAX_TOKENS) return;
    setTokens((ts) => [...ts, t]);
    pluck(pitch(tokens.length % 12 - 4), 0.12);
  };
  const addOp = (op: Op) => { push({ kind: 'op', op }); say(OPS.find((o) => o.op === op)?.spoken ?? op); };
  const addRepeat = () => { push({ kind: 'repeat', times: 4 }); say('repeat'); };
  const closeRepeat = () => { push({ kind: 'end' }); say('end of the repeat'); };
  const drop = (i: number) => setTokens((ts) => ts.filter((_, j) => j !== i));
  const bump = (i: number) => setTokens((ts) => ts.map((t, j) =>
    j === i && t.kind === 'repeat' ? { ...t, times: (t.times % MAX_REPEAT) + 1 } : t));

  const install = () => {
    try {
      window.localStorage.setItem(ENDPAPER_KEY, d);
      document.documentElement.style.setProperty('--endpaper-path', `"${d}"`);
      setInstalled(true);
      say('This ornament is now the endpaper of the guide.');
    } catch { setInstalled(false); }
  };

  const openRepeats = tokens.filter((t) => t.kind === 'repeat').length
    - tokens.filter((t) => t.kind === 'end').length;

  return (
    <section className="bench" aria-labelledby="ornament-lathe-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{ORNAMENT_LATHE_META.eyebrow}</p>
          <h2 id="ornament-lathe-title" className="bench__title">{ORNAMENT_LATHE_META.title}</h2>
          <p className="bench__note">{ORNAMENT_LATHE_META.note}</p>
        </div>
        <p className="bench__readout">{strokeCount(tree)} strokes</p>
      </div>

      <div className="bench__stage">
        <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE + 46}`} role="img"
          aria-label={`An ornament: ${line}.`}>
          <rect x="0" y="0" width={SIZE} height={SIZE + 46} fill={PAPER} />
          <rect x="8" y="8" width={SIZE - 16} height={SIZE - 16} fill="none" stroke={RULE} strokeWidth="1" />
          {d ? <path d={d} fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" /> : (
            <text x={SIZE / 2} y={SIZE / 2} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
              lay out some cards
            </text>
          )}
          <line x1="8" y1={SIZE + 8} x2={SIZE - 8} y2={SIZE + 8} stroke={RULE} strokeWidth="1" />
          <text x="8" y={SIZE + 30} fontFamily="Inter, sans-serif" fontSize="12" fill={FAINT}>{line}</text>
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">
          Instruction cards. Put a repeat inside another repeat and see what happens.
        </p>
        {OPS.map((o) => (
          <button key={o.op} type="button" className="bench-part" onClick={() => addOp(o.op)}>
            <span aria-hidden="true">{o.glyph}</span> {o.label}
          </button>
        ))}
        <button type="button" className="bench-part" onClick={addRepeat}>repeat ⟨ </button>
        <button type="button" className="bench-part" aria-disabled={openRepeats <= 0} onClick={closeRepeat}>⟩ end</button>
      </div>

      <div className="bench__row" style={{ marginTop: 'var(--space-4)' }}>
        {tokens.map((t, i) => (
          <span key={i} className="bench__row">
            <button type="button" className="bench-part is-set"
              onClick={() => (t.kind === 'repeat' ? bump(i) : drop(i))}
              aria-label={t.kind === 'repeat' ? `repeat ${t.times} times` : t.kind === 'end' ? 'end of repeat' : t.op}>
              {t.kind === 'op' ? OPS.find((o) => o.op === t.op)?.label
                : t.kind === 'repeat' ? `repeat ${'•'.repeat(Math.min(t.times, 6))}${t.times > 6 ? `+${t.times - 6}` : ''}`
                : '⟩ end'}
            </button>
            <button type="button" className="bench-btn" aria-label="Take this card out" onClick={() => drop(i)}>×</button>
          </span>
        ))}
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">The stamp — how many times the whole path is laid down</p>
        {SYMMETRIES.map((s) => (
          <button key={s.id} type="button" className={`bench-part${s.id === sym ? ' is-set' : ''}`}
            onClick={() => { setSym(s.id); say(s.label); }}>{s.label}</button>
        ))}
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">How far it turns, and whether the stroke grows</p>
        {[15, 30, 45, 60, 72, 90, 120, 144].map((t) => (
          <button key={t} type="button" className={`bench-part${settings.turn === t ? ' is-set' : ''}`}
            onClick={() => setSettings((s) => ({ ...s, turn: t }))}>{t}°</button>
        ))}
        {[1, 1.03, 1.06, 1.12].map((g) => (
          <button key={g} type="button" className={`bench-part${settings.growth === g ? ' is-set' : ''}`}
            onClick={() => setSettings((s) => ({ ...s, growth: g }))}>
            {g === 1 ? 'no growth' : `+${Math.round((g - 1) * 100)}%`}
          </button>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary"
          onClick={() => { rack.add({ tokens, sym, settings, line }); setKept(rack.list()); say('kept'); }}
          aria-disabled={path.length === 0}>Keep this ornament</button>
        <button type="button" className="bench-btn" onClick={install} aria-disabled={path.length === 0}>
          {installed ? 'Endpaper set' : 'Use as endpaper'}
        </button>
        <button type="button" className="bench-btn"
          onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title: 'An ornament', lines: [line] }, 'ornament'); }}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={() => { setTokens([]); setInstalled(false); }}>Start again</button>
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Plate register</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">No ornaments filed yet.</li>}
          {kept.slice(-8).reverse().map((o, i) => (
            <li key={o.id} className="bench__kept">
              <button type="button" className="bench-btn"
                onClick={() => { setTokens([...o.tokens]); setSym(o.sym); setSettings(o.settings); }}>
                <span className="bench__kept-name">Plate {kept.length - i}</span>{' '}
                <span className="bench__kept-meta">{o.line}</span>
              </button>
              <button type="button" className="bench-btn" aria-label="Discard"
                onClick={() => { rack.remove(o.id); setKept(rack.list()); }}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">An ornament</p>
        <p className="plate-print__line">{line}</p>
        <p className="plate-print__line">repeats {deepest(tree)} deep</p>
      </div>
    </section>
  );
}

export default OrnamentLathe;
