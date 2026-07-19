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
  SunGlow,
  VIEW_H,
  VIEW_W,
  Vignette,
  mulberry32,
  n,
  range,
  requireScenePage,
  type SceneWorld,
  type SceneWorldProps,
} from '../shared';

const SKIN = '#d99565';
const SKIN_LIGHT = '#efb180';
const SKIN_SHADOW = '#bf7f56';
const NANA_SKIN = '#c9825c';
const SAM_HAIR = '#4b2c1c';
const NANA_HAIR = '#d8d0c1';
const SHIRT = '#7eb7bd';
const SHIRT_DARK = '#5d9299';
const NANA_DRESS = '#b86f88';
const POT = '#b9633d';
const POT_DARK = '#854126';
const SOIL = '#302014';
const SOIL_DARK = '#1c130d';
const BEAN = '#7a4329';
const HILUM = '#efd7ad';
const SPROUT = '#b9db83';
const LEAF_GREEN = '#4f8f49';
const LEAF_DARK = '#2f6535';
const STICK = '#7a5433';
const WATER_BLUE = '#6fa9c8';

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('kitchenGold')}
        stops={[
          { offset: 0, color: '#ffe2a9' },
          { offset: 0.52, color: '#e8b875' },
          { offset: 1, color: '#9f6849' },
        ]}
      />
      <LinearGradient
        id={id('tableWood')}
        stops={[
          { offset: 0, color: '#c78b55' },
          { offset: 1, color: '#7b4a2e' },
        ]}
      />
      <RadialGradient
        id={id('palmGlow')}
        stops={[
          { offset: 0, color: '#ffd1a0' },
          { offset: 1, color: '#c07b55' },
        ]}
      />
      <RadialGradient
        id={id('bean')}
        stops={[
          { offset: 0, color: '#a9653b' },
          { offset: 0.62, color: BEAN },
          { offset: 1, color: '#472412' },
        ]}
      />
      <LinearGradient
        id={id('pot')}
        stops={[
          { offset: 0, color: '#d17a4d' },
          { offset: 0.7, color: POT },
          { offset: 1, color: POT_DARK },
        ]}
      />
      <RadialGradient
        id={id('soil')}
        stops={[
          { offset: 0, color: '#5b3b25' },
          { offset: 0.72, color: SOIL },
          { offset: 1, color: SOIL_DARK },
        ]}
      />
      <LinearGradient
        id={id('waterCan')}
        stops={[
          { offset: 0, color: '#a4d0df' },
          { offset: 1, color: WATER_BLUE },
        ]}
      />
      <LinearGradient
        id={id('sunnyWall')}
        stops={[
          { offset: 0, color: '#fff2b9' },
          { offset: 1, color: '#e4b86c' },
        ]}
      />
      <LinearGradient
        id={id('sunBeam')}
        stops={[
          { offset: 0, color: '#fff6be', opacity: 0.72 },
          { offset: 1, color: '#fff6be', opacity: 0 },
        ]}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
      />
      <LinearGradient
        id={id('underground')}
        stops={[
          { offset: 0, color: '#26334d' },
          { offset: 1, color: '#121a2c' },
        ]}
      />
      <LinearGradient
        id={id('morning')}
        stops={[
          { offset: 0, color: '#d9e7c8' },
          { offset: 0.65, color: '#f2d59a' },
          { offset: 1, color: '#6b4a32' },
        ]}
      />
      <RadialGradient
        id={id('sproutGlow')}
        stops={[
          { offset: 0, color: '#dff4a6', opacity: 0.82 },
          { offset: 1, color: '#dff4a6', opacity: 0 },
        ]}
      />
      <LinearGradient
        id={id('afternoon')}
        stops={[
          { offset: 0, color: '#f6dda0' },
          { offset: 0.6, color: '#d3c989' },
          { offset: 1, color: '#8aa46a' },
        ]}
      />
      <LinearGradient
        id={id('nightSky')}
        stops={[
          { offset: 0, color: '#17213e' },
          { offset: 0.62, color: '#243053' },
          { offset: 1, color: '#2e3658' },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#f7f2d8', opacity: 0.86 },
          { offset: 1, color: '#f7f2d8', opacity: 0 },
        ]}
      />
      <LinearGradient
        id={id('bed')}
        stops={[
          { offset: 0, color: '#7b82af' },
          { offset: 1, color: '#3e456d' },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.6, color: '#000000', opacity: 0 },
          { offset: 1, color: '#1b1210', opacity: 0.36 },
        ]}
      />
      <GrainFilter id={id('grain')} frequency={0.84} opacity={0.052} />
    </defs>
  );
}

