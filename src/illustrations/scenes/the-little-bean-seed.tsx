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

const SAM: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#d99565', shadow: '#91573c', highlight: '#efb180' },
  face: { shape: 'round', brow: '#40251a', mouth: '#743a3b' },
  hair: { style: 'short', base: '#4b2c1c', highlight: '#78503a', volume: 0.56 },
  wardrobe: {
    garment: 'tunic',
    base: '#5f9ea7',
    shadow: '#376b78',
    trim: '#e2b96b',
    hemline: 0.48,
  },
  footwear: { style: 'barefoot', base: '#8b5639' },
  secondaryShapes: [{ kind: 'belt', color: '#8b6038', accent: '#ebc47e' }],
};

const NANA: CharacterAppearance = {
  ...defaultAppearance('elder'),
  skin: { base: '#c9825c', shadow: '#875039', highlight: '#e5ad85' },
  face: { shape: 'heart', brow: '#725f55', mouth: '#743d4b' },
  hair: { style: 'bun', base: '#d8d0c1', highlight: '#f7f0e4', volume: 0.52 },
  wardrobe: {
    garment: 'dress',
    base: '#a85f7a',
    shadow: '#6d3c5c',
    trim: '#e5bd76',
    hemline: 0.82,
  },
  footwear: { style: 'sandal', base: '#5d3b2a' },
  secondaryShapes: [{ kind: 'necklace', color: '#d7aa61', accent: '#f2d696' }],
};

const WARM_TIMBER: MaterialInstance = {
  id: 'bean-warm-timber',
  preset: 'timber',
  base: '#8a5a39',
  shadow: '#4c3126',
  highlight: '#c78b55',
  textureScale: 1.15,
  roughness: 0.68,
};

const SOFT_LEAF: MaterialInstance = {
  id: 'bean-soft-leaf',
  preset: 'cloth',
  base: '#4f8f49',
  shadow: '#244f31',
  highlight: '#9dca75',
  textureScale: 0.74,
  roughness: 0.58,
};

const BED_CLOTH: MaterialInstance = {
  id: 'bean-bed-cloth',
  preset: 'cloth',
  base: '#6874a2',
  shadow: '#30395f',
  highlight: '#a7b0d5',
  textureScale: 0.94,
  roughness: 0.7,
};

const KITCHEN_LIGHT: LightingRig = {
  key: { azimuth: -34, elevation: 46, color: '#ffd79d', intensity: 0.82 },
  fill: { color: '#7899ad', intensity: 0.2 },
  rim: { azimuth: 146, elevation: 30, color: '#f3c58e', intensity: 0.34 },
  practicals: [
    { id: 'bean-kitchen-practical', x: 1020, y: 130, radius: 360, color: '#ffd17f', intensity: 0.48 },
  ],
};

const WINDOW_LIGHT: LightingRig = {
  key: { azimuth: -44, elevation: 52, color: '#ffe0a6', intensity: 0.72 },
  fill: { color: '#7291aa', intensity: 0.22 },
  rim: { azimuth: 138, elevation: 34, color: '#efd19b', intensity: 0.3 },
  practicals: [
    { id: 'bean-window-practical', x: 170, y: 150, radius: 330, color: '#ffe3a0', intensity: 0.42 },
  ],
};

const MUTED_LIGHT: LightingRig = {
  key: { azimuth: -28, elevation: 38, color: '#e5bd8d', intensity: 0.58 },
  fill: { color: '#68819d', intensity: 0.26 },
  rim: { azimuth: 152, elevation: 26, color: '#d6b589', intensity: 0.26 },
  practicals: [
    { id: 'bean-muted-practical', x: 1040, y: 190, radius: 300, color: '#d9b070', intensity: 0.3 },
  ],
};

const DUSK_LIGHT: LightingRig = {
  key: { azimuth: -18, elevation: 30, color: '#e9b06f', intensity: 0.62 },
  fill: { color: '#58768d', intensity: 0.24 },
  rim: { azimuth: 158, elevation: 24, color: '#f0ca8c', intensity: 0.3 },
  practicals: [
    { id: 'bean-dusk-practical', x: 1050, y: 220, radius: 330, color: '#e5a75f', intensity: 0.34 },
  ],
};

