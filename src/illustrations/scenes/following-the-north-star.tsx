import type { ReactNode } from 'react';
import {
  Blush,
  Capsule,
  ClosedEye,
  Eye,
  GrainFilter,
  GrainWash,
  GrassRow,
  LinearGradient,
  Moon,
  RadialGradient,
  Smile,
  SoftBlur,
  Star,
  StarField,
  Tree,
  VIEW_H,
  VIEW_W,
  Vignette,
  Water,
  n,
  range,
  requireScenePage,
  type SceneWorld,
  type SceneWorldProps,
} from '../shared';

const SKIN_MIRA = '#c78c67';
const SKIN_BEN = '#8f5b3f';
const HAIR_MIRA = '#201525';
const HAIR_BEN = '#2b1a14';
const COAT_MIRA = '#5d6fa8';
const COAT_MIRA_DARK = '#46547f';
const COAT_BEN = '#344b6d';
const COAT_BEN_DARK = '#243850';
const SCARF = '#d6a45d';
const PATH = '#171d31';
const PATH_EDGE = '#263854';
const TREE_DARK = '#101728';
const TREE_MID = '#18243a';
const GRASS_DARK = '#172839';
const GRASS_MID = '#213a4a';
const MOON_FACE = '#ece9d8';
const STAR_WARM = '#ffe7a0';
const STAR_COOL = '#dce8ff';

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('darkPathSky')}
        stops={[
          { offset: 0, color: '#111831' },
          { offset: 0.58, color: '#25375a' },
          { offset: 1, color: '#566080' },
        ]}
      />
      <LinearGradient
        id={id('coolSky')}
        stops={[
          { offset: 0, color: '#0e1730' },
          { offset: 0.64, color: '#1c3155' },
          { offset: 1, color: '#405b77' },
        ]}
      />
      <LinearGradient
        id={id('inkySky')}
        stops={[
          { offset: 0, color: '#080d20' },
          { offset: 0.7, color: '#152543' },
          { offset: 1, color: '#263b59' },
        ]}
      />
      <LinearGradient
        id={id('domeSky')}
        stops={[
          { offset: 0, color: '#05091b' },
          { offset: 0.56, color: '#111f3f' },
          { offset: 1, color: '#25395d' },
        ]}
      />
      <LinearGradient
        id={id('polarisSky')}
        stops={[
          { offset: 0, color: '#030713' },
          { offset: 0.68, color: '#0b1832' },
          { offset: 1, color: '#17294a' },
        ]}
      />
      <LinearGradient
        id={id('homeSky')}
        stops={[
          { offset: 0, color: '#0b1328' },
          { offset: 0.62, color: '#1a3154' },
          { offset: 1, color: '#385471' },
        ]}
      />
      <LinearGradient
        id={id('bedroomSky')}
        stops={[
          { offset: 0, color: '#071024' },
          { offset: 1, color: '#1b2a4e' },
        ]}
      />
      <LinearGradient
        id={id('pathGlow')}
        stops={[
          { offset: 0, color: '#4b5f79', opacity: 0.52 },
          { offset: 1, color: '#131827', opacity: 0.96 },
        ]}
      />
      <LinearGradient
        id={id('pond')}
        stops={[
          { offset: 0, color: '#293e61' },
          { offset: 1, color: '#0d1b34' },
        ]}
      />
      <LinearGradient
        id={id('blanket')}
        stops={[
          { offset: 0, color: '#9272a8' },
          { offset: 1, color: '#4f4c83' },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#f2efd8', opacity: 0.82 },
          { offset: 1, color: '#f2efd8', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('northGlow')}
        stops={[
          { offset: 0, color: '#ffe9a8', opacity: 0.9 },
          { offset: 0.45, color: '#ffe9a8', opacity: 0.34 },
          { offset: 1, color: '#ffe9a8', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('windowGlow')}
        stops={[
          { offset: 0, color: '#ffe7a5' },
          { offset: 0.55, color: '#f2bd67', opacity: 0.88 },
          { offset: 1, color: '#f2bd67', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('lampGlow')}
        stops={[
          { offset: 0, color: '#f6c87a', opacity: 0.6 },
          { offset: 1, color: '#f6c87a', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.58, color: '#000000', opacity: 0 },
          { offset: 1, color: '#01030a', opacity: 0.56 },
        ]}
      />
      <SoftBlur id={id('mistBlur')} amount={7} />
      <GrainFilter id={id('grain')} frequency={0.82} opacity={0.05} />
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

function NightGround({ topY = 610 }: { topY?: number }) {
  return (
    <>
      <path
        d={`M0,${VIEW_H} L0,${n(topY)} C${n(VIEW_W * 0.22)},${n(topY - 42)} ${n(
          VIEW_W * 0.72,
        )},${n(topY + 28)} ${VIEW_W},${n(topY - 12)} L${VIEW_W},${VIEW_H} Z`}
        fill={GRASS_DARK}
      />
      <path
        d={`M0,${VIEW_H} L0,${n(topY + 92)} C${n(VIEW_W * 0.35)},${n(
          topY + 36,
        )} ${n(VIEW_W * 0.68)},${n(topY + 104)} ${VIEW_W},${n(topY + 54)} L${VIEW_W},${VIEW_H} Z`}
        fill="#0f1d2a"
        opacity={0.82}
      />
    </>
  );
}

function PathRibbon() {
  return (
    <g className="scene-path-split" data-motif="path">
      <path
        d={`M${n(VIEW_W * 0.45)},${VIEW_H} C${n(VIEW_W * 0.3)},${n(VIEW_H * 0.73)} ${n(
          VIEW_W * 0.18,
        )},${n(VIEW_H * 0.58)} ${n(VIEW_W * 0.08)},${n(VIEW_H * 0.46)} L${n(
          VIEW_W * 0.22,
        )},${n(VIEW_H * 0.42)} C${n(VIEW_W * 0.38)},${n(VIEW_H * 0.58)} ${n(
          VIEW_W * 0.5,
        )},${n(VIEW_H * 0.76)} ${n(VIEW_W * 0.58)},${VIEW_H} Z`}
        fill={PATH}
      />
      <path
        d={`M${n(VIEW_W * 0.55)},${VIEW_H} C${n(VIEW_W * 0.7)},${n(VIEW_H * 0.73)} ${n(
          VIEW_W * 0.82,
        )},${n(VIEW_H * 0.58)} ${n(VIEW_W * 0.92)},${n(VIEW_H * 0.46)} L${n(
          VIEW_W * 0.78,
        )},${n(VIEW_H * 0.42)} C${n(VIEW_W * 0.62)},${n(VIEW_H * 0.58)} ${n(
          VIEW_W * 0.5,
        )},${n(VIEW_H * 0.76)} ${n(VIEW_W * 0.42)},${VIEW_H} Z`}
        fill={PATH}
      />
    </g>
  );
}

function LitPath({ left = false, paint }: { left?: boolean; paint: string }) {
  return (
    <path
      d={`M${n(left ? VIEW_W * 0.28 : VIEW_W * 0.34)},${VIEW_H} C${n(
        left ? VIEW_W * 0.34 : VIEW_W * 0.43,
      )},${n(VIEW_H * 0.72)} ${n(left ? VIEW_W * 0.22 : VIEW_W * 0.47)},${n(
        VIEW_H * 0.56,
      )} ${n(left ? VIEW_W * 0.28 : VIEW_W * 0.52)},${n(VIEW_H * 0.42)} C${n(
        left ? VIEW_W * 0.44 : VIEW_W * 0.64,
      )},${n(VIEW_H * 0.55)} ${n(left ? VIEW_W * 0.5 : VIEW_W * 0.6)},${n(
        VIEW_H * 0.76,
      )} ${n(left ? VIEW_W * 0.63 : VIEW_W * 0.68)},${VIEW_H} Z`}
      fill={paint}
      data-motif="path"
    />
  );
}

function TreeLine({ y = 620, dense = 8 }: { y?: number; dense?: number }) {
  return (
    <g className="scene-treeline">
      {range(dense).map((i) => {
        const leftX = n(42 + i * 74);
        const rightX = n(VIEW_W - 42 - i * 74);
        const h = n(210 + (i % 3) * 38);
        return (
          <g key={i}>
            <Tree x={leftX} baseY={y} height={h} spread={n(78 + (i % 2) * 18)} canopy={TREE_MID} trunk={TREE_DARK} />
            <Tree x={rightX} baseY={n(y + 6)} height={n(h + 18)} spread={n(82 + (i % 2) * 22)} canopy={TREE_DARK} trunk={TREE_DARK} />
          </g>
        );
      })}
    </g>
  );
}

function MiraHead({ cx, cy, r = 20, asleep = false, unsure = false }: { cx: number; cy: number; r?: number; asleep?: boolean; unsure?: boolean }) {
  return (
    <g>
      <circle cx={n(cx)} cy={n(cy)} r={n(r)} fill={SKIN_MIRA} />
      <path
        d={`M${n(cx - r)},${n(cy - r * 0.22)} Q${n(cx - r * 0.4)},${n(cy - r * 1.3)} ${n(
          cx + r * 0.78,
        )},${n(cy - r * 0.5)} Q${n(cx + r * 0.62)},${n(cy - r * 1.08)} ${n(
          cx + r,
        )},${n(cy - r * 0.08)} Q${n(cx + r * 0.35)},${n(cy - r * 0.72)} ${n(
          cx - r,
        )},${n(cy - r * 0.22)} Z`}
        fill={HAIR_MIRA}
      />
      <circle cx={n(cx - r * 0.82)} cy={n(cy + r * 0.18)} r={n(r * 0.28)} fill={HAIR_MIRA} />
      {asleep ? (
        <>
          <ClosedEye cx={n(cx - r * 0.32)} cy={n(cy + r * 0.02)} w={n(r * 0.48)} />
          <ClosedEye cx={n(cx + r * 0.32)} cy={n(cy + r * 0.02)} w={n(r * 0.48)} />
        </>
      ) : (
        <>
          <Eye cx={n(cx - r * 0.32)} cy={n(cy)} r={n(r * 0.12)} />
          <Eye cx={n(cx + r * 0.32)} cy={n(cy)} r={n(r * 0.12)} />
        </>
      )}
      <Blush cx={n(cx - r * 0.52)} cy={n(cy + r * 0.36)} r={n(r * 0.16)} />
      <Blush cx={n(cx + r * 0.52)} cy={n(cy + r * 0.36)} r={n(r * 0.16)} />
      {unsure ? <Smile cx={n(cx)} cy={n(cy + r * 0.48)} w={n(r * 0.48)} curve={n(-r * 0.16)} width={2} /> : <Smile cx={n(cx)} cy={n(cy + r * 0.45)} w={n(r * 0.72)} curve={n(r * 0.28)} width={2} />}
    </g>
  );
}

function BenHead({ cx, cy, r = 26 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={n(cx)} cy={n(cy)} r={n(r)} fill={SKIN_BEN} />
      <path
        d={`M${n(cx - r)},${n(cy - r * 0.24)} Q${n(cx)},${n(cy - r * 1.15)} ${n(
          cx + r,
        )},${n(cy - r * 0.22)} Q${n(cx + r * 0.52)},${n(cy - r * 0.68)} ${n(
          cx,
        )},${n(cy - r * 0.66)} Q${n(cx - r * 0.54)},${n(cy - r * 0.68)} ${n(
          cx - r,
        )},${n(cy - r * 0.24)} Z`}
        fill={HAIR_BEN}
      />
      <Eye cx={n(cx - r * 0.3)} cy={n(cy)} r={n(r * 0.1)} />
      <Eye cx={n(cx + r * 0.3)} cy={n(cy)} r={n(r * 0.1)} />
      <Smile cx={n(cx)} cy={n(cy + r * 0.42)} w={n(r * 0.62)} curve={n(r * 0.26)} width={2.4} />
    </g>
  );
}

function Mira({ x, y, scale = 1, pose = 'hold', asleep = false }: { x: number; y: number; scale?: number; pose?: 'hold' | 'pause' | 'point' | 'gaze' | 'reach' | 'hug' | 'bed'; asleep?: boolean }) {
  const unsure = pose === 'hold' || pose === 'pause';
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-mira">
      {pose === 'bed' ? (
        <>
          <ellipse cx={-16} cy={26} rx={48} ry={26} fill="#f4e3d7" opacity={0.92} />
          <MiraHead cx={-8} cy={6} r={25} asleep={asleep} />
        </>
      ) : (
        <>
          <Capsule x1={0} y1={12} x2={0} y2={78} width={34} fill={COAT_MIRA} />
          <rect x={-16} y={38} width={32} height={8} rx={4} fill={COAT_MIRA_DARK} opacity={0.7} />
          {pose === 'point' || pose === 'reach' ? (
            <>
              <Capsule x1={12} y1={28} x2={72} y2={pose === 'point' ? -10 : -78} width={11} fill={COAT_MIRA} />
              <ellipse cx={pose === 'point' ? 76 : 74} cy={pose === 'point' ? -12 : -82} rx={10} ry={7} fill={SKIN_MIRA} />
            </>
          ) : (
            <Capsule x1={14} y1={28} x2={38} y2={pose === 'gaze' ? 4 : 30} width={11} fill={COAT_MIRA} />
          )}
          <Capsule x1={-13} y1={28} x2={pose === 'hug' ? -48 : -32} y2={pose === 'hug' ? 6 : 30} width={11} fill={COAT_MIRA_DARK} />
          <Capsule x1={-8} y1={76} x2={-13} y2={118} width={12} fill={COAT_MIRA_DARK} />
          <Capsule x1={9} y1={76} x2={14} y2={118} width={12} fill={COAT_MIRA_DARK} />
          <ellipse cx={-14} cy={122} rx={10} ry={6} fill={HAIR_MIRA} />
          <ellipse cx={15} cy={122} rx={10} ry={6} fill={HAIR_MIRA} />
          <path d="M-14,16 q14,16 28,0" stroke={SCARF} strokeWidth={8} fill="none" strokeLinecap="round" />
          <MiraHead cx={0} cy={-18} r={24} unsure={unsure} />
        </>
      )}
    </g>
  );
}

function Ben({ x, y, scale = 1, pose = 'hold' }: { x: number; y: number; scale?: number; pose?: 'hold' | 'pause' | 'point' | 'gaze' | 'hug' }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-ben">
      <Capsule x1={0} y1={16} x2={0} y2={112} width={42} fill={COAT_BEN} />
      <rect x={-20} y={54} width={40} height={10} rx={5} fill={COAT_BEN_DARK} opacity={0.7} />
      {pose === 'point' ? (
        <>
          <Capsule x1={16} y1={40} x2={96} y2={-72} width={14} fill={COAT_BEN} />
          <ellipse cx={100} cy={-76} rx={13} ry={9} fill={SKIN_BEN} />
        </>
      ) : pose === 'hug' ? (
        <Capsule x1={-15} y1={42} x2={-78} y2={42} width={15} fill={COAT_BEN_DARK} />
      ) : (
        <Capsule x1={-16} y1={42} x2={-56} y2={pose === 'gaze' ? 10 : 56} width={14} fill={COAT_BEN_DARK} />
      )}
      <Capsule x1={15} y1={42} x2={52} y2={pose === 'pause' ? 28 : 58} width={14} fill={COAT_BEN} />
      <Capsule x1={-12} y1={108} x2={-20} y2={170} width={15} fill={COAT_BEN_DARK} />
      <Capsule x1={13} y1={108} x2={22} y2={170} width={15} fill={COAT_BEN_DARK} />
      <ellipse cx={-21} cy={176} rx={14} ry={7} fill={HAIR_BEN} />
      <ellipse cx={24} cy={176} rx={14} ry={7} fill={HAIR_BEN} />
      <BenHead cx={0} cy={-24} r={28} />
    </g>
  );
}

function Owl({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-owl">
      <ellipse cx={0} cy={12} rx={24} ry={34} fill="#2d2540" />
      <path d="M-24,-8 q24,-30 48,0 q-24,-10 -48,0" fill="#382f4b" />
      <circle cx={-9} cy={2} r={7} fill="#f0df9b" />
      <circle cx={9} cy={2} r={7} fill="#f0df9b" />
      <Eye cx={-9} cy={2} r={2.8} fill="#161020" />
      <Eye cx={9} cy={2} r={2.8} fill="#161020" />
      <path d="M-4,12 L4,12 L0,20 Z" fill="#c58c4c" />
    </g>
  );
}

function Bush({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} fill="#1b3443" className="scene-bush">
      <circle cx={-46} cy={14} r={40} />
      <circle cx={0} cy={-4} r={56} />
      <circle cx={50} cy={14} r={38} />
      <ellipse cx={0} cy={46} rx={92} ry={28} fill="#142838" />
    </g>
  );
}

function RopeSwing({ x, y, height = 220 }: { x: number; y: number; height?: number }) {
  return (
    <g className="scene-rope-swing" strokeLinecap="round">
      <line x1={n(x - 22)} y1={n(y)} x2={n(x - 18)} y2={n(y + height)} stroke="#534533" strokeWidth={4} />
      <line x1={n(x + 22)} y1={n(y)} x2={n(x + 18)} y2={n(y + height)} stroke="#534533" strokeWidth={4} />
      <rect x={n(x - 54)} y={n(y + height - 4)} width={108} height={16} rx={7} fill="#5b4631" />
    </g>
  );
}

function NorthStar({ cx, cy, r = 30, paint }: { cx: number; cy: number; r?: number; paint: string }) {
  return (
    <g className="scene-north-star" data-motif="north-star" data-cx={n(cx)} data-cy={n(cy)}>
      <circle cx={n(cx)} cy={n(cy)} r={n(r * 2.7)} fill={paint} />
      <Star cx={n(cx)} cy={n(cy)} r={n(r)} waist={0.2} fill={STAR_WARM} />
      <circle cx={n(cx)} cy={n(cy)} r={n(r * 0.18)} fill="#fff7d1" />
    </g>
  );
}

function House({ x, y, scale, paint }: { x: number; y: number; scale: number; paint: string }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-house">
      <circle cx={110} cy={86} r={132} fill={paint} opacity={0.72} />
      <rect x={0} y={72} width={230} height={150} rx={10} fill="#4a3340" />
      <path d="M-22,78 L115,-22 L252,78 Z" fill="#2c2437" />
      <rect x={26} y={110} width={58} height={58} rx={6} fill="#ffda86" />
      <rect x={146} y={108} width={58} height={62} rx={6} fill="#ffd27a" />
      <rect x={101} y={152} width={40} height={70} rx={7} fill="#2a2132" />
      <line x1={55} y1={110} x2={55} y2={168} stroke="#6c4a45" strokeWidth={5} />
      <line x1={26} y1={139} x2={84} y2={139} stroke="#6c4a45" strokeWidth={5} />
      <line x1={175} y1={108} x2={175} y2={170} stroke="#6c4a45" strokeWidth={5} />
      <line x1={146} y1={139} x2={204} y2={139} stroke="#6c4a45" strokeWidth={5} />
      <rect x={176} y={-2} width={28} height={58} rx={4} fill="#30283a" />
    </g>
  );
}

function Bridge({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-bridge">
      <path d="M0,58 Q105,-14 210,58" stroke="#6d5a47" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d="M16,44 Q105,-8 194,44" stroke="#b59a74" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.55} />
      {range(5).map((i) => (
        <line key={i} x1={n(26 + i * 40)} y1={n(36 - Math.sin((i / 4) * Math.PI) * 26)} x2={n(26 + i * 40)} y2={74} stroke="#4d3f35" strokeWidth={6} />
      ))}
    </g>
  );
}

function Rooftops({ y = 570 }: { y?: number }) {
  return (
    <g className="scene-rooftops" fill="#111a2d">
      {range(6).map((i) => {
        const x = n(80 + i * 180);
        return (
          <g key={i}>
            <rect x={n(x)} y={n(y + (i % 2) * 18)} width={132} height={88} />
            <path d={`M${n(x - 14)},${n(y + (i % 2) * 18)} L${n(x + 66)},${n(y - 44 + (i % 2) * 18)} L${n(x + 146)},${n(y + (i % 2) * 18)} Z`} />
          </g>
        );
      })}
    </g>
  );
}

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'navigation-01-dark-path': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('darkPathSky'))}
      <StarField seed={seed} count={56} y={0} height={n(VIEW_H * 0.52)} color={STAR_COOL} minR={0.8} maxR={2.2} />
      <Moon cx={n(VIEW_W * 0.78)} cy={n(VIEW_H * 0.28)} r={58} glow={paint('moonGlow')} face={MOON_FACE} />
      <TreeLine y={650} dense={7} />
      <NightGround topY={610} />
      <LitPath paint={paint('pathGlow')} />
      <path d={`M${n(VIEW_W * 0.08)},${n(VIEW_H * 0.5)} C${n(VIEW_W * 0.28)},${n(VIEW_H * 0.56)} ${n(VIEW_W * 0.75)},${n(VIEW_H * 0.55)} ${n(VIEW_W * 0.94)},${n(VIEW_H * 0.48)}`} stroke={PATH_EDGE} strokeWidth={6} fill="none" opacity={0.44} />
      <path d={`M${n(VIEW_W * 0.14)},${n(VIEW_H * 0.28)} C${n(VIEW_W * 0.24)},${n(VIEW_H * 0.18)} ${n(VIEW_W * 0.34)},${n(VIEW_H * 0.2)} ${n(VIEW_W * 0.42)},${n(VIEW_H * 0.28)}`} stroke="#14182a" strokeWidth={18} fill="none" strokeLinecap="round" />
      <Owl x={n(VIEW_W * 0.33)} y={n(VIEW_H * 0.24)} scale={0.82} />
      <GrassRow seed={seed + 11} baseY={VIEW_H} blades={40} height={48} lean={-4} fill={GRASS_MID} />
      <Mira x={n(VIEW_W * 0.46)} y={n(VIEW_H * 0.7)} scale={0.7} pose="hold" />
      <Ben x={n(VIEW_W * 0.53)} y={n(VIEW_H * 0.65)} scale={0.72} pose="hold" />
      {range(9).map((i) => (
        <circle key={i} cx={n(170 + i * 48)} cy={n(650 + (i % 3) * 20)} r={n(3 + (i % 2) * 1.2)} fill="#9ed17f" opacity={0.62} />
      ))}
      {finish(paint)}
    </g>
  ),

  'navigation-02-fork-breath': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('coolSky'))}
      <StarField seed={seed} count={44} height={n(VIEW_H * 0.46)} color="#d6e6ff" minR={0.8} maxR={2} />
      <Moon cx={n(VIEW_W * 0.18)} cy={n(VIEW_H * 0.22)} r={50} glow={paint('moonGlow')} face={MOON_FACE} />
      <TreeLine y={650} dense={6} />
      <NightGround topY={588} />
      <PathRibbon />
      <Bush x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.55)} scale={1.08} />
      <path d={`M${n(VIEW_W * 0.31)},${VIEW_H} C${n(VIEW_W * 0.38)},${n(VIEW_H * 0.74)} ${n(VIEW_W * 0.42)},${n(VIEW_H * 0.62)} ${n(VIEW_W * 0.47)},${n(VIEW_H * 0.52)}`} stroke="#344a65" strokeWidth={5} fill="none" opacity={0.35} />
      <path d={`M${n(VIEW_W * 0.69)},${VIEW_H} C${n(VIEW_W * 0.62)},${n(VIEW_H * 0.74)} ${n(VIEW_W * 0.58)},${n(VIEW_H * 0.62)} ${n(VIEW_W * 0.53)},${n(VIEW_H * 0.52)}`} stroke="#344a65" strokeWidth={5} fill="none" opacity={0.35} />
      <g filter={paint('mistBlur')} opacity={0.72} fill="#d9e9f4">
        <ellipse cx={n(VIEW_W * 0.47)} cy={n(VIEW_H * 0.55)} rx={42} ry={16} />
        <ellipse cx={n(VIEW_W * 0.43)} cy={n(VIEW_H * 0.53)} rx={26} ry={12} opacity={0.7} />
        <ellipse cx={n(VIEW_W * 0.51)} cy={n(VIEW_H * 0.52)} rx={24} ry={10} opacity={0.62} />
      </g>
      <Mira x={n(VIEW_W * 0.43)} y={n(VIEW_H * 0.67)} scale={0.82} pose="pause" />
      <Ben x={n(VIEW_W * 0.55)} y={n(VIEW_H * 0.61)} scale={0.84} pose="pause" />
      <GrassRow seed={seed + 7} baseY={VIEW_H} blades={44} height={44} lean={3} fill={GRASS_MID} />
      {finish(paint)}
    </g>
  ),

  'navigation-03-oak-landmark': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('inkySky'))}
      <StarField seed={seed} count={48} height={n(VIEW_H * 0.48)} color="#d8e4fb" minR={0.8} maxR={2} />
      <Moon cx={n(VIEW_W * 0.74)} cy={n(VIEW_H * 0.24)} r={62} glow={paint('moonGlow')} face={MOON_FACE} />
      <NightGround topY={620} />
      <LitPath left paint={paint('pathGlow')} />
      <Tree x={n(VIEW_W * 0.32)} baseY={n(VIEW_H * 0.76)} height={450} spread={230} canopy="#0e1728" trunk="#17101a" />
      <path d={`M${n(VIEW_W * 0.31)},${n(VIEW_H * 0.43)} C${n(VIEW_W * 0.22)},${n(VIEW_H * 0.36)} ${n(VIEW_W * 0.14)},${n(VIEW_H * 0.34)} ${n(VIEW_W * 0.08)},${n(VIEW_H * 0.42)}`} stroke="#17101a" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={`M${n(VIEW_W * 0.36)},${n(VIEW_H * 0.42)} C${n(VIEW_W * 0.48)},${n(VIEW_H * 0.35)} ${n(VIEW_W * 0.57)},${n(VIEW_H * 0.35)} ${n(VIEW_W * 0.66)},${n(VIEW_H * 0.45)}`} stroke="#17101a" strokeWidth={22} fill="none" strokeLinecap="round" />
      <RopeSwing x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.43)} height={190} />
      <Bush x={n(VIEW_W * 0.86)} y={n(VIEW_H * 0.63)} scale={0.8} />
      <Mira x={n(VIEW_W * 0.63)} y={n(VIEW_H * 0.68)} scale={0.84} pose="point" />
      <Ben x={n(VIEW_W * 0.76)} y={n(VIEW_H * 0.62)} scale={0.86} pose="gaze" />
      <GrassRow seed={seed + 3} baseY={VIEW_H} blades={38} height={52} lean={-2} fill={GRASS_MID} />
      {finish(paint)}
    </g>
  ),

  'navigation-04-star-field': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('domeSky'))}
      <circle cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.5)} r={n(VIEW_W * 0.44)} fill="#1d315a" opacity={0.22} />
      <StarField seed={seed} count={190} height={n(VIEW_H * 0.72)} color="#eef4ff" minR={0.7} maxR={2.8} />
      <g data-motif="star-dome">
        {range(42).map((i) => {
          const angle = n(i * 13.4);
          const rx = n(90 + i * 8);
          const px = n(VIEW_W * 0.5 + Math.cos((angle * Math.PI) / 180) * rx);
          const py = n(VIEW_H * 0.38 + Math.sin((angle * Math.PI) / 180) * rx * 0.36);
          return <circle key={i} cx={px} cy={py} r={n(1.2 + (i % 4) * 0.5)} fill="#f1f5ff" opacity={n(0.36 + (i % 5) * 0.1)} />;
        })}
      </g>
      <path d={`M${n(VIEW_W * 0.08)},${n(VIEW_H * 0.72)} C${n(VIEW_W * 0.28)},${n(VIEW_H * 0.66)} ${n(VIEW_W * 0.74)},${n(VIEW_H * 0.67)} ${n(VIEW_W * 0.94)},${n(VIEW_H * 0.72)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="#142a3b" />
      <path d={`M0,${VIEW_H} L0,${n(VIEW_H * 0.78)} C${n(VIEW_W * 0.32)},${n(VIEW_H * 0.73)} ${n(VIEW_W * 0.66)},${n(VIEW_H * 0.75)} ${VIEW_W},${n(VIEW_H * 0.76)} L${VIEW_W},${VIEW_H} Z`} fill="#0c1c2a" />
      <Mira x={n(VIEW_W * 0.45)} y={n(VIEW_H * 0.76)} scale={0.58} pose="gaze" />
      <Ben x={n(VIEW_W * 0.54)} y={n(VIEW_H * 0.71)} scale={0.6} pose="gaze" />
      <GrassRow seed={seed + 19} baseY={VIEW_H} blades={36} height={40} lean={1} fill="#234458" />
      {finish(paint)}
    </g>
  ),

  'navigation-05-find-polaris': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('polarisSky'))}
      <StarField seed={seed} count={72} height={n(VIEW_H * 0.74)} color="#d9e7ff" minR={0.7} maxR={2.1} />
      <NorthStar cx={n(VIEW_W * 0.66)} cy={n(VIEW_H * 0.18)} r={42} paint={paint('northGlow')} />
      <g data-motif="pointer-star" data-cx={n(VIEW_W * 0.36)} data-cy={n(VIEW_H * 0.52)}>
        <Star cx={n(VIEW_W * 0.36)} cy={n(VIEW_H * 0.52)} r={24} fill="#f2f5ff" waist={0.22} />
      </g>
      <g data-motif="pointer-star" data-cx={n(VIEW_W * 0.49)} data-cy={n(VIEW_H * 0.39)}>
        <Star cx={n(VIEW_W * 0.49)} cy={n(VIEW_H * 0.39)} r={26} fill="#f4f7ff" waist={0.22} />
      </g>
      <path d={`M${n(VIEW_W * 0.36)},${n(VIEW_H * 0.52)} L${n(VIEW_W * 0.49)},${n(VIEW_H * 0.39)} L${n(VIEW_W * 0.66)},${n(VIEW_H * 0.18)}`} stroke="#f7edc9" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="2 18" opacity={0.86} data-motif="pointer-line" />
      <g transform={`translate(${n(VIEW_W * 0.17)} ${n(VIEW_H * 0.78)}) rotate(-25)`}>
        <Capsule x1={0} y1={24} x2={155} y2={-225} width={22} fill={COAT_BEN} />
        <ellipse cx={164} cy={-238} rx={22} ry={13} fill={SKIN_BEN} />
        <Capsule x1={34} y1={20} x2={220} y2={-180} width={10} fill={COAT_MIRA} />
        <ellipse cx={226} cy={-188} rx={14} ry={8} fill={SKIN_MIRA} />
      </g>
      <Mira x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.68)} scale={0.72} pose="reach" />
      <Ben x={n(VIEW_W * 0.08)} y={n(VIEW_H * 0.62)} scale={0.8} pose="point" />
      <path d={`M0,${VIEW_H} L0,${n(VIEW_H * 0.82)} C${n(VIEW_W * 0.35)},${n(VIEW_H * 0.72)} ${n(VIEW_W * 0.75)},${n(VIEW_H * 0.84)} ${VIEW_W},${n(VIEW_H * 0.76)} L${VIEW_W},${VIEW_H} Z`} fill="#091827" />
      {finish(paint)}
    </g>
  ),

  'navigation-06-home-windows': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('homeSky'))}
      <StarField seed={seed} count={54} height={n(VIEW_H * 0.5)} color="#dce9ff" minR={0.8} maxR={2.2} />
      <Moon cx={n(VIEW_W * 0.2)} cy={n(VIEW_H * 0.23)} r={48} glow={paint('moonGlow')} face={MOON_FACE} />
      <NorthStar cx={n(VIEW_W * 0.67)} cy={n(VIEW_H * 0.19)} r={24} paint={paint('northGlow')} />
      <path d={`M0,${n(VIEW_H * 0.66)} C${n(VIEW_W * 0.24)},${n(VIEW_H * 0.58)} ${n(VIEW_W * 0.72)},${n(VIEW_H * 0.58)} ${VIEW_W},${n(VIEW_H * 0.64)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="#14293b" />
      <House x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.42)} scale={1.16} paint={paint('windowGlow')} />
      <Water x={n(VIEW_W * 0.08)} y={n(VIEW_H * 0.67)} width={n(VIEW_W * 0.48)} height={n(VIEW_H * 0.17)} fill={paint('pond')} highlight="#d9e8ff" rx={46} />
      <Bridge x={n(VIEW_W * 0.32)} y={n(VIEW_H * 0.59)} scale={1.08} />
      <LitPath paint={paint('pathGlow')} />
      <Mira x={n(VIEW_W * 0.38)} y={n(VIEW_H * 0.7)} scale={0.72} pose="hug" />
      <Ben x={n(VIEW_W * 0.46)} y={n(VIEW_H * 0.62)} scale={0.74} pose="hug" />
      <GrassRow seed={seed + 23} baseY={VIEW_H} blades={42} height={44} lean={2} fill={GRASS_MID} />
      {finish(paint)}
    </g>
  ),

  'navigation-07-window-star': ({ paint, seed }) => (
    <g data-scene-art>
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#252142" />
      <circle cx={n(VIEW_W * 0.2)} cy={n(VIEW_H * 0.78)} r={n(VIEW_W * 0.32)} fill={paint('lampGlow')} opacity={0.58} />
      <rect x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.08)} width={n(VIEW_W * 0.4)} height={n(VIEW_H * 0.56)} rx={16} fill="#12182d" />
      <rect x={n(VIEW_W * 0.55)} y={n(VIEW_H * 0.11)} width={n(VIEW_W * 0.34)} height={n(VIEW_H * 0.5)} rx={8} fill={paint('bedroomSky')} />
      <StarField seed={seed} count={30} x={n(VIEW_W * 0.55)} y={n(VIEW_H * 0.11)} width={n(VIEW_W * 0.34)} height={n(VIEW_H * 0.32)} color="#dce8ff" minR={0.7} maxR={1.8} />
      <Rooftops y={n(VIEW_H * 0.43)} />
      <NorthStar cx={n(VIEW_W * 0.75)} cy={n(VIEW_H * 0.2)} r={26} paint={paint('northGlow')} />
      <rect x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.07)} width={16} height={n(VIEW_H * 0.58)} fill="#3b3358" />
      <rect x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.07)} width={16} height={n(VIEW_H * 0.58)} fill="#3b3358" />
      <rect x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.36)} width={n(VIEW_W * 0.4)} height={14} fill="#3b3358" />
      <rect x={n(VIEW_W * 0.705)} y={n(VIEW_H * 0.08)} width={14} height={n(VIEW_H * 0.56)} fill="#3b3358" />
      <rect x={0} y={n(VIEW_H * 0.7)} width={VIEW_W} height={n(VIEW_H * 0.3)} fill="#2f2b4f" />
      <rect x={n(VIEW_W * 0.06)} y={n(VIEW_H * 0.62)} width={n(VIEW_W * 0.42)} height={n(VIEW_H * 0.18)} rx={24} fill="#e8d6c4" />
      <path d={`M${n(VIEW_W * 0.04)},${n(VIEW_H * 0.78)} C${n(VIEW_W * 0.18)},${n(VIEW_H * 0.67)} ${n(VIEW_W * 0.38)},${n(VIEW_H * 0.68)} ${n(VIEW_W * 0.52)},${n(VIEW_H * 0.78)} L${n(VIEW_W * 0.52)},${VIEW_H} L${n(VIEW_W * 0.04)},${VIEW_H} Z`} fill={paint('blanket')} />
      <Mira x={n(VIEW_W * 0.18)} y={n(VIEW_H * 0.62)} scale={1.05} pose="bed" asleep />
      <path d={`M${n(VIEW_W * 0.28)},${n(VIEW_H * 0.65)} C${n(VIEW_W * 0.39)},${n(VIEW_H * 0.58)} ${n(VIEW_W * 0.49)},${n(VIEW_H * 0.5)} ${n(VIEW_W * 0.58)},${n(VIEW_H * 0.42)}`} stroke="#ffe7a5" strokeWidth={4} fill="none" opacity={0.26} strokeLinecap="round" />
      {finish(paint)}
    </g>
  ),
};

export const starWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
