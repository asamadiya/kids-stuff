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
  Ground,
  Hill,
  Leaf,
  LinearGradient,
  Moon,
  OpenMouth,
  RadialGradient,
  Smile,
  SoftBlur,
  Star,
  StarField,
  SunGlow,
  Tree,
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

const SKIN = '#d99066';
const SKIN_SHADE = '#c77b54';
const HAIR = '#4b2b22';
const SHIRT = '#f48f5f';
const SHIRT_DARK = '#d66f4f';
const SHORTS = '#456cb6';
const SHORTS_DARK = '#2f518f';
const SOCK = '#f7edd9';
const SHOE = '#513c35';
const SHADOW = '#26334a';
const MOM_DRESS = '#7d83bd';
const MOM_HAIR = '#3b2521';
const TEDDY = '#a8754b';

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('morningSky')}
        stops={[
          { offset: 0, color: '#bfe5f2' },
          { offset: 0.56, color: '#f4df9a' },
          { offset: 1, color: '#f8bf69' },
        ]}
      />
      <LinearGradient
        id={id('playSky')}
        stops={[
          { offset: 0, color: '#91d9f4' },
          { offset: 0.7, color: '#c7efc4' },
          { offset: 1, color: '#f8e99b' },
        ]}
      />
      <LinearGradient
        id={id('dappleSky')}
        stops={[
          { offset: 0, color: '#a8def3' },
          { offset: 0.65, color: '#d8edb0' },
          { offset: 1, color: '#f7dfa2' },
        ]}
      />
      <LinearGradient
        id={id('noonSky')}
        stops={[
          { offset: 0, color: '#aee8ff' },
          { offset: 0.45, color: '#effdcf' },
          { offset: 1, color: '#fff4b8' },
        ]}
      />
      <LinearGradient
        id={id('eveningSky')}
        stops={[
          { offset: 0, color: '#f6a35f' },
          { offset: 0.58, color: '#f6c071' },
          { offset: 1, color: '#684b7b' },
        ]}
      />
      <LinearGradient
        id={id('duskSky')}
        stops={[
          { offset: 0, color: '#253052' },
          { offset: 0.58, color: '#53618a' },
          { offset: 1, color: '#88769b' },
        ]}
      />
      <LinearGradient
        id={id('bedroomWall')}
        stops={[
          { offset: 0, color: '#18213f' },
          { offset: 0.56, color: '#26305b' },
          { offset: 1, color: '#35416d' },
        ]}
      />
      <RadialGradient
        id={id('nightlightGlow')}
        cx={0.18}
        cy={0.64}
        r={0.55}
        stops={[
          { offset: 0, color: '#ffd986', opacity: 0.95 },
          { offset: 0.42, color: '#f2a95c', opacity: 0.32 },
          { offset: 1, color: '#f2a95c', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.58, color: '#000000', opacity: 0 },
          { offset: 1, color: '#17101c', opacity: 0.35 },
        ]}
      />
      <SoftBlur id={id('softShadow')} amount={7} />
      <SoftBlur id={id('lampShadow')} amount={5} />
      <GrainFilter id={id('grain')} opacity={0.046} />
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

function Fence({ y, fill = '#caa06d', rail = '#b88757' }: { y: number; fill?: string; rail?: string }) {
  return (
    <g className="scene-fence">
      <rect x={0} y={n(y + 34)} width={VIEW_W} height={16} rx={4} fill={rail} />
      <rect x={0} y={n(y + 88)} width={VIEW_W} height={16} rx={4} fill={rail} />
      {range(16).map((i) => (
        <path
          key={i}
          d={`M${n(i * 78 - 8)},${n(y + 130)} L${n(i * 78 - 8)},${n(y - 8)} Q${n(
            i * 78 + 14,
          )},${n(y - 30)} ${n(i * 78 + 36)},${n(y - 8)} L${n(i * 78 + 36)},${n(y + 130)} Z`}
          fill={fill}
        />
      ))}
    </g>
  );
}