const MOON_LIGHT: LightingRig = {
  key: { azimuth: -52, elevation: 58, color: '#aec8e3', intensity: 0.56 },
  fill: { color: '#425d7c', intensity: 0.18 },
  rim: { azimuth: 142, elevation: 36, color: '#d5deef', intensity: 0.32 },
  practicals: [
    { id: 'bean-moon-practical', x: 900, y: 170, radius: 190, color: '#e9eddb', intensity: 0.48 },
  ],
};

const SAM_WAIT: CharacterPerformance = {
  pose: 'kneel',
  lineOfAction: -8,
  shoulderTilt: 10,
  pelvisTilt: -5,
  weightFoot: 'left',
  gazeTarget: { x: 790, y: 520 },
  headTurn: 0.72,
  expression: 'uncertain',
  leftHand: 'rest',
  rightHand: 'rest',
};

const SAM_WORRIED: CharacterPerformance = {
  pose: 'stand',
  lineOfAction: -10,
  shoulderTilt: 11,
  pelvisTilt: -6,
  weightFoot: 'left',
  gazeTarget: { x: 320, y: 520 },
  headTurn: -0.58,
  expression: 'concerned',
  leftHand: 'hold',
  rightHand: 'rest',
  leftHandTarget: { x: 355, y: 555 },
};

const NANA_COMFORT: CharacterPerformance = {
  pose: 'kneel',
  lineOfAction: 8,
  shoulderTilt: -12,
  pelvisTilt: 6,
  weightFoot: 'right',
  gazeTarget: { x: 420, y: 510 },
  headTurn: 0.62,
  expression: 'calm',
  leftHand: 'hold',
  rightHand: 'open',
  leftHandTarget: { x: 390, y: 565 },
  rightHandTarget: { x: 545, y: 500 },
};

const SAM_DISCOVER: CharacterPerformance = {
  pose: 'reach',
  lineOfAction: 12,
  shoulderTilt: -10,
  pelvisTilt: 6,
  weightFoot: 'right',
  gazeTarget: { x: 510, y: 465 },
  headTurn: -0.68,
  expression: 'delighted',
  leftHand: 'open',
  rightHand: 'open',
  leftHandTarget: { x: 640, y: 430 },
  rightHandTarget: { x: 790, y: 420 },
};

const SAM_MEASURE: CharacterPerformance = {
  pose: 'point',
  lineOfAction: -7,
  shoulderTilt: 12,
  pelvisTilt: -7,
  weightFoot: 'left',
  gazeTarget: { x: 560, y: 250 },
  headTurn: -0.72,
  expression: 'delighted',
  leftHand: 'point',
  rightHand: 'open',
  leftHandTarget: { x: 590, y: 370 },
  rightHandTarget: { x: 790, y: 460 },
};

