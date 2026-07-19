import type { ReactNode } from 'react';
import type { Story, StoryPage } from '../types';

/**
 * Shared illustration toolkit.
 *
 * These are small, composable SVG primitives — gradients, texture, lighting,
 * sky bodies, foliage, water, sound, and character/face atoms — that every
 * story world draws from. They are intentionally low-level: each story world
 * arranges them into its own composition so no single template is reused.
 */

/** The drawing surface every scene shares (a calm 3:2 picture-book frame). */
export const VIEW_W = 1200;
export const VIEW_H = 800;

/** Props handed to every story-world renderer by <Scene>. */
export interface SceneWorldProps {
  readonly story: Story;
  readonly page: StoryPage;
  /** True only wires a stable hook for Task 5; nothing animates in this task. */
  readonly motionEnabled: boolean;
  /** Build an id that is unique to this <Scene> instance (for <defs>). */
  readonly id: (name: string) => string;
  /** Build a `url(#id)` paint reference matching {@link SceneWorldProps.id}. */
  readonly paint: (name: string) => string;
  /** Deterministic seed derived from the page's scene id. */
  readonly seed: number;
}

export type SceneWorld = (props: SceneWorldProps) => ReactNode;

/* -------------------------------------------------------------------------- */
/* Deterministic maths (no Math.random, so renders are stable and NaN-free)   */
/* -------------------------------------------------------------------------- */

/** FNV-1a hash → a stable non-negative integer seed from any string. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Small, fast seeded PRNG returning a float in [0, 1). Always finite. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to 2dp and guarantee a finite number (kills any stray NaN). */
export const n = (value: number): number =>
  Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;

export const range = (count: number): number[] =>
  Array.from({ length: Math.max(0, Math.floor(count)) }, (_, i) => i);

/** A point on a circle, in SVG coordinates. */
export const polar = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): [number, number] => {
  const a = (angleDeg * Math.PI) / 180;
  return [n(cx + r * Math.cos(a)), n(cy + r * Math.sin(a))];
};

/* -------------------------------------------------------------------------- */
/* Gradients, texture and lighting                                            */
/* -------------------------------------------------------------------------- */

export interface Stop {
  readonly offset: number;
  readonly color: string;
  readonly opacity?: number;
}

interface GradientProps {
  readonly id: string;
  readonly stops: readonly Stop[];
}

const renderStops = (stops: readonly Stop[]): ReactNode =>
  stops.map((stop, i) => (
    <stop
      key={i}
      offset={`${n(stop.offset * 100)}%`}
      stopColor={stop.color}
      stopOpacity={stop.opacity ?? 1}
    />
  ));

/** Vertical (or angled) linear gradient for skies, water and cloth. */
export function LinearGradient({
  id,
  stops,
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 1,
}: GradientProps & { x1?: number; y1?: number; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {renderStops(stops)}
    </linearGradient>
  );
}

/** Radial gradient for glows, moons, lamps and vignettes. */
export function RadialGradient({
  id,
  stops,
  cx = 0.5,
  cy = 0.5,
  r = 0.5,
}: GradientProps & { cx?: number; cy?: number; r?: number }) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      {renderStops(stops)}
    </radialGradient>
  );
}

/** Subtle film grain, applied as a faint full-bleed overlay. */
export function GrainFilter({
  id,
  frequency = 0.9,
  opacity = 0.05,
}: {
  id: string;
  frequency?: number;
  opacity?: number;
}) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={frequency}
        numOctaves={2}
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix in="noise" type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope={opacity} />
      </feComponentTransfer>
    </filter>
  );
}

/** Gaussian soft-focus, used to push midground depth back a touch. */
export function SoftBlur({ id, amount = 6 }: { id: string; amount?: number }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={amount} />
    </filter>
  );
}

/** A full-frame grain wash. Pair with a {@link GrainFilter} of the same id. */
export function GrainWash({ filter }: { filter: string }) {
  return (
    <rect
      x={0}
      y={0}
      width={VIEW_W}
      height={VIEW_H}
      filter={filter}
      className="scene-grain"
      pointerEvents="none"
    />
  );
}