function FlowerBed({ seed, y }: { seed: number; y: number }) {
  const rand = mulberry32(seed);
  return (
    <g className="scene-flower-bed">
      <path
        d={`M${n(VIEW_W * 0.68)},${n(y + 78)} C${n(VIEW_W * 0.76)},${n(y + 20)} ${n(
          VIEW_W * 0.94,
        )},${n(y + 18)} ${VIEW_W},${n(y + 52)} L${VIEW_W},${VIEW_H} L${n(VIEW_W * 0.66)},${VIEW_H} Z`}
        fill="#527c45"
      />
      {range(16).map((i) => {
        const fx = n(VIEW_W * 0.7 + rand() * VIEW_W * 0.28);
        const fy = n(y + 32 + rand() * 82);
        const petal = i % 3 === 0 ? '#f6d55c' : i % 3 === 1 ? '#f49cbb' : '#e96f5f';
        return (
          <g key={i} transform={`translate(${fx} ${fy})`}>
            <Capsule x1={0} y1={18} x2={0} y2={0} width={3} fill="#426f35" />
            <circle cx={0} cy={-3} r={5} fill={petal} />
            <circle cx={-5} cy={1} r={5} fill={petal} />
            <circle cx={5} cy={1} r={5} fill={petal} />
            <circle cx={0} cy={2} r={3} fill="#774c24" />
          </g>
        );
      })}
    </g>
  );
}

type LeoPose = 'wave' | 'jump' | 'run' | 'proud' | 'down' | 'calm' | 'sleep';

