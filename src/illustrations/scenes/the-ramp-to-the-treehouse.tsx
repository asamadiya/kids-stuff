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
 * WORLD: The Ramp to the Treehouse — simple machines in a leafy backyard.
 * Motifs: an overstuffed basket, red wagon, plank ramp, grooved pulley wheel,
 * warm treehouse, rope ladder, grandfather's lamp, and a bedtime window.
 */

const KWAME_SKIN = '#8b5138';
const ANA_SKIN = '#b86f45';
const GRANDPA_SKIN = '#7b4935';
const KWAME_HAIR = '#241713';
const ANA_HAIR = '#2b1714';
const GRANDPA_HAIR = '#d8d0bf';
const KWAME_SHIRT = '#f0b64f';
const KWAME_SHORTS = '#496e95';
const ANA_SHIRT = '#d66d78';
const ANA_DRESS = '#5f8f6a';
const GRANDPA_ROBE = '#52678d';
const ROPE = '#c49a5b';
const DARK_WOOD = '#5d3d25';
const LEAF_MID = '#3d7a43';
const WAGON_RED = '#d94739';
const WAGON_DARK = '#9f2f2b';

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('lateSky')}
        stops={[
          { offset: 0, color: '#c9e4b4' },
          { offset: 0.5, color: '#f2d99b' },
          { offset: 1, color: '#f6c98b' },
        ]}
      />
      <LinearGradient
        id={id('brightSky')}
        stops={[
          { offset: 0, color: '#b9dfad' },
          { offset: 0.62, color: '#e8d98c' },
          { offset: 1, color: '#f7bd74' },
        ]}
      />
      <LinearGradient
        id={id('goldSky')}
        stops={[
          { offset: 0, color: '#567b63' },
          { offset: 0.4, color: '#d8ab55' },
          { offset: 1, color: '#f7d484' },
        ]}
      />
      <LinearGradient
        id={id('sunsetSky')}
        stops={[
          { offset: 0, color: '#5f6e72' },
          { offset: 0.5, color: '#db884e' },
          { offset: 1, color: '#f8c86a' },
        ]}
      />
      <LinearGradient
        id={id('nightSky')}
        stops={[
          { offset: 0, color: '#131c3c' },
          { offset: 0.55, color: '#202a55' },
          { offset: 1, color: '#374063' },
        ]}
      />
      <LinearGradient
        id={id('plank')}
        x1={0}
        y1={0}
        x2={1}
        y2={0}
        stops={[
          { offset: 0, color: '#7f4d2b' },
          { offset: 0.45, color: '#bf7d40' },
          { offset: 1, color: '#8c5831' },
        ]}
      />
      <RadialGradient
        id={id('lampGlow')}
        cx={0.45}
        cy={0.42}
        r={0.55}
        stops={[
          { offset: 0, color: '#ffe2a0', opacity: 0.95 },
          { offset: 0.58, color: '#d9883f', opacity: 0.45 },
          { offset: 1, color: '#7b3f27', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('leafGlow')}
        cx={0.52}
        cy={0.34}
        r={0.6}
        stops={[
          { offset: 0, color: '#f8d36f', opacity: 0.72 },
          { offset: 0.7, color: '#6a8a44', opacity: 0.25 },
          { offset: 1, color: '#244c31', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#eaf1ff', opacity: 0.8 },
          { offset: 1, color: '#eaf1ff', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.58, color: '#000000', opacity: 0 },
          { offset: 1, color: '#1e1520', opacity: 0.36 },
        ]}
      />
      <GrainFilter id={id('grain')} opacity={0.048} />
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

function Treehouse({ x, y, scale = 1, lit = false }: { x: number; y: number; scale?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-treehouse" data-motif="treehouse">
      <rect x={-118} y={-6} width={236} height={126} rx={12} fill={DARK_WOOD} />
      <rect x={-100} y={12} width={200} height={92} rx={8} fill="#936039" />
      {range(5).map((i) => (
        <rect key={i} x={n(-100 + i * 40)} y={15} width={8} height={88} fill="#754725" opacity={0.55} />
      ))}
      <path d="M-142,-6 L0,-92 L142,-6 Z" fill="#704222" />
      <path d="M-116,-8 L0,-72 L116,-8" stroke="#b16f36" strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={-80} y={38} width={50} height={66} rx={5} fill="#4b3325" />
      <rect x={32} y={32} width={48} height={42} rx={5} fill={lit ? '#ffd481' : '#394d56'} />
      <rect x={53} y={32} width={5} height={42} fill="#6c4327" />
      <rect x={32} y={51} width={48} height={5} fill="#6c4327" />
      <rect x={-132} y={104} width={264} height={18} rx={6} fill="#6c4327" />
    </g>
  );
}

function RopeLadder({ x, y, h = 220 }: { x: number; y: number; h?: number }) {
  return (
    <g className="scene-rope-ladder">
      <Capsule x1={n(x - 28)} y1={y} x2={n(x - 44)} y2={n(y + h)} width={7} fill={ROPE} />
      <Capsule x1={n(x + 28)} y1={y} x2={n(x + 20)} y2={n(y + h)} width={7} fill={ROPE} />
      {range(6).map((i) => (
        <Capsule
          key={i}
          x1={n(x - 32 - i * 2.2)}
          y1={n(y + 28 + i * 32)}
          x2={n(x + 25 - i * 1.2)}
          y2={n(y + 31 + i * 32)}
          width={9}
          fill="#c38a4a"
        />
      ))}
    </g>
  );
}

function Basket({ x, y, scale = 1, full = true, tilt = 0 }: { x: number; y: number; scale?: number; full?: boolean; tilt?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(tilt)}) scale(${n(scale)})`} className="scene-basket" data-motif="basket">
      {full ? (
        <>
          <rect x={-76} y={-86} width={54} height={42} rx={12} fill="#f08e9a" transform="rotate(-9 -49 -65)" />
          <rect x={-20} y={-92} width={58} height={46} rx={10} fill="#6ea5d8" transform="rotate(7 9 -69)" />
          <path d="M26,-88 q36,8 54,44 q-44,18 -80,-8 q10,-22 26,-36 Z" fill="#f0c96b" />
          <rect x={-52} y={-104} width={22} height={54} rx={4} fill="#8f5d46" transform="rotate(-18 -41 -77)" />
          <rect x={-16} y={-112} width={23} height={58} rx={4} fill="#6b71a6" transform="rotate(-5 -4 -83)" />
          <rect x={18} y={-106} width={23} height={54} rx={4} fill="#c75446" transform="rotate(13 29 -79)" />
        </>
      ) : null}
      <path d="M-104,-32 q104,-50 208,0" stroke="#c58b4c" strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M-104,-28 L104,-28 L78,74 Q0,96 -78,74 Z" fill="#bf8046" />
      <path d="M-88,-16 L88,-16 L68,62 Q0,78 -68,62 Z" fill="#d89b5a" opacity={0.62} />
      {range(6).map((i) => (
        <path key={i} d={`M${n(-78 + i * 31)},-20 q${n(-10 + i * 4)},42 ${n(-6 + i * 2)},86`} stroke="#81512d" strokeWidth={4} fill="none" opacity={0.45} />
      ))}
      {range(4).map((i) => (
        <path key={i} d={`M${n(-92)},${n(-2 + i * 20)} q${n(92)},${n(20 - i * 4)} ${n(184)},${n(0)}`} stroke="#8b5b31" strokeWidth={4} fill="none" opacity={0.38} />
      ))}
    </g>
  );
}

function Wagon({ x, y, scale = 1, angle = 0 }: { x: number; y: number; scale?: number; angle?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(scale)})`} className="scene-wagon" data-motif="wagon">
      <Capsule x1={80} y1={-32} x2={138} y2={-78} width={8} fill="#5a3c2b" />
      <circle cx={146} cy={-84} r={10} fill="#5a3c2b" />
      <path d="M-104,-86 L104,-86 L80,0 L-84,0 Z" fill={WAGON_RED} />
      <path d="M-88,-72 L86,-72 L70,-14 L-72,-14 Z" fill="#f0604c" opacity={0.45} />
      <rect x={-112} y={-94} width={224} height={18} rx={7} fill={WAGON_DARK} />
      <Capsule x1={-84} y1={8} x2={84} y2={8} width={9} fill="#51392f" />
      <circle cx={-72} cy={18} r={28} fill="#2e2e34" data-motif="wheel" />
      <circle cx={72} cy={18} r={28} fill="#2e2e34" data-motif="wheel" />
      <circle cx={-72} cy={18} r={13} fill="#c9c1ae" />
      <circle cx={72} cy={18} r={13} fill="#c9c1ae" />
    </g>
  );
}

