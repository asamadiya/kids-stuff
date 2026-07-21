import type { ReactNode } from 'react';
import { n } from '../shared';
import { foreshortenGeometry, resolvePoseGeometry } from './poseGeometry';
import type { RenderJoints } from './poseGeometry';
import type {
  CharacterAppearance,
  CinematicCharacterProps,
  Expression,
  HairProfile,
  HandPose,
  OverlapPart,
  Placement,
  Point,
  PoseGeometry,
} from './types';

/** Tapered, rounded-cap quad between two joints (volume-aware limb). */
const limbPath = (a: Point, b: Point, w1: number, w2: number): string => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const p1: Point = { x: n(a.x + (nx * w1) / 2), y: n(a.y + (ny * w1) / 2) };
  const p2: Point = { x: n(b.x + (nx * w2) / 2), y: n(b.y + (ny * w2) / 2) };
  const p3: Point = { x: n(b.x - (nx * w2) / 2), y: n(b.y - (ny * w2) / 2) };
  const p4: Point = { x: n(a.x - (nx * w1) / 2), y: n(a.y - (ny * w1) / 2) };
  return (
    `M${p1.x},${p1.y} L${p2.x},${p2.y} A${n(w2 / 2)},${n(w2 / 2)} 0 0 1 ${p3.x},${p3.y} ` +
    `L${p4.x},${p4.y} A${n(w1 / 2)},${n(w1 / 2)} 0 0 1 ${p1.x},${p1.y} Z`
  );
};

const lerp = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const pt = (p: Point): string => `${n(p.x)},${n(p.y)}`;