const sky = (fill: string) => <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={fill} />;

const finish = (paint: SceneWorldProps['paint']) => (
  <>
    <GrainWash filter={paint('grain')} />
    <Vignette paint={paint('vignette')} />
  </>
);

function Bean({ cx, cy, rx = 58, ry = 36, angle = -12, fill = BEAN }: { cx: number; cy: number; rx?: number; ry?: number; angle?: number; fill?: string }) {
  return (
    <g transform={`rotate(${n(angle)} ${n(cx)} ${n(cy)})`} data-motif="bean">
      <ellipse cx={n(cx)} cy={n(cy)} rx={n(rx)} ry={n(ry)} fill={fill} />
      <ellipse cx={n(cx - rx * 0.34)} cy={n(cy - ry * 0.02)} rx={n(rx * 0.1)} ry={n(ry * 0.42)} fill={HILUM} opacity={0.92} />
      <path
        d={`M${n(cx + rx * 0.1)},${n(cy - ry * 0.52)} Q${n(cx + rx * 0.52)},${n(cy - ry * 0.22)} ${n(cx + rx * 0.34)},${n(cy + ry * 0.12)}`}
        stroke="#c68655"
        strokeWidth={n(rx * 0.08)}
        strokeLinecap="round"
        fill="none"
        opacity={0.45}
      />
    </g>
  );
}

function Soil({ cx, cy, rx, ry, seed, count = 22 }: { cx: number; cy: number; rx: number; ry: number; seed: number; count?: number }) {
  const rand = mulberry32(seed);
  return (
    <g className="scene-soil">
      <ellipse cx={n(cx)} cy={n(cy)} rx={n(rx)} ry={n(ry)} fill="#000000" opacity={0.18} />
      <ellipse cx={n(cx)} cy={n(cy - ry * 0.07)} rx={n(rx * 0.96)} ry={n(ry * 0.86)} fill="#3a2518" />
      {range(count).map((i) => {
        const px = n(cx + (rand() - 0.5) * rx * 1.55);
        const py = n(cy - ry * 0.18 + (rand() - 0.5) * ry * 1.1);
        const pr = n(2.4 + rand() * 7.2);
        return <circle key={i} cx={px} cy={py} r={pr} fill={rand() > 0.5 ? '#5c3b26' : SOIL_DARK} opacity={n(0.62 + rand() * 0.34)} />;
      })}
    </g>
  );
}

function Pot({ x, y, w, h, paint }: { x: number; y: number; w: number; h: number; paint: string }) {
  return (
    <g className="scene-pot" data-motif="pot">
      <ellipse cx={n(x + w * 0.5)} cy={n(y + h * 0.12)} rx={n(w * 0.5)} ry={n(h * 0.15)} fill="#d88a5e" />
      <path d={`M${n(x + w * 0.08)},${n(y + h * 0.14)} L${n(x + w * 0.24)},${n(y + h)} L${n(x + w * 0.76)},${n(y + h)} L${n(x + w * 0.92)},${n(y + h * 0.14)} Z`} fill={paint} />
      <rect x={n(x + w * 0.07)} y={n(y + h * 0.02)} width={n(w * 0.86)} height={n(h * 0.22)} rx={n(h * 0.08)} fill="#d67b4d" />
      <path d={`M${n(x + w * 0.23)},${n(y + h * 0.3)} C${n(x + w * 0.34)},${n(y + h * 0.72)} ${n(x + w * 0.55)},${n(y + h * 0.92)} ${n(x + w * 0.76)},${n(y + h * 0.96)}`} stroke="#f0a36e" strokeWidth={5} fill="none" opacity={0.35} />
      <ellipse cx={n(x + w * 0.5)} cy={n(y + h * 0.15)} rx={n(w * 0.4)} ry={n(h * 0.09)} fill={SOIL} />
    </g>
  );
}

