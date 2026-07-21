import type { ReactNode } from 'react';
import {
  LinearGradient,
  RadialGradient,
  StarField,
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
import {
  CinematicCharacter,
  CinematicDefs,
  DepthLayer,
  defaultAppearance,
  resolvePoseGeometry,
  type CharacterAppearance,
  type CharacterPerformance,
  type LightingRig,
  type MaterialInstance,
} from '../cinematic';

const LEO_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#d99066', shadow: '#9d5d47', highlight: '#f3b58d' },
  face: { shape: 'round', brow: '#402820', mouth: '#7c3940' },
  hair: { style: 'short', base: '#43271f', highlight: '#714332', volume: 0.62 },
  wardrobe: {
    garment: 'tunic',
    base: '#e47d58',
    shadow: '#9f4f45',
    trim: '#f4c36c',
    hemline: 0.42,
  },
  footwear: { style: 'boot', base: '#45352f' },
  secondaryShapes: [{ kind: 'belt', color: '#31588e', accent: '#e8c16a' }],
};

const MOM_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('adult'),
  skin: { base: '#c98765', shadow: '#8f5646', highlight: '#e9af88' },
  face: { shape: 'oval', brow: '#32201d', mouth: '#773b48' },
  hair: { style: 'long', base: '#33201d', highlight: '#624039', volume: 0.7 },
  wardrobe: {
    garment: 'dress',
    base: '#6b719f',
    shadow: '#45486f',
    trim: '#c5b5db',
    hemline: 0.82,
  },
  footwear: { style: 'slipper', base: '#3e3546' },
  secondaryShapes: [{ kind: 'sash', color: '#9f7294', accent: '#dec0d5' }],
};

const SHADOW_APPEARANCE: CharacterAppearance = {
  ...LEO_APPEARANCE,
  skin: { base: '#172238', shadow: '#172238', highlight: '#172238' },
  face: { shape: 'round', brow: '#172238', mouth: '#172238' },
  hair: { style: 'short', base: '#172238', highlight: '#172238', volume: 0.62 },
  wardrobe: {
    garment: 'tunic',
    base: '#172238',
    shadow: '#172238',
    trim: '#172238',
    hemline: 0.42,
  },
  footwear: { style: 'boot', base: '#172238' },
  secondaryShapes: [],
};

const performance = (
  overrides: Partial<CharacterPerformance>,
): CharacterPerformance => ({
  pose: 'stand',
  lineOfAction: 0,
  shoulderTilt: -5,
  pelvisTilt: 5,
  weightFoot: 'center',
  gazeTarget: { x: 600, y: 420 },
  headTurn: 0,
  expression: 'delighted',
  leftHand: 'open',
  rightHand: 'open',
  ...overrides,
});

const LEO_WAVE = performance({
  pose: 'reach',
  lineOfAction: -8,
  shoulderTilt: -13,
  pelvisTilt: 7,
  weightFoot: 'left',
  gazeTarget: { x: 760, y: 548 },
  headTurn: 0.48,
  rightHandTarget: { x: 410, y: 286 },
  leftHandTarget: { x: 222, y: 500 },
});

const LEO_JUMP = performance({
  pose: 'reach',
  lineOfAction: -18,
  shoulderTilt: -18,
  pelvisTilt: 12,
  weightFoot: 'right',
  gazeTarget: { x: 810, y: 536 },
  headTurn: 0.42,
  leftHandTarget: { x: 358, y: 270 },
  rightHandTarget: { x: 690, y: 238 },
  expression: 'delighted',
});

const LEO_RUN = performance({
  pose: 'reach',
  lineOfAction: 26,
  shoulderTilt: 14,
  pelvisTilt: -10,
  weightFoot: 'right',
  gazeTarget: { x: 936, y: 500 },
  headTurn: 0.68,
  leftHandTarget: { x: 560, y: 448 },
  rightHandTarget: { x: 790, y: 350 },
  expression: 'delighted',
});

const LEO_LOOK_DOWN = performance({
  pose: 'stand',
  lineOfAction: 5,
  shoulderTilt: 9,
  pelvisTilt: -6,
  weightFoot: 'center',
  gazeTarget: { x: 602, y: 688 },
  headTurn: -0.18,
  expression: 'curious',
  leftHand: 'rest',
  rightHand: 'rest',
});

const LEO_PROUD = performance({
  pose: 'reach',
  lineOfAction: -3,
  shoulderTilt: -12,
  pelvisTilt: 10,
  weightFoot: 'left',
  gazeTarget: { x: 892, y: 278 },
  headTurn: 0.54,
  leftHandTarget: { x: 206, y: 268 },
  rightHandTarget: { x: 422, y: 244 },
  expression: 'delighted',
});

const LEO_CALM = performance({
  pose: 'stand',
  lineOfAction: 3,
  shoulderTilt: 3,
  pelvisTilt: -4,
  weightFoot: 'right',
  gazeTarget: { x: 728, y: 650 },
  headTurn: 0.25,
  expression: 'calm',
  leftHand: 'rest',
  rightHand: 'open',
});

