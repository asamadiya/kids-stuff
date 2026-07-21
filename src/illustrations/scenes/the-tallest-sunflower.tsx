import type { ReactNode } from 'react';
import {
  Leaf,
  LinearGradient,
  Moon,
  RadialGradient,
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
import {
  CinematicCharacter,
  CinematicDefs,
  DepthLayer,
  defaultAppearance,
  foreshortenGeometry,
  resolvePoseGeometry,
  type CharacterAppearance,
  type CharacterPerformance,
  type LightingRig,
  type MaterialInstance,
} from '../cinematic';

const MILO: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#e3a775', shadow: '#935a3b', highlight: '#f4c08f' },
  face: { shape: 'round', brow: '#4c2e20', mouth: '#7a3c3e' },
  hair: { style: 'short', base: '#5b3a24', highlight: '#845a3d', volume: 0.56 },
  wardrobe: {
    garment: 'tunic',
    base: '#659da6',
    shadow: '#3e6c79',
    trim: '#e2ba6a',
    hemline: 0.5,
  },
  footwear: { style: 'barefoot', base: '#8f5739' },
  secondaryShapes: [{ kind: 'belt', color: '#8a6238', accent: '#e8c47d' }],
};

const ROSA: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#d99669', shadow: '#8c5237', highlight: '#edb685' },
  face: { shape: 'heart', brow: '#352119', mouth: '#763b4a' },
  hair: { style: 'long', base: '#3a2417', highlight: '#68432d', volume: 0.72 },
  wardrobe: {
    garment: 'dress',
    base: '#ad5f80',
    shadow: '#703a5c',
    trim: '#e3b866',
    hemline: 0.74,
  },
  footwear: { style: 'sandal', base: '#5c3a27' },
  secondaryShapes: [{ kind: 'sash', color: '#315f96', accent: '#78a8d4' }],
};

const GARDEN_TIMBER: MaterialInstance = {
  id: 'sunflower-garden-timber',
  preset: 'timber',
  base: '#9a704b',
  shadow: '#503728',
  highlight: '#caa171',
  textureScale: 1.1,
  roughness: 0.72,
};

const LEAF_MATERIAL: MaterialInstance = {
  id: 'sunflower-leaf',
  preset: 'cloth',
  base: '#4f9145',
  shadow: '#244f2a',
  highlight: '#9dca72',
  textureScale: 0.72,
  roughness: 0.56,
};

const BED_MATERIAL: MaterialInstance = {
  id: 'sunflower-bed-cloth',
  preset: 'cloth',
  base: '#6d6ea4',
  shadow: '#33365f',
  highlight: '#afb1dc',
  textureScale: 0.9,
  roughness: 0.7,
};

const DAWN_LIGHT: LightingRig = {
  key: { azimuth: -38, elevation: 46, color: '#ffe0a9', intensity: 0.76 },
  fill: { color: '#7896a5', intensity: 0.22 },
  rim: { azimuth: 146, elevation: 30, color: '#f5cb93', intensity: 0.34 },
  practicals: [
    { id: 'sunflower-dawn-practical', x: 170, y: 160, radius: 300, color: '#ffe6aa', intensity: 0.44 },
  ],
};

const MORNING_LIGHT: LightingRig = {
  key: { azimuth: -32, elevation: 52, color: '#ffdda0', intensity: 0.72 },
  fill: { color: '#6e91a5', intensity: 0.2 },
  rim: { azimuth: 142, elevation: 34, color: '#edc487', intensity: 0.3 },
  practicals: [
    { id: 'sunflower-morning-practical', x: 1010, y: 150, radius: 330, color: '#ffdf8b', intensity: 0.4 },
  ],
};

const BREEZE_LIGHT: LightingRig = {
  key: { azimuth: -20, elevation: 38, color: '#efd092', intensity: 0.62 },
  fill: { color: '#6c8fa8', intensity: 0.24 },
  rim: { azimuth: 154, elevation: 28, color: '#f0c889', intensity: 0.28 },
  practicals: [
    { id: 'sunflower-breeze-practical', x: 1040, y: 200, radius: 330, color: '#e7c275', intensity: 0.34 },
  ],
};

const HONEY_LIGHT: LightingRig = {
  key: { azimuth: -18, elevation: 32, color: '#f0b86d', intensity: 0.66 },
  fill: { color: '#5e7e96', intensity: 0.22 },
  rim: { azimuth: 158, elevation: 24, color: '#f3cf8f', intensity: 0.3 },
  practicals: [
    { id: 'sunflower-honey-practical', x: 1030, y: 220, radius: 340, color: '#e8a959', intensity: 0.36 },
  ],
};

