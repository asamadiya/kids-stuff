import type { ReactNode } from 'react';
import {
  Blush,
  Capsule,
  ClosedEye,
  Cloud,
  Eye,
  GrainFilter,
  GrainWash,
  GrassRow,
  Leaf,
  LinearGradient,
  Moon,
  OpenMouth,
  RadialGradient,
  Smile,
  StarField,
  VIEW_H,
  VIEW_W,
  Vignette,
  n,
  range,
  requireScenePage,
  type SceneWorld,
  type SceneWorldProps,
} from '../shared';

/*
 * WORLD: The Tallest Sunflower — a sunlit measuring garden.
 * Motifs: a fence-high sunflower, a knotted blue ribbon, dewy grass, a glowing
 * house window, bees and a ladybug. The palette walks from dewy dawn to honeyed
 * noon to deep indigo night as Milo measures, wobbles, teams up, and sleeps.
 */

const SKIN = '#e9ad7d';
const SKIN_SHADOW = '#d8966a';
const HAIR = '#5b3a24';
const PJ = '#7fb0b8';
const PJ_DARK = '#5f929b';
const STEM = '#4f9145';
const STEM_DARK = '#3c7434';
const RIBBON = '#3f78c4';

function Stem({
  xBase,
  baseY,
  xTop,
  topY,
  wBase = 26,
  wTop = 12,
  sway = 0,
  fill = STEM,
}: {
  xBase: number;
  baseY: number;
  xTop: number;
  topY: number;
  wBase?: number;
  wTop?: number;
  sway?: number;
  fill?: string;
}) {
  const span = baseY - topY;
  const cy1 = n(baseY - span * 0.4);
  const cy2 = n(topY + span * 0.3);
  const cx1 = n(xBase + sway * 0.3);
  const cx2 = n(xTop + sway);
  const d = `M${n(xBase - wBase / 2)},${n(baseY)} C${n(cx1 - wBase * 0.2)},${cy1} ${n(
    cx2 - wTop * 0.2,
  )},${cy2} ${n(xTop - wTop / 2)},${n(topY)} L${n(xTop + wTop / 2)},${n(
    topY,
  )} C${n(cx2 + wTop * 0.2)},${cy2} ${n(cx1 + wBase * 0.2)},${cy1} ${n(
    xBase + wBase / 2,
  )},${n(baseY)} Z`;
  return (
    <g className="scene-sunflower-stem" data-motif="sunflower-stem">
      <path d={d} fill={fill} />
      <path
        d={`M${n(xBase)},${n(baseY)} C${cx1},${cy1} ${cx2},${cy2} ${n(xTop)},${n(
          topY,
        )}`}
        stroke={STEM_DARK}
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />
    </g>
  );
}

function FlowerHead({
  cx,
  cy,
  r,
  petal = '#f6c945',
  petal2 = '#eeb038',
  center = '#7a4f28',
}: {
  cx: number;
  cy: number;
  r: number;
  petal?: string;
  petal2?: string;
  center?: string;
}) {
  return (
    <g className="scene-sunflower-head" data-motif="sunflower-head">
      {range(18).map((i) => {
        const a = n((i / 18) * 360);
        return (
          <g key={i} transform={`rotate(${a} ${n(cx)} ${n(cy)})`}>
            <ellipse
              cx={n(cx)}
              cy={n(cy - r * 0.98)}
              rx={n(r * 0.15)}
              ry={n(r * 0.5)}
              fill={i % 2 === 0 ? petal : petal2}
            />
          </g>
        );
      })}
      <circle cx={n(cx)} cy={n(cy)} r={n(r * 0.62)} fill={center} />
      <circle cx={n(cx)} cy={n(cy)} r={n(r * 0.62)} fill="#000000" opacity={0.12} />
      {range(24).map((i) => {
        const a = (i / 24) * Math.PI * 2 * 3;
        const rr = n(r * 0.6 * (i / 24));
        return (
          <circle
            key={i}
            cx={n(cx + Math.cos(a) * rr)}
            cy={n(cy + Math.sin(a) * rr)}
            r={2.2}
            fill="#5a3a20"
            opacity={0.7}
          />
        );
      })}
    </g>
  );
}

function Fence({ y, fill = '#c39a6b', post = '#a97f52' }: { y: number; fill?: string; post?: string }) {
  return (
    <g className="scene-fence">
      <rect x={0} y={n(y)} width={VIEW_W} height={14} fill={fill} />
      <rect x={0} y={n(y + 44)} width={VIEW_W} height={14} fill={fill} />
      {range(13).map((i) => (
        <rect
          key={i}
          x={n(i * 100 + 20)}
          y={n(y - 24)}
          width={22}
          height={96}
          rx={4}
          fill={post}
        />
      ))}
    </g>
  );
}