const LEO_SLEEP = performance({
  pose: 'sleep',
  lineOfAction: -8,
  shoulderTilt: 2,
  pelvisTilt: -3,
  weightFoot: 'center',
  gazeTarget: { x: 460, y: 560 },
  headTurn: -0.3,
  expression: 'sleeping',
  leftHand: 'rest',
  rightHand: 'rest',
});

const MOM_CALM = performance({
  pose: 'stand',
  lineOfAction: -4,
  shoulderTilt: -5,
  pelvisTilt: 7,
  weightFoot: 'left',
  gazeTarget: { x: 526, y: 494 },
  headTurn: -0.55,
  expression: 'calm',
  leftHand: 'rest',
  rightHand: 'open',
  rightHandTarget: { x: 545, y: 510 },
});

const YARD_MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'shadow-timber',
    preset: 'timber',
    base: '#9f6d4e',
    shadow: '#5a3b39',
    highlight: '#d6a66f',
    textureScale: 0.54,
    roughness: 0.72,
  },
  {
    id: 'shadow-cloth',
    preset: 'cloth',
    base: '#d16d56',
    shadow: '#713e49',
    highlight: '#f1b47d',
    textureScale: 0.3,
    roughness: 0.58,
  },
];

const BEDROOM_MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'shadow-quilt',
    preset: 'cloth',
    base: '#5f6ea8',
    shadow: '#343c70',
    highlight: '#9da6d7',
    textureScale: 0.28,
    roughness: 0.62,
  },
  {
    id: 'shadow-bedwood',
    preset: 'timber',
    base: '#6f4938',
    shadow: '#352739',
    highlight: '#a87855',
    textureScale: 0.46,
    roughness: 0.7,
  },
];

const LIGHTING: Record<string, LightingRig> = {
  'shadow-01-morning-meet': {
    key: { azimuth: -18, elevation: 22, color: '#ffd79b', intensity: 0.82 },
    fill: { color: '#8fb4c7', intensity: 0.2 },
    rim: { azimuth: 156, elevation: 28, color: '#ffe4b4', intensity: 0.32 },
    practicals: [
      { id: 'shadow-sun-1', x: 60, y: 420, radius: 330, color: '#ffb65d', intensity: 0.58 },
    ],
  },
  'shadow-02-copycat-shapes': {
    key: { azimuth: -8, elevation: 31, color: '#ffd19a', intensity: 0.76 },
    fill: { color: '#7fa5bd', intensity: 0.22 },
    rim: { azimuth: 164, elevation: 26, color: '#f8cf9c', intensity: 0.27 },
    practicals: [
      { id: 'shadow-sun-2', x: 1050, y: 180, radius: 280, color: '#ffb866', intensity: 0.5 },
    ],
  },
  'shadow-03-shadow-tag': {
    key: { azimuth: 22, elevation: 28, color: '#efb97e', intensity: 0.72 },
    fill: { color: '#7898ae', intensity: 0.23 },
    rim: { azimuth: 172, elevation: 20, color: '#ffd6a6', intensity: 0.3 },
    practicals: [
      { id: 'shadow-sun-3', x: 990, y: 190, radius: 300, color: '#eaa061', intensity: 0.42 },
    ],
  },
  'shadow-04-tiny-noon': {
    key: { azimuth: 4, elevation: 66, color: '#f4c88f', intensity: 0.7 },
    fill: { color: '#6f8fae', intensity: 0.22 },
    rim: { azimuth: 176, elevation: 36, color: '#dcbf9a', intensity: 0.24 },
    practicals: [
      { id: 'shadow-sun-4', x: 620, y: 84, radius: 240, color: '#efb56d', intensity: 0.4 },
    ],
  },
  'shadow-05-giant-evening': {
    key: { azimuth: -30, elevation: 14, color: '#ffb66d', intensity: 0.86 },
    fill: { color: '#7285ad', intensity: 0.2 },
    rim: { azimuth: 148, elevation: 22, color: '#ffd09b', intensity: 0.34 },
    practicals: [
      { id: 'shadow-sun-5', x: 30, y: 540, radius: 360, color: '#ff8c49', intensity: 0.62 },
    ],
  },
  'shadow-06-dusk-fade': {
    key: { azimuth: -42, elevation: 8, color: '#c99382', intensity: 0.48 },
    fill: { color: '#6f83ac', intensity: 0.26 },
    rim: { azimuth: 136, elevation: 26, color: '#bacbe0', intensity: 0.26 },
    practicals: [
      { id: 'shadow-moon-6', x: 1050, y: 130, radius: 220, color: '#c9d7ea', intensity: 0.3 },
    ],
  },
  'shadow-07-nightlight-teddy': {
    key: { azimuth: 18, elevation: 20, color: '#ffd18a', intensity: 0.62 },
    fill: { color: '#526e9a', intensity: 0.2 },
    rim: { azimuth: 164, elevation: 18, color: '#8ca7d0', intensity: 0.23 },
    practicals: [
      { id: 'shadow-nightlight-7', x: 220, y: 520, radius: 360, color: '#f5a755', intensity: 0.56 },
    ],
  },
};

