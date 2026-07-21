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

const NADIA_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#9b684c', shadow: '#6e463b', highlight: '#c88c68' },
  face: { shape: 'heart', brow: '#2d1c1a', mouth: '#713944' },
  hair: { style: 'long', base: '#2f1d1a', highlight: '#5d362b', volume: 0.72 },
  wardrobe: {
    garment: 'dress',
    base: '#e9a94f',
    shadow: '#a8643c',
    trim: '#f6d78d',
    hemline: 0.58,
  },
  footwear: { style: 'boot', base: '#2d3f51' },
  secondaryShapes: [{ kind: 'sash', color: '#2f6975', accent: '#9dc4c6' }],
};

const GRANDPA_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('elder'),
  skin: { base: '#a87658', shadow: '#725044', highlight: '#d1a17e' },
  face: { shape: 'square', brow: '#e1ddd2', mouth: '#75414a' },
  hair: { style: 'wispy', base: '#ded9cf', highlight: '#f3efe6', volume: 0.4 },
  wardrobe: {
    garment: 'tunic',
    base: '#4d8379',
    shadow: '#315b59',
    trim: '#a8c6a6',
    hemline: 0.5,
  },
  footwear: { style: 'boot', base: '#4b392d' },
  secondaryShapes: [{ kind: 'belt', color: '#776044', accent: '#ccb477' }],
};

const performance = (
  overrides: Partial<CharacterPerformance>,
): CharacterPerformance => ({
  pose: 'stand',
  lineOfAction: 0,
  shoulderTilt: -5,
  pelvisTilt: 5,
  weightFoot: 'center',
  gazeTarget: { x: 650, y: 350 },
  headTurn: 0,
  expression: 'delighted',
  leftHand: 'open',
  rightHand: 'open',
  ...overrides,
});

const NADIA_HUG = performance({
  pose: 'reach',
  lineOfAction: -6,
  shoulderTilt: -12,
  pelvisTilt: 7,
  weightFoot: 'left',
  gazeTarget: { x: 642, y: 430 },
  headTurn: 0.52,
  leftHand: 'hold',
  rightHand: 'hold',
  leftHandTarget: { x: 566, y: 512 },
  rightHandTarget: { x: 642, y: 500 },
});

const NADIA_RUN = performance({
  pose: 'reach',
  lineOfAction: 28,
  shoulderTilt: 15,
  pelvisTilt: -11,
  weightFoot: 'right',
  gazeTarget: { x: 314, y: 608 },
  headTurn: -0.58,
  expression: 'uncertain',
  leftHand: 'hold',
  rightHand: 'open',
  leftHandTarget: { x: 540, y: 498 },
  rightHandTarget: { x: 830, y: 426 },
});

const NADIA_POINT = performance({
  pose: 'point',
  lineOfAction: -10,
  shoulderTilt: -16,
  pelvisTilt: 8,
  weightFoot: 'left',
  gazeTarget: { x: 1000, y: 314 },
  headTurn: 0.72,
  expression: 'curious',
  leftHand: 'rest',
  rightHand: 'point',
  rightHandTarget: { x: 890, y: 320 },
});

const NADIA_STRING = performance({
  pose: 'reach',
  lineOfAction: 12,
  shoulderTilt: 11,
  pelvisTilt: -9,
  weightFoot: 'right',
  gazeTarget: { x: 820, y: 214 },
  headTurn: 0.7,
  expression: 'delighted',
  leftHand: 'hold',
  rightHand: 'hold',
  leftHandTarget: { x: 370, y: 480 },
  rightHandTarget: { x: 440, y: 468 },
});

const NADIA_LOOK_UP = performance({
  pose: 'stand',
  lineOfAction: 8,
  shoulderTilt: 8,
  pelvisTilt: -6,
  weightFoot: 'right',
  gazeTarget: { x: 714, y: 112 },
  headTurn: 0.64,
  expression: 'delighted',
  leftHand: 'hold',
  rightHand: 'hold',
  leftHandTarget: { x: 470, y: 590 },
  rightHandTarget: { x: 514, y: 576 },
});

const NADIA_CATCH = performance({
  pose: 'reach',
  lineOfAction: -9,
  shoulderTilt: -14,
  pelvisTilt: 8,
  weightFoot: 'left',
  gazeTarget: { x: 520, y: 470 },
  headTurn: -0.35,
  expression: 'calm',
  leftHand: 'cup',
  rightHand: 'cup',
  leftHandTarget: { x: 470, y: 438 },
  rightHandTarget: { x: 586, y: 432 },
});

