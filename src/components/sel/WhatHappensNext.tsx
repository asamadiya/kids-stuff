import { useMemo, useRef, useState } from 'react';
import {
  STRIPS,
  WHATHAPPENSNEXT_META,
  bothWalked,
  coverageLine,
  nextStripId,
  otherRoad,
  plateFilename,
  plateLines,
  roadKey,
  roadOf,
  stripById,
  stripLine,
} from '../../sel/what-happens-next';
import type { Panel, Road, RoadId, Strip } from '../../sel/what-happens-next';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptRoad extends Kept {
  readonly key: string;
}
interface KeptPlate extends Kept {
  readonly strip: string;
  readonly title: string;
}
const roadRack = drawer<KeptRoad>('what-happens-next-roads');
const plateRack = drawer<KeptPlate>('what-happens-next');

const PAPER = '#f4f0e6';
const SUNKEN = '#eae4d5';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TEAL = '#2a5957';

const src = (p: Panel): string => `${import.meta.env.BASE_URL}games/sel/${p.image}.png`;

export function WhatHappensNext() {
  const [stripId, setStripId] = useState<string>(STRIPS[0].id);
  const [chosen, setChosen] = useState<RoadId | null>(null);
  const [extended, setExtended] = useState(false);
  const [walked, setWalked] = useState<string[]>(() => roadRack.list().map((r) => r.key));
  const [kept, setKept] = useState<KeptPlate[]>(() => plateRack.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const strip: Strip = stripById(stripId) ?? STRIPS[0];
  const complete = bothWalked(walked, strip);
  const lines = useMemo(() => plateLines(strip), [strip]);

  const walk = (id: RoadId) => {
    const road = roadOf(strip, id);
    setChosen(id);
    setExtended(false);
    const key = roadKey(strip.id, id);
    if (!walked.includes(key)) {
      roadRack.add({ key });
      setWalked((w) => [...w, key]);
    }
    pluck(step(-5));
    say(road.afterWord);
  };

  const extend = () => {
    if (!chosen) return;
    setExtended(true);
    pluck(step(-12), 0.6);
    say(roadOf(strip, chosen).laterWord);
  };

  const goToStrip = (id: string) => {
    const next = stripById(id) ?? STRIPS[0];
    setStripId(next.id);
    setChosen(null);
    setExtended(false);
    say(next.setupWord);
  };

  const keepPlate = () => {
    const svg = svgRef.current;
    if (!svg) return;
    void exportPlate(svg, { title: `Two roads: ${strip.place}`, lines }, plateFilename(strip)).then((ok) => {
      if (!ok) return;
      const made = plateRack.add({ strip: strip.id, title: strip.place });
      setKept((k) => [...k, made]);
    });
  };

  const roadRow = (road: Road) => {
    const isChosen = chosen === road.id;
    const faded = chosen !== null && !isChosen;
    return (
      <div className="bench__row" key={road.id}>
        <div className="bench__figure" style={faded ? { opacity: 0.3, filter: 'grayscale(1)' } : undefined}>
          <button
            type="button"
            className={`bench-part${isChosen ? ' is-set' : ''}`}
            aria-pressed={isChosen}
            aria-label={`Walk this road. ${road.action.alt}`}
            onClick={() => walk(road.id)}
          >
            <img
              src={src(road.action)}
              alt={road.action.alt}
              width={180}
              height={140}
              style={{ display: 'block', border: `1px solid ${RULE}` }}
            />
          </button>
          <p className="bench__figure-caption">{faded ? 'the road not taken' : 'what your hands did'}</p>
        </div>

        {isChosen && (
          <div className="bench__figure">
            <img
              src={src(road.after)}
              alt={road.after.alt}
              width={180}
              height={140}
              style={{ display: 'block', border: `1px solid ${RULE}` }}
            />
            <p className="bench__figure-caption">{road.afterWord}</p>
          </div>
        )}

        {isChosen && extended && (
          <div className="bench__figure">
            <img
              src={src(road.later)}
              alt={road.later.alt}
              width={180}
              height={140}
              style={{ display: 'block', border: `1px solid ${RULE}` }}
            />
            <p className="bench__figure-caption">{road.laterWord}</p>
          </div>
        )}
      </div>
    );
  };

  // ------------------------------------------------------- the two-road map
  const W = 560;
  const H = 300;
  const cols: Record<RoadId, number> = { a: 118, b: 342 };
  const beats = ['then', 'and then', 'later'] as const;

  return (
    <section className="bench" aria-labelledby="what-happens-next-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{WHATHAPPENSNEXT_META.eyebrow}</p>
          <h2 id="what-happens-next-title" className="bench__title">{WHATHAPPENSNEXT_META.title}</h2>
          <p className="bench__note">{WHATHAPPENSNEXT_META.note}</p>
        </div>
        <p className="bench__readout">{coverageLine(walked)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row">
          <div className="bench__figure">
            <img
              src={src(strip.setup)}
              alt={strip.setup.alt}
              width={240}
              height={186}
              style={{ display: 'block', border: `1px solid ${RULE}` }}
            />
            <p className="bench__figure-caption">{strip.setupWord}</p>
          </div>
          <button type="button" className="bench-btn" onClick={() => say(strip.setupWord)}>
            Read this out
          </button>
        </div>

        {strip.roads.map(roadRow)}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={stripLine(walked, strip)}
        >
          <rect x="0" y="0" width={W} height={H} fill={PAPER} />
          <text x="24" y="30" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="1.6" fill={FAINT}>
            TWO ROADS — {strip.place.toUpperCase()}
          </text>
          <line x1="24" y1="42" x2={W - 24} y2="42" stroke={RULE} strokeWidth="1" />

          <rect x={W / 2 - 34} y="56" width="68" height="44" fill={SUNKEN} stroke={INK} strokeWidth="1.2" />
          <text x={W / 2} y="118" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}>
            here
          </text>

          {strip.roads.map((road) => {
            const x = cols[road.id];
            const isWalked = walked.includes(roadKey(strip.id, road.id));
            const live = chosen === road.id;
            const reached = live ? (extended ? 3 : 2) : isWalked ? 3 : 0;
            return (
              <g key={road.id}>
                <path
                  d={`M ${W / 2} 100 V 128 H ${x + 34} V 142`}
                  fill="none"
                  stroke={isWalked ? INK : RULE}
                  strokeWidth={isWalked ? 1.4 : 1}
                  strokeDasharray={isWalked ? undefined : '3 4'}
                />
                {beats.map((beat, i) => {
                  const y = 142 + i * 50;
                  const drawn = i < reached;
                  return (
                    <g key={beat}>
                      {i > 0 && (
                        <line
                          x1={x + 34}
                          y1={y - 12}
                          x2={x + 34}
                          y2={y}
                          stroke={drawn ? INK : RULE}
                          strokeWidth="1"
                        />
                      )}
                      <rect
                        x={x}
                        y={y}
                        width="68"
                        height="38"
                        fill={drawn ? SUNKEN : 'none'}
                        stroke={drawn ? INK : RULE}
                        strokeWidth={drawn ? 1.2 : 1}
                        strokeDasharray={drawn ? undefined : '3 4'}
                      />
                      <text
                        x={x + 78}
                        y={y + 23}
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fill={drawn ? INK : RULE}
                      >
                        {beat}
                      </text>
                    </g>
                  );
                })}
                <text
                  x={x + 34}
                  y={H - 16}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize="10"
                  fill={isWalked ? TEAL : FAINT}
                >
                  {isWalked ? 'walked' : 'not opened'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">{stripLine(walked, strip)} Tap a picture to move to another strip.</p>
        {STRIPS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`bench-part${s.id === strip.id ? ' is-set' : ''}`}
            aria-pressed={s.id === strip.id}
            aria-label={`Go to the strip at ${s.place}. ${s.setup.alt}`}
            onClick={() => goToStrip(s.id)}
          >
            <img
              src={src(s.setup)}
              alt={s.setup.alt}
              width={72}
              height={56}
              style={{ display: 'block', border: `1px solid ${RULE}` }}
            />
          </button>
        ))}
      </div>

      <div className="bench__actions">
        {chosen !== null && !extended && (
          <button type="button" className="bench-btn bench-btn--primary" onClick={extend}>
            Later that day
          </button>
        )}
        {chosen !== null && (
          <button type="button" className="bench-btn" onClick={() => walk(otherRoad(chosen))}>
            Go back and walk the other road
          </button>
        )}
        <button
          type="button"
          className={`bench-btn${chosen === null || extended ? ' bench-btn--primary' : ''}`}
          onClick={() => goToStrip(nextStripId(strip.id))}
        >
          Next strip
        </button>
        <button type="button" className="bench-btn" onClick={keepPlate} disabled={!complete}>
          Keep this two-road plate
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>
          Print
        </button>
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Plates kept</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && (
            <li className="bench__kept">
              <span className="bench__kept-meta">A strip with both roads walked can be kept as a plate.</span>
            </li>
          )}
          {kept.map((k) => (
            <li key={k.id} className="bench__kept">
              <span className="bench__kept-name">{k.title}</span>
              <span className="bench__kept-meta">{k.made.slice(0, 10)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">Two roads: {strip.place}</p>
        {lines.map((line) => (
          <p key={line} className="plate-print__line">{line}</p>
        ))}
      </div>
    </section>
  );
}

export default WhatHappensNext;