function Pulley({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-pulley" data-motif="pulley-wheel" data-grooved="true">
      <path d="M0,-72 q-18,12 -18,34" stroke="#4d3728" strokeWidth={12} fill="none" strokeLinecap="round" />
      <Capsule x1={-62} y1={-8} x2={62} y2={-8} width={12} fill={ROPE} motif="rope" />
      <circle cx={0} cy={0} r={56} fill="#5a4639" />
      <circle cx={0} cy={0} r={44} fill="#d1a66a" />
      <circle cx={0} cy={0} r={31} fill="#87613e" />
      <circle cx={0} cy={0} r={12} fill="#3d3029" />
      <path d="M-42,0 a42,42 0 0 1 84,0" stroke="#f0d19a" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.65} />
      <path d="M-44,0 a44,44 0 0 0 88,0" stroke="#704d34" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.65} />
    </g>
  );
}

function Kwame({ x, y, scale = 1, pose = 'strain' }: { x: number; y: number; scale?: number; pose?: 'strain' | 'cheer' | 'reach' | 'sit' | 'sleep' }) {
  const open = pose === 'strain' || pose === 'cheer' || pose === 'reach';
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-kwame">
      {pose === 'sleep' ? (
        <>
          <ellipse cx={-10} cy={12} rx={58} ry={32} fill="#f2efe2" />
          <circle cx={-4} cy={-5} r={34} fill={KWAME_SKIN} />
          <path d="M-38,-16 Q-8,-60 32,-24 Q18,-48 -2,-48 Q-28,-42 -38,-16 Z" fill={KWAME_HAIR} />
          <ClosedEye cx={-17} cy={-3} w={14} />
          <ClosedEye cx={10} cy={-3} w={14} />
          <Smile cx={-4} cy={16} w={18} curve={6} />
        </>
      ) : (
        <>
          <Capsule x1={0} y1={0} x2={0} y2={88} width={48} fill={KWAME_SHIRT} />
          <rect x={-24} y={48} width={48} height={48} rx={10} fill={KWAME_SHORTS} />
          {pose === 'cheer' ? (
            <>
              <Capsule x1={-16} y1={10} x2={-54} y2={-58} width={15} fill={KWAME_SHIRT} />
              <Capsule x1={16} y1={10} x2={58} y2={-60} width={15} fill={KWAME_SHIRT} />
              <ellipse cx={-58} cy={-64} rx={13} ry={11} fill={KWAME_SKIN} />
              <ellipse cx={62} cy={-66} rx={13} ry={11} fill={KWAME_SKIN} />
            </>
          ) : pose === 'reach' ? (
            <>
              <Capsule x1={-12} y1={16} x2={-88} y2={12} width={15} fill={KWAME_SHIRT} />
              <Capsule x1={16} y1={18} x2={86} y2={-16} width={15} fill={KWAME_SHIRT} />
              <ellipse cx={-92} cy={12} rx={13} ry={10} fill={KWAME_SKIN} />
              <ellipse cx={92} cy={-19} rx={13} ry={10} fill={KWAME_SKIN} />
            </>
          ) : pose === 'sit' ? (
            <>
              <Capsule x1={-14} y1={18} x2={-66} y2={48} width={16} fill={KWAME_SHIRT} />
              <Capsule x1={14} y1={18} x2={62} y2={52} width={16} fill={KWAME_SHIRT} />
              <ellipse cx={-70} cy={51} rx={13} ry={10} fill={KWAME_SKIN} />
              <ellipse cx={66} cy={55} rx={13} ry={10} fill={KWAME_SKIN} />
            </>
          ) : (
            <>
              <Capsule x1={-12} y1={16} x2={-86} y2={32} width={17} fill={KWAME_SHIRT} />
              <Capsule x1={12} y1={16} x2={84} y2={32} width={17} fill={KWAME_SHIRT} />
              <ellipse cx={-92} cy={34} rx={14} ry={11} fill={KWAME_SKIN} />
              <ellipse cx={90} cy={34} rx={14} ry={11} fill={KWAME_SKIN} />
            </>
          )}
          <Capsule x1={-12} y1={86} x2={-22} y2={138} width={16} fill={KWAME_SHORTS} />
          <Capsule x1={12} y1={86} x2={22} y2={138} width={16} fill={KWAME_SHORTS} />
          <ellipse cx={-28} cy={144} rx={15} ry={8} fill="#3a2c27" />
          <ellipse cx={28} cy={144} rx={15} ry={8} fill="#3a2c27" />
          <circle cx={0} cy={-40} r={35} fill={KWAME_SKIN} />
          <path d="M-35,-47 Q-4,-90 35,-48 Q18,-76 -2,-76 Q-25,-70 -35,-47 Z" fill={KWAME_HAIR} />
          <Eye cx={-12} cy={-42} r={4.5} />
          <Eye cx={12} cy={-42} r={4.5} />
          <Blush cx={-21} cy={-25} r={5} />
          <Blush cx={21} cy={-25} r={5} />
          {open ? <OpenMouth cx={0} cy={-21} rx={7} ry={9} /> : <Smile cx={0} cy={-22} w={20} curve={9} />}
        </>
      )}
    </g>
  );
}