const SAM_SLEEP: CharacterPerformance = {
  pose: 'sleep',
  lineOfAction: 0,
  shoulderTilt: 0,
  pelvisTilt: 0,
  weightFoot: 'center',
  gazeTarget: { x: 900, y: 170 },
  headTurn: 0.18,
  expression: 'sleeping',
  leftHand: 'rest',
  rightHand: 'rest',
};

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient id={id('beanKitchenSky')} stops={[
        { offset: 0, color: '#6f6278' },
        { offset: 0.58, color: '#c98769' },
        { offset: 1, color: '#efc37f' },
      ]} />
      <LinearGradient id={id('beanWindowSky')} stops={[
        { offset: 0, color: '#8094a0' },
        { offset: 0.58, color: '#d0b184' },
        { offset: 1, color: '#e7c27d' },
      ]} />
      <LinearGradient id={id('beanMutedSky')} stops={[
        { offset: 0, color: '#667284' },
        { offset: 0.62, color: '#9c8c7e' },
        { offset: 1, color: '#c8a16f' },
      ]} />
      <LinearGradient id={id('beanDuskSky')} stops={[
        { offset: 0, color: '#4b536d' },
        { offset: 0.58, color: '#987067' },
        { offset: 1, color: '#d39a61' },
      ]} />
      <LinearGradient id={id('beanNightSky')} stops={[
        { offset: 0, color: '#080f24' },
        { offset: 0.6, color: '#17284a' },
        { offset: 1, color: '#2d3d61' },
      ]} />
      <LinearGradient id={id('beanTimber')} stops={[
        { offset: 0, color: '#a46d43' },
        { offset: 1, color: '#513528' },
      ]} />
      <LinearGradient id={id('beanPot')} stops={[
        { offset: 0, color: '#d78155' },
        { offset: 0.6, color: '#ae5538' },
        { offset: 1, color: '#693423' },
      ]} />
      <LinearGradient id={id('beanBed')} stops={[
        { offset: 0, color: '#7884b1' },
        { offset: 1, color: '#343d67' },
      ]} />
      <RadialGradient id={id('beanMoonGlow')} stops={[
        { offset: 0, color: '#f2f0da', opacity: 0.86 },
        { offset: 1, color: '#f2f0da', opacity: 0 },
      ]} />
      <RadialGradient id={id('beanVignette')} stops={[
        { offset: 0.58, color: '#000000', opacity: 0 },
        { offset: 1, color: '#120d17', opacity: 0.42 },
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
      <Vignette paint={paint('beanVignette')} />
    </g>
  );
}

function Bean({
  cx,
  cy,
  scale = 1,
}: {
  cx: number;
  cy: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${n(cx)} ${n(cy)}) scale(${n(scale)}) rotate(-12)`} data-motif="bean">
      <path d="M-62,0 C-58,-42 -18,-56 22,-42 C64,-28 74,12 48,42 C22,70 -30,58 -54,30 C-64,18 -66,8 -62,0 Z" fill="#7c432a" />
      <path d="M-28,-32 C8,-48 42,-22 50,8" stroke="#b87348" strokeWidth={10} fill="none" opacity={0.58} strokeLinecap="round" />
      <ellipse cx={-28} cy={4} rx={8} ry={24} fill="#efd7ad" transform="rotate(12 -28 4)" />
      <path d="M38,-16 Q62,2 40,30" stroke="#e0a16e" strokeWidth={4} fill="none" opacity={0.72} data-lighting="key" />
      <path d="M-52,18 Q-28,50 10,50" stroke="#607f95" strokeWidth={5} fill="none" opacity={0.38} data-lighting="fill" />
      <path d="M-44,-26 Q-6,-56 26,-38" stroke="#f4c493" strokeWidth={3} fill="none" opacity={0.68} data-lighting="rim" />
    </g>
  );
}

function OpenPalm({
  x,
  y,
  scale = 1,
  rotate = 0,
  fill = '#efb180',
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  fill?: string;
}) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(rotate)}) scale(${n(scale)})`}>
      <path
        d="M-118,24 C-112,-34 -70,-72 -18,-72 C30,-74 82,-46 112,-2 C132,28 116,70 74,84 C18,102 -62,90 -102,62 C-116,52 -122,38 -118,24 Z"
        fill={fill}
      />
      <path d="M-88,-32 C-112,-82 -88,-118 -60,-94 L-42,-58 M-38,-58 C-48,-120 -12,-138 8,-82 L18,-54 M28,-54 C30,-116 66,-126 74,-68 L72,-42 M80,-34 C98,-86 130,-78 122,-28 L108,10" fill="none" stroke={fill} strokeWidth={28} strokeLinecap="round" />
      <path d="M-80,28 Q-10,64 72,30" stroke="#9b6144" strokeWidth={4} fill="none" opacity={0.32} strokeLinecap="round" />
    </g>
  );
}

