import type { ReactNode } from 'react';
import {
  Blush,
  Capsule,
  ClosedEye,
  Eye,
  GrainFilter,
  GrainWash,
  LinearGradient,
  Moon,
  OpenMouth,
  RadialGradient,
  Smile,
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

/*
 * WORLD: The Sneaky Golden Crown — displacement in a Syracuse workshop at dusk.
 * Motifs: the golden crown, a level balance scale (equal weight), a practice
 * bowl with a marked waterline, two compare bowls where the crown's water rises
 * higher, an honest reveal, and a moonlit quiet landing. Warm Aegean dusk with
 * foreground / midground / background depth on every page.
 */

type Paint = SceneWorldProps['paint'];

const DEEP_SEA = '#173f59';
const STONE_WALL = '#caa06a';
const STONE_DARK = '#9c744a';
const ROOF = '#8a4a3a';
const GOLD_LIGHT = '#ffe08a';
const GOLD_MID = '#f0b73f';
const GOLD_DEEP = '#b9791f';
const SILVER_LIGHT = '#e9edf2';
const SILVER_MID = '#c3ccd6';
const DELIA_SKIN = '#c98a5c';
const DELIA_HAIR = '#2c1a12';
const DELIA_DRESS = '#3f7d8c';
const KING_SKIN = '#b9784f';
const KING_ROBE = '#7c3b6a';
const KING_HAIR = '#e7ddca';
const SMITH_SKIN = '#a9683f';
const SMITH_APRON = '#5c4633';
const WATER_BLUE = '#3d86ad';
const FLOOR = '#8a6a44';
const FLOOR_EDGE = '#6a4c2c';

const WORKSHOP_LIGHTING: LightingRig = {
  key: {
    azimuth: -32,
    elevation: 44,
    color: '#ffd9a6',
    intensity: 0.84,
  },
  fill: {
    color: '#6f8eae',
    intensity: 0.22,
  },
  rim: {
    azimuth: 148,
    elevation: 30,
    color: '#f5c98e',
    intensity: 0.42,
  },
  practicals: [
    {
      id: 'workshop-practical',
      x: -40,
      y: 168,
      radius: 310,
      color: '#ffc978',
      intensity: 0.58,
    },
  ],
};

const WORKSHOP_MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'worn-timber',
    preset: 'timber',
    base: '#805333',
    shadow: '#422b20',
    highlight: '#bd8b59',
    textureScale: 1.3,
    roughness: 0.62,
  },
  {
    id: 'woven-cloth',
    preset: 'cloth',
    base: '#9f3e43',
    shadow: '#54242d',
    highlight: '#dd8580',
    textureScale: 1.05,
    roughness: 0.68,
  },
  {
    id: 'calm-water',
    preset: 'water',
    base: '#285d76',
    shadow: '#173a51',
    highlight: '#a9d3dd',
    textureScale: 0.58,
    roughness: 0.2,
  },
];

const WORKSHOP_DELIA_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#c98a5c', shadow: '#8e5637', highlight: '#edba8e' },
  face: { shape: 'heart', brow: '#2f1d17', mouth: '#7e3d3f' },
  hair: { style: 'long', base: '#2c1a12', highlight: '#5b3822', volume: 0.68 },
  wardrobe: {
    garment: 'dress',
    base: '#326f7d',
    shadow: '#204754',
    trim: '#e6b866',
    hemline: 0.68,
  },
  footwear: { style: 'sandal', base: '#624127' },
  secondaryShapes: [{ kind: 'belt', color: '#b37b3d', accent: '#f5d18a' }],
};

const WORKSHOP_KING_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('adult'),
  skin: { base: '#b9784f', shadow: '#754429', highlight: '#dda679' },
  face: { shape: 'square', brow: '#5b4535', mouth: '#743d3e' },
  hair: { style: 'wispy', base: '#e7ddca', highlight: '#fff8e9', volume: 0.38 },
  wardrobe: {
    garment: 'robe',
    base: '#78445e',
    shadow: '#49283f',
    trim: '#d9b15c',
    hemline: 0.9,
  },
  footwear: { style: 'boot', base: '#3b271b' },
  secondaryShapes: [
    { kind: 'circlet', color: '#d9b15c', accent: '#f8df9c' },
    { kind: 'sash', color: '#b98b42', accent: '#f3d48c' },
  ],
};

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('duskSky')}
        stops={[
          { offset: 0, color: '#63527f' },
          { offset: 0.45, color: '#d67f63' },
          { offset: 1, color: '#f6c078' },
        ]}
      />
      <LinearGradient
        id={id('hallSky')}
        stops={[
          { offset: 0, color: '#7a4b5f' },
          { offset: 0.5, color: '#c47a54' },
          { offset: 1, color: '#f2c079' },
        ]}
      />
      <LinearGradient
        id={id('homeSky')}
        stops={[
          { offset: 0, color: '#2c3a63' },
          { offset: 0.55, color: '#5b4a74' },
          { offset: 1, color: '#c07a63' },
        ]}
      />
      <LinearGradient
        id={id('compareSky')}
        stops={[
          { offset: 0, color: '#6a4d78' },
          { offset: 0.5, color: '#c9805f' },
          { offset: 1, color: '#f3cb8b' },
        ]}
      />
      <LinearGradient
        id={id('nightSky')}
        stops={[
          { offset: 0, color: '#101a3c' },
          { offset: 0.55, color: '#1d2b55' },
          { offset: 1, color: '#39456b' },
        ]}
      />
      <LinearGradient
        id={id('gold')}
        x1={0}
        y1={0}
        x2={0}
        y2={1}
        stops={[
          { offset: 0, color: GOLD_LIGHT },
          { offset: 0.5, color: GOLD_MID },
          { offset: 1, color: GOLD_DEEP },
        ]}
      />
      <LinearGradient
        id={id('silver')}
        x1={0}
        y1={0}
        x2={0}
        y2={1}
        stops={[
          { offset: 0, color: SILVER_LIGHT },
          { offset: 1, color: SILVER_MID },
        ]}
      />
      <LinearGradient
        id={id('water')}
        x1={0}
        y1={0}
        x2={0}
        y2={1}
        stops={[
          { offset: 0, color: '#6fb6d6' },
          { offset: 1, color: WATER_BLUE },
        ]}
      />
      <RadialGradient
        id={id('lampGlow')}
        cx={0.5}
        cy={0.4}
        r={0.6}
        stops={[
          { offset: 0, color: '#ffe6ac', opacity: 0.95 },
          { offset: 0.6, color: '#e0993f', opacity: 0.4 },
          { offset: 1, color: '#7c3f27', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#eaf1ff', opacity: 0.85 },
          { offset: 1, color: '#eaf1ff', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.58, color: '#000000', opacity: 0 },
          { offset: 1, color: '#1a1220', opacity: 0.38 },
        ]}
      />
      <GrainFilter id={id('grain')} opacity={0.05} />
    </defs>
  );
}

const sky = (fill: string) => (
  <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={fill} />
);

const finish = (paint: Paint) => (
  <>
    <GrainWash filter={paint('grain')} />
    <Vignette paint={paint('vignette')} />
  </>
);

