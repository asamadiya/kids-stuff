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
  Hill,
  Leaf,
  LinearGradient,
  Moon,
  OpenMouth,
  RadialGradient,
  Smile,
  StarField,
  SunGlow,
  Tree,
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
 * WORLD: Nadia's Kite and the Wind — a breezy grassy hilltop and a big sky.
 * Motifs: red poppy kite, long rag-bow tail, one-direction wind clues,
 * streaming flag, leaning grass, drifting clouds, and a cozy blue bedroom.
 */

const KITE = '#d93e36';
const KITE_DARK = '#a9282e';
const KITE_LIGHT = '#ef6754';
const SPAR = '#7a4a36';
const STRING = '#f1eee5';
const SKIN = '#9b6a4a';
const SKIN_LIGHT = '#b9825b';
const HAIR = '#2f1d1a';
const NADIA_DRESS = '#f3b554';
const NADIA_DRESS_DARK = '#d88b3d';
const NADIA_LEGGINGS = '#326d78';
const GRANDPA_SWEATER = '#4f8f83';
const GRANDPA_PANTS = '#7b684d';
const GRANDPA_HAIR = '#e1ddd2';

const sky = (fill: string) => <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={fill} />;

function WindStreaks({ y, count = 4, color = '#ffffff', opacity = 0.4 }: { y: number; count?: number; color?: string; opacity?: number }) {
  return (
    <g className="scene-wind-streaks" data-motif="wind" data-wind-dir="right" stroke={color} strokeLinecap="round" fill="none" opacity={opacity}>
      {range(count).map((i) => {
        const yy = n(y + i * 58);
        const start = n(72 + i * 84);
        return (
          <path
            key={i}
            d={`M${start},${yy} C${n(start + 92)},${n(yy - 28)} ${n(start + 210)},${n(yy + 26)} ${n(
              start + 360,
            )},${n(yy - 8)}`}
            strokeWidth={n(3.5 - i * 0.35)}
          />
        );
      })}
    </g>
  );
}