const NIGHT_LIGHT: LightingRig = {
  key: { azimuth: -54, elevation: 58, color: '#afc9e4', intensity: 0.54 },
  fill: { color: '#405c7c', intensity: 0.18 },
  rim: { azimuth: 140, elevation: 36, color: '#d7e0ef', intensity: 0.32 },
  practicals: [
    { id: 'sunflower-moon-practical', x: 930, y: 150, radius: 190, color: '#ecebd8', intensity: 0.5 },
  ],
};

const MILO_GAZE: CharacterPerformance = {
  pose: 'reach',
  lineOfAction: 12,
  shoulderTilt: -10,
  pelvisTilt: 7,
  weightFoot: 'right',
  gazeTarget: { x: 760, y: 120 },
  headTurn: 0.72,
  expression: 'curious',
  leftHand: 'open',
  rightHand: 'open',
  leftHandTarget: { x: 280, y: 390 },
  rightHandTarget: { x: 460, y: 320 },
};

const MILO_STACK: CharacterPerformance = {
  pose: 'reach',
  lineOfAction: -12,
  shoulderTilt: 13,
  pelvisTilt: -7,
  weightFoot: 'left',
  gazeTarget: { x: 670, y: 300 },
  headTurn: 0.68,
  expression: 'uncertain',
  leftHand: 'open',
  rightHand: 'open',
  leftHandTarget: { x: 635, y: 340 },
  rightHandTarget: { x: 670, y: 450 },
};

const MILO_KNOT: CharacterPerformance = {
  pose: 'kneel',
  lineOfAction: 8,
  shoulderTilt: -11,
  pelvisTilt: 6,
  weightFoot: 'right',
  gazeTarget: { x: 520, y: 570 },
  headTurn: 0.55,
  expression: 'calm',
  leftHand: 'hold',
  rightHand: 'hold',
  leftHandTarget: { x: 480, y: 584 },
  rightHandTarget: { x: 550, y: 574 },
};

const ROSA_OFFER: CharacterPerformance = {
  pose: 'kneel',
  lineOfAction: -7,
  shoulderTilt: 10,
  pelvisTilt: -6,
  weightFoot: 'left',
  gazeTarget: { x: 500, y: 570 },
  headTurn: -0.58,
  expression: 'calm',
  leftHand: 'open',
  rightHand: 'hold',
  rightHandTarget: { x: 610, y: 470 },
};

const MILO_STEADY: CharacterPerformance = {
  pose: 'reach',
  lineOfAction: 18,
  shoulderTilt: -14,
  pelvisTilt: 8,
  weightFoot: 'right',
  gazeTarget: { x: 680, y: 350 },
  headTurn: 0.7,
  expression: 'concerned',
  leftHand: 'hold',
  rightHand: 'hold',
  leftHandTarget: { x: 610, y: 430 },
  rightHandTarget: { x: 660, y: 390 },
};

const MILO_COUNT: CharacterPerformance = {
  pose: 'point',
  lineOfAction: -8,
  shoulderTilt: 12,
  pelvisTilt: -7,
  weightFoot: 'left',
  gazeTarget: { x: 620, y: 250 },
  headTurn: 0.62,
  expression: 'calm',
  leftHand: 'rest',
  rightHand: 'point',
  rightHandTarget: { x: 620, y: 310 },
};

const ROSA_HOLD: CharacterPerformance = {
  pose: 'kneel',
  lineOfAction: 8,
  shoulderTilt: -12,
  pelvisTilt: 6,
  weightFoot: 'right',
  gazeTarget: { x: 470, y: 430 },
  headTurn: -0.48,
  expression: 'calm',
  leftHand: 'hold',
  rightHand: 'open',
  leftHandTarget: { x: 640, y: 650 },
};

const MILO_CHEER: CharacterPerformance = {
  pose: 'reach',
  lineOfAction: 8,
  shoulderTilt: -12,
  pelvisTilt: 7,
  weightFoot: 'right',
  gazeTarget: { x: 600, y: 120 },
  headTurn: 0.58,
  expression: 'calling',
  leftHand: 'open',
  rightHand: 'open',
  leftHandTarget: { x: 180, y: 330 },
  rightHandTarget: { x: 390, y: 310 },
};