function Skyline({ baseY, seed }: { baseY: number; seed: number }) {
  return (
    <g className="scene-skyline">
      {range(9).map((i) => {
        const w = n(78 + ((seed + i * 37) % 46));
        const x = n(30 + i * 132);
        const h = n(70 + ((seed + i * 53) % 96));
        const top = n(baseY - h);
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={h} fill={i % 2 === 0 ? STONE_WALL : STONE_DARK} opacity={0.85} />
            <path d={`M${n(x - 6)},${top} L${n(x + w / 2)},${n(top - 26)} L${n(x + w + 6)},${top} Z`} fill={ROOF} opacity={0.9} />
            <rect x={n(x + w * 0.3)} y={n(top + h * 0.35)} width={n(w * 0.22)} height={n(h * 0.3)} fill="#5f4630" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
}

function Harbor({ topY, height, fill }: { topY: number; height: number; fill: string }) {
  return (
    <g className="scene-harbor">
      <rect x={0} y={n(topY)} width={VIEW_W} height={n(height)} fill={fill} />
      <g className="scene-ripple">
        <path d={`M${n(VIEW_W * 0.12)},${n(topY + height * 0.35)} q40,-8 80,0 q40,8 80,0`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.28} strokeLinecap="round" />
        <path d={`M${n(VIEW_W * 0.55)},${n(topY + height * 0.62)} q36,-7 72,0 q36,7 72,0`} stroke="#ffffff" strokeWidth={2.5} fill="none" opacity={0.22} strokeLinecap="round" />
      </g>
    </g>
  );
}

function WorkshopSkyline({ baseY }: { baseY: number }) {
  return (
    <g className="scene-skyline" data-motif="asymmetrical-skyline">
      <path
        d={`M0,${baseY} L0,${n(baseY - 74)} L92,${n(baseY - 112)} L176,${n(
          baseY - 78,
        )} L238,${n(baseY - 154)} L322,${n(baseY - 126)} L390,${n(
          baseY - 196,
        )} L458,${n(baseY - 142)} L542,${n(baseY - 174)} L628,${n(
          baseY - 106,
        )} L710,${n(baseY - 138)} L804,${n(baseY - 92)} L900,${n(
          baseY - 124,
        )} L1006,${n(baseY - 76)} L1110,${n(baseY - 104)} L1200,${n(
          baseY - 66,
        )} L1200,${baseY} Z`}
        fill="#75536a"
        opacity={0.66}
      />
      <path
        d={`M0,${baseY} L0,${n(baseY - 38)} L132,${n(baseY - 72)} L258,${n(
          baseY - 44,
        )} L344,${n(baseY - 102)} L466,${n(baseY - 58)} L584,${n(
          baseY - 92,
        )} L720,${n(baseY - 50)} L846,${n(baseY - 84)} L962,${n(
          baseY - 42,
        )} L1084,${n(baseY - 68)} L1200,${n(baseY - 36)} L1200,${baseY} Z`}
        fill="#463d59"
        opacity={0.86}
      />
      <path
        d={`M184,${n(baseY - 80)} L238,${n(baseY - 146)} L292,${n(
          baseY - 80,
        )} M504,${n(baseY - 100)} L548,${n(baseY - 156)} L602,${n(
          baseY - 100,
        )} M868,${n(baseY - 78)} L910,${n(baseY - 126)} L960,${n(
          baseY - 78,
        )}`}
        stroke="#9a6259"
        strokeWidth={18}
        strokeLinejoin="round"
        fill="none"
        opacity={0.62}
      />
    </g>
  );
}

function WorkshopHarbor({ paint }: { paint: Paint }) {
  return (
    <g className="scene-harbor" data-material="water" filter={paint('calm-water')}>
      <rect x={0} y={438} width={VIEW_W} height={122} fill="#214f68" />
      <path
        d="M0,472 C210,446 386,486 594,458 C792,432 982,476 1200,446 L1200,560 L0,560 Z"
        fill="#163d55"
        opacity={0.72}
      />
      <path
        d="M390,446 C612,426 812,456 1050,430 L1200,430 L1200,494 C940,474 698,494 430,472 Z"
        fill={paint('fill-light')}
        opacity={0.32}
        data-lighting="fill"
      />
      <path
        d="M0,450 C212,428 420,462 614,438 C820,414 1008,454 1200,430"
        stroke="#e5b77c"
        strokeWidth={8}
        fill="none"
        opacity={0.34}
      />
      <g className="scene-ripple" stroke="#b8d5db" fill="none" strokeLinecap="round">
        <path d="M78,492 q66,-12 132,0" strokeWidth={4} opacity={0.48} />
        <path d="M424,514 q84,-10 168,0" strokeWidth={3} opacity={0.38} />
        <path d="M820,478 q72,-9 144,0" strokeWidth={3.5} opacity={0.42} />
      </g>
    </g>
  );
}

function Columns({ baseY, height }: { baseY: number; height: number }) {
  return (
    <g className="scene-columns">
      {range(5).map((i) => {
        const x = n(90 + i * 260);
        return (
          <g key={i}>
            <rect x={x} y={n(baseY - height)} width={54} height={n(height)} fill="#e7d3a6" opacity={0.85} />
            <rect x={n(x - 8)} y={n(baseY - height)} width={70} height={16} fill="#d8bd86" />
            <rect x={n(x - 8)} y={n(baseY - 16)} width={70} height={16} fill="#d8bd86" />
            {range(4).map((k) => (
              <rect key={k} x={n(x + 6 + k * 12)} y={n(baseY - height + 20)} width={4} height={n(height - 40)} fill="#c8ab74" opacity={0.6} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

const floor = (topY: number) => (
  <>
    <rect x={0} y={n(topY)} width={VIEW_W} height={n(VIEW_H - topY)} fill={FLOOR} />
    <rect x={0} y={n(topY)} width={VIEW_W} height={12} fill={FLOOR_EDGE} />
  </>
);

/** The golden crown, with a motion-safe glint hook (no inline transform/opacity). */
function Crown({ x, y, scale = 1, tilt = 0, paint }: { x: number; y: number; scale?: number; tilt?: number; paint: Paint }) {
  return (
    <g
      transform={`translate(${n(x)} ${n(y)}) rotate(${n(tilt)}) scale(${n(scale)})`}
      className="scene-crown"
      data-motif="crown"
      data-cx={n(x)}
      data-cy={n(y)}
    >
      <path d="M-58,20 L-58,-14 L-30,10 L0,-26 L30,10 L58,-14 L58,20 Z" fill={paint('gold')} stroke={GOLD_DEEP} strokeWidth={3} />
      <path d="M-52,16 L-52,-6 L-32,8 L-14,-6 L-14,16 Z" fill={GOLD_LIGHT} opacity={0.35} />
      <rect x={-60} y={18} width={120} height={16} rx={6} fill={GOLD_DEEP} />
      <rect x={-60} y={14} width={120} height={9} rx={4} fill={GOLD_LIGHT} opacity={0.85} />
      <circle cx={-30} cy={-10} r={7} fill="#e2536b" />
      <circle cx={0} cy={-26} r={8} fill="#57b0d6" />
      <circle cx={30} cy={-10} r={7} fill="#e2536b" />
      <circle cx={-58} cy={-14} r={5} fill={GOLD_LIGHT} />
      <circle cx={58} cy={-14} r={5} fill={GOLD_LIGHT} />
      <g className="scene-crown-glint">
        <path d="M-40,16 l10,-22" stroke="#fff7dc" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        <circle cx={-16} cy={8} r={3} fill="#fffae6" opacity={0.9} />
        <circle cx={22} cy={2} r={2.5} fill="#fffae6" opacity={0.8} />
      </g>
    </g>
  );
}

function WorkshopCrown({
  x,
  y,
  scale = 1,
  paint,
}: {
  x: number;
  y: number;
  scale?: number;
  paint: Paint;
}) {
  return (
    <g
      transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}
      className="scene-crown scene-crown--workshop"
      data-motif="crown"
      data-cx={n(x)}
      data-cy={n(y)}
      data-key-direction="upper-left"
    >
      <ellipse
        cx={18}
        cy={54}
        rx={82}
        ry={19}
        fill={paint('contact-ao')}
        transform="rotate(7 18 54)"
        data-lighting="contact-shadow"
      />
      <g data-material="cloth" filter={paint('woven-cloth')}>
        <path
          d="M-104,30 Q-88,-8 0,-14 Q88,-8 104,30 L90,67 Q0,82 -90,67 Z"
          fill="#9f3e43"
        />
        <path d="M-94,38 Q-24,20 82,42 L72,64 Q-10,72 -86,60 Z" fill="#54242d" opacity={0.74} />
        <path d="M-80,20 Q-14,0 78,24" stroke="#dd8580" strokeWidth={8} fill="none" opacity={0.72} />
        <path d="M-52,22 Q-38,48 -48,65 M20,8 Q34,40 28,70" stroke="#742e38" strokeWidth={6} fill="none" opacity={0.62} />
      </g>
      <g data-material="gold">
        <path
          d="M-66,20 L-68,-26 L-36,-3 L-10,-54 L15,-8 L48,-42 L70,-2 L66,28 Z"
          fill="#cf9228"
          stroke="#70421f"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M-61,7 L-43,15 L-22,3 L-2,18 L20,4 L42,12 L59,4 L62,22 L-61,22 Z"
          fill="#69401f"
          opacity={0.92}
          data-material-pass="reflected-dark"
        />
        <path
          d="M-50,-13 Q-30,-22 -12,-47"
          stroke="#fff0b7"
          strokeWidth={3.6}
          strokeLinecap="round"
          fill="none"
          opacity={0.84}
          data-material-pass="directional-highlight"
        />
        <path
          d="M-66,20 Q0,8 66,28 L62,42 Q0,52 -62,42 Z"
          fill="#8b5424"
          stroke="#5a341d"
          strokeWidth={3}
        />
        <path d="M-55,23 Q2,15 58,30" stroke={paint('rim-light')} strokeWidth={5} fill="none" opacity={0.72} />
        <path d="M-48,34 Q4,27 50,37" stroke="#e6b75d" strokeWidth={4} fill="none" opacity={0.64} />
      </g>
    </g>
  );
}

/** A rounded lump of pure gold (or pale silver). */
function GoldLump({ x, y, scale = 1, silver = false, paint }: { x: number; y: number; scale?: number; silver?: boolean; paint: Paint }) {
  const deep = silver ? '#9aa6b2' : GOLD_DEEP;
  const light = silver ? SILVER_LIGHT : GOLD_LIGHT;
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className={silver ? 'scene-silver-lump' : 'scene-gold-lump'} data-motif={silver ? 'silver' : 'gold-lump'}>
      <path d="M-30,8 Q-36,-16 -10,-20 Q6,-30 24,-16 Q38,-8 30,12 Q18,26 -6,24 Q-24,24 -30,8 Z" fill={paint(silver ? 'silver' : 'gold')} stroke={deep} strokeWidth={2.5} />
      <path d="M-18,-6 Q-6,-16 8,-10 Q0,-2 -6,2 Q-14,2 -18,-6 Z" fill={light} opacity={0.7} />
    </g>
  );
}

function Stone({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-stone" data-motif="stone">
      <ellipse cx={0} cy={0} rx={20} ry={15} fill="#6d7684" />
      <ellipse cx={-6} cy={-5} rx={7} ry={4} fill="#98a0ac" opacity={0.7} />
    </g>
  );
}

/**
 * A water bowl drawn in absolute coordinates. Its marked waterline carries the
 * displacement semantics: `data-level` is the on-screen y of the surface, so a
 * higher-displacing object reads as a smaller (higher) level.
 */
function Bowl({
  cx,
  topY,
  radius,
  depth,
  levelY,
  paint,
  side,
  marked = true,
}: {
  cx: number;
  topY: number;
  radius: number;
  depth: number;
  levelY: number;
  paint: Paint;
  side?: string;
  marked?: boolean;
}) {
  const botY = n(topY + depth);
  const rBot = n(radius * 0.6);
  const span = Math.max(1, topY + depth - levelY);
  const wR = n(rBot + (radius - rBot) * Math.min(1, span / depth) * 0.94);
  const bodyD = `M${n(cx - radius)},${n(topY)} C${n(cx - radius)},${n(topY + depth * 0.6)} ${n(cx - rBot)},${botY} ${n(cx)},${botY} C${n(cx + rBot)},${botY} ${n(cx + radius)},${n(topY + depth * 0.6)} ${n(cx + radius)},${n(topY)} Z`;
  const waterD = `M${n(cx - wR)},${n(levelY)} C${n(cx - wR)},${n(levelY + (botY - levelY) * 0.6)} ${n(cx - rBot)},${botY} ${n(cx)},${botY} C${n(cx + rBot)},${botY} ${n(cx + wR)},${n(levelY + (botY - levelY) * 0.6)} ${n(cx + wR)},${n(levelY)} Z`;
  return (
    <g className="scene-bowl" data-motif="bowl" data-cx={n(cx)}>
      <path d={bodyD} fill="#e7d6b4" stroke={STONE_DARK} strokeWidth={3} />
      <path d={waterD} fill={paint('water')} />
      <ellipse cx={n(cx)} cy={n(levelY)} rx={wR} ry={n(wR * 0.24)} fill="#7cc0de" />
      <g className="scene-ripple">
        <path d={`M${n(cx - wR * 0.7)},${n(levelY + 2)} q${n(wR * 0.35)},-6 ${n(wR * 0.7)},0`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.55} strokeLinecap="round" />
        <path d={`M${n(cx - wR * 0.4)},${n(levelY + 8)} q${n(wR * 0.2)},-4 ${n(wR * 0.4)},0`} stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.4} strokeLinecap="round" />
      </g>
      <path d={`M${n(cx - radius)},${n(topY)} Q${n(cx)},${n(topY - radius * 0.28)} ${n(cx + radius)},${n(topY)}`} fill="none" stroke="#f3e7c8" strokeWidth={4} strokeLinecap="round" />
      {marked ? (
        <line
          x1={n(cx - radius * 1.16)}
          y1={n(levelY)}
          x2={n(cx + radius * 1.16)}
          y2={n(levelY)}
          stroke="#b0413a"
          strokeWidth={3.5}
          strokeDasharray="9 7"
          strokeLinecap="round"
          data-motif="waterline"
          data-level={n(levelY)}
          data-side={side}
        />
      ) : null}
    </g>
  );
}

/** A hanging palace lamp with a motion-safe glow hook. */
function Lamp({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-lamp" data-motif="lamp">
      <line x1={0} y1={-90} x2={0} y2={-18} stroke="#5a4326" strokeWidth={5} />
      <g className="scene-lamp-glow">
        <circle cx={0} cy={8} r={44} fill="#ffe2a0" opacity={0.5} />
      </g>
      <path d="M-24,-18 Q0,-32 24,-18 L18,26 Q0,36 -18,26 Z" fill="#e7a544" stroke="#a4671f" strokeWidth={3} />
      <ellipse cx={0} cy={6} rx={13} ry={16} fill="#fff3c4" />
    </g>
  );
}

/** A level balance scale (equal weight reads as a flat beam). */
function BalanceScale({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-scale">
      <path d="M-46,150 L46,150 L30,120 L-30,120 Z" fill={STONE_DARK} />
      <rect x={-10} y={-70} width={20} height={192} rx={6} fill="#7c5a34" />
      <circle cx={0} cy={-76} r={12} fill="#9c7440" />
      <g className="scene-beam" data-motif="balance" data-tilt={0}>
        <rect x={-150} y={-82} width={300} height={13} rx={6} fill="#8a6238" />
        <rect x={-150} y={-82} width={300} height={5} rx={2} fill="#c69a5c" opacity={0.7} />
      </g>
      <line x1={-144} y1={-76} x2={-144} y2={-16} stroke="#6d4f2c" strokeWidth={3} />
      <line x1={-108} y1={-76} x2={-144} y2={-16} stroke="#6d4f2c" strokeWidth={3} />
      <line x1={144} y1={-76} x2={144} y2={-16} stroke="#6d4f2c" strokeWidth={3} />
      <line x1={108} y1={-76} x2={144} y2={-16} stroke="#6d4f2c" strokeWidth={3} />
      <path d="M-176,-16 Q-144,26 -112,-16 Z" fill="#c9a15c" stroke="#8a6238" strokeWidth={2.5} />
      <path d="M112,-16 Q144,26 176,-16 Z" fill="#c9a15c" stroke="#8a6238" strokeWidth={2.5} />
    </g>
  );
}

function Delia({ x, y, scale = 1, pose = 'stand' }: { x: number; y: number; scale?: number; pose?: 'stand' | 'kneel' | 'present' | 'point' | 'sleep' }) {
  if (pose === 'sleep') {
    return (
      <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-delia">
        <ellipse cx={-6} cy={14} rx={62} ry={30} fill="#f1ede0" />
        <circle cx={-2} cy={-6} r={34} fill={DELIA_SKIN} />
        <path d="M-36,-14 Q-4,-58 34,-20 Q20,-46 -2,-46 Q-28,-40 -36,-14 Z" fill={DELIA_HAIR} />
        <ClosedEye cx={-14} cy={-4} w={14} />
        <ClosedEye cx={12} cy={-4} w={14} />
        <Smile cx={-1} cy={16} w={16} curve={6} />
        <Blush cx={-20} cy={4} r={5} />
      </g>
    );
  }
  const open = pose === 'present' || pose === 'point';
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-delia">
      <Capsule x1={0} y1={0} x2={0} y2={92} width={46} fill={DELIA_DRESS} />
      <path d="M-26,44 L26,44 L34,104 L-34,104 Z" fill={DELIA_DRESS} />
      {pose === 'kneel' ? (
        <>
          <Capsule x1={-12} y1={16} x2={-58} y2={54} width={15} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={16} x2={54} y2={44} width={15} fill={DELIA_DRESS} />
          <ellipse cx={-62} cy={56} rx={12} ry={9} fill={DELIA_SKIN} />
          <ellipse cx={58} cy={46} rx={12} ry={9} fill={DELIA_SKIN} />
          <Capsule x1={-14} y1={92} x2={-52} y2={104} width={17} fill={DELIA_DRESS} />
          <Capsule x1={14} y1={92} x2={40} y2={116} width={17} fill={DELIA_DRESS} />
        </>
      ) : pose === 'present' ? (
        <>
          <Capsule x1={-12} y1={16} x2={-70} y2={0} width={15} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={16} x2={72} y2={-20} width={15} fill={DELIA_DRESS} />
          <ellipse cx={-74} cy={0} rx={12} ry={9} fill={DELIA_SKIN} />
          <ellipse cx={78} cy={-22} rx={12} ry={9} fill={DELIA_SKIN} />
          <Capsule x1={-12} y1={100} x2={-20} y2={150} width={16} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={100} x2={20} y2={150} width={16} fill={DELIA_DRESS} />
          <ellipse cx={-24} cy={154} rx={13} ry={7} fill="#3a2c27" />
          <ellipse cx={24} cy={154} rx={13} ry={7} fill="#3a2c27" />
        </>
      ) : pose === 'point' ? (
        <>
          <Capsule x1={-12} y1={16} x2={-54} y2={40} width={15} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={14} x2={78} y2={-30} width={15} fill={DELIA_DRESS} />
          <ellipse cx={-58} cy={42} rx={12} ry={9} fill={DELIA_SKIN} />
          <ellipse cx={82} cy={-33} rx={12} ry={9} fill={DELIA_SKIN} />
          <Capsule x1={-12} y1={100} x2={-20} y2={150} width={16} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={100} x2={20} y2={150} width={16} fill={DELIA_DRESS} />
          <ellipse cx={-24} cy={154} rx={13} ry={7} fill="#3a2c27" />
          <ellipse cx={24} cy={154} rx={13} ry={7} fill="#3a2c27" />
        </>
      ) : (
        <>
          <Capsule x1={-12} y1={16} x2={-58} y2={30} width={15} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={16} x2={58} y2={30} width={15} fill={DELIA_DRESS} />
          <ellipse cx={-62} cy={32} rx={12} ry={9} fill={DELIA_SKIN} />
          <ellipse cx={62} cy={32} rx={12} ry={9} fill={DELIA_SKIN} />
          <Capsule x1={-12} y1={100} x2={-20} y2={150} width={16} fill={DELIA_DRESS} />
          <Capsule x1={12} y1={100} x2={20} y2={150} width={16} fill={DELIA_DRESS} />
          <ellipse cx={-24} cy={154} rx={13} ry={7} fill="#3a2c27" />
          <ellipse cx={24} cy={154} rx={13} ry={7} fill="#3a2c27" />
        </>
      )}
      <circle cx={0} cy={-34} r={32} fill={DELIA_SKIN} />
      <path d="M-34,-40 Q0,-82 34,-40 Q30,-70 0,-70 Q-30,-68 -34,-40 Z" fill={DELIA_HAIR} />
      <path d="M30,-40 q28,26 12,74" stroke={DELIA_HAIR} strokeWidth={13} fill="none" strokeLinecap="round" />
      <Eye cx={-11} cy={-35} r={4.3} />
      <Eye cx={11} cy={-35} r={4.3} />
      <Blush cx={-20} cy={-19} r={5} />
      <Blush cx={20} cy={-19} r={5} />
      {open ? <OpenMouth cx={0} cy={-15} rx={6} ry={8} /> : <Smile cx={0} cy={-16} w={18} curve={8} />}
    </g>
  );
}

function King({ x, y, scale = 1, pose = 'proud' }: { x: number; y: number; scale?: number; pose?: 'proud' | 'lean' | 'gentle' | 'surprise' }) {
  const open = pose === 'surprise';
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-king">
      <Capsule x1={0} y1={0} x2={0} y2={120} width={66} fill={KING_ROBE} />
      <path d="M-34,54 L34,54 L46,136 L-46,136 Z" fill={KING_ROBE} />
      <path d="M-34,20 L34,20 L30,44 L-30,44 Z" fill="#f0c460" opacity={0.85} />
      {pose === 'lean' ? (
        <>
          <Capsule x1={-16} y1={22} x2={-64} y2={52} width={18} fill={KING_ROBE} />
          <Capsule x1={16} y1={22} x2={70} y2={30} width={18} fill={KING_ROBE} />
          <ellipse cx={-68} cy={54} rx={13} ry={10} fill={KING_SKIN} />
          <ellipse cx={74} cy={30} rx={13} ry={10} fill={KING_SKIN} />
        </>
      ) : pose === 'gentle' ? (
        <>
          <Capsule x1={-16} y1={22} x2={-58} y2={64} width={18} fill={KING_ROBE} />
          <Capsule x1={16} y1={22} x2={62} y2={58} width={18} fill={KING_ROBE} />
          <ellipse cx={-62} cy={66} rx={13} ry={10} fill={KING_SKIN} />
          <ellipse cx={66} cy={60} rx={13} ry={10} fill={KING_SKIN} />
        </>
      ) : (
        <>
          <Capsule x1={-16} y1={22} x2={-66} y2={40} width={18} fill={KING_ROBE} />
          <Capsule x1={16} y1={22} x2={66} y2={40} width={18} fill={KING_ROBE} />
          <ellipse cx={-70} cy={42} rx={13} ry={10} fill={KING_SKIN} />
          <ellipse cx={70} cy={42} rx={13} ry={10} fill={KING_SKIN} />
        </>
      )}
      <circle cx={0} cy={-40} r={38} fill={KING_SKIN} />
      <path d="M-38,-46 Q0,-88 38,-46 Q16,-64 0,-64 Q-18,-64 -38,-46 Z" fill={KING_HAIR} />
      <path d="M-24,-22 q24,30 48,0 q-6,26 -24,26 q-18,0 -24,-26 Z" fill={KING_HAIR} opacity={0.9} />
      <path d="M-40,-58 L-30,-74 L-16,-60 L0,-78 L16,-60 L30,-74 L40,-58 Z" fill={GOLD_MID} stroke={GOLD_DEEP} strokeWidth={2} />
      <Eye cx={-13} cy={-44} r={4.6} />
      <Eye cx={13} cy={-44} r={4.6} />
      <Blush cx={-24} cy={-28} r={5} />
      <Blush cx={24} cy={-28} r={5} />
      {open ? <OpenMouth cx={0} cy={-20} rx={8} ry={11} /> : <Smile cx={0} cy={-24} w={22} curve={9} />}
    </g>
  );
}

function Goldsmith({ x, y, scale = 1, sheepish = false }: { x: number; y: number; scale?: number; sheepish?: boolean }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} className="scene-smith">
      <Capsule x1={0} y1={0} x2={0} y2={112} width={58} fill="#8a5a3a" />
      <rect x={-28} y={30} width={56} height={80} rx={10} fill={SMITH_APRON} />
      <Capsule x1={-14} y1={22} x2={-52} y2={62} width={16} fill="#8a5a3a" />
      <Capsule x1={14} y1={22} x2={50} y2={64} width={16} fill="#8a5a3a" />
      <ellipse cx={-56} cy={64} rx={12} ry={9} fill={SMITH_SKIN} />
      <ellipse cx={54} cy={66} rx={12} ry={9} fill={SMITH_SKIN} />
      <circle cx={0} cy={-34} r={33} fill={SMITH_SKIN} />
      <path d="M-34,-40 Q0,-78 34,-40 Q14,-58 0,-58 Q-18,-58 -34,-40 Z" fill="#3a2a1c" />
      <path d="M-18,-16 q18,16 36,0 q-4,18 -18,18 q-14,0 -18,-18 Z" fill="#3a2a1c" opacity={0.85} />
      {sheepish ? (
        <>
          <ClosedEye cx={-12} cy={-38} w={12} />
          <ClosedEye cx={12} cy={-38} w={12} />
          <path d="M-9,-16 q9,7 18,0" stroke="#5a3b2a" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Blush cx={-22} cy={-24} r={7} fill="#e78f86" />
          <Blush cx={22} cy={-24} r={7} fill="#e78f86" />
        </>
      ) : (
        <>
          <Eye cx={-12} cy={-38} r={4.4} />
          <Eye cx={12} cy={-38} r={4.4} />
          <Smile cx={0} cy={-20} w={18} curve={7} />
        </>
      )}
    </g>
  );
}

/** Soft drifting motes — the non-letter sleep cue for the calm landing page. */
function SleepMotes({ x, y }: { x: number; y: number }) {
  return (
    <g className="scene-sleep-motes" data-motif="sleep-cue" transform={`translate(${n(x)} ${n(y)})`}>
      <circle cx={0} cy={0} r={7} fill="#eaf1ff" opacity={0.85} />
      <circle cx={20} cy={-18} r={5} fill="#eaf1ff" opacity={0.7} />
      <circle cx={36} cy={-32} r={3.4} fill="#eaf1ff" opacity={0.55} />
      <ellipse cx={-14} cy={-6} rx={4} ry={3} fill="#f6f9ff" opacity={0.6} />
    </g>
  );
}

/**
 * A single grooved pulley wheel — the reusable unit a compound (block-and-
 * tackle) rig is built from. Matches the `data-motif="pulley-wheel"` /
 * `data-grooved` convention already used by the ramp-to-the-treehouse world.
 */
function PulleyWheel({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g
      transform={`translate(${n(x)} ${n(y)})`}
      className="scene-pulley-wheel"
      data-motif="pulley-wheel"
      data-grooved="true"
    >
      <circle cx={0} cy={0} r={r} fill="#4c3c2e" />
      <circle cx={0} cy={0} r={n(r * 0.76)} fill="#caa15c" />
      <circle cx={0} cy={0} r={n(r * 0.52)} fill="#8a6238" />
      <circle cx={0} cy={0} r={n(r * 0.2)} fill="#332619" />
    </g>
  );
}

/**
 * The authored timber crane: an upright mast with a diagonal brace, a jib arm
 * reaching out over the bench, and a compound (block-and-tackle) pulley —
 * a fixed wheel at the mast head, a fixed wheel at the jib tip, and a
 * traveling wheel/hook block, all threaded by one continuous rope path. Every
 * timber surface carries the shared `worn-timber` material response.
 */
function TimberCrane({ x, y, scale = 1, paint }: { x: number; y: number; scale?: number; paint: Paint }) {
  const mastTopY = -274;
  const jibTipX = 330;
  const jibTipY = -126;
  const blockX = 252;
  const blockY = -42;
  return (
    <g
      transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}
      className="scene-crane"
      data-motif="timber-crane"
      data-framing="diagonal"
      data-key-direction="upper-left"
    >
      <g data-material="timber" filter={paint('worn-timber')}>
        <path d={`M-38,18 L-24,${mastTopY} L16,${mastTopY} L28,18 Z`} fill="#765035" />
        <path d={`M-12,${mastTopY + 16} L${jibTipX},${jibTipY} L${n(jibTipX - 10)},${n(jibTipY + 28)} L-12,${n(mastTopY + 42)} Z`} fill="#865b38" />
        <path d={`M-12,${n(mastTopY + 48)} L244,${n(jibTipY + 44)} L232,${n(jibTipY + 58)} L-8,${n(mastTopY + 72)} Z`} fill="#5f3e2a" />
        <path d="M-30,-92 L-126,12 L-104,32 L-20,-38 Z" fill="#543624" />
        <path d={`M-15,${n(mastTopY + 20)} L${n(jibTipX - 4)},${n(jibTipY + 3)}`} stroke="#bd8b59" strokeWidth={7} fill="none" opacity={0.7} />
        <path d="M-16,-228 L14,-214 M-20,-158 L20,-144 M-26,-76 L24,-62" stroke="#3f291d" strokeWidth={5} opacity={0.66} />
      </g>
      <path d="M-26,18 L-4,-274 L34,18 Z" fill="#261b18" opacity={0.24} transform="translate(24 18)" data-cast-direction="down-right" />
      <PulleyWheel x={6} y={n(mastTopY + 27)} r={18} />
      <PulleyWheel x={n(jibTipX - 18)} y={n(jibTipY + 22)} r={16} />
      <path
        d={`M6,${n(mastTopY + 27)} L${n(jibTipX - 18)},${n(jibTipY + 22)} L${n(
          jibTipX - 18,
        )},${blockY} L${blockX},${n(blockY + 22)}`}
        stroke="#caa15c"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-motif="rope"
      />
      <g transform={`translate(${blockX} ${n(blockY + 22)})`}>
        <PulleyWheel x={0} y={0} r={13} />
        <path d="M0,13 L0,34" stroke="#caa15c" strokeWidth={5} strokeLinecap="round" data-motif="rope" />
        <path d="M-14,34 L14,34 L10,52 L-10,52 Z" fill="#6a4c2c" filter={paint('worn-timber')} />
      </g>
    </g>
  );
}

/** Delia's workshop performance: leaning in, pointing at the crown, curious. */
const WORKSHOP_DELIA_PERFORMANCE: CharacterPerformance = {
  pose: 'point',
  lineOfAction: -18,
  shoulderTilt: 13,
  pelvisTilt: -7,
  weightFoot: 'left',
  gazeTarget: { x: 356, y: 478 },
  headTurn: -0.72,
  expression: 'curious',
  leftHand: 'point',
  rightHand: 'rest',
  leftHandTarget: { x: 404, y: 470 },
};

/** King Hiero's workshop performance: stable, attentive, and open to Delia's discovery. */
const WORKSHOP_KING_PERFORMANCE: CharacterPerformance = {
  pose: 'stand',
  lineOfAction: -8,
  shoulderTilt: -10,
  pelvisTilt: 6,
  weightFoot: 'right',
  gazeTarget: { x: 390, y: 486 },
  headTurn: -0.64,
  expression: 'concerned',
  leftHand: 'open',
  rightHand: 'rest',
  leftHandTarget: { x: 748, y: 508 },
};

const WORKSHOP_DELIA_PLACEMENT = { x: 650, y: 720, scale: 0.82 } as const;
const WORKSHOP_KING_PLACEMENT = { x: 930, y: 716, scale: 0.8 } as const;

function WorkshopLitCharacter({
  id,
  kind,
}: {
  id: SceneWorldProps['id'];
  kind: 'delia' | 'king';
}) {
  const appearance = kind === 'delia' ? WORKSHOP_DELIA_APPEARANCE : WORKSHOP_KING_APPEARANCE;
  const performance = kind === 'delia' ? WORKSHOP_DELIA_PERFORMANCE : WORKSHOP_KING_PERFORMANCE;
  const placement = kind === 'delia' ? WORKSHOP_DELIA_PLACEMENT : WORKSHOP_KING_PLACEMENT;
  const geometry = resolvePoseGeometry(appearance, performance, placement);
  const rendered = foreshortenGeometry(geometry);
  const headRadius = appearance.proportions.headRadius * placement.scale;
  const hemline = appearance.wardrobe.hemline;
  const hemRight = {
    x: geometry.hip.right.x + (rendered.ankle.right.x - geometry.hip.right.x) * hemline,
    y: geometry.hip.right.y + (rendered.ankle.right.y - geometry.hip.right.y) * hemline,
  };

  return (
    <g data-character-lighting="workshop" data-character={kind}>
      <CinematicCharacter
        id={(part) => id(`${kind}-${part}`)}
        x={placement.x}
        y={placement.y}
        scale={placement.scale}
        appearance={appearance}
        performance={performance}
        className={`scene-${kind}`}
      />
      <path
        d={`M${n(geometry.head.x - headRadius * 0.9)},${n(
          geometry.head.y - headRadius * 0.02,
        )} Q${n(geometry.head.x - headRadius * 0.68)},${n(
          geometry.head.y - headRadius * 0.7,
        )} ${n(geometry.head.x - headRadius * 0.1)},${n(
          geometry.head.y - headRadius * 0.9,
        )} M${n(geometry.shoulder.left.x)},${n(geometry.shoulder.left.y)} L${n(
          rendered.elbow.left.x,
        )},${n(rendered.elbow.left.y)}`}
        stroke="#ffd4a1"
        strokeWidth={n(kind === 'delia' ? 4.8 : 5.2)}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
        data-lighting="key"
      />
      <path
        d={`M${n(geometry.head.x + headRadius * 0.8)},${n(
          geometry.head.y + headRadius * 0.16,
        )} Q${n(geometry.head.x + headRadius * 0.54)},${n(
          geometry.head.y + headRadius * 0.7,
        )} ${n(geometry.head.x + headRadius * 0.06)},${n(
          geometry.head.y + headRadius * 0.86,
        )} M${n(geometry.shoulder.right.x)},${n(geometry.shoulder.right.y + 6)} Q${n(
          geometry.hip.right.x + 10,
        )},${n(geometry.hip.right.y)} ${n(hemRight.x)},${n(hemRight.y)}`}
        stroke="#7899b5"
        strokeWidth={n(kind === 'delia' ? 6 : 7)}
        fill="none"
        strokeLinecap="round"
        opacity={0.38}
        data-lighting="fill"
      />
      <path
        d={`M${n(geometry.head.x + headRadius * 0.92)},${n(
          geometry.head.y - headRadius * 0.08,
        )} Q${n(geometry.head.x + headRadius * 0.72)},${n(
          geometry.head.y - headRadius * 0.66,
        )} ${n(geometry.head.x + headRadius * 0.2)},${n(
          geometry.head.y - headRadius * 0.9,
        )} M${n(geometry.shoulder.right.x)},${n(geometry.shoulder.right.y)} L${n(
          rendered.elbow.right.x,
        )},${n(rendered.elbow.right.y)}`}
        stroke="#e7ae75"
        strokeWidth={2.8}
        fill="none"
        strokeLinecap="round"
        opacity={0.58}
        data-lighting="rim"
      />
    </g>
  );
}

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'crown-01-workshop-dusk': ({ id, paint, seed }) => (
    <g data-scene-art data-cinematic-scene="crown-01-workshop-dusk">
      <defs>
        <CinematicDefs
          id={id}
          seed={seed}
          lighting={WORKSHOP_LIGHTING}
          materials={WORKSHOP_MATERIALS}
        />
      </defs>

      {/* The sky is an opaque base; only selected distant geometry is softened. */}
      {sky(paint('duskSky'))}
      <rect
        x={0}
        y={0}
        width={VIEW_W}
        height={VIEW_H}
        fill={paint('workshop-practical')}
        data-lighting="practical"
      />

      <DepthLayer
        depth="far"
        treatment={{ opacity: 0.76 }}
      >
        <WorkshopSkyline baseY={438} />
        <WorkshopHarbor paint={paint} />
      </DepthLayer>

      {/* Mid: workshop threshold and diagonal crane frame the focal triangle. */}
      <DepthLayer depth="mid">
        <path
          d="M0,548 C246,522 476,550 690,534 C906,516 1072,538 1200,526 L1200,800 L0,800 Z"
          fill="#5c4938"
        />
        <path d="M0,548 C248,532 442,558 686,540" stroke="#b98454" strokeWidth={14} fill="none" opacity={0.48} />
        <g data-material="timber" filter={paint('worn-timber')}>
          <path d="M0,0 L72,0 L58,566 L0,586 Z" fill="#5f3e2a" />
          <path d="M0,18 L46,18 L34,550 L0,566 Z" fill="#9a6840" opacity={0.54} />
          <path d="M0,42 L1200,18 L1200,66 L0,92 Z" fill="#6c472e" />
          <path d="M10,54 L1200,30" stroke="#b98252" strokeWidth={8} opacity={0.56} />
        </g>
        <TimberCrane x={88} y={594} scale={1.04} paint={paint} />
        <path
          d="M85,610 C252,634 406,620 548,644"
          stroke="#241a18"
          strokeWidth={24}
          fill="none"
          opacity={0.26}
          data-cast-direction="down-right"
        />
      </DepthLayer>

      {/* Focus: crown, pointing child and attentive king form one triangular beat. */}
      <DepthLayer depth="focus">
        <g data-material="timber" data-motif="workbench">
          <path d="M142,528 Q332,506 526,532 L514,596 Q326,616 136,590 Z" fill="#855634" />
          <path d="M148,530 Q330,514 518,536" stroke="#c08b59" strokeWidth={12} fill="none" />
          <path d="M168,586 L142,732 L196,732 L222,592 Z M448,592 L478,732 L530,732 L500,584 Z" fill="#4d3124" />
          <path d="M220,552 C286,538 390,548 466,536" stroke="#4a2e22" strokeWidth={6} opacity={0.62} />
          <path
            d="M176,548 C264,526 416,538 498,542"
            stroke="#b78659"
            strokeWidth={3}
            opacity={0.44}
            filter={paint('worn-timber')}
          />
        </g>
        <path d="M194,610 C312,632 422,618 536,640" stroke="#241a18" strokeWidth={28} fill="none" opacity={0.3} data-cast-direction="down-right" />
        <WorkshopCrown x={356} y={476} scale={1.1} paint={paint} />
        <path
          d="M474,684 C572,708 666,702 746,724"
          stroke="#21191b"
          strokeWidth={30}
          fill="none"
          opacity={0.25}
          data-cast-direction="down-right"
        />
        <WorkshopLitCharacter id={id} kind="delia" />
        <path
          d="M786,690 C874,714 960,708 1046,728"
          stroke="#21191b"
          strokeWidth={34}
          fill="none"
          opacity={0.24}
          data-cast-direction="down-right"
        />
        <WorkshopLitCharacter id={id} kind="king" />
      </DepthLayer>

      {/* Near: one quiet cropped timber edge frames without competing. */}
      <DepthLayer depth="near">
        <g data-material="timber" data-motif="workshop-foreground">
          <path d="M0,706 L112,686 L154,800 L0,800 Z" fill="#43312d" />
          <path d="M0,728 L98,710 L126,800 L0,800 Z" fill="#65483a" opacity={0.72} />
          <path d="M18,724 L102,708" stroke="#92684a" strokeWidth={6} opacity={0.38} />
        </g>
      </DepthLayer>

      <Vignette paint={paint('vignette')} />
    </g>
  ),

  'crown-02-balance-scale': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('hallSky'))}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint('lampGlow')} opacity={0.5} />
      <Columns baseY={n(VIEW_H * 0.72)} height={n(VIEW_H * 0.5)} />
      {floor(n(VIEW_H * 0.72))}
      <BalanceScale x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.42)} scale={1.02} />
      <Crown x={n(VIEW_W * 0.5 - 154)} y={n(VIEW_H * 0.42 - 30)} scale={0.72} paint={paint} />
      <GoldLump x={n(VIEW_W * 0.5 + 154)} y={n(VIEW_H * 0.42 - 20)} scale={1.05} paint={paint} />
      <King x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.5)} scale={0.98} pose="proud" />
      <Delia x={n(VIEW_W * 0.82)} y={n(VIEW_H * 0.52)} scale={0.94} pose="stand" />
      {finish(paint)}
    </g>
  ),

  'crown-03-practice-bowl': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('homeSky'))}
      <rect x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.12)} width={n(VIEW_W * 0.3)} height={n(VIEW_H * 0.42)} rx={10} fill="#26407a" />
      <rect x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.12)} width={n(VIEW_W * 0.3)} height={n(VIEW_H * 0.42)} fill={paint('lampGlow')} opacity={0.4} />
      <rect x={n(VIEW_W * 0.6)} y={n(VIEW_H * 0.14)} width={n(VIEW_W * 0.26)} height={n(VIEW_H * 0.38)} fill="#3d5c93" />
      <line x1={n(VIEW_W * 0.73)} y1={n(VIEW_H * 0.14)} x2={n(VIEW_W * 0.73)} y2={n(VIEW_H * 0.52)} stroke="#26407a" strokeWidth={6} />
      <rect x={0} y={n(VIEW_H * 0.7)} width={VIEW_W} height={n(VIEW_H * 0.3)} fill="#6d4a2c" />
      <rect x={0} y={n(VIEW_H * 0.7)} width={VIEW_W} height={12} fill="#523a20" />
      <rect x={n(VIEW_W * 0.16)} y={n(VIEW_H * 0.66)} width={n(VIEW_W * 0.5)} height={n(VIEW_H * 0.06)} rx={8} fill="#875a34" />
      <Bowl cx={n(VIEW_W * 0.4)} topY={n(VIEW_H * 0.5)} radius={118} depth={128} levelY={n(VIEW_H * 0.56)} paint={paint} />
      <Stone x={n(VIEW_W * 0.4)} y={n(VIEW_H * 0.6)} scale={1} />
      <Delia x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.44)} scale={1.02} pose="kneel" />
      {finish(paint)}
    </g>
  ),

  'crown-04-crown-test': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('hallSky'))}
      <Columns baseY={n(VIEW_H * 0.7)} height={n(VIEW_H * 0.46)} />
      <Lamp x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.2)} scale={1.05} />
      {floor(n(VIEW_H * 0.7))}
      <rect x={n(VIEW_W * 0.22)} y={n(VIEW_H * 0.64)} width={n(VIEW_W * 0.56)} height={n(VIEW_H * 0.08)} rx={10} fill="#8a5f39" />
      <Bowl cx={n(VIEW_W * 0.42)} topY={n(VIEW_H * 0.5)} radius={104} depth={112} levelY={n(VIEW_H * 0.55)} paint={paint} />
      <Crown x={n(VIEW_W * 0.62)} y={n(VIEW_H * 0.6)} scale={0.78} tilt={-4} paint={paint} />
      <GoldLump x={n(VIEW_W * 0.72)} y={n(VIEW_H * 0.64)} scale={0.9} paint={paint} />
      <Delia x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.5)} scale={1} pose="present" />
      <King x={n(VIEW_W * 0.84)} y={n(VIEW_H * 0.46)} scale={0.96} pose="lean" />
      <Goldsmith x={n(VIEW_W * 0.93)} y={n(VIEW_H * 0.52)} scale={0.82} />
      {finish(paint)}
    </g>
  ),

  'crown-05-displacement-compare': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('compareSky'))}
      <Columns baseY={n(VIEW_H * 0.68)} height={n(VIEW_H * 0.42)} />
      {floor(n(VIEW_H * 0.68))}
      <rect x={n(VIEW_W * 0.06)} y={n(VIEW_H * 0.62)} width={n(VIEW_W * 0.6)} height={n(VIEW_H * 0.07)} rx={10} fill="#8a5f39" />
      <Bowl cx={n(VIEW_W * 0.2)} topY={n(VIEW_H * 0.46)} radius={104} depth={116} levelY={n(VIEW_H * 0.545)} paint={paint} side="gold" />
      <GoldLump x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.56)} scale={0.92} paint={paint} />
      <Bowl cx={n(VIEW_W * 0.46)} topY={n(VIEW_H * 0.46)} radius={104} depth={116} levelY={n(VIEW_H * 0.5)} paint={paint} side="crown" />
      <Crown x={n(VIEW_W * 0.46)} y={n(VIEW_H * 0.5)} scale={0.66} tilt={6} paint={paint} />
      <Delia x={n(VIEW_W * 0.72)} y={n(VIEW_H * 0.42)} scale={1} pose="point" />
      <King x={n(VIEW_W * 0.9)} y={n(VIEW_H * 0.44)} scale={0.94} pose="surprise" />
      {finish(paint)}
    </g>
  ),

  'crown-06-honest-reveal': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('hallSky'))}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={paint('lampGlow')} opacity={0.45} />
      <Columns baseY={n(VIEW_H * 0.72)} height={n(VIEW_H * 0.5)} />
      {floor(n(VIEW_H * 0.72))}
      <rect x={n(VIEW_W * 0.24)} y={n(VIEW_H * 0.66)} width={n(VIEW_W * 0.5)} height={n(VIEW_H * 0.06)} rx={8} fill="#8a5f39" />
      <Crown x={n(VIEW_W * 0.4)} y={n(VIEW_H * 0.62)} scale={0.8} paint={paint} />
      <GoldLump x={n(VIEW_W * 0.54)} y={n(VIEW_H * 0.66)} scale={0.8} silver paint={paint} />
      <King x={n(VIEW_W * 0.76)} y={n(VIEW_H * 0.44)} scale={1} pose="gentle" />
      <Delia x={n(VIEW_W * 0.6)} y={n(VIEW_H * 0.5)} scale={0.94} pose="stand" />
      <Goldsmith x={n(VIEW_W * 0.16)} y={n(VIEW_H * 0.48)} scale={0.96} sheepish />
      {finish(paint)}
    </g>
  ),

  'crown-07-moonlit-quiet': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('nightSky'))}
      <StarField seed={seed + 40} count={46} x={n(VIEW_W * 0.05)} y={20} width={n(VIEW_W * 0.9)} height={n(VIEW_H * 0.4)} color="#dce8ff" />
      <g data-motif="moon" data-cx={n(VIEW_W * 0.78)} data-cy={n(VIEW_H * 0.22)}>
        <Moon cx={n(VIEW_W * 0.78)} cy={n(VIEW_H * 0.22)} r={52} glow={paint('moonGlow')} />
      </g>
      <Skyline baseY={n(VIEW_H * 0.58)} seed={seed + 7} />
      <Harbor topY={n(VIEW_H * 0.58)} height={n(VIEW_H * 0.14)} fill={DEEP_SEA} />
      <rect x={0} y={n(VIEW_H * 0.72)} width={VIEW_W} height={n(VIEW_H * 0.28)} fill="#2b315b" />
      <rect x={n(VIEW_W * 0.05)} y={n(VIEW_H * 0.74)} width={n(VIEW_W * 0.46)} height={n(VIEW_H * 0.16)} rx={20} fill="#5b5c92" />
      <ellipse cx={n(VIEW_W * 0.16)} cy={n(VIEW_H * 0.76)} rx={78} ry={40} fill="#eef1f8" />
      <Delia x={n(VIEW_W * 0.17)} y={n(VIEW_H * 0.73)} scale={0.92} pose="sleep" />
      <path d={`M${n(VIEW_W * 0.05)},${n(VIEW_H * 0.92)} L${n(VIEW_W * 0.05)},${n(VIEW_H * 0.82)} Q${n(VIEW_W * 0.28)},${n(VIEW_H * 0.74)} ${n(VIEW_W * 0.51)},${n(VIEW_H * 0.84)} L${n(VIEW_W * 0.51)},${n(VIEW_H * 0.96)} Z`} fill="#7d7cb6" />
      <g className="scene-bowl" data-motif="bowl">
        <ellipse cx={n(VIEW_W * 0.72)} cy={n(VIEW_H * 0.82)} rx={92} ry={34} fill="#e7d6b4" stroke={STONE_DARK} strokeWidth={3} />
        <ellipse cx={n(VIEW_W * 0.72)} cy={n(VIEW_H * 0.82)} rx={80} ry={26} fill={WATER_BLUE} />
        <g className="scene-ripple">
          <path d={`M${n(VIEW_W * 0.66)},${n(VIEW_H * 0.83)} q40,-7 80,0`} stroke="#cfe6f4" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round" />
          <path d={`M${n(VIEW_W * 0.68)},${n(VIEW_H * 0.86)} q30,-5 60,0`} stroke="#cfe6f4" strokeWidth={2} fill="none" opacity={0.4} strokeLinecap="round" />
        </g>
        <circle cx={n(VIEW_W * 0.75)} cy={n(VIEW_H * 0.8)} r={20} fill="#eef4ff" opacity={0.85} />
        <circle cx={n(VIEW_W * 0.71)} cy={n(VIEW_H * 0.805)} r={9} fill="#dfe9ff" opacity={0.7} />
      </g>
      <SleepMotes x={n(VIEW_W * 0.3)} y={n(VIEW_H * 0.6)} />
      {finish(paint)}
    </g>
  ),
};

export const crownWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
