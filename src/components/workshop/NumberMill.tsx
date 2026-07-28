import { useMemo, useRef, useState } from 'react';
import {
  BLOCKS, MAX_PARAM, MAX_SLOTS, NUMBER_MILL_META,
  describeChain, orbit, run, runDomain, trace,
} from '../../workshop/number-mill';
import type { Block, BlockKind } from '../../workshop/number-mill';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { pluck, step } from '../../workshop/tone';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';

interface Cartridge extends Kept {
  readonly chain: Block[];
  readonly start: number;
}
const rack = drawer<Cartridge>('number-mill');

const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4';
const PAPER = '#f4f0e6', TEAL = '#2a5957', TERRA = '#9e4b27', OCHRE = '#8a6416';

/** Pitch rises with value, so a chain can be heard as well as seen. */
const toneFor = (n: number) => pluck(step(Math.max(-24, Math.min(24, Math.round(n / 4) - 6))), 0.3);

export function NumberMill() {
  const [chain, setChain] = useState<Block[]>([]);
  const [start, setStart] = useState(3);
  const [looped, setLooped] = useState(false);
  const [sealed, setSealed] = useState<Cartridge | null>(null);
  const [kept, setKept] = useState<Cartridge[]>(() => rack.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const walk = useMemo(() => trace(chain, start), [chain, start]);
  const image = useMemo(() => runDomain(chain, 20), [chain]);
  const loop = useMemo(() => (looped ? orbit(chain, start) : null), [looped, chain, start]);
  const result = walk[walk.length - 1];

  const addBlock = (kind: BlockKind) => {
    if (chain.length >= MAX_SLOTS) return;
    const spec = BLOCKS.find((b) => b.kind === kind)!;
    setChain((c) => [...c, { kind, param: spec.defaultParam }]);
    say(spec.spoken);
  };
  const bumpParam = (i: number) => {
    setChain((c) => c.map((b, j) => {
      if (j !== i) return b;
      const spec = BLOCKS.find((s) => s.kind === b.kind)!;
      if (!spec.settable) return b;
      return { ...b, param: (b.param % MAX_PARAM) + 1 };
    }));
  };
  const dropBlock = (i: number) => setChain((c) => c.filter((_, j) => j !== i));

  const crank = () => {
    walk.forEach((v, i) => window.setTimeout(() => toneFor(v), i * 180));
    say(`${start} goes in. ${result} comes out.`);
  };

  const keep = () => {
    const c = rack.add({ chain, start });
    setKept(rack.list());
    setSealed(c);
  };

  const caption = [
    describeChain(chain),
    `${start} in, ${result} out`,
    looped && loop ? `${loop.ending === 'fixed' ? 'settles' : loop.ending === 'cycle' ? 'goes round' : 'keeps going'}` : '',
  ].filter(Boolean);

  // ------------------------------------------------------------------ drawing
  const cell = 34;
  const stained = new Set(image.map((p) => p.to).filter((n) => n >= 1 && n <= 100));

  return (
    <section className="bench" aria-labelledby="number-mill-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{NUMBER_MILL_META.eyebrow}</p>
          <h2 id="number-mill-title" className="bench__title">{NUMBER_MILL_META.title}</h2>
          <p className="bench__note">{NUMBER_MILL_META.note}</p>
        </div>
        <p className="bench__readout">{start} &rarr; {result}</p>
      </div>

      <div className="bench__stage">
        <svg
          ref={svgRef}
          viewBox="0 0 760 470"
          role="img"
          aria-label={`A mill of ${chain.length} blocks: ${describeChain(chain)}. ${start} goes in and ${result} comes out.`}
        >
          <rect x="0" y="0" width="760" height="470" fill={PAPER} />

          {/* the rail and its blocks */}
          <line x1="40" y1="60" x2="720" y2="60" stroke={RULE} strokeWidth="2" />
          <text x="40" y="34" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>THE CHAIN</text>
          <circle cx="52" cy="90" r="16" fill="none" stroke={INK} strokeWidth="1.5" />
          <text x="52" y="95" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="15" fill={INK}
            style={{ fontVariantNumeric: 'tabular-nums' }}>{start}</text>
          {chain.map((b, i) => {
            const x = 96 + i * 150;
            const spec = BLOCKS.find((s) => s.kind === b.kind)!;
            return (
              <g key={i}>
                <line x1={x - 24} y1="90" x2={x} y2="90" stroke={INK} strokeWidth="1.5" />
                <rect x={x} y="62" width="118" height="56" fill="none" stroke={INK} strokeWidth="1.5" />
                <text x={x + 10} y="86" fontFamily="Inter, sans-serif" fontSize="13" fill={INK}>{spec.label}</text>
                {spec.settable && Array.from({ length: b.param }, (_, k) => (
                  <circle key={k} cx={x + 14 + k * 11} cy="104" r="4" fill={TERRA} />
                ))}
                <text x={x + 108} y="134" textAnchor="end" fontFamily="Inter, sans-serif" fontSize="14" fill={FAINT}
                  style={{ fontVariantNumeric: 'tabular-nums' }}>{walk[i + 1]}</text>
              </g>
            );
          })}
          {looped && chain.length > 0 && (
            <path d={`M ${96 + (chain.length - 1) * 150 + 118} 118 q 40 60 -${(chain.length - 1) * 150 + 90} 60 q -40 0 -40 -60`}
              fill="none" stroke={OCHRE} strokeWidth="1.5" strokeDasharray="5 4" />
          )}

          {/* the hundred-square: the chain's image over 1..20 */}
          <text x="40" y="212" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>WHERE IT LANDS</text>
          <g transform="translate(40, 226)">
            {Array.from({ length: 100 }, (_, i) => {
              const n = i + 1, cx = (i % 10) * cell, cy = Math.floor(i / 10) * cell;
              return (
                <g key={n}>
                  <rect x={cx} y={cy} width={cell} height={cell} fill={stained.has(n) ? TEAL : 'none'}
                    fillOpacity={stained.has(n) ? 0.9 : 0} stroke={RULE} strokeWidth="0.6" />
                  {n % 10 === 1 && (
                    <text x={cx - 6} y={cy + 22} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="10" fill={FAINT}
                      style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</text>
                  )}
                </g>
              );
            })}
          </g>

          {/* the ribbon: 1..20 and where each one goes */}
          <g transform="translate(420, 226)">
            <text x="0" y="-14" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>EVERY NUMBER AT ONCE</text>
            {image.map((p, i) => (
              <g key={p.from} transform={`translate(0, ${i * 16})`}>
                <text x="0" y="10" fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}
                  style={{ fontVariantNumeric: 'tabular-nums' }}>{p.from}</text>
                <line x1="22" y1="6" x2="52" y2="6" stroke={RULE} strokeWidth="1" />
                <text x="60" y="10" fontFamily="Inter, sans-serif" fontSize="11" fill={INK}
                  style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {Math.abs(p.to) > 9999 ? 'off the board' : p.to}
                </text>
              </g>
            ))}
          </g>

          {looped && loop && (
            <text x="560" y="212" fontFamily="Inter, sans-serif" fontSize="12" fill={OCHRE}>
              {loop.ending === 'fixed' ? 'it settles and stops'
                : loop.ending === 'cycle' ? 'it goes round for ever'
                : loop.ending === 'off-the-board' ? 'it runs off the board'
                : 'it keeps going'}
            </text>
          )}
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">Blocks — tap to bolt one on. Tap a bolted block to change its counters.</p>
        {BLOCKS.map((b) => (
          <button key={b.kind} type="button" className="bench-part"
            aria-disabled={chain.length >= MAX_SLOTS} onClick={() => addBlock(b.kind)}>
            {b.label}
          </button>
        ))}
      </div>

      <div className="bench__row" style={{ marginTop: 'var(--space-4)' }}>
        {chain.map((b, i) => (
          <span key={i} className="bench__row">
            <button type="button" className="bench-part is-set" onClick={() => bumpParam(i)}>
              {BLOCKS.find((s) => s.kind === b.kind)!.label}
              {/* The count was shown only as dots, so reading a block meant
                  counting pips, and the control cycles one way — going from 5
                  back to 4 costs eight taps. The numeral makes it readable. */}
              {BLOCKS.find((s) => s.kind === b.kind)!.settable ? ` ${b.param}` : ''}
            </button>
            <button type="button" className="bench-btn" onClick={() => dropBlock(i)} aria-label={`Take off ${b.kind}`}>×</button>
          </span>
        ))}
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">What goes in</p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((n) => (
          <button key={n} type="button" className={`bench-part${n === start ? ' is-set' : ''}`}
            onClick={() => { setStart(n); toneFor(n); }}>{n}</button>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={crank}>Turn the crank</button>
        <button type="button" className={`bench-btn${looped ? ' bench-part is-set' : ''}`}
          aria-pressed={looped} onClick={() => setLooped((v) => !v)}>Return pipe</button>
        <button type="button" className="bench-btn" onClick={keep} aria-disabled={chain.length === 0}>Seal a cartridge</button>
        <button type="button" className="bench-btn"
          onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title: NUMBER_MILL_META.title, lines: caption }, 'number-mill'); }}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={() => { setChain([]); setLooped(false); setSealed(null); }}>Start again</button>
      </div>

      {sealed && (
        <p className="bench__note" style={{ marginTop: 'var(--space-4)' }}>
          Sealed. Ask someone to work out the rule: give them numbers and tell them only what comes out.
          {' '}
          <button type="button" className="bench-btn" onClick={() => { setSealed(null); say(describeChain(sealed.chain)); }}>
            Open it
          </button>
        </p>
      )}

      <div className="bench__shelf">
        <p className="bench__shelf-title">Sealed cartridges</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">Nothing sealed yet.</li>}
          {kept.slice(-8).reverse().map((c) => (
            <li key={c.id} className="bench__kept">
              <button type="button" className="bench-btn"
                onClick={() => { setChain(c.chain); setStart(c.start); say('loaded'); }}>
                <span className="bench__kept-name">{c.chain.length} blocks</span>{' '}
                <span className="bench__kept-meta">{run(c.chain, c.start)} out</span>
              </button>
              <button type="button" className="bench-btn" aria-label="Discard" onClick={() => { rack.remove(c.id); setKept(rack.list()); }}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{NUMBER_MILL_META.title}</p>
        {caption.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default NumberMill;