const ROSA_CLAP: CharacterPerformance = {
  pose: 'point',
  lineOfAction: -5,
  shoulderTilt: 11,
  pelvisTilt: -6,
  weightFoot: 'left',
  gazeTarget: { x: 340, y: 430 },
  headTurn: -0.55,
  expression: 'delighted',
  leftHand: 'open',
  rightHand: 'open',
  leftHandTarget: { x: 830, y: 400 },
  rightHandTarget: { x: 900, y: 400 },
};

const MILO_SLEEP: CharacterPerformance = {
  pose: 'sleep',
  lineOfAction: 0,
  shoulderTilt: 0,
  pelvisTilt: 0,
  weightFoot: 'center',
  gazeTarget: { x: 930, y: 150 },
  headTurn: 0.12,
  expression: 'sleeping',
  leftHand: 'rest',
  rightHand: 'rest',
};

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient id={id('sunflowerDawnSky')} stops={[
        { offset: 0, color: '#8393a0' },
        { offset: 0.58, color: '#d2ad7f' },
        { offset: 1, color: '#edca83' },
      ]} />
      <LinearGradient id={id('sunflowerMorningSky')} stops={[
        { offset: 0, color: '#6f8792' },
        { offset: 0.58, color: '#bda879' },
        { offset: 1, color: '#e0bd70' },
      ]} />
      <LinearGradient id={id('sunflowerBreezeSky')} stops={[
        { offset: 0, color: '#637784' },
        { offset: 0.6, color: '#9d9278' },
        { offset: 1, color: '#c9a66b' },
      ]} />
      <LinearGradient id={id('sunflowerHoneySky')} stops={[
        { offset: 0, color: '#4f5f70' },
        { offset: 0.58, color: '#927266' },
        { offset: 1, color: '#d49a58' },
      ]} />
      <LinearGradient id={id('sunflowerNightSky')} stops={[
        { offset: 0, color: '#070d20' },
        { offset: 0.58, color: '#172544' },
        { offset: 1, color: '#303c61' },
      ]} />
      <LinearGradient id={id('sunflowerBed')} stops={[
        { offset: 0, color: '#7d7fb4' },
        { offset: 1, color: '#393c69' },
      ]} />
      <RadialGradient id={id('sunflowerWindowGlow')} stops={[
        { offset: 0, color: '#ffe6a5', opacity: 0.92 },
        { offset: 1, color: '#e9a757', opacity: 0.08 },
      ]} />
      <RadialGradient id={id('sunflowerMoonGlow')} stops={[
        { offset: 0, color: '#f2efda', opacity: 0.86 },
        { offset: 1, color: '#f2efda', opacity: 0 },
      ]} />
      <RadialGradient id={id('sunflowerVignette')} stops={[
        { offset: 0.58, color: '#000000', opacity: 0 },
        { offset: 1, color: '#100d18', opacity: 0.44 },
      ]} />
    </defs>
  );
}

function CinematicPage({
  sceneId,
  stage,
  id,
  seed,
  paint,
  lighting,
  materials,
  calm = false,
  children,
}: {
  sceneId: string;
  stage: number;
  id: SceneWorldProps['id'];
  seed: number;
  paint: SceneWorldProps['paint'];
  lighting: LightingRig;
  materials: readonly MaterialInstance[];
  calm?: boolean;
  children: ReactNode;
}) {
  return (
    <g
      data-scene-art
      data-cinematic-scene={sceneId}
      data-time-stage={stage}
      data-calm-landing={calm ? 'true' : undefined}
    >
      <defs>
        <CinematicDefs id={id} seed={seed} lighting={lighting} materials={materials} />
      </defs>
      {children}
      <Vignette paint={paint('sunflowerVignette')} />
    </g>
  );
}

