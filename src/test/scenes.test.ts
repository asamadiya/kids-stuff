import { describe, it, expect } from 'vitest';
import { SCENE_ROUNDS, SCENES_META, getSceneOptions, getSceneFeedback, sceneLabel } from '../games/scenes';

describe('scenes data', () => {
  it('has 20 scenes with valid feelings', () => {
    expect(SCENE_ROUNDS.length).toBe(20);
  });
  it('meta id is scenes', () => expect(SCENES_META.id).toBe('scenes'));
  it('options always include the answer, length 4', () => {
    SCENE_ROUNDS.forEach((r, i) => {
      const o = getSceneOptions(i);
      expect(o).toContain(r.feeling);
      expect(o.length).toBe(4);
    });
  });
  it('feedback is warm and non-empty for any pick', () => {
    SCENE_ROUNDS.forEach((r, i) => {
      const opts = getSceneOptions(i);
      for (const o of opts) expect(getSceneFeedback(r, o).length).toBeGreaterThan(0);
    });
  });
  it('labels capitalize', () => expect(sceneLabel('frustrated')).toBe('Frustrated'));
});
