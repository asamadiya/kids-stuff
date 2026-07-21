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
type SceneId = keyof typeof PAGES;

const KWAME: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#8b5138', shadow: '#563124', highlight: '#bd7955' },
  face: { shape: 'round', brow: '#241713', mouth: '#65333b' },
  hair: { style: 'short', base: '#241713', highlight: '#503027', volume: 0.64 },
  wardrobe: {
    garment: 'tunic',
    base: '#d89c3d',
    shadow: '#8f5c28',
    trim: '#f4ce72',
    hemline: 0.45,
  },
  footwear: { style: 'boot', base: '#392922' },
  secondaryShapes: [{ kind: 'belt', color: '#5a4534', accent: '#d9a861' }],
};

const ANA: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#b86f45', shadow: '#78452f', highlight: '#e1a078' },
  face: { shape: 'heart', brow: '#2b1714', mouth: '#783b44' },
  hair: { style: 'long', base: '#2b1714', highlight: '#63372a', volume: 0.72 },
  wardrobe: {
    garment: 'dress',
    base: '#557f63',
    shadow: '#34533e',
    trim: '#d97875',
    hemline: 0.66,
  },
  footwear: { style: 'boot', base: '#453028' },
  secondaryShapes: [{ kind: 'sash', color: '#b6535d', accent: '#ef9c9d' }],
};

const GRANDPA: CharacterAppearance = {
  ...defaultAppearance('elder'),
  skin: { base: '#7b4935', shadow: '#4e2c24', highlight: '#aa7356' },
  face: { shape: 'oval', brow: '#d8d0bf', mouth: '#62363a' },
  hair: { style: 'wispy', base: '#d8d0bf', highlight: '#fff7e5', volume: 0.38 },
  wardrobe: {
    garment: 'robe',
    base: '#485d83',
    shadow: '#2c3c60',
    trim: '#9cb0ca',
    hemline: 0.88,
  },
  footwear: { style: 'slipper', base: '#2e2d3f' },
  secondaryShapes: [],
};

const MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'tree-timber',
    preset: 'timber',
    base: '#6f4429',
    shadow: '#30231e',
    highlight: '#b47a45',
    textureScale: 1.2,
    roughness: 0.66,
  },
  {
    id: 'basket-weave',
    preset: 'timber',
    base: '#ad7642',
    shadow: '#624126',
    highlight: '#ddb474',
    textureScale: 0.82,
    roughness: 0.58,
  },
  {
    id: 'soft-cloth',
    preset: 'cloth',
    base: '#817bb0',
    shadow: '#4a476f',
    highlight: '#d1c8e8',
    textureScale: 0.9,
    roughness: 0.74,
  },
  {
    id: 'pulley-metal',
    preset: 'metal',
    base: '#80786c',
    shadow: '#36363b',
    highlight: '#e4d8b8',
    textureScale: 0.48,
    roughness: 0.34,
  },
];

