import type { ReactNode } from 'react';
import {
  LinearGradient,
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
  type CharacterAppearance,
  type CharacterPerformance,
  type LightingRig,
  type MaterialInstance,
} from '../cinematic';

type Paint = SceneWorldProps['paint'];

const RED = '#bd433c';
const BLUE = '#356faa';
const GOLD = '#d8a23f';
const GREEN = '#4f8d68';
const VIOLET = '#765b9a';

const PIP: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#d99667', shadow: '#955f42', highlight: '#f1bb8e' },
  face: { shape: 'round', brow: '#5c3521', mouth: '#7e3f46' },
  hair: { style: 'short', base: '#6b3d24', highlight: '#a9683c', volume: 0.62 },
  wardrobe: {
    garment: 'tunic',
    base: '#5f91b5',
    shadow: '#3b6285',
    trim: '#d9ba6f',
    hemline: 0.46,
  },
  footwear: { style: 'boot', base: '#42342e' },
  secondaryShapes: [{ kind: 'belt', color: '#745238', accent: '#e2bc73' }],
};

const ADA: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#8f5a43', shadow: '#5d382d', highlight: '#bd8062' },
  face: { shape: 'heart', brow: '#2e1d18', mouth: '#6d3840' },
  hair: { style: 'bun', base: '#2e1d18', highlight: '#5c392e', volume: 0.66 },
  wardrobe: {
    garment: 'dress',
    base: '#c86761',
    shadow: '#85413f',
    trim: '#e5b56c',
    hemline: 0.64,
  },
  footwear: { style: 'boot', base: '#3a2d29' },
  secondaryShapes: [{ kind: 'sash', color: '#8b4b4d', accent: '#efbd76' }],
};

const GRANDPA: CharacterAppearance = {
  ...defaultAppearance('elder'),
  skin: { base: '#c98f68', shadow: '#895c44', highlight: '#e4b391' },
  face: { shape: 'oval', brow: '#e5ded2', mouth: '#744147' },
  hair: { style: 'wispy', base: '#e5ded2', highlight: '#fff9ea', volume: 0.34 },
  wardrobe: {
    garment: 'robe',
    base: '#697d7f',
    shadow: '#455759',
    trim: '#b9c8bf',
    hemline: 0.88,
  },
  footwear: { style: 'slipper', base: '#3d3937' },
  secondaryShapes: [],
};

const MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'porch-timber',
    preset: 'timber',
    base: '#9b6038',
    shadow: '#4f3126',
    highlight: '#d69a60',
    textureScale: 1.08,
    roughness: 0.64,
  },
  {
    id: 'button-sheen',
    preset: 'metal',
    base: '#8b745a',
    shadow: '#302d31',
    highlight: '#fff0be',
    textureScale: 0.34,
    roughness: 0.28,
  },
  {
    id: 'soft-cloth',
    preset: 'cloth',
    base: '#777aa9',
    shadow: '#42466f',
    highlight: '#c2c8e7',
    textureScale: 0.86,
    roughness: 0.76,
  },
];