const NADIA_SLEEP = performance({
  pose: 'sleep',
  lineOfAction: -7,
  shoulderTilt: 2,
  pelvisTilt: -3,
  weightFoot: 'center',
  gazeTarget: { x: 420, y: 650 },
  headTurn: -0.28,
  expression: 'sleeping',
  leftHand: 'rest',
  rightHand: 'rest',
});

const GRANDPA_STAND = performance({
  pose: 'stand',
  lineOfAction: 2,
  shoulderTilt: -4,
  pelvisTilt: 6,
  weightFoot: 'left',
  gazeTarget: { x: 610, y: 480 },
  headTurn: -0.48,
  expression: 'calm',
  leftHand: 'rest',
  rightHand: 'open',
});

const GRANDPA_WATCH = performance({
  pose: 'stand',
  lineOfAction: -2,
  shoulderTilt: 5,
  pelvisTilt: -5,
  weightFoot: 'right',
  gazeTarget: { x: 638, y: 530 },
  headTurn: -0.72,
  expression: 'calm',
  leftHand: 'rest',
  rightHand: 'rest',
});

const GRANDPA_RELEASE = performance({
  pose: 'reach',
  lineOfAction: -8,
  shoulderTilt: -15,
  pelvisTilt: 8,
  weightFoot: 'left',
  gazeTarget: { x: 824, y: 204 },
  headTurn: 0.65,
  expression: 'delighted',
  leftHand: 'open',
  rightHand: 'open',
  leftHandTarget: { x: 670, y: 330 },
  rightHandTarget: { x: 824, y: 292 },
});

const GRANDPA_LOOK_UP = performance({
  pose: 'stand',
  lineOfAction: 4,
  shoulderTilt: -3,
  pelvisTilt: 6,
  weightFoot: 'left',
  gazeTarget: { x: 708, y: 110 },
  headTurn: 0.62,
  expression: 'delighted',
  leftHand: 'rest',
  rightHand: 'open',
});

const GRANDPA_PROUD = performance({
  pose: 'reach',
  lineOfAction: -4,
  shoulderTilt: -10,
  pelvisTilt: 7,
  weightFoot: 'left',
  gazeTarget: { x: 526, y: 490 },
  headTurn: -0.58,
  expression: 'delighted',
  leftHand: 'rest',
  rightHand: 'open',
  rightHandTarget: { x: 632, y: 520 },
});

const OUTDOOR_MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'wind-kite-cloth',
    preset: 'cloth',
    base: '#d83d38',
    shadow: '#8e2730',
    highlight: '#f27b62',
    textureScale: 0.28,
    roughness: 0.48,
  },
  {
    id: 'wind-kite-spar',
    preset: 'timber',
    base: '#7a4b36',
    shadow: '#3f2c2d',
    highlight: '#b87b50',
    textureScale: 0.44,
    roughness: 0.66,
  },
];

const BEDROOM_MATERIALS: readonly MaterialInstance[] = [
  ...OUTDOOR_MATERIALS,
  {
    id: 'wind-room-cloth',
    preset: 'cloth',
    base: '#6874aa',
    shadow: '#343e70',
    highlight: '#a3acd6',
    textureScale: 0.26,
    roughness: 0.62,
  },
];