function Pot({
  x,
  y,
  scale = 1,
  paint,
}: {
  x: number;
  y: number;
  scale?: number;
  paint: SceneWorldProps['paint'];
}) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} data-motif="pot" data-material="terracotta">
      <ellipse cx={0} cy={-58} rx={112} ry={32} fill="#e09063" />
      <path d="M-104,-56 L-76,94 Q0,126 76,94 L104,-56 Z" fill={paint('beanPot')} />
      <ellipse cx={0} cy={-54} rx={88} ry={22} fill="#302016" />
      <path d="M-88,-22 Q-18,16 66,-4" stroke="#f2aa77" strokeWidth={10} fill="none" opacity={0.4} data-lighting="key" />
      <path d="M62,-42 Q88,26 56,84" stroke="#6f8da3" strokeWidth={12} fill="none" opacity={0.3} data-lighting="fill" />
      <path d="M-98,-50 Q-56,-72 -10,-70" stroke="#f3c18f" strokeWidth={5} fill="none" opacity={0.62} data-lighting="rim" />
    </g>
  );
}

function Soil({
  cx,
  cy,
  rx,
  ry,
  seed,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  seed: number;
}) {
  return (
    <g data-material="soil">
      <ellipse cx={n(cx)} cy={n(cy)} rx={n(rx)} ry={n(ry)} fill="#322117" />
      {range(18).map((i) => {
        const px = n(cx - rx * 0.75 + ((i * 83 + seed) % 150) / 100 * rx);
        const py = n(cy - ry * 0.45 + ((i * 47 + seed) % 90) / 100 * ry);
        return <circle key={i} cx={px} cy={py} r={n(3 + (i % 4))} fill={i % 2 ? '#674530' : '#1b120d'} opacity={0.72} />;
      })}
    </g>
  );
}

function Roots({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} data-motif="root" fill="none" strokeLinecap="round">
      <path d="M0,0 C-8,54 0,116 -8,190" stroke="#ead7ad" strokeWidth={9} />
      <path d="M-4,46 C-54,72 -84,106 -106,150 M0,78 C48,104 72,136 84,180 M-6,118 C-46,146 -58,176 -66,212 M4,30 C38,46 64,70 88,104" stroke="#d8c59d" strokeWidth={5} />
      <path d="M0,0 C-8,54 0,116 -8,190" stroke="#fff0c8" strokeWidth={3} opacity={0.7} data-lighting="rim" />
    </g>
  );
}

function Sprout({ x, y, scale = 1, paint }: { x: number; y: number; scale?: number; paint: SceneWorldProps['paint'] }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} data-motif="sprout" data-material="leaf" filter={paint('bean-soft-leaf')}>
      <path d="M0,0 C-30,-42 -26,-96 14,-100 C52,-102 62,-54 22,-26" stroke="#9bcf70" strokeWidth={18} fill="none" strokeLinecap="round" />
      <Leaf x={8} y={-28} length={70} width={42} angle={-36} fill="#75ac57" vein="#d9eba0" />
      <path d="M-4,-4 C-20,-48 -14,-84 16,-92" stroke="#e2efad" strokeWidth={4} fill="none" opacity={0.76} data-lighting="key" />
      <path d="M22,-24 Q54,-52 70,-46" stroke="#6e92a8" strokeWidth={5} fill="none" opacity={0.4} data-lighting="fill" />
      <path d="M-10,-10 Q-34,-54 -14,-88" stroke="#eef1c4" strokeWidth={3} fill="none" opacity={0.68} data-lighting="rim" />
    </g>
  );
}