const LIGHTING: Record<string, LightingRig> = {
  'golden-1': {
    key: { azimuth: -30, elevation: 42, color: '#ffd39a', intensity: 0.78 },
    fill: { color: '#7893a4', intensity: 0.18 },
    rim: { azimuth: 146, elevation: 28, color: '#f2b66e', intensity: 0.24 },
    practicals: [{ id: 'pattern-practical', x: 1040, y: 118, radius: 260, color: '#ffc46f', intensity: 0.48 }],
  },
  'golden-2': {
    key: { azimuth: -34, elevation: 39, color: '#ffcd8d', intensity: 0.74 },
    fill: { color: '#718da2', intensity: 0.2 },
    rim: { azimuth: 150, elevation: 27, color: '#efae68', intensity: 0.25 },
    practicals: [{ id: 'pattern-practical', x: 1020, y: 132, radius: 250, color: '#ffbd69', intensity: 0.46 }],
  },
  'dusk-3': {
    key: { azimuth: -38, elevation: 36, color: '#f8bd7e', intensity: 0.68 },
    fill: { color: '#69859e', intensity: 0.22 },
    rim: { azimuth: 152, elevation: 26, color: '#eaa563', intensity: 0.26 },
    practicals: [{ id: 'pattern-practical', x: 1000, y: 150, radius: 244, color: '#f4aa5f', intensity: 0.42 }],
  },
  'dusk-4': {
    key: { azimuth: -42, elevation: 34, color: '#eeb073', intensity: 0.62 },
    fill: { color: '#617e9b', intensity: 0.25 },
    rim: { azimuth: 154, elevation: 25, color: '#e49f61', intensity: 0.27 },
    practicals: [{ id: 'pattern-practical', x: 990, y: 158, radius: 238, color: '#eaa35f', intensity: 0.4 }],
  },
  'gloaming-5': {
    key: { azimuth: -46, elevation: 32, color: '#e6a56d', intensity: 0.58 },
    fill: { color: '#5b7695', intensity: 0.26 },
    rim: { azimuth: 156, elevation: 24, color: '#e3a465', intensity: 0.28 },
    practicals: [{ id: 'pattern-practical', x: 980, y: 170, radius: 232, color: '#e8a45f', intensity: 0.44 }],
  },
  'night-6': {
    key: { azimuth: -50, elevation: 34, color: '#d99d66', intensity: 0.5 },
    fill: { color: '#526f8f', intensity: 0.24 },
    rim: { azimuth: 140, elevation: 28, color: '#e5b16b', intensity: 0.22 },
    practicals: [{ id: 'pattern-practical', x: 176, y: 160, radius: 250, color: '#ffc870', intensity: 0.56 }],
  },
  'night-7': {
    key: { azimuth: -58, elevation: 44, color: '#a9c4dd', intensity: 0.36 },
    fill: { color: '#4b6280', intensity: 0.16 },
    rim: { azimuth: 132, elevation: 28, color: '#d4a664', intensity: 0.14 },
    practicals: [{ id: 'pattern-practical', x: 1020, y: 558, radius: 190, color: '#e8aa66', intensity: 0.28 }],
  },
};

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient id={id('sky-golden-1')} stops={[
        { offset: 0, color: '#678092' },
        { offset: 0.5, color: '#dda06d' },
        { offset: 1, color: '#f4cf8b' },
      ]} />
      <LinearGradient id={id('sky-golden-2')} stops={[
        { offset: 0, color: '#5f7388' },
        { offset: 0.52, color: '#ca8a65' },
        { offset: 1, color: '#efbd79' },
      ]} />
      <LinearGradient id={id('sky-dusk-3')} stops={[
        { offset: 0, color: '#4d6079' },
        { offset: 0.54, color: '#ad705e' },
        { offset: 1, color: '#dc9c61' },
      ]} />
      <LinearGradient id={id('sky-dusk-4')} stops={[
        { offset: 0, color: '#3d506d' },
        { offset: 0.58, color: '#895b5b' },
        { offset: 1, color: '#c57f58' },
      ]} />
      <LinearGradient id={id('sky-gloaming-5')} stops={[
        { offset: 0, color: '#2d415f' },
        { offset: 0.58, color: '#6f4c5b' },
        { offset: 1, color: '#a96850' },
      ]} />
      <LinearGradient id={id('sky-night-6')} stops={[
        { offset: 0, color: '#1b2b48' },
        { offset: 0.6, color: '#35415c' },
        { offset: 1, color: '#61505a' },
      ]} />
      <LinearGradient id={id('sky-night-7')} stops={[
        { offset: 0, color: '#0d1831' },
        { offset: 0.62, color: '#1d2b4b' },
        { offset: 1, color: '#343d63' },
      ]} />
      <LinearGradient id={id('porch-face')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#b87543' },
        { offset: 0.55, color: '#875034' },
        { offset: 1, color: '#4f3329' },
      ]} />
      <LinearGradient id={id('door-face')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#80503a' },
        { offset: 1, color: '#462f2b' },
      ]} />
      <LinearGradient id={id('glass')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#ffffff', opacity: 0.62 },
        { offset: 0.46, color: '#bfe5f3', opacity: 0.22 },
        { offset: 1, color: '#6e9fae', opacity: 0.42 },
      ]} />
      <LinearGradient id={id('quilt')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#8e95c4' },
        { offset: 0.55, color: '#626a9b' },
        { offset: 1, color: '#414a79' },
      ]} />
      <RadialGradient id={id('vignette')} stops={[
        { offset: 0.56, color: '#000000', opacity: 0 },
        { offset: 1, color: '#130f1a', opacity: 0.4 },
      ]} />
      <RadialGradient id={id('moon-glow')} stops={[
        { offset: 0, color: '#eaf1ff', opacity: 0.76 },
        { offset: 1, color: '#eaf1ff', opacity: 0 },
      ]} />
    </defs>
  );
}

function performance(
  pose: CharacterPerformance['pose'],
  gazeTarget: CharacterPerformance['gazeTarget'],
  expression: CharacterPerformance['expression'],
  options: Partial<CharacterPerformance> = {},
): CharacterPerformance {
  return {
    pose,
    lineOfAction: options.lineOfAction ?? 0,
    shoulderTilt: options.shoulderTilt ?? -8,
    pelvisTilt: options.pelvisTilt ?? 6,
    weightFoot: options.weightFoot ?? 'center',
    gazeTarget,
    headTurn: options.headTurn ?? 0,
    expression,
    leftHand: options.leftHand ?? 'rest',
    rightHand: options.rightHand ?? 'rest',
    leftHandTarget: options.leftHandTarget,
    rightHandTarget: options.rightHandTarget,
  };
}

function Character({
  id,
  kind,
  x,
  y,
  scale,
  scenePerformance,
}: {
  readonly id: SceneWorldProps['id'];
  readonly kind: 'pip' | 'ada' | 'grandpa';
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly scenePerformance: CharacterPerformance;
}) {
  const appearance = kind === 'pip' ? PIP : kind === 'ada' ? ADA : GRANDPA;
  return (
    <CinematicCharacter
      id={(part) => id(`${kind}-${part}`)}
      x={x}
      y={y}
      scale={scale}
      appearance={appearance}
      performance={scenePerformance}
      className={`scene-${kind}`}
    />
  );
}

function ContactShadow({
  paint,
  cx,
  cy,
  rx,
  ry,
}: {
  readonly paint: Paint;
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={paint('contact-ao')}
      data-lighting="contact-shadow"
    />
  );
}