function GlowWindow({ x, y, w, h, paint }: { x: number; y: number; w: number; h: number; paint: string }) {
  return (
    <g className="scene-window">
      <rect x={n(x - 8)} y={n(y - 8)} width={n(w + 16)} height={n(h + 16)} rx={8} fill="#8a6b4a" />
      <rect x={n(x)} y={n(y)} width={n(w)} height={n(h)} fill={paint} />
      <rect x={n(x + w / 2 - 2)} y={n(y)} width={4} height={n(h)} fill="#8a6b4a" />
      <rect x={n(x)} y={n(y + h / 2 - 2)} width={n(w)} height={4} fill="#8a6b4a" />
    </g>
  );
}

function Bee({ x, y }: { x: number; y: number }) {
  return (
    <g className="scene-bee" transform={`translate(${n(x)} ${n(y)})`}>
      <ellipse cx={0} cy={0} rx={9} ry={6} fill="#f2c14e" />
      <rect x={-4} y={-6} width={3} height={12} fill="#3a2a1a" rx={1} />
      <rect x={2} y={-6} width={3} height={12} fill="#3a2a1a" rx={1} />
      <ellipse cx={-8} cy={-6} rx={7} ry={4} fill="#ffffff" opacity={0.7} />
      <ellipse cx={8} cy={-6} rx={7} ry={4} fill="#ffffff" opacity={0.7} />
    </g>
  );
}

function Ladybug({ x, y }: { x: number; y: number }) {
  return (
    <g className="scene-ladybug" transform={`translate(${n(x)} ${n(y)})`}>
      <ellipse cx={0} cy={0} rx={8} ry={7} fill="#d64b3f" />
      <rect x={-0.8} y={-7} width={1.6} height={14} fill="#2b2233" />
      <circle cx={-3} cy={-1} r={1.4} fill="#2b2233" />
      <circle cx={3} cy={2} r={1.4} fill="#2b2233" />
      <circle cx={0} cy={-9} r={3} fill="#2b2233" />
    </g>
  );
}

/** Milo's head, tilted by `tilt` degrees, awake or asleep. */
function MiloHead({
  cx,
  cy,
  r = 34,
  tilt = 0,
  asleep = false,
  mouth = 'smile',
}: {
  cx: number;
  cy: number;
  r?: number;
  tilt?: number;
  asleep?: boolean;
  mouth?: 'smile' | 'open' | 'soft';
}) {
  return (
    <g transform={`rotate(${n(tilt)} ${n(cx)} ${n(cy)})`}>
      <circle cx={n(cx)} cy={n(cy)} r={r} fill={SKIN} />
      <path
        d={`M${n(cx - r)},${n(cy - r * 0.3)} Q${n(cx)},${n(cy - r * 1.5)} ${n(
          cx + r,
        )},${n(cy - r * 0.3)} Q${n(cx + r * 0.6)},${n(cy - r * 0.9)} ${n(cx)},${n(
          cy - r * 0.85,
        )} Q${n(cx - r * 0.6)},${n(cy - r * 0.9)} ${n(cx - r)},${n(cy - r * 0.3)} Z`}
        fill={HAIR}
      />
      {asleep ? (
        <>
          <ClosedEye cx={n(cx - r * 0.35)} cy={n(cy)} w={13} />
          <ClosedEye cx={n(cx + r * 0.35)} cy={n(cy)} w={13} />
        </>
      ) : (
        <>
          <Eye cx={n(cx - r * 0.32)} cy={n(cy - r * 0.02)} r={4.6} />
          <Eye cx={n(cx + r * 0.32)} cy={n(cy - r * 0.02)} r={4.6} />
        </>
      )}
      <Blush cx={n(cx - r * 0.55)} cy={n(cy + r * 0.38)} r={6} />
      <Blush cx={n(cx + r * 0.55)} cy={n(cy + r * 0.38)} r={6} />
      {mouth === 'open' ? (
        <OpenMouth cx={n(cx)} cy={n(cy + r * 0.5)} rx={7} ry={9} />
      ) : mouth === 'soft' ? (
        <Smile cx={n(cx)} cy={n(cy + r * 0.42)} w={16} curve={6} />
      ) : (
        <Smile cx={n(cx)} cy={n(cy + r * 0.42)} w={22} curve={11} />
      )}
    </g>
  );
}

