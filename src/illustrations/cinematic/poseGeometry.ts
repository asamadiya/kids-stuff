import { n } from '../shared';
import type {
  BilateralPoints,
  CharacterAppearance,
  CharacterPerformance,
  Foreshortening,
  OverlapPart,
  Placement,
  Point,
  PoseGeometry,
  PoseName,
} from './types';

const round = (p: Point): Point => ({ x: n(p.x), y: n(p.y) });

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

const rotate = (p: Point, pivot: Point, deg: number): Point => {
  const a = (deg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const dx = p.x - pivot.x;
  const dy = p.y - pivot.y;
  return { x: pivot.x + dx * cos - dy * sin, y: pivot.y + dx * sin + dy * cos };
};

const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/**
 * Deterministic two-bone (law-of-cosines) IK. Given a `root`, a `target`, two
 * bone lengths and a `bendSign` (+1 / -1 chooses which side the joint breaks
 * to), returns the middle `joint` and the `end` effector. Out-of-reach targets
 * are clamped to full extension along the target direction, so the solver never
 * returns NaN and the end always lies on the reachable disc.
 */
export function solveTwoBone(
  root: Point,
  target: Point,
  l1: number,
  l2: number,
  bendSign: number,
): { readonly joint: Point; readonly end: Point } {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const raw = Math.hypot(dx, dy);
  const eps = 1e-4;
  const maxReach = l1 + l2 - eps;
  const minReach = Math.abs(l1 - l2) + eps;
  const reach = clamp(raw, minReach, maxReach);
  const ux = raw < eps ? 1 : dx / raw;
  const uy = raw < eps ? 0 : dy / raw;
  const end: Point = { x: root.x + ux * reach, y: root.y + uy * reach };
  const cosJoint = clamp((l1 * l1 + reach * reach - l2 * l2) / (2 * l1 * reach), -1, 1);
  const jointAngle = Math.atan2(uy, ux) + bendSign * Math.acos(cosJoint);
  const joint: Point = {
    x: root.x + Math.cos(jointAngle) * l1,
    y: root.y + Math.sin(jointAngle) * l1,
  };
  return { joint: round(joint), end: round(end) };
}

/* -------------------------------------------------------------------------- */
/* Local skeleton, resolved per pose                                           */
/* -------------------------------------------------------------------------- */

interface LocalSkeleton {
  readonly hipCenter: Point;
  readonly shoulderCenter: Point;
  readonly head: Point;
  readonly ankleL: Point;
  readonly ankleR: Point;
  readonly footL: Point;
  readonly footR: Point;
  readonly kneeOverrideL: Point | null;
  readonly kneeOverrideR: Point | null;
  readonly defaultWristL: Point;
  readonly defaultWristR: Point;
  readonly armBendL: number;
  readonly armBendR: number;
  readonly legBendL: number;
  readonly legBendR: number;
  readonly overlap: readonly OverlapPart[];
  readonly foreshortening: Foreshortening;
}

const buildLocalSkeleton = (
  appearance: CharacterAppearance,
  perf: CharacterPerformance,
): LocalSkeleton => {
  const P = appearance.proportions;
  const legLen = P.thigh + P.shin;
  const weightShiftX = perf.weightFoot === 'left' ? -8 : perf.weightFoot === 'right' ? 8 : 0;
  const lean = perf.lineOfAction;
  // Build-specific standing posture: the elder carries the head forward of the
  // shoulders (a gentle stoop) and the child a touch forward, so adult and
  // elder read as different silhouettes even before wardrobe/colour.
  const stoop = appearance.build === 'elder' ? 13 : appearance.build === 'child' ? 4 : 0;

  const standHipY = -(legLen - 6);
  const uprightShoulderY = standHipY - P.torsoLength;
  const uprightHeadY = uprightShoulderY - P.neckLength - P.headRadius;

  const overlapStand: readonly OverlapPart[] = [
    'leftArm',
    'leftLeg',
    'pelvis',
    'torso',
    'rightLeg',
    'rightArm',
    'head',
  ];

  switch (perf.pose as PoseName) {
    case 'point': {
      // Target-directed point: torso/head turn toward the +x target, weight on
      // the target-side (planted) foot, a narrow stance, and a relaxed
      // non-pointing arm hanging at the side.
      const shoulderCenter = { x: lean * 0.7 + 6, y: uprightShoulderY };
      return {
        hipCenter: { x: weightShiftX, y: standHipY },
        shoulderCenter,
        head: { x: lean * 0.9 + 20 + stoop, y: uprightHeadY },
        ankleL: { x: -P.hipWidth + 4, y: 0 },
        ankleR: { x: P.hipWidth - 8, y: 0 },
        footL: { x: -P.hipWidth - 1, y: 0 },
        footR: { x: P.hipWidth - 2, y: 0 },
        kneeOverrideL: null,
        kneeOverrideR: null,
        // Relaxed left arm at the side; the right arm is IK-solved to the target.
        defaultWristL: { x: -P.shoulderWidth - 2, y: uprightShoulderY + P.upperArm * 0.7 + P.foreArm * 0.5 },
        defaultWristR: { x: P.shoulderWidth + 24, y: uprightShoulderY + P.upperArm * 0.4 },
        armBendL: -1,
        armBendR: 1,
        legBendL: 1,
        legBendR: -1,
        overlap: ['leftArm', 'rightLeg', 'leftLeg', 'pelvis', 'torso', 'head', 'rightArm'],
        foreshortening: { leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
      };
    }
    case 'reach': {
      // Directed reach (not a symmetric celebration V): the shoulders lift, one
      // heel lifts, and the arms are IK-solved to the scene targets the sheet
      // authors (asymmetric, up-and-toward the target).
      const shoulderCenter = { x: lean * 0.6 + 6, y: uprightShoulderY - P.limbWidth * 0.28 };
      return {
        hipCenter: { x: weightShiftX + 4, y: standHipY },
        shoulderCenter,
        head: { x: lean * 0.9 + 10 + stoop, y: uprightHeadY - P.limbWidth * 0.28 },
        ankleL: { x: -P.hipWidth - 2, y: 0 },
        ankleR: { x: P.hipWidth + 6, y: -P.limbWidth * 0.4 },
        footL: { x: -P.hipWidth - 10, y: 0 },
        footR: { x: P.hipWidth + 16, y: -P.limbWidth * 0.55 },
        kneeOverrideL: null,
        kneeOverrideR: null,
        defaultWristL: { x: -P.shoulderWidth - 6, y: uprightShoulderY + P.upperArm * 0.7 + P.foreArm * 0.4 },
        defaultWristR: { x: P.shoulderWidth + 26, y: uprightShoulderY - P.upperArm * 0.4 },
        armBendL: -1,
        armBendR: 1,
        legBendL: 1,
        legBendR: -1,
        overlap: ['leftLeg', 'rightLeg', 'pelvis', 'torso', 'head', 'leftArm', 'rightArm'],
        foreshortening: { leftArm: 1, rightArm: 0.9, leftLeg: 1, rightLeg: 0.96 },
      };
    }
    case 'kneel': {
      // One knee planted on the ground (left), one foot planted forward (right),
      // pelvis lowered over the support, torso counterbalanced. Both legs use
      // explicit overrides so the contacts and the bent support knee are
      // readable and never jut sideways.
      const hipY = -P.thigh * 0.92;
      const shoulderY = hipY - P.torsoLength;
      const headY = shoulderY - P.neckLength - P.headRadius;
      // Support (right) leg: flat foot forward, knee bent up and forward.
      const ankleR = { x: P.hipWidth + P.thigh * 0.16, y: -P.limbWidth * 0.2 };
      const footR = { x: P.hipWidth + P.thigh * 0.5, y: 0 };
      const kneeR = { x: P.hipWidth + P.thigh * 0.4, y: -P.shin * 0.78 };
      // Kneeling (left) leg: knee on the ground, shin resting back, foot tucked.
      const kneeL = { x: -P.hipWidth * 0.25, y: -P.limbWidth * 0.35 };
      const ankleL = { x: kneeL.x - P.shin * 0.5, y: -P.limbWidth * 0.2 };
      const footL = { x: kneeL.x - P.shin * 0.5 - P.limbWidth * 0.3, y: 0 };
      return {
        hipCenter: { x: weightShiftX, y: hipY },
        shoulderCenter: { x: weightShiftX + lean * 0.6 + 4, y: shoulderY },
        head: { x: weightShiftX + lean * 0.9 + 4 + stoop, y: headY },
        ankleL,
        ankleR,
        footL,
        footR,
        kneeOverrideL: kneeL,
        kneeOverrideR: kneeR,
        defaultWristL: { x: -P.shoulderWidth - 6, y: shoulderY + P.upperArm * 0.6 + P.foreArm * 0.3 },
        defaultWristR: { x: P.shoulderWidth + 10, y: shoulderY + P.upperArm * 0.7 },
        armBendL: -1,
        armBendR: 1,
        legBendL: 1,
        legBendR: -1,
        overlap: ['leftLeg', 'pelvis', 'torso', 'rightLeg', 'leftArm', 'rightArm', 'head'],
        foreshortening: { leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
      };
    }
    case 'sleep': {
      // A compact curled side-lying mass: head resting near the shoulder, torso
      // roughly horizontal, both legs drawn up and overlapping toward the chest,
      // arms tucked. Every joint is placed inside the body envelope so the
      // silhouette reads as one sleeping figure, not scattered sticks.
      const restY = -P.limbWidth * 0.8;
      const hipCenter = { x: P.torsoLength * 0.3, y: restY };
      const shoulderCenter = { x: hipCenter.x - P.torsoLength * 0.62, y: restY - P.limbWidth * 0.15 };
      const head = {
        x: shoulderCenter.x - (P.neckLength + P.headRadius) * 0.72,
        y: restY - P.headRadius * 0.35,
      };
      // Knees drawn up toward the chest; ankles tucked back under the thighs.
      const kneeL = { x: hipCenter.x - P.thigh * 0.42, y: restY - P.thigh * 0.5 };
      const ankleL = { x: hipCenter.x - P.thigh * 0.72, y: restY - P.limbWidth * 0.1 };
      const footL = { x: ankleL.x - P.limbWidth * 0.45, y: restY };
      const kneeR = { x: hipCenter.x - P.thigh * 0.24, y: restY - P.thigh * 0.28 };
      const ankleR = { x: hipCenter.x - P.thigh * 0.52, y: restY + P.limbWidth * 0.2 };
      const footR = { x: ankleR.x - P.limbWidth * 0.45, y: restY + P.limbWidth * 0.25 };
      return {
        hipCenter,
        shoulderCenter,
        head,
        ankleL,
        ankleR,
        footL,
        footR,
        kneeOverrideL: kneeL,
        kneeOverrideR: kneeR,
        // Upper arm tucked under the head; lower arm resting along the side.
        defaultWristL: { x: shoulderCenter.x - P.upperArm * 0.1, y: restY - P.limbWidth * 0.25 },
        defaultWristR: { x: hipCenter.x - P.upperArm * 0.15, y: restY - P.limbWidth * 0.6 },
        armBendL: 1,
        armBendR: -1,
        legBendL: 1,
        legBendR: 1,
        overlap: ['rightLeg', 'leftLeg', 'pelvis', 'torso', 'rightArm', 'head', 'leftArm'],
        foreshortening: { leftArm: 0.95, rightArm: 0.95, leftLeg: 0.98, rightLeg: 0.98 },
      };
    }
    case 'stand':
    default: {
      // Relaxed contrapposto: a planted weight foot, gentle shoulder/pelvis
      // counter-tilt (authored on the performance), a narrow stance and the head
      // carried by the build's posture toward the gaze target.
      const shoulderCenter = { x: lean * 0.6, y: uprightShoulderY };
      return {
        hipCenter: { x: weightShiftX, y: standHipY },
        shoulderCenter,
        head: { x: lean * 0.9 + stoop, y: uprightHeadY },
        ankleL: { x: -P.hipWidth, y: 0 },
        ankleR: { x: P.hipWidth, y: 0 },
        footL: { x: -P.hipWidth - 6, y: 0 },
        footR: { x: P.hipWidth + 6, y: 0 },
        kneeOverrideL: null,
        kneeOverrideR: null,
        defaultWristL: { x: -P.shoulderWidth - 4, y: uprightShoulderY + P.upperArm * 0.55 + P.foreArm * 0.45 },
        defaultWristR: { x: P.shoulderWidth + 4, y: uprightShoulderY + P.upperArm * 0.55 + P.foreArm * 0.45 },
        armBendL: -1,
        armBendR: 1,
        legBendL: 1,
        legBendR: -1,
        overlap: overlapStand,
        foreshortening: { leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
      };
    }
  }
};

/**
 * Solve a full beat into scene-space joint positions. Distinct per pose,
 * per appearance and per performance target: `pose` chooses the layout,
 * `leftHandTarget`/`rightHandTarget` and `gazeTarget` are consumed in scene
 * coordinates, weight/tilt/line-of-action reshape the torso and legs, and the
 * feet stay planted while the pelvis shifts.
 */
export function resolvePoseGeometry(
  appearance: CharacterAppearance,
  perf: CharacterPerformance,
  placement: Placement,
): PoseGeometry {
  const P = appearance.proportions;
  const s = placement.scale;
  const toLocal = (pt: Point): Point => ({
    x: (pt.x - placement.x) / s,
    y: (pt.y - placement.y) / s,
  });
  const sc = (p: Point): Point => round({ x: placement.x + p.x * s, y: placement.y + p.y * s });

  const sk = buildLocalSkeleton(appearance, perf);

  const hipL0 = { x: sk.hipCenter.x - P.hipWidth, y: sk.hipCenter.y };
  const hipR0 = { x: sk.hipCenter.x + P.hipWidth, y: sk.hipCenter.y };
  const hipL = rotate(hipL0, sk.hipCenter, perf.pelvisTilt);
  const hipR = rotate(hipR0, sk.hipCenter, perf.pelvisTilt);

  const shL0 = { x: sk.shoulderCenter.x - P.shoulderWidth, y: sk.shoulderCenter.y };
  const shR0 = { x: sk.shoulderCenter.x + P.shoulderWidth, y: sk.shoulderCenter.y };
  const shL = rotate(shL0, sk.shoulderCenter, perf.shoulderTilt);
  const shR = rotate(shR0, sk.shoulderCenter, perf.shoulderTilt);

  const legLSolve = solveTwoBone(hipL, sk.ankleL, P.thigh, P.shin, sk.legBendL);
  const legRSolve = solveTwoBone(hipR, sk.ankleR, P.thigh, P.shin, sk.legBendR);
  const kneeL = sk.kneeOverrideL ?? legLSolve.joint;
  const kneeR = sk.kneeOverrideR ?? legRSolve.joint;

  const wristTargetL = perf.leftHandTarget ? toLocal(perf.leftHandTarget) : sk.defaultWristL;
  const wristTargetR = perf.rightHandTarget ? toLocal(perf.rightHandTarget) : sk.defaultWristR;
  const armL = solveTwoBone(shL, wristTargetL, P.upperArm, P.foreArm, sk.armBendL);
  const armR = solveTwoBone(shR, wristTargetR, P.upperArm, P.foreArm, sk.armBendR);

  const neck = mid(sk.shoulderCenter, sk.head);

  const gLocal = toLocal(perf.gazeTarget);
  const gdx = gLocal.x - sk.head.x;
  const gdy = gLocal.y - sk.head.y;
  const glen = Math.hypot(gdx, gdy) || 1;
  const gazeDirection: Point = { x: n(gdx / glen), y: n(gdy / glen) };

  const bilateral = (l: Point, r: Point): BilateralPoints => ({ left: sc(l), right: sc(r) });

  return {
    head: sc(sk.head),
    neck: sc(neck),
    shoulder: bilateral(shL, shR),
    elbow: bilateral(armL.joint, armR.joint),
    wrist: bilateral(armL.end, armR.end),
    hip: bilateral(hipL, hipR),
    knee: bilateral(kneeL, kneeR),
    ankle: bilateral(sk.ankleL, sk.ankleR),
    foot: bilateral(sk.footL, sk.footR),
    torso: {
      top: sc(sk.shoulderCenter),
      midLeft: sc(mid(shL, hipL)),
      midRight: sc(mid(shR, hipR)),
      bottom: sc(sk.hipCenter),
    },
    gazeDirection,
    overlap: sk.overlap,
    foreshortening: sk.foreshortening,
  };
}

/* -------------------------------------------------------------------------- */
/* Foreshortening applied to render joints                                     */
/* -------------------------------------------------------------------------- */

/**
 * The arm/leg joint positions the character renderer actually draws, after
 * {@link PoseGeometry.foreshortening} is applied. Every value is derived from a
 * solved joint compressed toward its proximal joint (shoulder or hip) by the
 * limb's foreshortening factor, so a foreshortened limb reads shorter without
 * changing the pose solve.
 */
export interface RenderJoints {
  readonly elbow: BilateralPoints;
  readonly wrist: BilateralPoints;
  readonly knee: BilateralPoints;
  readonly ankle: BilateralPoints;
  readonly foot: BilateralPoints;
}

/** Compress `p` toward `root` by `factor` (1 = identity). */
const compress = (root: Point, p: Point, factor: number): Point =>
  round({ x: root.x + (p.x - root.x) * factor, y: root.y + (p.y - root.y) * factor });

/**
 * Apply {@link PoseGeometry.foreshortening} to the arm and leg chains, returning
 * the joint positions the renderer draws. Arms compress toward the shoulder;
 * legs compress toward the hip and carry their foot along with the ankle so
 * footwear stays attached. With every factor at 1 this is the identity mapping.
 */
export function foreshortenGeometry(g: PoseGeometry): RenderJoints {
  const fs: Foreshortening = g.foreshortening;

  const arm = (
    shoulder: Point,
    elbow: Point,
    wrist: Point,
    factor: number,
  ): { elbow: Point; wrist: Point } => ({
    elbow: compress(shoulder, elbow, factor),
    wrist: compress(shoulder, wrist, factor),
  });

  const leg = (
    hip: Point,
    knee: Point,
    ankle: Point,
    foot: Point,
    factor: number,
  ): { knee: Point; ankle: Point; foot: Point } => {
    const nextAnkle = compress(hip, ankle, factor);
    const nextFoot = round({
      x: foot.x + (nextAnkle.x - ankle.x),
      y: foot.y + (nextAnkle.y - ankle.y),
    });
    return { knee: compress(hip, knee, factor), ankle: nextAnkle, foot: nextFoot };
  };

  const armL = arm(g.shoulder.left, g.elbow.left, g.wrist.left, fs.leftArm);
  const armR = arm(g.shoulder.right, g.elbow.right, g.wrist.right, fs.rightArm);
  const legL = leg(g.hip.left, g.knee.left, g.ankle.left, g.foot.left, fs.leftLeg);
  const legR = leg(g.hip.right, g.knee.right, g.ankle.right, g.foot.right, fs.rightLeg);

  return {
    elbow: { left: armL.elbow, right: armR.elbow },
    wrist: { left: armL.wrist, right: armR.wrist },
    knee: { left: legL.knee, right: legR.knee },
    ankle: { left: legL.ankle, right: legR.ankle },
    foot: { left: legL.foot, right: legR.foot },
  };
}
