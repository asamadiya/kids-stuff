import { describe, it, expect } from 'vitest';
import {
  EMOTION_LIST, EMOTION_FACE_ROUNDS, EMOTION_STORY_ROUNDS, emotionOptions, emotionLabel, BIG_FEELINGS_META,
} from '../games/emotions';

describe('emotions vocabulary', () => {
  it('has a rich nuanced set (>= 24)', () => expect(EMOTION_LIST.length).toBeGreaterThanOrEqual(24));
  it('every face round is a real emotion', () => {
    const keys = new Set(EMOTION_LIST.map((e) => e.key));
    for (const r of EMOTION_FACE_ROUNDS) expect(keys.has(r.emotion)).toBe(true);
  });
  it('every story round targets a real emotion', () => {
    const keys = new Set(EMOTION_LIST.map((e) => e.key));
    for (const r of EMOTION_STORY_ROUNDS) expect(keys.has(r.emotion)).toBe(true);
  });
  it('options always include the answer, count 4, unique', () => {
    for (const r of [...EMOTION_FACE_ROUNDS, ...EMOTION_STORY_ROUNDS].slice(0, 40)) {
      const o = emotionOptions(r.emotion, 3, 4);
      expect(o).toContain(r.emotion);
      expect(o.length).toBe(4);
      expect(new Set(o).size).toBe(4);
    }
  });
  it('meta id', () => expect(BIG_FEELINGS_META.id).toBe('big-feelings'));
  it('labels capitalize', () => expect(emotionLabel('grateful')).toBe('Grateful'));
});