function FlowerHead({
  cx,
  cy,
  r,
  night = false,
}: {
  cx: number;
  cy: number;
  r: number;
  night?: boolean;
}) {
  const petalA = night ? '#29324e' : '#f5c84b';
  const petalB = night ? '#202943' : '#e7a832';
  return (
    <g className="scene-sunflower-head" data-motif="sunflower-head">
      {range(18).map((i) => (
        <ellipse
          key={i}
          cx={n(cx)}
          cy={n(cy - r * 0.84)}
          rx={n(r * 0.14)}
          ry={n(r * 0.42)}
          fill={i % 2 ? petalA : petalB}
          transform={`rotate(${n((i / 18) * 360)} ${n(cx)} ${n(cy)})`}
        />
      ))}
      <circle cx={n(cx)} cy={n(cy)} r={n(r * 0.58)} fill={night ? '#11182d' : '#684322'} />
      {range(20).map((i) => {
        const a = (i / 20) * Math.PI * 5;
        const radius = r * 0.5 * (i / 20);
        return <circle key={i} cx={n(cx + Math.cos(a) * radius)} cy={n(cy + Math.sin(a) * radius)} r={n(r * 0.026)} fill={night ? '#34405b' : '#9b6a32'} />;
      })}
      <path d={`M${n(cx - r * 0.72)},${n(cy - r * 0.26)} Q${n(cx)},${n(cy - r)} ${n(cx + r * 0.56)},${n(cy - r * 0.36)}`} stroke={night ? '#b9c9db' : '#ffe6a1'} strokeWidth={n(r * 0.06)} fill="none" opacity={0.68} data-lighting="key" />
      <path d={`M${n(cx + r * 0.52)},${n(cy + r * 0.28)} Q${n(cx)},${n(cy + r * 0.84)} ${n(cx - r * 0.48)},${n(cy + r * 0.32)}`} stroke="#6e8da5" strokeWidth={n(r * 0.09)} fill="none" opacity={0.34} data-lighting="fill" />
      <path d={`M${n(cx + r * 0.7)},${n(cy - r * 0.28)} Q${n(cx + r * 0.4)},${n(cy - r * 0.76)} ${n(cx)},${n(cy - r * 0.82)}`} stroke={night ? '#d5deed' : '#f2cf8d'} strokeWidth={n(r * 0.04)} fill="none" opacity={0.62} data-lighting="rim" />
    </g>
  );
}

function Sunflower({
  baseX,
  baseY,
  topX,
  topY,
  headR,
  paint,
  sway = 0,
  night = false,
}: {
  baseX: number;
  baseY: number;
  topX: number;
  topY: number;
  headR: number;
  paint: SceneWorldProps['paint'];
  sway?: number;
  night?: boolean;
}) {
  const stem = night ? '#172c32' : '#4e8e45';
  const leaf = night ? '#203d38' : '#5d9b50';
  return (
    <g>
      <g data-motif="sunflower-stem" data-material="leaf" filter={paint('sunflower-leaf')}>
        <path d={`M${baseX - 18},${baseY} C${baseX - 12 + sway * 0.2},${n(baseY * 0.68)} ${topX - 14 + sway},${n(topY + (baseY - topY) * 0.32)} ${topX - 8},${topY} L${topX + 8},${topY} C${topX + 14 + sway},${n(topY + (baseY - topY) * 0.32)} ${baseX + 12 + sway * 0.2},${n(baseY * 0.68)} ${baseX + 18},${baseY} Z`} fill={stem} />
        <Leaf x={baseX - 8} y={baseY - (baseY - topY) * 0.3} length={150} width={88} angle={-58} fill={leaf} vein={night ? '#516c6a' : '#d3d08a'} />
        <Leaf x={baseX + 20} y={baseY - (baseY - topY) * 0.55} length={142} width={84} angle={54} fill={night ? '#1a3533' : '#3d783d'} vein={stem} />
        <Leaf x={topX - 6} y={topY + (baseY - topY) * 0.18} length={110} width={66} angle={-46} fill={leaf} vein={stem} />
        <path d={`M${baseX - 6},${baseY - 30} C${baseX - 36},${baseY - 240} ${topX + sway - 24},${topY + 180} ${topX - 3},${topY + 14}`} stroke={night ? '#aabfd0' : '#e3d394'} strokeWidth={5} fill="none" opacity={0.58} data-lighting="key" />
        <path d={`M${baseX + 16},${baseY - 40} C${baseX + 42},${baseY - 260} ${topX + sway + 22},${topY + 170} ${topX + 8},${topY + 18}`} stroke="#66879f" strokeWidth={7} fill="none" opacity={0.34} data-lighting="fill" />
        <path d={`M${baseX - 18},${baseY - 80} C${baseX - 42},${baseY - 300} ${topX + sway - 18},${topY + 120} ${topX - 8},${topY + 8}`} stroke={night ? '#d1dbe9' : '#f0c987'} strokeWidth={3} fill="none" opacity={0.64} data-lighting="rim" />
      </g>
      <FlowerHead cx={topX} cy={topY} r={headR} night={night} />
    </g>
  );
}

