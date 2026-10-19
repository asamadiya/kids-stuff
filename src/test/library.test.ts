import { describe, expect, it } from 'vitest';
import { ARCHIVE, CURATED_ARCHIVE, SUBJECTS, archiveStory, storiesIn, subjectOfStory } from '../learn/library';

describe('the Big Library', () => {
  it('holds only the real-history read-alouds', () => {
    expect(ARCHIVE.length).toBeGreaterThanOrEqual(190);
    for (const s of ARCHIVE) expect(s.collection).toBe('historical');
  });

  it('puts every archive story in exactly one subject', () => {
    for (const s of ARCHIVE) {
      const hits = SUBJECTS.filter((sub) => sub.domains.includes(s.domain));
      expect(hits.length, s.slug).toBe(1);
    }
    const total = SUBJECTS.reduce((n, sub) => n + storiesIn(sub.id).length, 0);
    expect(total).toBe(ARCHIVE.length);
  });

  it('curates only stories that exist and are real history', () => {
    // A hand-picked list typed from memory named one story that did not exist
    // and four from the invented-cast collection. This is what caught it.
    for (const slug of CURATED_ARCHIVE) {
      expect(archiveStory(slug), slug).toBeDefined();
      expect(subjectOfStory(slug), slug).toBeDefined();
    }
  });
});