function Defs({ id }: SceneWorldProps): ReactNode {
  const skies = [
    ['shadowSky1', '#6d8ea6', '#efb978'],
    ['shadowSky2', '#617995', '#dc9c70'],
    ['shadowSky3', '#506982', '#bd806d'],
    ['shadowSky4', '#405570', '#98666d'],
    ['shadowSky5', '#303d61', '#d36f55'],
    ['shadowSky6', '#1d2d4d', '#686386'],
    ['shadowSky7', '#0d1730', '#26375b'],
  ] as const;
  return (
    <defs>
      {skies.map(([name, top, bottom]) => (
        <LinearGradient
          key={name}
          id={id(name)}
          stops={[
            { offset: 0, color: top },
            { offset: 0.62, color: bottom },
            { offset: 1, color: '#f0ad72' },
          ]}
        />
      ))}
      <LinearGradient
        id={id('shadowGrassWarm')}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
        stops={[
          { offset: 0, color: '#667f53' },
          { offset: 0.55, color: '#3f624c' },
          { offset: 1, color: '#263c43' },
        ]}
      />
      <LinearGradient
        id={id('shadowGrassCool')}
        stops={[
          { offset: 0, color: '#344f52' },
          { offset: 1, color: '#17283a' },
        ]}
      />
      <LinearGradient
        id={id('shadowRoomWall')}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
        stops={[
          { offset: 0, color: '#17213e' },
          { offset: 0.62, color: '#28345e' },
          { offset: 1, color: '#3b416b' },
        ]}
      />
      <LinearGradient
        id={id('shadowQuilt')}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
        stops={[
          { offset: 0, color: '#8390c4' },
          { offset: 0.55, color: '#58689f' },
          { offset: 1, color: '#353f73' },
        ]}
      />
      <RadialGradient
        id={id('shadowVignette')}
        stops={[
          { offset: 0.55, color: '#0b1020', opacity: 0 },
          { offset: 1, color: '#0b1020', opacity: 0.42 },
        ]}
      />
    </defs>
  );
}

function SceneFrame({
  id,
  paint,
  seed,
  sceneId,
  timeIndex,
  materials,
  calm = false,
  children,
}: SceneWorldProps & {
  readonly sceneId: string;
  readonly timeIndex: number;
  readonly materials: readonly MaterialInstance[];
  readonly calm?: boolean;
  readonly children: ReactNode;
}) {
  return (
    <g
      data-scene-art
      data-cinematic-scene={sceneId}
      data-time-index={timeIndex}
      data-calm-landing={calm ? 'true' : undefined}
    >
      <defs>
        <CinematicDefs
          id={id}
          seed={seed}
          lighting={LIGHTING[sceneId]}
          materials={materials}
        />
      </defs>
      {children}
      <Vignette paint={paint('shadowVignette')} />
    </g>
  );
}

function Sky({
  fill,
  paint,
  fillOpacity = 0.18,
}: {
  readonly fill: string;
  readonly paint: SceneWorldProps['paint'];
  readonly fillOpacity?: number;
}) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={fill} />
      <rect
        width={VIEW_W}
        height={VIEW_H}
        fill={paint('fill-light')}
        opacity={fillOpacity}
        data-lighting="fill"
      />
    </>
  );
}

function Practical({
  paint,
  id,
  x,
  y,
  radius,
  source,
  core,
}: {
  readonly paint: SceneWorldProps['paint'];
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly source: string;
  readonly core: string;
}) {
  return (
    <g data-lighting="practical" data-practical-source={source}>
      <circle cx={x} cy={y} r={radius * 2.1} fill={paint(id)} />
      <circle cx={x} cy={y} r={radius} fill={core} />
      <circle cx={x - radius * 0.24} cy={y - radius * 0.26} r={radius * 0.28} fill="#fff4ca" opacity={0.62} />
    </g>
  );
}