function RagBow({ x, y, scale = 1, angle = 0 }: { x: number; y: number; scale?: number; angle?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(scale)})`}>
      <circle cx={0} cy={0} r={4} fill={KITE_DARK} />
      <path d="M-3,0 C-18,-12 -30,-10 -34,0 C-28,8 -16,10 -3,0 Z" fill="#f7d6a4" />
      <path d="M3,0 C18,-12 30,-10 34,0 C28,8 16,10 3,0 Z" fill="#f0bfc5" />
    </g>
  );
}

function Kite({
  cx,
  cy,
  size,
  rotate = 0,
  crumpled = false,
  tail = true,
}: {
  cx: number;
  cy: number;
  size: number;
  rotate?: number;
  crumpled?: boolean;
  tail?: boolean;
}) {
  const top = n(-size);
  const right = n(size * (crumpled ? 0.68 : 0.58));
  const bottom = n(size * (crumpled ? 0.86 : 0.98));
  const left = n(-size * (crumpled ? 0.5 : 0.58));
  const fold = crumpled ? ` Q${n(size * 0.24)},${n(size * 0.12)} 0,${bottom}` : ` L0,${bottom}`;
  return (
    <g className="scene-kite-tug">
      <g className="scene-kite" data-motif="kite" data-cx={n(cx)} data-cy={n(cy)} transform={`translate(${n(cx)} ${n(cy)}) rotate(${n(rotate)})`}>
        <path d={`M0,${top} L${right},0${fold} L${left},0 Z`} fill={KITE} />
        <path d={`M0,${top} L${right},0 L0,${bottom} Z`} fill={KITE_LIGHT} opacity={0.32} />
        <path d={`M0,${top} L0,${bottom} M${left},0 L${right},0`} stroke={SPAR} strokeWidth={n(size * 0.055)} strokeLinecap="round" />
        <path d={`M0,${bottom} C${n(size * 0.3)},${n(size * 1.45)} ${n(-size * 0.4)},${n(size * 1.88)} ${n(size * 0.2)},${n(size * 2.4)}`} stroke={KITE_DARK} strokeWidth={n(size * 0.035)} fill="none" strokeLinecap="round" />
        {tail ? (
          <>
            {range(5).map((i) => (
              <RagBow
                key={i}
                x={n((i % 2 === 0 ? 1 : -1) * size * (0.1 + i * 0.03))}
                y={n(size * (1.22 + i * 0.28))}
                scale={n(size / 82)}
                angle={n(i % 2 === 0 ? 18 : -20)}
              />
            ))}
          </>
        ) : null}
      </g>
    </g>
  );
}

function Flag({ x, y, scale = 1, wind = 1 }: { x: number; y: number; scale?: number; wind?: number }) {
  return (
    <g className="scene-flag" data-motif="wind" data-wind-dir="right" transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
      <rect x={-5} y={0} width={10} height={170} rx={4} fill="#6b614e" />
      <path
        d={`M4,14 C${n(55 * wind)},${n(-10)} ${n(102 * wind)},${n(36)} ${n(154 * wind)},${n(10)} L${n(
          154 * wind,
        )},62 C${n(108 * wind)},86 ${n(55 * wind)},42 4,70 Z`}
        fill={KITE}
      />
      <path d={`M4,18 C${n(50 * wind)},8 ${n(102 * wind)},46 ${n(154 * wind)},20`} stroke="#ffaea1" strokeWidth={6} fill="none" opacity={0.55} />
    </g>
  );
}

function NadiaHead({ cx, cy, r = 30, tilt = 0, asleep = false, mouth = 'smile' }: { cx: number; cy: number; r?: number; tilt?: number; asleep?: boolean; mouth?: 'smile' | 'open' | 'soft' }) {
  return (
    <g transform={`rotate(${n(tilt)} ${n(cx)} ${n(cy)})`}>
      <circle cx={n(cx)} cy={n(cy)} r={r} fill={SKIN} />
      <path
        d={`M${n(cx - r * 1.05)},${n(cy - r * 0.15)} C${n(cx - r * 0.95)},${n(cy - r * 1.15)} ${n(
          cx + r * 0.5,
        )},${n(cy - r * 1.35)} ${n(cx + r * 1.05)},${n(cy - r * 0.2)} C${n(cx + r * 0.5)},${n(
          cy - r * 0.62,
        )} ${n(cx - r * 0.25)},${n(cy - r * 0.5)} ${n(cx - r * 1.05)},${n(cy - r * 0.15)} Z`}
        fill={HAIR}
      />
      <path d={`M${n(cx + r * 0.65)},${n(cy - r * 0.35)} q${n(r * 0.72)},${n(-r * 0.22)} ${n(r * 1.0)},${n(r * 0.12)}`} stroke={HAIR} strokeWidth={n(r * 0.22)} fill="none" strokeLinecap="round" />
      {asleep ? (
        <>
          <ClosedEye cx={n(cx - r * 0.32)} cy={n(cy)} w={n(r * 0.38)} />
          <ClosedEye cx={n(cx + r * 0.32)} cy={n(cy)} w={n(r * 0.38)} />
        </>
      ) : (
        <>
          <Eye cx={n(cx - r * 0.32)} cy={n(cy - r * 0.03)} r={n(r * 0.13)} />
          <Eye cx={n(cx + r * 0.32)} cy={n(cy - r * 0.03)} r={n(r * 0.13)} />
        </>
      )}
      <Blush cx={n(cx - r * 0.55)} cy={n(cy + r * 0.34)} r={n(r * 0.16)} />
      <Blush cx={n(cx + r * 0.55)} cy={n(cy + r * 0.34)} r={n(r * 0.16)} />
      {mouth === 'open' ? (
        <OpenMouth cx={n(cx)} cy={n(cy + r * 0.46)} rx={n(r * 0.18)} ry={n(r * 0.24)} />
      ) : mouth === 'soft' ? (
        <Smile cx={n(cx)} cy={n(cy + r * 0.42)} w={n(r * 0.42)} curve={n(r * 0.15)} />
      ) : (
        <Smile cx={n(cx)} cy={n(cy + r * 0.42)} w={n(r * 0.58)} curve={n(r * 0.25)} />
      )}
    </g>
  );
}

type NadiaPose = 'hug' | 'run' | 'point' | 'string' | 'lookUp' | 'catch' | 'sleep';

function Nadia({ x, y, scale = 1, pose = 'hug' }: { x: number; y: number; scale?: number; pose?: NadiaPose }) {
  if (pose === 'sleep') {
    return (
      <g className="scene-nadia" transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
        <ellipse cx={0} cy={0} rx={46} ry={27} fill="#eef0ff" />
        <NadiaHead cx={8} cy={-14} r={30} tilt={-12} asleep mouth="soft" />
      </g>
    );
  }

  const mouth = pose === 'run' || pose === 'string' ? 'open' : 'smile';
  const tilt = pose === 'lookUp' ? -18 : pose === 'run' ? 10 : pose === 'point' ? -8 : 0;
  return (
    <g className="scene-nadia" data-motif="flyer" data-cx={n(x)} data-cy={n(y)} transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
      <path d="M-28,34 L30,34 L48,118 Q0,144 -48,118 Z" fill={NADIA_DRESS} />
      <path d="M-26,38 L28,38 L40,96 Q2,112 -38,96 Z" fill={NADIA_DRESS_DARK} opacity={0.26} />
      <Capsule x1={-18} y1={118} x2={-34} y2={176} width={18} fill={NADIA_LEGGINGS} />
      <Capsule x1={20} y1={118} x2={32} y2={176} width={18} fill={NADIA_LEGGINGS} />
      <ellipse cx={-40} cy={180} rx={18} ry={8} fill={HAIR} />
      <ellipse cx={38} cy={180} rx={18} ry={8} fill={HAIR} />
      {pose === 'run' ? (
        <>
          <Capsule x1={-28} y1={50} x2={-94} y2={24} width={16} fill={SKIN_LIGHT} />
          <Capsule x1={30} y1={52} x2={92} y2={78} width={16} fill={SKIN_LIGHT} />
          <Capsule x1={-18} y1={118} x2={-86} y2={144} width={18} fill={NADIA_LEGGINGS} />
          <Capsule x1={20} y1={118} x2={74} y2={164} width={18} fill={NADIA_LEGGINGS} />
        </>
      ) : pose === 'point' ? (
        <>
          <Capsule x1={-24} y1={54} x2={-72} y2={98} width={16} fill={SKIN_LIGHT} />
          <Capsule x1={30} y1={52} x2={124} y2={14} width={16} fill={SKIN_LIGHT} />
          <circle cx={132} cy={10} r={10} fill={SKIN_LIGHT} />
        </>
      ) : pose === 'string' ? (
        <>
          <Capsule x1={-20} y1={54} x2={-78} y2={58} width={16} fill={SKIN_LIGHT} />
          <Capsule x1={28} y1={54} x2={82} y2={42} width={16} fill={SKIN_LIGHT} />
          <circle cx={-84} cy={58} r={11} fill={SKIN_LIGHT} />
          <circle cx={88} cy={42} r={11} fill={SKIN_LIGHT} />
        </>
      ) : pose === 'catch' ? (
        <>
          <Capsule x1={-26} y1={54} x2={-78} y2={-4} width={17} fill={SKIN_LIGHT} />
          <Capsule x1={30} y1={54} x2={76} y2={-8} width={17} fill={SKIN_LIGHT} />
          <circle cx={-82} cy={-8} r={12} fill={SKIN_LIGHT} />
          <circle cx={80} cy={-12} r={12} fill={SKIN_LIGHT} />
        </>
      ) : pose === 'lookUp' ? (
        <>
          <Capsule x1={-24} y1={54} x2={-64} y2={76} width={16} fill={SKIN_LIGHT} />
          <Capsule x1={30} y1={54} x2={70} y2={76} width={16} fill={SKIN_LIGHT} />
        </>
      ) : (
        <>
          <Capsule x1={-28} y1={54} x2={-76} y2={18} width={16} fill={SKIN_LIGHT} />
          <Capsule x1={28} y1={54} x2={74} y2={18} width={16} fill={SKIN_LIGHT} />
        </>
      )}
      <NadiaHead cx={0} cy={-16} r={31} tilt={tilt} mouth={mouth} />
      <path d="M24,-34 q40,-16 68,12 M24,-22 q36,-8 58,18" stroke={HAIR} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
}

function GrandpaHead({ cx, cy, r = 34, tilt = 0, lookingUp = false }: { cx: number; cy: number; r?: number; tilt?: number; lookingUp?: boolean }) {
  return (
    <g transform={`rotate(${n(tilt)} ${n(cx)} ${n(cy)})`}>
      <circle cx={n(cx)} cy={n(cy)} r={r} fill={SKIN_LIGHT} />
      <path d={`M${n(cx - r)},${n(cy - r * 0.15)} Q${n(cx)},${n(cy - r * 1.35)} ${n(cx + r)},${n(cy - r * 0.15)}`} stroke={GRANDPA_HAIR} strokeWidth={n(r * 0.36)} fill="none" strokeLinecap="round" />
      <path d={`M${n(cx - r * 0.58)},${n(cy + r * 0.34)} Q${n(cx)},${n(cy + r * 0.92)} ${n(cx + r * 0.58)},${n(cy + r * 0.34)} Q${n(cx)},${n(cy + r * 0.68)} ${n(cx - r * 0.58)},${n(cy + r * 0.34)} Z`} fill={GRANDPA_HAIR} opacity={0.92} />
      <Eye cx={n(cx - r * 0.28)} cy={n(cy - (lookingUp ? r * 0.12 : 0))} r={n(r * 0.11)} />
      <Eye cx={n(cx + r * 0.28)} cy={n(cy - (lookingUp ? r * 0.12 : 0))} r={n(r * 0.11)} />
      <Smile cx={n(cx)} cy={n(cy + r * 0.42)} w={n(r * 0.52)} curve={n(r * 0.2)} />
    </g>
  );
}

type GrandpaPose = 'stand' | 'watch' | 'release' | 'lookUp' | 'proud';

function Grandpa({ x, y, scale = 1, pose = 'stand' }: { x: number; y: number; scale?: number; pose?: GrandpaPose }) {
  return (
    <g className="scene-grandpa" transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
      <Capsule x1={0} y1={36} x2={0} y2={134} width={56} fill={GRANDPA_SWEATER} />
      <Capsule x1={-16} y1={128} x2={-30} y2={194} width={20} fill={GRANDPA_PANTS} />
      <Capsule x1={18} y1={128} x2={30} y2={194} width={20} fill={GRANDPA_PANTS} />
      <ellipse cx={-34} cy={200} rx={18} ry={8} fill="#4b3a2c" />
      <ellipse cx={34} cy={200} rx={18} ry={8} fill="#4b3a2c" />
      {pose === 'release' ? (
        <>
          <Capsule x1={-24} y1={58} x2={-88} y2={10} width={17} fill={SKIN_LIGHT} />
          <Capsule x1={26} y1={58} x2={88} y2={8} width={17} fill={SKIN_LIGHT} />
          <ellipse cx={-94} cy={6} rx={15} ry={10} fill={SKIN_LIGHT} />
          <ellipse cx={94} cy={4} rx={15} ry={10} fill={SKIN_LIGHT} />
        </>
      ) : pose === 'proud' ? (
        <>
          <Capsule x1={-24} y1={58} x2={-78} y2={88} width={17} fill={SKIN_LIGHT} />
          <Capsule x1={26} y1={58} x2={112} y2={28} width={18} fill={SKIN_LIGHT} />
          <ellipse cx={118} cy={26} rx={15} ry={11} fill={SKIN_LIGHT} />
        </>
      ) : pose === 'watch' ? (
        <>
          <Capsule x1={-24} y1={58} x2={-64} y2={104} width={17} fill={SKIN_LIGHT} />
          <Capsule x1={26} y1={58} x2={66} y2={98} width={17} fill={SKIN_LIGHT} />
        </>
      ) : pose === 'lookUp' ? (
        <>
          <Capsule x1={-24} y1={58} x2={-76} y2={72} width={17} fill={SKIN_LIGHT} />
          <Capsule x1={26} y1={58} x2={78} y2={72} width={17} fill={SKIN_LIGHT} />
        </>
      ) : (
        <>
          <Capsule x1={-24} y1={58} x2={-74} y2={34} width={17} fill={SKIN_LIGHT} />
          <Capsule x1={26} y1={58} x2={78} y2={34} width={17} fill={SKIN_LIGHT} />
        </>
      )}
      <GrandpaHead cx={0} cy={-14} r={34} tilt={pose === 'lookUp' ? -16 : 0} lookingUp={pose === 'lookUp'} />
    </g>
  );
}

function WindLeaves({ seed, y = 260, count = 7 }: { seed: number; y?: number; count?: number }) {
  return (
    <g className="scene-wind-leaves" data-motif="wind" data-wind-dir="right">
      {range(count).map((i) => {
        const x = n(80 + i * 145 + ((seed + i * 23) % 40));
        const yy = n(y + ((seed + i * 37) % 90));
        return <Leaf key={i} x={x} y={yy} length={n(34 + i * 2)} width={n(18 + i)} angle={n(88 + i * 8)} fill={i % 2 === 0 ? '#6ca455' : '#86b95e'} />;
      })}
    </g>
  );
}

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('daySky')}
        stops={[
          { offset: 0, color: '#7ec7ed' },
          { offset: 0.58, color: '#bfe6f6' },
          { offset: 1, color: '#eaf8e9' },
        ]}
      />
      <LinearGradient
        id={id('actionSky')}
        stops={[
          { offset: 0, color: '#68bfe8' },
          { offset: 1, color: '#d9f3d5' },
        ]}
      />
      <LinearGradient
        id={id('clueSky')}
        stops={[
          { offset: 0, color: '#86d1eb' },
          { offset: 0.7, color: '#e3f4c7' },
          { offset: 1, color: '#f6e5a4' },
        ]}
      />
      <LinearGradient
        id={id('liftSky')}
        stops={[
          { offset: 0, color: '#4baee5' },
          { offset: 0.56, color: '#9bdcf5' },
          { offset: 1, color: '#e9fbff' },
        ]}
      />
      <LinearGradient
        id={id('highSky')}
        stops={[
          { offset: 0, color: '#5fb7e9' },
          { offset: 0.72, color: '#cceefa' },
          { offset: 1, color: '#f6fbff' },
        ]}
      />
      <LinearGradient
        id={id('sunsetSky')}
        stops={[
          { offset: 0, color: '#5c79b7' },
          { offset: 0.46, color: '#f3a76f' },
          { offset: 1, color: '#f7d28a' },
        ]}
      />
      <LinearGradient
        id={id('nightRoom')}
        stops={[
          { offset: 0, color: '#172246' },
          { offset: 0.65, color: '#24315c' },
          { offset: 1, color: '#30345f' },
        ]}
      />
      <LinearGradient
        id={id('grass')}
        stops={[
          { offset: 0, color: '#87bf5b' },
          { offset: 1, color: '#4f8f43' },
        ]}
      />
      <LinearGradient
        id={id('darkGrass')}
        stops={[
          { offset: 0, color: '#5b9344' },
          { offset: 1, color: '#2f6536' },
        ]}
      />
      <RadialGradient
        id={id('sunGlow')}
        stops={[
          { offset: 0, color: '#fff1ba', opacity: 0.95 },
          { offset: 0.5, color: '#ffc36f', opacity: 0.42 },
          { offset: 1, color: '#ff9f6d', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('lampGlow')}
        stops={[
          { offset: 0, color: '#ffe6a4', opacity: 0.95 },
          { offset: 0.54, color: '#f8b85d', opacity: 0.5 },
          { offset: 1, color: '#f8b85d', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#f4f0d6', opacity: 0.75 },
          { offset: 1, color: '#f4f0d6', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.62, color: '#000000', opacity: 0 },
          { offset: 1, color: '#142236', opacity: 0.34 },
        ]}
      />
      <GrainFilter id={id('grain')} opacity={0.045} />
    </defs>
  );
}

const finish = (paint: SceneWorldProps['paint']) => (
  <>
    <GrainWash filter={paint('grain')} />
    <Vignette paint={paint('vignette')} />
  </>
);

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'wind-01-hilltop-kite': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('daySky'))}
      <WindStreaks y={120} count={4} opacity={0.32} />
      <Cloud x={n(VIEW_W * 0.18)} y={n(VIEW_H * 0.14)} scale={1.05} fill="#ffffff" opacity={0.78} />
      <Cloud x={n(VIEW_W * 0.62)} y={n(VIEW_H * 0.2)} scale={1.34} fill="#ffffff" opacity={0.82} />
      <Cloud x={n(VIEW_W * 0.86)} y={n(VIEW_H * 0.34)} scale={0.72} fill="#f5fbff" opacity={0.62} />
      <Hill baseY={n(VIEW_H * 0.88)} crest={250} peakX={n(VIEW_W * 0.42)} spread={n(VIEW_W * 0.9)} fill={paint('grass')} />
      <Hill baseY={n(VIEW_H * 0.95)} crest={144} peakX={n(VIEW_W * 0.84)} spread={n(VIEW_W * 0.78)} fill="#5aa44a" />
      <Tree x={n(VIEW_W * 0.12)} baseY={n(VIEW_H * 0.76)} height={150} spread={82} canopy="#477f47" />
      <Tree x={n(VIEW_W * 0.93)} baseY={n(VIEW_H * 0.78)} height={132} spread={72} canopy="#57964c" />
      <Kite cx={n(VIEW_W * 0.47)} cy={n(VIEW_H * 0.55)} size={86} rotate={-8} />
      <Grandpa x={n(VIEW_W * 0.62)} y={n(VIEW_H * 0.58)} scale={0.63} pose="stand" />
      <Nadia x={n(VIEW_W * 0.42)} y={n(VIEW_H * 0.62)} scale={0.62} pose="hug" />
      <GrassRow seed={seed} baseY={n(VIEW_H * 0.89)} blades={52} height={54} lean={28} fill="#6fb34f" />
      <GrassRow seed={seed + 11} baseY={VIEW_H} blades={58} height={72} lean={34} fill="#3f7d3a" />
      {finish(paint)}
    </g>
  ),

  'wind-02-flop-run': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('actionSky'))}
      <WindStreaks y={108} count={5} opacity={0.28} />
      <Cloud x={n(VIEW_W * 0.28)} y={n(VIEW_H * 0.18)} scale={0.84} fill="#ffffff" opacity={0.72} />
      <Cloud x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.16)} scale={1.18} fill="#f9fdff" opacity={0.78} />
      <Hill baseY={n(VIEW_H * 0.8)} crest={110} peakX={n(VIEW_W * 0.62)} spread={n(VIEW_W * 0.84)} fill={paint('grass')} />
      <Hill baseY={n(VIEW_H * 0.96)} crest={82} peakX={n(VIEW_W * 0.32)} spread={n(VIEW_W * 0.9)} fill="#4d9340" />
      <path d={`M${n(VIEW_W * 0.18)},${n(VIEW_H * 0.7)} C${n(VIEW_W * 0.38)},${n(VIEW_H * 0.78)} ${n(VIEW_W * 0.55)},${n(VIEW_H * 0.66)} ${n(VIEW_W * 0.74)},${n(VIEW_H * 0.75)}`} stroke="#d9f2b0" strokeWidth={18} fill="none" opacity={0.35} />
      <Kite cx={n(VIEW_W * 0.28)} cy={n(VIEW_H * 0.64)} size={92} rotate={-72} crumpled />
      <path d={`M${n(VIEW_W * 0.33)},${n(VIEW_H * 0.66)} C${n(VIEW_W * 0.43)},${n(VIEW_H * 0.58)} ${n(VIEW_W * 0.55)},${n(VIEW_H * 0.7)} ${n(VIEW_W * 0.66)},${n(VIEW_H * 0.61)}`} stroke={STRING} strokeWidth={3} fill="none" strokeDasharray="9 9" opacity={0.9} />
      <Nadia x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.56)} scale={0.82} pose="run" />
      <Grandpa x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.54)} scale={0.62} pose="watch" />
      <GrassRow seed={seed + 2} baseY={n(VIEW_H * 0.82)} blades={44} height={42} lean={24} fill="#78b956" />
      <GrassRow seed={seed + 13} baseY={VIEW_H} blades={60} height={78} lean={30} fill="#407b3a" />
      {finish(paint)}
    </g>
  ),

  'wind-03-reading-clues': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('clueSky'))}
      <SunGlow cx={n(VIEW_W * 0.14)} cy={n(VIEW_H * 0.16)} r={58} core="#fff0b8" halo={paint('sunGlow')} />
      <g transform={`rotate(-5 ${n(VIEW_W * 0.5)} ${n(VIEW_H * 0.52)})`}>
        <Cloud x={n(VIEW_W * 0.22)} y={n(VIEW_H * 0.2)} scale={0.94} fill="#ffffff" opacity={0.76} />
        <Cloud x={n(VIEW_W * 0.7)} y={n(VIEW_H * 0.28)} scale={1.16} fill="#ffffff" opacity={0.66} />
        <Flag x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.38)} scale={0.8} wind={1.08} />
        <Tree x={n(VIEW_W * 0.12)} baseY={n(VIEW_H * 0.66)} height={170} spread={84} canopy="#5b9144" />
        <Tree x={n(VIEW_W * 0.26)} baseY={n(VIEW_H * 0.68)} height={138} spread={70} canopy="#6fa64e" />
        <WindLeaves seed={seed} y={n(VIEW_H * 0.25)} count={8} />
        <Hill baseY={n(VIEW_H * 0.82)} crest={96} peakX={n(VIEW_W * 0.5)} spread={n(VIEW_W * 0.86)} fill={paint('grass')} />
        <Nadia x={n(VIEW_W * 0.45)} y={n(VIEW_H * 0.54)} scale={0.78} pose="point" />
        <Grandpa x={n(VIEW_W * 0.26)} y={n(VIEW_H * 0.54)} scale={0.66} pose="watch" />
        <GrassRow seed={seed + 17} baseY={n(VIEW_H * 0.83)} blades={55} height={58} lean={36} fill="#6eaf52" />
        <GrassRow seed={seed + 23} baseY={VIEW_H} blades={58} height={82} lean={42} fill="#3f7a38" />
      </g>
      {finish(paint)}
    </g>
  ),

  'wind-04-first-lift': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('liftSky'))}
      <WindStreaks y={88} count={5} opacity={0.34} />
      <Cloud x={n(VIEW_W * 0.18)} y={n(VIEW_H * 0.24)} scale={0.86} fill="#ffffff" opacity={0.64} />
      <Cloud x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.18)} scale={1.12} fill="#ffffff" opacity={0.78} />
      <Hill baseY={n(VIEW_H * 0.88)} crest={118} peakX={n(VIEW_W * 0.4)} spread={n(VIEW_W * 0.88)} fill={paint('grass')} />
      <Tree x={n(VIEW_W * 0.09)} baseY={n(VIEW_H * 0.82)} height={124} spread={70} canopy="#4f8b48" />
      <Tree x={n(VIEW_W * 0.92)} baseY={n(VIEW_H * 0.84)} height={116} spread={66} canopy="#5d9b4f" />
      <path d={`M${n(VIEW_W * 0.26)},${n(VIEW_H * 0.58)} C${n(VIEW_W * 0.44)},${n(VIEW_H * 0.5)} ${n(VIEW_W * 0.56)},${n(VIEW_H * 0.38)} ${n(VIEW_W * 0.67)},${n(VIEW_H * 0.27)}`} stroke={STRING} strokeWidth={4} fill="none" />
      <Kite cx={n(VIEW_W * 0.68)} cy={n(VIEW_H * 0.26)} size={78} rotate={-18} />
      <Grandpa x={n(VIEW_W * 0.55)} y={n(VIEW_H * 0.58)} scale={0.74} pose="release" />
      <Nadia x={n(VIEW_W * 0.22)} y={n(VIEW_H * 0.6)} scale={0.74} pose="string" />
      <GrassRow seed={seed + 31} baseY={n(VIEW_H * 0.88)} blades={50} height={54} lean={32} fill="#6eb14e" />
      <GrassRow seed={seed + 37} baseY={VIEW_H} blades={58} height={78} lean={38} fill="#3e7a38" />
      {finish(paint)}
    </g>
  ),

  'wind-05-dancing-high': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('highSky'))}
      <WindStreaks y={86} count={6} opacity={0.25} />
      <Cloud x={n(VIEW_W * 0.16)} y={n(VIEW_H * 0.2)} scale={1.26} fill="#ffffff" opacity={0.68} />
      <Cloud x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.14)} scale={0.82} fill="#ffffff" opacity={0.58} />
      <Cloud x={n(VIEW_W * 0.86)} y={n(VIEW_H * 0.3)} scale={1.05} fill="#ffffff" opacity={0.72} />
      <Kite cx={n(VIEW_W * 0.58)} cy={n(VIEW_H * 0.16)} size={42} rotate={12} />
      <path d={`M${n(VIEW_W * 0.56)},${n(VIEW_H * 0.22)} C${n(VIEW_W * 0.46)},${n(VIEW_H * 0.34)} ${n(VIEW_W * 0.5)},${n(VIEW_H * 0.52)} ${n(VIEW_W * 0.42)},${n(VIEW_H * 0.73)}`} stroke={STRING} strokeWidth={2.5} fill="none" opacity={0.8} />
      <Tree x={n(VIEW_W * 0.1)} baseY={n(VIEW_H * 0.82)} height={160} spread={80} canopy="#45834a" />
      <Tree x={n(VIEW_W * 0.26)} baseY={n(VIEW_H * 0.84)} height={142} spread={76} canopy="#53914f" />
      <Tree x={n(VIEW_W * 0.88)} baseY={n(VIEW_H * 0.83)} height={152} spread={82} canopy="#4b8948" />
      <Hill baseY={n(VIEW_H * 0.9)} crest={84} peakX={n(VIEW_W * 0.5)} spread={n(VIEW_W * 0.9)} fill={paint('grass')} />
      <Nadia x={n(VIEW_W * 0.42)} y={n(VIEW_H * 0.72)} scale={0.42} pose="lookUp" />
      <Grandpa x={n(VIEW_W * 0.53)} y={n(VIEW_H * 0.7)} scale={0.4} pose="lookUp" />
      <GrassRow seed={seed + 41} baseY={n(VIEW_H * 0.91)} blades={45} height={40} lean={22} fill="#6aad50" />
      <GrassRow seed={seed + 43} baseY={VIEW_H} blades={55} height={62} lean={28} fill="#3e7d39" />
      {finish(paint)}
    </g>
  ),

  'wind-06-winding-in': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('sunsetSky'))}
      <SunGlow cx={n(VIEW_W * 0.18)} cy={n(VIEW_H * 0.58)} r={72} core="#ffe29b" halo={paint('sunGlow')} />
      <Cloud x={n(VIEW_W * 0.65)} y={n(VIEW_H * 0.16)} scale={1.08} fill="#ffe8c6" opacity={0.58} />
      <Cloud x={n(VIEW_W * 0.32)} y={n(VIEW_H * 0.25)} scale={0.72} fill="#fff0d7" opacity={0.52} />
      <Hill baseY={n(VIEW_H * 0.86)} crest={96} peakX={n(VIEW_W * 0.5)} spread={n(VIEW_W * 0.9)} fill="#5b8c47" />
      <path d={`M${n(VIEW_W * 0.36)},${n(VIEW_H * 0.48)} C${n(VIEW_W * 0.45)},${n(VIEW_H * 0.43)} ${n(VIEW_W * 0.5)},${n(VIEW_H * 0.38)} ${n(VIEW_W * 0.58)},${n(VIEW_H * 0.38)}`} stroke={STRING} strokeWidth={3} fill="none" opacity={0.78} />
      <Kite cx={n(VIEW_W * 0.42)} cy={n(VIEW_H * 0.52)} size={92} rotate={8} />
      <Nadia x={n(VIEW_W * 0.48)} y={n(VIEW_H * 0.58)} scale={0.92} pose="catch" />
      <Grandpa x={n(VIEW_W * 0.64)} y={n(VIEW_H * 0.56)} scale={0.78} pose="proud" />
      <path d={`M${n(VIEW_W * 0.16)},${n(VIEW_H * 0.72)} C${n(VIEW_W * 0.34)},${n(VIEW_H * 0.68)} ${n(VIEW_W * 0.74)},${n(VIEW_H * 0.69)} ${n(VIEW_W * 0.92)},${n(VIEW_H * 0.73)}`} stroke="#f9d6a5" strokeWidth={14} fill="none" opacity={0.28} />
      <GrassRow seed={seed + 51} baseY={n(VIEW_H * 0.88)} blades={48} height={46} lean={18} fill="#789b49" />
      <GrassRow seed={seed + 57} baseY={VIEW_H} blades={58} height={70} lean={22} fill="#3f6937" />
      {finish(paint)}
    </g>
  ),

  'wind-07-resting-kite': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('nightRoom'))}
      <StarField seed={seed} count={34} x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.06)} width={n(VIEW_W * 0.38)} height={n(VIEW_H * 0.32)} color="#dfe8ff" minR={1} maxR={2.6} />
      <rect x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.08)} width={n(VIEW_W * 0.38)} height={n(VIEW_H * 0.42)} rx={14} fill="#111936" />
      <rect x={n(VIEW_W * 0.53)} y={n(VIEW_H * 0.11)} width={n(VIEW_W * 0.32)} height={n(VIEW_H * 0.35)} fill="#1d2b55" />
      <Moon cx={n(VIEW_W * 0.78)} cy={n(VIEW_H * 0.2)} r={38} glow={paint('moonGlow')} />
      <rect x={n(VIEW_W * 0.685)} y={n(VIEW_H * 0.09)} width={10} height={n(VIEW_H * 0.4)} fill="#38436d" />
      <rect x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.28)} width={n(VIEW_W * 0.34)} height={10} fill="#38436d" />
      <path d={`M${n(VIEW_W * 0.5)},${n(VIEW_H * 0.1)} C${n(VIEW_W * 0.47)},${n(VIEW_H * 0.24)} ${n(VIEW_W * 0.49)},${n(VIEW_H * 0.37)} ${n(VIEW_W * 0.46)},${n(VIEW_H * 0.5)} L${n(VIEW_W * 0.52)},${n(VIEW_H * 0.5)} C${n(VIEW_W * 0.54)},${n(VIEW_H * 0.34)} ${n(VIEW_W * 0.54)},${n(VIEW_H * 0.22)} ${n(VIEW_W * 0.52)},${n(VIEW_H * 0.1)} Z`} fill="#6571aa" opacity={0.72} />
      <path d={`M${n(VIEW_W * 0.86)},${n(VIEW_H * 0.1)} C${n(VIEW_W * 0.91)},${n(VIEW_H * 0.24)} ${n(VIEW_W * 0.88)},${n(VIEW_H * 0.37)} ${n(VIEW_W * 0.92)},${n(VIEW_H * 0.5)} L${n(VIEW_W * 0.85)},${n(VIEW_H * 0.5)} C${n(VIEW_W * 0.82)},${n(VIEW_H * 0.34)} ${n(VIEW_W * 0.83)},${n(VIEW_H * 0.22)} ${n(VIEW_W * 0.84)},${n(VIEW_H * 0.1)} Z`} fill="#59659d" opacity={0.72} />
      <rect x={0} y={n(VIEW_H * 0.74)} width={VIEW_W} height={n(VIEW_H * 0.26)} fill="#20264a" />
      <rect x={n(VIEW_W * 0.08)} y={n(VIEW_H * 0.62)} width={n(VIEW_W * 0.48)} height={n(VIEW_H * 0.2)} rx={24} fill="#59639a" />
      <path d={`M${n(VIEW_W * 0.08)},${n(VIEW_H * 0.78)} L${n(VIEW_W * 0.08)},${n(VIEW_H * 0.7)} Q${n(VIEW_W * 0.3)},${n(VIEW_H * 0.62)} ${n(VIEW_W * 0.56)},${n(VIEW_H * 0.71)} L${n(VIEW_W * 0.56)},${n(VIEW_H * 0.82)} Z`} fill="#7f86c4" />
      <path d={`M${n(VIEW_W * 0.11)},${n(VIEW_H * 0.74)} q${n(VIEW_W * 0.08)},${n(-VIEW_H * 0.05)} ${n(VIEW_W * 0.17)},0 t${n(VIEW_W * 0.17)},0`} stroke="#a5a9d8" strokeWidth={5} fill="none" opacity={0.55} />
      <Nadia x={n(VIEW_W * 0.19)} y={n(VIEW_H * 0.65)} scale={0.92} pose="sleep" />
      <Kite cx={n(VIEW_W * 0.31)} cy={n(VIEW_H * 0.38)} size={78} rotate={-18} />
      <path d={`M${n(VIEW_W * 0.28)},${n(VIEW_H * 0.6)} L${n(VIEW_W * 0.36)},${n(VIEW_H * 0.22)}`} stroke={SPAR} strokeWidth={5} opacity={0.58} />
      <rect x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.58)} width={44} height={72} rx={14} fill="#6c4f63" />
      <circle cx={n(VIEW_W * 0.922)} cy={n(VIEW_H * 0.57)} r={30} fill={paint('lampGlow')} />
      <circle cx={n(VIEW_W * 0.922)} cy={n(VIEW_H * 0.57)} r={16} fill="#ffdc8a" />
      {finish(paint)}
    </g>
  ),
};

export const windWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