/** A small child hand: palm plus four fingers and a thumb, for readable poses. */
function Hand({
  x,
  y,
  angle = 0,
  scale = 1,
  skin = SKIN,
}: {
  x: number;
  y: number;
  angle?: number;
  scale?: number;
  skin?: string;
}) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(scale)})`}>
      <ellipse cx={0} cy={0} rx={20} ry={15} fill={skin} />
      <Capsule x1={12} y1={-9} x2={32} y2={-15} width={8} fill={skin} />
      <Capsule x1={15} y1={-2} x2={37} y2={-4} width={8} fill={skin} />
      <Capsule x1={14} y1={6} x2={35} y2={9} width={8} fill={skin} />
      <Capsule x1={10} y1={12} x2={27} y2={20} width={7} fill={skin} />
      <Capsule x1={-2} y1={-12} x2={6} y2={-26} width={8} fill={skin} />
    </g>
  );
}

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('dawnSky')}
        stops={[
          { offset: 0, color: '#fbe4c2' },
          { offset: 0.5, color: '#f7ddb5' },
          { offset: 1, color: '#dfe6c0' },
        ]}
      />
      <LinearGradient
        id={id('warmSky')}
        stops={[
          { offset: 0, color: '#cfe6c8' },
          { offset: 1, color: '#f4e3a8' },
        ]}
      />
      <LinearGradient
        id={id('honeySky')}
        stops={[
          { offset: 0, color: '#f7d98a' },
          { offset: 1, color: '#f6e7b4' },
        ]}
      />
      <LinearGradient
        id={id('nightSky')}
        stops={[
          { offset: 0, color: '#1b2140' },
          { offset: 0.6, color: '#2a2f57' },
          { offset: 1, color: '#3d3b63' },
        ]}
      />
      <RadialGradient
        id={id('windowGlow')}
        stops={[
          { offset: 0, color: '#ffe6a3' },
          { offset: 1, color: '#f4b95e' },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#f8f3d6', opacity: 0.85 },
          { offset: 1, color: '#f8f3d6', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.62, color: '#000000', opacity: 0 },
          { offset: 1, color: '#241a10', opacity: 0.34 },
        ]}
      />
      <GrainFilter id={id('grain')} opacity={0.045} />
    </defs>
  );
}

const sky = (fill: string) => (
  <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={fill} />
);

const finish = (paint: SceneWorldProps['paint']) => (
  <>
    <GrainWash filter={paint('grain')} />
    <Vignette paint={paint('vignette')} />
  </>
);

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'sunflower-01-dawn-window': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('dawnSky'))}
      <circle cx={n(VIEW_W * 0.2)} cy={n(VIEW_H * 0.22)} r={70} fill="#fff2cf" opacity={0.7} />
      <Cloud x={VIEW_W * 0.68} y={VIEW_H * 0.16} scale={1.1} fill="#fff7ea" opacity={0.8} />
      <Cloud x={VIEW_W * 0.4} y={VIEW_H * 0.28} scale={0.8} fill="#fff7ea" opacity={0.6} />
      {/* house wall + glowing window, behind */}
      <rect x={0} y={n(VIEW_H * 0.32)} width={n(VIEW_W * 0.34)} height={n(VIEW_H * 0.5)} fill="#e7c79a" />
      <GlowWindow x={VIEW_W * 0.08} y={VIEW_H * 0.4} w={130} h={150} paint={paint('windowGlow')} />
      <Fence y={VIEW_H * 0.62} />
      {/* towering sunflower */}
      <Stem xBase={VIEW_W * 0.66} baseY={VIEW_H * 0.9} xTop={VIEW_W * 0.63} topY={VIEW_H * 0.12} wBase={30} sway={-14} />
      <Leaf x={VIEW_W * 0.66} y={VIEW_H * 0.62} length={130} width={80} angle={-58} fill={STEM} />
      <Leaf x={VIEW_W * 0.63} y={VIEW_H * 0.4} length={120} width={72} angle={54} fill={STEM_DARK} />
      <FlowerHead cx={VIEW_W * 0.63} cy={VIEW_H * 0.13} r={92} />
      <Ladybug x={VIEW_W * 0.665} y={VIEW_H * 0.72} />
      <Bee x={VIEW_W * 0.5} y={VIEW_H * 0.2} />
      <Bee x={VIEW_W * 0.74} y={VIEW_H * 0.26} />
      <GrassRow seed={seed} baseY={VIEW_H * 0.92} blades={46} height={44} lean={6} fill="#6aa653" />
      <GrassRow seed={seed + 5} baseY={VIEW_H} blades={40} height={58} lean={4} fill="#548a44" />
      {/* Milo, small, looking up */}
      <g transform={`translate(${n(VIEW_W * 0.26)} ${n(VIEW_H * 0.7)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={90} width={46} fill={PJ} />
        <rect x={-23} y={40} width={46} height={10} fill={PJ_DARK} opacity={0.5} />
        <Capsule x1={-14} y1={20} x2={-30} y2={-24} width={16} fill={PJ} />
        <Capsule x1={14} y1={20} x2={34} y2={-26} width={16} fill={PJ} />
        <Capsule x1={-10} y1={88} x2={-14} y2={140} width={17} fill={PJ_DARK} />
        <Capsule x1={10} y1={88} x2={14} y2={140} width={17} fill={PJ_DARK} />
        <ellipse cx={-14} cy={146} rx={12} ry={7} fill={SKIN} />
        <ellipse cx={14} cy={146} rx={12} ry={7} fill={SKIN} />
        <MiloHead cx={0} cy={-40} r={34} tilt={-8} mouth="open" />
      </g>
      {finish(paint)}
    </g>
  ),

  'sunflower-02-hand-stack': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('warmSky'))}
      <circle cx={n(VIEW_W * 0.8)} cy={n(VIEW_H * 0.2)} r={90} fill="#fff2c8" opacity={0.55} />
      {/* a big diagonal stem, close-up */}
      <g transform={`rotate(-16 ${n(VIEW_W * 0.5)} ${n(VIEW_H * 0.5)})`} data-motif="sunflower-stem">
        <rect x={n(VIEW_W * 0.42)} y={-40} width={110} height={VIEW_H + 120} fill={STEM} rx={30} />
        <rect x={n(VIEW_W * 0.42)} y={-40} width={26} height={VIEW_H + 120} fill="#ffffff" opacity={0.12} />
        <rect x={n(VIEW_W * 0.42 + 84)} y={-40} width={24} height={VIEW_H + 120} fill={STEM_DARK} opacity={0.5} />
      </g>
      <Leaf x={VIEW_W * 0.36} y={VIEW_H * 0.34} length={200} width={120} angle={-64} fill={STEM_DARK} />
      <Leaf x={VIEW_W * 0.7} y={VIEW_H * 0.7} length={210} width={128} angle={128} fill={STEM} />
      {/* Milo at bottom, hands stacked flat on stem */}
      <g transform={`translate(${n(VIEW_W * 0.34)} ${n(VIEW_H * 0.78)})`}>
        <Capsule x1={0} y1={70} x2={0} y2={200} width={70} fill={PJ} />
        <MiloHead cx={0} cy={20} r={44} tilt={10} mouth="soft" />
        <Capsule x1={30} y1={70} x2={150} y2={-80} width={26} fill={PJ} />
        <Capsule x1={40} y1={110} x2={168} y2={-8} width={26} fill={PJ_DARK} />
        {/* two flat hands pressed on the stem */}
        <g fill={SKIN}>
          <rect x={140} y={-104} width={62} height={30} rx={14} transform="rotate(-30 171 -89)" />
          <rect x={160} y={-30} width={62} height={30} rx={14} transform="rotate(-30 191 -15)" />
        </g>
        <path d="M150,-98 l40,-22 M156,-88 l40,-22 M162,-78 l40,-22" stroke={SKIN_SHADOW} strokeWidth={3} opacity={0.5} />
      </g>
      <Bee x={VIEW_W * 0.82} y={VIEW_H * 0.38} />
      {finish(paint)}
    </g>
  ),

  'sunflower-03-knot-ribbon': ({ paint }) => (
    <g data-scene-art>
      {/* top-down warm plank floor */}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#b98a56" />
      {range(7).map((i) => (
        <rect key={i} x={0} y={n(i * (VIEW_H / 7))} width={VIEW_W} height={10} fill="#93693e" opacity={0.7} />
      ))}
      {range(7).map((i) => (
        <rect key={i} x={0} y={n(i * (VIEW_H / 7) + 6)} width={VIEW_W} height={2} fill="#7a5531" opacity={0.5} />
      ))}
      <ellipse cx={n(VIEW_W * 0.42)} cy={n(VIEW_H * 0.66)} rx={n(VIEW_W * 0.52)} ry={n(VIEW_H * 0.44)} fill="#e6ba7c" opacity={0.35} />
      {/* open doorway behind, warm light spilling out */}
      <rect x={n(VIEW_W * 0.28)} y={-20} width={n(VIEW_W * 0.44)} height={n(VIEW_H * 0.3)} fill="#4a3320" />
      <rect x={n(VIEW_W * 0.31)} y={-20} width={n(VIEW_W * 0.38)} height={n(VIEW_H * 0.25)} fill={paint('windowGlow')} opacity={0.9} />
      <path
        d={`M${n(VIEW_W * 0.31)},${n(VIEW_H * 0.25)} L${n(VIEW_W * 0.24)},${n(VIEW_H * 0.5)} L${n(
          VIEW_W * 0.76,
        )},${n(VIEW_H * 0.5)} L${n(VIEW_W * 0.69)},${n(VIEW_H * 0.25)} Z`}
        fill={paint('windowGlow')}
        opacity={0.22}
      />
      {/* Rosa leaning in from the doorway, reaching a ribbon end down */}
      <g transform={`translate(${n(VIEW_W * 0.5)} ${n(VIEW_H * 0.04)})`}>
        <ellipse cx={0} cy={116} rx={104} ry={70} fill="#c66d8e" />
        <ellipse cx={0} cy={116} rx={104} ry={70} fill="#000000" opacity={0.06} />
        <circle cx={0} cy={70} r={48} fill={SKIN} />
        <path d={`M-48,58 Q0,-6 48,58 Q26,20 0,26 Q-26,20 -48,58 Z`} fill="#3a2417" />
        <path d="M0,20 q40,-14 30,-56" stroke="#3a2417" strokeWidth={18} fill="none" strokeLinecap="round" />
        <Eye cx={-16} cy={72} r={4.5} />
        <Eye cx={16} cy={72} r={4.5} />
        <Smile cx={0} cy={88} w={22} curve={9} />
        <Capsule x1={-70} y1={150} x2={-150} y2={280} width={26} fill="#c66d8e" />
        <Hand x={-158} y={292} angle={116} scale={1.05} />
      </g>
      {/* an open craft box with ribbon spools */}
      <g transform={`translate(${n(VIEW_W * 0.14)} ${n(VIEW_H * 0.42)})`}>
        <rect x={-56} y={-38} width={112} height={78} rx={10} fill="#8a5a34" />
        <rect x={-46} y={-30} width={92} height={60} rx={8} fill="#6f4526" />
        <circle cx={-22} cy={-2} r={20} fill="#d8c25a" />
        <circle cx={-22} cy={-2} r={7} fill="#8a5a34" />
        <circle cx={20} cy={6} r={16} fill="#c96f74" />
        <circle cx={20} cy={6} r={5} fill="#8a5a34" />
        <path d="M40,-20 q40,14 70,2" stroke={RIBBON} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.9} />
      </g>
      {/* the blue ribbon laid across, with a neat row of tied knots */}
      <path
        d={`M${n(VIEW_W * 0.12)},${n(VIEW_H * 0.66)} C${n(VIEW_W * 0.32)},${n(VIEW_H * 0.58)} ${n(
          VIEW_W * 0.52,
        )},${n(VIEW_H * 0.74)} ${n(VIEW_W * 0.9)},${n(VIEW_H * 0.64)}`}
        stroke={RIBBON}
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
        data-motif="ribbon"
      />
      {range(7).map((i) => {
        const t = i / 6;
        const x = n(VIEW_W * (0.12 + t * 0.78));
        const y = n(VIEW_H * (0.66 - Math.sin(t * Math.PI) * 0.08));
        return (
          <g key={i} data-motif="knot">
            <circle cx={x} cy={y} r={13} fill="#2f5da3" />
            <Capsule x1={n(x - 12)} y1={n(y - 10)} x2={n(x + 12)} y2={n(y - 16)} width={5} fill="#2f5da3" />
            <Capsule x1={n(x - 12)} y1={n(y + 10)} x2={n(x + 12)} y2={n(y + 16)} width={5} fill="#2f5da3" />
          </g>
        );
      })}
      {/* Milo's two small hands tying a knot in the foreground */}
      <Capsule x1={n(VIEW_W * 0.32)} y1={n(VIEW_H * 1.02)} x2={n(VIEW_W * 0.4)} y2={n(VIEW_H * 0.78)} width={30} fill={PJ} />
      <Capsule x1={n(VIEW_W * 0.5)} y1={n(VIEW_H * 1.02)} x2={n(VIEW_W * 0.46)} y2={n(VIEW_H * 0.78)} width={30} fill={PJ} />
      <Hand x={n(VIEW_W * 0.41)} y={n(VIEW_H * 0.76)} angle={-64} scale={1.1} />
      <Hand x={n(VIEW_W * 0.47)} y={n(VIEW_H * 0.76)} angle={-116} scale={1.1} />
      {finish(paint)}
    </g>
  ),

  'sunflower-04-windy-wobble': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('warmSky'))}
      <Cloud x={VIEW_W * 0.3} y={VIEW_H * 0.18} scale={1} fill="#fff7ea" opacity={0.8} />
      <Cloud x={VIEW_W * 0.72} y={VIEW_H * 0.12} scale={0.7} fill="#fff7ea" opacity={0.6} />
      {/* strongly bending stem */}
      <Stem xBase={VIEW_W * 0.5} baseY={VIEW_H * 0.95} xTop={VIEW_W * 0.78} topY={VIEW_H * 0.14} wBase={30} sway={120} />
      <Leaf x={VIEW_W * 0.56} y={VIEW_H * 0.6} length={130} width={78} angle={40} fill={STEM_DARK} />
      <FlowerHead cx={VIEW_W * 0.78} cy={VIEW_H * 0.14} r={78} />
      {/* fluttering ribbon flapping like a flag */}
      <path
        d={`M${n(VIEW_W * 0.5)},${n(VIEW_H * 0.5)} q60,-40 120,-6 q60,34 130,-2`}
        stroke={RIBBON}
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        className="scene-ribbon"
        data-motif="ribbon"
      />
      {range(4).map((i) => (
        <circle key={i} cx={n(VIEW_W * 0.5 + i * 66 + 30)} cy={n(VIEW_H * (0.48 + (i % 2) * 0.04))} r={9} fill="#2f5da3" data-motif="knot" />
      ))}
      {/* petals lifting into the air */}
      {range(6).map((i) => {
        const rand = ((seed + i * 97) % 100) / 100;
        return (
          <ellipse
            key={i}
            cx={n(VIEW_W * (0.6 + rand * 0.28))}
            cy={n(VIEW_H * (0.2 + rand * 0.3))}
            rx={16}
            ry={7}
            fill="#f6c945"
            transform={`rotate(${n(rand * 120 - 40)} ${n(VIEW_W * (0.6 + rand * 0.28))} ${n(
              VIEW_H * (0.2 + rand * 0.3),
            )})`}
            opacity={0.9}
          />
        );
      })}
      <GrassRow seed={seed} baseY={VIEW_H} blades={44} height={58} lean={30} fill="#5f9a4f" />
      {/* Milo steadying with both hands, hair blown */}
      <g transform={`translate(${n(VIEW_W * 0.32)} ${n(VIEW_H * 0.66)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={96} width={48} fill={PJ} />
        <Capsule x1={16} y1={16} x2={120} y2={-4} width={16} fill={PJ} />
        <Capsule x1={16} y1={30} x2={122} y2={20} width={16} fill={PJ_DARK} />
        <ellipse cx={126} cy={-6} rx={16} ry={11} fill={SKIN} />
        <ellipse cx={128} cy={20} rx={16} ry={11} fill={SKIN} />
        <Capsule x1={-8} y1={94} x2={-14} y2={150} width={17} fill={PJ_DARK} />
        <Capsule x1={12} y1={94} x2={20} y2={150} width={17} fill={PJ_DARK} />
        <MiloHead cx={0} cy={-38} r={32} tilt={12} mouth="open" />
        {/* windblown hair streaks */}
        <path d="M20,-58 q30,-6 46,4 M22,-46 q30,-4 44,6" stroke={HAIR} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
      {finish(paint)}
    </g>
  ),

  'sunflower-05-teamwork-count': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('honeySky'))}
      <circle cx={n(VIEW_W * 0.16)} cy={n(VIEW_H * 0.2)} r={80} fill="#fff0bf" opacity={0.6} />
      <Fence y={VIEW_H * 0.58} />
      {/* vertical stem with ribbon of knots */}
      <Stem xBase={VIEW_W * 0.52} baseY={VIEW_H * 0.95} xTop={VIEW_W * 0.5} topY={VIEW_H * 0.1} wBase={30} sway={-6} />
      <Leaf x={VIEW_W * 0.52} y={VIEW_H * 0.62} length={128} width={76} angle={-56} fill={STEM} />
      <Leaf x={VIEW_W * 0.5} y={VIEW_H * 0.36} length={120} width={72} angle={52} fill={STEM_DARK} />
      <FlowerHead cx={VIEW_W * 0.5} cy={VIEW_H * 0.11} r={80} />
      <line x1={n(VIEW_W * 0.55)} y1={n(VIEW_H * 0.92)} x2={n(VIEW_W * 0.53)} y2={n(VIEW_H * 0.16)} stroke={RIBBON} strokeWidth={9} strokeLinecap="round" data-motif="ribbon" />
      {range(11).map((i) => {
        const t = i / 10;
        return <circle key={i} cx={n(VIEW_W * (0.55 - t * 0.02))} cy={n(VIEW_H * (0.92 - t * 0.76))} r={8} fill="#2f5da3" data-motif="knot" />;
      })}
      {/* Rosa kneeling low, holding the base */}
      <g transform={`translate(${n(VIEW_W * 0.66)} ${n(VIEW_H * 0.72)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={120} width={58} fill="#c66d8e" />
        <Capsule x1={-20} y1={30} x2={-120} y2={110} width={20} fill="#c66d8e" />
        <ellipse cx={-124} cy={112} rx={16} ry={11} fill={SKIN} />
        <circle cx={0} cy={-46} r={38} fill={SKIN} />
        <path d={`M-38,-56 Q0,-104 38,-56 Q20,-92 0,-88 Q-20,-92 -38,-56 Z`} fill="#3a2417" />
        <path d="M34,-52 q26,20 16,72" stroke="#3a2417" strokeWidth={16} fill="none" strokeLinecap="round" />
        <Eye cx={-12} cy={-48} r={4} />
        <Eye cx={12} cy={-48} r={4} />
        <Smile cx={0} cy={-34} w={18} curve={8} />
      </g>
      {/* Milo above, touching a knot */}
      <g transform={`translate(${n(VIEW_W * 0.36)} ${n(VIEW_H * 0.5)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={90} width={44} fill={PJ} />
        <Capsule x1={16} y1={14} x2={130} y2={20} width={15} fill={PJ} />
        <ellipse cx={136} cy={20} rx={14} ry={10} fill={SKIN} />
        <MiloHead cx={0} cy={-34} r={30} tilt={6} mouth="soft" />
      </g>
      <GrassRow seed={seed} baseY={VIEW_H} blades={42} height={46} lean={5} fill="#6aa653" />
      {finish(paint)}
    </g>
  ),

  'sunflower-06-fourteen-hands': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('honeySky'))}
      <circle cx={n(VIEW_W * 0.82)} cy={n(VIEW_H * 0.18)} r={96} fill="#fff0bd" opacity={0.7} />
      <Cloud x={VIEW_W * 0.25} y={VIEW_H * 0.14} scale={0.9} fill="#fff7ea" opacity={0.7} />
      <Fence y={VIEW_H * 0.66} />
      {/* whole sunflower, full height, ribbon of knots its full length */}
      <Stem xBase={VIEW_W * 0.5} baseY={VIEW_H * 0.98} xTop={VIEW_W * 0.5} topY={VIEW_H * 0.12} wBase={34} sway={-4} />
      <Leaf x={VIEW_W * 0.5} y={VIEW_H * 0.7} length={150} width={90} angle={-58} fill={STEM} />
      <Leaf x={VIEW_W * 0.5} y={VIEW_H * 0.46} length={140} width={84} angle={56} fill={STEM_DARK} />
      <Leaf x={VIEW_W * 0.5} y={VIEW_H * 0.3} length={110} width={66} angle={-50} fill={STEM} />
      <FlowerHead cx={VIEW_W * 0.5} cy={VIEW_H * 0.13} r={104} />
      <line x1={n(VIEW_W * 0.55)} y1={n(VIEW_H * 0.96)} x2={n(VIEW_W * 0.55)} y2={n(VIEW_H * 0.18)} stroke={RIBBON} strokeWidth={9} strokeLinecap="round" data-motif="ribbon" />
      {range(14).map((i) => {
        const t = i / 13;
        return <circle key={i} cx={n(VIEW_W * 0.55)} cy={n(VIEW_H * (0.95 - t * 0.76))} r={7.5} fill="#2f5da3" data-motif="knot" />;
      })}
      <GrassRow seed={seed} baseY={VIEW_H} blades={44} height={50} lean={5} fill="#6aa653" />
      {/* Milo cheering, arms up */}
      <g transform={`translate(${n(VIEW_W * 0.2)} ${n(VIEW_H * 0.66)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={96} width={46} fill={PJ} />
        <Capsule x1={-14} y1={12} x2={-44} y2={-58} width={16} fill={PJ} />
        <Capsule x1={14} y1={12} x2={44} y2={-58} width={16} fill={PJ} />
        <ellipse cx={-48} cy={-62} rx={12} ry={12} fill={SKIN} />
        <ellipse cx={48} cy={-62} rx={12} ry={12} fill={SKIN} />
        <Capsule x1={-8} y1={94} x2={-14} y2={150} width={17} fill={PJ_DARK} />
        <Capsule x1={12} y1={94} x2={18} y2={150} width={17} fill={PJ_DARK} />
        <MiloHead cx={0} cy={-40} r={32} tilt={-4} mouth="open" />
      </g>
      {/* Rosa clapping */}
      <g transform={`translate(${n(VIEW_W * 0.78)} ${n(VIEW_H * 0.62)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={120} width={58} fill="#c66d8e" />
        <Capsule x1={-16} y1={16} x2={-64} y2={-30} width={18} fill="#c66d8e" />
        <Capsule x1={16} y1={16} x2={64} y2={-30} width={18} fill="#c66d8e" />
        <ellipse cx={-66} cy={-34} rx={13} ry={10} fill={SKIN} />
        <ellipse cx={66} cy={-34} rx={13} ry={10} fill={SKIN} />
        <circle cx={0} cy={-46} r={38} fill={SKIN} />
        <path d={`M-38,-56 Q0,-104 38,-56 Q20,-92 0,-88 Q-20,-92 -38,-56 Z`} fill="#3a2417" />
        <path d="M-34,-52 q-26,20 -16,72" stroke="#3a2417" strokeWidth={16} fill="none" strokeLinecap="round" />
        <Eye cx={-12} cy={-48} r={4} />
        <Eye cx={12} cy={-48} r={4} />
        <Smile cx={0} cy={-34} w={20} curve={10} />
      </g>
      {finish(paint)}
    </g>
  ),

  'sunflower-07-moonlit-sleep': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('nightSky'))}
      <StarField seed={seed} count={46} height={VIEW_H * 0.7} color="#e9eefb" />
      {/* window to the moonlit garden */}
      <rect x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.1)} width={n(VIEW_W * 0.42)} height={n(VIEW_H * 0.6)} rx={12} fill="#20264a" />
      <rect x={n(VIEW_W * 0.545)} y={n(VIEW_H * 0.12)} width={n(VIEW_W * 0.37)} height={n(VIEW_H * 0.55)} fill="#2b325c" />
      <Moon cx={VIEW_W * 0.83} cy={VIEW_H * 0.24} r={46} glow={paint('moonGlow')} />
      {/* sunflower silhouette against the moon */}
      <Stem xBase={VIEW_W * 0.62} baseY={VIEW_H * 0.67} xTop={VIEW_W * 0.64} topY={VIEW_H * 0.18} wBase={16} sway={8} fill="#141a33" />
      <FlowerHead cx={VIEW_W * 0.64} cy={VIEW_H * 0.19} r={44} petal="#232a4d" petal2="#1c2242" center="#10152b" />
      <rect x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.08)} width={12} height={n(VIEW_H * 0.64)} fill="#3a3f66" />
      <rect x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.38)} width={n(VIEW_W * 0.42)} height={10} fill="#3a3f66" />
      {/* Milo tucked in bed, foreground */}
      <rect x={0} y={n(VIEW_H * 0.72)} width={VIEW_W} height={n(VIEW_H * 0.28)} fill="#3b3a63" />
      <rect x={n(VIEW_W * 0.02)} y={n(VIEW_H * 0.66)} width={n(VIEW_W * 0.5)} height={n(VIEW_H * 0.2)} rx={20} fill="#6b6aa0" />
      <path
        d={`M${n(VIEW_W * 0.02)},${n(VIEW_H * 0.86)} L${n(VIEW_W * 0.02)},${n(
          VIEW_H * 0.78,
        )} Q${n(VIEW_W * 0.26)},${n(VIEW_H * 0.7)} ${n(VIEW_W * 0.52)},${n(
          VIEW_H * 0.78,
        )} L${n(VIEW_W * 0.52)},${n(VIEW_H * 0.86)} Z`}
        fill="#8a86c4"
      />
      <ellipse cx={n(VIEW_W * 0.12)} cy={n(VIEW_H * 0.72)} rx={54} ry={30} fill="#eef0ff" />
      <g transform={`translate(${n(VIEW_W * 0.14)} ${n(VIEW_H * 0.68)})`}>
        <MiloHead cx={0} cy={0} r={34} tilt={-14} asleep mouth="soft" />
      </g>
      {/* drifting dream motes — a soft, non-letter sleep cue */}
      <g data-motif="sleep-cue" fill="#cfd3ff" transform={`translate(${n(VIEW_W * 0.24)} ${n(VIEW_H * 0.6)})`}>
        {range(5).map((i) => (
          <circle key={i} cx={n(i * 15)} cy={n(-i * 22)} r={n(9 - i * 1.3)} opacity={n(0.72 - i * 0.11)} />
        ))}
      </g>
      {finish(paint)}
    </g>
  ),
};

export const sunflowerWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