function LitCharacter({
  id,
  x,
  y,
  scale,
  appearance,
  performance: pose,
  className,
  lightKey,
  lightFill,
  lightRim,
}: {
  readonly id: SceneWorldProps['id'];
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly appearance: CharacterAppearance;
  readonly performance: CharacterPerformance;
  readonly className: string;
  readonly lightKey: string;
  readonly lightFill: string;
  readonly lightRim: string;
}) {
  const geometry = resolvePoseGeometry(appearance, pose, { x, y, scale });
  const headRadius = appearance.proportions.headRadius * scale;
  const feetX = (geometry.foot.left.x + geometry.foot.right.x) / 2;
  const feetY = Math.max(geometry.foot.left.y, geometry.foot.right.y);
  return (
    <g data-character-lighting={className}>
      <ellipse
        cx={n(feetX)}
        cy={n(feetY + 7)}
        rx={n(appearance.proportions.hipWidth * scale * 1.45)}
        ry={n(10 * scale)}
        fill="#0b1020"
        opacity={0.42}
        data-lighting="contact-shadow"
      />
      <CinematicCharacter
        id={(part) => id(`${className}-${part}`)}
        x={x}
        y={y}
        scale={scale}
        appearance={appearance}
        performance={pose}
        className={className}
      />
      <path
        d={`M${n(geometry.head.x - headRadius * 0.82)},${n(
          geometry.head.y - headRadius * 0.18,
        )} Q${n(geometry.head.x - headRadius * 0.34)},${n(
          geometry.head.y - headRadius * 0.94,
        )} ${n(geometry.head.x + headRadius * 0.22)},${n(
          geometry.head.y - headRadius * 0.82,
        )} M${n(geometry.shoulder.left.x)},${n(geometry.shoulder.left.y)} L${n(
          geometry.elbow.left.x,
        )},${n(geometry.elbow.left.y)}`}
        fill="none"
        stroke={lightKey}
        strokeWidth={n(4.2 * scale)}
        strokeLinecap="round"
        opacity={0.68}
        data-lighting="key"
      />
      <path
        d={`M${n(geometry.shoulder.right.x)},${n(
          geometry.shoulder.right.y + 8,
        )} Q${n(geometry.hip.right.x + 10)},${n(
          geometry.hip.right.y + 14,
        )} ${n(geometry.ankle.right.x + 7)},${n(geometry.ankle.right.y)}`}
        fill="none"
        stroke={lightFill}
        strokeWidth={n(6 * scale)}
        strokeLinecap="round"
        opacity={0.3}
        data-lighting="fill"
      />
      <path
        d={`M${n(geometry.head.x + headRadius * 0.88)},${n(
          geometry.head.y - headRadius * 0.08,
        )} Q${n(geometry.head.x + headRadius * 0.68)},${n(
          geometry.head.y - headRadius * 0.7,
        )} ${n(geometry.head.x + headRadius * 0.18)},${n(
          geometry.head.y - headRadius * 0.88,
        )}`}
        fill="none"
        stroke={lightRim}
        strokeWidth={n(2.7 * scale)}
        strokeLinecap="round"
        opacity={0.58}
        data-lighting="rim"
      />
    </g>
  );
}

function ProjectedShadow({
  id,
  x,
  y,
  scale,
  stretch,
  flatten,
  angle,
  pose,
  opacity = 0.58,
}: {
  readonly id: SceneWorldProps['id'];
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly stretch: number;
  readonly flatten: number;
  readonly angle: number;
  readonly pose: CharacterPerformance;
  readonly opacity?: number;
}) {
  return (
    <g
      data-motif="shadow"
      data-shadow-elongation={n(stretch / flatten)}
      transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(
        stretch,
      )} ${n(flatten)})`}
      opacity={opacity}
    >
      <CinematicCharacter
        id={(part) => id(`projected-shadow-${part}`)}
        x={0}
        y={0}
        scale={scale}
        appearance={SHADOW_APPEARANCE}
        performance={pose}
        className="scene-projected-shadow"
      />
    </g>
  );
}

function Fence({
  paint,
  y,
  height = 210,
  slant = 0,
  dark = false,
}: {
  readonly paint: SceneWorldProps['paint'];
  readonly y: number;
  readonly height?: number;
  readonly slant?: number;
  readonly dark?: boolean;
}) {
  const base = dark ? '#50465a' : '#9b684d';
  const edge = dark ? '#77697c' : '#d2a071';
  return (
    <g data-motif="fence">
      <path d={`M0,${n(y + 62)} L1200,${n(y + 42 + slant)}`} stroke={base} strokeWidth={22} />
      <path d={`M0,${n(y + 148)} L1200,${n(y + 122 + slant)}`} stroke={base} strokeWidth={18} />
      <g filter={paint('shadow-timber')}>
        {range(13).map((index) => {
          const x = index * 100 - 20;
          const top = y - (index % 3) * 13 + (slant * index) / 13;
          return (
            <path
              key={index}
              d={`M${x},${n(top + height)} L${x + 7},${n(top + 18)} L${x + 40},${n(
                top - 8,
              )} L${x + 72},${n(top + 17)} L${x + 78},${n(top + height)} Z`}
              fill={base}
              stroke={edge}
              strokeWidth={3}
              opacity={0.96}
            />
          );
        })}
      </g>
    </g>
  );
}

function GrassTufts({
  seed,
  baseY,
  count,
  color,
  height,
  lean,
}: {
  readonly seed: number;
  readonly baseY: number;
  readonly count: number;
  readonly color: string;
  readonly height: number;
  readonly lean: number;
}) {
  const rand = mulberry32(seed);
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      {range(count).map((index) => {
        const x = n(rand() * VIEW_W);
        const h = n(height * (0.55 + rand() * 0.75));
        const sway = n(lean * (0.65 + rand() * 0.7));
        return (
          <path
            key={index}
            d={`M${x},${baseY} Q${n(x + sway * 0.35)},${n(
              baseY - h * 0.55,
            )} ${n(x + sway)},${n(baseY - h)}`}
            strokeWidth={n(2 + rand() * 2.8)}
            opacity={n(0.42 + rand() * 0.46)}
          />
        );
      })}
    </g>
  );
}

function FlowerBed({ seed }: { readonly seed: number }) {
  const rand = mulberry32(seed);
  return (
    <g className="scene-flower-bed" data-motif="flower-bed">
      <path d="M820,662 C944,602 1084,612 1200,570 L1200,800 L792,800 Z" fill="#25453e" />
      {range(11).map((index) => {
        const x = n(842 + rand() * 322);
        const y = n(618 + rand() * 112);
        const height = n(24 + rand() * 38);
        const petal = index % 3 === 0 ? '#e7bd68' : index % 3 === 1 ? '#d78a86' : '#b89ac0';
        return (
          <g key={index}>
            <path d={`M${x},${y} Q${n(x + 5)},${n(y - height * 0.5)} ${n(x + 2)},${n(y - height)}`} fill="none" stroke="#607a4f" strokeWidth={4} strokeLinecap="round" />
            <path d={`M${n(x + 2)},${n(y - height)} C${n(x - 10)},${n(y - height - 12)} ${n(
              x - 18,
            )},${n(y - height + 4)} ${n(x + 2)},${n(y - height + 8)} C${n(
              x + 20,
            )},${n(y - height + 2)} ${n(x + 14)},${n(y - height - 13)} ${n(
              x + 2,
            )},${n(y - height)} Z`}
              fill={petal}
              opacity={0.82}
            />
          </g>
        );
      })}
    </g>
  );
}

function SculptedTree({
  paint,
  x,
  baseY,
  scale = 1,
}: {
  readonly paint: SceneWorldProps['paint'];
  readonly x: number;
  readonly baseY: number;
  readonly scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${baseY}) scale(${scale})`} data-motif="tree">
      <path
        d="M-82,88 C-54,-44 -72,-174 -28,-292 C-2,-360 38,-356 56,-286 C78,-204 52,-104 96,78 Z"
        fill="#493a35"
        filter={paint('shadow-timber')}
      />
      <path d="M-30,-280 C-134,-350 -226,-326 -274,-242 C-220,-214 -186,-164 -118,-166 C-186,-90 -98,-38 -22,-76 Z" fill="#294d43" />
      <path d="M22,-304 C104,-382 230,-338 270,-242 C218,-214 190,-168 120,-166 C188,-92 106,-34 28,-74 Z" fill="#24443f" />
      <path d="M-112,-202 C-46,-266 48,-260 118,-202 C88,-116 6,-86 -82,-118 Z" fill="#365d49" />
      <path d="M-56,-276 C4,-326 76,-306 122,-254" fill="none" stroke="#718160" strokeWidth={14} opacity={0.36} />
    </g>
  );
}