function ChildHand({ x, y, scale = 1, angle = 0 }: { x: number; y: number; scale?: number; angle?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(scale)})`}>
      <ellipse cx={0} cy={0} rx={58} ry={34} fill={SKIN_LIGHT} />
      {range(4).map((i) => (
        <Capsule key={i} x1={n(-42 + i * 27)} y1={-20} x2={n(-50 + i * 26)} y2={-82} width={18} fill={SKIN_LIGHT} />
      ))}
      <Capsule x1={44} y1={-3} x2={86} y2={-42} width={20} fill={SKIN_LIGHT} />
      <path d="M-42,8 q42,18 84,0" stroke={SKIN_SHADOW} strokeWidth={3} fill="none" opacity={0.35} strokeLinecap="round" />
    </g>
  );
}

function CuppedHand({ x, y, scale = 1, angle = 0, fill = SKIN_LIGHT }: { x: number; y: number; scale?: number; angle?: number; fill?: string }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(scale)})`}>
      <ellipse cx={0} cy={8} rx={132} ry={72} fill={fill} />
      {range(4).map((i) => (
        <Capsule key={i} x1={n(-80 + i * 42)} y1={-16} x2={n(-96 + i * 36)} y2={-118} width={30} fill={fill} />
      ))}
      <Capsule x1={92} y1={14} x2={154} y2={-58} width={36} fill={fill} />
      <path d="M-92,24 C-42,52 45,54 96,18" stroke={SKIN_SHADOW} strokeWidth={5} fill="none" opacity={0.32} strokeLinecap="round" />
      <path d="M-72,-6 q28,18 56,10 M-18,-8 q28,16 56,8" stroke={SKIN_SHADOW} strokeWidth={4} fill="none" opacity={0.24} strokeLinecap="round" />
    </g>
  );
}

function SamHead({ cx, cy, r = 36, tilt = 0, mood = 'smile' }: { cx: number; cy: number; r?: number; tilt?: number; mood?: 'smile' | 'open' | 'worried' | 'sleep' }) {
  const asleep = mood === 'sleep';
  return (
    <g transform={`rotate(${n(tilt)} ${n(cx)} ${n(cy)})`}>
      <circle cx={n(cx - r * 1.03)} cy={n(cy + r * 0.03)} r={n(r * 0.18)} fill={SKIN} />
      <circle cx={n(cx + r * 1.03)} cy={n(cy + r * 0.03)} r={n(r * 0.18)} fill={SKIN} />
      <circle cx={n(cx)} cy={n(cy)} r={n(r)} fill={SKIN_LIGHT} />
      <path
        d={`M${n(cx - r * 0.95)},${n(cy - r * 0.22)} Q${n(cx - r * 0.35)},${n(cy - r * 1.34)} ${n(cx + r * 0.82)},${n(cy - r * 0.45)} Q${n(cx + r * 0.3)},${n(cy - r * 0.7)} ${n(cx - r * 0.06)},${n(cy - r * 0.66)} Q${n(cx - r * 0.48)},${n(cy - r * 0.66)} ${n(cx - r * 0.95)},${n(cy - r * 0.22)} Z`}
        fill={SAM_HAIR}
      />
      {asleep ? (
        <>
          <ClosedEye cx={n(cx - r * 0.33)} cy={n(cy + r * 0.02)} w={n(r * 0.32)} />
          <ClosedEye cx={n(cx + r * 0.33)} cy={n(cy + r * 0.02)} w={n(r * 0.32)} />
        </>
      ) : (
        <>
          <Eye cx={n(cx - r * 0.32)} cy={n(cy - r * 0.03)} r={n(r * 0.11)} />
          <Eye cx={n(cx + r * 0.32)} cy={n(cy - r * 0.03)} r={n(r * 0.11)} />
        </>
      )}
      <Blush cx={n(cx - r * 0.55)} cy={n(cy + r * 0.36)} r={n(r * 0.17)} />
      <Blush cx={n(cx + r * 0.55)} cy={n(cy + r * 0.36)} r={n(r * 0.17)} />
      {mood === 'open' ? (
        <OpenMouth cx={n(cx)} cy={n(cy + r * 0.48)} rx={n(r * 0.2)} ry={n(r * 0.26)} />
      ) : mood === 'worried' ? (
        <Smile cx={n(cx)} cy={n(cy + r * 0.5)} w={n(r * 0.5)} curve={n(-r * 0.13)} />
      ) : (
        <Smile cx={n(cx)} cy={n(cy + r * 0.46)} w={n(r * 0.58)} curve={n(r * 0.24)} />
      )}
    </g>
  );
}