const LIGHTING: Record<string, LightingRig> = {
  'wind-01-hilltop-kite': {
    key: { azimuth: -22, elevation: 30, color: '#ffd49a', intensity: 0.78 },
    fill: { color: '#7da5be', intensity: 0.22 },
    rim: { azimuth: 156, elevation: 24, color: '#ffe0ad', intensity: 0.3 },
    practicals: [
      { id: 'wind-sun-1', x: 84, y: 270, radius: 320, color: '#ffb65f', intensity: 0.52 },
    ],
  },
  'wind-02-flop-run': {
    key: { azimuth: -10, elevation: 28, color: '#f8c58e', intensity: 0.73 },
    fill: { color: '#789cb8', intensity: 0.23 },
    rim: { azimuth: 168, elevation: 22, color: '#f1cf9f', intensity: 0.26 },
    practicals: [
      { id: 'wind-sun-2', x: 1020, y: 192, radius: 280, color: '#eda25f', intensity: 0.44 },
    ],
  },
  'wind-03-reading-clues': {
    key: { azimuth: -2, elevation: 25, color: '#efbc84', intensity: 0.7 },
    fill: { color: '#7295af', intensity: 0.24 },
    rim: { azimuth: 174, elevation: 20, color: '#e7c69c', intensity: 0.27 },
    practicals: [
      { id: 'wind-sun-3', x: 140, y: 180, radius: 270, color: '#e69c5c', intensity: 0.4 },
    ],
  },
  'wind-04-first-lift': {
    key: { azimuth: -14, elevation: 22, color: '#f4ba7b', intensity: 0.8 },
    fill: { color: '#6f91ad', intensity: 0.22 },
    rim: { azimuth: 158, elevation: 24, color: '#ffd09a', intensity: 0.32 },
    practicals: [
      { id: 'wind-sun-4', x: 1060, y: 154, radius: 300, color: '#e88950', intensity: 0.46 },
    ],
  },
  'wind-05-dancing-high': {
    key: { azimuth: -24, elevation: 17, color: '#eeb276', intensity: 0.72 },
    fill: { color: '#6c86aa', intensity: 0.24 },
    rim: { azimuth: 148, elevation: 22, color: '#e9c99d', intensity: 0.28 },
    practicals: [
      { id: 'wind-sun-5', x: 34, y: 490, radius: 340, color: '#e7764b', intensity: 0.48 },
    ],
  },
  'wind-06-winding-in': {
    key: { azimuth: -34, elevation: 12, color: '#ffb268', intensity: 0.78 },
    fill: { color: '#7284aa', intensity: 0.23 },
    rim: { azimuth: 142, elevation: 20, color: '#ffd09e', intensity: 0.32 },
    practicals: [
      { id: 'wind-sun-6', x: 94, y: 520, radius: 350, color: '#ef7547', intensity: 0.58 },
    ],
  },
  'wind-07-resting-kite': {
    key: { azimuth: 20, elevation: 18, color: '#ffd18a', intensity: 0.58 },
    fill: { color: '#536d98', intensity: 0.21 },
    rim: { azimuth: 162, elevation: 18, color: '#8da8d2', intensity: 0.23 },
    practicals: [
      { id: 'wind-lamp-7', x: 1040, y: 520, radius: 310, color: '#f2a34e', intensity: 0.54 },
    ],
  },
};