function ShadowDog({ x, y, scale = 1 }: { readonly x: number; readonly y: number; readonly scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#172238" opacity={0.68} data-motif="shadow-dog">
      <path d="M-76,10 C-54,-24 18,-30 56,-4 C76,10 78,38 58,50 C14,66 -54,58 -76,30 Z" />
      <path d="M48,-2 C70,-38 112,-24 116,10 C118,36 92,48 64,38 Z" />
      <path d="M64,-22 L70,-66 L92,-30 Z M94,-26 L120,-58 L114,-8 Z" />
      <path d="M-74,8 Q-126,-42 -142,4" fill="none" stroke="#172238" strokeWidth={18} strokeLinecap="round" />
      <path d="M-46,42 L-42,92 M40,42 L48,92" stroke="#172238" strokeWidth={18} strokeLinecap="round" />
    </g>
  );
}

function ShadowRabbit({ x, y, scale = 1 }: { readonly x: number; readonly y: number; readonly scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#172238" opacity={0.62} data-motif="shadow-rabbit">
      <path d="M-86,36 C-68,-18 8,-34 76,4 C102,20 96,64 64,78 C6,102 -70,86 -86,36 Z" />
      <circle cx={68} cy={-8} r={36} />
      <path d="M52,-36 C38,-104 56,-132 74,-70 L82,-34 Z M78,-38 C84,-110 110,-126 104,-54 L100,-24 Z" />
      <circle cx={-84} cy={16} r={19} />
    </g>
  );
}

function Teddy({ x, y, scale = 1 }: { readonly x: number; readonly y: number; readonly scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} data-motif="teddy">
      <circle cx={-30} cy={-40} r={21} fill="#8a5a3d" />
      <circle cx={30} cy={-40} r={21} fill="#8a5a3d" />
      <circle cx={0} cy={-16} r={44} fill="#a87650" />
      <ellipse cx={0} cy={54} rx={58} ry={56} fill="#986744" />
      <path d="M-42,34 Q-82,72 -64,108 M42,34 Q82,72 64,108" fill="none" stroke="#986744" strokeWidth={28} strokeLinecap="round" />
      <path d="M-12,-20 q12,12 24,0" fill="none" stroke="#4b3028" strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={0} cy={-4} rx={11} ry={8} fill="#4b3028" />
    </g>
  );
}

function TeddyShadow({ x, y, scale = 1 }: { readonly x: number; readonly y: number; readonly scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#12182c" opacity={0.52} data-motif="shadow">
      <g data-motif="teddy-shadow">
        <circle cx={-34} cy={-48} r={25} />
        <circle cx={34} cy={-48} r={25} />
        <circle cx={0} cy={-18} r={52} />
        <ellipse cx={0} cy={62} rx={72} ry={66} />
        <path d="M-54,34 Q-98,74 -76,126 M54,34 Q98,74 76,126" fill="none" stroke="#12182c" strokeWidth={34} strokeLinecap="round" />
      </g>
    </g>
  );
}