function PorchArchitecture({
  paint,
  night = false,
  doorOpen = false,
}: {
  readonly paint: Paint;
  readonly night?: boolean;
  readonly doorOpen?: boolean;
}) {
  return (
    <g data-landform="pattern-porch" data-cover-parity="identity">
      <path d="M0,0 L1200,0 L1200,348 L0,454 Z" fill={night ? '#263247' : '#79503b'} />
      <g data-material="timber" filter={paint('porch-timber')}>
        <path d="M0,436 L1200,326 L1200,800 L0,800 Z" fill={paint('porch-face')} />
        {range(8).map((i) => {
          const y1 = 458 + i * 48;
          return (
            <path
              key={i}
              d={`M0,${y1} L1200,${n(344 + i * 58)}`}
              stroke={night ? '#253041' : '#633c2c'}
              strokeWidth={8}
              opacity={0.62}
            />
          );
        })}
      </g>
      <path d="M748,70 L1084,54 L1082,350 L760,382 Z" fill={paint('door-face')} />
      <path d="M786,104 L1028,94 L1026,330 L792,352 Z" fill={doorOpen ? '#182338' : night ? '#324058' : '#9b6443'} />
      <path d="M914,98 L914,340 M790,222 L1028,212" stroke="#55372d" strokeWidth={10} opacity={0.72} />
      <path d="M82,240 L666,190" stroke="#4c342c" strokeWidth={24} />
      <path d="M112,234 L112,482 M330,216 L330,454 M548,198 L548,430" stroke="#4c342c" strokeWidth={20} />
      <path d="M96,222 L656,176" stroke={night ? '#52667d' : '#c98553'} strokeWidth={7} opacity={0.48} data-lighting="key" />
    </g>
  );
}

function RockingChair({
  x,
  y,
  scale,
  paint,
}: {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly paint: Paint;
}) {
  return (
    <g className="scene-rocking-chair" transform={`translate(${x} ${y}) scale(${scale})`}>
      <ContactShadow paint={paint} cx={0} cy={134} rx={98} ry={22} />
      <g data-material="timber" filter={paint('porch-timber')}>
        <path d="M-74,126 Q0,166 86,124" stroke="#4f3127" strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M-52,-62 L34,-46 L24,80 L-58,66 Z" fill="#74472f" />
        <path d="M-40,-44 L22,-34 L14,62 L-46,52 Z" fill="#9a6540" />
        <path d="M-56,24 L-92,96 M34,22 L76,102 M-58,72 L54,88" stroke="#503127" strokeWidth={15} strokeLinecap="round" />
      </g>
    </g>
  );
}

function FlowerPot({ x, y, scale = 1, paint }: { readonly x: number; readonly y: number; readonly scale?: number; readonly paint: Paint }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} data-motif="flowerpot">
      <ContactShadow paint={paint} cx={0} cy={78} rx={62} ry={14} />
      <path d="M-54,-18 L54,-18 L38,76 L-36,76 Z" fill="#a9533b" />
      <path d="M-62,-34 L62,-34 L56,-10 L-56,-10 Z" fill="#d17750" />
      <path d="M-24,-34 C-42,-90 -2,-102 4,-38 M18,-34 C12,-92 62,-84 48,-34" stroke="#456f4d" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M-40,-82 Q-10,-104 10,-74 Q-14,-52 -40,-82 Z M34,-82 Q64,-96 72,-64 Q44,-46 34,-82 Z" fill="#5d8d58" />
      <path d="M-46,-28 Q0,-14 48,-28" stroke="#efa378" strokeWidth={5} opacity={0.44} fill="none" data-lighting="rim" />
    </g>
  );
}

function PorchLamp({ x, y, scale = 1, paint }: { readonly x: number; readonly y: number; readonly scale?: number; readonly paint: Paint }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="scene-porch-lamp">
      <ellipse cx={0} cy={0} rx={148} ry={128} fill={paint('pattern-practical')} data-lighting="practical" />
      <path d="M-32,-72 L32,-72 L42,18 L-42,18 Z" fill="#5a4537" />
      <path d="M-24,-54 L24,-54 L30,8 L-30,8 Z" fill="#f2c36f" opacity={0.86} />
      <path d="M-42,-78 L42,-78 L22,-100 L-22,-100 Z" fill="#3f352e" />
    </g>
  );
}