function Vine({
  x,
  baseY,
  height,
  paint,
  night = false,
}: {
  x: number;
  baseY: number;
  height: number;
  paint: SceneWorldProps['paint'];
  night?: boolean;
}) {
  const stem = night ? '#203a3b' : '#4d8c48';
  const leaf = night ? '#274940' : '#629d55';
  const top = baseY - height;
  return (
    <g
      className="scene-vine"
      data-motif="stem"
      data-material="leaf"
      filter={paint('bean-soft-leaf')}
    >
      <path d={`M${x + 20},${baseY + 34} L${x + 18},${top - 34}`} stroke={night ? '#303d4a' : '#765238'} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${x},${baseY} C${x - 48},${baseY - height * 0.28} ${x + 54},${baseY - height * 0.52} ${x + 6},${baseY - height * 0.72} C${x - 24},${baseY - height * 0.88} ${x + 28},${top + 18} ${x + 6},${top}`} stroke={stem} strokeWidth={16} fill="none" strokeLinecap="round" />
      <Leaf x={x - 10} y={baseY - height * 0.36} length={118} width={72} angle={-58} fill={leaf} vein={stem} />
      <Leaf x={x + 32} y={baseY - height * 0.58} length={126} width={76} angle={54} fill={night ? '#1d3834' : '#3f7b42'} vein={stem} />
      <Leaf x={x + 2} y={top + height * 0.14} length={88} width={52} angle={-42} fill={leaf} vein={stem} />
      <path d={`M${x - 6},${baseY - height * 0.12} C${x - 42},${baseY - height * 0.4} ${x + 34},${baseY - height * 0.68} ${x + 4},${top + 8}`} stroke={night ? '#8faab1' : '#d7dd91'} strokeWidth={4} fill="none" opacity={0.56} data-lighting="key" />
      <path d={`M${x + 22},${baseY - height * 0.22} C${x + 60},${baseY - height * 0.48} ${x + 2},${baseY - height * 0.76} ${x + 18},${top + 26}`} stroke="#688ba0" strokeWidth={6} fill="none" opacity={0.32} data-lighting="fill" />
      <path d={`M${x - 16},${baseY - height * 0.28} C${x - 54},${baseY - height * 0.52} ${x + 26},${baseY - height * 0.78} ${x - 2},${top + 12}`} stroke={night ? '#d5deef' : '#f0d19a'} strokeWidth={3} fill="none" opacity={0.64} data-lighting="rim" />
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
  kind: 'sam' | 'nana';
  x: number;
  y: number;
  scale: number;
  performance: CharacterPerformance;
}) {
  const appearance = kind === 'sam' ? SAM : NANA;
  const geometry = resolvePoseGeometry(appearance, performance, { x, y, scale });
  const rendered = foreshortenGeometry(geometry);
  const hr = appearance.proportions.headRadius * scale;
  return (
    <g data-character-lighting="bean" data-character={kind}>
      <CinematicCharacter
        id={(part) => id(`${kind}-${part}`)}
        x={x}
        y={y}
        scale={scale}
        appearance={appearance}
        performance={performance}
        className={`scene-${kind}`}
      />
      <path d={`M${n(geometry.head.x - hr * 0.86)},${n(geometry.head.y - hr * 0.04)} Q${n(geometry.head.x - hr * 0.62)},${n(geometry.head.y - hr * 0.72)} ${n(geometry.head.x - hr * 0.08)},${n(geometry.head.y - hr * 0.9)} M${n(geometry.shoulder.left.x)},${n(geometry.shoulder.left.y)} L${n(rendered.elbow.left.x)},${n(rendered.elbow.left.y)}`} stroke="#f3c18e" strokeWidth={n(4.4 * scale)} fill="none" strokeLinecap="round" opacity={0.72} data-lighting="key" />
      <path d={`M${n(geometry.head.x + hr * 0.78)},${n(geometry.head.y + hr * 0.14)} Q${n(geometry.head.x + hr * 0.5)},${n(geometry.head.y + hr * 0.72)} ${n(geometry.head.x + hr * 0.04)},${n(geometry.head.y + hr * 0.86)} M${n(geometry.shoulder.right.x)},${n(geometry.shoulder.right.y + 5)} L${n(geometry.hip.right.x)},${n(geometry.hip.right.y + 12)}`} stroke="#7799b0" strokeWidth={n(6 * scale)} fill="none" strokeLinecap="round" opacity={0.38} data-lighting="fill" />
      <path d={`M${n(geometry.head.x + hr * 0.9)},${n(geometry.head.y - hr * 0.12)} Q${n(geometry.head.x + hr * 0.7)},${n(geometry.head.y - hr * 0.7)} ${n(geometry.head.x + hr * 0.18)},${n(geometry.head.y - hr * 0.9)} M${n(geometry.shoulder.right.x)},${n(geometry.shoulder.right.y)} L${n(rendered.elbow.right.x)},${n(rendered.elbow.right.y)}`} stroke="#efd09a" strokeWidth={n(2.8 * scale)} fill="none" strokeLinecap="round" opacity={0.62} data-lighting="rim" />
    </g>
  );
}

function Window({ x, y, width, height, night = false }: { x: number; y: number; width: number; height: number; night?: boolean }) {
  return (
    <g data-motif="window">
      <rect x={x} y={y} width={width} height={height} rx={16} fill={night ? '#111b35' : '#ddbd83'} />
      <rect x={x + 22} y={y + 22} width={width - 44} height={height - 44} fill={night ? '#172848' : '#c6d0b3'} />
      <path d={`M${x + width / 2},${y + 20} V${y + height - 20} M${x + 20},${y + height / 2} H${x + width - 20}`} stroke={night ? '#405070' : '#9b764e'} strokeWidth={10} />
    </g>
  );
}

function Bed({ paint }: { paint: SceneWorldProps['paint'] }) {
  return (
    <g data-material="cloth" filter={paint('bean-bed-cloth')}>
      <rect x={34} y={560} width={520} height={188} rx={30} fill="#4a527d" />
      <ellipse cx={174} cy={578} rx={110} ry={48} fill="#d8dced" />
      <path d="M42,700 L42,630 Q210,570 548,646 L548,770 L42,770 Z" fill={paint('beanBed')} />
      <path d="M58,646 Q230,602 522,662" stroke="#aab3d6" strokeWidth={8} fill="none" opacity={0.42} data-lighting="key" />
      <path d="M46,710 Q250,658 536,714" stroke="#49627f" strokeWidth={14} fill="none" opacity={0.36} data-lighting="fill" />
      <path d="M52,620 Q226,574 524,648" stroke="#d8ddec" strokeWidth={4} fill="none" opacity={0.58} data-lighting="rim" />
    </g>
  );
}

const PAGES: Record<string, (props: SceneWorldProps) => ReactNode> = {
  'bean-01-seed-in-palm': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-01-seed-in-palm" stage={0} id={id} seed={seed} paint={paint} lighting={KITCHEN_LIGHT} materials={[WARM_TIMBER]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanKitchenSky')} />
      <DepthLayer depth="far">
        <Window x={74} y={70} width={330} height={300} />
        <path d="M420,360 C650,310 920,328 1200,250 L1200,500 L420,500 Z" fill="#815e54" opacity={0.5} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-material="timber" filter={paint('bean-warm-timber')}>
          <path d="M0,488 C280,448 642,478 1200,420 L1200,800 L0,800 Z" fill={paint('beanTimber')} />
          <path d="M40,612 C320,570 680,600 1130,542" stroke="#d09a63" strokeWidth={12} opacity={0.36} fill="none" />
        </g>
      </DepthLayer>
      <DepthLayer depth="focus">
        <OpenPalm x={600} y={500} scale={1.45} />
        <Bean cx={600} cy={438} scale={1.15} />
      </DepthLayer>
      <DepthLayer depth="near">
        <OpenPalm x={240} y={650} scale={0.92} rotate={-28} fill="#c9825c" />
        <OpenPalm x={980} y={652} scale={0.92} rotate={208} fill="#c9825c" />
      </DepthLayer>
    </CinematicPage>
  ),

  'bean-02-planting-pot': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-02-planting-pot" stage={1} id={id} seed={seed} paint={paint} lighting={KITCHEN_LIGHT} materials={[WARM_TIMBER]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanTimber')} />
      <DepthLayer depth="far">
        <g data-material="timber" filter={paint('bean-warm-timber')}>
          {range(5).map((i) => <path key={i} d={`M0,${100 + i * 150} C340,${74 + i * 150} 780,${126 + i * 150} 1200,${90 + i * 150}`} stroke="#5a3929" strokeWidth={9} fill="none" opacity={0.38} />)}
        </g>
      </DepthLayer>
      <DepthLayer depth="mid">
        <Pot x={600} y={510} scale={1.65} paint={paint} />
        <Soil cx={600} cy={416} rx={140} ry={42} seed={seed} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <Bean cx={570} cy={402} scale={0.68} />
        <OpenPalm x={410} y={230} scale={0.72} rotate={138} />
        <path d="M402,218 Q486,310 548,386" stroke="#ffd19b" strokeWidth={7} fill="none" opacity={0.68} data-lighting="key" />
        <path d="M430,232 Q508,320 564,390" stroke="#7698ae" strokeWidth={10} fill="none" opacity={0.32} data-lighting="fill" />
        <path d="M388,208 Q456,274 516,350" stroke="#f0c894" strokeWidth={3} fill="none" opacity={0.6} data-lighting="rim" />
      </DepthLayer>
      <DepthLayer depth="near">
        <g transform="translate(1010 170) rotate(-18)" data-motif="watering-can">
          <path d="M-92,20 Q-86,-54 0,-64 Q86,-54 92,20 L72,100 L-72,100 Z" fill="#6fa9c8" />
          <path d="M80,-10 Q154,-26 196,8" stroke="#8fc4d7" strokeWidth={28} fill="none" strokeLinecap="round" />
          <path d="M-70,-10 Q-134,-4 -126,64 Q-114,108 -64,84" stroke="#4e829f" strokeWidth={22} fill="none" />
          <path d="M164,18 C136,78 106,116 82,148" stroke="#9bd3e5" strokeWidth={8} strokeDasharray="2 22" fill="none" data-lighting="rim" />
        </g>
      </DepthLayer>
    </CinematicPage>
  ),

  'bean-03-sunny-sill': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-03-sunny-sill" stage={2} id={id} seed={seed} paint={paint} lighting={WINDOW_LIGHT} materials={[WARM_TIMBER]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanWindowSky')} />
      <DepthLayer depth="far">
        <Window x={60} y={54} width={430} height={350} />
        <path d="M72,324 C224,270 354,310 466,244" stroke="#7a8d72" strokeWidth={64} fill="none" opacity={0.42} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-material="timber" filter={paint('bean-warm-timber')}>
          <path d="M0,594 C318,548 706,592 1200,526 L1200,800 L0,800 Z" fill="#6f4935" />
          <path d="M0,574 C342,536 734,566 1200,508" stroke="#c8925d" strokeWidth={26} />
        </g>
        <Pot x={818} y={560} scale={1.12} paint={paint} />
        <Soil cx={818} cy={496} rx={88} ry={24} seed={seed} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="sam" x={370} y={730} scale={0.96} performance={SAM_WAIT} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,724 Q122,676 248,724 L302,800 Z" fill="#45332f" />
        <path d="M1200,800 L1200,690 Q1120,660 1046,710 L1010,800 Z" fill="#45332f" />
      </DepthLayer>
    </CinematicPage>
  ),

  'bean-04-worried-wait': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-04-worried-wait" stage={3} id={id} seed={seed} paint={paint} lighting={MUTED_LIGHT} materials={[]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanMutedSky')} />
      <DepthLayer depth="far">
        <Window x={770} y={70} width={350} height={250} />
        <path d="M0,500 C270,450 540,488 760,430 L760,800 L0,800 Z" fill="#6e5b54" opacity={0.72} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g transform="translate(820 410)">
          <Pot x={0} y={0} scale={1.28} paint={paint} />
          <path d="M-126,-54 L-96,158 Q0,208 96,158 L126,-54 Q0,-22 -126,-54 Z" fill="#162039" opacity={0.88} />
          <Soil cx={0} cy={-54} rx={104} ry={30} seed={seed} />
          <Roots x={0} y={-30} scale={0.9} />
        </g>
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="nana" x={292} y={724} scale={0.82} performance={NANA_COMFORT} />
        <LitCharacter id={id} kind="sam" x={478} y={724} scale={0.78} performance={SAM_WORRIED} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,700 C210,670 444,724 650,682 L728,800 Z" fill="#392b31" />
        <path d="M720,800 Q900,734 1200,716 L1200,800 Z" fill="#111827" opacity={0.72} />
      </DepthLayer>
    </CinematicPage>
  ),

  'bean-05-first-sprout': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-05-first-sprout" stage={4} id={id} seed={seed} paint={paint} lighting={MUTED_LIGHT} materials={[SOFT_LEAF]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanMutedSky')} />
      <DepthLayer depth="far">
        <Window x={72} y={54} width={400} height={286} />
        <path d="M0,480 C280,432 516,470 716,422 L716,700 L0,700 Z" fill="#665a54" opacity={0.62} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <LitCharacter id={id} kind="sam" x={880} y={744} scale={1.02} performance={SAM_DISCOVER} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <Pot x={500} y={610} scale={1.45} paint={paint} />
        <Soil cx={500} cy={526} rx={122} ry={34} seed={seed} />
        <Sprout x={500} y={514} scale={1.3} paint={paint} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,664 C250,620 520,690 776,642 L852,800 Z" fill="#211712" />
        <path d="M1000,800 Q1090,708 1200,730 L1200,800 Z" fill="#3b3032" />
      </DepthLayer>
    </CinematicPage>
  ),

  'bean-06-climbing-stem': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-06-climbing-stem" stage={5} id={id} seed={seed} paint={paint} lighting={DUSK_LIGHT} materials={[WARM_TIMBER, SOFT_LEAF]}>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanDuskSky')} />
      <DepthLayer depth="far">
        <Window x={62} y={54} width={430} height={322} />
        <path d="M70,326 C220,278 344,310 458,252" stroke="#4f6b57" strokeWidth={72} fill="none" opacity={0.46} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-material="timber" filter={paint('bean-warm-timber')}>
          <path d="M0,650 C342,590 716,632 1200,560 L1200,800 L0,800 Z" fill="#554238" />
          <path d="M0,624 C366,580 756,608 1200,540" stroke="#a97850" strokeWidth={24} />
        </g>
        <Pot x={520} y={632} scale={1.28} paint={paint} />
        <Soil cx={520} cy={558} rx={106} ry={30} seed={seed} />
        <Vine x={520} baseY={560} height={430} paint={paint} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter id={id} kind="sam" x={864} y={732} scale={0.9} performance={SAM_MEASURE} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,720 Q116,680 232,720 L286,800 Z" fill="#332b30" />
        <path d="M1200,800 L1200,686 Q1124,660 1046,708 L1000,800 Z" fill="#332b30" />
      </DepthLayer>
    </CinematicPage>
  ),

  'bean-07-moonlit-plant': ({ id, paint, seed }) => (
    <CinematicPage sceneId="bean-07-moonlit-plant" stage={6} id={id} seed={seed} paint={paint} lighting={MOON_LIGHT} materials={[SOFT_LEAF, BED_CLOTH]} calm>
      <rect width={VIEW_W} height={VIEW_H} fill={paint('beanNightSky')} />
      <DepthLayer depth="far">
        <StarField seed={seed} count={44} x={520} y={20} width={650} height={420} color="#cddcf2" minR={0.7} maxR={2.2} />
        <Window x={620} y={46} width={500} height={500} night />
        <Moon cx={900} cy={166} r={74} glow={paint('beanMoonGlow')} face="#f2f0da" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <path d="M560,800 L560,540 L1200,540 L1200,800 Z" fill="#172036" />
        <Pot x={864} y={612} scale={1.06} paint={paint} />
        <Vine x={864} baseY={552} height={300} paint={paint} night />
      </DepthLayer>
      <DepthLayer depth="focus">
        <Bed paint={paint} />
        <LitCharacter id={id} kind="sam" x={260} y={676} scale={0.82} performance={SAM_SLEEP} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M32,800 L32,704 Q230,634 554,708 L554,800 Z" fill="#30395f" opacity={0.88} />
        <path d="M560,800 Q820,730 1200,712 L1200,800 Z" fill="#10172a" />
      </DepthLayer>
    </CinematicPage>
  ),
};

export const beanWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