function PageOne(props: SceneWorldProps) {
  const sceneId = 'shadow-01-morning-meet';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={1} materials={YARD_MATERIALS}>
      <Sky fill={props.paint('shadowSky1')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.88 }}>
        <Practical paint={props.paint} id="shadow-sun-1" x={62} y={420} radius={48} source="low-sun" core="#ffd388" />
        <path d="M0,522 C180,420 342,438 510,370 C692,294 900,360 1200,276 L1200,598 L0,598 Z" fill="#66736c" />
        <path d="M0,568 C246,480 444,522 632,446 C850,358 1018,430 1200,394 L1200,628 L0,628 Z" fill="#465c58" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,544 C252,516 456,554 678,526 C896,496 1064,528 1200,502 L1200,800 L0,800 Z" fill={props.paint('shadowGrassWarm')} />
          <path d="M716,548 C852,514 1034,518 1200,476 L1200,800 L690,800 Z" fill="#314b43" />
        </g>
        <Fence paint={props.paint} y={472} height={196} slant={-8} />
        <FlowerBed seed={props.seed + 41} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <ProjectedShadow id={props.id} x={270} y={650} scale={0.78} stretch={5.1} flatten={0.25} angle={-8} pose={LEO_WAVE} opacity={0.54} />
        <LitCharacter
          id={props.id}
          x={270}
          y={650}
          scale={0.78}
          appearance={LEO_APPEARANCE}
          performance={LEO_WAVE}
          className="scene-leo"
          lightKey="#ffd79b"
          lightFill="#87a9bd"
          lightRim="#ffe6bb"
        />
        <path d="M340,690 C518,646 678,620 872,568" fill="none" stroke="#f5ca83" strokeWidth={12} opacity={0.34} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="near">
        <GrassTufts seed={props.seed + 2} baseY={800} count={64} color="#213b38" height={72} lean={12} />
        <path d="M972,800 C1008,710 1098,680 1200,704 L1200,800 Z" fill="#183137" />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageTwo(props: SceneWorldProps) {
  const sceneId = 'shadow-02-copycat-shapes';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={2} materials={YARD_MATERIALS}>
      <Sky fill={props.paint('shadowSky2')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.86 }}>
        <Practical paint={props.paint} id="shadow-sun-2" x={1050} y={180} radius={42} source="sun" core="#ffd99a" />
        <path d="M0,472 C240,418 420,446 630,398 C840,350 1010,388 1200,348 L1200,558 L0,558 Z" fill="#53655f" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,532 C240,502 422,546 660,506 C880,470 1034,502 1200,472 L1200,800 L0,800 Z" fill="#4e704f" />
          <path d="M0,648 C230,594 470,638 708,590 C928,546 1070,574 1200,548 L1200,800 L0,800 Z" fill="#385544" />
        </g>
        <Fence paint={props.paint} y={390} height={254} slant={18} />
        <ShadowDog x={920} y={430} scale={0.86} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <ProjectedShadow id={props.id} x={548} y={672} scale={0.92} stretch={2.5} flatten={0.42} angle={8} pose={LEO_JUMP} opacity={0.58} />
        <LitCharacter
          id={props.id}
          x={520}
          y={650}
          scale={0.92}
          appearance={LEO_APPEARANCE}
          performance={LEO_JUMP}
          className="scene-leo"
          lightKey="#ffd099"
          lightFill="#7c9fba"
          lightRim="#f7d2a2"
        />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,718 C92,686 158,704 234,800 Z" fill="#203a37" />
        <GrassTufts seed={props.seed + 7} baseY={800} count={58} color="#29463b" height={66} lean={-8} />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageThree(props: SceneWorldProps) {
  const sceneId = 'shadow-03-shadow-tag';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={3} materials={YARD_MATERIALS}>
      <Sky fill={props.paint('shadowSky3')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.8, saturation: 0.82 }}>
        <Practical paint={props.paint} id="shadow-sun-3" x={990} y={190} radius={38} source="sun-through-leaves" core="#eec28d" />
        <path d="M0,484 C216,426 402,454 590,406 C806,350 1018,394 1200,346 L1200,570 L0,570 Z" fill="#425b57" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,520 C216,498 442,542 666,508 C890,474 1046,498 1200,476 L1200,800 L0,800 Z" fill="#375643" />
          <path d="M0,684 C246,622 428,664 650,620 C888,574 1062,604 1200,580 L1200,800 L0,800 Z" fill="#293f3b" />
        </g>
        <SculptedTree paint={props.paint} x={735} baseY={620} scale={1.12} />
        <path d="M256,710 C366,620 518,594 680,632 C828,668 922,656 1014,586" fill="none" stroke="#8e805c" strokeWidth={30} opacity={0.42} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <ProjectedShadow id={props.id} x={708} y={674} scale={0.76} stretch={2.05} flatten={0.36} angle={28} pose={LEO_RUN} opacity={0.5} />
        <LitCharacter
          id={props.id}
          x={590}
          y={674}
          scale={0.78}
          appearance={LEO_APPEARANCE}
          performance={LEO_RUN}
          className="scene-leo"
          lightKey="#edb67d"
          lightFill="#7797ad"
          lightRim="#f5c894"
        />
        <path d="M414,658 C502,590 592,578 682,612" fill="none" stroke="#d7bc7b" strokeWidth={9} opacity={0.38} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,680 C96,642 184,684 270,800 Z" fill="#193331" />
        <GrassTufts seed={props.seed + 11} baseY={800} count={70} color="#1e3834" height={78} lean={16} />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageFour(props: SceneWorldProps) {
  const sceneId = 'shadow-04-tiny-noon';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={4} materials={YARD_MATERIALS}>
      <Sky fill={props.paint('shadowSky4')} paint={props.paint} fillOpacity={0.15} />
      <DepthLayer depth="far" treatment={{ opacity: 0.82 }}>
        <Practical paint={props.paint} id="shadow-sun-4" x={620} y={84} radius={34} source="high-sun" core="#f4d5a0" />
        <path d="M0,350 C276,306 480,330 694,306 C922,280 1068,302 1200,282 L1200,468 L0,468 Z" fill="#59615b" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <ellipse cx={600} cy={610} rx={670} ry={360} fill="#53694d" />
          <ellipse cx={600} cy={624} rx={492} ry={252} fill="#627754" />
          <path d="M0,376 L1200,326" stroke="#6d4f48" strokeWidth={38} />
        </g>
        <Fence paint={props.paint} y={244} height={198} slant={-48} dark />
      </DepthLayer>
      <DepthLayer depth="focus">
        <ProjectedShadow id={props.id} x={606} y={692} scale={1.02} stretch={0.58} flatten={0.24} angle={2} pose={LEO_LOOK_DOWN} opacity={0.7} />
        <LitCharacter
          id={props.id}
          x={606}
          y={684}
          scale={1.02}
          appearance={LEO_APPEARANCE}
          performance={LEO_LOOK_DOWN}
          className="scene-leo"
          lightKey="#f1c58c"
          lightFill="#7290ae"
          lightRim="#ddc09b"
        />
        <ellipse cx={606} cy={700} rx={74} ry={22} fill="#182238" opacity={0.46} data-motif="shadow" data-shadow-elongation="1.12" />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,702 C112,670 212,696 296,800 Z M1200,800 L1200,694 C1096,668 1008,700 934,800 Z" fill="#233b38" />
        <GrassTufts seed={props.seed + 17} baseY={800} count={42} color="#2e4840" height={52} lean={2} />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageFive(props: SceneWorldProps) {
  const sceneId = 'shadow-05-giant-evening';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={5} materials={YARD_MATERIALS}>
      <Sky fill={props.paint('shadowSky5')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.9 }}>
        <Practical paint={props.paint} id="shadow-sun-5" x={28} y={542} radius={54} source="setting-sun" core="#ffbf6c" />
        <path d="M0,500 C188,424 382,458 574,398 C790,330 1008,382 1200,326 L1200,570 L0,570 Z" fill="#514d58" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,560 C220,528 418,562 642,522 C862,484 1056,510 1200,476 L1200,800 L0,800 Z" fill="#354b42" />
          <path d="M0,684 C236,620 430,666 684,610 C906,560 1066,590 1200,558 L1200,800 L0,800 Z" fill="#28383b" />
        </g>
        <Fence paint={props.paint} y={334} height={314} slant={-14} />
        <g data-motif="shadow" data-shadow-elongation="14.2" opacity={0.68}>
          <path d="M278,674 C396,532 560,410 748,286 C860,212 988,122 1154,28 L1200,54 L1200,548 C1038,512 864,536 688,590 C522,640 398,690 278,726 Z" fill="#162038" />
          <circle cx={1000} cy={150} r={88} fill="#162038" />
          <path d="M936,184 L832,20 M1064,184 L1172,16" stroke="#162038" strokeWidth={62} strokeLinecap="round" />
        </g>
        <ShadowRabbit x={934} y={402} scale={1.08} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <ProjectedShadow id={props.id} x={286} y={690} scale={0.82} stretch={4.2} flatten={0.3} angle={-14} pose={LEO_PROUD} opacity={0.5} />
        <LitCharacter
          id={props.id}
          x={286}
          y={690}
          scale={0.82}
          appearance={LEO_APPEARANCE}
          performance={LEO_PROUD}
          className="scene-leo"
          lightKey="#ffb36b"
          lightFill="#7283aa"
          lightRim="#ffd09d"
        />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,718 C118,670 224,714 314,800 Z" fill="#1b2d35" />
        <GrassTufts seed={props.seed + 23} baseY={800} count={66} color="#203438" height={78} lean={24} />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageSix(props: SceneWorldProps) {
  const sceneId = 'shadow-06-dusk-fade';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={6} materials={YARD_MATERIALS}>
      <Sky fill={props.paint('shadowSky6')} paint={props.paint} fillOpacity={0.2} />
      <DepthLayer depth="far" treatment={{ opacity: 0.82, saturation: 0.72 }}>
        <StarField seed={props.seed} count={28} x={70} y={38} width={1060} height={270} color="#dce4f5" minR={1} maxR={2.5} />
        <Practical paint={props.paint} id="shadow-moon-6" x={1050} y={130} radius={32} source="moon" core="#dce4e8" />
        <path d="M0,478 C218,420 412,452 616,402 C830,350 1018,388 1200,346 L1200,570 L0,570 Z" fill="#33425a" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,548 C236,518 444,556 678,520 C888,488 1058,510 1200,480 L1200,800 L0,800 Z" fill={props.paint('shadowGrassCool')} />
          <path d="M0,690 C256,634 470,670 706,626 C910,586 1060,604 1200,580 L1200,800 L0,800 Z" fill="#1c3038" />
        </g>
        <Fence paint={props.paint} y={448} height={202} dark />
        <ellipse cx={650} cy={690} rx={142} ry={22} fill="#172238" opacity={0.2} data-motif="shadow" data-shadow-elongation="6.45" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={520}
          y={702}
          scale={0.68}
          appearance={LEO_APPEARANCE}
          performance={LEO_CALM}
          className="scene-leo"
          lightKey="#c89583"
          lightFill="#7086ac"
          lightRim="#b9cae0"
        />
        <LitCharacter
          id={props.id}
          x={648}
          y={704}
          scale={0.7}
          appearance={MOM_APPEARANCE}
          performance={MOM_CALM}
          className="scene-mom"
          lightKey="#c89583"
          lightFill="#7086ac"
          lightRim="#b9cae0"
        />
        <path d="M588,530 Q610,514 632,526" fill="none" stroke="#d7b3a2" strokeWidth={10} opacity={0.62} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,714 C112,680 204,714 280,800 Z M1200,800 L1200,706 C1110,682 1026,716 952,800 Z" fill="#152732" />
        <GrassTufts seed={props.seed + 29} baseY={800} count={54} color="#1a2d35" height={58} lean={4} />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageSeven(props: SceneWorldProps) {
  const sceneId = 'shadow-07-nightlight-teddy';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={7} materials={BEDROOM_MATERIALS} calm>
      <Sky fill={props.paint('shadowRoomWall')} paint={props.paint} fillOpacity={0.13} />
      <DepthLayer depth="far" treatment={{ opacity: 0.78, saturation: 0.76 }}>
        <rect x={842} y={72} width={246} height={252} rx={18} fill="#101a32" stroke="#52658e" strokeWidth={12} />
        <StarField seed={props.seed} count={20} x={864} y={92} width={204} height={210} color="#cfd9ef" minR={1} maxR={2.4} />
        <path d="M958,80 L958,316 M850,198 L1080,198" stroke="#52658e" strokeWidth={9} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={props.paint('shadowRoomWall')} opacity={0.38} />
          <path d="M0,610 L1200,610 L1200,800 L0,800 Z" fill="#111a32" />
          <path d="M260,584 C432,524 716,534 938,608 L938,790 L248,790 Z" fill="#4b5687" />
        </g>
        <TeddyShadow x={688} y={298} scale={1.45} />
        <Practical paint={props.paint} id="shadow-nightlight-7" x={218} y={520} radius={28} source="nightlight" core="#ffd181" />
        <g filter={props.paint('shadow-bedwood')}>
          <path d="M228,560 L278,560 L286,788 L222,788 Z M916,560 L962,560 L970,788 L910,788 Z" fill="#614536" />
          <path d="M238,554 Q600,462 948,558" fill="none" stroke="#775540" strokeWidth={30} strokeLinecap="round" />
        </g>
      </DepthLayer>
      <DepthLayer depth="focus">
        <path
          d="M246,644 C410,566 704,562 938,652 L938,790 L246,790 Z"
          fill={props.paint('shadowQuilt')}
          filter={props.paint('shadow-quilt')}
          data-motif="quilt"
        />
        <ellipse cx={468} cy={680} rx={124} ry={48} fill="#dce1f2" opacity={0.9} />
        <LitCharacter
          id={props.id}
          x={520}
          y={724}
          scale={1.04}
          appearance={LEO_APPEARANCE}
          performance={LEO_SLEEP}
          className="scene-leo"
          lightKey="#ffd08a"
          lightFill="#5b75a0"
          lightRim="#8fa9d0"
        />
        <path
          d="M390,700 C506,654 642,666 724,724 L724,786 L382,786 Z"
          fill={props.paint('shadowQuilt')}
          opacity={0.94}
        />
        <Teddy x={786} y={636} scale={0.82} />
        <path d="M294,670 C482,612 724,620 908,692" fill="none" stroke="#9ea8d6" strokeWidth={12} opacity={0.28} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,682 C96,644 164,678 226,800 Z M1200,800 L1200,668 C1106,646 1034,684 978,800 Z" fill="#0d162b" />
        <path d="M80,800 C116,714 168,690 228,710 L252,800 Z" fill="#18223e" />
      </DepthLayer>
    </SceneFrame>
  );
}

const PAGES: Record<string, (props: SceneWorldProps) => ReactNode> = {
  'shadow-01-morning-meet': PageOne,
  'shadow-02-copycat-shapes': PageTwo,
  'shadow-03-shadow-tag': PageThree,
  'shadow-04-tiny-noon': PageFour,
  'shadow-05-giant-evening': PageFive,
  'shadow-06-dusk-fade': PageSix,
  'shadow-07-nightlight-teddy': PageSeven,
};

export const shadowWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