const LIGHTING: Record<string, LightingRig> = {
  'dusk-1': {
    key: { azimuth: -34, elevation: 42, color: '#ffd39a', intensity: 0.76 },
    fill: { color: '#7995a8', intensity: 0.2 },
    rim: { azimuth: 148, elevation: 26, color: '#f0b873', intensity: 0.28 },
    practicals: [{ id: 'ramp-practical', x: 1080, y: 128, radius: 360, color: '#ffc36d', intensity: 0.42 }],
  },
  'dusk-2': {
    key: { azimuth: -38, elevation: 40, color: '#ffd092', intensity: 0.72 },
    fill: { color: '#718fa7', intensity: 0.22 },
    rim: { azimuth: 146, elevation: 26, color: '#efae69', intensity: 0.26 },
    practicals: [{ id: 'ramp-practical', x: 1020, y: 150, radius: 350, color: '#ffba67', intensity: 0.4 }],
  },
  'gloaming-3': {
    key: { azimuth: -28, elevation: 36, color: '#ffc27b', intensity: 0.7 },
    fill: { color: '#617f9b', intensity: 0.23 },
    rim: { azimuth: 154, elevation: 24, color: '#e9a562', intensity: 0.28 },
    practicals: [{ id: 'ramp-practical', x: 1050, y: 156, radius: 330, color: '#f7aa5b', intensity: 0.38 }],
  },
  'gloaming-4': {
    key: { azimuth: -22, elevation: 34, color: '#f5b56e', intensity: 0.64 },
    fill: { color: '#65839f', intensity: 0.25 },
    rim: { azimuth: 158, elevation: 24, color: '#e6a05e', intensity: 0.3 },
    practicals: [{ id: 'ramp-practical', x: 870, y: 184, radius: 290, color: '#f2aa61', intensity: 0.36 }],
  },
  'sunset-5': {
    key: { azimuth: -18, elevation: 30, color: '#f2aa62', intensity: 0.62 },
    fill: { color: '#5d7899', intensity: 0.26 },
    rim: { azimuth: 160, elevation: 22, color: '#eab36f', intensity: 0.32 },
    practicals: [{ id: 'ramp-practical', x: 160, y: 150, radius: 330, color: '#ffb55f', intensity: 0.44 }],
  },
  'night-6': {
    key: { azimuth: -42, elevation: 38, color: '#ffc77f', intensity: 0.58 },
    fill: { color: '#56738b', intensity: 0.22 },
    rim: { azimuth: 138, elevation: 30, color: '#e4b876', intensity: 0.22 },
    practicals: [{ id: 'ramp-practical', x: 614, y: 286, radius: 310, color: '#ffc36f', intensity: 0.58 }],
  },
  'night-7': {
    key: { azimuth: -58, elevation: 44, color: '#a9c4dd', intensity: 0.38 },
    fill: { color: '#4b6280', intensity: 0.16 },
    rim: { azimuth: 132, elevation: 28, color: '#d8a867', intensity: 0.16 },
    practicals: [{ id: 'ramp-practical', x: 1010, y: 570, radius: 220, color: '#efb46f', intensity: 0.32 }],
  },
};

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient id={id('sky-dusk-1')} stops={[
        { offset: 0, color: '#557785' },
        { offset: 0.48, color: '#d49b68' },
        { offset: 1, color: '#f5ca82' },
      ]} />
      <LinearGradient id={id('sky-dusk-2')} stops={[
        { offset: 0, color: '#526c7d' },
        { offset: 0.5, color: '#c98962' },
        { offset: 1, color: '#efbc75' },
      ]} />
      <LinearGradient id={id('sky-gloaming-3')} stops={[
        { offset: 0, color: '#455a72' },
        { offset: 0.55, color: '#b76f57' },
        { offset: 1, color: '#e6a962' },
      ]} />
      <LinearGradient id={id('sky-gloaming-4')} stops={[
        { offset: 0, color: '#394b66' },
        { offset: 0.56, color: '#9f6559' },
        { offset: 1, color: '#d99359' },
      ]} />
      <LinearGradient id={id('sky-sunset-5')} stops={[
        { offset: 0, color: '#293c59' },
        { offset: 0.5, color: '#86525b' },
        { offset: 1, color: '#d57d4e' },
      ]} />
      <LinearGradient id={id('sky-night-6')} stops={[
        { offset: 0, color: '#17243d' },
        { offset: 0.62, color: '#293c58' },
        { offset: 1, color: '#5a4c59' },
      ]} />
      <LinearGradient id={id('sky-night-7')} stops={[
        { offset: 0, color: '#0d1831' },
        { offset: 0.62, color: '#1c2a4a' },
        { offset: 1, color: '#323b61' },
      ]} />
      <LinearGradient id={id('leaf-dusk')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#426e4b' },
        { offset: 0.5, color: '#28523c' },
        { offset: 1, color: '#17382f' },
      ]} />
      <LinearGradient id={id('leaf-night')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#233b43' },
        { offset: 1, color: '#101d2c' },
      ]} />
      <LinearGradient id={id('wood-face')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#a46a38' },
        { offset: 0.54, color: '#754524' },
        { offset: 1, color: '#40291f' },
      ]} />
      <LinearGradient id={id('wagon-red')} x1={0} y1={0} x2={0} y2={1} stops={[
        { offset: 0, color: '#ed6a4d' },
        { offset: 0.45, color: '#c84436' },
        { offset: 1, color: '#752d2c' },
      ]} />
      <LinearGradient id={id('blanket')} x1={0} y1={0} x2={1} y2={1} stops={[
        { offset: 0, color: '#9ca6d0' },
        { offset: 0.55, color: '#686f9f' },
        { offset: 1, color: '#464d79' },
      ]} />
      <RadialGradient id={id('vignette')} stops={[
        { offset: 0.56, color: '#000000', opacity: 0 },
        { offset: 1, color: '#110f1d', opacity: 0.4 },
      ]} />
      <RadialGradient id={id('moon-glow')} stops={[
        { offset: 0, color: '#e8f0ff', opacity: 0.76 },
        { offset: 1, color: '#e8f0ff', opacity: 0 },
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
  performance: scenePerformance,
}: {
  readonly id: SceneWorldProps['id'];
  readonly kind: 'kwame' | 'ana' | 'grandpa';
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly performance: CharacterPerformance;
}) {
  const appearance = kind === 'kwame' ? KWAME : kind === 'ana' ? ANA : GRANDPA;
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

function Canopy({
  seed,
  night = false,
  y = 95,
}: {
  readonly seed: number;
  readonly night?: boolean;
  readonly y?: number;
}) {
  const fill = night ? '#142536' : '#28543b';
  const light = night ? '#263e4a' : '#4d7b48';
  return (
    <g className="scene-canopy" data-motif="canopy">
      <path
        d={`M-30,${n(y + 48)} C118,${n(y - 82)} 284,${n(y + 4)} 410,${n(y - 54)}
          C548,${n(y - 112)} 702,${n(y - 12)} 832,${n(y - 66)}
          C982,${n(y - 126)} 1110,${n(y - 46)} 1238,${n(y - 82)}
          L1238,0 L-30,0 Z`}
        fill={fill}
      />
      {range(9).map((i) => {
        const cx = 70 + i * 142 + ((seed >>> (i % 8)) % 34);
        const cy = y + (i % 3) * 34 - ((seed + i * 31) % 28);
        return (
          <path
            key={i}
            d={`M${n(cx - 78)},${n(cy + 18)} Q${n(cx - 42)},${n(cy - 48)} ${n(cx + 6)},${n(cy - 34)}
              Q${n(cx + 68)},${n(cy - 54)} ${n(cx + 90)},${n(cy + 14)}
              Q${n(cx + 22)},${n(cy + 62)} ${n(cx - 78)},${n(cy + 18)} Z`}
            fill={i % 2 === 0 ? light : fill}
            opacity={n(0.62 + (i % 3) * 0.1)}
          />
        );
      })}
      <path
        d={`M42,${n(y + 10)} C244,${n(y - 32)} 402,${n(y + 16)} 604,${n(y - 26)}
          M684,${n(y - 18)} C846,${n(y - 58)} 1034,${n(y - 4)} 1190,${n(y - 36)}`}
        stroke={night ? '#405363' : '#758b52'}
        strokeWidth={5}
        fill="none"
        opacity={0.34}
        data-lighting="key"
      />
    </g>
  );
}

function OakTree({
  paint,
  house = true,
  night = false,
  compact = false,
}: {
  readonly paint: Paint;
  readonly house?: boolean;
  readonly night?: boolean;
  readonly compact?: boolean;
}) {
  const trunk = night ? '#172231' : '#4b3225';
  const scale = compact ? 0.72 : 1;
  return (
    <g
      transform={`translate(${compact ? 720 : 0} ${compact ? 188 : 0}) scale(${scale})`}
      data-landform="treehouse-oak"
      data-cover-parity="identity"
    >
      <g data-material="timber" filter={paint('tree-timber')}>
        <path
          d="M804,800 C742,666 764,528 806,398 C838,300 850,204 832,92
             C892,176 902,278 886,380 C876,446 896,532 952,618
             C1000,690 1018,748 1026,800 Z"
          fill={trunk}
        />
        <path
          d="M838,408 C704,350 584,314 430,292 C572,266 722,286 872,342 Z"
          fill={trunk}
        />
        <path
          d="M870,326 C970,252 1060,222 1192,230 C1084,258 1000,304 902,380 Z"
          fill={trunk}
        />
        <path
          d="M806,620 C850,536 864,448 856,366"
          stroke={night ? '#334050' : '#8e5c35'}
          strokeWidth={18}
          fill="none"
          opacity={0.62}
        />
      </g>
      {house ? <Treehouse x={760} y={260} scale={compact ? 0.86 : 1} paint={paint} night={night} /> : null}
    </g>
  );
}

function Treehouse({
  x,
  y,
  scale = 1,
  paint,
  night = false,
  lit = false,
}: {
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly paint: Paint;
  readonly night?: boolean;
  readonly lit?: boolean;
}) {
  return (
    <g
      className="scene-treehouse"
      data-motif="treehouse"
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <path d="M-170,-34 L8,-126 L176,-28 L142,2 L-142,0 Z" fill={night ? '#182333' : '#4b3022'} />
      <g data-material="timber" filter={paint('tree-timber')}>
        <path d="M-142,-2 L142,-2 L126,144 Q0,170 -126,144 Z" fill={night ? '#243344' : '#81502c'} />
        <path d="M-126,22 Q0,8 126,22" stroke={night ? '#3a4a59' : '#b87942'} strokeWidth={10} fill="none" />
        <path d="M-94,28 L-98,138 M-48,18 L-48,152 M4,14 L6,158 M58,18 L62,150 M108,26 L114,138" stroke={night ? '#172532' : '#55321f'} strokeWidth={8} opacity={0.68} />
      </g>
      <path d="M-70,64 L-12,58 L-14,150 L-74,144 Z" fill="#2d231f" />
      <path d="M38,42 L104,44 L102,104 L38,100 Z" fill={lit ? '#f3bf6c' : night ? '#2b4055' : '#52727b'} />
      {lit ? <path d="M44,48 L96,50 L94,96 L46,94 Z" fill="#ffd992" opacity={0.72} data-lighting="practical" /> : null}
      <path d="M70,44 L70,102 M38,72 L104,74" stroke="#493021" strokeWidth={6} />
      <path d="M-166,144 Q0,174 164,144" stroke="#3e2a20" strokeWidth={22} fill="none" strokeLinecap="round" />
    </g>
  );
}

function RopeLadder({ x, y, height = 230 }: { readonly x: number; readonly y: number; readonly height?: number }) {
  return (
    <g className="scene-rope-ladder" data-motif="rope-ladder">
      <path d={`M${x - 30},${y} C${x - 38},${y + 80} ${x - 48},${y + 150} ${x - 54},${y + height}`} stroke="#b98b53" strokeWidth={9} fill="none" />
      <path d={`M${x + 30},${y} C${x + 24},${y + 80} ${x + 18},${y + 150} ${x + 12},${y + height}`} stroke="#b98b53" strokeWidth={9} fill="none" />
      {range(6).map((i) => {
        const yy = y + 34 + i * 34;
        return <path key={i} d={`M${x - 34 - i * 3},${yy} L${x + 28 - i * 3},${yy + 3}`} stroke="#7e5634" strokeWidth={10} strokeLinecap="round" />;
      })}
    </g>
  );
}

function Basket({
  x,
  y,
  scale = 1,
  paint,
  full = true,
  tilt = 0,
}: {
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly paint: Paint;
  readonly full?: boolean;
  readonly tilt?: number;
}) {
  return (
    <g
      className="scene-basket"
      data-motif="basket"
      transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}
    >
      {full ? (
        <g data-material="cloth" filter={paint('soft-cloth')}>
          <path d="M-86,-96 Q-42,-140 12,-92 L-8,-32 L-92,-40 Z" fill="#b76e7a" />
          <path d="M-14,-108 Q48,-144 84,-72 L58,-24 L-18,-42 Z" fill="#718db4" />
          <path d="M28,-116 Q82,-96 104,-42 L58,-18 L8,-54 Z" fill="#d3ad60" />
          <path d="M-58,-132 L-28,-126 L-18,-52 L-54,-50 Z M-12,-146 L18,-140 L22,-58 L-12,-60 Z" fill="#73594c" />
        </g>
      ) : null}
      <g data-material="wicker" filter={paint('basket-weave')}>
        <path d="M-116,-42 Q0,-92 116,-42" stroke="#c18b4e" strokeWidth={18} fill="none" strokeLinecap="round" />
        <path d="M-112,-34 L112,-34 L82,88 Q0,118 -82,88 Z" fill="#a86c38" />
        <path d="M-94,-18 L94,-18 L68,72 Q0,94 -68,72 Z" fill="#ce9553" opacity={0.72} />
      </g>
      {range(7).map((i) => (
        <path key={`v-${i}`} d={`M${-78 + i * 26},-22 Q${-88 + i * 29},34 ${-64 + i * 22},84`} stroke="#704522" strokeWidth={4} fill="none" opacity={0.48} />
      ))}
      {range(4).map((i) => (
        <path key={`h-${i}`} d={`M-92,${2 + i * 20} Q0,${24 + i * 17} 92,${2 + i * 20}`} stroke="#76502e" strokeWidth={4} fill="none" opacity={0.48} />
      ))}
      <path d="M-86,-20 Q0,-58 86,-20" stroke="#e0b477" strokeWidth={6} fill="none" opacity={0.66} data-lighting="rim" />
    </g>
  );
}