function Ribbon({
  x1,
  y1,
  x2,
  y2,
  count,
  bend = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count: number;
  bend?: number;
}) {
  const point = (t: number) => ({
    x: x1 + (x2 - x1) * t,
    y: y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * bend,
  });
  return (
    <g data-material="ribbon">
      <path d={`M${x1},${y1} Q${n((x1 + x2) / 2)},${n((y1 + y2) / 2 - bend * 2)} ${x2},${y2}`} stroke="#3973bd" strokeWidth={12} fill="none" strokeLinecap="round" data-motif="ribbon" />
      {range(count).map((i) => {
        const p = point(count === 1 ? 0 : i / (count - 1));
        return (
          <g key={i} data-motif="knot">
            <circle cx={n(p.x)} cy={n(p.y)} r={9} fill="#28599b" />
            <path d={`M${n(p.x - 12)},${n(p.y - 8)} L${n(p.x + 12)},${n(p.y + 8)} M${n(p.x - 12)},${n(p.y + 8)} L${n(p.x + 12)},${n(p.y - 8)}`} stroke="#6da0d3" strokeWidth={4} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Fence({ y, paint, night = false }: { y: number; paint: SceneWorldProps['paint']; night?: boolean }) {
  return (
    <g data-material="timber" filter={paint('sunflower-garden-timber')}>
      <path d={`M0,${y} C320,${y - 26} 760,${y + 22} 1200,${y - 18}`} stroke={night ? '#26324a' : '#a77a50'} strokeWidth={22} fill="none" />
      <path d={`M0,${y + 74} C340,${y + 44} 770,${y + 96} 1200,${y + 54}`} stroke={night ? '#202a40' : '#8c6242'} strokeWidth={18} fill="none" />
      {range(12).map((i) => <path key={i} d={`M${30 + i * 106},${y - 34} L${44 + i * 106},${y + 118}`} stroke={night ? '#1c2538' : '#8f6646'} strokeWidth={24} strokeLinecap="round" />)}
    </g>
  );
}

function LitCharacter({
  id,
  kind,
  x,
  y,
  scale,
  performance,
}: {
  id: SceneWorldProps['id'];
  kind: 'milo' | 'rosa';
  x: number;
  y: number;
  scale: number;
  performance: CharacterPerformance;
}) {
  const appearance = kind === 'milo' ? MILO : ROSA;
  const geometry = resolvePoseGeometry(appearance, performance, { x, y, scale });
  const rendered = foreshortenGeometry(geometry);
  const hr = appearance.proportions.headRadius * scale;
  return (
    <g data-character-lighting="sunflower" data-character={kind}>
      <CinematicCharacter
        id={(part) => id(`${kind}-${part}`)}
        x={x}
        y={y}
        scale={scale}
        appearance={appearance}
        performance={performance}
        className={`scene-${kind}`}
      />
      <path d={`M${n(geometry.head.x - hr * 0.86)},${n(geometry.head.y - hr * 0.04)} Q${n(geometry.head.x - hr * 0.62)},${n(geometry.head.y - hr * 0.72)} ${n(geometry.head.x - hr * 0.08)},${n(geometry.head.y - hr * 0.9)} M${n(geometry.shoulder.left.x)},${n(geometry.shoulder.left.y)} L${n(rendered.elbow.left.x)},${n(rendered.elbow.left.y)}`} stroke="#f4c48d" strokeWidth={n(4.5 * scale)} fill="none" strokeLinecap="round" opacity={0.72} data-lighting="key" />
      <path d={`M${n(geometry.head.x + hr * 0.78)},${n(geometry.head.y + hr * 0.14)} Q${n(geometry.head.x + hr * 0.5)},${n(geometry.head.y + hr * 0.72)} ${n(geometry.head.x + hr * 0.04)},${n(geometry.head.y + hr * 0.86)} M${n(geometry.shoulder.right.x)},${n(geometry.shoulder.right.y + 5)} L${n(geometry.hip.right.x)},${n(geometry.hip.right.y + 12)}`} stroke="#7598af" strokeWidth={n(6 * scale)} fill="none" strokeLinecap="round" opacity={0.38} data-lighting="fill" />
      <path d={`M${n(geometry.head.x + hr * 0.9)},${n(geometry.head.y - hr * 0.12)} Q${n(geometry.head.x + hr * 0.7)},${n(geometry.head.y - hr * 0.7)} ${n(geometry.head.x + hr * 0.18)},${n(geometry.head.y - hr * 0.9)} M${n(geometry.shoulder.right.x)},${n(geometry.shoulder.right.y)} L${n(rendered.elbow.right.x)},${n(rendered.elbow.right.y)}`} stroke="#efd09a" strokeWidth={n(2.8 * scale)} fill="none" strokeLinecap="round" opacity={0.62} data-lighting="rim" />
    </g>
  );
}

function Window({ x, y, width, height, paint, night = false }: { x: number; y: number; width: number; height: number; paint: SceneWorldProps['paint']; night?: boolean }) {
  return (
    <g data-motif="window">
      <rect x={x} y={y} width={width} height={height} rx={14} fill={night ? '#111a32' : '#8d6948'} />
      <rect x={x + 20} y={y + 20} width={width - 40} height={height - 40} fill={night ? '#18294b' : paint('sunflowerWindowGlow')} />
      <path d={`M${x + width / 2},${y + 18} V${y + height - 18} M${x + 18},${y + height / 2} H${x + width - 18}`} stroke={night ? '#3f4c70' : '#795a40'} strokeWidth={10} />
    </g>
  );
}

function Bee({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={10} ry={7} fill="#e9b840" />
      <path d="M-4,-6 V6 M3,-6 V6" stroke="#2e271d" strokeWidth={3} />
      <ellipse cx={-9} cy={-7} rx={7} ry={4} fill="#dbe7e8" opacity={0.7} />
      <ellipse cx={9} cy={-7} rx={7} ry={4} fill="#dbe7e8" opacity={0.7} />
    </g>
  );
}

function Ladybug({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={9} ry={8} fill="#c94639" />
      <path d="M0,-8 V8" stroke="#251e27" strokeWidth={2} />
      <circle cx={-3} cy={-1} r={1.5} fill="#251e27" />
      <circle cx={3} cy={2} r={1.5} fill="#251e27" />
    </g>
  );
}

function Bed({ paint }: { paint: SceneWorldProps['paint'] }) {
  return (
    <g data-material="cloth" filter={paint('sunflower-bed-cloth')}>
      <rect x={34} y={558} width={536} height={194} rx={30} fill="#4a4d78" />
      <ellipse cx={176} cy={576} rx={112} ry={48} fill="#dedff0" />
      <path d="M42,704 L42,630 Q232,572 564,648 L564,774 L42,774 Z" fill={paint('sunflowerBed')} />
      <path d="M54,646 Q250,596 540,664" stroke="#b1b4db" strokeWidth={8} fill="none" opacity={0.44} data-lighting="key" />
      <path d="M48,714 Q266,656 552,718" stroke="#48627f" strokeWidth={14} fill="none" opacity={0.34} data-lighting="fill" />
      <path d="M50,622 Q244,572 538,650" stroke="#d9dceb" strokeWidth={4} fill="none" opacity={0.62} data-lighting="rim" />
    </g>
  );
}

const PAGES: Record<string, (props: SceneWorldProps) => ReactNode> = {
  'sunflower-01-dawn-window': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-01-dawn-window" stage={0} id={id} seed={seed} paint={paint} lighting={DAWN_LIGHT} materials={[GARDEN_TIMBER, LEAF_MATERIAL]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('sunflowerDawnSky')} />
      <DepthLayer depth="far">
        <path d="M0,520 L0,250 L390,250 L390,800 L0,800 Z" fill="#96745d" />
        <Window x={72} y={292} width={240} height={190} paint={paint} />
        <path d="M390,468 C570,420 744,448 920,394 C1050,354 1126,372 1200,346 L1200,610 L390,610 Z" fill="#66785e" opacity={0.56} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <Fence y={560} paint={paint} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <Sunflower baseX={780} baseY={760} topX={742} topY={134} headR={82} paint={paint} sway={-18} />
        <Ladybug x={786} y={604} />
        <Bee x={616} y={188} />
        <Bee x={874} y={240} />
        <LitCharacter id={id} kind="milo" x={290} y={730} scale={0.86} performance={MILO_GAZE} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,704 Q130,666 268,712 L326,800 Z" fill="#394032" />
        <path d="M1200,800 L1200,676 Q1116,646 1030,706 L990,800 Z" fill="#394032" />
      </DepthLayer>
    </CinematicPage>
  ),

  'sunflower-02-hand-stack': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-02-hand-stack" stage={1} id={id} seed={seed} paint={paint} lighting={MORNING_LIGHT} materials={[LEAF_MATERIAL]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('sunflowerMorningSky')} />
      <DepthLayer depth="far">
        <path d="M0,520 C250,464 470,510 680,446 C870,388 1032,416 1200,364 L1200,800 L0,800 Z" fill="#6c7b5f" opacity={0.56} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g transform="rotate(-12 660 420)">
          <path d="M610,850 C626,620 640,344 652,-80 L744,-80 C724,320 706,600 696,850 Z" fill="#4e8e45" data-motif="sunflower-stem" />
          <path d="M630,800 C650,570 664,310 678,-40" stroke="#d6cf86" strokeWidth={8} fill="none" opacity={0.52} data-lighting="key" />
          <path d="M700,790 C694,560 704,306 718,-30" stroke="#6b8ca1" strokeWidth={12} fill="none" opacity={0.34} data-lighting="fill" />
          <path d="M612,740 C634,520 646,278 660,-20" stroke="#f0c98b" strokeWidth={4} fill="none" opacity={0.62} data-lighting="rim" />
        </g>
        <Leaf x={610} y={320} length={230} width={132} angle={-64} fill="#3d783d" vein="#d4cf88" />
        <Leaf x={742} y={600} length={240} width={140} angle={128} fill="#5d9b50" vein="#3f743b" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="milo" x={500} y={742} scale={1.06} performance={MILO_STACK} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,724 Q120,680 246,724 L300,800 Z" fill="#384034" />
        <path d="M1200,800 L1200,696 Q1114,662 1028,716 L986,800 Z" fill="#384034" />
      </DepthLayer>
    </CinematicPage>
  ),

  'sunflower-03-knot-ribbon': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-03-knot-ribbon" stage={2} id={id} seed={seed} paint={paint} lighting={MORNING_LIGHT} materials={[GARDEN_TIMBER]}>
      <rect width={VIEW_W} height={VIEW_H} fill="#8a5b3a" />
      <DepthLayer depth="far">
        <Window x={410} y={18} width={380} height={260} paint={paint} />
        <path d="M390,260 L280,500 L920,500 L810,260 Z" fill={paint('sunflowerWindowGlow')} opacity={0.28} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-material="timber" filter={paint('sunflower-garden-timber')}>
          {range(6).map((i) => <path key={i} d={`M0,${100 + i * 130} C340,${76 + i * 130} 780,${124 + i * 130} 1200,${88 + i * 130}`} stroke="#5a3929" strokeWidth={10} fill="none" opacity={0.4} />)}
        </g>
      </DepthLayer>
      <DepthLayer depth="focus">
        <Ribbon x1={160} y1={570} x2={1040} y2={552} count={7} bend={74} />
        <LitCharacter id={id} kind="milo" x={500} y={730} scale={0.82} performance={MILO_KNOT} />
        <LitCharacter id={id} kind="rosa" x={790} y={690} scale={0.88} performance={ROSA_OFFER} />
      </DepthLayer>
      <DepthLayer depth="near">
        <g transform="translate(120 700)" data-motif="craft-box">
          <path d="M-100,-48 L86,-66 L112,70 L-82,88 Z" fill="#5c3c2b" />
          <circle cx={-34} cy={-8} r={28} fill="#c4a94c" />
          <circle cx={38} cy={8} r={24} fill="#ae5e72" />
        </g>
        <path d="M980,800 Q1080,690 1200,724 L1200,800 Z" fill="#43322c" />
      </DepthLayer>
    </CinematicPage>
  ),

  'sunflower-04-windy-wobble': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-04-windy-wobble" stage={3} id={id} seed={seed} paint={paint} lighting={BREEZE_LIGHT} materials={[LEAF_MATERIAL]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('sunflowerBreezeSky')} />
      <DepthLayer depth="far">
        <path d="M0,430 C190,386 330,420 490,370 C660,316 804,356 978,310 C1068,286 1138,292 1200,272" stroke="#aeb5a1" strokeWidth={62} fill="none" opacity={0.3} />
        <path d="M80,230 C310,190 540,220 760,172 M420,300 C668,252 882,276 1110,224" stroke="#d6d8c6" strokeWidth={10} fill="none" opacity={0.42} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <Sunflower baseX={650} baseY={780} topX={900} topY={142} headR={72} paint={paint} sway={110} />
        <Ribbon x1={630} y1={610} x2={1050} y2={376} count={4} bend={92} />
        {range(6).map((i) => <ellipse key={i} cx={n(790 + i * 54)} cy={n(250 + (i % 3) * 44)} rx={16} ry={7} fill="#efbd42" transform={`rotate(${i * 23 - 30} ${790 + i * 54} ${250 + (i % 3) * 44})`} />)}
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="milo" x={472} y={736} scale={1.0} performance={MILO_STEADY} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,704 Q130,654 280,710 L342,800 Z" fill="#344039" />
        <path d="M1200,800 L1200,676 Q1128,650 1044,706 L1002,800 Z" fill="#344039" />
      </DepthLayer>
    </CinematicPage>
  ),

  'sunflower-05-teamwork-count': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-05-teamwork-count" stage={4} id={id} seed={seed} paint={paint} lighting={HONEY_LIGHT} materials={[GARDEN_TIMBER, LEAF_MATERIAL]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('sunflowerHoneySky')} />
      <DepthLayer depth="far">
        <Fence y={548} paint={paint} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <Sunflower baseX={620} baseY={770} topX={600} topY={130} headR={76} paint={paint} sway={-8} />
        <Ribbon x1={660} y1={742} x2={642} y2={188} count={11} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="milo" x={392} y={726} scale={0.86} performance={MILO_COUNT} />
        <LitCharacter id={id} kind="rosa" x={812} y={734} scale={0.92} performance={ROSA_HOLD} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,712 Q104,676 226,714 L278,800 Z" fill="#3a3932" />
        <path d="M1200,800 L1200,694 Q1118,664 1036,712 L992,800 Z" fill="#3a3932" />
      </DepthLayer>
    </CinematicPage>
  ),

  'sunflower-06-fourteen-hands': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-06-fourteen-hands" stage={5} id={id} seed={seed} paint={paint} lighting={HONEY_LIGHT} materials={[GARDEN_TIMBER, LEAF_MATERIAL]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('sunflowerHoneySky')} />
      <DepthLayer depth="far">
        <Fence y={580} paint={paint} />
        <path d="M0,470 C210,426 408,458 590,408 C770,358 938,392 1200,330 L1200,580 L0,580 Z" fill="#59634d" opacity={0.42} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <Sunflower baseX={600} baseY={782} topX={600} topY={124} headR={92} paint={paint} sway={-4} />
        <Ribbon x1={654} y1={750} x2={654} y2={192} count={14} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="milo" x={248} y={728} scale={0.9} performance={MILO_CHEER} />
        <LitCharacter id={id} kind="rosa" x={948} y={728} scale={0.94} performance={ROSA_CLAP} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,716 Q118,674 248,718 L304,800 Z" fill="#383630" />
        <path d="M1200,800 L1200,690 Q1120,660 1034,714 L990,800 Z" fill="#383630" />
      </DepthLayer>
    </CinematicPage>
  ),

  'sunflower-07-moonlit-sleep': ({ id, paint, seed }) => (
    <CinematicPage sceneId="sunflower-07-moonlit-sleep" stage={6} id={id} seed={seed} paint={paint} lighting={NIGHT_LIGHT} materials={[LEAF_MATERIAL, BED_MATERIAL]} calm>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('sunflowerNightSky')} />
      <DepthLayer depth="far">
        <StarField seed={seed} count={48} x={520} y={20} width={660} height={430} color="#d4e0f0" minR={0.7} maxR={2.1} />
        <Window x={600} y={48} width={530} height={500} paint={paint} night />
        <Moon cx={930} cy={154} r={70} glow={paint('sunflowerMoonGlow')} face="#f2efda" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <path d="M560,800 L560,540 L1200,540 L1200,800 Z" fill="#151d33" />
        <Sunflower baseX={780} baseY={548} topX={812} topY={166} headR={56} paint={paint} sway={12} night />
      </DepthLayer>
      <DepthLayer depth="focus">
        <Bed paint={paint} />
        <LitCharacter id={id} kind="milo" x={260} y={676} scale={0.82} performance={MILO_SLEEP} />
        <g data-motif="sleep-cue" fill="#cbd6ee" opacity={0.62}>
          {range(5).map((i) => <circle key={i} cx={n(370 + i * 34)} cy={n(500 - i * 34)} r={n(10 - i * 1.4)} />)}
        </g>
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M32,800 L32,704 Q238,632 568,710 L568,800 Z" fill="#343767" opacity={0.88} />
        <path d="M560,800 Q830,730 1200,712 L1200,800 Z" fill="#0f1628" />
      </DepthLayer>
    </CinematicPage>
  ),
};

export const sunflowerWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
