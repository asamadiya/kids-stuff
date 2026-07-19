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
  Star,
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

/*
 * WORLD: Pip's Pattern Parade — a golden-hour porch and one quiet moonlit room.
 * Motifs: glass button jar, red/blue and big/small button patterns, flowerpot,
 * Grandpa's rocker, porch lamp with a moth, firefly, quilt, and windowsill.
 */

const SKIN_PIP = '#d99667';
const SKIN_ADA = '#8f5a43';
const SKIN_GRANDPA = '#c98f68';
const HAIR_PIP = '#6b3d24';
const HAIR_ADA = '#2e1d18';
const HAIR_GRANDPA = '#e5ded2';
const SHIRT_PIP = '#6fa7c9';
const SHIRT_ADA = '#d77a70';
const SHIRT_GRANDPA = '#7e8d8c';
const PANTS = '#5b6474';
const WOOD = '#a96f3f';
const WOOD_DARK = '#6e4529';
const WOOD_LIGHT = '#d2945a';
const RED_BUTTON = '#cf3f37';
const BLUE_BUTTON = '#2f70b9';
const GOLD_BUTTON = '#dfa43d';
const GREEN_BUTTON = '#4c9a6c';
const THREAD = '#f7dfbc';
const SHADOW = '#3b2b25';