function NanaHead({ cx, cy, r = 42, tilt = 0 }: { cx: number; cy: number; r?: number; tilt?: number }) {
  return (
    <g transform={`rotate(${n(tilt)} ${n(cx)} ${n(cy)})`}>
      <circle cx={n(cx)} cy={n(cy - r * 0.2)} r={n(r * 1.04)} fill={NANA_HAIR} />
      <circle cx={n(cx)} cy={n(cy)} r={n(r * 0.86)} fill={NANA_SKIN} />
      <path d={`M${n(cx - r * 0.8)},${n(cy - r * 0.18)} Q${n(cx)},${n(cy - r * 1.2)} ${n(cx + r * 0.8)},${n(cy - r * 0.18)}`} stroke="#efe6d6" strokeWidth={n(r * 0.26)} fill="none" strokeLinecap="round" />
      <Eye cx={n(cx - r * 0.28)} cy={n(cy - r * 0.04)} r={n(r * 0.08)} />
      <Eye cx={n(cx + r * 0.28)} cy={n(cy - r * 0.04)} r={n(r * 0.08)} />
      <path d={`M${n(cx - r * 0.48)},${n(cy - r * 0.04)} h${n(r * 0.36)} M${n(cx + r * 0.12)},${n(cy - r * 0.04)} h${n(r * 0.36)}`} stroke="#7f665a" strokeWidth={3} strokeLinecap="round" />
      <Smile cx={n(cx)} cy={n(cy + r * 0.36)} w={n(r * 0.46)} curve={n(r * 0.18)} />
    </g>
  );
}

