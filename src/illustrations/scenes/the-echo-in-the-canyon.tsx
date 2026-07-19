import type { ReactNode } from 'react';
import {
  Blush,
  Capsule,
  ClosedEye,
  Eye,
  GrainFilter,
  GrainWash,
  GrassRow,
  LinearGradient,
  Moon,
  OpenMouth,
  RadialGradient,
  Smile,
  SoftBlur,
  SoundArcs,
  StarField,
  SunGlow,
  VIEW_H,
  VIEW_W,
  Vignette,
  Water,
  n,
  range,
  requireScenePage,
  type SceneWorld,
  type SceneWorldProps,
} from '../shared';

/*
 * WORLD: The Echo in the Canyon — red-rock dusk, safe rim, voice arcs, river
 * far below, first stars, and a warm camp tucked under the canyon night.
 */

const SKIN = '#d99062';
const SKIN_LIGHT = '#efb17e';
const HAIR = '#372316';
const THEO = '#5f83a8';
const THEO_DARK = '#3d5f83';
const JUNO = '#d97880';
const JUNO_DARK = '#b95362';
const MOM = '#b46b8f';
const MOM_DARK = '#7f4168';
const STONE_DARK = '#5c2f39';
const STONE_RIM = '#8e4c3f';
const STONE_EDGE = '#c46b4d';
const RAIL = '#d5a06e';
const RAIL_SHADOW = '#9f684b';
const ECHO = '#ffe6ba';
const ECHO_COOL = '#cfe4ff';

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('skySunset')}
        stops={[
          { offset: 0, color: '#6d7698' },
          { offset: 0.55, color: '#e59a74' },
          { offset: 1, color: '#f6c179' },
        ]}
      />
      <LinearGradient
        id={id('skyAmber')}
        stops={[
          { offset: 0, color: '#8a7390' },
          { offset: 0.65, color: '#e69a6a' },
          { offset: 1, color: '#ffd18b' },
        ]}
      />
      <LinearGradient
        id={id('skyTender')}
        stops={[
          { offset: 0, color: '#5d5784' },
          { offset: 0.6, color: '#aa7890' },
          { offset: 1, color: '#f4bd76' },
        ]}
      />
      <LinearGradient
        id={id('skyHero')}
        stops={[
          { offset: 0, color: '#4a4d78' },
          { offset: 0.55, color: '#d87554' },
          { offset: 1, color: '#ffb35e' },
        ]}
      />
      <LinearGradient
        id={id('skyRosy')}
        stops={[
          { offset: 0, color: '#5c5d8f' },
          { offset: 0.55, color: '#d58aa6' },
          { offset: 1, color: '#f2b197' },
        ]}
      />
      <LinearGradient
        id={id('skyIndigo')}
        stops={[
          { offset: 0, color: '#18234a' },
          { offset: 0.62, color: '#35446f' },
          { offset: 1, color: '#8a6b86' },
        ]}
      />
      <LinearGradient
        id={id('skyNight')}
        stops={[
          { offset: 0, color: '#07142e' },
          { offset: 0.62, color: '#12264b' },
          { offset: 1, color: '#28345d' },
        ]}
      />
      <LinearGradient
        id={id('canyonFar')}
        stops={[
          { offset: 0, color: '#e09a74' },
          { offset: 1, color: '#99535a' },
        ]}
      />
      <LinearGradient
        id={id('canyonMid')}
        stops={[
          { offset: 0, color: '#cf704f' },
          { offset: 1, color: '#6e3748' },
        ]}
      />
      <LinearGradient
        id={id('canyonNear')}
        stops={[
          { offset: 0, color: '#b85b43' },
          { offset: 1, color: '#4b2838' },
        ]}
      />
      <LinearGradient
        id={id('river')}
        x1={0}
        y1={0}
        x2={1}
        y2={0}
        stops={[
          { offset: 0, color: '#6aaac0' },
          { offset: 0.5, color: '#d7f0ed' },
          { offset: 1, color: '#577ca2' },
        ]}
      />
      <RadialGradient
        id={id('tentGlow')}
        stops={[
          { offset: 0, color: '#ffe5a3', opacity: 0.95 },
          { offset: 0.55, color: '#e98748', opacity: 0.45 },
          { offset: 1, color: '#e98748', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('fireGlow')}
        stops={[
          { offset: 0, color: '#ffe5a3', opacity: 0.9 },
          { offset: 0.55, color: '#f08b35', opacity: 0.38 },
          { offset: 1, color: '#f08b35', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#f4f0d2', opacity: 0.8 },
          { offset: 1, color: '#f4f0d2', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.58, color: '#000000', opacity: 0 },
          { offset: 1, color: '#120b19', opacity: 0.38 },
        ]}
      />
      <SoftBlur id={id('softBlur')} amount={5} />
      <GrainFilter id={id('grain')} frequency={0.86} opacity={0.05} />
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

function CanyonWall({
  y,
  depth,
  fill,
  mirror = false,
  opacity = 1,
}: {
  y: number;
  depth: number;
  fill: string;
  mirror?: boolean;
  opacity?: number;
}) {
  const crestA = mirror ? 0.82 : 0.18;
  const crestB = mirror ? 0.58 : 0.42;
  const crestC = mirror ? 0.28 : 0.74;
  const d = `M0,${n(y + depth)} L0,${n(y + 54)} C${n(VIEW_W * 0.12)},${n(
    y + 18,
  )} ${n(VIEW_W * crestA)},${n(y + 70)} ${n(VIEW_W * 0.34)},${n(
    y + 36,
  )} C${n(VIEW_W * crestB)},${n(y - 12)} ${n(VIEW_W * crestC)},${n(
    y + 96,
  )} ${VIEW_W},${n(y + 42)} L${VIEW_W},${n(y + depth)} Z`;
  return (
    <g opacity={opacity}>
      <path d={d} fill={fill} />
      {range(5).map((i) => (
        <path
          key={i}
          d={`M${n(-40 + i * 28)},${n(y + 94 + i * 42)} C${n(VIEW_W * 0.22)},${n(
            y + 60 + i * 28,
          )} ${n(VIEW_W * 0.55)},${n(y + 150 + i * 24)} ${n(VIEW_W + 40)},${n(
            y + 82 + i * 36,
          )}`}
          stroke={i % 2 === 0 ? '#f0b083' : '#7f4150'}
          strokeWidth={n(7 - i * 0.7)}
          opacity={n(0.22 - i * 0.015)}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function CanyonDepth({
  paint,
  seed,
  night = false,
  blur = false,
}: {
  paint: SceneWorldProps['paint'];
  seed: number;
  night?: boolean;
  blur?: boolean;
}) {
  const groupProps = blur ? { filter: paint('softBlur'), opacity: 0.72 } : {};
  return (
    <g {...groupProps}>
      <CanyonWall y={n(VIEW_H * 0.22)} depth={500} fill={night ? '#293151' : paint('canyonFar')} opacity={night ? 0.72 : 0.95} />
      <CanyonWall y={n(VIEW_H * 0.34)} depth={460} fill={night ? '#202846' : paint('canyonMid')} mirror opacity={night ? 0.78 : 0.96} />
      <Water x={n(VIEW_W * 0.44)} y={n(VIEW_H * 0.67)} width={n(VIEW_W * 0.26)} height={18} rx={9} fill={paint('river')} highlight="#fff6d0" />
      <path
        d={`M${n(VIEW_W * 0.2)},${n(VIEW_H * 0.73)} C${n(VIEW_W * 0.4)},${n(
          VIEW_H * 0.62,
        )} ${n(VIEW_W * 0.6)},${n(VIEW_H * 0.81)} ${n(VIEW_W * 0.98)},${n(
          VIEW_H * 0.66,
        )}`}
        stroke={night ? '#10192e' : '#3f2b39'}
        strokeWidth={70}
        opacity={0.32}
        fill="none"
        strokeLinecap="round"
      />
      <GrassRow seed={seed + 17} baseY={n(VIEW_H * 0.52)} x={0} width={220} blades={14} height={22} lean={4} fill={night ? '#16253a' : '#6b5b42'} />
    </g>
  );
}

function Rim({ topY = VIEW_H * 0.68, night = false }: { topY?: number; night?: boolean }) {
  return (
    <g className="scene-rim">
      <path
        d={`M0,${VIEW_H} L0,${n(topY)} C${n(VIEW_W * 0.25)},${n(
          topY - 42,
        )} ${n(VIEW_W * 0.62)},${n(topY + 22)} ${VIEW_W},${n(
          topY - 18,
        )} L${VIEW_W},${VIEW_H} Z`}
        fill={night ? '#1a263a' : STONE_RIM}
      />
      <path
        d={`M0,${n(topY + 44)} C${n(VIEW_W * 0.28)},${n(topY + 4)} ${n(
          VIEW_W * 0.68,
        )},${n(topY + 78)} ${VIEW_W},${n(topY + 18)}`}
        stroke={night ? '#2b3a55' : STONE_EDGE}
        strokeWidth={24}
        opacity={0.5}
        fill="none"
      />
      {range(6).map((i) => (
        <path
          key={i}
          d={`M${n(i * 230 - 40)},${n(topY + 95 + (i % 2) * 18)} q${n(
            86,
          )},${n(-26 - i * 2)} ${n(190)},${n(6 + i * 2)}`}
          stroke={night ? '#0f1b2c' : STONE_DARK}
          strokeWidth={5}
          opacity={0.24}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function SafetyRailing({
  y,
  x = 80,
  width = 760,
  scale = 1,
  dark = false,
}: {
  y: number;
  x?: number;
  width?: number;
  scale?: number;
  dark?: boolean;
}) {
  const rail = dark ? '#3c4058' : RAIL;
  const post = dark ? '#252a40' : RAIL_SHADOW;
  return (
    <g className="scene-railing" data-motif="rail">
      <Capsule x1={x} y1={y} x2={n(x + width)} y2={n(y - 18 * scale)} width={n(18 * scale)} fill={rail} />
      <Capsule x1={n(x + 12 * scale)} y1={n(y + 52 * scale)} x2={n(x + width + 8 * scale)} y2={n(y + 30 * scale)} width={n(14 * scale)} fill={rail} />
      {range(7).map((i) => {
        const px = n(x + i * (width / 6));
        return (
          <Capsule
            key={i}
            x1={px}
            y1={n(y - 22 * scale)}
            x2={n(px + 10 * scale)}
            y2={n(y + 85 * scale)}
            width={n(18 * scale)}
            fill={post}
          />
        );
      })}
    </g>
  );
}

function Hawk({ x, y, scale = 1, dark = '#503942' }: { x: number; y: number; scale?: number; dark?: string }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`} fill="none" stroke={dark} strokeWidth={4} strokeLinecap="round" opacity={0.75}>
      <path d="M-34,0 q20,-18 42,-2 q20,-16 42,2" />
      <path d="M2,-2 q6,8 14,0" />
    </g>
  );
}

function Head({
  cx,
  cy,
  r,
  hair = HAIR,
  mouth = 'smile',
  asleep = false,
}: {
  cx: number;
  cy: number;
  r: number;
  hair?: string;
  mouth?: 'smile' | 'open' | 'soft';
  asleep?: boolean;
}) {
  return (
    <g>
      <circle cx={n(cx)} cy={n(cy)} r={r} fill={SKIN_LIGHT} />
      <path
        d={`M${n(cx - r)},${n(cy - r * 0.22)} Q${n(cx - r * 0.22)},${n(
          cy - r * 1.2,
        )} ${n(cx + r * 0.92)},${n(cy - r * 0.16)} Q${n(cx + r * 0.45)},${n(
          cy - r * 0.56,
        )} ${n(cx - r)},${n(cy - r * 0.22)} Z`}
        fill={hair}
      />
      {asleep ? (
        <>
          <ClosedEye cx={n(cx - r * 0.32)} cy={n(cy - r * 0.02)} w={n(r * 0.36)} />
          <ClosedEye cx={n(cx + r * 0.32)} cy={n(cy - r * 0.02)} w={n(r * 0.36)} />
        </>
      ) : (
        <>
          <Eye cx={n(cx - r * 0.32)} cy={n(cy - r * 0.04)} r={n(r * 0.11)} />
          <Eye cx={n(cx + r * 0.32)} cy={n(cy - r * 0.04)} r={n(r * 0.11)} />
        </>
      )}
      <Blush cx={n(cx - r * 0.52)} cy={n(cy + r * 0.3)} r={n(r * 0.14)} />
      <Blush cx={n(cx + r * 0.52)} cy={n(cy + r * 0.3)} r={n(r * 0.14)} />
      {mouth === 'open' ? (
        <OpenMouth cx={n(cx)} cy={n(cy + r * 0.42)} rx={n(r * 0.18)} ry={n(r * 0.25)} />
      ) : (
        <Smile cx={n(cx)} cy={n(cy + r * 0.4)} w={n(r * 0.56)} curve={mouth === 'soft' ? n(r * 0.18) : n(r * 0.3)} width={n(r * 0.08)} />
      )}
    </g>
  );
}

function Person({
  x,
  y,
  scale = 1,
  kind,
  pose = 'stand',
  mouth = 'smile',
  silhouette = false,
  asleep = false,
}: {
  x: number;
  y: number;
  scale?: number;
  kind: 'theo' | 'juno' | 'mom';
  pose?: 'stand' | 'cup' | 'open' | 'kneel' | 'handChest' | 'wave' | 'sleep';
  mouth?: 'smile' | 'open' | 'soft';
  silhouette?: boolean;
  asleep?: boolean;
}) {
  const body = silhouette ? '#141827' : kind === 'theo' ? THEO : kind === 'juno' ? JUNO : MOM;
  const dark = silhouette ? '#101421' : kind === 'theo' ? THEO_DARK : kind === 'juno' ? JUNO_DARK : MOM_DARK;
  const h = kind === 'mom' ? 78 : 58;
  const r = kind === 'mom' ? 24 : 20;
  const base = kind === 'mom' ? 122 : 94;
  const headY = n(-h * 0.55);
  if (pose === 'sleep') {
    return (
      <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
        <Capsule x1={-52} y1={0} x2={54} y2={10} width={44} fill={body} />
        <Head cx={-58} cy={-12} r={r} mouth="soft" asleep />
        <path d="M-18,4 q44,-30 104,-2 q-22,38 -104,34 Z" fill={dark} opacity={0.72} />
      </g>
    );
  }
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
      {pose === 'kneel' ? (
        <>
          <Capsule x1={0} y1={0} x2={-8} y2={base * 0.55} width={kind === 'mom' ? 44 : 36} fill={body} />
          <Capsule x1={-6} y1={n(base * 0.52)} x2={-52} y2={n(base * 0.8)} width={16} fill={dark} />
          <Capsule x1={10} y1={n(base * 0.52)} x2={48} y2={n(base * 0.82)} width={16} fill={dark} />
        </>
      ) : (
        <>
          <Capsule x1={0} y1={0} x2={0} y2={base} width={kind === 'mom' ? 42 : 34} fill={body} />
          <Capsule x1={-10} y1={n(base * 0.95)} x2={-18} y2={n(base * 1.35)} width={14} fill={dark} />
          <Capsule x1={10} y1={n(base * 0.95)} x2={20} y2={n(base * 1.35)} width={14} fill={dark} />
          <ellipse cx={-20} cy={n(base * 1.38)} rx={12} ry={6} fill={silhouette ? '#101421' : SKIN} />
          <ellipse cx={22} cy={n(base * 1.38)} rx={12} ry={6} fill={silhouette ? '#101421' : SKIN} />
        </>
      )}
      {pose === 'cup' ? (
        <>
          <Capsule x1={-14} y1={12} x2={-38} y2={headY} width={13} fill={body} />
          <Capsule x1={14} y1={12} x2={38} y2={headY} width={13} fill={body} />
          <ellipse cx={-40} cy={headY} rx={11} ry={8} fill={silhouette ? '#101421' : SKIN_LIGHT} />
          <ellipse cx={40} cy={headY} rx={11} ry={8} fill={silhouette ? '#101421' : SKIN_LIGHT} />
        </>
      ) : pose === 'open' ? (
        <>
          <Capsule x1={-16} y1={12} x2={-66} y2={-42} width={14} fill={body} />
          <Capsule x1={16} y1={12} x2={66} y2={-42} width={14} fill={body} />
          <ellipse cx={-70} cy={-46} rx={11} ry={9} fill={silhouette ? '#101421' : SKIN_LIGHT} />
          <ellipse cx={70} cy={-46} rx={11} ry={9} fill={silhouette ? '#101421' : SKIN_LIGHT} />
        </>
      ) : pose === 'handChest' ? (
        <>
          <Capsule x1={-14} y1={14} x2={-42} y2={52} width={13} fill={body} />
          <Capsule x1={14} y1={14} x2={-6} y2={34} width={13} fill={body} />
          <ellipse cx={-6} cy={34} rx={11} ry={8} fill={silhouette ? '#101421' : SKIN_LIGHT} />
        </>
      ) : pose === 'wave' ? (
        <>
          <Capsule x1={-12} y1={12} x2={-52} y2={-24} width={13} fill={body} />
          <Capsule x1={12} y1={12} x2={44} y2={-60} width={13} fill={body} />
          <ellipse cx={48} cy={-66} rx={10} ry={9} fill={silhouette ? '#101421' : SKIN_LIGHT} />
        </>
      ) : (
        <>
          <Capsule x1={-14} y1={12} x2={-48} y2={62} width={13} fill={body} />
          <Capsule x1={14} y1={12} x2={48} y2={62} width={13} fill={body} />
        </>
      )}
      <Head cx={0} cy={headY} r={r} mouth={mouth} hair={kind === 'juno' ? '#4c2b24' : HAIR} asleep={asleep} />
      {kind === 'juno' && !silhouette ? (
        <>
          <circle cx={n(-r * 1.02)} cy={n(headY + 2)} r={9} fill="#4c2b24" />
          <circle cx={n(r * 1.02)} cy={n(headY + 2)} r={9} fill="#4c2b24" />
        </>
      ) : null}
    </g>
  );
}

function Tent({ paint }: { paint: SceneWorldProps['paint'] }) {
  return (
    <g className="scene-tent" data-motif="tent">
      <ellipse cx={n(VIEW_W * 0.33)} cy={n(VIEW_H * 0.68)} rx={230} ry={150} fill={paint('tentGlow')} />
      <path
        d={`M${n(VIEW_W * 0.12)},${n(VIEW_H * 0.75)} L${n(VIEW_W * 0.33)},${n(
          VIEW_H * 0.43,
        )} L${n(VIEW_W * 0.55)},${n(VIEW_H * 0.75)} Z`}
        fill="#d7774b"
      />
      <path
        d={`M${n(VIEW_W * 0.18)},${n(VIEW_H * 0.74)} L${n(VIEW_W * 0.33)},${n(
          VIEW_H * 0.49,
        )} L${n(VIEW_W * 0.49)},${n(VIEW_H * 0.74)} Z`}
        fill="#f1b469"
      />
      <path
        d={`M${n(VIEW_W * 0.33)},${n(VIEW_H * 0.49)} L${n(VIEW_W * 0.33)},${n(
          VIEW_H * 0.74,
        )}`}
        stroke="#7f3f33"
        strokeWidth={6}
      />
      <path
        d={`M${n(VIEW_W * 0.25)},${n(VIEW_H * 0.74)} Q${n(VIEW_W * 0.33)},${n(
          VIEW_H * 0.61,
        )} ${n(VIEW_W * 0.41)},${n(VIEW_H * 0.74)} Z`}
        fill="#5b3142"
        opacity={0.82}
      />
      <Person x={n(VIEW_W * 0.36)} y={n(VIEW_H * 0.69)} scale={0.55} kind="theo" pose="sleep" mouth="soft" asleep />
      <Person x={n(VIEW_W * 0.43)} y={n(VIEW_H * 0.71)} scale={0.45} kind="juno" pose="sleep" mouth="soft" asleep />
    </g>
  );
}

function Campfire({ paint }: { paint: SceneWorldProps['paint'] }) {
  return (
    <g className="scene-campfire" data-motif="campfire">
      <ellipse cx={n(VIEW_W * 0.7)} cy={n(VIEW_H * 0.72)} rx={150} ry={95} fill={paint('fireGlow')} />
      <Capsule x1={n(VIEW_W * 0.64)} y1={n(VIEW_H * 0.77)} x2={n(VIEW_W * 0.75)} y2={n(VIEW_H * 0.72)} width={12} fill="#623722" />
      <Capsule x1={n(VIEW_W * 0.64)} y1={n(VIEW_H * 0.72)} x2={n(VIEW_W * 0.76)} y2={n(VIEW_H * 0.77)} width={12} fill="#4b2c21" />
      <path
        d={`M${n(VIEW_W * 0.7)},${n(VIEW_H * 0.7)} C${n(VIEW_W * 0.66)},${n(
          VIEW_H * 0.65,
        )} ${n(VIEW_W * 0.72)},${n(VIEW_H * 0.61)} ${n(VIEW_W * 0.7)},${n(
          VIEW_H * 0.55,
        )} C${n(VIEW_W * 0.76)},${n(VIEW_H * 0.61)} ${n(VIEW_W * 0.75)},${n(
          VIEW_H * 0.67,
        )} ${n(VIEW_W * 0.7)},${n(VIEW_H * 0.7)} Z`}
        fill="#ff9b32"
      />
      <path
        d={`M${n(VIEW_W * 0.7)},${n(VIEW_H * 0.69)} C${n(VIEW_W * 0.68)},${n(
          VIEW_H * 0.65,
        )} ${n(VIEW_W * 0.72)},${n(VIEW_H * 0.62)} ${n(VIEW_W * 0.71)},${n(
          VIEW_H * 0.58,
        )} C${n(VIEW_W * 0.74)},${n(VIEW_H * 0.63)} ${n(VIEW_W * 0.73)},${n(
          VIEW_H * 0.67,
        )} ${n(VIEW_W * 0.7)},${n(VIEW_H * 0.69)} Z`}
        fill="#ffe28b"
      />
    </g>
  );
}

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'echo-01-canyon-edge': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skySunset'))}
      <SunGlow cx={n(VIEW_W * 0.15)} cy={n(VIEW_H * 0.22)} r={56} core="#fff0bf" halo="#f4a96a44" />
      <Hawk x={n(VIEW_W * 0.76)} y={n(VIEW_H * 0.2)} scale={0.9} />
      <CanyonDepth paint={paint} seed={seed} />
      <CanyonWall y={n(VIEW_H * 0.5)} depth={420} fill={paint('canyonNear')} mirror opacity={0.92} />
      <Rim topY={n(VIEW_H * 0.64)} />
      <SafetyRailing y={n(VIEW_H * 0.56)} x={n(VIEW_W * 0.08)} width={n(VIEW_W * 0.62)} />
      <Person x={n(VIEW_W * 0.28)} y={n(VIEW_H * 0.57)} scale={0.68} kind="theo" pose="stand" mouth="soft" />
      <Person x={n(VIEW_W * 0.34)} y={n(VIEW_H * 0.55)} scale={0.82} kind="mom" pose="stand" mouth="smile" />
      <Person x={n(VIEW_W * 0.42)} y={n(VIEW_H * 0.58)} scale={0.6} kind="juno" pose="stand" mouth="smile" />
      <GrassRow seed={seed + 4} baseY={n(VIEW_H * 0.85)} x={0} width={VIEW_W} blades={34} height={34} lean={-5} fill="#70583c" />
      {finish(paint)}
    </g>
  ),

  'echo-02-first-hello': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skyAmber'))}
      <SunGlow cx={n(VIEW_W * 0.83)} cy={n(VIEW_H * 0.18)} r={72} core="#ffe2a4" halo="#f09b6044" />
      <g filter={paint('softBlur')} opacity={0.78}>
        <CanyonDepth paint={paint} seed={seed} />
        <CanyonWall y={n(VIEW_H * 0.48)} depth={410} fill={paint('canyonMid')} mirror opacity={0.82} />
      </g>
      <SoundArcs cx={n(VIEW_W * 0.37)} cy={n(VIEW_H * 0.43)} from={2} to={4} step={48} startAngle={-28} endAngle={25} stroke={ECHO} opacity={0.58} width={5} />
      <SoundArcs cx={n(VIEW_W * 0.86)} cy={n(VIEW_H * 0.38)} from={1} to={3} step={36} startAngle={150} endAngle={205} stroke="#fff1ca" opacity={0.32} width={4} />
      <Rim topY={n(VIEW_H * 0.66)} />
      <SafetyRailing y={n(VIEW_H * 0.6)} x={n(VIEW_W * 0.04)} width={n(VIEW_W * 0.55)} scale={1.05} />
      <Person x={n(VIEW_W * 0.3)} y={n(VIEW_H * 0.59)} scale={1.35} kind="juno" pose="cup" mouth="open" />
      <Person x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.6)} scale={0.86} kind="theo" pose="stand" mouth="smile" />
      <Person x={n(VIEW_W * 0.72)} y={n(VIEW_H * 0.56)} scale={1.02} kind="mom" pose="stand" mouth="smile" />
      <Hawk x={n(VIEW_W * 0.72)} y={n(VIEW_H * 0.24)} scale={0.55} dark="#704452" />
      {finish(paint)}
    </g>
  ),

  'echo-03-shy-breath': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skyTender'))}
      <g filter={paint('softBlur')} opacity={0.72}>
        <CanyonDepth paint={paint} seed={seed} blur />
        <CanyonWall y={n(VIEW_H * 0.5)} depth={430} fill={paint('canyonMid')} opacity={0.68} />
      </g>
      <circle cx={n(VIEW_W * 0.18)} cy={n(VIEW_H * 0.32)} r={120} fill="#ffd18a" opacity={0.24} />
      <Rim topY={n(VIEW_H * 0.69)} />
      <SafetyRailing y={n(VIEW_H * 0.61)} x={n(VIEW_W * 0.5)} width={n(VIEW_W * 0.42)} scale={0.86} />
      <Person x={n(VIEW_W * 0.38)} y={n(VIEW_H * 0.56)} scale={1.28} kind="mom" pose="kneel" mouth="soft" />
      <Person x={n(VIEW_W * 0.58)} y={n(VIEW_H * 0.61)} scale={1.08} kind="theo" pose="handChest" mouth="soft" />
      <Person x={n(VIEW_W * 0.78)} y={n(VIEW_H * 0.64)} scale={0.62} kind="juno" pose="stand" mouth="soft" />
      <SoundArcs cx={n(VIEW_W * 0.58)} cy={n(VIEW_H * 0.48)} from={1} to={2} step={28} startAngle={-70} endAngle={-15} stroke="#ffe2a7" opacity={0.22} width={3} />
      <path
        d={`M${n(VIEW_W * 0.5)},${n(VIEW_H * 0.58)} C${n(VIEW_W * 0.55)},${n(
          VIEW_H * 0.52,
        )} ${n(VIEW_W * 0.6)},${n(VIEW_H * 0.52)} ${n(VIEW_W * 0.64)},${n(
          VIEW_H * 0.57,
        )}`}
        stroke="#f4c68b"
        strokeWidth={5}
        opacity={0.32}
        fill="none"
        strokeLinecap="round"
      />
      {finish(paint)}
    </g>
  ),

  'echo-04-brave-call': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skyHero'))}
      <CanyonDepth paint={paint} seed={seed} />
      <CanyonWall y={n(VIEW_H * 0.46)} depth={430} fill={paint('canyonNear')} mirror opacity={0.92} />
      <SoundArcs cx={n(VIEW_W * 0.45)} cy={n(VIEW_H * 0.4)} from={2} to={6} step={58} startAngle={-36} endAngle={38} stroke={ECHO} opacity={0.72} width={7} />
      <SoundArcs cx={n(VIEW_W * 0.97)} cy={n(VIEW_H * 0.38)} from={1} to={5} step={42} startAngle={146} endAngle={222} stroke="#ffd59d" opacity={0.46} width={5} />
      <Rim topY={n(VIEW_H * 0.65)} />
      <SafetyRailing y={n(VIEW_H * 0.61)} x={n(VIEW_W * 0.02)} width={n(VIEW_W * 0.38)} />
      <Person x={n(VIEW_W * 0.42)} y={n(VIEW_H * 0.58)} scale={1.42} kind="theo" pose="open" mouth="open" />
      <Person x={n(VIEW_W * 0.2)} y={n(VIEW_H * 0.61)} scale={0.86} kind="juno" pose="wave" mouth="open" />
      <Person x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.57)} scale={0.96} kind="mom" pose="stand" mouth="smile" />
      <Hawk x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.19)} scale={0.78} dark="#372940" />
      {finish(paint)}
    </g>
  ),

  'echo-05-echo-game': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skyRosy'))}
      <StarField seed={seed} count={12} y={0} height={n(VIEW_H * 0.34)} color="#f6e8ff" minR={1} maxR={2.2} />
      <CanyonDepth paint={paint} seed={seed} />
      <CanyonWall y={n(VIEW_H * 0.49)} depth={430} fill={paint('canyonMid')} mirror opacity={0.9} />
      <SoundArcs cx={n(VIEW_W * 0.25)} cy={n(VIEW_H * 0.49)} from={1} to={4} step={50} startAngle={-28} endAngle={28} stroke="#ffe0c5" opacity={0.54} width={5} />
      <SoundArcs cx={n(VIEW_W * 0.48)} cy={n(VIEW_H * 0.45)} from={2} to={4} step={44} startAngle={-44} endAngle={18} stroke="#ffd2e4" opacity={0.48} width={5} />
      <SoundArcs cx={n(VIEW_W * 0.72)} cy={n(VIEW_H * 0.46)} from={1} to={5} step={38} startAngle={-160} endAngle={-104} stroke="#cfe4ff" opacity={0.42} width={4.5} />
      <Rim topY={n(VIEW_H * 0.66)} />
      <SafetyRailing y={n(VIEW_H * 0.6)} x={n(VIEW_W * 0.05)} width={n(VIEW_W * 0.83)} scale={0.95} />
      <Person x={n(VIEW_W * 0.24)} y={n(VIEW_H * 0.6)} scale={0.98} kind="juno" pose="cup" mouth="open" />
      <Person x={n(VIEW_W * 0.43)} y={n(VIEW_H * 0.58)} scale={1.08} kind="theo" pose="open" mouth="open" />
      <Person x={n(VIEW_W * 0.64)} y={n(VIEW_H * 0.56)} scale={1.02} kind="mom" pose="cup" mouth="open" />
      <GrassRow seed={seed + 8} baseY={n(VIEW_H * 0.86)} x={0} width={VIEW_W} blades={28} height={30} lean={-3} fill="#594865" />
      {finish(paint)}
    </g>
  ),

  'echo-06-first-stars': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skyIndigo'))}
      <StarField seed={seed} count={40} y={0} height={n(VIEW_H * 0.48)} color="#e7ecff" minR={1.1} maxR={3} />
      <Moon cx={n(VIEW_W * 0.86)} cy={n(VIEW_H * 0.18)} r={34} glow={paint('moonGlow')} face="#f6f0d3" craters={false} />
      <CanyonDepth paint={paint} seed={seed} night />
      <SoundArcs cx={n(VIEW_W * 0.33)} cy={n(VIEW_H * 0.53)} from={2} to={2} step={54} startAngle={-35} endAngle={8} stroke={ECHO_COOL} opacity={0.3} width={3.5} />
      <Rim topY={n(VIEW_H * 0.68)} night />
      <SafetyRailing y={n(VIEW_H * 0.61)} x={n(VIEW_W * 0.12)} width={n(VIEW_W * 0.62)} scale={0.9} dark />
      <Person x={n(VIEW_W * 0.28)} y={n(VIEW_H * 0.62)} scale={0.78} kind="mom" pose="stand" silhouette />
      <Person x={n(VIEW_W * 0.42)} y={n(VIEW_H * 0.65)} scale={0.65} kind="theo" pose="wave" mouth="soft" silhouette />
      <Person x={n(VIEW_W * 0.52)} y={n(VIEW_H * 0.66)} scale={0.58} kind="juno" pose="stand" silhouette />
      <Hawk x={n(VIEW_W * 0.66)} y={n(VIEW_H * 0.24)} scale={0.5} dark="#11182b" />
      {finish(paint)}
    </g>
  ),

  'echo-07-tent-stars': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('skyNight'))}
      <StarField seed={seed} count={78} y={0} height={n(VIEW_H * 0.6)} color="#edf3ff" minR={1} maxR={3.4} />
      <Moon cx={n(VIEW_W * 0.82)} cy={n(VIEW_H * 0.16)} r={42} glow={paint('moonGlow')} face="#f4f0d2" />
      <CanyonWall y={n(VIEW_H * 0.32)} depth={420} fill="#1d2948" opacity={0.82} />
      <CanyonWall y={n(VIEW_H * 0.44)} depth={420} fill="#15213c" mirror opacity={0.92} />
      <Water x={n(VIEW_W * 0.5)} y={n(VIEW_H * 0.61)} width={n(VIEW_W * 0.24)} height={14} rx={7} fill={paint('river')} highlight="#dcefff" />
      <Rim topY={n(VIEW_H * 0.67)} night />
      <Tent paint={paint} />
      <Campfire paint={paint} />
      <SoundArcs cx={n(VIEW_W * 0.36)} cy={n(VIEW_H * 0.5)} from={1} to={2} step={46} startAngle={-66} endAngle={-22} stroke="#f8dba8" opacity={0.18} width={3} />
      <GrassRow seed={seed + 11} baseY={n(VIEW_H * 0.87)} x={0} width={VIEW_W} blades={36} height={38} lean={2} fill="#17243a" />
      {finish(paint)}
    </g>
  ),
};

export const echoWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