function Defs({ id }: SceneWorldProps): ReactNode {
  return (
    <defs>
      <LinearGradient
        id={id('porchGold')}
        stops={[
          { offset: 0, color: '#f6bf72' },
          { offset: 0.48, color: '#d98b4e' },
          { offset: 1, color: '#8d5a38' },
        ]}
      />
      <LinearGradient
        id={id('duskPorch')}
        stops={[
          { offset: 0, color: '#d9935c' },
          { offset: 0.55, color: '#986344' },
          { offset: 1, color: '#526174' },
        ]}
      />
      <LinearGradient
        id={id('sunsetSky')}
        stops={[
          { offset: 0, color: '#f5b967' },
          { offset: 0.58, color: '#d77a55' },
          { offset: 1, color: '#474267' },
        ]}
      />
      <LinearGradient
        id={id('nightRoom')}
        stops={[
          { offset: 0, color: '#101b38' },
          { offset: 0.62, color: '#1f2d55' },
          { offset: 1, color: '#32416d' },
        ]}
      />
      <LinearGradient
        id={id('glassJar')}
        stops={[
          { offset: 0, color: '#ffffff', opacity: 0.62 },
          { offset: 0.5, color: '#c7ecff', opacity: 0.26 },
          { offset: 1, color: '#7ab5cf', opacity: 0.42 },
        ]}
        x1={0}
        y1={0}
        x2={1}
        y2={1}
      />
      <RadialGradient
        id={id('lampGlow')}
        stops={[
          { offset: 0, color: '#fff0a8', opacity: 0.9 },
          { offset: 0.55, color: '#f7bd64', opacity: 0.36 },
          { offset: 1, color: '#f7bd64', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('fireflyGlow')}
        stops={[
          { offset: 0, color: '#f8ff9a', opacity: 0.95 },
          { offset: 1, color: '#f8ff9a', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('moonGlow')}
        stops={[
          { offset: 0, color: '#edf2ff', opacity: 0.82 },
          { offset: 1, color: '#edf2ff', opacity: 0 },
        ]}
      />
      <RadialGradient
        id={id('vignette')}
        stops={[
          { offset: 0.56, color: '#000000', opacity: 0 },
          { offset: 1, color: '#160f18', opacity: 0.38 },
        ]}
      />
      <GrainFilter id={id('grain')} opacity={0.045} />
    </defs>
  );
}

const finish = (paint: SceneWorldProps['paint']) => (
  <>
    <GrainWash filter={paint('grain')} />
    <Vignette paint={paint('vignette')} />
  </>
);

const sky = (fill: string) => <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={fill} />;

function PorchBoards({ fill = WOOD, shadow = WOOD_DARK, glow = WOOD_LIGHT }: { fill?: string; shadow?: string; glow?: string }) {
  return (
    <g className="scene-porch-boards">
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={fill} />
      {range(9).map((i) => (
        <g key={i}>
          <rect x={0} y={n(i * 96 + 40)} width={VIEW_W} height={7} fill={shadow} opacity={0.56} />
          <rect x={0} y={n(i * 96 + 48)} width={VIEW_W} height={2} fill="#f1b16d" opacity={0.38} />
        </g>
      ))}
      {range(20).map((i) => (
        <path
          key={i}
          d={`M${n(i * 72 - 20)},${n(80 + (i % 5) * 34)} q${n(24 + (i % 3) * 7)},${n(-9 + (i % 2) * 18)} ${n(78 + (i % 4) * 8)},0`}
          stroke={glow}
          strokeWidth={2}
          fill="none"
          opacity={0.26}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function Button({ x, y, r, fill, angle = 0 }: { x: number; y: number; r: number; fill: string; angle?: number }) {
  const hole = n(r * 0.14);
  const offset = n(r * 0.32);
  return (
    <g className="scene-button" data-motif="button" data-x={n(x)} data-y={n(y)} data-r={n(r)} data-fill={fill} transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)})`}>
      <circle cx={0} cy={n(r * 0.14)} r={n(r * 1.05)} fill={SHADOW} opacity={0.2} />
      <circle cx={0} cy={0} r={n(r)} fill={fill} />
      <circle cx={0} cy={0} r={n(r * 0.68)} fill="none" stroke="#ffffff" strokeWidth={n(r * 0.1)} opacity={0.34} />
      <circle cx={n(-offset)} cy={n(-offset)} r={hole} fill={THREAD} opacity={0.88} />
      <circle cx={offset} cy={n(-offset)} r={hole} fill={THREAD} opacity={0.88} />
      <circle cx={n(-offset)} cy={offset} r={hole} fill={THREAD} opacity={0.88} />
      <circle cx={offset} cy={offset} r={hole} fill={THREAD} opacity={0.88} />
    </g>
  );
}

function ButtonLine({ points, colors, sizes }: { points: readonly [number, number][]; colors: readonly string[]; sizes: readonly number[] }) {
  return (
    <g className="scene-button-line">
      {points.map(([x, y], i) => (
        <Button key={`${x}-${y}-${i}`} x={x} y={y} r={sizes[i % sizes.length]} fill={colors[i % colors.length]} angle={n(i * 17)} />
      ))}
    </g>
  );
}

function SpillButtons({ x, y }: { x: number; y: number }) {
  const colors = [RED_BUTTON, BLUE_BUTTON, GOLD_BUTTON, GREEN_BUTTON, '#9b65b7'];
  return (
    <g className="scene-button-spill" transform={`translate(${n(x)} ${n(y)})`}>
      {range(30).map((i) => {
        const angle = n(i * 137.5);
        const radius = n(20 + (i % 6) * 28 + Math.floor(i / 6) * 8);
        const px = n(Math.cos((angle * Math.PI) / 180) * radius * 1.35);
        const py = n(Math.sin((angle * Math.PI) / 180) * radius * 0.72);
        return <Button key={i} x={px} y={py} r={n(9 + (i % 4) * 3)} fill={colors[i % colors.length]} angle={angle} />;
      })}
    </g>
  );
}

function ButtonJar({ x, y, scale = 1, tipped = false, full = false, paint }: { x: number; y: number; scale?: number; tipped?: boolean; full?: boolean; paint: string }) {
  const rotation = tipped ? -68 : 0;
  return (
    <g className="scene-button-jar" transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)}) rotate(${n(rotation)})`}>
      <ellipse cx={0} cy={72} rx={58} ry={13} fill={SHADOW} opacity={0.22} />
      <path d="M-44,-70 C-56,-38 -60,38 -44,86 C-20,102 20,102 44,86 C60,38 56,-38 44,-70 Z" fill={paint} stroke="#ecfbff" strokeWidth={5} />
      <rect x={-36} y={-96} width={72} height={30} rx={10} fill="#b98b61" />
      <rect x={-28} y={-104} width={56} height={11} rx={5} fill="#d2a87a" />
      <path d="M-24,-52 C-34,-10 -30,48 -18,76" stroke="#ffffff" strokeWidth={7} opacity={0.46} fill="none" strokeLinecap="round" />
      {(full ? range(18) : range(8)).map((i) => {
        const px = n(-28 + (i % 6) * 12);
        const py = n(36 - Math.floor(i / 6) * 18 + (i % 2) * 4);
        const color = [RED_BUTTON, BLUE_BUTTON, GOLD_BUTTON, GREEN_BUTTON][i % 4];
        return <Button key={i} x={px} y={py} r={n(6 + (i % 3) * 1.5)} fill={color} angle={n(i * 19)} />;
      })}
    </g>
  );
}

function Hand({ x, y, angle = 0, skin = SKIN_PIP, sleeve = SHIRT_PIP, flip = false }: { x: number; y: number; angle?: number; skin?: string; sleeve?: string; flip?: boolean }) {
  const sx = flip ? -1 : 1;
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${sx} 1)`} className="scene-hand">
      <Capsule x1={-78} y1={8} x2={-16} y2={0} width={24} fill={sleeve} />
      <ellipse cx={0} cy={0} rx={23} ry={16} fill={skin} />
      {range(4).map((i) => (
        <Capsule key={i} x1={n(-10 + i * 7)} y1={n(-12)} x2={n(-6 + i * 7)} y2={n(-25)} width={5} fill={skin} />
      ))}
    </g>
  );
}

function ChildHead({ cx, cy, r = 30, skin, hair, mood = 'smile', tilt = 0, asleep = false }: { cx: number; cy: number; r?: number; skin: string; hair: string; mood?: 'smile' | 'open' | 'soft'; tilt?: number; asleep?: boolean }) {
  return (
    <g transform={`rotate(${n(tilt)} ${n(cx)} ${n(cy)})`} className="scene-child-head">
      <circle cx={n(cx)} cy={n(cy)} r={r} fill={skin} />
      <path
        d={`M${n(cx - r)},${n(cy - r * 0.2)} Q${n(cx - r * 0.4)},${n(cy - r * 1.24)} ${n(cx + r * 0.32)},${n(cy - r * 0.95)} Q${n(cx + r * 0.88)},${n(cy - r * 0.7)} ${n(cx + r)},${n(cy - r * 0.05)} Q${n(cx + r * 0.2)},${n(cy - r * 0.42)} ${n(cx - r)},${n(cy - r * 0.2)} Z`}
        fill={hair}
      />
      {asleep ? (
        <>
          <ClosedEye cx={n(cx - r * 0.32)} cy={n(cy + r * 0.05)} w={n(r * 0.42)} />
          <ClosedEye cx={n(cx + r * 0.32)} cy={n(cy + r * 0.05)} w={n(r * 0.42)} />
        </>
      ) : (
        <>
          <Eye cx={n(cx - r * 0.3)} cy={n(cy)} r={n(r * 0.13)} />
          <Eye cx={n(cx + r * 0.3)} cy={n(cy)} r={n(r * 0.13)} />
        </>
      )}
      <Blush cx={n(cx - r * 0.5)} cy={n(cy + r * 0.35)} r={n(r * 0.17)} />
      <Blush cx={n(cx + r * 0.5)} cy={n(cy + r * 0.35)} r={n(r * 0.17)} />
      {mood === 'open' ? <OpenMouth cx={n(cx)} cy={n(cy + r * 0.42)} rx={n(r * 0.18)} ry={n(r * 0.25)} /> : <Smile cx={n(cx)} cy={n(cy + r * 0.38)} w={n(r * 0.55)} curve={mood === 'soft' ? n(r * 0.16) : n(r * 0.32)} />}
    </g>
  );
}

function KneelingChild({ x, y, skin, hair, shirt, flip = false, reaching = false }: { x: number; y: number; skin: string; hair: string; shirt: string; flip?: boolean; reaching?: boolean }) {
  const sx = flip ? -1 : 1;
  return (
    <g className="scene-kneeling-child" transform={`translate(${n(x)} ${n(y)}) scale(${sx} 1)`}>
      <ellipse cx={0} cy={72} rx={58} ry={32} fill={SHADOW} opacity={0.18} />
      <Capsule x1={0} y1={0} x2={0} y2={72} width={52} fill={shirt} />
      <Capsule x1={-15} y1={60} x2={-70} y2={86} width={24} fill={PANTS} />
      <Capsule x1={16} y1={62} x2={62} y2={96} width={24} fill={PANTS} />
      <Capsule x1={-16} y1={20} x2={reaching ? -94 : -56} y2={reaching ? 84 : 56} width={17} fill={shirt} />
      <Capsule x1={18} y1={20} x2={reaching ? 86 : 54} y2={reaching ? 78 : 50} width={17} fill={shirt} />
      <ellipse cx={reaching ? -100 : -61} cy={reaching ? 88 : 60} rx={15} ry={10} fill={skin} />
      <ellipse cx={reaching ? 92 : 59} cy={reaching ? 82 : 54} rx={15} ry={10} fill={skin} />
      <ChildHead cx={0} cy={-42} r={34} skin={skin} hair={hair} tilt={flip ? 9 : -9} mood="soft" />
    </g>
  );
}

function BowingChild({ x, y, skin, hair, shirt, flip = false }: { x: number; y: number; skin: string; hair: string; shirt: string; flip?: boolean }) {
  const sx = flip ? -1 : 1;
  return (
    <g className="scene-bowing-child" transform={`translate(${n(x)} ${n(y)}) scale(${sx} 1) rotate(-8)`}>
      <Capsule x1={0} y1={0} x2={36} y2={76} width={48} fill={shirt} />
      <Capsule x1={2} y1={28} x2={-56} y2={65} width={15} fill={shirt} />
      <Capsule x1={22} y1={34} x2={85} y2={54} width={15} fill={shirt} />
      <ellipse cx={-62} cy={68} rx={12} ry={9} fill={skin} />
      <ellipse cx={91} cy={56} rx={12} ry={9} fill={skin} />
      <Capsule x1={24} y1={74} x2={4} y2={126} width={17} fill={PANTS} />
      <Capsule x1={42} y1={74} x2={68} y2={120} width={17} fill={PANTS} />
      <ChildHead cx={52} cy={-18} r={27} skin={skin} hair={hair} mood="smile" tilt={16} />
    </g>
  );
}

function RockingChair({ x, y, scale = 1, grandpa = true, paper = false }: { x: number; y: number; scale?: number; grandpa?: boolean; paper?: boolean }) {
  return (
    <g className="scene-rocking-chair" transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
      <path d="M-78,132 Q0,172 88,132" stroke="#5d3b27" strokeWidth={13} fill="none" strokeLinecap="round" />
      <rect x={-54} y={-48} width={88} height={134} rx={14} fill="#7c5133" />
      <rect x={-42} y={-34} width={64} height={104} rx={9} fill="#9a6840" />
      <Capsule x1={-58} y1={32} x2={-92} y2={102} width={13} fill="#5d3b27" />
      <Capsule x1={38} y1={30} x2={72} y2={104} width={13} fill="#5d3b27" />
      <Capsule x1={-62} y1={92} x2={54} y2={96} width={20} fill="#6a432c" />
      {grandpa ? (
        <g>
          <Capsule x1={-4} y1={4} x2={0} y2={80} width={48} fill={SHIRT_GRANDPA} />
          <circle cx={-4} cy={-42} r={31} fill={SKIN_GRANDPA} />
          <path d="M-35,-50 Q-4,-82 27,-50 Q16,-70 -4,-68 Q-22,-70 -35,-50 Z" fill={HAIR_GRANDPA} />
          <ClosedEye cx={-15} cy={-42} w={12} />
          <ClosedEye cx={6} cy={-42} w={12} />
          <Smile cx={-4} cy={-28} w={20} curve={8} />
          {paper ? (
            <g transform="translate(6 10) rotate(-4)">
              <rect x={-54} y={-24} width={104} height={70} rx={4} fill="#f3e7cf" />
              {range(5).map((i) => (
                <rect key={i} x={n(-42 + (i % 2) * 44)} y={n(-12 + Math.floor(i / 2) * 18)} width={34} height={5} rx={2} fill="#b6a98f" opacity={0.68} />
              ))}
            </g>
          ) : null}
        </g>
      ) : null}
    </g>
  );
}

function FlowerPot({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g className="scene-flowerpot" transform={`translate(${n(x)} ${n(y)}) scale(${n(scale)})`}>
      <ellipse cx={0} cy={68} rx={58} ry={13} fill={SHADOW} opacity={0.24} />
      <path d="M-50,-20 H50 L34,76 H-34 Z" fill="#b95e3e" />
      <rect x={-58} y={-36} width={116} height={28} rx={8} fill="#d0784d" />
      <path d="M-30,-38 C-40,-76 -8,-78 -4,-40" stroke="#3f7747" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M12,-38 C8,-88 54,-74 42,-40" stroke="#4b8a50" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={-22} cy={-68} rx={22} ry={12} fill="#588f53" transform="rotate(-22 -22 -68)" />
      <ellipse cx={42} cy={-66} rx={24} ry={13} fill="#68a35f" transform="rotate(24 42 -66)" />
    </g>
  );
}

function PorchLamp({ x, y, paint }: { x: number; y: number; paint: string }) {
  return (
    <g className="scene-porch-lamp" transform={`translate(${n(x)} ${n(y)})`}>
      <circle cx={0} cy={0} r={114} fill={paint} />
      <rect x={-28} y={-68} width={56} height={74} rx={18} fill="#62432f" />
      <path d="M-20,-48 H20 L30,8 H-30 Z" fill="#ffd581" opacity={0.86} />
      <ellipse cx={70} cy={-18} rx={14} ry={7} fill="#d8b77e" transform="rotate(28 70 -18)" />
      <path d="M58,-22 q12,-14 28,-4" stroke="#7a5837" strokeWidth={2} fill="none" />
    </g>
  );
}

function Firefly({ x, y, paint }: { x: number; y: number; paint: string }) {
  return (
    <g className="scene-firefly" transform={`translate(${n(x)} ${n(y)})`}>
      <g className="scene-firefly-drift">
        <circle cx={0} cy={0} r={34} fill={paint} />
        <ellipse cx={0} cy={0} rx={8} ry={5} fill="#2d2b25" />
        <circle cx={7} cy={0} r={6} fill="#f8ff8a" />
        <ellipse cx={-5} cy={-7} rx={8} ry={4} fill="#e6f5ff" opacity={0.55} transform="rotate(-28 -5 -7)" />
        <ellipse cx={-5} cy={7} rx={8} ry={4} fill="#e6f5ff" opacity={0.55} transform="rotate(28 -5 7)" />
      </g>
    </g>
  );
}

const redBluePoints = range(12).map((i): [number, number] => [n(160 + i * 78), n(520 - i * 24)]);
const curvePoints = range(18).map((i): [number, number] => {
  const t = i / 17;
  return [n(118 + t * 920), n(548 - Math.sin(t * Math.PI * 1.42) * 142 + Math.sin(t * Math.PI * 3) * 35)];
});
const paradePoints = range(34).map((i): [number, number] => {
  const t = i / 33;
  return [n(110 + t * 970), n(660 - Math.sin(t * Math.PI * 2.3) * 172 - t * 210)];
});

const PAGES: Record<string, (p: SceneWorldProps) => ReactNode> = {
  'pattern-01-porch-buttons': ({ paint }) => (
    <g data-scene-art>
      <PorchBoards fill={paint('porchGold')} />
      <rect x={0} y={0} width={VIEW_W} height={n(VIEW_H * 0.3)} fill="#f5b66c" opacity={0.18} />
      <PorchLamp x={1030} y={112} paint={paint('lampGlow')} />
      <RockingChair x={930} y={274} scale={0.72} />
      <ButtonJar x={560} y={306} scale={0.88} tipped paint={paint('glassJar')} />
      <SpillButtons x={548} y={424} />
      <KneelingChild x={332} y={496} skin={SKIN_PIP} hair={HAIR_PIP} shirt={SHIRT_PIP} reaching />
      <KneelingChild x={768} y={514} skin={SKIN_ADA} hair={HAIR_ADA} shirt={SHIRT_ADA} flip reaching />
      <Hand x={470} y={430} angle={-22} skin={SKIN_PIP} sleeve={SHIRT_PIP} />
      <Hand x={654} y={450} angle={205} skin={SKIN_ADA} sleeve={SHIRT_ADA} />
      {finish(paint)}
    </g>
  ),

  'pattern-02-red-blue-line': ({ paint }) => (
    <g data-scene-art>
      <PorchBoards fill={paint('porchGold')} />
      <rect x={0} y={0} width={VIEW_W} height={250} fill="#ffe2a6" opacity={0.18} />
      <path d={`M0,${n(286)} L${VIEW_W},${n(168)} L${VIEW_W},${n(258)} L0,${n(390)} Z`} fill="#78482c" opacity={0.22} />
      {redBluePoints.map(([x, y], i) => (
        <Button key={i} x={x} y={y} r={n(28 - i * 1.15)} fill={i % 2 === 0 ? RED_BUTTON : BLUE_BUTTON} angle={n(i * 12)} />
      ))}
      <Hand x={1022} y={248} angle={170} skin={SKIN_ADA} sleeve={SHIRT_ADA} flip />
      <Hand x={930} y={292} angle={150} skin={SKIN_PIP} sleeve={SHIRT_PIP} flip />
      <Button x={1074} y={220} r={14} fill={BLUE_BUTTON} angle={18} />
      <ellipse cx={330} cy={640} rx={260} ry={54} fill={SHADOW} opacity={0.12} />
      <path d={`M${n(0)},${n(594)} C${n(260)},${n(534)} ${n(520)},${n(614)} ${n(760)},${n(552)}`} stroke="#f3b56b" strokeWidth={5} fill="none" opacity={0.34} />
      {finish(paint)}
    </g>
  ),

  'pattern-03-big-small-curve': ({ paint }) => (
    <g data-scene-art>
      <PorchBoards fill="#b97845" glow="#efaa66" />
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#e49457" opacity={0.22} />
      <FlowerPot x={940} y={356} scale={1.06} />
      <RockingChair x={340} y={340} scale={0.54} grandpa={false} />
      <Capsule x1={280} y1={282} x2={248} y2={520} width={26} fill="#5d3b27" />
      <ButtonLine points={curvePoints} colors={[GOLD_BUTTON, RED_BUTTON, BLUE_BUTTON]} sizes={[25, 12, 12]} />
      <KneelingChild x={248} y={620} skin={SKIN_PIP} hair={HAIR_PIP} shirt={SHIRT_PIP} reaching />
      <KneelingChild x={852} y={628} skin={SKIN_ADA} hair={HAIR_ADA} shirt={SHIRT_ADA} flip reaching />
      <Hand x={555} y={510} angle={-8} skin={SKIN_PIP} sleeve={SHIRT_PIP} />
      <Hand x={704} y={476} angle={196} skin={SKIN_ADA} sleeve={SHIRT_ADA} />
      {finish(paint)}
    </g>
  ),

  'pattern-04-breeze-bump': ({ paint, seed }) => (
    <g data-scene-art>
      <PorchBoards fill={paint('duskPorch')} shadow="#334258" glow="#d48b55" />
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#293a55" opacity={0.2} />
      <path d={`M${n(0)},${n(224)} C${n(280)},${n(300)} ${n(500)},${n(228)} ${n(760)},${n(302)} S${n(1040)},${n(360)} ${VIEW_W},${n(302)}`} stroke="#7389a6" strokeWidth={38} fill="none" opacity={0.13} strokeLinecap="round" />
      <Button x={250} y={452} r={24} fill={GOLD_BUTTON} angle={4} />
      <Button x={348} y={452} r={12} fill={BLUE_BUTTON} angle={21} />
      <Button x={430} y={452} r={12} fill={RED_BUTTON} angle={38} />
      <Button x={534} y={452} r={26} fill={GOLD_BUTTON} angle={55} />
      <Button x={628} y={452} r={26} fill={GOLD_BUTTON} angle={72} />
      <Button x={726} y={452} r={12} fill={BLUE_BUTTON} angle={89} />
      <Button x={806} y={452} r={12} fill={RED_BUTTON} angle={106} />
      <Button x={914} y={512} r={12} fill={BLUE_BUTTON} angle={118} />
      <path d={`M${n(910)},${n(500)} q${n(42)},${n(-24)} ${n(88)},${n(-2)}`} stroke="#d4dbe8" strokeWidth={3} fill="none" opacity={0.45} strokeLinecap="round" />
      <StarField seed={seed} count={14} y={20} height={180} color="#d7e2ee" minR={1} maxR={2.5} />
      <g transform={`translate(${n(214)} ${n(260)}) rotate(10)`}>
        <ChildHead cx={0} cy={0} r={46} skin={SKIN_PIP} hair={HAIR_PIP} mood="open" tilt={-5} />
        <Capsule x1={-10} y1={48} x2={-48} y2={150} width={36} fill={SHIRT_PIP} />
      </g>
      <g transform={`translate(${n(978)} ${n(274)}) rotate(-12)`}>
        <ChildHead cx={0} cy={0} r={46} skin={SKIN_ADA} hair={HAIR_ADA} mood="soft" tilt={7} />
        <Capsule x1={8} y1={48} x2={54} y2={148} width={36} fill={SHIRT_ADA} />
      </g>
      {finish(paint)}
    </g>
  ),

  'pattern-05-fix-together': ({ paint }) => (
    <g data-scene-art>
      <PorchBoards fill={paint('porchGold')} shadow="#7b4d2e" />
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#f0b46a" opacity={0.18} />
      <path d={`M${n(80)},${n(504)} C${n(270)},${n(450)} ${n(428)},${n(492)} ${n(548)},${n(454)} S${n(780)},${n(416)} ${n(1090)},${n(486)}`} stroke="#4b332b" strokeWidth={16} fill="none" opacity={0.1} strokeLinecap="round" />
      <Button x={176} y={506} r={24} fill={GOLD_BUTTON} angle={7} />
      <Button x={276} y={486} r={12} fill={BLUE_BUTTON} angle={24} />
      <Button x={360} y={472} r={12} fill={RED_BUTTON} angle={41} />
      <Button x={466} y={462} r={25} fill={GOLD_BUTTON} angle={58} />
      <Button x={594} y={444} r={12} fill={BLUE_BUTTON} angle={75} />
      <Button x={678} y={438} r={12} fill={RED_BUTTON} angle={92} />
      <Button x={780} y={444} r={25} fill={GOLD_BUTTON} angle={109} />
      <Button x={878} y={462} r={12} fill={BLUE_BUTTON} angle={126} />
      <Button x={966} y={486} r={12} fill={RED_BUTTON} angle={143} />
      <Hand x={522} y={374} angle={34} skin={SKIN_PIP} sleeve={SHIRT_PIP} />
      <Hand x={678} y={342} angle={152} skin={SKIN_ADA} sleeve={SHIRT_ADA} flip />
      <Button x={604} y={430} r={12} fill={BLUE_BUTTON} angle={28} />
      <ellipse cx={604} cy={454} rx={70} ry={18} fill="#fff1ba" opacity={0.18} />
      <ChildHead cx={190} cy={232} r={43} skin={SKIN_PIP} hair={HAIR_PIP} mood="soft" tilt={14} />
      <ChildHead cx={1016} cy={228} r={43} skin={SKIN_ADA} hair={HAIR_ADA} mood="smile" tilt={-14} />
      {finish(paint)}
    </g>
  ),

  'pattern-06-finished-parade': ({ paint }) => (
    <g data-scene-art>
      {sky(paint('sunsetSky'))}
      <rect x={0} y={n(VIEW_H * 0.26)} width={VIEW_W} height={n(VIEW_H * 0.74)} fill={paint('porchGold')} />
      {range(7).map((i) => (
        <rect key={i} x={0} y={n(250 + i * 78)} width={VIEW_W} height={6} fill={WOOD_DARK} opacity={0.45} />
      ))}
      <rect x={n(VIEW_W * 0.68)} y={n(VIEW_H * 0.1)} width={260} height={250} rx={10} fill="#6a3f2d" />
      <rect x={n(VIEW_W * 0.705)} y={n(VIEW_H * 0.14)} width={176} height={198} rx={8} fill="#a16643" />
      <PorchLamp x={160} y={168} paint={paint('lampGlow')} />
      <RockingChair x={910} y={426} scale={0.72} paper />
      <ButtonLine points={paradePoints} colors={[RED_BUTTON, BLUE_BUTTON, GOLD_BUTTON, GREEN_BUTTON, '#8d63b8']} sizes={[13, 13, 25, 12, 12]} />
      <BowingChild x={336} y={588} skin={SKIN_PIP} hair={HAIR_PIP} shirt={SHIRT_PIP} />
      <BowingChild x={560} y={600} skin={SKIN_ADA} hair={HAIR_ADA} shirt={SHIRT_ADA} flip />
      <Firefly x={676} y={176} paint={paint('fireflyGlow')} />
      <Star cx={710} cy={214} r={12} fill="#f8ff9a" />
      {finish(paint)}
    </g>
  ),

  'pattern-07-jar-moonlight': ({ paint, seed }) => (
    <g data-scene-art>
      {sky(paint('nightRoom'))}
      <StarField seed={seed} count={34} x={610} y={40} width={420} height={280} color="#dce8ff" minR={1} maxR={2.6} />
      <rect x={n(610)} y={n(72)} width={420} height={300} rx={18} fill="#0c1833" />
      <rect x={n(642)} y={n(98)} width={356} height={236} rx={10} fill="#18284e" />
      <Moon cx={880} cy={150} r={42} glow={paint('moonGlow')} face="#f1f3df" />
      <rect x={n(812)} y={n(90)} width={16} height={258} fill="#3c4a74" />
      <rect x={n(642)} y={n(214)} width={356} height={14} fill="#3c4a74" />
      <rect x={n(570)} y={n(360)} width={512} height={48} rx={12} fill="#526085" />
      <ButtonJar x={786} y={302} scale={0.74} full paint={paint('glassJar')} />
      <path d={`M${n(650)},${n(332)} L${n(938)},${n(240)} L${n(960)},${n(286)} L${n(664)},${n(382)} Z`} fill="#eaf0ff" opacity={0.14} />
      <rect x={0} y={n(620)} width={VIEW_W} height={180} fill="#1a2546" />
      <rect x={n(74)} y={n(526)} width={430} height={150} rx={26} fill="#475586" />
      <ellipse cx={180} cy={534} rx={74} ry={36} fill="#e8e6f2" />
      <ChildHead cx={204} cy={500} r={38} skin={SKIN_PIP} hair={HAIR_PIP} mood="soft" tilt={-12} asleep />
      <path
        d={`M${n(66)},${n(664)} C${n(178)},${n(574)} ${n(362)},${n(570)} ${n(548)},${n(654)} L${n(548)},${n(800)} L${n(66)},${n(800)} Z`}
        fill="#6f77b0"
      />
      {range(6).map((i) => (
        <path key={i} d={`M${n(98 + i * 78)},${n(646)} l${n(82)},${n(94)}`} stroke={i % 2 === 0 ? '#93a0d0' : '#525d98'} strokeWidth={8} opacity={0.58} />
      ))}
      {range(5).map((i) => (
        <circle key={i} cx={n(150 + i * 82)} cy={n(690 + (i % 2) * 34)} r={18} fill={i % 2 === 0 ? RED_BUTTON : BLUE_BUTTON} opacity={0.5} />
      ))}
      {finish(paint)}
    </g>
  ),
};

export const patternWorld: SceneWorld = (props) => (
  <>
    {Defs(props)}
    {requireScenePage(PAGES, props)}
  </>
);