function Ana({ x, y, scale = 1, pose = 'push' }: { x: number; y: number; scale?: number; pose?: 'push' | 'pull' | 'strain' | 'look' | 'cozy' }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-ana">
      <Capsule x1={0} y1={0} x2={0} y2={94} width={52} fill={ANA_SHIRT} />
      <path d="M-32,44 L32,44 L54,108 L-54,108 Z" fill={ANA_DRESS} />
      {pose === 'pull' ? (
        <>
          <Capsule x1={-12} y1={14} x2={-54} y2={80} width={16} fill={ANA_SHIRT} />
          <Capsule x1={14} y1={16} x2={58} y2={92} width={16} fill={ANA_SHIRT} />
          <ellipse cx={-58} cy={84} rx={13} ry={10} fill={ANA_SKIN} />
          <ellipse cx={62} cy={96} rx={13} ry={10} fill={ANA_SKIN} />
        </>
      ) : pose === 'strain' ? (
        <>
          <Capsule x1={-14} y1={16} x2={-84} y2={28} width={16} fill={ANA_SHIRT} />
          <Capsule x1={14} y1={16} x2={84} y2={28} width={16} fill={ANA_SHIRT} />
          <ellipse cx={-90} cy={30} rx={13} ry={10} fill={ANA_SKIN} />
          <ellipse cx={90} cy={30} rx={13} ry={10} fill={ANA_SKIN} />
        </>
      ) : pose === 'look' ? (
        <>
          <Capsule x1={-16} y1={18} x2={-50} y2={66} width={16} fill={ANA_SHIRT} />
          <Capsule x1={16} y1={18} x2={44} y2={70} width={16} fill={ANA_SHIRT} />
        </>
      ) : pose === 'cozy' ? (
        <>
          <Capsule x1={-14} y1={18} x2={-58} y2={-18} width={16} fill={ANA_SHIRT} />
          <Capsule x1={14} y1={18} x2={52} y2={-16} width={16} fill={ANA_SHIRT} />
          <ellipse cx={-62} cy={-21} rx={13} ry={10} fill={ANA_SKIN} />
          <ellipse cx={56} cy={-19} rx={13} ry={10} fill={ANA_SKIN} />
        </>
      ) : (
        <>
          <Capsule x1={-10} y1={20} x2={-92} y2={-4} width={16} fill={ANA_SHIRT} />
          <Capsule x1={10} y1={20} x2={-78} y2={42} width={16} fill={ANA_SHIRT} />
          <ellipse cx={-98} cy={-6} rx={13} ry={10} fill={ANA_SKIN} />
          <ellipse cx={-84} cy={44} rx={13} ry={10} fill={ANA_SKIN} />
        </>
      )}
      <Capsule x1={-14} y1={106} x2={-28} y2={150} width={15} fill="#3f6a4e" />
      <Capsule x1={16} y1={106} x2={30} y2={150} width={15} fill="#3f6a4e" />
      <ellipse cx={-32} cy={155} rx={14} ry={8} fill="#3a2c27" />
      <ellipse cx={34} cy={155} rx={14} ry={8} fill="#3a2c27" />
      <circle cx={0} cy={-42} r={35} fill={ANA_SKIN} />
      <path d="M-37,-47 Q0,-92 38,-47 Q30,-78 1,-78 Q-27,-76 -37,-47 Z" fill={ANA_HAIR} />
      <path d="M34,-46 q30,30 14,84" stroke={ANA_HAIR} strokeWidth={14} fill="none" strokeLinecap="round" />
      <Eye cx={-12} cy={-43} r={4.4} />
      <Eye cx={12} cy={-43} r={4.4} />
      <Blush cx={-22} cy={-25} r={5} />
      <Blush cx={22} cy={-25} r={5} />
      {pose === 'strain' || pose === 'pull' ? <OpenMouth cx={0} cy={-21} rx={7} ry={8} /> : <Smile cx={0} cy={-22} w={20} curve={9} />}
    </g>
  );
}

