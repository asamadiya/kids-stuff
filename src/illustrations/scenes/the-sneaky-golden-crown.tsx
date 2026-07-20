import type { ReactNode } from 'react';
import {
  Blush,
  Capsule,
  ClosedEye,
  Cloud,
  Eye,
  GrainFilter,
  GrainWash,
  LinearGradient,
  Moon,
  OpenMouth,
  RadialGradient,
  Smile,
  StarField,
  SunGlow,
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
 * WORLD: The Sneaky Golden Crown — displacement in a Syracuse workshop at dusk.
 * Motifs: the golden crown, a level balance scale (equal weight), a practice
 * bowl with a marked waterline, two compare bowls where the crown's water rises
 * higher, an honest reveal, and a moonlit quiet landing. Warm Aegean dusk with
 * foreground / midground / background depth on every page.
 */

type Paint = SceneWorldProps['paint'];

const SEA = '#245b7a';
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

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'crown-01-workshop-dusk': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('duskSky'))}
      <SunGlow cx={n(VIEW_W * 0.82)} cy={n(VIEW_H * 0.24)} r={64} core="#ffe6ab" halo="#f3ad63" />
      <Cloud x={n(VIEW_W * 0.24)} y={n(VIEW_H * 0.16)} scale={0.8} fill="#ffdcb0" opacity={0.4} />
      <Skyline baseY={n(VIEW_H * 0.6)} seed={seed} />
      <Harbor topY={n(VIEW_H * 0.6)} height={n(VIEW_H * 0.12)} fill={SEA} />
      <rect x={0} y={n(VIEW_H * 0.72)} width={VIEW_W} height={n(VIEW_H * 0.28)} fill="#7c5636" />
      <rect x={0} y={n(VIEW_H * 0.72)} width={VIEW_W} height={12} fill="#5f3f26" />
      <rect x={n(VIEW_W * 0.08)} y={n(VIEW_H * 0.66)} width={n(VIEW_W * 0.5)} height={n(VIEW_H * 0.1)} rx={10} fill="#8a5f39" />
      <rect x={n(VIEW_W * 0.1)} y={n(VIEW_H * 0.64)} width={n(VIEW_W * 0.46)} height={10} fill="#a9793f" />
      <ellipse cx={n(VIEW_W * 0.28)} cy={n(VIEW_H * 0.62)} rx={92} ry={22} fill="#b3413f" />
      <Crown x={n(VIEW_W * 0.28)} y={n(VIEW_H * 0.56)} scale={1.25} paint={paint} />
      {range(3).map((i) => (
        <rect key={i} x={n(VIEW_W * 0.44 + i * 26)} y={n(VIEW_H * 0.6)} width={10} height={44} rx={4} fill="#6d4f2c" />
      ))}
      <Delia x={n(VIEW_W * 0.66)} y={n(VIEW_H * 0.5)} scale={1.05} pose="stand" />
      <King x={n(VIEW_W * 0.86)} y={n(VIEW_H * 0.4)} scale={1.02} pose="proud" />
      {finish(paint)}
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