function Defs({ id }: SceneWorldProps): ReactNode {
  const skies = [
    ['windSky1', '#657f9c', '#e5ad72'],
    ['windSky2', '#596f8f', '#cd8d68'],
    ['windSky3', '#4b6383', '#b87869'],
    ['windSky4', '#3d5478', '#9f686d'],
    ['windSky5', '#2e3e64', '#73566e'],
    ['windSky6', '#243354', '#ce6e54'],
    ['windSky7', '#0d1730', '#29375e'],
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
            { offset: 1, color: '#e7a36b' },
          ]}
        />
      ))}
      <LinearGradient
        id={id('windHillWarm')}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
        stops={[
          { offset: 0, color: '#6f8356' },
          { offset: 0.5, color: '#425d4a' },
          { offset: 1, color: '#263b3f' },
        ]}
      />
      <LinearGradient
        id={id('windHillCool')}
        stops={[
          { offset: 0, color: '#3a5150' },
          { offset: 1, color: '#182b38' },
        ]}
      />
      <LinearGradient
        id={id('windRoomWall')}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
        stops={[
          { offset: 0, color: '#151f3c' },
          { offset: 0.62, color: '#27345d' },
          { offset: 1, color: '#3a406a' },
        ]}
      />
      <LinearGradient
        id={id('windQuilt')}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
        stops={[
          { offset: 0, color: '#8993c5' },
          { offset: 0.58, color: '#5e6ca4' },
          { offset: 1, color: '#374173' },
        ]}
      />
      <RadialGradient
        id={id('windVignette')}
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
      <Vignette paint={paint('windVignette')} />
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
      <circle cx={x} cy={y} r={radius * 2.2} fill={paint(id)} />
      <circle cx={x} cy={y} r={radius} fill={core} />
      <circle cx={x - radius * 0.24} cy={y - radius * 0.25} r={radius * 0.28} fill="#fff3c7" opacity={0.62} />
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
  motif,
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
  readonly motif?: string;
  readonly lightKey: string;
  readonly lightFill: string;
  readonly lightRim: string;
}) {
  const geometry = resolvePoseGeometry(appearance, pose, { x, y, scale });
  const headRadius = appearance.proportions.headRadius * scale;
  const feetX = (geometry.foot.left.x + geometry.foot.right.x) / 2;
  const feetY = Math.max(geometry.foot.left.y, geometry.foot.right.y);
  return (
    <g
      className={className}
      data-character-lighting={className}
      data-motif={motif}
      data-cx={n(x)}
      data-cy={n(y)}
    >
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

function WindStream({
  y,
  strength = 'steady',
  opacity = 0.3,
  color = '#e8f1ee',
}: {
  readonly y: number;
  readonly strength?: 'steady' | 'gust' | 'gentle';
  readonly opacity?: number;
  readonly color?: string;
}) {
  const reach = strength === 'gust' ? 470 : strength === 'gentle' ? 250 : 360;
  return (
    <g
      className="scene-wind-streaks"
      data-motif="wind"
      data-wind-dir="right"
      data-wind-strength={strength}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      opacity={opacity}
    >
      {range(3).map((index) => {
        const start = 70 + index * 104;
        const yy = y + index * 62;
        return (
          <path
            key={index}
            d={`M${start},${yy} C${n(start + reach * 0.25)},${n(
              yy - 38,
            )} ${n(start + reach * 0.62)},${n(yy + 28)} ${n(
              start + reach,
            )},${n(yy - 12)}`}
            strokeWidth={n(4.2 - index * 0.7)}
          />
        );
      })}
    </g>
  );
}

function WindGrass({
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
    <g data-motif="wind" data-wind-dir="right" fill="none" stroke={color} strokeLinecap="round">
      {range(count).map((index) => {
        const x = n(rand() * VIEW_W);
        const h = n(height * (0.5 + rand() * 0.78));
        const sway = n(lean * (0.68 + rand() * 0.66));
        return (
          <path
            key={index}
            d={`M${x},${baseY} Q${n(x + sway * 0.42)},${n(
              baseY - h * 0.56,
            )} ${n(x + sway)},${n(baseY - h)}`}
            strokeWidth={n(2 + rand() * 3)}
            opacity={n(0.42 + rand() * 0.48)}
          />
        );
      })}
    </g>
  );
}

function CloudMass({
  x,
  y,
  scale = 1,
  fill = '#dce3df',
  opacity = 0.55,
}: {
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly fill?: string;
  readonly opacity?: number;
}) {
  return (
    <path
      d="M-132,34 C-116,-18 -68,-42 -22,-22 C8,-72 88,-68 104,-12 C158,-20 186,18 164,54 C104,70 -72,72 -132,34 Z"
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill={fill}
      opacity={opacity}
    />
  );
}

function Kite({
  paint,
  cx,
  cy,
  size,
  rotate = 0,
  state = 'flying',
}: {
  readonly paint: SceneWorldProps['paint'];
  readonly cx: number;
  readonly cy: number;
  readonly size: number;
  readonly rotate?: number;
  readonly state?: 'held' | 'flopped' | 'flying' | 'descending' | 'resting';
}) {
  const flopped = state === 'flopped';
  const right = size * (flopped ? 0.42 : 0.58);
  const left = size * (flopped ? 0.64 : 0.58);
  const bottom = size * (flopped ? 0.66 : 0.96);
  return (
    <g className="scene-kite-tug">
      <g
        className="scene-kite"
        data-motif="kite"
        data-kite-state={state}
        data-cx={n(cx)}
        data-cy={n(cy)}
        transform={`translate(${n(cx)} ${n(cy)}) rotate(${n(rotate)})`}
      >
        <path
          d={`M0,${n(-size)} L${n(right)},0 L0,${n(bottom)} L${n(-left)},0 Z`}
          fill="#d83d38"
          filter={paint('wind-kite-cloth')}
        />
        <path d={`M0,${n(-size)} L${n(right)},0 L0,${n(bottom)} Z`} fill="#ef715b" opacity={0.38} />
        <path d={`M0,${n(-size)} L0,${n(bottom)} M${n(-left)},0 L${n(right)},0`} fill="none" stroke="#744633" strokeWidth={n(size * 0.055)} strokeLinecap="round" filter={paint('wind-kite-spar')} />
        <path d={`M0,${n(bottom)} C${n(size * 0.42)},${n(size * 1.35)} ${n(
          -size * 0.44,
        )},${n(size * 1.75)} ${n(size * 0.28)},${n(size * 2.32)}`} fill="none" stroke="#962a31" strokeWidth={n(size * 0.035)} strokeLinecap="round" />
        {range(4).map((index) => {
          const yy = size * (1.2 + index * 0.31);
          const xx = (index % 2 === 0 ? 1 : -1) * size * (0.08 + index * 0.025);
          return (
            <g key={index} transform={`translate(${n(xx)} ${n(yy)}) rotate(${index % 2 === 0 ? 15 : -18})`}>
              <path d="M-2,0 C-16,-10 -28,-8 -32,0 C-26,8 -14,9 -2,0 Z" fill="#edc398" />
              <path d="M2,0 C16,-10 28,-8 32,0 C26,8 14,9 2,0 Z" fill="#d99caf" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

function KiteString({
  d,
  state,
}: {
  readonly d: string;
  readonly state: 'slack' | 'taut' | 'winding';
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke="#e9e4d8"
      strokeWidth={state === 'taut' ? 4 : 3}
      strokeLinecap="round"
      strokeDasharray={state === 'slack' ? '9 8' : undefined}
      opacity={0.88}
      data-motif="kite-string"
      data-string-state={state}
    />
  );
}

function Flag({
  x,
  y,
  scale = 1,
}: {
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} data-motif="wind" data-wind-dir="right">
      <path d="M0,190 L0,0" stroke="#5b5048" strokeWidth={12} strokeLinecap="round" />
      <path d="M6,12 C72,-12 132,38 194,8 L194,78 C132,104 74,48 6,80 Z" fill="#c83a3d" />
      <path d="M10,24 C78,12 130,58 188,26" fill="none" stroke="#f19b83" strokeWidth={8} opacity={0.45} />
    </g>
  );
}

function LeafFlight({ seed, y, count = 8 }: { readonly seed: number; readonly y: number; readonly count?: number }) {
  const rand = mulberry32(seed);
  return (
    <g data-motif="wind" data-wind-dir="right">
      {range(count).map((index) => {
        const x = 120 + index * 124 + rand() * 44;
        const yy = y + rand() * 120;
        const angle = -28 + rand() * 72;
        return (
          <path
            key={index}
            d="M-18,0 C-8,-18 14,-18 24,0 C10,10 -4,12 -18,0 Z"
            transform={`translate(${n(x)} ${n(yy)}) rotate(${n(angle)})`}
            fill={index % 2 === 0 ? '#87905b' : '#617b54'}
            opacity={0.8}
          />
        );
      })}
    </g>
  );
}

function PageOne(props: SceneWorldProps) {
  const sceneId = 'wind-01-hilltop-kite';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={1} materials={OUTDOOR_MATERIALS}>
      <Sky fill={props.paint('windSky1')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.86 }}>
        <Practical paint={props.paint} id="wind-sun-1" x={84} y={270} radius={44} source="low-sun" core="#ffd58f" />
        <CloudMass x={300} y={160} scale={0.82} />
        <CloudMass x={852} y={216} scale={1.08} fill="#d5ddd9" opacity={0.48} />
        <WindStream y={108} strength="steady" />
        <path d="M0,510 C230,400 430,438 648,360 C872,280 1046,340 1200,304 L1200,594 L0,594 Z" fill="#586b68" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M-80,800 C88,546 338,430 604,500 C822,558 978,490 1280,392 L1280,800 Z" fill={props.paint('windHillWarm')} />
          <path d="M0,738 C224,640 430,666 646,626 C864,586 1044,604 1200,560 L1200,800 L0,800 Z" fill="#314944" />
        </g>
        <Kite paint={props.paint} cx={650} cy={444} size={78} rotate={-9} state="held" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={430}
          y={704}
          scale={0.82}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_HUG}
          className="scene-nadia"
          motif="flyer"
          lightKey="#ffd49a"
          lightFill="#7da2bb"
          lightRim="#ffe0ad"
        />
        <LitCharacter
          id={props.id}
          x={788}
          y={704}
          scale={0.68}
          appearance={GRANDPA_APPEARANCE}
          performance={GRANDPA_STAND}
          className="scene-grandpa"
          lightKey="#ffd49a"
          lightFill="#7da2bb"
          lightRim="#ffe0ad"
        />
        <path d="M350,642 C544,578 718,584 904,512" fill="none" stroke="#d7c08a" strokeWidth={11} opacity={0.32} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="near">
        <WindGrass seed={props.seed} baseY={800} count={68} color="#1f3735" height={82} lean={32} />
        <path d="M0,800 L0,704 C112,670 210,710 294,800 Z" fill="#173033" />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageTwo(props: SceneWorldProps) {
  const sceneId = 'wind-02-flop-run';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={2} materials={OUTDOOR_MATERIALS}>
      <Sky fill={props.paint('windSky2')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.84 }}>
        <Practical paint={props.paint} id="wind-sun-2" x={1020} y={192} radius={38} source="sun" core="#f3ca8f" />
        <CloudMass x={270} y={178} scale={0.78} />
        <WindStream y={126} strength="gust" opacity={0.25} />
        <path d="M0,500 C216,434 402,464 596,416 C812,362 1012,402 1200,352 L1200,570 L0,570 Z" fill="#4d6260" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,548 C236,512 438,552 666,516 C884,480 1048,510 1200,474 L1200,800 L0,800 Z" fill="#4f694e" />
          <path d="M0,704 C256,636 460,680 704,628 C918,582 1060,602 1200,576 L1200,800 L0,800 Z" fill="#344b40" />
        </g>
        <Kite paint={props.paint} cx={286} cy={650} size={94} rotate={-70} state="flopped" />
        <KiteString d="M322,646 C438,584 548,660 650,574" state="slack" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={696}
          y={706}
          scale={0.88}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_RUN}
          className="scene-nadia"
          motif="flyer"
          lightKey="#f7c28d"
          lightFill="#789ab5"
          lightRim="#efcc9e"
        />
        <LitCharacter
          id={props.id}
          x={1020}
          y={704}
          scale={0.62}
          appearance={GRANDPA_APPEARANCE}
          performance={GRANDPA_WATCH}
          className="scene-grandpa"
          lightKey="#f7c28d"
          lightFill="#789ab5"
          lightRim="#efcc9e"
        />
      </DepthLayer>
      <DepthLayer depth="near">
        <WindGrass seed={props.seed + 7} baseY={800} count={72} color="#223d36" height={78} lean={38} />
        <path d="M1200,800 L1200,704 C1108,676 1028,712 950,800 Z" fill="#1a3032" />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageThree(props: SceneWorldProps) {
  const sceneId = 'wind-03-reading-clues';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={3} materials={OUTDOOR_MATERIALS}>
      <Sky fill={props.paint('windSky3')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.8, saturation: 0.8 }}>
        <Practical paint={props.paint} id="wind-sun-3" x={140} y={180} radius={36} source="sun" core="#efc58c" />
        <CloudMass x={348} y={164} scale={0.76} opacity={0.48} />
        <CloudMass x={840} y={226} scale={0.96} opacity={0.42} />
        <LeafFlight seed={props.seed} y={174} />
        <path d="M0,492 C220,430 410,458 608,412 C820,362 1024,400 1200,354 L1200,562 L0,562 Z" fill="#435a59" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,548 C236,510 452,554 676,514 C898,476 1050,504 1200,474 L1200,800 L0,800 Z" fill="#49604b" />
          <path d="M0,710 C240,642 462,680 706,630 C922,586 1062,602 1200,578 L1200,800 L0,800 Z" fill="#30463d" />
        </g>
        <Flag x={936} y={330} scale={0.9} />
        <WindGrass seed={props.seed + 11} baseY={634} count={42} color="#50674c" height={72} lean={46} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={550}
          y={706}
          scale={0.88}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_POINT}
          className="scene-nadia"
          motif="flyer"
          lightKey="#efba83"
          lightFill="#7293ae"
          lightRim="#e6c49b"
        />
        <LitCharacter
          id={props.id}
          x={314}
          y={706}
          scale={0.68}
          appearance={GRANDPA_APPEARANCE}
          performance={GRANDPA_WATCH}
          className="scene-grandpa"
          lightKey="#efba83"
          lightFill="#7293ae"
          lightRim="#e6c49b"
        />
        <path d="M642,484 C760,424 868,416 988,390" fill="none" stroke="#d9b37e" strokeWidth={8} opacity={0.38} strokeLinecap="round" />
      </DepthLayer>
      <DepthLayer depth="near">
        <WindGrass seed={props.seed + 17} baseY={800} count={76} color="#1f3733" height={86} lean={48} />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageFour(props: SceneWorldProps) {
  const sceneId = 'wind-04-first-lift';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={4} materials={OUTDOOR_MATERIALS}>
      <Sky fill={props.paint('windSky4')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.84 }}>
        <Practical paint={props.paint} id="wind-sun-4" x={1060} y={154} radius={38} source="sun" core="#efbf83" />
        <CloudMass x={290} y={172} scale={0.72} opacity={0.46} />
        <WindStream y={102} strength="gust" opacity={0.3} />
        <path d="M0,512 C228,438 408,466 612,412 C830,356 1028,400 1200,350 L1200,576 L0,576 Z" fill="#3e5357" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,562 C230,520 442,558 666,520 C886,482 1050,510 1200,476 L1200,800 L0,800 Z" fill="#415947" />
          <path d="M0,716 C250,650 456,680 700,634 C918,592 1064,606 1200,580 L1200,800 L0,800 Z" fill="#2d433d" />
        </g>
        <Kite paint={props.paint} cx={830} cy={214} size={84} rotate={-18} state="flying" />
        <KiteString d="M432,514 C548,454 672,350 830,214" state="taut" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={390}
          y={706}
          scale={0.86}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_STRING}
          className="scene-nadia"
          motif="flyer"
          lightKey="#f3b879"
          lightFill="#6f90ac"
          lightRim="#ffcf98"
        />
        <LitCharacter
          id={props.id}
          x={686}
          y={704}
          scale={0.72}
          appearance={GRANDPA_APPEARANCE}
          performance={GRANDPA_RELEASE}
          className="scene-grandpa"
          lightKey="#f3b879"
          lightFill="#6f90ac"
          lightRim="#ffcf98"
        />
      </DepthLayer>
      <DepthLayer depth="near">
        <WindGrass seed={props.seed + 23} baseY={800} count={70} color="#1d3633" height={82} lean={42} />
        <path d="M0,800 L0,714 C102,680 194,714 270,800 Z" fill="#172e32" />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageFive(props: SceneWorldProps) {
  const sceneId = 'wind-05-dancing-high';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={5} materials={OUTDOOR_MATERIALS}>
      <Sky fill={props.paint('windSky5')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.84, saturation: 0.78 }}>
        <Practical paint={props.paint} id="wind-sun-5" x={34} y={490} radius={44} source="setting-sun" core="#e9aa72" />
        <CloudMass x={272} y={176} scale={0.96} fill="#cbd2d2" opacity={0.36} />
        <CloudMass x={928} y={264} scale={0.76} fill="#c4ccd0" opacity={0.3} />
        <WindStream y={104} strength="steady" opacity={0.22} color="#d3dce1" />
        <path d="M0,566 C222,488 412,512 614,462 C834,408 1026,438 1200,394 L1200,620 L0,620 Z" fill="#344858" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,642 C244,594 450,628 678,596 C900,566 1056,584 1200,556 L1200,800 L0,800 Z" fill={props.paint('windHillCool')} />
        </g>
        <Kite paint={props.paint} cx={720} cy={128} size={54} rotate={12} state="flying" />
        <KiteString d="M486,648 C520,496 608,300 720,128" state="taut" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={460}
          y={734}
          scale={0.56}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_LOOK_UP}
          className="scene-nadia"
          motif="flyer"
          lightKey="#eeb075"
          lightFill="#6d86a8"
          lightRim="#e8c89b"
        />
        <LitCharacter
          id={props.id}
          x={612}
          y={734}
          scale={0.46}
          appearance={GRANDPA_APPEARANCE}
          performance={GRANDPA_LOOK_UP}
          className="scene-grandpa"
          lightKey="#eeb075"
          lightFill="#6d86a8"
          lightRim="#e8c89b"
        />
      </DepthLayer>
      <DepthLayer depth="near">
        <WindGrass seed={props.seed + 31} baseY={800} count={62} color="#182f34" height={68} lean={30} />
        <path d="M1200,800 L1200,690 C1108,668 1020,706 946,800 Z" fill="#142a32" />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageSix(props: SceneWorldProps) {
  const sceneId = 'wind-06-winding-in';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={6} materials={OUTDOOR_MATERIALS}>
      <Sky fill={props.paint('windSky6')} paint={props.paint} />
      <DepthLayer depth="far" treatment={{ opacity: 0.88 }}>
        <Practical paint={props.paint} id="wind-sun-6" x={94} y={520} radius={50} source="setting-sun" core="#ffbf71" />
        <CloudMass x={850} y={180} scale={0.94} fill="#d7b9a4" opacity={0.36} />
        <path d="M0,522 C226,450 420,482 612,432 C830,376 1024,416 1200,370 L1200,586 L0,586 Z" fill="#4b4c5a" />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <path d="M0,574 C238,532 450,570 678,532 C896,496 1054,516 1200,486 L1200,800 L0,800 Z" fill="#3d5144" />
          <path d="M0,724 C242,658 460,692 704,644 C918,602 1062,614 1200,586 L1200,800 L0,800 Z" fill="#293d3a" />
        </g>
        <Kite paint={props.paint} cx={480} cy={456} size={92} rotate={8} state="descending" />
        <KiteString d="M538,496 C604,470 648,466 706,518" state="winding" />
      </DepthLayer>
      <DepthLayer depth="focus">
        <LitCharacter
          id={props.id}
          x={568}
          y={714}
          scale={0.94}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_CATCH}
          className="scene-nadia"
          motif="flyer"
          lightKey="#ffb167"
          lightFill="#7283a9"
          lightRim="#ffd09d"
        />
        <LitCharacter
          id={props.id}
          x={786}
          y={714}
          scale={0.74}
          appearance={GRANDPA_APPEARANCE}
          performance={GRANDPA_PROUD}
          className="scene-grandpa"
          lightKey="#ffb167"
          lightFill="#7283a9"
          lightRim="#ffd09d"
        />
        <path d="M680,524 Q706,500 736,518" fill="none" stroke="#d8a989" strokeWidth={11} strokeLinecap="round" opacity={0.64} />
      </DepthLayer>
      <DepthLayer depth="near">
        <WindGrass seed={props.seed + 37} baseY={800} count={62} color="#1c3332" height={66} lean={20} />
        <path d="M0,800 L0,708 C110,674 204,712 288,800 Z" fill="#172c31" />
      </DepthLayer>
    </SceneFrame>
  );
}