function Grandpa({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-grandpa">
      <Capsule x1={0} y1={0} x2={0} y2={132} width={72} fill={GRANDPA_ROBE} />
      <Capsule x1={-20} y1={20} x2={-70} y2={74} width={19} fill={GRANDPA_ROBE} />
      <Capsule x1={20} y1={20} x2={84} y2={-8} width={19} fill={GRANDPA_ROBE} />
      <ellipse cx={-74} cy={78} rx={14} ry={11} fill={GRANDPA_SKIN} />
      <ellipse cx={90} cy={-10} rx={14} ry={11} fill={GRANDPA_SKIN} />
      <circle cx={0} cy={-48} r={38} fill={GRANDPA_SKIN} />
      <path d="M-38,-55 Q0,-96 38,-55 Q16,-72 0,-72 Q-18,-72 -38,-55 Z" fill={GRANDPA_HAIR} />
      <path d="M-22,-28 q22,30 44,0" stroke={GRANDPA_HAIR} strokeWidth={9} fill="none" strokeLinecap="round" />
      <ClosedEye cx={-13} cy={-50} w={11} />
      <ClosedEye cx={13} cy={-50} w={11} />
      <Smile cx={0} cy={-30} w={20} curve={8} />
    </g>
  );
}

function LeavesCanopy({ y = 120, seed = 1 }: { y?: number; seed?: number }) {
  const tones = ['#2e6637', '#3e7c42', '#5e8e46', '#2a5534'];
  return (
    <g className="scene-canopy">
      {range(18).map((i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const cx = n(70 + col * 210 + ((seed + i * 31) % 50));
        const cy = n(y + row * 72 + ((seed + i * 17) % 34));
        return <circle key={i} cx={cx} cy={cy} r={n(76 + ((seed + i * 13) % 32))} fill={tones[i % tones.length]} opacity={0.92} />;
      })}
    </g>
  );
}