const angleDeg = (from: Point, to: Point): number =>
  (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

/** Andrew's monotone-chain convex hull (counter-clockwise, no collinear points). */
const convexHull = (pts: readonly Point[]): Point[] => {
  const ps = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  if (ps.length < 3) return ps;
  const cross = (o: Point, a: Point, b: Point): number =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Point[] = [];
  for (const p of ps) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = ps.length - 1; i >= 0; i -= 1) {
    const p = ps[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
};

/** A smooth closed path (rounded blob) through a convex hull's vertices. */
const smoothHullPath = (hull: readonly Point[]): string => {
  if (hull.length < 3) return '';
  let d = `M${pt(mid(hull[hull.length - 1], hull[0]))} `;
  for (let i = 0; i < hull.length; i += 1) {
    const curr = hull[i];
    const next = hull[(i + 1) % hull.length];
    d += `Q${pt(curr)} ${pt(mid(curr, next))} `;
  }
  return `${d}Z`;
};

/** Right-hand silhouettes; mirrored with a negative x-scale for the left hand. */
const HAND_PATHS: Record<HandPose, string> = {
  open:
    'M-10,-2 C-15,-11 -10,-22 -2,-21 C0,-27 8,-27 8,-20 C13,-22 17,-15 13,-8 ' +
    'C18,-6 18,2 12,4 C15,10 10,14 3,14 L-6,14 C-15,14 -16,5 -10,-2 Z',
  point:
    'M-8,10 C-12,0 -9,-12 -2,-16 L-1,-30 C-0.6,-34 6,-34 6,-30 L5,-15 ' +
    'C11,-13 13,-4 11,5 C14,9 10,14 3,14 L-4,14 C-8,14 -10,13 -8,10 Z',
  cup:
    'M-15,3 C-17,-9 -8,-17 2,-16 C11,-17 17,-9 16,3 C19,7 16,14 7,14 L-7,14 ' +
    'C-15,14 -18,8 -15,3 Z',
  hold:
    'M-10,11 C-17,3 -15,-9 -4,-14 C2,-18 12,-16 15,-8 C19,-6 19,4 12,8 ' +
    'C15,14 6,17 -2,16 C-8,16 -12,15 -10,11 Z',
  rest:
    'M-9,9 C-13,0 -10,-9 -2,-11 C4,-13 11,-9 11,-1 C13,3 10,10 3,11 L-3,11 ' +
    'C-7,11 -10,11 -9,9 Z',
};

const EXPRESSION_MOUTH_CURVE: Record<Expression, number> = {
  curious: 4,
  uncertain: 1,
  delighted: 10,
  calling: 0,
  concerned: -6,
  calm: 5,
  sleeping: 2,
};

const EXPRESSION_BROW_LIFT: Record<Expression, number> = {
  curious: -4,
  uncertain: -1,
  delighted: -3,
  calling: -4,
  concerned: 3,
  calm: 0,
  sleeping: 1,
};

const FACE_RATIO: Record<CharacterAppearance['face']['shape'], readonly [number, number]> = {
  round: [1, 1],
  oval: [0.9, 1.08],
  square: [1.04, 0.96],
  heart: [1.06, 0.98],
};

/* -------------------------------------------------------------------------- */

const hairMass = (g: PoseGeometry, hair: HairProfile, hr: number): ReactNode => {
  const { head } = g;
  const v = 0.7 + hair.volume * 0.9;
  switch (hair.style) {
    case 'bald':
      return null;
    case 'cap':
      return (
        <path
          d={`M${n(head.x - hr)},${n(head.y)} A${n(hr)},${n(hr * 0.9)} 0 0 1 ${n(head.x + hr)},${n(
            head.y,
          )} L${n(head.x + hr * 0.8)},${n(head.y - hr * 0.2)} L${n(head.x - hr * 0.8)},${n(
            head.y - hr * 0.2,
          )} Z`}
          fill={hair.base}
        />
      );
    case 'bun':
      return (
        <>
          <circle cx={n(head.x)} cy={n(head.y - hr * 1.15)} r={n(hr * 0.55)} fill={hair.base} />
          <path
            d={`M${n(head.x - hr)},${n(head.y - hr * 0.1)} A${n(hr * 1.02)},${n(hr * 1.02)} 0 0 1 ${n(
              head.x + hr,
            )},${n(head.y - hr * 0.1)} L${n(head.x + hr * 0.7)},${n(head.y - hr * 0.7)} L${n(
              head.x - hr * 0.7,
            )},${n(head.y - hr * 0.7)} Z`}
            fill={hair.base}
          />
        </>
      );
    case 'wispy':
      return (
        <path
          d={`M${n(head.x - hr * 1.05)},${n(head.y - hr * 0.2)} Q${n(head.x)},${n(
            head.y - hr * v,
          )} ${n(head.x + hr * 1.05)},${n(head.y - hr * 0.2)} Q${n(head.x)},${n(
            head.y - hr * 0.5,
          )} ${n(head.x - hr * 1.05)},${n(head.y - hr * 0.2)} Z`}
          fill={hair.base}
          opacity={0.85}
        />
      );
    case 'long':
      return (
        <path
          d={`M${n(head.x - hr * 1.08)},${n(head.y - hr * 0.1)} Q${n(head.x)},${n(
            head.y - hr * v,
          )} ${n(head.x + hr * 1.08)},${n(head.y - hr * 0.1)} L${n(head.x + hr * 1.02)},${n(
            head.y + hr * 1.8,
          )} L${n(head.x + hr * 0.6)},${n(head.y + hr * 1.9)} L${n(head.x + hr * 0.5)},${n(
            head.y + hr * 0.4,
          )} L${n(head.x - hr * 0.5)},${n(head.y + hr * 0.4)} L${n(head.x - hr * 0.6)},${n(
            head.y + hr * 1.9,
          )} L${n(head.x - hr * 1.02)},${n(head.y + hr * 1.8)} Z`}
          fill={hair.base}
        />
      );
    case 'short':
    default:
      return (
        <path
          d={`M${n(head.x - hr * 1.04)},${n(head.y + hr * 0.2)} Q${n(head.x)},${n(
            head.y - hr * v,
          )} ${n(head.x + hr * 1.04)},${n(head.y + hr * 0.2)} L${n(head.x + hr * 0.9)},${n(
            head.y - hr * 0.1,
          )} Q${n(head.x)},${n(head.y - hr * 0.55)} ${n(head.x - hr * 0.9)},${n(
            head.y - hr * 0.1,
          )} Z`}
          fill={hair.base}
        />
      );
  }
};

/* -------------------------------------------------------------------------- */

/**
 * A layered cutout character rig driven entirely by {@link resolvePoseGeometry}
 * and {@link CharacterAppearance}. Skin, hair, garment, garment-shadow,
 * footwear, accessory, face and rim are separate material layers (never one
 * skin gradient for the whole body, never a CSS filter), and every joint comes
 * from the solved pose so `point`/`reach`/`kneel`/`sleep` read differently from
 * `stand`.
 */
export function CinematicCharacter({
  id,
  x,
  y,
  scale = 1,
  appearance,
  performance,
  className,
}: CinematicCharacterProps) {
  const placement: Placement = { x, y, scale };
  const g = resolvePoseGeometry(appearance, performance, placement);
  const r: RenderJoints = foreshortenGeometry(g);
  const P = appearance.proportions;
  const { skin, hair, wardrobe, footwear, face, secondaryShapes } = appearance;

  const armW = n(P.limbWidth * 0.78 * scale);
  const armWMid = n(P.limbWidth * 0.6 * scale);
  const armWEnd = n(P.limbWidth * 0.44 * scale);
  const legW = n(P.limbWidth * scale);
  const legWMid = n(P.limbWidth * 0.8 * scale);
  const legWEnd = n(P.limbWidth * 0.6 * scale);
  const hr = n(P.headRadius * scale);
  const [rx, ry] = FACE_RATIO[face.shape];

  const legShape = (side: 'left' | 'right') => (
    <>
      <path d={limbPath(g.hip[side], r.knee[side], legW, legWMid)} fill={skin.base} />
      <path d={limbPath(r.knee[side], r.ankle[side], legWMid, legWEnd)} fill={skin.base} />
      {/* Continuous joint covers eliminate the background wedge at each bend. */}
      {jointCover(g.hip[side], legW * 0.58, skin.base, 'hip', side)}
      {jointCover(r.knee[side], legWMid * 0.66, skin.base, 'knee', side)}
      {jointCover(r.ankle[side], legWEnd * 0.66, skin.base, 'ankle', side)}
      <path d={limbPath(r.knee[side], r.ankle[side], legWMid, legWEnd)} fill={skin.shadow} opacity={0.16} />
    </>
  );

  const armShape = (side: 'left' | 'right') => (
    <>
      <path d={limbPath(g.shoulder[side], r.elbow[side], armW, armWMid)} fill={skin.base} />
      <path d={limbPath(r.elbow[side], r.wrist[side], armWMid, armWEnd)} fill={skin.base} />
      {jointCover(g.shoulder[side], armW * 0.6, skin.base, 'shoulder', side)}
      {jointCover(r.elbow[side], armWMid * 0.68, skin.base, 'elbow', side)}
      {jointCover(r.wrist[side], armWEnd * 0.72, skin.base, 'wrist', side)}
      {hand(side, side === 'left' ? performance.leftHand : performance.rightHand)}
    </>
  );

  const jointCover = (
    c: Point,
    radius: number,
    fill: string,
    joint: string,
    side: 'left' | 'right',
  ) => (
    <circle
      data-joint-cover={joint}
      data-side={side}
      cx={n(c.x)}
      cy={n(c.y)}
      r={n(radius)}
      fill={fill}
    />
  );

  const hand = (side: 'left' | 'right', pose: HandPose) => {
    const w = r.wrist[side];
    const e = r.elbow[side];
    const sx = side === 'left' ? -scale : scale;
    // Glyphs point "up" (−y) in hand-local space; +90° aligns that up-axis with
    // the forearm (elbow→wrist) vector so a point reads as an index, not a thumb.
    const rot = n(angleDeg(e, w) + 90);
    return (
      <g
        transform={`translate(${n(w.x)} ${n(w.y)}) rotate(${rot}) scale(${n(sx)} ${n(scale)})`}
        data-anatomy="hand"
        data-hand-side={side}
        data-hand-pose={pose}
      >
        <path d={HAND_PATHS[pose]} fill={skin.base} />
      </g>
    );
  };

  const eyeY = n(g.head.y + hr * 0.02);
  const eyeDx = n(hr * 0.36);
  const headTurn = Math.max(-1, Math.min(1, performance.headTurn ?? 0));
  const faceShift = n(headTurn * hr * 0.18);
  const gaze = { x: n(g.gazeDirection.x * hr * 0.18), y: n(g.gazeDirection.y * hr * 0.18) };
  const mouthCurve = EXPRESSION_MOUTH_CURVE[performance.expression] * scale;
  const browLift = EXPRESSION_BROW_LIFT[performance.expression] * scale;
  const sleeping = performance.expression === 'sleeping';
  const calling = performance.expression === 'calling';

  const buildAccent = (): ReactNode => {
    if (appearance.build === 'child') {
      return (
        <g data-build-accent="child" fill="#f2a6a0" opacity={0.55}>
          <circle cx={n(g.head.x - hr * 0.5)} cy={n(g.head.y + hr * 0.35)} r={n(hr * 0.16)} />
          <circle cx={n(g.head.x + hr * 0.5)} cy={n(g.head.y + hr * 0.35)} r={n(hr * 0.16)} />
        </g>
      );
    }
    if (appearance.build === 'elder') {
      return (
        <g data-build-accent="elder" stroke={skin.shadow} strokeWidth={n(1.2 * scale)} fill="none" opacity={0.5}>
          <path d={`M${n(g.head.x - hr * 0.5)},${n(g.head.y - hr * 0.2)} q${n(hr * 0.5)},${n(-hr * 0.12)} ${n(hr)},0`} />
          <path d={`M${n(g.head.x - hr * 0.4)},${n(g.head.y + hr * 0.62)} q${n(hr * 0.4)},${n(hr * 0.1)} ${n(hr * 0.8)},0`} />
        </g>
      );
    }
    return null;
  };

  const torsoCore: ReactNode = (
    <path
      d={`M${n(g.shoulder.left.x)},${n(g.shoulder.left.y)} L${n(g.hip.left.x)},${n(
        g.hip.left.y,
      )} Q${n(g.torso.bottom.x)},${n(g.torso.bottom.y + 8 * scale)} ${n(g.hip.right.x)},${n(
        g.hip.right.y,
      )} L${n(g.shoulder.right.x)},${n(g.shoulder.right.y)} Q${n(g.torso.top.x)},${n(
        g.torso.top.y - 6 * scale,
      )} ${n(g.shoulder.left.x)},${n(g.shoulder.left.y)} Z`}
      fill={skin.base}
    />
  );

  const pelvisCore: ReactNode = (
    <path
      d={`M${n(g.hip.left.x)},${n(g.hip.left.y)} L${n(g.hip.right.x)},${n(g.hip.right.y)} ` +
        `Q${n(g.torso.bottom.x + P.hipWidth * 0.35 * scale)},${n(
          g.torso.bottom.y + P.hipWidth * 0.7 * scale,
        )} ${n(g.torso.bottom.x)},${n(g.torso.bottom.y + P.hipWidth * 0.8 * scale)} ` +
        `Q${n(g.torso.bottom.x - P.hipWidth * 0.35 * scale)},${n(
          g.torso.bottom.y + P.hipWidth * 0.7 * scale,
        )} ${n(g.hip.left.x)},${n(g.hip.left.y)} Z`}
      fill={skin.base}
    />
  );

  const headCore: ReactNode = (
    <>
      {/* Solid skin neck wedge spanning both shoulders up to the head, so the
          neckline never encloses a background sliver (even when the neck is
          angled by an elder stoop) and the head never detaches. */}
      <path
        d={
          `M${pt(g.shoulder.left)} ` +
          `L${pt(g.head)} L${pt(g.shoulder.right)} ` +
          `L${n(g.shoulder.right.x)},${n(g.torso.top.y + hr * 0.95)} ` +
          `Q${pt({ x: g.torso.top.x, y: g.torso.top.y + hr * 1.15 })} ${n(g.shoulder.left.x)},${n(
            g.torso.top.y + hr * 0.95,
          )} Z`
        }
        fill={skin.base}
      />
      {/* Neck spans the full torso-top→head gap so the head never detaches. */}
      <path
        d={limbPath(g.torso.top, g.head, n(P.limbWidth * 0.72 * scale), n(P.limbWidth * 0.58 * scale))}
        fill={skin.base}
      />
      <path
        d={limbPath(g.neck, g.head, n(P.limbWidth * 0.7 * scale), n(P.limbWidth * 0.6 * scale))}
        fill={skin.shadow}
        opacity={0.18}
      />
      <ellipse
        cx={n(g.head.x)}
        cy={n(g.head.y)}
        rx={n(hr * rx)}
        ry={n(hr * ry)}
        fill={skin.base}
        data-anatomy="cranium"
      />
      <ellipse
        cx={n(g.head.x + hr * 0.4)}
        cy={n(g.head.y - hr * 0.3)}
        rx={n(hr * 0.4)}
        ry={n(hr * 0.3)}
        fill={skin.highlight}
        opacity={0.4}
      />
    </>
  );

  // Back-to-front draw order comes entirely from the resolved overlap; every
  // OverlapPart maps to a real drawn body part so its index governs painting.
  const partNodes: Record<OverlapPart, ReactNode> = {
    leftLeg: legShape('left'),
    rightLeg: legShape('right'),
    pelvis: pelvisCore,
    torso: torsoCore,
    leftArm: armShape('left'),
    rightArm: armShape('right'),
    head: headCore,
  };

  /* ----------------------------- Wardrobe ------------------------------ */
  // Pose-aware garment built from the *resolved* joints so sleeves, hem and
  // drape follow the beat rather than sitting as one rigid panel.
  const kind = wardrobe.garment;
  const longGarment = wardrobe.hemline > 0.55;
  const flareScale = kind === 'robe' || kind === 'cloak' ? 0.95 : kind === 'dress' ? 0.72 : 0.36;
  const flareX = P.hipWidth * scale * flareScale;
  const gHemL = lerp(g.hip.left, r.ankle.left, wardrobe.hemline);
  const gHemR = lerp(g.hip.right, r.ankle.right, wardrobe.hemline);
  const gOL: Point = { x: gHemL.x - flareX, y: gHemL.y };
  const gOR: Point = { x: gHemR.x + flareX, y: gHemR.y };
  const gHemMid: Point = { x: (gOL.x + gOR.x) / 2, y: Math.max(gOL.y, gOR.y) + P.hipWidth * scale * 0.16 };
  const gWaistL: Point = { x: g.hip.left.x - P.hipWidth * scale * 0.1, y: lerp(g.shoulder.left, g.hip.left, 0.55).y };
  const gWaistR: Point = { x: g.hip.right.x + P.hipWidth * scale * 0.1, y: lerp(g.shoulder.right, g.hip.right, 0.55).y };
  const gCollar: Point = { x: g.torso.top.x, y: g.torso.top.y + hr * 0.12 };

  const garmentOutlinePath =
    `M${pt(g.shoulder.left)} ` +
    `C${pt(gWaistL)} ${pt(gOL)} ${pt(gOL)} ` +
    `Q${pt(gHemMid)} ${pt(gOR)} ` +
    `C${pt(gWaistR)} ${pt(g.shoulder.right)} ${pt(g.shoulder.right)} ` +
    `Q${pt(gCollar)} ${pt(g.shoulder.left)} Z`;
  const garmentHemPath = `M${pt(gOL)} Q${pt(gHemMid)} ${pt(gOR)}`;
  const foldCenterPath =
    `M${pt(gCollar)} Q${pt({ x: g.torso.bottom.x - flareX * 0.25, y: (gCollar.y + gHemMid.y) / 2 })} ${pt(gHemMid)}`;
  const foldSidePath = `M${pt(gOL)} Q${pt(gWaistL)} ${pt(g.shoulder.left)}`;

  // Sleep blanket: a smooth convex-hull mass over the whole reclining body so
  // the curled limbs read as one continuous covered form with no gaps.
  const sleepHull = smoothHullPath(
    convexHull([
      g.shoulder.left,
      g.shoulder.right,
      r.elbow.left,
      r.elbow.right,
      r.wrist.left,
      r.wrist.right,
      g.hip.left,
      g.hip.right,
      r.knee.left,
      r.knee.right,
      r.ankle.left,
      r.ankle.right,
      r.foot.left,
      r.foot.right,
    ]),
  );

  const sleeveW1 = n(P.limbWidth * 0.98 * scale);
  const sleeveW2 = n(P.limbWidth * 0.72 * scale);
  const sleeveEnd = (side: 'left' | 'right'): Point =>
    longGarment ? r.elbow[side] : lerp(g.shoulder[side], r.elbow[side], 0.55);

  return (
    <g
      id={id('character')}
      className={className}
      data-pose={performance.pose}
      data-line-of-action={n(performance.lineOfAction)}
      data-shoulder-tilt={n(performance.shoulderTilt)}
      data-pelvis-tilt={n(performance.pelvisTilt)}
      data-head-turn={n(headTurn)}
    >
      {/* Grounding contact shadow (flat fill, not a full-frame wash). */}
      <ellipse
        data-contact-shadow
        cx={n((r.foot.left.x + r.foot.right.x) / 2)}
        cy={n(Math.max(r.foot.left.y, r.foot.right.y) + 6 * scale)}
        rx={n((Math.abs(r.foot.right.x - r.foot.left.x) / 2 + P.hipWidth * scale) * 1.1)}
        ry={n(10 * scale)}
        fill="#120f1c"
        opacity={0.28}
      />

      <g data-layer="skin">
        {g.overlap.map((part) => (
          <g key={part} data-part={part}>
            {partNodes[part]}
          </g>
        ))}
      </g>

      <g data-layer="hair">
        {hairMass(g, hair, hr)}
        {hair.style !== 'bald' ? (
          <path
            d={`M${n(g.head.x - hr * 0.7)},${n(g.head.y - hr * 0.4)} q${n(hr * 0.7)},${n(-hr * 0.2)} ${n(hr * 1.4)},0`}
            stroke={hair.highlight}
            strokeWidth={n(2 * scale)}
            fill="none"
            opacity={0.6}
          />
        ) : null}
      </g>

      <g data-layer="garment">
        {performance.pose === 'sleep' ? (
          <>
            <path data-garment-outline d={sleepHull} fill={wardrobe.base} />
            <g data-layer="garment-shadow">
              <path
                data-garment-fold
                d={sleepHull}
                fill={wardrobe.shadow}
                opacity={0.14}
                transform={`translate(0 ${n(P.limbWidth * 0.18 * scale)})`}
              />
            </g>
            {/* Head and hair ride on top of the blanket so the sleeper's face
                rests on the pillow rather than being covered by the cover. */}
            {headCore}
            {hairMass(g, hair, hr)}
          </>
        ) : (
          <>
            <path data-garment-outline d={garmentOutlinePath} fill={wardrobe.base} />
            <g data-layer="garment-shadow">
              <path
                data-garment-fold
                d={foldCenterPath}
                stroke={wardrobe.shadow}
                strokeWidth={n(P.limbWidth * 0.42 * scale)}
                strokeLinecap="round"
                fill="none"
                opacity={0.32}
              />
              <path
                data-garment-fold
                d={foldSidePath}
                stroke={wardrobe.shadow}
                strokeWidth={n(P.limbWidth * 0.3 * scale)}
                strokeLinecap="round"
                fill="none"
                opacity={0.26}
              />
            </g>
            <path
              data-garment-hem
              d={garmentHemPath}
              stroke={wardrobe.shadow}
              strokeWidth={n(2.6 * scale)}
              strokeLinecap="round"
              fill="none"
              opacity={0.5}
            />
          </>
        )}
        {(['left', 'right'] as const).map((side) => (
          <path
            key={side}
            data-garment-sleeve={side}
            d={limbPath(g.shoulder[side], sleeveEnd(side), sleeveW1, sleeveW2)}
            fill={wardrobe.base}
          />
        ))}
        <path
          d={`M${n(g.torso.top.x - hr * 0.3)},${n(g.torso.top.y)} Q${n(g.torso.top.x)},${n(
            g.torso.top.y + hr * 0.5,
          )} ${n(g.torso.top.x + hr * 0.3)},${n(g.torso.top.y)}`}
          stroke={wardrobe.trim}
          strokeWidth={n(2.4 * scale)}
          fill="none"
        />
      </g>

      <g data-layer="footwear">
        {(['left', 'right'] as const).map((side) => {
          const f = r.foot[side];
          const a = r.ankle[side];
          let dx = f.x - a.x;
          let dy = f.y - a.y;
          let len = Math.hypot(dx, dy);
          if (len < 1) {
            dx = side === 'left' ? -1 : 1;
            dy = 0;
            len = 1;
          }
          const ux = dx / len;
          const uy = dy / len;
          const th = n(P.limbWidth * 0.6 * scale);
          // Heel behind the ankle, toe ahead of the foot point, aligned to the
          // ankle→foot vector so the planted foot carries a clear direction.
          const toe: Point = {
            x: f.x + ux * P.limbWidth * 0.55 * scale,
            y: f.y + uy * P.limbWidth * 0.55 * scale - th * 0.15,
          };
          const heel: Point = {
            x: a.x - ux * P.limbWidth * 0.5 * scale,
            y: a.y - uy * P.limbWidth * 0.5 * scale - th * 0.15,
          };
          const footFill = footwear.style === 'barefoot' ? skin.base : footwear.base;
          return (
            <g key={side} data-anatomy="foot" data-foot-side={side}>
              {footwear.style === 'boot' ? (
                <path
                  d={limbPath(a, { x: a.x, y: a.y - P.shin * 0.45 * scale }, th, n(Number(th) * 0.85))}
                  fill={footwear.base}
                />
              ) : null}
              <path d={limbPath(heel, toe, th, n(Number(th) * 0.82))} fill={footFill} />
            </g>
          );
        })}
      </g>

      <g data-layer="accessory">
        {secondaryShapes.map((shape, i) => {
          switch (shape.kind) {
            case 'belt':
            case 'sash':
              return (
                <g key={i}>
                  <path
                    d={`M${n(g.hip.left.x)},${n(g.hip.left.y - 4 * scale)} L${n(g.hip.right.x)},${n(
                      g.hip.right.y + (shape.kind === 'sash' ? 18 * scale : -4 * scale),
                    )}`}
                    stroke={shape.color}
                    strokeWidth={n((shape.kind === 'sash' ? 10 : 7) * scale)}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={n(g.torso.bottom.x)}
                    cy={n((g.hip.left.y + g.hip.right.y) / 2 + (shape.kind === 'sash' ? 9 : -3) * scale)}
                    r={n((shape.kind === 'sash' ? 5 : 4) * scale)}
                    fill={shape.accent}
                  />
                </g>
              );
            case 'necklace':
              return (
                <g key={i}>
                  <path
                    d={`M${n(g.shoulder.left.x + hr * 0.3)},${n(g.shoulder.left.y)} Q${n(g.torso.top.x)},${n(
                      g.torso.top.y + hr * 0.8,
                    )} ${n(g.shoulder.right.x - hr * 0.3)},${n(g.shoulder.right.y)}`}
                    stroke={shape.color}
                    strokeWidth={n(3 * scale)}
                    fill="none"
                  />
                  <circle
                    cx={n(g.torso.top.x)}
                    cy={n(g.torso.top.y + hr * 0.85)}
                    r={n(hr * 0.13)}
                    fill={shape.accent}
                  />
                </g>
              );
            case 'circlet':
              return (
                <g key={i}>
                  <path
                    d={`M${n(g.head.x - hr * 0.9)},${n(g.head.y - hr * 0.5)} q${n(hr * 0.9)},${n(-hr * 0.3)} ${n(hr * 1.8)},0`}
                    stroke={shape.color}
                    strokeWidth={n(4 * scale)}
                    fill="none"
                  />
                  <circle
                    cx={n(g.head.x)}
                    cy={n(g.head.y - hr * 0.62)}
                    r={n(hr * 0.13)}
                    fill={shape.accent}
                  />
                </g>
              );
            case 'satchel':
              return (
                <g key={i}>
                  <circle
                    cx={n(g.hip.left.x - 8 * scale)}
                    cy={n(g.hip.left.y + 20 * scale)}
                    r={n(P.limbWidth * 0.9 * scale)}
                    fill={shape.color}
                  />
                  <path
                    d={`M${n(g.hip.left.x - 8 * scale - P.limbWidth * 0.9 * scale)},${n(
                      g.hip.left.y + 20 * scale,
                    )} q${n(P.limbWidth * 0.9 * scale)},${n(-P.limbWidth * 0.7 * scale)} ${n(
                      P.limbWidth * 1.8 * scale,
                    )},0`}
                    stroke={shape.accent}
                    strokeWidth={n(2.4 * scale)}
                    fill="none"
                  />
                </g>
              );
            case 'cape':
            default:
              return (
                <g key={i}>
                  <path
                    d={`M${n(g.shoulder.left.x)},${n(g.shoulder.left.y)} L${n(g.hip.left.x - 14 * scale)},${n(
                      g.hip.left.y + P.thigh * 0.6 * scale,
                    )} Q${n(g.torso.bottom.x)},${n(g.torso.bottom.y + P.thigh * 0.8 * scale)} ${n(
                      g.hip.right.x + 14 * scale,
                    )},${n(g.hip.right.y + P.thigh * 0.6 * scale)} L${n(g.shoulder.right.x)},${n(
                      g.shoulder.right.y,
                    )} Z`}
                    fill={shape.color}
                    opacity={0.9}
                  />
                  <path
                    d={`M${n(g.shoulder.left.x)},${n(g.shoulder.left.y)} Q${n(g.torso.top.x)},${n(
                      g.torso.top.y - 4 * scale,
                    )} ${n(g.shoulder.right.x)},${n(g.shoulder.right.y)}`}
                    stroke={shape.accent}
                    strokeWidth={n(2.6 * scale)}
                    fill="none"
                  />
                </g>
              );
          }
        })}
      </g>

      <g data-layer="face">
        {(['left', 'right'] as const).map((side) => {
          const ex = side === 'left'
            ? n(g.head.x - eyeDx + faceShift)
            : n(g.head.x + eyeDx + faceShift);
          return (
            <g key={side}>
              <path
                d={`M${n(ex - hr * 0.26)},${n(eyeY + browLift - hr * 0.22)} Q${ex},${n(
                  eyeY + browLift - hr * 0.34,
                )} ${n(ex + hr * 0.26)},${n(eyeY + browLift - hr * 0.22)}`}
                stroke={face.brow}
                strokeWidth={n(2.2 * scale)}
                strokeLinecap="round"
                fill="none"
                data-anatomy="brow"
              />
              <path
                d={
                  sleeping
                    ? `M${n(ex - hr * 0.22)},${n(eyeY)} Q${ex},${n(eyeY + hr * 0.14)} ${n(ex + hr * 0.22)},${n(eyeY)}`
                    : `M${n(ex - hr * 0.22)},${n(eyeY - hr * 0.12)} Q${ex},${n(eyeY - hr * 0.24)} ${n(ex + hr * 0.22)},${n(eyeY - hr * 0.12)}`
                }
                stroke={face.brow}
                strokeWidth={n(1.8 * scale)}
                strokeLinecap="round"
                fill="none"
                opacity={sleeping ? 1 : 0.5}
                data-anatomy="eyelid"
              />
              <circle
                cx={n(ex + gaze.x)}
                cy={n(eyeY + gaze.y)}
                r={n(hr * 0.1)}
                fill={face.brow}
                opacity={sleeping ? 0 : 1}
                data-anatomy="pupil"
              />
            </g>
          );
        })}
        {Math.abs(headTurn) > 0.12 ? (
          <path
            d={`M${n(g.head.x + faceShift * 0.55)},${n(g.head.y + hr * 0.02)} Q${n(
              g.head.x + faceShift + headTurn * hr * 0.18,
            )},${n(g.head.y + hr * 0.2)} ${n(g.head.x + faceShift * 0.72)},${n(g.head.y + hr * 0.3)}`}
            stroke={skin.shadow}
            strokeWidth={n(1.7 * scale)}
            strokeLinecap="round"
            fill="none"
            opacity={0.72}
            data-anatomy="nose-direction"
          />
        ) : null}
        {calling ? (
          <g data-expression="calling">
            <ellipse
              cx={n(g.head.x + faceShift)}
              cy={n(g.head.y + hr * 0.54)}
              rx={n(hr * 0.2)}
              ry={n(hr * 0.27)}
              fill={face.mouth}
              data-anatomy="mouth"
              data-mouth-shape="open"
            />
            <path
              d={`M${n(g.head.x + faceShift - hr * 0.1)},${n(g.head.y + hr * 0.61)} Q${n(
                g.head.x + faceShift,
              )},${n(g.head.y + hr * 0.67)} ${n(g.head.x + faceShift + hr * 0.1)},${n(
                g.head.y + hr * 0.61,
              )}`}
              stroke={skin.highlight}
              strokeWidth={n(1.5 * scale)}
              strokeLinecap="round"
              fill="none"
              opacity={0.64}
            />
          </g>
        ) : (
          <path
            d={`M${n(g.head.x - hr * 0.32 + faceShift)},${n(g.head.y + hr * 0.5)} Q${n(
              g.head.x + faceShift,
            )},${n(g.head.y + hr * 0.5 + mouthCurve)} ${n(g.head.x + hr * 0.32 + faceShift)},${n(
              g.head.y + hr * 0.5,
            )}`}
            stroke={face.mouth}
            strokeWidth={n(2.4 * scale)}
            strokeLinecap="round"
            fill="none"
            data-anatomy="mouth"
            data-mouth-shape="curve"
          />
        )}
        {buildAccent()}
      </g>

      <g data-layer="rim">
        <path
          d={`M${n(g.head.x - hr * rx)},${n(g.head.y)} A${n(hr * rx)},${n(hr * ry)} 0 0 1 ${n(
            g.head.x,
          )},${n(g.head.y - hr * ry)}`}
          stroke={skin.highlight}
          strokeWidth={n(2 * scale)}
          fill="none"
          opacity={0.6}
        />
        <path
          d={`M${n(g.shoulder.left.x)},${n(g.shoulder.left.y)} L${n(r.elbow.left.x)},${n(r.elbow.left.y)}`}
          stroke={skin.highlight}
          strokeWidth={n(1.6 * scale)}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
      </g>
    </g>
  );
}