function PageSeven(props: SceneWorldProps) {
  const sceneId = 'wind-07-resting-kite';
  return (
    <SceneFrame {...props} sceneId={sceneId} timeIndex={7} materials={BEDROOM_MATERIALS} calm>
      <Sky fill={props.paint('windRoomWall')} paint={props.paint} fillOpacity={0.13} />
      <DepthLayer depth="far" treatment={{ opacity: 0.76, saturation: 0.74 }}>
        <rect x={714} y={66} width={326} height={294} rx={18} fill="#101a32" stroke="#53658e" strokeWidth={12} />
        <StarField seed={props.seed} count={24} x={738} y={90} width={276} height={242} color="#d1daef" minR={1} maxR={2.5} />
        <path d="M876,74 L876,352 M722,210 L1032,210" stroke="#53658e" strokeWidth={9} />
      </DepthLayer>
      <DepthLayer depth="mid">
        <g data-cover-parity="geometry">
          <rect width={VIEW_W} height={VIEW_H} fill={props.paint('windRoomWall')} opacity={0.36} />
          <path d="M0,614 L1200,614 L1200,800 L0,800 Z" fill="#111a32" />
          <path d="M92,602 C272,540 530,548 704,620 L704,790 L82,790 Z" fill="#4c5688" />
        </g>
        <g data-motif="wind" data-wind-dir="right" data-wind-strength="gentle">
          <path d="M706,86 C660,196 680,280 642,366 L716,366 C752,272 748,180 738,86 Z" fill="#6471a8" opacity={0.76} />
          <path d="M1038,86 C1084,192 1060,278 1098,366 L1028,366 C994,278 1000,184 1008,86 Z" fill="#59679e" opacity={0.76} />
          <path d="M670,178 C716,160 754,170 790,194" fill="none" stroke="#8291bf" strokeWidth={7} opacity={0.34} />
        </g>
        <Practical paint={props.paint} id="wind-lamp-7" x={1040} y={520} radius={28} source="lamp" core="#ffd282" />
        <Kite paint={props.paint} cx={874} cy={484} size={82} rotate={-16} state="resting" />
        <path d="M836,560 L910,350" stroke="#664333" strokeWidth={7} opacity={0.66} />
      </DepthLayer>
      <DepthLayer depth="focus">
        <path
          d="M84,652 C238,574 504,576 704,654 L704,792 L84,792 Z"
          fill={props.paint('windQuilt')}
          filter={props.paint('wind-room-cloth')}
          data-motif="quilt"
        />
        <ellipse cx={332} cy={684} rx={122} ry={48} fill="#dce1f2" opacity={0.9} />
        <LitCharacter
          id={props.id}
          x={378}
          y={726}
          scale={1.02}
          appearance={NADIA_APPEARANCE}
          performance={NADIA_SLEEP}
          className="scene-nadia"
          motif="flyer"
          lightKey="#ffd18a"
          lightFill="#586f99"
          lightRim="#8da8d2"
        />
        <path d="M242,704 C360,658 494,672 580,728 L580,788 L232,788 Z" fill={props.paint('windQuilt')} opacity={0.95} />
      </DepthLayer>
      <DepthLayer depth="near">
        <path d="M0,800 L0,692 C94,656 170,684 232,800 Z M1200,800 L1200,680 C1110,654 1032,690 970,800 Z" fill="#0d162b" />
        <path d="M984,800 C1018,714 1070,684 1132,708 L1160,800 Z" fill="#18223e" />
      </DepthLayer>
    </SceneFrame>
  );
}

const PAGES: Record<string, (props: SceneWorldProps) => ReactNode> = {
  'wind-01-hilltop-kite': PageOne,
  'wind-02-flop-run': PageTwo,
  'wind-03-reading-clues': PageThree,
  'wind-04-first-lift': PageFour,
  'wind-05-dancing-high': PageFive,
  'wind-06-winding-in': PageSix,
  'wind-07-resting-kite': PageSeven,
};

export const windWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
