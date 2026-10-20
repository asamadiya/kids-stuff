import { describe, expect, it } from 'vitest';
import { ARCHIVE, CURATED_ARCHIVE, SUBJECTS, archiveEntry, archiveStory, storiesIn, subjectOfStory } from '../learn/library';
import { ARCHIVE_ENTRIES } from '../learn/archive-notes';
import { REQUIRED_NOTE_FIELDS } from '../notes/types';
import { STORIES } from '../stories';

describe('the Big Library', () => {
  it('holds only the real-history read-alouds', () => {
    expect(ARCHIVE.length).toBeGreaterThanOrEqual(180);
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

  it('gives every historical read-aloud a kind and its own grown-ups note', () => {
    // The final review: one blanket "true stories" note over 195 entries that
    // included teaching legends. Each story now says what it is, and the panel
    // talks about THIS story.
    const historical = STORIES.filter((s) => s.collection === 'historical');
    for (const s of historical) {
      const e = ARCHIVE_ENTRIES[s.slug];
      expect(e, s.slug).toBeDefined();
      expect(['documented', 'reconstructed', 'tale'], s.slug).toContain(e.kind);
      for (const f of REQUIRED_NOTE_FIELDS) expect(e.note[f]?.trim().length ?? 0, `${s.slug}.${f}`).toBeGreaterThan(20);
    }
    expect(Object.keys(ARCHIVE_ENTRIES).sort()).toEqual(historical.map((s) => s.slug).sort());
  });

  it('offers no withheld story, and curates none', () => {
    for (const s of ARCHIVE) expect(archiveEntry(s.slug)?.withhold, s.slug).toBeUndefined();
    for (const slug of CURATED_ARCHIVE) expect(archiveEntry(slug)?.withhold, slug).toBeUndefined();
  });
});