function BackyardBase({ paint, seed, skyPaint = 'lateSky' }: { paint: SceneWorldProps['paint']; seed: number; skyPaint?: string }) {
  return (
    <>
      {sky(paint(skyPaint))}
      <SunGlow cx={n(VIEW_W * 0.83)} cy={n(VIEW_H * 0.16)} r={56} core="#fff0bf" halo="#ffe3a4" />
      <Cloud x={n(VIEW_W * 0.22)} y={n(VIEW_H * 0.18)} scale={0.82} fill="#fff7df" opacity={0.58} />
      <Tree x={n(VIEW_W * 0.74)} baseY={n(VIEW_H * 0.86)} height={390} spread={185} canopy={LEAF_MID} trunk={DARK_WOOD} />
      <Ground topY={n(VIEW_H * 0.74)} fill="#619449" wobble={18} />
      <GrassRow seed={seed} baseY={n(VIEW_H * 0.92)} blades={44} height={48} lean={6} fill="#77aa55" />
      <GrassRow seed={seed + 12} baseY={VIEW_H} blades={42} height={62} lean={3} fill="#4f7f3f" />
    </>
  );
}

function Cushion({ x, y, fill, tilt = 0 }: { x: number; y: number; fill: string; tilt?: number }) {
  return <rect x={n(x)} y={n(y)} width={72} height={48} rx={14} fill={fill} transform={`rotate(${n(tilt)} ${n(x + 36)} ${n(y + 24)})`} />;
}

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'machines-01-heavy-basket': ({ paint, seed }) => (
    <g data-scene-art>
      <BackyardBase paint={paint} seed={seed} skyPaint="lateSky" />
      <Treehouse x={n(VIEW_W * 0.75)} y={n(VIEW_H * 0.24)} scale={0.9} />
      <RopeLadder x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.34)} h={275} />
      <Basket x={n(VIEW_W * 0.39)} y={n(VIEW_H * 0.68)} scale={1.15} full />
      <Kwame x={n(VIEW_W * 0.18)} y={n(VIEW_H * 0.62)} scale={1.12} pose="strain" />
      <Capsule x1={n(VIEW_W * 0.25)} y1={n(VIEW_H * 0.65)} x2={n(VIEW_W * 0.31)} y2={n(VIEW_H * 0.65)} width={9} fill={DARK_WOOD} />
      <Leaf x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.46)} length={120} width={76} angle={-36} fill="#4d8846" />
      <Leaf x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.34)} length={100} width={64} angle={52} fill="#346d3b" />
      {finish(paint)}
    </g>
  ),

  'machines-02-together-fail': ({ paint, seed }) => (
    <g data-scene-art>
      <BackyardBase paint={paint} seed={seed + 20} skyPaint="brightSky" />
      <Treehouse x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.22)} scale={0.72} />
      <RopeLadder x={n(VIEW_W * 0.74)} y={n(VIEW_H * 0.31)} h={230} />
      <Basket x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.66)} scale={1.05} full tilt={-3} />
      <Kwame x={n(VIEW_W * 0.25)} y={n(VIEW_H * 0.62)} scale={1.02} pose="strain" />
      <Ana x={n(VIEW_W * 0.76)} y={n(VIEW_H * 0.6)} scale={1} pose="strain" />
      <Cushion x={n(VIEW_W * 0.49)} y={n(VIEW_H * 0.78)} fill="#70a6db" tilt={18} />
      <Cushion x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.76)} fill="#f0c35c" tilt={-11} />
      <path d={`M${n(VIEW_W * 0.4)},${n(VIEW_H * 0.73)} q${n(110)},${n(28)} ${n(222)},${n(0)}`} stroke="#3f6b3e" strokeWidth={6} fill="none" opacity={0.45} />
      {finish(paint)}
    </g>
  ),

  'machines-03-ramp-wagon': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('brightSky'))}
      <Cloud x={n(VIEW_W * 0.75)} y={n(VIEW_H * 0.16)} scale={0.78} fill="#fff4dd" opacity={0.62} />
      <Ground topY={n(VIEW_H * 0.72)} fill="#6b9349" wobble={14} />
      <GrassRow seed={seed + 30} baseY={n(VIEW_H * 0.93)} blades={36} height={44} lean={7} fill="#6da44f" />
      <Tree x={n(VIEW_W * 0.88)} baseY={n(VIEW_H * 0.82)} height={320} spread={150} canopy="#3e7640" trunk={DARK_WOOD} />
      <ellipse cx={n(VIEW_W * 0.8)} cy={n(VIEW_H * 0.68)} rx={102} ry={52} fill="#7b4f31" />
      <rect x={n(VIEW_W * 0.73)} y={n(VIEW_H * 0.56)} width={154} height={95} rx={32} fill="#8c5d38" />
      <g transform={`rotate(-18 ${n(VIEW_W * 0.51)} ${n(VIEW_H * 0.6)})`} data-motif="ramp">
        <rect x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.54)} width={n(VIEW_W * 0.56)} height={70} rx={12} fill={paint('plank')} />
        {range(6).map((i) => (
          <path key={i} d={`M${n(VIEW_W * 0.23 + i * 98)},${n(VIEW_H * 0.55)} l${n(42)},${n(65)}`} stroke="#704422" strokeWidth={3} opacity={0.42} />
        ))}
      </g>
      <Wagon x={n(VIEW_W * 0.48)} y={n(VIEW_H * 0.56)} scale={0.86} angle={-18} />
      <Basket x={n(VIEW_W * 0.48)} y={n(VIEW_H * 0.43)} scale={0.62} full />
      <Ana x={n(VIEW_W * 0.25)} y={n(VIEW_H * 0.56)} scale={0.94} pose="push" />
      <Kwame x={n(VIEW_W * 0.74)} y={n(VIEW_H * 0.55)} scale={0.9} pose="cheer" />
      {finish(paint)}
    </g>
  ),

  'machines-04-look-up': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('goldSky'))}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint('leafGlow')} />
      <LeavesCanopy y={12} seed={seed + 40} />
      <Capsule x1={n(VIEW_W * 0.16)} y1={n(VIEW_H * 0.22)} x2={n(VIEW_W * 0.9)} y2={n(VIEW_H * 0.13)} width={46} fill={DARK_WOOD} />
      <Capsule x1={n(VIEW_W * 0.61)} y1={n(VIEW_H * 0.14)} x2={n(VIEW_W * 0.57)} y2={n(VIEW_H * 0.3)} width={12} fill="#493326" />
      <Capsule x1={n(VIEW_W * 0.57)} y1={n(VIEW_H * 0.28)} x2={n(VIEW_W * 0.57)} y2={n(VIEW_H * 0.56)} width={9} fill={ROPE} />
      <Capsule x1={n(VIEW_W * 0.47)} y1={n(VIEW_H * 0.31)} x2={n(VIEW_W * 0.47)} y2={n(VIEW_H * 0.58)} width={9} fill={ROPE} />
      <Pulley x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.3)} scale={0.88} />
      <Treehouse x={n(VIEW_W * 0.74)} y={n(VIEW_H * 0.42)} scale={0.72} lit />
      <ellipse cx={n(VIEW_W * 0.52)} cy={n(VIEW_H * 0.84)} rx={220} ry={76} fill="#7c5434" />
      <Kwame x={n(VIEW_W * 0.37)} y={n(VIEW_H * 0.72)} scale={0.8} pose="sit" />
      <Ana x={n(VIEW_W * 0.6)} y={n(VIEW_H * 0.71)} scale={0.78} pose="look" />
      <Leaf x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.18)} length={132} width={84} angle={-80} fill="#557f3f" />
      <Leaf x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.24)} length={128} width={78} angle={70} fill="#315c35" />
      {finish(paint)}
    </g>
  ),

  'machines-05-pulley-lift': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('sunsetSky'))}
      <SunGlow cx={n(VIEW_W * 0.17)} cy={n(VIEW_H * 0.17)} r={74} core="#ffe19b" halo="#f6b46b" />
      <Tree x={n(VIEW_W * 0.55)} baseY={n(VIEW_H * 0.95)} height={520} spread={230} canopy="#2f6639" trunk={DARK_WOOD} />
      <LeavesCanopy y={-18} seed={seed + 50} />
      <Treehouse x={n(VIEW_W * 0.62)} y={n(VIEW_H * 0.21)} scale={0.82} lit />
      <Capsule x1={n(VIEW_W * 0.32)} y1={n(VIEW_H * 0.2)} x2={n(VIEW_W * 0.84)} y2={n(VIEW_H * 0.16)} width={42} fill={DARK_WOOD} />
      <Capsule x1={n(VIEW_W * 0.56)} y1={n(VIEW_H * 0.18)} x2={n(VIEW_W * 0.56)} y2={n(VIEW_H * 0.74)} width={10} fill={ROPE} motif="rope" />
      <Capsule x1={n(VIEW_W * 0.67)} y1={n(VIEW_H * 0.19)} x2={n(VIEW_W * 0.78)} y2={n(VIEW_H * 0.74)} width={10} fill={ROPE} motif="rope" />
      <Pulley x={n(VIEW_W * 0.615)} y={n(VIEW_H * 0.2)} scale={0.82} />
      <Basket x={n(VIEW_W * 0.56)} y={n(VIEW_H * 0.53)} scale={0.78} full />
      <Capsule x1={n(VIEW_W * 0.51)} y1={n(VIEW_H * 0.47)} x2={n(VIEW_W * 0.56)} y2={n(VIEW_H * 0.42)} width={9} fill={ROPE} motif="rope" />
      <Kwame x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.32)} scale={0.72} pose="reach" />
      <Ana x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.61)} scale={0.9} pose="pull" />
      <Ground topY={n(VIEW_H * 0.82)} fill="#3f6d3e" wobble={20} />
      <GrassRow seed={seed + 54} baseY={VIEW_H} blades={42} height={58} lean={12} fill="#4d7b3e" />
      {finish(paint)}
    </g>
  ),

  'machines-06-cozy-treehouse': ({ paint }) => (
    <g data-scene-art>
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#2d4d31" />
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint('lampGlow')} />
      {range(18).map((i) => (
        <circle key={i} cx={n(20 + (i % 6) * 230)} cy={n(20 + Math.floor(i / 6) * 108)} r={n(64 + (i % 4) * 12)} fill={i % 2 === 0 ? '#2f6338' : '#3f783f'} opacity={0.62} />
      ))}
      <rect x={n(VIEW_W * 0.12)} y={n(VIEW_H * 0.16)} width={n(VIEW_W * 0.76)} height={n(VIEW_H * 0.68)} rx={28} fill="#875433" />
      {range(7).map((i) => (
        <rect key={i} x={n(VIEW_W * 0.13 + i * 126)} y={n(VIEW_H * 0.16)} width={12} height={n(VIEW_H * 0.68)} fill="#6b3f27" opacity={0.45} />
      ))}
      <path d={`M${n(VIEW_W * 0.08)},${n(VIEW_H * 0.16)} L${n(VIEW_W * 0.5)},${n(VIEW_H * 0.02)} L${n(VIEW_W * 0.92)},${n(VIEW_H * 0.16)} Z`} fill="#5d351f" />
      <rect x={n(VIEW_W * 0.64)} y={n(VIEW_H * 0.27)} width={150} height={108} rx={10} fill="#f0b45e" />
      <rect x={n(VIEW_W * 0.71)} y={n(VIEW_H * 0.27)} width={8} height={108} fill="#74472b" />
      <rect x={n(VIEW_W * 0.64)} y={n(VIEW_H * 0.32)} width={150} height={8} fill="#74472b" />
      <Cushion x={n(VIEW_W * 0.28)} y={n(VIEW_H * 0.62)} fill="#f08e9a" tilt={-8} />
      <Cushion x={n(VIEW_W * 0.39)} y={n(VIEW_H * 0.6)} fill="#6ea5d8" tilt={6} />
      <path d={`M${n(VIEW_W * 0.24)},${n(VIEW_H * 0.72)} q${n(210)},${n(-46)} ${n(430)},${n(0)} v${n(64)} H${n(VIEW_W * 0.23)} Z`} fill="#f0c96b" />
      <Basket x={n(VIEW_W * 0.71)} y={n(VIEW_H * 0.66)} scale={0.62} full={false} tilt={20} />
      <Ana x={n(VIEW_W * 0.38)} y={n(VIEW_H * 0.49)} scale={0.76} pose="cozy" />
      <Kwame x={n(VIEW_W * 0.54)} y={n(VIEW_H * 0.5)} scale={0.76} pose="cheer" />
      <rect x={n(VIEW_W * 0.55)} y={n(VIEW_H * 0.34)} width={44} height={78} rx={18} fill="#ffd478" />
      <ellipse cx={n(VIEW_W * 0.572)} cy={n(VIEW_H * 0.34)} rx={34} ry={18} fill="#ffe1a1" opacity={0.72} />
      {finish(paint)}
    </g>
  ),

  'machines-07-bedtime-sleep': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('nightSky'))}
      <StarField seed={seed + 70} count={44} x={n(VIEW_W * 0.46)} y={20} width={n(VIEW_W * 0.48)} height={n(VIEW_H * 0.42)} color="#dce8ff" />
      <rect x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.1)} width={n(VIEW_W * 0.42)} height={n(VIEW_H * 0.48)} rx={16} fill="#101833" />
      <rect x={n(VIEW_W * 0.53)} y={n(VIEW_H * 0.13)} width={n(VIEW_W * 0.36)} height={n(VIEW_H * 0.42)} fill="#1f2b50" />
      <Moon cx={n(VIEW_W * 0.82)} cy={n(VIEW_H * 0.2)} r={42} glow={paint('moonGlow')} />
      <Treehouse x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.34)} scale={0.38} />
      <Tree x={n(VIEW_W * 0.67)} baseY={n(VIEW_H * 0.56)} height={210} spread={95} canopy="#101a2e" trunk="#0f1426" />
      <rect x={n(VIEW_W * 0.49)} y={n(VIEW_H * 0.08)} width={15} height={n(VIEW_H * 0.52)} fill="#4a4d6e" />
      <rect x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.33)} width={n(VIEW_W * 0.42)} height={12} fill="#4a4d6e" />
      <rect x={0} y={n(VIEW_H * 0.62)} width={VIEW_W} height={n(VIEW_H * 0.38)} fill="#2c315b" />
      <rect x={n(VIEW_W * 0.06)} y={n(VIEW_H * 0.64)} width={n(VIEW_W * 0.43)} height={n(VIEW_H * 0.18)} rx={22} fill="#6e6fa3" />
      <ellipse cx={n(VIEW_W * 0.17)} cy={n(VIEW_H * 0.66)} rx={82} ry={42} fill="#eff0f4" />
      <Kwame x={n(VIEW_W * 0.18)} y={n(VIEW_H * 0.63)} scale={0.9} pose="sleep" />
      <path d={`M${n(VIEW_W * 0.06)},${n(VIEW_H * 0.83)} L${n(VIEW_W * 0.06)},${n(VIEW_H * 0.72)} Q${n(VIEW_W * 0.28)},${n(VIEW_H * 0.63)} ${n(VIEW_W * 0.51)},${n(VIEW_H * 0.74)} L${n(VIEW_W * 0.51)},${n(VIEW_H * 0.88)} Z`} fill="#8d8ac4" />
      <rect x={n(VIEW_W * 0.75)} y={n(VIEW_H * 0.59)} width={34} height={120} rx={14} fill="#3d3151" />
      <rect x={n(VIEW_W * 0.72)} y={n(VIEW_H * 0.54)} width={92} height={40} rx={18} fill="#ffd482" opacity={0.72} />
      <circle cx={n(VIEW_W * 0.765)} cy={n(VIEW_H * 0.56)} r={28} fill="#ffe2a0" opacity={0.7} />
      <Grandpa x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.5)} scale={0.86} />
      {finish(paint)}
    </g>
  ),
};

export const machinesWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
