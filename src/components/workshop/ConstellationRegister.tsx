import { useMemo, useRef, useState } from 'react';
import {
  ARRANGEMENTS, CONSTELLATION_REGISTER_META, ERA_SHORT, NAME_ICONS, SKY,
  describeSky, figureCaption, nearest, project, ringRadius, starBySlug, starsFor, storyRoute,
} from '../../workshop/constellation-register';
import type { Arrangement, Placed } from '../../workshop/constellation-register';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { pluck, step } from '../../workshop/tone';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';

interface Figure extends Kept {
  readonly name: string;
  readonly icon: string;
  readonly slugs: readonly string[];
}
const rack = drawer<Figure>('constellation-register');

const NIGHT = '#22211b', PAPER = '#f4f0e6', FAINT = '#6b6757', RULE = '#ddd6c4', OCHRE = '#8a6416';

export function ConstellationRegister() {
  const [mode, setMode] = useState<Arrangement>('time');
  const [joined, setJoined] = useState<string[]>([]);
  const [figures, setFigures] = useState<Figure[]>(() => rack.list());
  const [sighted, setSighted] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const placed = useMemo(() => project(mode), [mode]);
  const byId = useMemo(() => new Map(placed.map((p) => [p.slug, p])), [placed]);
  const facts = useMemo(() => (joined.length >= 2 ? figureCaption(starsFor(joined)) : []), [joined]);

  const tapSky = (evt: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * SKY.width;
    const y = ((evt.clientY - rect.top) / rect.height) * SKY.height;
    const hit: Placed | null = nearest(placed, x, y);
    if (!hit) return;
    const star = starBySlug(hit.slug);
    setSighted(hit.slug);
    if (star) say(star.title);
    pluck(step(Math.round((star?.eraIndex ?? 3) * 3) - 6), 0.25);
    setJoined((j) => (j.includes(hit.slug) ? j.filter((s) => s !== hit.slug) : [...j, hit.slug]));
  };

  const keep = (icon: string, name: string) => {
    if (joined.length < 3) return;
    rack.add({ name, icon, slugs: [...joined] });
    setFigures(rack.list());
    setJoined([]);
  };

  const sightedStar = sighted ? starBySlug(sighted) : undefined;
  const summary = describeSky({
    mode, total: placed.length, joined: joined.length, figures: figures.length,
    sighted: sightedStar?.title,
  });

  const lines = joined.length >= 2 ? facts : [`${placed.length} accounts. Nothing joined yet.`];

  return (
    <section className="bench" aria-labelledby="constellation-register-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{CONSTELLATION_REGISTER_META.eyebrow}</p>
          <h2 id="constellation-register-title" className="bench__title">{CONSTELLATION_REGISTER_META.title}</h2>
          <p className="bench__note">{CONSTELLATION_REGISTER_META.note}</p>
        </div>
        <p className="bench__readout">{joined.length} joined</p>
      </div>

      <div className="bench__stage">
        <svg ref={svgRef} viewBox={`0 0 ${SKY.width} ${SKY.height}`} role="img" aria-label={summary}
          onClick={tapSky} style={{ cursor: 'crosshair' }}>
          <rect x="0" y="0" width={SKY.width} height={SKY.height} fill={NIGHT} />
          {ERA_SHORT.map((band, i) => (
            <g key={band}>
              <circle cx={SKY.cx} cy={SKY.cy} r={ringRadius(i)} fill="none" stroke="#3a382f" strokeWidth="0.8" />
              <text x={SKY.cx + ringRadius(i) + 4} y={SKY.cy - 4} fontFamily="Inter, sans-serif" fontSize="9" fill="#6f6a5c">
                {band}
              </text>
            </g>
          ))}
          {/* lines of the figure being drawn */}
          {joined.slice(1).map((slug, i) => {
            const a = byId.get(joined[i]), b = byId.get(slug);
            if (!a || !b) return null;
            return <line key={slug} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={OCHRE} strokeWidth="1.2" />;
          })}
          {/* kept figures, drawn faint so they deform visibly when the sky is re-sorted */}
          {figures.map((f) => f.slugs.slice(1).map((slug, i) => {
            const a = byId.get(f.slugs[i]), b = byId.get(slug);
            if (!a || !b) return null;
            return <line key={`${f.id}-${slug}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="#5b564a" strokeWidth="0.8" strokeDasharray="3 3" />;
          }))}
          {placed.map((p) => (
            <circle key={p.slug} cx={p.x} cy={p.y} r={joined.includes(p.slug) ? p.size + 1.6 : p.size}
              fill={joined.includes(p.slug) ? OCHRE : p.color}
              stroke={sighted === p.slug ? PAPER : 'none'} strokeWidth="1.2" />
          ))}
          {sightedStar && (
            <text x="16" y={SKY.height - 16} fontFamily="Inter, sans-serif" fontSize="12" fill={PAPER}>
              {sightedStar.title} · {sightedStar.place} · {sightedStar.yearLabel}
            </text>
          )}
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">
          {ARRANGEMENTS.find((a) => a.id === mode)?.note} Tap a star to join it; tap it again to let it go.
        </p>
        {ARRANGEMENTS.map((a) => (
          <button key={a.id} type="button" className={`bench-part${a.id === mode ? ' is-set' : ''}`}
            onClick={() => { setMode(a.id); say(a.label); }}>{a.label}</button>
        ))}
      </div>

      {joined.length >= 3 && (
        <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
          <p className="bench__tray-label">Name the figure by choosing a mark for it.</p>
          {NAME_ICONS.slice(0, 14).map((t) => (
            <button key={t.label} type="button" className="bench-part"
              onClick={() => keep(t.emoji, t.label)}>{t.emoji} {t.label}</button>
          ))}
        </div>
      )}

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" aria-disabled={joined.length < 3}
          onClick={() => { if (joined.length >= 3) say('Choose a mark to name it.'); }}>
          Close the figure
        </button>
        <button type="button" className="bench-btn"
          onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title: 'A register of figures', lines }, 'constellation-register'); }}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={() => { setJoined([]); setSighted(null); }}>Start again</button>
      </div>

      {facts.length > 0 && (
        <div className="bench__shelf">
          <p className="bench__shelf-title">What this figure spans</p>
          {facts.map((f) => <p key={f} className="bench__kept-meta">{f}</p>)}
        </div>
      )}

      <div className="bench__shelf">
        <p className="bench__shelf-title">Table of figures</p>
        <ul className="bench__shelf-list">
          {figures.length === 0 && <li className="bench__kept-meta">No figures drawn yet.</li>}
          {figures.slice(-8).reverse().map((f) => (
            <li key={f.id} className="bench__kept">
              <button type="button" className="bench-btn" onClick={() => setJoined([...f.slugs])}>
                <span className="bench__kept-name">{f.icon} {f.name}</span>{' '}
                <span className="bench__kept-meta">{f.slugs.length} stars</span>
              </button>
              <button type="button" className="bench-btn"
                onClick={() => { const s = f.slugs[0]; if (s) window.location.hash = storyRoute(s); }}>
                Read it
              </button>
              <button type="button" className="bench-btn" aria-label="Discard"
                onClick={() => { rack.remove(f.id); setFigures(rack.list()); }}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">A register of figures</p>
        {lines.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default ConstellationRegister;