function Button({
  x,
  y,
  r,
  fill,
  paint,
  angle = 0,
}: {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly fill: string;
  readonly paint: Paint;
  readonly angle?: number;
}) {
  const hole = n(r * 0.13);
  const offset = n(r * 0.3);
  return (
    <g
      className="scene-button"
      data-motif="button"
      data-x={n(x)}
      data-y={n(y)}
      data-r={n(r)}
      data-fill={fill}
      transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)})`}
    >
      <ellipse cx={0} cy={n(r * 0.34)} rx={n(r * 1.02)} ry={n(r * 0.4)} fill="#211b1d" opacity={0.24} />
      <g filter={paint('button-sheen')} data-material="button">
        <circle cx={0} cy={0} r={n(r)} fill={fill} />
        <circle cx={0} cy={0} r={n(r * 0.72)} fill="none" stroke="#fff2cf" strokeWidth={n(Math.max(1.5, r * 0.08))} opacity={0.28} />
      </g>
      <path d={`M${n(-r * 0.64)},${n(-r * 0.28)} Q0,${n(-r * 0.72)} ${n(r * 0.62)},${n(-r * 0.22)}`} stroke="#fff1c8" strokeWidth={n(Math.max(1.4, r * 0.1))} fill="none" opacity={0.52} data-material-pass="directional-highlight" />
      <circle cx={-offset} cy={-offset} r={hole} fill="#f6dfb8" />
      <circle cx={offset} cy={-offset} r={hole} fill="#f6dfb8" />
      <circle cx={-offset} cy={offset} r={hole} fill="#f6dfb8" />
      <circle cx={offset} cy={offset} r={hole} fill="#f6dfb8" />
    </g>
  );
}

function ButtonJar({
  x,
  y,
  scale,
  paint,
  seed,
  tipped = false,
  full = false,
}: {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly paint: Paint;
  readonly seed: number;
  readonly tipped?: boolean;
  readonly full?: boolean;
}) {
  const count = full ? 18 : 9;
  return (
    <g
      className="scene-button-jar"
      data-motif="button-jar"
      transform={`translate(${x} ${y}) rotate(${tipped ? -64 : 0}) scale(${scale})`}
    >
      <ContactShadow paint={paint} cx={0} cy={94} rx={68} ry={18} />
      {range(count).map((i) => {
        const px = -32 + (i % 6) * 13 + ((seed + i * 17) % 5);
        const py = 58 - Math.floor(i / 6) * 20 + (i % 2) * 4;
        const colors = [RED, BLUE, GOLD, GREEN, VIOLET];
        return <Button key={i} x={px} y={py} r={n(7 + (i % 3) * 1.4)} fill={colors[i % colors.length]} paint={paint} angle={i * 19} />;
      })}
      <path d="M-50,-76 C-64,-38 -66,42 -48,92 C-22,112 22,112 48,92 C66,42 64,-38 50,-76 Z" fill={paint('glass')} stroke="#eaf8f8" strokeWidth={5} />
      <path d="M-30,-58 C-42,-8 -36,58 -20,86" stroke="#ffffff" strokeWidth={7} opacity={0.46} fill="none" strokeLinecap="round" />
      <path d="M-42,-82 L42,-82 L38,-108 L-38,-108 Z" fill="#9a7658" />
      <path d="M-34,-108 L34,-108 L28,-120 L-28,-120 Z" fill="#c89b70" />
      <path d="M-38,-70 Q0,-88 38,-70" stroke="#f3d69b" strokeWidth={4} fill="none" opacity={0.54} data-lighting="rim" />
    </g>
  );
}

function Spill({
  paint,
  seed,
  cx,
  cy,
}: {
  readonly paint: Paint;
  readonly seed: number;
  readonly cx: number;
  readonly cy: number;
}) {
  const colors = [RED, BLUE, GOLD, GREEN, VIOLET];
  return (
    <g className="scene-button-spill">
      {range(26).map((i) => {
        const angle = i * 137.5;
        const radius = 24 + (i % 6) * 30 + Math.floor(i / 6) * 7;
        const x = cx + Math.cos((angle * Math.PI) / 180) * radius * 1.45;
        const y = cy + Math.sin((angle * Math.PI) / 180) * radius * 0.55 + ((seed + i * 13) % 8);
        return <Button key={i} x={n(x)} y={n(y)} r={n(9 + (i % 4) * 2.2)} fill={colors[i % colors.length]} paint={paint} angle={angle} />;
      })}
    </g>
  );
}

function Firefly({ x, y, paint }: { readonly x: number; readonly y: number; readonly paint: Paint }) {
  return (
    <g className="scene-firefly" transform={`translate(${x} ${y})`}>
      <g className="scene-firefly-drift">
        <circle cx={0} cy={0} r={36} fill={paint('pattern-practical')} />
        <ellipse cx={0} cy={0} rx={8} ry={5} fill="#252724" />
        <circle cx={7} cy={0} r={6} fill="#f1f58b" />
        <path d="M-4,-4 Q-22,-18 -28,-2 Q-16,6 -4,2 Z M-4,4 Q-22,18 -28,2 Q-16,-6 -4,-2 Z" fill="#dce9ef" opacity={0.5} />
      </g>
    </g>
  );
}

function SceneFrame({
  id,
  paint,
  seed,
  sceneId,
  stage,
  far,
  mid,
  focus,
  near,
  calm = false,
}: {
  readonly id: SceneWorldProps['id'];
  readonly paint: Paint;
  readonly seed: number;
  readonly sceneId: string;
  readonly stage: keyof typeof LIGHTING;
  readonly far: ReactNode;
  readonly mid: ReactNode;
  readonly focus: ReactNode;
  readonly near: ReactNode;
  readonly calm?: boolean;
}) {
  const practical = LIGHTING[stage].practicals[0];
  return (
    <g
      data-scene-art
      data-cinematic-scene={sceneId}
      data-time-stage={stage}
      data-calm-landing={calm ? 'true' : undefined}
    >
      <defs>
        <CinematicDefs id={id} seed={seed} lighting={LIGHTING[stage]} materials={MATERIALS} />
      </defs>
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint(`sky-${stage}`)} />
      <ellipse
        cx={practical.x}
        cy={practical.y}
        rx={practical.radius}
        ry={n(practical.radius * 0.78)}
        fill={paint('pattern-practical')}
        data-lighting="practical"
      />
      <DepthLayer depth="far" id={id} treatment={{ opacity: calm ? 0.62 : 0.78, blur: calm ? 2.3 : 1.35, saturation: calm ? 0.68 : 0.84 }}>
        {far}
      </DepthLayer>
      <DepthLayer depth="mid">{mid}</DepthLayer>
      <DepthLayer depth="focus">{focus}</DepthLayer>
      <DepthLayer depth="near">{near}</DepthLayer>
      <Vignette paint={paint('vignette')} />
    </g>
  );
}

const PAGES: Record<string, (props: SceneWorldProps) => ReactNode> = {
  'pattern-01-porch-buttons': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="pattern-01-porch-buttons"
      stage="golden-1"
      far={
        <>
          <PorchArchitecture paint={paint} />
          <PorchLamp x={1080} y={132} scale={0.72} paint={paint} />
          <RockingChair x={940} y={368} scale={0.68} paint={paint} />
          <Character
            id={id}
            kind="grandpa"
            x={930}
            y={450}
            scale={0.54}
            scenePerformance={performance('stand', { x: 572, y: 540 }, 'calm', {
              shoulderTilt: -6,
              pelvisTilt: 4,
              headTurn: -0.62,
              rightHand: 'rest',
            })}
          />
        </>
      }
      mid={
        <>
          <path d="M0,438 L1200,328 L1200,800 L0,800 Z" fill="#835039" opacity={0.24} data-cover-parity="identity" />
          <path d="M162,588 C362,528 570,542 760,490" stroke={paint('fill-light')} strokeWidth={76} fill="none" opacity={0.44} data-lighting="fill" />
          <path d="M720,346 Q896,292 1060,262" stroke="#f5bd77" strokeWidth={9} fill="none" opacity={0.48} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={584} cy={642} rx={264} ry={52} />
          <ButtonJar x={602} y={438} scale={0.88} paint={paint} seed={seed} tipped />
          <Spill paint={paint} seed={seed} cx={586} cy={568} />
          <Character
            id={id}
            kind="pip"
            x={296}
            y={736}
            scale={0.86}
            scenePerformance={performance('kneel', { x: 540, y: 560 }, 'curious', {
              lineOfAction: 12,
              shoulderTilt: 11,
              pelvisTilt: -8,
              headTurn: 0.64,
              leftHand: 'open',
              rightHand: 'open',
              rightHandTarget: { x: 472, y: 590 },
            })}
          />
          <Character
            id={id}
            kind="ada"
            x={888}
            y={738}
            scale={0.84}
            scenePerformance={performance('kneel', { x: 642, y: 566 }, 'delighted', {
              lineOfAction: -12,
              shoulderTilt: -11,
              pelvisTilt: 8,
              headTurn: -0.64,
              leftHand: 'open',
              rightHand: 'open',
              leftHandTarget: { x: 708, y: 592 },
            })}
          />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,700 Q96,660 190,718 L246,800 Z" fill="#362a2a" />
          <path d="M1200,800 L1200,688 Q1128,656 1050,718 L1014,800 Z" fill="#32282a" />
        </>
      }
    />
  ),

  'pattern-02-red-blue-line': ({ id, paint, seed }) => {
    const line = range(10).map((i) => ({
      x: 154 + i * 96,
      y: 626 - i * 28,
      r: 24 - i * 0.85,
      fill: i % 2 === 0 ? RED : BLUE,
    }));
    return (
      <SceneFrame
        id={id}
        paint={paint}
        seed={seed}
        sceneId="pattern-02-red-blue-line"
        stage="golden-2"
        far={
          <>
            <PorchArchitecture paint={paint} />
            <PorchLamp x={1050} y={140} scale={0.68} paint={paint} />
          </>
        }
        mid={
          <>
            <path d="M0,440 L1200,330 L1200,800 L0,800 Z" fill="#754632" opacity={0.2} data-cover-parity="identity" />
            <path d="M136,610 L1070,338" stroke={paint('fill-light')} strokeWidth={86} fill="none" opacity={0.4} data-lighting="fill" />
            <path d="M204,574 L1002,342" stroke="#f6c17c" strokeWidth={7} fill="none" opacity={0.44} data-lighting="key" />
          </>
        }
        focus={
          <>
            <ContactShadow paint={paint} cx={604} cy={574} rx={430} ry={42} />
            {line.map((button, i) => (
              <Button key={i} {...button} paint={paint} angle={i * 13} />
            ))}
            <Character
              id={id}
              kind="pip"
              x={206}
              y={738}
              scale={0.76}
              scenePerformance={performance('point', { x: 482, y: 532 }, 'delighted', {
                lineOfAction: 9,
                shoulderTilt: -12,
                pelvisTilt: 8,
                headTurn: 0.7,
                rightHand: 'point',
                rightHandTarget: { x: 386, y: 568 },
              })}
            />
            <Character
              id={id}
              kind="ada"
              x={1004}
              y={500}
              scale={0.66}
              scenePerformance={performance('kneel', { x: 858, y: 408 }, 'curious', {
                lineOfAction: -10,
                shoulderTilt: -10,
                pelvisTilt: 7,
                headTurn: -0.68,
                leftHand: 'open',
                leftHandTarget: { x: 930, y: 426 },
              })}
            />
            <path d="M128,648 Q576,530 1010,356" stroke="#f6cf8f" strokeWidth={4} fill="none" opacity={0.46} data-lighting="rim" />
          </>
        }
        near={
          <>
            <path d="M0,800 L0,724 Q98,680 198,732 L244,800 Z" fill="#33282a" />
            <path d="M1200,800 L1200,650 Q1128,624 1058,684 L1010,800 Z" fill="#30262a" />
          </>
        }
      />
    );
  },

  'pattern-03-big-small-curve': ({ id, paint, seed }) => {
    const points = range(15).map((i) => {
      const t = i / 14;
      return {
        x: 142 + t * 914,
        y: 640 - Math.sin(t * Math.PI * 1.35) * 176 + Math.sin(t * Math.PI * 3) * 24,
        r: i % 3 === 0 ? 27 : 13,
        fill: [GOLD, RED, BLUE][i % 3],
      };
    });
    return (
      <SceneFrame
        id={id}
        paint={paint}
        seed={seed}
        sceneId="pattern-03-big-small-curve"
        stage="dusk-3"
        far={
          <>
            <PorchArchitecture paint={paint} />
            <RockingChair x={332} y={360} scale={0.62} paint={paint} />
            <FlowerPot x={964} y={380} scale={0.94} paint={paint} />
          </>
        }
        mid={
          <>
            <path d="M0,442 L1200,330 L1200,800 L0,800 Z" fill="#6b4031" opacity={0.22} data-cover-parity="identity" />
            <path d="M148,620 C374,548 566,580 788,504" stroke={paint('fill-light')} strokeWidth={78} fill="none" opacity={0.42} data-lighting="fill" />
            <path d="M670,390 Q858,334 1042,302" stroke="#efb16f" strokeWidth={8} fill="none" opacity={0.48} data-lighting="key" />
          </>
        }
        focus={
          <>
            <ContactShadow paint={paint} cx={590} cy={616} rx={426} ry={46} />
            {points.map((button, i) => (
              <Button key={i} {...button} paint={paint} angle={i * 17} />
            ))}
            <Character
              id={id}
              kind="pip"
              x={258}
              y={744}
              scale={0.78}
              scenePerformance={performance('kneel', { x: 486, y: 490 }, 'delighted', {
                lineOfAction: 10,
                shoulderTilt: 10,
                pelvisTilt: -8,
                headTurn: 0.62,
                rightHand: 'open',
                rightHandTarget: { x: 420, y: 540 },
              })}
            />
            <Character
              id={id}
              kind="ada"
              x={914}
              y={730}
              scale={0.76}
              scenePerformance={performance('kneel', { x: 720, y: 470 }, 'curious', {
                lineOfAction: -10,
                shoulderTilt: -10,
                pelvisTilt: 8,
                headTurn: -0.62,
                leftHand: 'open',
                leftHandTarget: { x: 766, y: 500 },
              })}
            />
            <path d="M232,622 C474,500 720,510 1000,568" stroke="#efc581" strokeWidth={4} fill="none" opacity={0.4} data-lighting="rim" />
          </>
        }
        near={
          <>
            <path d="M0,800 L0,708 Q88,668 176,722 L230,800 Z" fill="#30272a" />
            <path d="M1200,800 L1200,696 Q1124,662 1046,724 L1008,800 Z" fill="#2e2528" />
          </>
        }
      />
    );
  },

  'pattern-04-breeze-bump': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="pattern-04-breeze-bump"
      stage="dusk-4"
      far={
        <>
          <PorchArchitecture paint={paint} night />
          <PorchLamp x={1020} y={148} scale={0.7} paint={paint} />
          <path d="M84,280 C300,232 492,264 704,216" stroke="#7189a0" strokeWidth={34} fill="none" opacity={0.18} strokeLinecap="round" />
        </>
      }
      mid={
        <>
          <path d="M0,442 L1200,330 L1200,800 L0,800 Z" fill="#4a3b3a" opacity={0.22} data-cover-parity="identity" />
          <path d="M160,614 C360,552 568,568 752,514" stroke={paint('fill-light')} strokeWidth={82} fill="none" opacity={0.46} data-lighting="fill" />
          <path d="M702,372 Q862,326 1028,294" stroke="#dea066" strokeWidth={7} fill="none" opacity={0.4} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={600} cy={602} rx={390} ry={44} />
          <Button x={250} y={556} r={27} fill={GOLD} paint={paint} />
          <Button x={348} y={538} r={13} fill={BLUE} paint={paint} angle={18} />
          <Button x={432} y={522} r={13} fill={RED} paint={paint} angle={36} />
          <Button x={538} y={508} r={28} fill={GOLD} paint={paint} angle={54} />
          <Button x={650} y={494} r={28} fill={GOLD} paint={paint} angle={72} />
          <Button x={748} y={482} r={13} fill={BLUE} paint={paint} angle={90} />
          <Button x={838} y={474} r={13} fill={RED} paint={paint} angle={108} />
          <Button x={958} y={538} r={13} fill={BLUE} paint={paint} angle={126} />
          <path d="M930,526 Q984,494 1042,518" stroke="#cbd8e7" strokeWidth={5} fill="none" opacity={0.5} />
          <Character
            id={id}
            kind="pip"
            x={202}
            y={730}
            scale={0.84}
            scenePerformance={performance('kneel', { x: 600, y: 508 }, 'concerned', {
              lineOfAction: 13,
              shoulderTilt: 12,
              pelvisTilt: -8,
              headTurn: 0.72,
              rightHand: 'point',
              rightHandTarget: { x: 448, y: 536 },
            })}
          />
          <Character
            id={id}
            kind="ada"
            x={1004}
            y={690}
            scale={0.82}
            scenePerformance={performance('kneel', { x: 652, y: 494 }, 'uncertain', {
              lineOfAction: -13,
              shoulderTilt: -12,
              pelvisTilt: 8,
              headTurn: -0.72,
              leftHand: 'point',
              leftHandTarget: { x: 820, y: 482 },
            })}
          />
          <path d="M520,472 Q594,448 668,466" stroke="#e4ac6d" strokeWidth={4} fill="none" opacity={0.42} data-lighting="rim" />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,696 Q96,656 188,716 L244,800 Z" fill="#29232a" />
          <path d="M1200,800 L1200,676 Q1124,650 1052,710 L1012,800 Z" fill="#292229" />
        </>
      }
    />
  ),

  'pattern-05-fix-together': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="pattern-05-fix-together"
      stage="gloaming-5"
      far={
        <>
          <PorchArchitecture paint={paint} night />
          <RockingChair x={970} y={352} scale={0.58} paint={paint} />
          <PorchLamp x={1030} y={152} scale={0.7} paint={paint} />
        </>
      }
      mid={
        <>
          <path d="M0,442 L1200,330 L1200,800 L0,800 Z" fill="#45353a" opacity={0.24} data-cover-parity="identity" />
          <path d="M150,622 C352,558 556,574 750,520" stroke={paint('fill-light')} strokeWidth={82} fill="none" opacity={0.46} data-lighting="fill" />
          <path d="M730,370 Q878,328 1030,300" stroke="#d89a62" strokeWidth={7} fill="none" opacity={0.4} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={602} cy={606} rx={410} ry={48} />
          {[
            [176, 574, 27, GOLD],
            [278, 552, 13, BLUE],
            [366, 534, 13, RED],
            [474, 516, 27, GOLD],
            [584, 502, 13, BLUE],
            [680, 494, 13, RED],
            [790, 500, 27, GOLD],
            [894, 518, 13, BLUE],
            [982, 542, 13, RED],
          ].map(([x, y, r, fill], i) => (
            <Button key={i} x={Number(x)} y={Number(y)} r={Number(r)} fill={String(fill)} paint={paint} angle={i * 17} />
          ))}
          <Character
            id={id}
            kind="pip"
            x={288}
            y={738}
            scale={0.8}
            scenePerformance={performance('kneel', { x: 596, y: 500 }, 'calm', {
              lineOfAction: 10,
              shoulderTilt: 10,
              pelvisTilt: -8,
              headTurn: 0.66,
              rightHand: 'open',
              rightHandTarget: { x: 530, y: 470 },
            })}
          />
          <Character
            id={id}
            kind="ada"
            x={900}
            y={726}
            scale={0.8}
            scenePerformance={performance('kneel', { x: 596, y: 500 }, 'delighted', {
              lineOfAction: -10,
              shoulderTilt: -10,
              pelvisTilt: 8,
              headTurn: -0.66,
              leftHand: 'hold',
              leftHandTarget: { x: 650, y: 466 },
            })}
          />
          <Button x={620} y={472} r={13} fill={BLUE} paint={paint} angle={28} />
          <ellipse cx={620} cy={500} rx={82} ry={22} fill="#f8d992" opacity={0.14} />
          <path d="M540,464 Q620,436 700,458" stroke="#e4ad6b" strokeWidth={4} fill="none" opacity={0.42} data-lighting="rim" />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,710 Q90,674 176,724 L222,800 Z" fill="#282229" />
          <path d="M1200,800 L1200,688 Q1124,660 1050,716 L1014,800 Z" fill="#262128" />
        </>
      }
    />
  ),

  'pattern-06-finished-parade': ({ id, paint, seed }) => {
    const parade = range(22).map((i) => {
      const t = i / 21;
      return {
        x: 116 + t * 966,
        y: 700 - Math.sin(t * Math.PI * 2.1) * 142 - t * 260,
        r: i % 5 === 2 ? 24 : 13,
        fill: [RED, BLUE, GOLD, GREEN, VIOLET][i % 5],
      };
    });
    return (
      <SceneFrame
        id={id}
        paint={paint}
        seed={seed}
        sceneId="pattern-06-finished-parade"
        stage="night-6"
        far={
          <>
            <PorchArchitecture paint={paint} night doorOpen />
            <PorchLamp x={164} y={166} scale={0.78} paint={paint} />
            <RockingChair x={940} y={392} scale={0.66} paint={paint} />
            <Character
              id={id}
              kind="grandpa"
              x={930}
              y={474}
              scale={0.54}
              scenePerformance={performance('stand', { x: 580, y: 560 }, 'delighted', {
                shoulderTilt: -5,
                pelvisTilt: 4,
                headTurn: -0.66,
                leftHand: 'open',
              })}
            />
          </>
        }
        mid={
          <>
            <path d="M0,440 L1200,330 L1200,800 L0,800 Z" fill="#34303b" opacity={0.22} data-cover-parity="identity" />
            <path d="M104,632 C326,560 538,580 756,518" stroke={paint('fill-light')} strokeWidth={84} fill="none" opacity={0.42} data-lighting="fill" />
            <path d="M176,316 Q328,278 478,260" stroke="#efb86f" strokeWidth={8} fill="none" opacity={0.46} data-lighting="key" />
          </>
        }
        focus={
          <>
            <ContactShadow paint={paint} cx={602} cy={610} rx={468} ry={52} />
            {parade.map((button, i) => (
              <Button key={i} {...button} paint={paint} angle={i * 17} />
            ))}
            <Character
              id={id}
              kind="pip"
              x={336}
              y={738}
              scale={0.78}
              scenePerformance={performance('kneel', { x: 604, y: 512 }, 'delighted', {
                lineOfAction: 18,
                shoulderTilt: 14,
                pelvisTilt: -10,
                headTurn: 0.58,
                leftHand: 'open',
                rightHand: 'open',
              })}
            />
            <Character
              id={id}
              kind="ada"
              x={592}
              y={742}
              scale={0.76}
              scenePerformance={performance('kneel', { x: 742, y: 470 }, 'delighted', {
                lineOfAction: -18,
                shoulderTilt: -14,
                pelvisTilt: 10,
                headTurn: -0.5,
                leftHand: 'open',
                rightHand: 'open',
              })}
            />
            <Firefly x={704} y={206} paint={paint} />
            <path d="M214,668 C470,544 744,514 1018,432" stroke="#e5b06b" strokeWidth={4} fill="none" opacity={0.4} data-lighting="rim" />
          </>
        }
        near={
          <>
            <path d="M0,800 L0,694 Q96,654 188,716 L246,800 Z" fill="#242129" />
            <path d="M1200,800 L1200,674 Q1124,650 1050,708 L1010,800 Z" fill="#222027" />
          </>
        }
      />
    );
  },

  'pattern-07-jar-moonlight': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="pattern-07-jar-moonlight"
      stage="night-7"
      calm
      far={
        <>
          <StarField seed={seed} count={34} x={620} y={40} width={420} height={286} color="#dce8ff" minR={0.7} maxR={2.2} />
          <circle cx={900} cy={142} r={92} fill={paint('moon-glow')} />
          <circle cx={900} cy={142} r={38} fill="#e8eadb" />
          <g data-landform="pattern-bedroom-window" data-cover-parity="identity">
            <path d="M602,68 L1084,68 L1084,410 L602,410 Z" fill="#0b1428" />
            <path d="M630,94 L1056,94 L1056,384 L630,384 Z" fill="#1a2a4b" />
            <path d="M838,94 L838,384 M630,236 L1056,236" stroke="#4a4b70" strokeWidth={14} />
            <path d="M580,390 L1096,390 L1096,438 L580,438 Z" fill="#555b80" />
          </g>
        </>
      }
      mid={
        <>
          <path d="M0,0 L568,0 L568,800 L0,800 Z" fill="#22243f" />
          <path d="M0,616 Q278,562 584,610 L584,800 L0,800 Z" fill="#343a61" />
          <path d="M662,402 C804,360 934,378 1056,346" stroke={paint('fill-light')} strokeWidth={66} fill="none" opacity={0.34} data-lighting="fill" />
          <path d="M642,140 Q808,104 964,96" stroke="#abc5dd" strokeWidth={6} fill="none" opacity={0.38} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={292} cy={716} rx={220} ry={44} />
          <path d="M48,632 Q252,570 514,626 L548,792 L34,792 Z" fill="#535d8c" />
          <ellipse cx={178} cy={620} rx={92} ry={44} fill="#e4e2e9" />
          <path d="M34,712 Q232,594 526,684 L560,800 L28,800 Z" fill={paint('quilt')} filter={paint('soft-cloth')} />
          {range(6).map((i) => (
            <path key={i} d={`M${76 + i * 82},690 L${150 + i * 82},774`} stroke={i % 2 === 0 ? '#aab0d5' : '#555f94'} strokeWidth={8} opacity={0.48} />
          ))}
          <Character
            id={id}
            kind="pip"
            x={216}
            y={658}
            scale={0.86}
            scenePerformance={performance('sleep', { x: 216, y: 548 }, 'sleeping', {
              shoulderTilt: 2,
              pelvisTilt: -2,
              headTurn: -0.1,
              leftHand: 'rest',
              rightHand: 'rest',
            })}
          />
          <ContactShadow paint={paint} cx={820} cy={406} rx={86} ry={20} />
          <ButtonJar x={820} y={310} scale={0.72} paint={paint} seed={seed} full />
          <path d="M642,358 L970,242 L990,286 L660,406 Z" fill="#eaf0ff" opacity={0.12} />
          <path d="M760,254 Q822,218 884,244" stroke="#cbd9ed" strokeWidth={4} fill="none" opacity={0.36} data-lighting="rim" />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,750 Q88,716 170,752 L202,800 Z" fill="#191c33" />
          <path d="M1200,800 L1200,710 Q1130,690 1068,738 L1038,800 Z" fill="#171a30" />
        </>
      }
    />
  ),
};

export const patternWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
