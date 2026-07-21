import { defaultAppearance } from './types';
import type { CharacterAppearance, LightingRig, MaterialInstance } from './types';

/*
 * TEMPORARY Task-2 -> Task-5 compatibility.
 *
 * Redirect Task 2 redesigns the cinematic kit's public contracts but must NOT
 * re-author `the-sneaky-golden-crown`. These UNSTABLE_* constants supply the
 * appearance / lighting / material arguments the redesigned API now requires so
 * the currently-committed crown page keeps compiling and rendering its existing
 * hooks. They are deliberately kept OUT of the kit's public `index.ts` surface.
 *
 * Redirect Task 5 re-authors the crown scene with real, per-character authored
 * values and MUST delete this file and every reference to it.
 */

export const UNSTABLE_CROWN_LIGHTING: LightingRig = {
  key: { azimuth: -28, elevation: 46, color: '#ffe6ab', intensity: 0.85 },
  fill: { color: '#5c6ea8', intensity: 0.5 },
  practicals: [],
};

export const UNSTABLE_CROWN_MATERIALS: readonly MaterialInstance[] = [
  {
    id: 'soft-gold',
    preset: 'metal',
    base: '#f0b73f',
    shadow: '#b9791f',
    highlight: '#fff2c8',
    textureScale: 1,
    roughness: 0.25,
  },
  {
    id: 'worn-timber',
    preset: 'timber',
    base: '#8a5f39',
    shadow: '#5f3f26',
    highlight: '#c9a15c',
    textureScale: 1.4,
    roughness: 0.6,
  },
  {
    id: 'woven-cloth',
    preset: 'cloth',
    base: '#b3413f',
    shadow: '#7a2a28',
    highlight: '#e08a86',
    textureScale: 1.2,
    roughness: 0.7,
  },
];

export const UNSTABLE_DELIA_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('child'),
  skin: { base: '#c98a5c', shadow: '#9c6238', highlight: '#e8b184' },
  hair: { style: 'long', base: '#2c1a12', highlight: '#4a2c1c', volume: 0.7 },
  wardrobe: { garment: 'dress', base: '#3f7d8c', shadow: '#2c5a66', trim: '#f2c46b', hemline: 0.7 },
  footwear: { style: 'sandal', base: '#6a4526' },
  secondaryShapes: [{ kind: 'belt', color: '#c8944a', accent: '#fff0c0' }],
};

export const UNSTABLE_KING_APPEARANCE: CharacterAppearance = {
  ...defaultAppearance('adult'),
  skin: { base: '#b9784f', shadow: '#8a5330', highlight: '#dba173' },
  hair: { style: 'wispy', base: '#e7ddca', highlight: '#fbf4e6', volume: 0.4 },
  wardrobe: { garment: 'robe', base: '#7c3b6a', shadow: '#54264a', trim: '#e7c46b', hemline: 0.92 },
  footwear: { style: 'boot', base: '#432a1a' },
  secondaryShapes: [
    { kind: 'circlet', color: '#e7c46b', accent: '#fff4cf' },
    { kind: 'sash', color: '#c8a24a', accent: '#fff0c0' },
  ],
};