function WateringCan({ x, y, scale = 1, angle = 0 }: { x: number; y: number; scale?: number; angle?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(scale)})`} fill={WATER_BLUE}>
      <ellipse cx={0} cy={24} rx={72} ry={48} fill="#6fa9c8" />
      <rect x={-68} y={-8} width={136} height={64} rx={24} fill="#7dbad0" />
      <path d="M62,8 C122,-8 140,-4 178,18" stroke="#7dbad0" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M-54,4 C-112,4 -112,58 -54,58" stroke="#5e9bb9" strokeWidth={18} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-18} rx={42} ry={16} fill="#a4d0df" />
      {range(5).map((i) => (
        <circle key={i} cx={n(170 + i * 22)} cy={n(42 + i * 14)} r={n(5 - i * 0.35)} fill="#9bd3e5" opacity={0.82} />
      ))}
    </g>
  );
}

function SproutLoop({ cx, baseY, scale = 1 }: { cx: number; baseY: number; scale?: number }) {
  return (
    <g transform={`translate(${n(cx)} ${n(baseY)}) scale(${n(scale)})`} data-motif="sprout">
      <path d="M0,0 C-28,-44 -20,-94 18,-94 C54,-94 56,-42 18,-24" stroke={SPROUT} strokeWidth={18} strokeLinecap="round" fill="none" />
      <path d="M18,-24 C36,-48 62,-62 88,-54" stroke="#d5eca7" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.9} />
      <Leaf x={-2} y={-4} length={52} width={32} angle={-28} fill="#9acb68" vein="#689b4e" />
      <circle cx={-3} cy={0} r={11} fill="#d6ed9c" />
    </g>
  );
}

function Roots({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} stroke="#e6d3ad" strokeLinecap="round" fill="none" data-motif="root">
      <path d="M0,0 C-6,48 -10,96 -4,154" strokeWidth={8} />
      <path d="M-2,50 C-42,70 -72,94 -96,132" strokeWidth={5} />
      <path d="M-1,78 C34,100 52,126 70,166" strokeWidth={5} />
      <path d="M-4,108 C-30,126 -44,150 -56,184" strokeWidth={4} />
      <path d="M6,36 C34,48 58,66 80,94" strokeWidth={4} />
      <circle cx={0} cy={0} r={12} fill={HILUM} stroke="none" opacity={0.55} />
    </g>
  );
}

function VinePlant({ x, baseY, height = 330, silhouetted = false }: { x: number; baseY: number; height?: number; silhouetted?: boolean }) {
  const stemColor = silhouetted ? '#16243b' : LEAF_GREEN;
  const leafFill = silhouetted ? '#1d332d' : '#5aa153';
  const leafAlt = silhouetted ? '#162a26' : LEAF_DARK;
  const topY = n(baseY - height);
  return (
    <g className="scene-vine" data-motif="stem">
      <line x1={n(x + 24)} y1={n(baseY + 18)} x2={n(x + 16)} y2={n(topY - 24)} stroke={silhouetted ? '#26304a' : STICK} strokeWidth={10} strokeLinecap="round" />
      <path
        d={`M${n(x)},${n(baseY)} C${n(x - 34)},${n(baseY - height * 0.25)} ${n(x + 56)},${n(baseY - height * 0.48)} ${n(x + 12)},${n(baseY - height * 0.7)} C${n(x - 26)},${n(baseY - height * 0.88)} ${n(x + 34)},${n(topY + 12)} ${n(x + 4)},${topY}`}
        stroke={stemColor}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
      />
      <Leaf x={n(x - 10)} y={n(baseY - height * 0.38)} length={104} width={66} angle={-62} fill={leafFill} vein={leafAlt} />
      <Leaf x={n(x + 32)} y={n(baseY - height * 0.58)} length={112} width={70} angle={54} fill={leafAlt} vein={stemColor} />
      <Leaf x={n(x + 2)} y={n(topY + height * 0.14)} length={76} width={46} angle={-44} fill={leafFill} vein={leafAlt} />
      <path d={`M${n(x + 4)},${n(topY)} q44,-32 78,4 q-22,6 -36,24`} stroke={stemColor} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Sill({ y, fill = '#ead6a8' }: { y: number; fill?: string }) {
  return (
    <g className="scene-sill">
      <rect x={0} y={n(y)} width={VIEW_W} height={n(VIEW_H - y)} fill="#8a5f3d" />
      <rect x={0} y={n(y - 18)} width={VIEW_W} height={46} rx={8} fill={fill} />
      <rect x={0} y={n(y + 22)} width={VIEW_W} height={18} fill="#b98a5a" opacity={0.7} />
    </g>
  );
}

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'bean-01-seed-in-palm': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('kitchenGold'))}
      <circle cx={n(VIEW_W * 0.78)} cy={n(VIEW_H * 0.16)} r={132} fill="#fff0bd" opacity={0.46} />
      <Cloud x={VIEW_W * 0.24} y={VIEW_H * 0.18} scale={1.2} fill="#ffeac4" opacity={0.28} />
      <rect x={0} y={n(VIEW_H * 0.62)} width={VIEW_W} height={n(VIEW_H * 0.38)} fill={paint('tableWood')} />
      <CuppedHand x={n(VIEW_W * 0.29)} y={n(VIEW_H * 0.51)} scale={1.05} angle={-16} fill={NANA_SKIN} />
      <CuppedHand x={n(VIEW_W * 0.72)} y={n(VIEW_H * 0.5)} scale={1.05} angle={192} fill={NANA_SKIN} />
      <CuppedHand x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.55)} scale={1.16} angle={0} fill={SKIN_LIGHT} />
      <ellipse cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.53)} rx={180} ry={112} fill={paint('palmGlow')} opacity={0.38} />
      <Bean cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.5)} rx={72} ry={44} fill={paint('bean')} />
      {range(9).map((i) => (
        <circle key={i} cx={n(VIEW_W * (0.39 + i * 0.028))} cy={n(VIEW_H * (0.58 + (i % 3) * 0.018))} r={n(2.2 + (i % 2) * 1.1)} fill={SKIN_SHADOW} opacity={0.2} />
      ))}
      <path d={`M${n(VIEW_W * 0.36)},${n(VIEW_H * 0.68)} C${n(VIEW_W * 0.44)},${n(VIEW_H * 0.73)} ${n(VIEW_W * 0.58)},${n(VIEW_H * 0.73)} ${n(VIEW_W * 0.66)},${n(VIEW_H * 0.68)}`} stroke="#8a5638" strokeWidth={5} fill="none" opacity={0.2} strokeLinecap="round" />
      {finish(paint)}
    </g>
  ),

  'bean-02-planting-pot': ({ paint, seed }) => (
    <g data-scene-art>
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint('tableWood')} />
      {range(6).map((i) => (
        <rect key={i} x={0} y={n(i * 132 + 28)} width={VIEW_W} height={6} fill="#6f4028" opacity={0.24} />
      ))}
      <circle cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.44)} r={286} fill="#8b4f31" opacity={0.18} />
      <ellipse cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.45)} rx={330} ry={260} fill={paint('pot')} />
      <ellipse cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.45)} rx={278} ry={216} fill="#cf7850" />
      <Soil cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.45)} rx={240} ry={176} seed={seed} count={46} />
      <ellipse cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.45)} rx={84} ry={42} fill="#21150f" opacity={0.55} />
      <Bean cx={n(VIEW_W * 0.48)} cy={n(VIEW_H * 0.43)} rx={46} ry={29} angle={18} fill={paint('bean')} />
      <ChildHand x={n(VIEW_W * 0.36)} y={n(VIEW_H * 0.26)} scale={0.82} angle={142} />
      <ChildHand x={n(VIEW_W * 0.62)} y={n(VIEW_H * 0.69)} scale={0.82} angle={-38} />
      <WateringCan x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.14)} scale={0.78} angle={-24} />
      {range(8).map((i) => (
        <circle key={i} cx={n(VIEW_W * (0.73 - i * 0.026))} cy={n(VIEW_H * (0.2 + i * 0.038))} r={n(5 + (i % 3))} fill="#9bd3e5" opacity={0.72} />
      ))}
      {finish(paint)}
    </g>
  ),

  'bean-03-sunny-sill': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('sunnyWall'))}
      <SunGlow cx={n(VIEW_W * 0.16)} cy={n(VIEW_H * 0.16)} r={72} core="#fff5be" halo="#fff1a8" />
      <path d={`M${n(VIEW_W * 0.1)},0 L${n(VIEW_W * 0.66)},${n(VIEW_H * 0.62)} L${n(VIEW_W * 0.48)},${n(VIEW_H * 0.68)} L0,${n(VIEW_H * 0.16)} Z`} fill={paint('sunBeam')} />
      <path d={`M${n(VIEW_W * 0.28)},0 L${n(VIEW_W)},${n(VIEW_H * 0.54)} L${n(VIEW_W)},${n(VIEW_H * 0.72)} L${n(VIEW_W * 0.16)},${n(VIEW_H * 0.08)} Z`} fill={paint('sunBeam')} opacity={0.58} />
      <rect x={n(VIEW_W * 0.06)} y={n(VIEW_H * 0.12)} width={n(VIEW_W * 0.32)} height={n(VIEW_H * 0.42)} rx={16} fill="#cfb17d" />
      <rect x={n(VIEW_W * 0.085)} y={n(VIEW_H * 0.15)} width={n(VIEW_W * 0.27)} height={n(VIEW_H * 0.35)} fill="#fff4c8" opacity={0.55} />
      <rect x={n(VIEW_W * 0.21)} y={n(VIEW_H * 0.13)} width={8} height={n(VIEW_H * 0.39)} fill="#b18a5b" />
      <rect x={n(VIEW_W * 0.08)} y={n(VIEW_H * 0.32)} width={n(VIEW_W * 0.28)} height={8} fill="#b18a5b" />
      <Sill y={VIEW_H * 0.62} />
      <g transform={`translate(${n(VIEW_W * 0.31)} ${n(VIEW_H * 0.53)})`}>
        <Capsule x1={-30} y1={70} x2={-82} y2={154} width={46} fill={SHIRT} />
        <Capsule x1={30} y1={70} x2={82} y2={154} width={46} fill={SHIRT_DARK} />
        <ellipse cx={-84} cy={158} rx={36} ry={20} fill={SKIN_LIGHT} />
        <ellipse cx={84} cy={158} rx={36} ry={20} fill={SKIN_LIGHT} />
        <Capsule x1={-130} y1={164} x2={130} y2={164} width={34} fill={SHIRT} />
        <SamHead cx={0} cy={26} r={56} tilt={5} mood="smile" />
      </g>
      <Pot x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.42)} w={190} h={190} paint={paint('pot')} />
      <Soil cx={n(VIEW_W * 0.58 + 95)} cy={n(VIEW_H * 0.42 + 32)} rx={72} ry={22} seed={3124} count={14} />
      <ellipse cx={n(VIEW_W * 0.74)} cy={n(VIEW_H * 0.67)} rx={136} ry={26} fill="#5c3c26" opacity={0.24} />
      {finish(paint)}
    </g>
  ),

  'bean-04-worried-wait': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('sunnyWall'))}
      <rect x={0} y={n(VIEW_H * 0.52)} width={VIEW_W} height={n(VIEW_H * 0.48)} fill={paint('underground')} />
      <path d={`M0,${n(VIEW_H * 0.52)} C${n(VIEW_W * 0.28)},${n(VIEW_H * 0.48)} ${n(VIEW_W * 0.72)},${n(VIEW_H * 0.58)} ${VIEW_W},${n(VIEW_H * 0.52)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="#213052" opacity={0.68} />
      <Soil cx={n(VIEW_W * 0.62)} cy={n(VIEW_H * 0.58)} rx={208} ry={64} seed={seed} count={34} />
      <Pot x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.3)} w={260} h={240} paint={paint('pot')} />
      <Roots x={n(VIEW_W * 0.62)} y={n(VIEW_H * 0.54)} scale={1.06} />
      <NanaHead cx={n(VIEW_W * 0.26)} cy={n(VIEW_H * 0.38)} r={56} tilt={8} />
      <g transform={`translate(${n(VIEW_W * 0.24)} ${n(VIEW_H * 0.52)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={170} width={82} fill={NANA_DRESS} />
        <Capsule x1={26} y1={34} x2={190} y2={64} width={26} fill={NANA_DRESS} />
        <ellipse cx={196} cy={66} rx={24} ry={16} fill={NANA_SKIN} />
        <Capsule x1={-18} y1={150} x2={-86} y2={232} width={28} fill={NANA_DRESS} />
      </g>
      <g transform={`translate(${n(VIEW_W * 0.43)} ${n(VIEW_H * 0.58)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={128} width={54} fill={SHIRT} />
        <Capsule x1={-22} y1={22} x2={-120} y2={64} width={22} fill={SHIRT_DARK} />
        <ellipse cx={-126} cy={66} rx={20} ry={13} fill={SKIN_LIGHT} />
        <SamHead cx={0} cy={-48} r={42} tilt={-8} mood="worried" />
      </g>
      <ellipse cx={n(VIEW_W * 0.39)} cy={n(VIEW_H * 0.61)} rx={30} ry={18} fill={SKIN_LIGHT} />
      <ellipse cx={n(VIEW_W * 0.41)} cy={n(VIEW_H * 0.61)} rx={30} ry={18} fill={NANA_SKIN} opacity={0.96} />
      {range(18).map((i) => (
        <circle key={i} cx={n(VIEW_W * (0.1 + i * 0.047))} cy={n(VIEW_H * (0.62 + (i % 5) * 0.07))} r={n(3 + (i % 4))} fill="#0e1728" opacity={0.5} />
      ))}
      {finish(paint)}
    </g>
  ),

  'bean-05-first-sprout': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('morning'))}
      <circle cx={n(VIEW_W * 0.55)} cy={n(VIEW_H * 0.46)} r={180} fill={paint('sproutGlow')} />
      <g opacity={0.55}>
        <SamHead cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.26)} r={132} tilt={0} mood="open" />
        <ellipse cx={n(VIEW_W * 0.28)} cy={n(VIEW_H * 0.34)} rx={58} ry={42} fill={SKIN_LIGHT} />
        <ellipse cx={n(VIEW_W * 0.72)} cy={n(VIEW_H * 0.34)} rx={58} ry={42} fill={SKIN_LIGHT} />
        <Capsule x1={n(VIEW_W * 0.28)} y1={n(VIEW_H * 0.39)} x2={n(VIEW_W * 0.19)} y2={n(VIEW_H * 0.55)} width={38} fill={SHIRT} />
        <Capsule x1={n(VIEW_W * 0.72)} y1={n(VIEW_H * 0.39)} x2={n(VIEW_W * 0.81)} y2={n(VIEW_H * 0.55)} width={38} fill={SHIRT} />
      </g>
      <path d={`M0,${n(VIEW_H * 0.58)} C${n(VIEW_W * 0.22)},${n(VIEW_H * 0.5)} ${n(VIEW_W * 0.76)},${n(VIEW_H * 0.48)} ${VIEW_W},${n(VIEW_H * 0.58)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill={SOIL_DARK} />
      <Soil cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.62)} rx={420} ry={144} seed={seed} count={58} />
      <SproutLoop cx={n(VIEW_W * 0.51)} baseY={n(VIEW_H * 0.57)} scale={1.56} />
      {range(12).map((i) => (
        <path key={i} d={`M${n(VIEW_W * (0.22 + i * 0.05))},${n(VIEW_H * (0.7 + (i % 3) * 0.035))} q${n(18 + (i % 4) * 7)},${n(-8 - (i % 2) * 8)} ${n(44 + (i % 3) * 8)},2`} stroke="#6c452b" strokeWidth={n(3 + (i % 3))} fill="none" opacity={0.56} strokeLinecap="round" />
      ))}
      {finish(paint)}
    </g>
  ),

  'bean-06-climbing-stem': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('afternoon'))}
      <SunGlow cx={n(VIEW_W * 0.82)} cy={n(VIEW_H * 0.16)} r={78} core="#fff0bd" halo="#ffe4a1" />
      <Cloud x={VIEW_W * 0.24} y={VIEW_H * 0.14} scale={0.86} fill="#fff5d6" opacity={0.64} />
      <Sill y={VIEW_H * 0.76} fill="#d4b47a" />
      <GrassRow seed={seed} baseY={VIEW_H} blades={48} height={52} lean={4} fill="#5f9a4f" />
      <Pot x={n(VIEW_W * 0.38)} y={n(VIEW_H * 0.56)} w={250} h={216} paint={paint('pot')} />
      <VinePlant x={n(VIEW_W * 0.51)} baseY={n(VIEW_H * 0.58)} height={430} />
      <g transform={`translate(${n(VIEW_W * 0.74)} ${n(VIEW_H * 0.55)})`}>
        <Capsule x1={0} y1={0} x2={0} y2={148} width={56} fill={SHIRT} />
        <Capsule x1={-18} y1={28} x2={-120} y2={-50} width={21} fill={SHIRT_DARK} />
        <ellipse cx={-128} cy={-56} rx={22} ry={15} fill={SKIN_LIGHT} />
        <Capsule x1={18} y1={32} x2={84} y2={-20} width={21} fill={SHIRT} />
        <ellipse cx={92} cy={-26} rx={20} ry={14} fill={SKIN_LIGHT} />
        <SamHead cx={0} cy={-58} r={44} tilt={-7} mood="smile" />
        <Capsule x1={-12} y1={144} x2={-32} y2={222} width={20} fill={SHIRT_DARK} />
        <Capsule x1={14} y1={144} x2={46} y2={220} width={20} fill={SHIRT_DARK} />
      </g>
      {range(5).map((i) => (
        <ellipse key={i} cx={n(VIEW_W * 0.64)} cy={n(VIEW_H * (0.34 + i * 0.078))} rx={n(18 + i * 3)} ry={6} fill="#fff1bb" opacity={n(0.45 - i * 0.05)} />
      ))}
      {finish(paint)}
    </g>
  ),

  'bean-07-moonlit-plant': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('nightSky'))}
      <StarField seed={seed} count={44} height={VIEW_H * 0.58} color="#dfe7ff" />
      <rect x={n(VIEW_W * 0.46)} y={n(VIEW_H * 0.08)} width={n(VIEW_W * 0.42)} height={n(VIEW_H * 0.58)} rx={18} fill="#111a32" />
      <rect x={n(VIEW_W * 0.49)} y={n(VIEW_H * 0.11)} width={n(VIEW_W * 0.36)} height={n(VIEW_H * 0.51)} fill="#202c50" />
      <Moon cx={n(VIEW_W * 0.74)} cy={n(VIEW_H * 0.25)} r={76} glow={paint('moonGlow')} face="#f3eed5" />
      <rect x={n(VIEW_W * 0.66)} y={n(VIEW_H * 0.1)} width={10} height={n(VIEW_H * 0.52)} fill="#3b456d" />
      <rect x={n(VIEW_W * 0.49)} y={n(VIEW_H * 0.36)} width={n(VIEW_W * 0.36)} height={10} fill="#3b456d" />
      <Sill y={VIEW_H * 0.66} fill="#566080" />
      <Pot x={n(VIEW_W * 0.56)} y={n(VIEW_H * 0.49)} w={174} h={154} paint="#663622" />
      <VinePlant x={n(VIEW_W * 0.635)} baseY={n(VIEW_H * 0.5)} height={250} silhouetted />
      <ellipse cx={n(VIEW_W * 0.64)} cy={n(VIEW_H * 0.69)} rx={150} ry={24} fill="#12172b" opacity={0.44} />
      <rect x={0} y={n(VIEW_H * 0.7)} width={VIEW_W} height={n(VIEW_H * 0.3)} fill="#252a4b" />
      <rect x={n(VIEW_W * 0.04)} y={n(VIEW_H * 0.64)} width={n(VIEW_W * 0.42)} height={n(VIEW_H * 0.21)} rx={22} fill={paint('bed')} />
      <path d={`M${n(VIEW_W * 0.05)},${n(VIEW_H * 0.85)} L${n(VIEW_W * 0.05)},${n(VIEW_H * 0.76)} Q${n(VIEW_W * 0.24)},${n(VIEW_H * 0.68)} ${n(VIEW_W * 0.47)},${n(VIEW_H * 0.76)} L${n(VIEW_W * 0.47)},${n(VIEW_H * 0.86)} Z`} fill="#6e78a8" />
      <ellipse cx={n(VIEW_W * 0.14)} cy={n(VIEW_H * 0.69)} rx={72} ry={40} fill="#d9def0" />
      <SamHead cx={n(VIEW_W * 0.16)} cy={n(VIEW_H * 0.65)} r={42} tilt={-14} mood="sleep" />
      {range(5).map((i) => (
        <circle key={i} cx={n(VIEW_W * (0.28 + i * 0.04))} cy={n(VIEW_H * (0.56 - i * 0.035))} r={n(7 + i * 3)} fill="#cfd7ff" opacity={n(0.48 - i * 0.04)} />
      ))}
      {finish(paint)}
    </g>
  ),
};

export const beanWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