function Leo({
  x,
  y,
  scale = 1,
  pose = 'wave',
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  pose?: LeoPose;
  rotate?: number;
}) {
  const isSleep = pose === 'sleep';
  const open = pose === 'jump' || pose === 'run' || pose === 'proud';
  const down = pose === 'down';
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(rotate)}) scale(${n(scale)})`} className="scene-leo">
      {pose === 'wave' ? (
        <>
          <Capsule x1={-14} y1={14} x2={-54} y2={-10} width={15} fill={SHIRT} />
          <Capsule x1={16} y1={12} x2={60} y2={-54} width={15} fill={SHIRT} />
          <ellipse cx={64} cy={-58} rx={11} ry={10} fill={SKIN} />
        </>
      ) : null}
      {pose === 'jump' ? (
        <>
          <Capsule x1={-16} y1={10} x2={-74} y2={-34} width={15} fill={SHIRT} />
          <Capsule x1={16} y1={10} x2={78} y2={-30} width={15} fill={SHIRT} />
          <ellipse cx={-80} cy={-38} rx={11} ry={10} fill={SKIN} />
          <ellipse cx={84} cy={-34} rx={11} ry={10} fill={SKIN} />
        </>
      ) : null}
      {pose === 'run' ? (
        <>
          <Capsule x1={-16} y1={14} x2={-58} y2={42} width={15} fill={SHIRT} />
          <Capsule x1={16} y1={12} x2={66} y2={-28} width={15} fill={SHIRT} />
          <ellipse cx={-64} cy={46} rx={11} ry={9} fill={SKIN} />
          <ellipse cx={72} cy={-32} rx={11} ry={9} fill={SKIN} />
        </>
      ) : null}
      {pose === 'proud' ? (
        <>
          <Capsule x1={-16} y1={10} x2={-54} y2={-64} width={16} fill={SHIRT} />
          <Capsule x1={16} y1={10} x2={54} y2={-64} width={16} fill={SHIRT} />
          <ellipse cx={-58} cy={-70} rx={12} ry={11} fill={SKIN} />
          <ellipse cx={58} cy={-70} rx={12} ry={11} fill={SKIN} />
        </>
      ) : null}
      {pose === 'down' || pose === 'calm' || isSleep ? (
        <>
          <Capsule x1={-14} y1={12} x2={-34} y2={38} width={14} fill={SHIRT} />
          <Capsule x1={14} y1={12} x2={34} y2={38} width={14} fill={SHIRT} />
          <ellipse cx={-38} cy={42} rx={10} ry={8} fill={SKIN} />
          <ellipse cx={38} cy={42} rx={10} ry={8} fill={SKIN} />
        </>
      ) : null}
      <Capsule x1={0} y1={0} x2={0} y2={62} width={42} fill={SHIRT} />
      <rect x={-22} y={46} width={44} height={24} rx={8} fill={SHORTS} />
      {pose === 'jump' ? (
        <>
          <Capsule x1={-14} y1={64} x2={-50} y2={104} width={15} fill={SHORTS_DARK} />
          <Capsule x1={14} y1={64} x2={54} y2={108} width={15} fill={SHORTS_DARK} />
          <Capsule x1={-50} y1={104} x2={-66} y2={124} width={10} fill={SOCK} />
          <Capsule x1={54} y1={108} x2={70} y2={126} width={10} fill={SOCK} />
          <ellipse cx={-70} cy={128} rx={17} ry={8} fill={SHOE} />
          <ellipse cx={74} cy={130} rx={17} ry={8} fill={SHOE} />
        </>
      ) : pose === 'run' ? (
        <>
          <Capsule x1={-12} y1={64} x2={-62} y2={100} width={15} fill={SHORTS_DARK} />
          <Capsule x1={12} y1={64} x2={58} y2={96} width={15} fill={SHORTS_DARK} />
          <Capsule x1={-62} y1={100} x2={-92} y2={104} width={10} fill={SOCK} />
          <Capsule x1={58} y1={96} x2={72} y2={126} width={10} fill={SOCK} />
          <ellipse cx={-100} cy={104} rx={17} ry={8} fill={SHOE} />
          <ellipse cx={76} cy={132} rx={17} ry={8} fill={SHOE} />
        </>
      ) : (
        <>
          <Capsule x1={-12} y1={64} x2={-18} y2={118} width={15} fill={SHORTS_DARK} />
          <Capsule x1={12} y1={64} x2={18} y2={118} width={15} fill={SHORTS_DARK} />
          <Capsule x1={-18} y1={118} x2={-20} y2={138} width={10} fill={SOCK} />
          <Capsule x1={18} y1={118} x2={20} y2={138} width={10} fill={SOCK} />
          <ellipse cx={-26} cy={142} rx={17} ry={8} fill={SHOE} />
          <ellipse cx={26} cy={142} rx={17} ry={8} fill={SHOE} />
        </>
      )}
      <circle cx={0} cy={-44} r={34} fill={SKIN} />
      <path
        d="M-34,-50 Q-14,-92 22,-72 Q42,-60 28,-34 Q14,-48 -6,-44 Q-22,-42 -34,-50 Z"
        fill={HAIR}
      />
      <path d="M24,-50 q20,14 8,42" stroke={HAIR} strokeWidth={13} fill="none" strokeLinecap="round" />
      {isSleep ? (
        <>
          <ClosedEye cx={-12} cy={-42} w={12} />
          <ClosedEye cx={12} cy={-42} w={12} />
        </>
      ) : down ? (
        <>
          <ClosedEye cx={-12} cy={-38} w={10} />
          <ClosedEye cx={12} cy={-38} w={10} />
        </>
      ) : (
        <>
          <Eye cx={-12} cy={-44} r={4.3} />
          <Eye cx={12} cy={-44} r={4.3} />
        </>
      )}
      <Blush cx={-22} cy={-26} r={5} />
      <Blush cx={22} cy={-26} r={5} />
      {open ? <OpenMouth cx={0} cy={-24} rx={7} ry={9} /> : <Smile cx={0} cy={-25} w={20} curve={8} />}
      <path d="M-22,0 q22,10 44,0" stroke={SHIRT_DARK} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.42} />
    </g>
  );
}

function BoyShadow({
  x,
  y,
  scaleX,
  scaleY,
  rotate = 0,
  pose = 'wave',
  opacity = 0.38,
  filter,
}: {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotate?: number;
  pose?: LeoPose;
  opacity?: number;
  filter?: string;
}) {
  return (
    <g
      className="scene-boy-shadow"
      data-motif="shadow"
      data-shadow-elongation={n(Math.abs(scaleX) / Math.abs(scaleY))}
      transform={`translate(${n(x)} ${n(y)}) rotate(${n(rotate)}) scale(${n(scaleX)} ${n(scaleY)})`}
      opacity={opacity}
      filter={filter}
      fill={SHADOW}
      stroke={SHADOW}
      strokeLinecap="round"
    >
      {pose === 'wave' ? (
        <>
          <line x1={-10} y1={-6} x2={-48} y2={-20} strokeWidth={16} />
          <line x1={10} y1={-6} x2={56} y2={-56} strokeWidth={16} />
        </>
      ) : null}
      {pose === 'jump' ? (
        <>
          <line x1={-12} y1={-6} x2={-76} y2={-36} strokeWidth={16} />
          <line x1={12} y1={-6} x2={80} y2={-30} strokeWidth={16} />
        </>
      ) : null}
      {pose === 'run' ? (
        <>
          <line x1={-12} y1={-4} x2={-60} y2={34} strokeWidth={16} />
          <line x1={12} y1={-6} x2={64} y2={-34} strokeWidth={16} />
        </>
      ) : null}
      {pose === 'proud' ? (
        <>
          <line x1={-12} y1={-8} x2={-58} y2={-70} strokeWidth={17} />
          <line x1={12} y1={-8} x2={58} y2={-70} strokeWidth={17} />
        </>
      ) : null}
      <ellipse cx={0} cy={10} rx={27} ry={48} />
      <rect x={-24} y={46} width={48} height={28} rx={8} />
      {pose === 'jump' ? (
        <>
          <line x1={-12} y1={66} x2={-60} y2={104} strokeWidth={16} />
          <line x1={12} y1={66} x2={60} y2={108} strokeWidth={16} />
        </>
      ) : pose === 'run' ? (
        <>
          <line x1={-12} y1={66} x2={-86} y2={102} strokeWidth={16} />
          <line x1={12} y1={66} x2={70} y2={124} strokeWidth={16} />
        </>
      ) : (
        <>
          <line x1={-12} y1={66} x2={-20} y2={132} strokeWidth={16} />
          <line x1={12} y1={66} x2={20} y2={132} strokeWidth={16} />
        </>
      )}
      <circle cx={0} cy={-42} r={34} />
      <path d="M-34,-48 Q-14,-88 22,-70 Q44,-56 28,-32 Q6,-46 -34,-48 Z" />
    </g>
  );
}

function ShadowDog({ x, y, scale = 1, opacity = 0.42 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} fill={SHADOW} opacity={opacity}>
      <ellipse cx={0} cy={0} rx={58} ry={24} />
      <circle cx={58} cy={-12} r={25} />
      <path d="M48,-32 L38,-62 L64,-40 Z" />
      <path d="M70,-32 L88,-58 L90,-26 Z" />
      <path d="M-58,-6 q-38,-34 -62,0" stroke={SHADOW} strokeWidth={14} fill="none" strokeLinecap="round" />
      <rect x={-36} y={16} width={14} height={42} rx={7} />
      <rect x={24} y={14} width={14} height={42} rx={7} />
    </g>
  );
}

function ShadowRabbit({ x, y, scale = 1, opacity = 0.36 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} fill={SHADOW} opacity={opacity}>
      <ellipse cx={0} cy={16} rx={70} ry={42} />
      <circle cx={58} cy={-12} r={34} />
      <ellipse cx={44} cy={-60} rx={14} ry={48} transform="rotate(-18 44 -60)" />
      <ellipse cx={76} cy={-62} rx={14} ry={50} transform="rotate(16 76 -62)" />
      <circle cx={-62} cy={0} r={16} />
    </g>
  );
}

function Mom({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-mom">
      <path d="M-42,120 L-26,8 Q0,-20 28,8 L48,120 Z" fill={MOM_DRESS} />
      <Capsule x1={-28} y1={18} x2={-64} y2={80} width={18} fill={MOM_DRESS} />
      <Capsule x1={22} y1={18} x2={72} y2={52} width={18} fill={MOM_DRESS} />
      <ellipse cx={76} cy={54} rx={13} ry={10} fill={SKIN} />
      <Capsule x1={-18} y1={114} x2={-28} y2={164} width={16} fill="#4b4674" />
      <Capsule x1={18} y1={114} x2={28} y2={164} width={16} fill="#4b4674" />
      <circle cx={0} cy={-42} r={38} fill={SKIN} />
      <path d="M-38,-44 Q-28,-96 10,-86 Q50,-74 36,-16 Q24,-44 -4,-46 Q-24,-44 -38,-44 Z" fill={MOM_HAIR} />
      <path d="M-34,-30 q-32,38 -10,88" stroke={MOM_HAIR} strokeWidth={17} fill="none" strokeLinecap="round" />
      <Eye cx={-13} cy={-42} r={4} />
      <Eye cx={13} cy={-42} r={4} />
      <Smile cx={0} cy={-26} w={20} curve={8} />
    </g>
  );
}

function Dapple({ seed, x, y, width, height }: { seed: number; x: number; y: number; width: number; height: number }) {
  const rand = mulberry32(seed);
  return (
    <g fill="#fff6b8" opacity={0.2}>
      {range(26).map((i) => (
        <ellipse
          key={i}
          cx={n(x + rand() * width)}
          cy={n(y + rand() * height)}
          rx={n(18 + rand() * 38)}
          ry={n(7 + rand() * 16)}
          transform={`rotate(${n(-18 + rand() * 36)} ${n(x + rand() * width)} ${n(y + rand() * height)})`}
        />
      ))}
    </g>
  );
}

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'shadow-01-morning-meet': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('morningSky'))}
      <SunGlow cx={32} cy={n(VIEW_H * 0.55)} r={64} core="#ffe7a3" halo="#ffd57a55" />
      <Cloud x={VIEW_W * 0.64} y={VIEW_H * 0.14} scale={0.95} fill="#fff6df" opacity={0.72} />
      <Cloud x={VIEW_W * 0.34} y={VIEW_H * 0.22} scale={0.6} fill="#fff6df" opacity={0.52} />
      <Hill baseY={VIEW_H * 0.68} crest={74} fill="#82b867" peakX={VIEW_W * 0.28} />
      <Hill baseY={VIEW_H * 0.72} crest={64} fill="#6fa85c" peakX={VIEW_W * 0.78} />
      <Fence y={VIEW_H * 0.55} />
      <Ground topY={VIEW_H * 0.68} fill="#77b85e" wobble={18} />
      <path d={`M0,${n(VIEW_H * 0.69)} C${n(VIEW_W * 0.32)},${n(VIEW_H * 0.62)} ${n(VIEW_W * 0.75)},${n(VIEW_H * 0.75)} ${VIEW_W},${n(VIEW_H * 0.66)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="#8fc86e" opacity={0.52} />
      <BoyShadow x={250} y={610} scaleX={5.8} scaleY={0.24} rotate={-5} pose="wave" opacity={0.28} filter={paint('softShadow')} />
      <FlowerBed seed={seed} y={VIEW_H * 0.64} />
      <GrassRow seed={seed} baseY={VIEW_H * 0.86} blades={50} height={36} lean={10} fill="#6fab55" />
      <GrassRow seed={seed + 9} baseY={VIEW_H} blades={56} height={62} lean={8} fill="#518c45" />
      {range(22).map((i) => (
        <circle key={i} cx={n(80 + i * 45)} cy={n(630 + (i % 4) * 17)} r={n(2.2 + (i % 3))} fill="#eaffd8" opacity={0.62} />
      ))}
      <Leo x={230} y={500} scale={0.78} pose="wave" />
      {finish(paint)}
    </g>
  ),

  'shadow-02-copycat-shapes': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('playSky'))}
      <SunGlow cx={n(VIEW_W * 0.82)} cy={n(VIEW_H * 0.18)} r={72} core="#fff3bb" halo="#ffe68a55" />
      <Cloud x={VIEW_W * 0.2} y={VIEW_H * 0.16} scale={0.8} fill="#ffffff" opacity={0.72} />
      <Fence y={VIEW_H * 0.5} fill="#d4ae7b" rail="#bf915f" />
      <ShadowDog x={860} y={420} scale={0.9} opacity={0.34} />
      <Ground topY={VIEW_H * 0.6} fill="#81c96b" wobble={12} />
      <path d={`M${n(VIEW_W * 0.14)},${n(VIEW_H * 0.76)} C${n(VIEW_W * 0.34)},${n(VIEW_H * 0.66)} ${n(VIEW_W * 0.62)},${n(VIEW_H * 0.7)} ${n(VIEW_W * 0.88)},${n(VIEW_H * 0.61)}`} stroke="#b7df7b" strokeWidth={20} fill="none" opacity={0.38} strokeLinecap="round" />
      <BoyShadow x={570} y={616} scaleX={2.4} scaleY={0.42} rotate={7} pose="jump" opacity={0.44} filter={paint('softShadow')} />
      <GrassRow seed={seed} baseY={VIEW_H * 0.9} blades={48} height={42} lean={-4} fill="#6aad55" />
      <GrassRow seed={seed + 17} baseY={VIEW_H} blades={52} height={58} lean={-2} fill="#4f9047" />
      <Leaf x={120} y={660} length={95} width={54} angle={-58} fill="#5f9e4f" />
      <Leaf x={1050} y={690} length={115} width={64} angle={55} fill="#5f9e4f" />
      <Leo x={520} y={420} scale={0.94} pose="jump" rotate={-4} />
      {range(8).map((i) => (
        <circle key={i} cx={n(390 + i * 34)} cy={n(530 + (i % 2) * 26)} r={5} fill="#e8f9c5" opacity={0.55} />
      ))}
      {finish(paint)}
    </g>
  ),

  'shadow-03-shadow-tag': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('dappleSky'))}
      <SunGlow cx={n(VIEW_W * 0.78)} cy={n(VIEW_H * 0.22)} r={62} core="#fff0ba" halo="#ffe39b44" />
      <Hill baseY={VIEW_H * 0.69} crest={62} fill="#74ad5d" peakX={VIEW_W * 0.7} />
      <Ground topY={VIEW_H * 0.62} fill="#70b75d" wobble={16} />
      <ellipse cx={n(VIEW_W * 0.52)} cy={n(VIEW_H * 0.73)} rx={430} ry={130} fill="#57944f" opacity={0.45} />
      <Tree x={VIEW_W * 0.5} baseY={VIEW_H * 0.69} height={470} spread={190} canopy="#2f6f45" trunk="#66442e" />
      <path d={`M${n(VIEW_W * 0.42)},${n(VIEW_H * 0.72)} C${n(VIEW_W * 0.54)},${n(VIEW_H * 0.63)} ${n(VIEW_W * 0.72)},${n(VIEW_H * 0.71)} ${n(VIEW_W * 0.76)},${n(VIEW_H * 0.82)}`} stroke="#e5f0a4" strokeWidth={14} fill="none" opacity={0.46} strokeLinecap="round" />
      <Dapple seed={seed} x={160} y={365} width={880} height={330} />
      <BoyShadow x={720} y={612} scaleX={2.15} scaleY={0.35} rotate={23} pose="run" opacity={0.39} filter={paint('softShadow')} />
      <Leo x={650} y={475} scale={0.78} pose="run" rotate={11} />
      <path d={`M${n(VIEW_W * 0.23)},${n(VIEW_H * 0.79)} A${n(VIEW_W * 0.29)},${n(VIEW_H * 0.16)} 0 1 1 ${n(VIEW_W * 0.78)},${n(VIEW_H * 0.77)}`} stroke="#496f42" strokeWidth={4} fill="none" opacity={0.32} strokeDasharray="18 18" strokeLinecap="round" />
      <GrassRow seed={seed + 3} baseY={VIEW_H} blades={58} height={60} lean={12} fill="#4f8f45" />
      {range(10).map((i) => (
        <ellipse key={i} cx={n(240 + i * 78)} cy={n(715 + (i % 3) * 18)} rx={18} ry={7} fill="#355f39" opacity={0.25} />
      ))}
      {finish(paint)}
    </g>
  ),

  'shadow-04-tiny-noon': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('noonSky'))}
      <SunGlow cx={n(VIEW_W * 0.5)} cy={68} r={82} core="#fffbd8" halo="#fff6b966" />
      {range(18).map((i) => (
        <line
          key={i}
          x1={n(VIEW_W * 0.5)}
          y1={96}
          x2={n(VIEW_W * 0.5 + Math.cos((i / 18) * Math.PI * 2) * 160)}
          y2={n(96 + Math.sin((i / 18) * Math.PI * 2) * 70)}
          stroke="#fff8c7"
          strokeWidth={3}
          opacity={0.42}
          strokeLinecap="round"
        />
      ))}
      <rect x={0} y={n(VIEW_H * 0.2)} width={VIEW_W} height={n(VIEW_H * 0.8)} fill="#9dd270" />
      <path d={`M0,${n(VIEW_H * 0.44)} C${n(VIEW_W * 0.24)},${n(VIEW_H * 0.36)} ${n(VIEW_W * 0.64)},${n(VIEW_H * 0.48)} ${VIEW_W},${n(VIEW_H * 0.39)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="#8cc866" opacity={0.7} />
      <Fence y={VIEW_H * 0.34} fill="#d7b987" rail="#be9968" />
      <g data-motif="shadow" data-shadow-elongation={n(74 / 34)}>
        <ellipse cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.57)} rx={74} ry={34} fill={SHADOW} opacity={0.36} />
        <ellipse cx={n(VIEW_W * 0.5)} cy={n(VIEW_H * 0.58)} rx={46} ry={18} fill={SHADOW} opacity={0.42} />
      </g>
      <g transform={`translate(${n(VIEW_W * 0.5)} ${n(VIEW_H * 0.39)}) scale(1.22)`}>
        <ellipse cx={-22} cy={174} rx={24} ry={12} fill={SHOE} />
        <ellipse cx={22} cy={174} rx={24} ry={12} fill={SHOE} />
        <Leo x={0} y={0} scale={1} pose="down" />
      </g>
      <GrassRow seed={seed} baseY={VIEW_H * 0.86} blades={42} height={30} lean={0} fill="#79b95c" />
      <GrassRow seed={seed + 31} baseY={VIEW_H} blades={48} height={48} lean={0} fill="#5b9a4a" />
      {range(14).map((i) => (
        <circle key={i} cx={n(135 + i * 70)} cy={n(615 + (i % 5) * 29)} r={n(3 + (i % 2))} fill="#f5ffd0" opacity={0.46} />
      ))}
      {finish(paint)}
    </g>
  ),

  'shadow-05-giant-evening': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('eveningSky'))}
      <SunGlow cx={n(VIEW_W * 0.06)} cy={n(VIEW_H * 0.69)} r={78} core="#ffce74" halo="#ff9b5366" />
      <Cloud x={VIEW_W * 0.72} y={VIEW_H * 0.16} scale={1.08} fill="#ffd7a4" opacity={0.42} />
      <Hill baseY={VIEW_H * 0.68} crest={68} fill="#795775" peakX={VIEW_W * 0.68} />
      <Ground topY={VIEW_H * 0.64} fill="#6d9853" wobble={12} />
      <Fence y={VIEW_H * 0.42} fill="#d59a62" rail="#b9784b" />
      <g filter={paint('softShadow')} opacity={0.46}>
        <path d={`M${n(VIEW_W * 0.27)},${n(VIEW_H * 0.75)} C${n(VIEW_W * 0.42)},${n(VIEW_H * 0.48)} ${n(VIEW_W * 0.62)},${n(VIEW_H * 0.28)} ${n(VIEW_W * 0.86)},${n(VIEW_H * 0.1)} L${n(VIEW_W * 0.98)},${n(VIEW_H * 0.18)} C${n(VIEW_W * 0.78)},${n(VIEW_H * 0.42)} ${n(VIEW_W * 0.55)},${n(VIEW_H * 0.68)} ${n(VIEW_W * 0.34)},${VIEW_H} Z`} fill={SHADOW} />
        <circle cx={n(VIEW_W * 0.76)} cy={n(VIEW_H * 0.2)} r={88} fill={SHADOW} />
        <Capsule x1={VIEW_W * 0.69} y1={VIEW_H * 0.26} x2={VIEW_W * 0.58} y2={VIEW_H * 0.06} width={54} fill={SHADOW} />
        <Capsule x1={VIEW_W * 0.83} y1={VIEW_H * 0.26} x2={VIEW_W * 0.96} y2={VIEW_H * 0.06} width={54} fill={SHADOW} />
      </g>
      <ShadowRabbit x={905} y={382} scale={1.15} opacity={0.32} />
      <BoyShadow x={318} y={632} scaleX={4.6} scaleY={0.3} rotate={-13} pose="proud" opacity={0.35} filter={paint('softShadow')} />
      <path d={`M0,${n(VIEW_H * 0.73)} C${n(VIEW_W * 0.28)},${n(VIEW_H * 0.55)} ${n(VIEW_W * 0.68)},${n(VIEW_H * 0.82)} ${VIEW_W},${n(VIEW_H * 0.62)}`} stroke="#eaa25e" strokeWidth={24} opacity={0.26} fill="none" />
      <GrassRow seed={seed} baseY={VIEW_H * 0.9} blades={52} height={44} lean={22} fill="#6c9d4a" />
      <GrassRow seed={seed + 37} baseY={VIEW_H} blades={56} height={68} lean={18} fill="#506f3c" />
      <Leo x={285} y={506} scale={0.82} pose="proud" />
      {range(9).map((i) => (
        <ellipse key={i} cx={n(470 + i * 58)} cy={n(676 + (i % 3) * 22)} rx={28} ry={8} fill="#412c4f" opacity={0.2} />
      ))}
      {finish(paint)}
    </g>
  ),

  'shadow-06-dusk-fade': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('duskSky'))}
      <StarField seed={seed} count={26} x={80} y={30} width={1040} height={260} color="#f5edc8" minR={1.1} maxR={2.7} />
      <Star cx={1060} cy={118} r={13} fill="#fff4c7" />
      <Moon cx={130} cy={126} r={42} glow="#f8efcf33" face="#f0ead0" />
      <Hill baseY={VIEW_H * 0.68} crest={70} fill="#394867" peakX={VIEW_W * 0.28} />
      <Hill baseY={VIEW_H * 0.72} crest={58} fill="#303e5f" peakX={VIEW_W * 0.74} />
      <Ground topY={VIEW_H * 0.68} fill="#314e54" wobble={8} />
      <Fence y={VIEW_H * 0.54} fill="#6f6478" rail="#5f5870" />
      <path d={`M0,${n(VIEW_H * 0.72)} C${n(VIEW_W * 0.36)},${n(VIEW_H * 0.67)} ${n(VIEW_W * 0.67)},${n(VIEW_H * 0.75)} ${VIEW_W},${n(VIEW_H * 0.69)} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="#273f45" opacity={0.55} />
      <Tree x={1000} baseY={VIEW_H * 0.68} height={300} spread={120} canopy="#253a4f" trunk="#3f3540" />
      <GrassRow seed={seed + 5} baseY={VIEW_H} blades={46} height={50} lean={2} fill="#263b43" />
      <g opacity={0.18} filter={paint('softShadow')} data-motif="shadow">
        <ellipse cx={600} cy={640} rx={130} ry={18} fill={SHADOW} />
      </g>
      <Mom x={628} y={457} scale={0.72} />
      <Leo x={566} y={538} scale={0.52} pose="calm" />
      <Capsule x1={640} y1={505} x2={584} y2={538} width={13} fill={SKIN_SHADE} />
      {range(7).map((i) => (
        <circle key={i} cx={n(200 + i * 115)} cy={n(660 + (i % 2) * 18)} r={4} fill="#52636c" opacity={0.55} />
      ))}
      {finish(paint)}
    </g>
  ),

  'shadow-07-nightlight-teddy': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('bedroomWall'))}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint('nightlightGlow')} />
      <StarField seed={seed} count={18} x={650} y={40} width={450} height={260} color="#dbe2ff" minR={1} maxR={2.4} />
      <rect x={0} y={n(VIEW_H * 0.72)} width={VIEW_W} height={n(VIEW_H * 0.28)} fill="#161b36" />
      <rect x={n(VIEW_W * 0.08)} y={n(VIEW_H * 0.48)} width={92} height={220} rx={18} fill="#624735" />
      <path d={`M${n(VIEW_W * 0.09)},${n(VIEW_H * 0.49)} q48,-54 94,0`} stroke="#7a5b43" strokeWidth={16} fill="none" strokeLinecap="round" />
      <g opacity={0.34} filter={paint('lampShadow')} fill={SHADOW} data-motif="shadow" transform={`translate(${n(VIEW_W * 0.64)} ${n(VIEW_H * 0.34)}) scale(1.75)`}>
        <circle cx={-42} cy={-40} r={22} />
        <circle cx={42} cy={-40} r={22} />
        <circle cx={0} cy={-18} r={52} />
        <ellipse cx={0} cy={54} rx={74} ry={64} />
        <ellipse cx={-62} cy={28} rx={28} ry={54} transform="rotate(22 -62 28)" />
        <ellipse cx={62} cy={28} rx={28} ry={54} transform="rotate(-22 62 28)" />
      </g>
      <g transform={`translate(${n(VIEW_W * 0.2)} ${n(VIEW_H * 0.63)})`}>
        <circle cx={0} cy={-46} r={36} fill="#ffcf7a" opacity={0.48} />
        <path d="M-24,-22 L24,-22 L34,56 L-34,56 Z" fill="#f4b45e" />
        <rect x={-10} y={56} width={20} height={42} rx={8} fill="#6a4b3c" />
      </g>
      <rect x={n(VIEW_W * 0.23)} y={n(VIEW_H * 0.58)} width={n(VIEW_W * 0.62)} height={138} rx={28} fill="#485385" />
      <rect x={n(VIEW_W * 0.26)} y={n(VIEW_H * 0.52)} width={n(VIEW_W * 0.52)} height={104} rx={30} fill="#e5e8ff" />
      <path d={`M${n(VIEW_W * 0.24)},${n(VIEW_H * 0.77)} L${n(VIEW_W * 0.24)},${n(VIEW_H * 0.64)} C${n(VIEW_W * 0.42)},${n(VIEW_H * 0.55)} ${n(VIEW_W * 0.68)},${n(VIEW_H * 0.58)} ${n(VIEW_W * 0.86)},${n(VIEW_H * 0.68)} L${n(VIEW_W * 0.86)},${n(VIEW_H * 0.83)} Z`} fill="#7d87c9" />
      <path d={`M${n(VIEW_W * 0.25)},${n(VIEW_H * 0.67)} C${n(VIEW_W * 0.43)},${n(VIEW_H * 0.62)} ${n(VIEW_W * 0.65)},${n(VIEW_H * 0.65)} ${n(VIEW_W * 0.84)},${n(VIEW_H * 0.75)}`} stroke="#9aa1dc" strokeWidth={14} fill="none" opacity={0.72} />
      <g transform={`translate(${n(VIEW_W * 0.38)} ${n(VIEW_H * 0.56)}) rotate(-10)`}>
        <Leo x={0} y={0} scale={0.7} pose="sleep" />
      </g>
      <g transform={`translate(${n(VIEW_W * 0.68)} ${n(VIEW_H * 0.57)}) rotate(12)`}>
        <circle cx={-26} cy={-38} r={18} fill={TEDDY} />
        <circle cx={26} cy={-38} r={18} fill={TEDDY} />
        <circle cx={0} cy={-18} r={38} fill={TEDDY} />
        <ellipse cx={0} cy={42} rx={52} ry={48} fill={TEDDY} />
        <ellipse cx={-42} cy={26} rx={18} ry={42} fill={TEDDY} />
        <ellipse cx={42} cy={26} rx={18} ry={42} fill={TEDDY} />
        <ClosedEye cx={-12} cy={-22} w={10} stroke="#513720" />
        <ClosedEye cx={12} cy={-22} w={10} stroke="#513720" />
        <ellipse cx={0} cy={-6} rx={10} ry={7} fill="#513720" />
      </g>
      {finish(paint)}
    </g>
  ),
};

export const shadowWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