/** Soft darkened corners for a cradled, storybook focus. */
export function Vignette({ paint }: { paint: string }) {
  return (
    <rect
      x={0}
      y={0}
      width={VIEW_W}
      height={VIEW_H}
      fill={paint}
      className="scene-vignette"
      pointerEvents="none"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Sky bodies: moon, sun glow, stars                                          */
/* -------------------------------------------------------------------------- */

export function Moon({
  cx,
  cy,
  r,
  glow,
  face = '#f7f3e3',
  craters = true,
}: {
  cx: number;
  cy: number;
  r: number;
  glow?: string;
  face?: string;
  craters?: boolean;
}) {
  return (
    <g className="scene-moon">
      {glow ? <circle cx={cx} cy={cy} r={n(r * 2.6)} fill={glow} /> : null}
      <circle cx={cx} cy={cy} r={r} fill={face} />
      {craters ? (
        <g fill="#e2dcc4" opacity={0.7}>
          <circle cx={n(cx - r * 0.35)} cy={n(cy - r * 0.2)} r={n(r * 0.18)} />
          <circle cx={n(cx + r * 0.28)} cy={n(cy + r * 0.12)} r={n(r * 0.12)} />
          <circle cx={n(cx + r * 0.05)} cy={n(cy - r * 0.42)} r={n(r * 0.09)} />
        </g>
      ) : null}
    </g>
  );
}

export function SunGlow({
  cx,
  cy,
  r,
  core = '#fff3cf',
  halo,
}: {
  cx: number;
  cy: number;
  r: number;
  core?: string;
  halo?: string;
}) {
  return (
    <g className="scene-sun">
      {halo ? <circle cx={cx} cy={cy} r={n(r * 3)} fill={halo} /> : null}
      <circle cx={cx} cy={cy} r={r} fill={core} />
    </g>
  );
}

/** A 4-point sparkle glyph centred on (cx, cy). */
export function Star({
  cx,
  cy,
  r,
  fill = '#fdf6d8',
  waist = 0.26,
  className,
}: {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  waist?: number;
  className?: string;
}) {
  const w = n(r * waist);
  const d = `M${cx},${n(cy - r)} L${n(cx + w)},${n(cy - w)} L${n(cx + r)},${cy} L${n(
    cx + w,
  )},${n(cy + w)} L${cx},${n(cy + r)} L${n(cx - w)},${n(cy + w)} L${n(
    cx - r,
  )},${cy} L${n(cx - w)},${n(cy - w)} Z`;
  return <path d={d} fill={fill} className={className} />;
}

/** Deterministic scatter of small round stars within a rectangle. */
export function StarField({
  seed,
  count,
  x = 0,
  y = 0,
  width = VIEW_W,
  height = VIEW_H,
  color = '#e9eefb',
  minR = 1.2,
  maxR = 3.2,
}: {
  seed: number;
  count: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  minR?: number;
  maxR?: number;
}) {
  const rand = mulberry32(seed);
  return (
    <g className="scene-starfield" fill={color}>
      {range(count).map((i) => {
        const px = n(x + rand() * width);
        const py = n(y + rand() * height);
        const pr = n(minR + rand() * (maxR - minR));
        const op = n(0.4 + rand() * 0.6);
        return <circle key={i} cx={px} cy={py} r={pr} opacity={op} />;
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Landscape: clouds, hills, ground, grass, water                             */
/* -------------------------------------------------------------------------- */

export function Cloud({
  x,
  y,
  scale = 1,
  fill = '#ffffff',
  opacity = 0.85,
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g
      className="scene-cloud"
      transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}
      fill={fill}
      opacity={opacity}
    >
      <ellipse cx={0} cy={0} rx={70} ry={30} />
      <ellipse cx={48} cy={8} rx={52} ry={26} />
      <ellipse cx={-46} cy={10} rx={46} ry={22} />
      <ellipse cx={12} cy={-18} rx={44} ry={26} />
    </g>
  );
}

/** A rolling hill/landmass filled to the bottom of the frame. */
export function Hill({
  baseY,
  crest,
  fill,
  peakX = VIEW_W * 0.5,
  spread = VIEW_W * 0.75,
  className = 'scene-hill',
}: {
  baseY: number;
  crest: number;
  fill: string;
  peakX?: number;
  spread?: number;
  className?: string;
}) {
  const left = n(peakX - spread);
  const right = n(peakX + spread);
  const d = `M${left},${VIEW_H} L${left},${n(baseY)} Q${n(peakX)},${n(
    baseY - crest,
  )} ${right},${n(baseY)} L${right},${VIEW_H} Z`;
  return <path d={d} fill={fill} className={className} />;
}

/** A flat-ish ground swath with a gently curved top edge. */
export function Ground({
  topY,
  fill,
  wobble = 10,
  className = 'scene-ground',
}: {
  topY: number;
  fill: string;
  wobble?: number;
  className?: string;
}) {
  const d = `M0,${VIEW_H} L0,${n(topY)} C${n(VIEW_W * 0.3)},${n(
    topY - wobble,
  )} ${n(VIEW_W * 0.7)},${n(topY + wobble)} ${VIEW_W},${n(
    topY,
  )} L${VIEW_W},${VIEW_H} Z`;
  return <path d={d} fill={fill} className={className} />;
}

/** A single blade of grass leaning by `lean` (px at the tip). */
export function GrassBlade({
  x,
  baseY,
  height,
  lean = 0,
  fill = '#5f9a4f',
  width = 6,
}: {
  x: number;
  baseY: number;
  height: number;
  lean?: number;
  fill?: string;
  width?: number;
}) {
  const tipX = n(x + lean);
  const tipY = n(baseY - height);
  const d = `M${n(x - width / 2)},${n(baseY)} Q${n(x + lean * 0.5)},${n(
    baseY - height * 0.6,
  )} ${tipX},${tipY} Q${n(x + lean * 0.5 + width * 0.4)},${n(
    baseY - height * 0.6,
  )} ${n(x + width / 2)},${n(baseY)} Z`;
  return <path d={d} fill={fill} />;
}

/** A deterministic row of grass blades all leaning the same way. */
export function GrassRow({
  seed,
  baseY,
  x = 0,
  width = VIEW_W,
  blades = 40,
  height = 46,
  lean = 0,
  fill = '#5f9a4f',
}: {
  seed: number;
  baseY: number;
  x?: number;
  width?: number;
  blades?: number;
  height?: number;
  lean?: number;
  fill?: string;
}) {
  const rand = mulberry32(seed);
  return (
    <g className="scene-grass">
      {range(blades).map((i) => {
        const bx = n(x + (i / blades) * width + rand() * 8);
        const h = n(height * (0.6 + rand() * 0.7));
        const l = n(lean * (0.6 + rand() * 0.7));
        return (
          <GrassBlade
            key={i}
            x={bx}
            baseY={baseY}
            height={h}
            lean={l}
            fill={fill}
            width={n(5 + rand() * 4)}
          />
        );
      })}
    </g>
  );
}

/** A heart/tear leaf pointing away from its stem join at (x, y). */
export function Leaf({
  x,
  y,
  length = 90,
  width = 54,
  angle = 0,
  fill = '#4f8f43',
  vein = '#3c7333',
}: {
  x: number;
  y: number;
  length?: number;
  width?: number;
  angle?: number;
  fill?: string;
  vein?: string;
}) {
  const d = `M0,0 C${n(width * 0.6)},${n(-length * 0.2)} ${n(width * 0.5)},${n(
    -length * 0.8,
  )} 0,${n(-length)} C${n(-width * 0.5)},${n(-length * 0.8)} ${n(
    -width * 0.6,
  )},${n(-length * 0.2)} 0,0 Z`;
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)})`}>
      <path d={d} fill={fill} />
      <path
        d={`M0,0 L0,${n(-length * 0.92)}`}
        stroke={vein}
        strokeWidth={2.5}
        fill="none"
        opacity={0.6}
      />
    </g>
  );
}

/** A rounded, layered tree canopy silhouette on a trunk. */
export function Tree({
  x,
  baseY,
  height = 260,
  spread = 150,
  canopy = '#2f5d3a',
  trunk = '#4a3524',
}: {
  x: number;
  baseY: number;
  height?: number;
  spread?: number;
  canopy?: string;
  trunk?: string;
}) {
  const topY = n(baseY - height);
  return (
    <g className="scene-tree">
      <path
        d={`M${n(x - 14)},${n(baseY)} L${n(x - 8)},${n(
          baseY - height * 0.55,
        )} L${n(x + 8)},${n(baseY - height * 0.55)} L${n(x + 14)},${n(
          baseY,
        )} Z`}
        fill={trunk}
      />
      <circle cx={x} cy={n(topY + height * 0.18)} r={n(spread * 0.62)} fill={canopy} />
      <circle
        cx={n(x - spread * 0.5)}
        cy={n(topY + height * 0.34)}
        r={n(spread * 0.5)}
        fill={canopy}
      />
      <circle
        cx={n(x + spread * 0.5)}
        cy={n(topY + height * 0.32)}
        r={n(spread * 0.52)}
        fill={canopy}
      />
    </g>
  );
}

/** A calm river/pond ribbon with a couple of highlight lines. */
export function Water({
  x,
  y,
  width,
  height,
  fill,
  highlight = '#ffffff',
  rx = 24,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  highlight?: string;
  rx?: number;
}) {
  return (
    <g className="scene-water">
      <rect x={x} y={y} width={width} height={height} rx={rx} fill={fill} />
      <g className="scene-ripple">
        <path
          d={`M${n(x + width * 0.15)},${n(y + height * 0.4)} q${n(
            width * 0.2,
          )},${-8} ${n(width * 0.4)},0`}
          stroke={highlight}
          strokeWidth={3}
          fill="none"
          opacity={0.5}
          strokeLinecap="round"
        />
        <path
          d={`M${n(x + width * 0.35)},${n(y + height * 0.7)} q${n(
            width * 0.18,
          )},${-6} ${n(width * 0.36)},0`}
          stroke={highlight}
          strokeWidth={2.5}
          fill="none"
          opacity={0.4}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Sound: nested echo arcs                                                     */
/* -------------------------------------------------------------------------- */

/** Concentric arcs suggesting a voice or echo travelling outward. */
export function SoundArcs({
  cx,
  cy,
  from = 3,
  to = 5,
  step = 34,
  startAngle = -55,
  endAngle = 55,
  stroke = '#ffffff',
  opacity = 0.6,
  width = 5,
  className = 'scene-sound',
}: {
  cx: number;
  cy: number;
  from?: number;
  to?: number;
  step?: number;
  startAngle?: number;
  endAngle?: number;
  stroke?: string;
  opacity?: number;
  width?: number;
  className?: string;
}) {
  return (
    <g className={className} data-motif="echo-arc" fill="none" stroke={stroke} strokeLinecap="round">
      {range(to).map((i) => {
        const idx = i + from;
        const r = n(idx * step);
        const [sx, sy] = polar(cx, cy, r, startAngle);
        const [ex, ey] = polar(cx, cy, r, endAngle);
        return (
          <path
            key={i}
            d={`M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}`}
            strokeWidth={n(width - i * 0.4)}
            opacity={n(opacity - i * 0.09)}
          />
        );
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Character & face atoms                                                      */
/* -------------------------------------------------------------------------- */

/** A rounded capsule — the workhorse for limbs, bodies, ropes and branches. */
export function Capsule({
  x1,
  y1,
  x2,
  y2,
  width,
  fill,
  className,
  motif,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  fill: string;
  className?: string;
  /** Optional semantic hook (e.g. "rope") for the reader and tests. */
  motif?: string;
}) {
  return (
    <line
      x1={n(x1)}
      y1={n(y1)}
      x2={n(x2)}
      y2={n(y2)}
      stroke={fill}
      strokeWidth={n(width)}
      strokeLinecap="round"
      className={className}
      data-motif={motif}
    />
  );
}

/** An open, awake eye. */
export function Eye({
  cx,
  cy,
  r = 5,
  fill = '#2b2233',
}: {
  cx: number;
  cy: number;
  r?: number;
  fill?: string;
}) {
  return <circle cx={n(cx)} cy={n(cy)} r={r} fill={fill} />;
}

/** A gently closed, sleeping eye (a downward lash arc). */
export function ClosedEye({
  cx,
  cy,
  w = 12,
  stroke = '#2b2233',
}: {
  cx: number;
  cy: number;
  w?: number;
  stroke?: string;
}) {
  return (
    <path
      d={`M${n(cx - w / 2)},${n(cy)} Q${n(cx)},${n(cy + w * 0.6)} ${n(
        cx + w / 2,
      )},${n(cy)}`}
      stroke={stroke}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />
  );
}

/** A soft round cheek blush. */
export function Blush({
  cx,
  cy,
  r = 6,
  fill = '#f2a6a0',
}: {
  cx: number;
  cy: number;
  r?: number;
  fill?: string;
}) {
  return <circle cx={n(cx)} cy={n(cy)} r={r} fill={fill} opacity={0.6} />;
}

/** A curved smile (or, with a negative `curve`, an "o" of surprise). */
export function Smile({
  cx,
  cy,
  w = 22,
  curve = 12,
  stroke = '#2b2233',
  width = 3,
}: {
  cx: number;
  cy: number;
  w?: number;
  curve?: number;
  stroke?: string;
  width?: number;
}) {
  return (
    <path
      d={`M${n(cx - w / 2)},${n(cy)} Q${n(cx)},${n(cy + curve)} ${n(
        cx + w / 2,
      )},${n(cy)}`}
      stroke={stroke}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
    />
  );
}

/** An open, singing/shouting mouth. */
export function OpenMouth({
  cx,
  cy,
  rx = 9,
  ry = 12,
  fill = '#7c3b46',
}: {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  fill?: string;
}) {
  return <ellipse cx={n(cx)} cy={n(cy)} rx={rx} ry={ry} fill={fill} />;
}

/* -------------------------------------------------------------------------- */
/* Scene-page resolution (exhaustive; no silent fallback art)                 */
/* -------------------------------------------------------------------------- */

/**
 * Resolve a story world's per-page renderer by the typed `scene.id`.
 *
 * Every production page has a dedicated composition, so a missing entry is a
 * bug — an unknown or mistyped scene id must fail loudly here rather than
 * silently drawing generic fallback art that looks plausible but is wrong.
 */
export function requireScenePage(
  pages: Record<string, SceneWorld>,
  props: SceneWorldProps,
): ReactNode {
  const draw: SceneWorld | undefined = Object.prototype.hasOwnProperty.call(pages, props.page.scene.id)
    ? pages[props.page.scene.id]
    : undefined;
  if (typeof draw !== 'function') {
    throw new Error(
      `No illustration registered for scene id "${props.page.scene.id}" ` +
        `in story "${props.story.slug}".`,
    );
  }
  return draw(props);
}
