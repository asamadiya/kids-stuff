import type { SceneWorldProps } from '../shared';

/* -------------------------------------------------------------------------- */
/* Coordinates                                                                 */
/* -------------------------------------------------------------------------- */

/** A point in the shared 1200x800 scene coordinate space (unless noted local). */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** Where a character rig is planted, in scene coordinates. */
export interface Placement {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

/* -------------------------------------------------------------------------- */
/* Depth                                                                       */
/* -------------------------------------------------------------------------- */

/** The four atmospheric-perspective bands a cinematic scene composes with. */
export type DepthName = 'far' | 'mid' | 'focus' | 'near';

/**
 * Scene-authored atmospheric treatment for one depth group. Every field is
 * optional and defaults to "no effect": a {@link DepthTreatment}-less depth
 * layer is fully opaque, unfiltered and untranslated. `blur`/`saturation`/
 * `contrast` are realised through an SVG filter that {@link DepthLayer}
 * generates and references itself, never through a CSS `filter:` declaration.
 */
export interface DepthTreatment {
  readonly opacity?: number;
  readonly blur?: number;
  readonly saturation?: number;
  readonly contrast?: number;
  readonly parallax?: number;
}

/* -------------------------------------------------------------------------- */
/* Character appearance                                                        */
/* -------------------------------------------------------------------------- */

export type Build = 'child' | 'adult' | 'elder';

/**
 * Body segment lengths and widths, in the rig's local space (feet at y=0,
 * head above at negative y). Child and adult are genuinely different rigs, not
 * one rig at neighbouring scales.
 */
export interface ProportionProfile {
  readonly headRadius: number;
  readonly neckLength: number;
  /** Shoulder-line to hip-line vertical distance. */
  readonly torsoLength: number;
  /** Half-width from spine to a shoulder. */
  readonly shoulderWidth: number;
  /** Half-width from spine to a hip. */
  readonly hipWidth: number;
  readonly upperArm: number;
  readonly foreArm: number;
  readonly thigh: number;
  readonly shin: number;
  /** Base cross-section for limbs. */
  readonly limbWidth: number;
}

export interface SkinMaterial {
  readonly base: string;
  readonly shadow: string;
  readonly highlight: string;
}

export type FaceShape = 'round' | 'oval' | 'square' | 'heart';

export interface FaceProfile {
  readonly shape: FaceShape;
  readonly brow: string;
  readonly mouth: string;
}

export type HairStyle = 'short' | 'long' | 'bun' | 'cap' | 'bald' | 'wispy';

export interface HairProfile {
  readonly style: HairStyle;
  readonly base: string;
  readonly highlight: string;
  /** 0 = flat to the skull, 1 = a tall, voluminous mass. */
  readonly volume: number;
}

export type GarmentKind = 'tunic' | 'dress' | 'robe' | 'apron' | 'cloak';

export interface WardrobeProfile {
  readonly garment: GarmentKind;
  readonly base: string;
  readonly shadow: string;
  readonly trim: string;
  /** Fraction (0..1) of the legs covered by the garment hem. */
  readonly hemline: number;
}

export type FootwearStyle = 'barefoot' | 'sandal' | 'boot' | 'slipper';

export interface FootwearProfile {
  readonly style: FootwearStyle;
  readonly base: string;
}

export type SecondaryShapeKind =
  | 'belt'
  | 'sash'
  | 'necklace'
  | 'circlet'
  | 'satchel'
  | 'cape';

export interface SecondaryShape {
  readonly kind: SecondaryShapeKind;
  readonly color: string;
  readonly accent: string;
}

/**
 * Everything that makes a character look like a specific person — split out of
 * {@link CharacterPerformance} so identity (who) is authored independently of
 * performance (what they are doing).
 */
export interface CharacterAppearance {
  readonly build: Build;
  readonly proportions: ProportionProfile;
  readonly skin: SkinMaterial;
  readonly face: FaceProfile;
  readonly hair: HairProfile;
  readonly wardrobe: WardrobeProfile;
  readonly footwear: FootwearProfile;
  readonly secondaryShapes: readonly SecondaryShape[];
}

/* -------------------------------------------------------------------------- */
/* Character performance                                                       */
/* -------------------------------------------------------------------------- */

/** The five hand silhouettes the rig supports. */
export type HandPose = 'open' | 'point' | 'cup' | 'hold' | 'rest';

/** The five poses with genuinely distinct joint geometry. */
export type PoseName = 'stand' | 'point' | 'reach' | 'kneel' | 'sleep';

export type Expression =
  | 'curious'
  | 'uncertain'
  | 'delighted'
  | 'calling'
  | 'concerned'
  | 'calm'
  | 'sleeping';

/**
 * What a character is doing in a beat. Gaze and hand targets are authored in
 * scene coordinates so a character can look at / reach for another element in
 * the same 1200x800 frame; the rig converts them to local space and solves.
 */
export interface CharacterPerformance {
  readonly pose: PoseName;
  /** Degrees; the sweeping curve the whole pose reads along. */
  readonly lineOfAction: number;
  /** Degrees of shoulder-line tilt off horizontal. */
  readonly shoulderTilt: number;
  /** Degrees of pelvis-line tilt off horizontal. */
  readonly pelvisTilt: number;
  readonly weightFoot: 'left' | 'right' | 'center';
  /** Where the eyes look, in scene coordinates. */
  readonly gazeTarget: Point;
  /** Signed face turn from -1 (left profile) to 1 (right profile). */
  readonly headTurn?: number;
  readonly expression: Expression;
  readonly leftHand: HandPose;
  readonly rightHand: HandPose;
  /** Scene-coordinate target the left wrist is solved toward. */
  readonly leftHandTarget?: Point;
  /** Scene-coordinate target the right wrist is solved toward. */
  readonly rightHandTarget?: Point;
}

/* -------------------------------------------------------------------------- */
/* Resolved pose geometry                                                      */
/* -------------------------------------------------------------------------- */

export interface BilateralPoints {
  readonly left: Point;
  readonly right: Point;
}

export type OverlapPart =
  | 'leftLeg'
  | 'rightLeg'
  | 'pelvis'
  | 'torso'
  | 'leftArm'
  | 'rightArm'
  | 'head';

export interface Foreshortening {
  readonly leftArm: number;
  readonly rightArm: number;
  readonly leftLeg: number;
  readonly rightLeg: number;
}

export interface TorsoControls {
  readonly top: Point;
  readonly midLeft: Point;
  readonly midRight: Point;
  readonly bottom: Point;
}

/**
 * Fully solved joint positions for one beat, in scene coordinates. This is the
 * single source of truth the character renderer draws from — every silhouette
 * difference between poses comes from these points, not from `data-pose`.
 */
export interface PoseGeometry {
  readonly head: Point;
  readonly neck: Point;
  readonly shoulder: BilateralPoints;
  readonly elbow: BilateralPoints;
  readonly wrist: BilateralPoints;
  readonly hip: BilateralPoints;
  readonly knee: BilateralPoints;
  readonly ankle: BilateralPoints;
  readonly foot: BilateralPoints;
  readonly torso: TorsoControls;
  /** Normalised local direction the pupils look (from gazeTarget). */
  readonly gazeDirection: Point;
  /** Back-to-front draw order for the rig's parts. */
  readonly overlap: readonly OverlapPart[];
  readonly foreshortening: Foreshortening;
}

/* -------------------------------------------------------------------------- */
/* Lighting rig                                                                */
/* -------------------------------------------------------------------------- */

export interface DirectionalLight {
  /** Degrees, clockwise from +x. */
  readonly azimuth: number;
  /** Degrees above the picture plane. */
  readonly elevation: number;
  readonly color: string;
  readonly intensity: number;
}

export interface EnvironmentLight {
  readonly color: string;
  readonly intensity: number;
}

export interface PracticalLight {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly color: string;
  readonly intensity: number;
}

/**
 * The authored lighting for one scene. There is no single fixed global light:
 * every scene supplies its own key/fill/(rim)/practicals, and materials read
 * the key direction for their specular/diffuse response.
 */
export interface LightingRig {
  readonly key: DirectionalLight;
  readonly fill: EnvironmentLight;
  readonly rim?: DirectionalLight;
  readonly practicals: readonly PracticalLight[];
}

/* -------------------------------------------------------------------------- */
/* Materials                                                                   */
/* -------------------------------------------------------------------------- */

export type MaterialPreset = 'skin' | 'cloth' | 'timber' | 'metal' | 'stone' | 'water';

/**
 * A reusable material recipe instanced with scene-specific values. The preset
 * chooses the algorithm; base/shadow/highlight author the value structure;
 * textureScale/roughness tune the surface. Every field affects the emitted def.
 */
export interface MaterialInstance {
  readonly id: string;
  readonly preset: MaterialPreset;
  readonly base: string;
  readonly shadow: string;
  readonly highlight: string;
  readonly textureScale: number;
  readonly roughness: number;
}

/* -------------------------------------------------------------------------- */
/* Component props                                                             */
/* -------------------------------------------------------------------------- */

export interface CinematicDefsProps {
  readonly id: SceneWorldProps['id'];
  readonly seed: number;
  readonly lighting: LightingRig;
  readonly materials: readonly MaterialInstance[];
}

export interface CinematicCharacterProps {
  readonly id: SceneWorldProps['id'];
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly appearance: CharacterAppearance;
  readonly performance: CharacterPerformance;
  readonly className?: string;
}

/* -------------------------------------------------------------------------- */
/* Build presets + default appearance                                          */
/* -------------------------------------------------------------------------- */

/** Distinct proportion profiles per build (child != adult != elder). */
export const PROPORTION_PRESETS: Record<Build, ProportionProfile> = {
  child: {
    headRadius: 36,
    neckLength: 8,
    torsoLength: 96,
    shoulderWidth: 30,
    hipWidth: 27,
    upperArm: 46,
    foreArm: 40,
    thigh: 58,
    shin: 54,
    limbWidth: 22,
  },
  adult: {
    headRadius: 28,
    neckLength: 18,
    torsoLength: 152,
    shoulderWidth: 44,
    hipWidth: 33,
    upperArm: 74,
    foreArm: 66,
    thigh: 98,
    shin: 92,
    limbWidth: 26,
  },
  elder: {
    headRadius: 27,
    neckLength: 16,
    torsoLength: 138,
    shoulderWidth: 41,
    hipWidth: 35,
    upperArm: 68,
    foreArm: 60,
    thigh: 86,
    shin: 82,
    limbWidth: 27,
  },
};

const DEFAULT_APPEARANCE: Record<Build, Omit<CharacterAppearance, 'build' | 'proportions'>> = {
  child: {
    skin: { base: '#f2c49a', shadow: '#c98a5c', highlight: '#ffe6c8' },
    face: { shape: 'round', brow: '#3a2a20', mouth: '#a24e4a' },
    hair: { style: 'short', base: '#3a241a', highlight: '#5c3a26', volume: 0.5 },
    wardrobe: { garment: 'tunic', base: '#3f7d8c', shadow: '#2c5a66', trim: '#f2c46b', hemline: 0.45 },
    footwear: { style: 'sandal', base: '#7a5230' },
    secondaryShapes: [{ kind: 'belt', color: '#8a5a2a', accent: '#f2c46b' }],
  },
  adult: {
    skin: { base: '#d69a6e', shadow: '#a2673f', highlight: '#f4c59a' },
    face: { shape: 'oval', brow: '#2b1c14', mouth: '#8a3f42' },
    hair: { style: 'long', base: '#241812', highlight: '#4a2e1e', volume: 0.7 },
    wardrobe: { garment: 'robe', base: '#7c3b6a', shadow: '#54264a', trim: '#e7c46b', hemline: 0.9 },
    footwear: { style: 'boot', base: '#432a1a' },
    secondaryShapes: [{ kind: 'sash', color: '#c8a24a', accent: '#fff0c0' }],
  },
  elder: {
    skin: { base: '#cca184', shadow: '#9a6f52', highlight: '#ecd0b4' },
    face: { shape: 'square', brow: '#6a5648', mouth: '#7a4a44' },
    hair: { style: 'wispy', base: '#d9d2c4', highlight: '#f2ede2', volume: 0.35 },
    wardrobe: { garment: 'cloak', base: '#3d4a63', shadow: '#28324a', trim: '#9fb0c8', hemline: 0.95 },
    footwear: { style: 'slipper', base: '#5a4636' },
    secondaryShapes: [{ kind: 'necklace', color: '#c8b26a', accent: '#fff4cf' }],
  },
};

/**
 * A complete, valid {@link CharacterAppearance} for a build. Scenes clone and
 * override fields off this rather than assembling every profile by hand.
 */
export function defaultAppearance(build: Build): CharacterAppearance {
  return {
    build,
    proportions: PROPORTION_PRESETS[build],
    ...DEFAULT_APPEARANCE[build],
  };
}
