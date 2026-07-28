import { useMemo, useRef, useState } from 'react';
import {
  ACTION_FIELD,
  PALM,
  STRIPS,
  THINGS,
  WHATHAPPENSNEXT_META,
  actionWordOf,
  arrowOf,
  bothWalked,
  coverageLine,
  drawingOf,
  nextStripId,
  otherRoad,
  placeSays,
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

/**
 * The action, drawn. Hands, the thing, and an arrow whose direction comes from
 * the same record that places the other person's hands — so "out to him" cannot
 * be printed over a drawing of him handing it to you.
 */
function Action({ strip, road }: { strip: Strip; road: Road }) {
  const d = drawingOf(road);
  const arrow = arrowOf(d);
  const thing = THINGS[road.thing];
  const { width, height } = ACTION_FIELD;
  const hand = (h: { x: number; y: number; turn: number }, i: number, colour: string) => (
    <g key={`${colour}-${i}`} transform={`translate(${h.x} ${h.y}) rotate(${h.turn})`}>
      <path d={PALM} fill="none" stroke={colour} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true"
      focusable="false" style={{ display: 'block', border: `1px solid ${RULE}`, background: PAPER }}>
      <g transform={`translate(${d.thing.x - 24} ${d.thing.y - 24})`}>
        {thing.glyph.map((p) => (
          <path key={p} d={p} fill="none" stroke={INK} strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </g>
      {d.yours.map((h, i) => hand(h, i, INK))}
      {d.theirs.map((h, i) => hand(h, i, FAINT))}
      {arrow && (
        <g stroke={TEAL} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} />
          <path d={headOf(arrow)} />
        </g>
      )}
      <text x="10" y={height - 10} fontFamily="Inter, sans-serif" fontSize="10" letterSpacing="1.2" fill={FAINT}>
        {road.gesture.toUpperCase()}
      </text>
      <text x={width - 10} y={height - 10} textAnchor="end" fontFamily="Inter, sans-serif"
        fontSize="10" letterSpacing="1.2" fill={FAINT}>
        {strip.other.name.toUpperCase()}
      </text>
    </svg>
  );
}

/** A short arrow head at the far end, turned along the line. */
function headOf(a: { x1: number; y1: number; x2: number; y2: number }): string {
  const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
  const wing = (turn: number) => [
    a.x2 - Math.cos(angle + turn) * 8,
    a.y2 - Math.sin(angle + turn) * 8,
  ];
  const [lx, ly] = wing(0.45);
  const [rx, ry] = wing(-0.45);
  return `M${lx.toFixed(1)} ${ly.toFixed(1)} L${a.x2} ${a.y2} L${rx.toFixed(1)} ${ry.toFixed(1)}`;
}

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
    say(`${actionWordOf(strip, road)} ${road.afterWord}`);
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
    void exportPlate(svg, { title: `Two roads: ${placeSays(strip.place)}`, lines }, plateFilename(strip)).then((ok) => {
      if (!ok) return;
      const made = plateRack.add({ strip: strip.id, title: placeSays(strip.place) });
      setKept((k) => [...k, made]);
    });
  };

  /**
   * The two roads sit side by side so the fork reads as one choice rather than
   * two sequential steps. Each is a drawing of what the hands do, and its label
   * is generated from the same (gesture, thing) the drawing is generated from.
   */
  const roadChoice = (road: Road) => {
    const isChosen = chosen === road.id;
    const faded = chosen !== null && !isChosen;
    const word = actionWordOf(strip, road);
    return (
      <div
        className="bench__figure"
        key={road.id}
        style={faded ? { opacity: 0.3, filter: 'grayscale(1)' } : undefined}
      >
        <button
          type="button"
          className={`bench-part${isChosen ? ' is-set' : ''}`}
          aria-pressed={isChosen}
          aria-label={word}
          onClick={() => walk(road.id)}
        >
          <Action strip={strip} road={road} />
        </button>
        <p className="bench__figure-caption">{word}</p>
        {faded && <p className="bench__figure-caption">the road not taken</p>}
      </div>
    );
  };

  const walkedRoad = strip.roads.find((r) => r.id === chosen);

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

        <div className="bench__row">{strip.roads.map(roadChoice)}</div>

        {walkedRoad && (
          <div className="bench__row">
            <div className="bench__figure">
              <img
                src={src(walkedRoad.after)}
                alt={walkedRoad.after.alt}
                width={200}
                height={156}
                style={{ display: 'block', border: `1px solid ${RULE}` }}
              />
              <p className="bench__figure-caption">{walkedRoad.afterWord}</p>
            </div>

            {extended && (
              <div className="bench__figure">
                <img
                  src={src(walkedRoad.later)}
                  alt={walkedRoad.later.alt}
                  width={200}
                  height={156}
                  style={{ display: 'block', border: `1px solid ${RULE}` }}
                />
                <p className="bench__figure-caption">{walkedRoad.laterWord}</p>
              </div>
            )}
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={stripLine(walked, strip)}
        >
          <rect x="0" y="0" width={W} height={H} fill={PAPER} />
          <text x="24" y="30" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="1.6" fill={FAINT}>
            TWO ROADS — {placeSays(strip.place).toUpperCase()}
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
            aria-label={`Go to the strip at ${placeSays(s.place)}. ${s.setup.alt}`}
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
        <p className="plate-print__title">Two roads: {placeSays(strip.place)}</p>
        {lines.map((line) => (
          <p key={line} className="plate-print__line">{line}</p>
        ))}
      </div>
    </section>
  );
}

export default WhatHappensNext;