function Cushion({ x, y, fill, tilt = 0, paint }: { readonly x: number; readonly y: number; readonly fill: string; readonly tilt?: number; readonly paint: Paint }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`} filter={paint('soft-cloth')}>
      <path d="M-58,-30 Q0,-48 58,-30 Q74,0 58,30 Q0,48 -58,30 Q-74,0 -58,-30 Z" fill={fill} />
      <path d="M-48,-24 Q0,-34 48,-24" stroke="#f7dfbd" strokeWidth={4} opacity={0.38} fill="none" />
    </g>
  );
}

function Wagon({ x, y, scale, paint, angle = 0 }: { readonly x: number; readonly y: number; readonly scale: number; readonly paint: Paint; readonly angle?: number }) {
  return (
    <g className="scene-wagon" data-motif="wagon" transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <ContactShadow paint={paint} cx={0} cy={58} rx={132} ry={24} />
      <path d="M-122,-76 L118,-76 L88,18 L-92,18 Z" fill={paint('wagon-red')} />
      <path d="M-108,-62 L98,-62 L78,-4 L-82,-4 Z" fill="#f07a58" opacity={0.34} data-lighting="key" />
      <path d="M92,-42 L164,-92" stroke="#51372d" strokeWidth={12} strokeLinecap="round" />
      <circle cx={-76} cy={32} r={34} fill="#252a31" data-motif="wheel" />
      <circle cx={76} cy={32} r={34} fill="#252a31" data-motif="wheel" />
      <g data-material="metal" filter={paint('pulley-metal')}>
        <circle cx={-76} cy={32} r={16} fill="#aaa394" />
        <circle cx={76} cy={32} r={16} fill="#aaa394" />
      </g>
    </g>
  );
}

function RampPlank({ paint }: { readonly paint: Paint }) {
  return (
    <g data-motif="ramp">
      <ContactShadow paint={paint} cx={606} cy={670} rx={390} ry={44} />
      <g data-material="timber" filter={paint('tree-timber')}>
        <path d="M112,688 L986,344 L1028,424 L148,754 Z" fill="#82502d" />
        <path d="M142,690 L986,364 L1002,398 L160,726 Z" fill="#b8763d" opacity={0.64} />
      </g>
      {range(8).map((i) => (
        <path key={i} d={`M${198 + i * 102},${n(666 - i * 40)} l54,62`} stroke="#4c3021" strokeWidth={5} opacity={0.48} />
      ))}
      <path d="M132,681 L987,346" stroke="#e1a45c" strokeWidth={7} opacity={0.54} data-lighting="rim" />
    </g>
  );
}

function PulleyWheel({
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
    <g
      className="scene-pulley"
      data-motif="pulley-wheel"
      data-grooved="true"
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <path d="M0,-84 L0,-54" stroke="#332821" strokeWidth={16} strokeLinecap="round" />
      <g data-material="metal" filter={paint('pulley-metal')}>
        <circle cx={0} cy={0} r={58} fill="#6f6b65" />
        <circle cx={0} cy={0} r={44} fill="#b6a988" />
        <circle cx={0} cy={0} r={29} fill="#5f5a54" />
        <circle cx={0} cy={0} r={12} fill="#29282a" />
      </g>
      <path d="M-42,-8 A44,44 0 0 1 42,-8" stroke="#f3d8a1" strokeWidth={8} fill="none" opacity={0.74} data-lighting="rim" />
      <path d="M-40,12 A42,42 0 0 0 40,12" stroke="#34333a" strokeWidth={9} fill="none" opacity={0.82} />
    </g>
  );
}

function PulleyLift({ paint }: { readonly paint: Paint }) {
  return (
    <g data-system="fixed-pulley">
      <PulleyWheel x={708} y={198} scale={0.92} paint={paint} />
      <path
        d="M660,208 C668,164 748,164 756,210 L824,706"
        stroke="#c3985b"
        strokeWidth={11}
        fill="none"
        strokeLinecap="round"
        data-motif="rope"
      />
      <path d="M660,208 L594,468" stroke="#c3985b" strokeWidth={11} fill="none" strokeLinecap="round" data-motif="rope" />
      <path d="M646,202 C670,180 738,176 764,208" stroke="#f1d095" strokeWidth={3} fill="none" opacity={0.56} data-lighting="key" />
    </g>
  );
}

function InteriorTreehouse({ paint }: { readonly paint: Paint }) {
  return (
    <g data-landform="treehouse-interior" data-cover-parity="identity">
      <path d="M0,130 L600,22 L1200,132 L1200,800 L0,800 Z" fill="#4b3024" />
      <g data-material="timber" filter={paint('tree-timber')}>
        <path d="M54,150 L1146,150 L1100,754 L96,754 Z" fill="#75482a" />
        {range(8).map((i) => (
          <path key={i} d={`M${116 + i * 132},146 L${98 + i * 138},754`} stroke="#4d2d20" strokeWidth={12} opacity={0.56} />
        ))}
      </g>
      <path d="M780,214 L1054,222 L1044,474 L774,464 Z" fill="#15243a" />
      <path d="M796,230 L1038,236 L1028,450 L792,444 Z" fill="#263b55" />
      <path d="M914,230 L910,448 M792,338 L1030,344" stroke="#5d3d29" strokeWidth={12} />
      <path d="M0,674 Q306,610 602,650 T1200,630 L1200,800 L0,800 Z" fill="#593723" />
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
  readonly sceneId: SceneId;
  readonly stage: keyof typeof LIGHTING;
  readonly far: ReactNode;
  readonly mid: ReactNode;
  readonly focus: ReactNode;
  readonly near: ReactNode;
  readonly calm?: boolean;
}) {
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
        cx={LIGHTING[stage].practicals[0].x}
        cy={LIGHTING[stage].practicals[0].y}
        rx={LIGHTING[stage].practicals[0].radius}
        ry={n(LIGHTING[stage].practicals[0].radius * 0.74)}
        fill={paint('ramp-practical')}
        data-lighting="practical"
      />
      <DepthLayer depth="far" id={id} treatment={{ opacity: calm ? 0.62 : 0.76, blur: calm ? 2.4 : 1.4, saturation: calm ? 0.7 : 0.82 }}>
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
  'machines-01-heavy-basket': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-01-heavy-basket"
      stage="dusk-1"
      far={
        <>
          <path d="M0,514 C186,448 364,486 530,440 C728,384 912,432 1200,342 L1200,800 L0,800 Z" fill="#49694d" />
          <OakTree paint={paint} compact />
          <RopeLadder x={930} y={334} height={238} />
        </>
      }
      mid={
        <>
          <path d="M0,624 C214,548 430,598 618,552 C828,500 1024,544 1200,504 L1200,800 L0,800 Z" fill="#365a42" data-cover-parity="identity" />
          <path d="M80,614 C298,570 512,600 690,562" stroke={paint('fill-light')} strokeWidth={70} fill="none" opacity={0.5} data-lighting="fill" />
          <path d="M820,410 C938,372 1056,370 1168,332" stroke="#efb471" strokeWidth={8} fill="none" opacity={0.46} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={558} cy={714} rx={242} ry={50} />
          <Basket x={566} y={636} scale={1.28} paint={paint} />
          <Character
            id={id}
            kind="kwame"
            x={250}
            y={742}
            scale={1.02}
            performance={performance('reach', { x: 470, y: 608 }, 'concerned', {
              lineOfAction: 22,
              shoulderTilt: 18,
              pelvisTilt: -10,
              weightFoot: 'left',
              headTurn: 0.62,
              leftHand: 'hold',
              rightHand: 'hold',
              leftHandTarget: { x: 454, y: 628 },
              rightHandTarget: { x: 488, y: 582 },
            })}
          />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,706 Q104,660 208,720 L268,800 Z" fill="#1e352d" />
          <path d="M1200,800 L1200,676 Q1128,642 1050,700 L1000,800 Z" fill="#1b302b" />
          <path d="M24,720 Q112,674 200,724" stroke="#65804a" strokeWidth={12} fill="none" opacity={0.42} />
        </>
      }
    />
  ),

  'machines-02-together-fail': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-02-together-fail"
      stage="dusk-2"
      far={
        <>
          <Canopy seed={seed} y={88} />
          <Treehouse x={892} y={258} scale={0.66} paint={paint} />
          <path d="M0,536 C206,470 394,512 574,464 C760,414 970,460 1200,388 L1200,800 L0,800 Z" fill="#456148" />
        </>
      }
      mid={
        <>
          <path d="M0,634 C174,576 400,612 618,574 C828,538 1012,560 1200,526 L1200,800 L0,800 Z" fill="#31533e" data-cover-parity="identity" />
          <path d="M188,620 C396,566 620,594 810,552" stroke={paint('fill-light')} strokeWidth={64} fill="none" opacity={0.48} data-lighting="fill" />
          <Cushion x={604} y={430} fill="#d87380" tilt={24} paint={paint} />
          <path d="M560,438 Q602,392 648,424" stroke="#ffd49a" strokeWidth={6} fill="none" opacity={0.52} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={600} cy={730} rx={258} ry={48} />
          <Basket x={600} y={654} scale={1.16} paint={paint} tilt={-2} />
          <Character
            id={id}
            kind="kwame"
            x={286}
            y={748}
            scale={0.91}
            performance={performance('reach', { x: 520, y: 620 }, 'concerned', {
              lineOfAction: 18,
              shoulderTilt: 14,
              pelvisTilt: -9,
              weightFoot: 'left',
              headTurn: 0.58,
              leftHand: 'hold',
              rightHand: 'hold',
              leftHandTarget: { x: 478, y: 634 },
              rightHandTarget: { x: 510, y: 592 },
            })}
          />
          <Character
            id={id}
            kind="ana"
            x={924}
            y={748}
            scale={0.9}
            performance={performance('reach', { x: 686, y: 620 }, 'concerned', {
              lineOfAction: -20,
              shoulderTilt: -16,
              pelvisTilt: 10,
              weightFoot: 'right',
              headTurn: -0.62,
              leftHand: 'hold',
              rightHand: 'hold',
              leftHandTarget: { x: 706, y: 590 },
              rightHandTarget: { x: 730, y: 638 },
            })}
          />
          <path d="M494,626 Q602,596 712,626" stroke="#f0b977" strokeWidth={5} fill="none" opacity={0.54} data-lighting="rim" />
        </>
      }
      near={
        <>
          <Cushion x={130} y={746} fill="#708fba" tilt={-12} paint={paint} />
          <path d="M1040,800 Q1114,704 1200,724 L1200,800 Z" fill="#1d312c" />
        </>
      }
    />
  ),

  'machines-03-ramp-wagon': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-03-ramp-wagon"
      stage="gloaming-3"
      far={
        <>
          <path d="M0,512 C188,450 356,492 542,438 C736,382 968,420 1200,346 L1200,800 L0,800 Z" fill="#3c5948" />
          <Canopy seed={seed + 12} y={72} />
          <OakTree paint={paint} compact />
        </>
      }
      mid={
        <>
          <path d="M0,670 C206,598 420,626 642,590 C842,558 1034,562 1200,532 L1200,800 L0,800 Z" fill="#2c4939" data-cover-parity="identity" />
          <path d="M126,640 C328,580 524,604 704,568" stroke={paint('fill-light')} strokeWidth={72} fill="none" opacity={0.42} data-lighting="fill" />
          <path d="M896,468 Q1016,432 1146,374" stroke="#eda45e" strokeWidth={9} fill="none" opacity={0.52} data-lighting="key" />
        </>
      }
      focus={
        <>
          <RampPlank paint={paint} />
          <Wagon x={642} y={516} scale={0.76} paint={paint} angle={-21} />
          <Basket x={642} y={416} scale={0.56} paint={paint} tilt={-21} />
          <Character
            id={id}
            kind="ana"
            x={282}
            y={744}
            scale={0.94}
            performance={performance('reach', { x: 510, y: 546 }, 'curious', {
              lineOfAction: 18,
              shoulderTilt: 15,
              pelvisTilt: -8,
              weightFoot: 'left',
              headTurn: 0.64,
              leftHand: 'open',
              rightHand: 'hold',
              rightHandTarget: { x: 508, y: 566 },
            })}
          />
          <Character
            id={id}
            kind="kwame"
            x={1002}
            y={522}
            scale={0.72}
            performance={performance('point', { x: 646, y: 472 }, 'delighted', {
              lineOfAction: -8,
              shoulderTilt: -12,
              pelvisTilt: 7,
              weightFoot: 'right',
              headTurn: -0.72,
              leftHand: 'open',
              rightHand: 'point',
              rightHandTarget: { x: 784, y: 456 },
            })}
          />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,690 Q92,660 180,714 L238,800 Z" fill="#1b3029" />
          <path d="M1200,800 L1200,694 Q1120,658 1046,720 L1002,800 Z" fill="#182b27" />
        </>
      }
    />
  ),

  'machines-04-look-up': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-04-look-up"
      stage="gloaming-4"
      far={
        <>
          <path d="M0,548 C172,476 362,510 526,466 C740,410 950,446 1200,364 L1200,800 L0,800 Z" fill="#334d44" />
          <Treehouse x={846} y={338} scale={0.74} paint={paint} lit />
          <path d="M0,424 C284,360 564,392 848,336" stroke={paint('fill-light')} strokeWidth={96} opacity={0.34} fill="none" data-lighting="fill" />
        </>
      }
      mid={
        <>
          <g data-landform="pulley-branch" data-cover-parity="identity" filter={paint('tree-timber')}>
            <path d="M-40,178 C244,102 514,136 760,92 C916,64 1062,64 1240,26" stroke="#3f2d24" strokeWidth={72} fill="none" strokeLinecap="round" />
            <path d="M90,154 C332,96 548,120 754,82" stroke="#93603a" strokeWidth={15} fill="none" opacity={0.48} data-lighting="key" />
          </g>
          <path d="M0,650 C214,590 410,620 608,586 C846,548 1026,564 1200,530 L1200,800 L0,800 Z" fill="#284238" />
        </>
      }
      focus={
        <>
          <PulleyWheel x={690} y={208} scale={1.18} paint={paint} />
          <path d="M632,208 L620,548 M748,208 L784,548" stroke="#c49a60" strokeWidth={10} fill="none" data-motif="rope" />
          <ContactShadow paint={paint} cx={596} cy={752} rx={226} ry={40} />
          <Character
            id={id}
            kind="kwame"
            x={430}
            y={752}
            scale={0.82}
            performance={performance('point', { x: 690, y: 208 }, 'curious', {
              lineOfAction: 8,
              shoulderTilt: -13,
              pelvisTilt: 8,
              weightFoot: 'left',
              headTurn: 0.78,
              rightHand: 'point',
              rightHandTarget: { x: 586, y: 452 },
            })}
          />
          <Character
            id={id}
            kind="ana"
            x={754}
            y={752}
            scale={0.8}
            performance={performance('point', { x: 690, y: 208 }, 'delighted', {
              lineOfAction: -7,
              shoulderTilt: 12,
              pelvisTilt: -7,
              weightFoot: 'right',
              headTurn: -0.72,
              leftHand: 'point',
              leftHandTarget: { x: 700, y: 434 },
            })}
          />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,724 Q84,680 170,726 L222,800 Z" fill="#172b27" />
          <path d="M1200,800 L1200,690 Q1120,660 1050,720 L1018,800 Z" fill="#172825" />
        </>
      }
    />
  ),

  'machines-05-pulley-lift': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-05-pulley-lift"
      stage="sunset-5"
      far={
        <>
          <Canopy seed={seed + 24} y={54} />
          <path d="M0,552 C178,492 364,520 548,472 C758,418 966,454 1200,386 L1200,800 L0,800 Z" fill="#2c4640" />
          <Treehouse x={862} y={288} scale={0.78} paint={paint} lit />
        </>
      }
      mid={
        <>
          <g data-cover-parity="identity" data-landform="pulley-oak">
            <OakTree paint={paint} house={false} />
          </g>
          <path d="M0,696 C200,624 424,650 650,608 C868,570 1046,580 1200,548 L1200,800 L0,800 Z" fill="#203a32" />
          <path d="M100,648 C330,594 504,610 676,574" stroke={paint('fill-light')} strokeWidth={76} fill="none" opacity={0.42} data-lighting="fill" />
        </>
      }
      focus={
        <>
          <PulleyLift paint={paint} />
          <ContactShadow paint={paint} cx={574} cy={650} rx={118} ry={30} />
          <Basket x={592} y={550} scale={0.78} paint={paint} />
          <Character
            id={id}
            kind="ana"
            x={916}
            y={758}
            scale={0.9}
            performance={performance('reach', { x: 826, y: 614 }, 'delighted', {
              lineOfAction: -16,
              shoulderTilt: -18,
              pelvisTilt: 11,
              weightFoot: 'right',
              headTurn: -0.5,
              leftHand: 'hold',
              rightHand: 'hold',
              leftHandTarget: { x: 832, y: 598 },
              rightHandTarget: { x: 824, y: 672 },
            })}
          />
          <Character
            id={id}
            kind="kwame"
            x={918}
            y={444}
            scale={0.68}
            performance={performance('reach', { x: 598, y: 548 }, 'curious', {
              lineOfAction: 14,
              shoulderTilt: 13,
              pelvisTilt: -8,
              weightFoot: 'left',
              headTurn: -0.72,
              leftHand: 'open',
              rightHand: 'open',
              leftHandTarget: { x: 758, y: 530 },
              rightHandTarget: { x: 778, y: 570 },
            })}
          />
          <path d="M564,504 Q602,478 642,510" stroke="#ffd19a" strokeWidth={5} fill="none" opacity={0.62} data-lighting="rim" />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,666 Q104,620 216,692 L284,800 Z" fill="#152824" />
          <path d="M1084,800 Q1126,714 1200,690 L1200,800 Z" fill="#142522" />
        </>
      }
    />
  ),

  'machines-06-cozy-treehouse': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-06-cozy-treehouse"
      stage="night-6"
      far={
        <>
          <InteriorTreehouse paint={paint} />
          <StarField seed={seed} count={22} x={796} y={232} width={232} height={202} color="#dbe8ff" minR={0.8} maxR={2.2} />
        </>
      }
      mid={
        <>
          <path d="M0,674 Q302,610 604,650 T1200,630 L1200,800 L0,800 Z" fill="#4b3024" data-cover-parity="identity" />
          <ellipse cx={612} cy={306} rx={260} ry={220} fill={paint('ramp-practical')} data-lighting="practical" />
          <path d="M160,630 C352,586 548,602 716,568" stroke={paint('fill-light')} strokeWidth={74} fill="none" opacity={0.44} data-lighting="fill" />
          <path d="M380,286 Q620,222 836,294" stroke="#f6c17a" strokeWidth={10} fill="none" opacity={0.52} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={558} cy={718} rx={286} ry={48} />
          <Cushion x={438} y={690} fill="#ba737f" tilt={-8} paint={paint} />
          <Cushion x={578} y={684} fill="#708fba" tilt={5} paint={paint} />
          <path d="M330,734 Q566,618 806,728 L842,800 L300,800 Z" fill={paint('blanket')} filter={paint('soft-cloth')} />
          <Basket x={914} y={686} scale={0.62} paint={paint} full={false} tilt={24} />
          <Character
            id={id}
            kind="ana"
            x={448}
            y={700}
            scale={0.76}
            performance={performance('kneel', { x: 606, y: 600 }, 'delighted', {
              lineOfAction: 7,
              shoulderTilt: -9,
              pelvisTilt: 8,
              weightFoot: 'center',
              headTurn: 0.5,
              leftHand: 'open',
              rightHand: 'open',
              rightHandTarget: { x: 554, y: 584 },
            })}
          />
          <Character
            id={id}
            kind="kwame"
            x={682}
            y={700}
            scale={0.76}
            performance={performance('kneel', { x: 520, y: 602 }, 'delighted', {
              lineOfAction: -7,
              shoulderTilt: 9,
              pelvisTilt: -8,
              weightFoot: 'center',
              headTurn: -0.5,
              leftHand: 'open',
              rightHand: 'open',
              leftHandTarget: { x: 578, y: 586 },
            })}
          />
          <path d="M494,558 Q560,526 630,558" stroke="#e9b472" strokeWidth={4} fill="none" opacity={0.46} data-lighting="rim" />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,714 Q86,680 174,728 L230,800 Z" fill="#30231e" />
          <path d="M1200,800 L1200,694 Q1116,670 1042,724 L1004,800 Z" fill="#30231e" />
        </>
      }
    />
  ),

  'machines-07-bedtime-sleep': ({ id, paint, seed }) => (
    <SceneFrame
      id={id}
      paint={paint}
      seed={seed}
      sceneId="machines-07-bedtime-sleep"
      stage="night-7"
      calm
      far={
        <>
          <StarField seed={seed + 7} count={38} x={650} y={50} width={420} height={300} color="#d8e5ff" minR={0.7} maxR={2.2} />
          <circle cx={912} cy={142} r={94} fill={paint('moon-glow')} />
          <circle cx={912} cy={142} r={38} fill="#e8ead9" />
          <g data-cover-parity="identity" data-landform="window-treehouse">
            <path d="M630,80 L1080,80 L1080,424 L630,424 Z" fill="#0b1428" />
            <path d="M658,104 L1052,104 L1052,398 L658,398 Z" fill="#1b2b4b" />
            <Treehouse x={870} y={254} scale={0.3} paint={paint} night />
            <path d="M640,326 C760,278 902,300 1064,250 L1064,402 L640,402 Z" fill="#101d31" />
            <path d="M846,104 L846,398 M658,246 L1052,246" stroke="#4a4a6b" strokeWidth={14} />
          </g>
        </>
      }
      mid={
        <>
          <path d="M0,0 L604,0 L604,800 L0,800 Z" fill="#22243e" />
          <path d="M0,606 Q290,554 610,602 L610,800 L0,800 Z" fill="#33395e" />
          <path d="M682,420 C824,382 956,400 1074,372" stroke={paint('fill-light')} strokeWidth={64} fill="none" opacity={0.34} data-lighting="fill" />
          <path d="M654,154 Q806,118 954,104" stroke="#abc5dd" strokeWidth={6} fill="none" opacity={0.38} data-lighting="key" />
        </>
      }
      focus={
        <>
          <ContactShadow paint={paint} cx={294} cy={704} rx={214} ry={42} />
          <path d="M52,624 Q248,562 504,620 L536,786 L36,786 Z" fill="#555e8e" />
          <ellipse cx={178} cy={614} rx={94} ry={44} fill="#e4e1e9" />
          <path d="M38,706 Q228,584 518,680 L552,800 L32,800 Z" fill={paint('blanket')} filter={paint('soft-cloth')} />
          <Character
            id={id}
            kind="kwame"
            x={218}
            y={650}
            scale={0.86}
            performance={performance('sleep', { x: 214, y: 540 }, 'sleeping', {
              lineOfAction: 0,
              shoulderTilt: 2,
              pelvisTilt: -2,
              weightFoot: 'center',
              headTurn: -0.12,
              leftHand: 'rest',
              rightHand: 'rest',
            })}
          />
          <ContactShadow paint={paint} cx={936} cy={744} rx={96} ry={28} />
          <Character
            id={id}
            kind="grandpa"
            x={924}
            y={750}
            scale={0.8}
            performance={performance('stand', { x: 214, y: 614 }, 'calm', {
              lineOfAction: -5,
              shoulderTilt: -7,
              pelvisTilt: 5,
              weightFoot: 'right',
              headTurn: -0.7,
              leftHand: 'rest',
              rightHand: 'open',
              rightHandTarget: { x: 1010, y: 568 },
            })}
          />
          <g transform="translate(1030 570)">
            <ellipse cx={0} cy={0} rx={112} ry={92} fill={paint('ramp-practical')} data-lighting="practical" />
            <path d="M-24,-54 L24,-54 L34,24 L-34,24 Z" fill="#d8a868" filter={paint('pulley-metal')} />
            <path d="M-18,-42 L18,-42 L24,14 L-24,14 Z" fill="#f5c981" opacity={0.72} />
          </g>
          <path d="M884,548 Q930,516 978,538" stroke="#d2a362" strokeWidth={3} fill="none" opacity={0.38} data-lighting="rim" />
        </>
      }
      near={
        <>
          <path d="M0,800 L0,748 Q86,714 168,752 L198,800 Z" fill="#1a1d34" />
          <path d="M1200,800 L1200,714 Q1134,692 1072,738 L1038,800 Z" fill="#171a30" />
        </>
      }
    />
  ),
};

export const machinesWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
