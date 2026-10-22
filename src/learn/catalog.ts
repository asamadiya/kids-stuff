import { BOOKS, SHELVES, booksOn } from '../books/registry';
import { ARCHIVE, SUBJECTS, archiveLabel, storiesIn } from './library';
import { SITUATIONS } from './situations';
import { MATHS_GAMES, MATHS_GROUPS } from '../maths/registry';
import { SCIENCE_GAMES, SCIENCE_GROUPS } from '../science/registry';
import { ACTIVITIES, MAKE_AREAS } from '../make/activities';
import { IDEAS, PLAY_GROUPS, WHERE_LABEL } from '../together';
import { LANG_BOOKS, MOMENTS, RHYMES, WHEN_LABEL, WORDS } from '../languages';

/**
 * The whole contents of the centre as one list, so the home directory, the
 * hubs and the Everything index can never disagree about what exists.
 *
 * The parent's complaint was "too many clicks to get a view of what the site
 * contains": shelves were paged four at a time, games four at a time, and the
 * Big Library sat three levels down. The advisor (q7, rulings 1-4) retired
 * the four-card rule: home shows every part, every group and every item as a
 * linked title; Everything adds the 193 library stories with search and
 * filters for a grown-up.
 */

export type Part = 'stories' | 'maths' | 'science' | 'make' | 'together' | 'langs';

export const PARTS: ReadonlyArray<{ readonly id: Part; readonly name: string; readonly href: string; readonly art: string; readonly badge?: string }> = [
  { id: 'stories', name: 'Stories', href: '#/stories', art: 'art/hubs/stories.webp' },
  { id: 'maths', name: 'Maths', href: '#/maths', art: 'art/hubs/maths.webp' },
  { id: 'science', name: 'Science', href: '#/science', art: 'art/hubs/science.webp' },
  { id: 'make', name: 'Make & Do', href: '#/make', art: 'art/hubs/make.webp', badge: 'With a grown-up' },
  { id: 'together', name: 'Play with Dad & Mom', href: '#/together', art: 'art/hubs/together.webp', badge: 'No screen' },
  { id: 'langs', name: 'Telugu & Tamil', href: '#/langs', art: 'art/hubs/langs.webp', badge: 'With Amma & Nanna' },
];

/** What kind of thing an entry is, as a grown-up would filter it. */
export type EntryKind = 'Picture book' | 'Longer read-aloud' | 'Situation' | 'Maths game' | 'Science game' | 'Make & Do' | 'Play together' | 'Telugu & Tamil';

export interface Entry {
  readonly key: string;
  readonly part: Part;
  readonly kind: EntryKind;
  /** The group inside its part: shelf, game group, idea area, play group, library subject. */
  readonly group: string;
  readonly groupTitle: string;
  readonly title: string;
  readonly hook: string;
  readonly href: string;
  /**
   * The master picture under public/, from which scripts/art/cards.py makes
   * the 560-wide card and the 120-wide directory thumbnail (see `cardSrc`).
   */
  readonly art?: string;
  /** "5 min", "Hourly, one sunny day". */
  readonly time?: string;
  /** "Child alone or with you", "With a grown-up". */
  readonly adult: string;
  /** Where it happens, for activities and play. */
  readonly where?: string;
  /** Lower-case text searched by the index: title, hook, group, materials, tags. */
  readonly search: string;
}

export interface Group {
  readonly part: Part;
  readonly id: string;
  readonly title: string;
  readonly line: string;
  readonly entries: readonly Entry[];
  /** For the library: one link standing in for the subject's stories. */
  readonly href?: string;
}

/** About how long a story takes to read aloud, at a calm 120 words a minute. */
const readAloudMinutes = (st: { readonly pages: ReadonlyArray<{ readonly text: string }> }) =>
  Math.max(1, Math.round(st.pages.reduce((n, p) => n + p.text.split(/\s+/).length, 0) / 120));

const words = (...xs: ReadonlyArray<string | readonly string[] | undefined>) =>
  xs.flat().filter(Boolean).join(' ').toLowerCase();

function bookEntries(): Entry[] {
  return SHELVES.flatMap((s) =>
    booksOn(s.id).map((b) => ({
      key: `book/${b.slug}`,
      part: 'stories' as const,
      kind: 'Picture book' as const,
      group: s.id,
      groupTitle: s.title,
      title: b.title,
      hook: b.hook,
      href: `#/book/${b.slug}/1`,
      art: `art/books/${b.slug}/cover.png`,
      time: `${b.readMinutes} min`,
      adult: 'Read aloud together',
      search: words(b.title, b.hook, s.title, 'book story read'),
    })),
  );
}

function situationEntries(): Entry[] {
  return SITUATIONS.map((x) => ({
    key: `sel/${x.id}`,
    part: 'stories' as const,
    kind: 'Situation' as const,
    group: 'situations',
    groupTitle: 'Try a Situation',
    title: x.title,
    hook: x.hook,
    href: `#/situation/${x.id}`,
    art: `games/covers/${x.id}.png`,
    time: '5 min',
    adult: 'Best with you beside him',
    search: words(x.title, x.hook, 'feelings friends sister sibling manners situation'),
  }));
}

function libraryEntries(): Entry[] {
  return SUBJECTS.flatMap((sub) =>
    storiesIn(sub.id).map((st) => ({
      key: `read/${st.slug}`,
      part: 'stories' as const,
      kind: 'Longer read-aloud' as const,
      group: `library/${sub.id}`,
      groupTitle: `Big Library: ${sub.title}`,
      title: st.title,
      hook: st.subtitle,
      href: `#/read/${st.slug}/1`,
      art: `art/${st.slug}/cover.png`,
      time: `${readAloudMinutes(st)} min read`,
      adult: `Read aloud together · ${archiveLabel(st.slug)}`,
      search: words(st.title, st.subtitle, sub.title, archiveLabel(st.slug), 'history true story library'),
    })),
  );
}

function gameEntries(part: 'maths' | 'science'): Entry[] {
  const games = part === 'maths' ? MATHS_GAMES : SCIENCE_GAMES;
  const groups = part === 'maths' ? MATHS_GROUPS : SCIENCE_GROUPS;
  return groups.flatMap((g) =>
    games
      .filter((x) => x.group === g.id)
      .map((x) => ({
        key: `${part}/${x.id}`,
        part,
        kind: part === 'maths' ? ('Maths game' as const) : ('Science game' as const),
        group: g.id,
        groupTitle: g.title,
        title: x.title,
        hook: x.hook,
        href: `#/${part}/${x.id}`,
        art: x.cover,
        time: '5 min',
        adult: 'He can play alone; better with you',
        search: words(x.title, x.hook, g.title, g.line, part === 'maths' ? 'maths math numbers game' : 'science physics predict game'),
      })),
  );
}

const PLACE: Record<string, string> = { kitchen: 'Kitchen', garden: 'Garden', outdoors: 'Outdoors', table: 'Table or floor' };

function activityEntries(): Entry[] {
  return MAKE_AREAS.flatMap((ar) =>
    ACTIVITIES.filter((a) => a.area === ar.id).map((a) => ({
      key: `make/${a.id}`,
      part: 'make' as const,
      kind: 'Make & Do' as const,
      group: ar.id,
      groupTitle: ar.title,
      title: a.title,
      hook: a.hook,
      href: `#/make/${a.id}`,
      // The card shows the first painted step; a step drawn as a diagram has no picture file.
      art: `art/make/${a.id}/step-${a.steps.findIndex((s) => !s.figure) + 1}.png`,
      time: a.span ?? `${a.minutes} min`,
      adult: 'With a grown-up',
      where: [a.where, ...(a.places ?? [])].map((p) => PLACE[p]).join(', '),
      search: words(a.title, a.hook, ar.title, ar.line, a.need, a.tags, [a.where, ...(a.places ?? [])].map((p) => PLACE[p]), 'make do activity experiment craft'),
    })),
  );
}

function ideaEntries(): Entry[] {
  return PLAY_GROUPS.flatMap((g) =>
    IDEAS.filter((x) => x.group === g.id).map((x) => ({
      key: `together/${x.id}`,
      part: 'together' as const,
      kind: 'Play together' as const,
      group: g.id,
      groupTitle: g.title,
      title: x.title,
      hook: x.hook,
      href: `#/together/${x.id}`,
      art: `art/together/${x.id}.png`,
      time: `${x.minutes} min`,
      adult: x.players,
      where: WHERE_LABEL[x.where],
      search: words(x.title, x.hook, g.title, x.need, x.tags, x.tradition, WHERE_LABEL[x.where], x.energy, x.contact ? 'rough contact wrestling' : '', 'play dad mom nanna amma together game'),
    })),
  );
}

const BASE = import.meta.env.BASE_URL;

/** File stem shared by an entry's card and thumbnail. */
export const cardId = (key: string) => key.replace(/\//g, '--');
/** The 560-wide card picture: hub cards are at most ~290 CSS px wide. */
export const cardSrc = (key: string) => `${BASE}cards/${cardId(key)}.webp`;
/** The 120-wide thumbnail for directory rows and the Everything list. */
export const thumbSrc = (key: string) => `${BASE}thumbs/${cardId(key)}.webp`;

function langEntries(): Entry[] {
  const say = MOMENTS.map((m) => ({
    key: `langs/say/${m.id}`,
    part: 'langs' as const,
    kind: 'Telugu & Tamil' as const,
    group: 'say',
    groupTitle: 'Say it together',
    title: m.title,
    hook: m.hook,
    href: `#/langs/say/${m.id}`,
    art: `art/langs/${m.id}.png`,
    time: '2 min',
    adult: 'With Amma or Nanna',
    search: words(m.title, m.hook, WHEN_LABEL[m.when], m.grownUp.flatMap((p) => [p.te.roman, p.ta.roman, p.te.means]), 'telugu tamil language say'),
  }));
  const sing = RHYMES.map((r) => ({
    key: `langs/rhyme/${r.id}`,
    part: 'langs' as const,
    kind: 'Telugu & Tamil' as const,
    group: 'sing',
    groupTitle: 'Sing',
    title: `${r.title.roman} (${r.lang === 'te' ? 'Telugu' : 'Tamil'})`,
    hook: r.title.means,
    href: `#/langs/rhyme/${r.id}`,
    art: `art/langs/${r.id}.png`,
    time: '3 min',
    adult: r.lang === 'te' ? 'With Nanna' : 'With Amma',
    search: words(r.title.roman, r.title.means, r.lang === 'te' ? 'telugu' : 'tamil', 'rhyme song sing'),
  }));
  const read = LANG_BOOKS.map((b) => ({
    key: `langs/book/${b.id}`,
    part: 'langs' as const,
    kind: 'Telugu & Tamil' as const,
    group: 'read',
    groupTitle: 'Read together',
    title: `${b.title.te.roman} / ${b.title.ta.roman}`,
    hook: b.hook,
    href: `#/langs/book/${b.id}/1`,
    art: `art/langs/${b.id}/page-1.png`,
    time: '5 min',
    adult: 'Read aloud together',
    search: words(b.title.te.roman, b.title.ta.roman, b.title.te.means, b.hook, 'telugu tamil book read'),
  }));
  const more = [
    { key: 'langs/words', title: 'Words and listening', hook: `${WORDS.length} picture words and a listening game`, href: '#/langs/words', art: WORDS[0] ? `art/langs/words/${WORDS[0].id}.png` : undefined },
    { key: 'langs/guide', title: 'Keeping two languages going', hook: 'A research-based guide for Amma and Nanna', href: '#/langs/guide', art: undefined },
    { key: 'langs/record', title: 'Record voices', hook: 'Record your Telugu and Tamil for the speaker buttons', href: '#/langs/record', art: undefined },
  ].map((x) => ({ ...x, part: 'langs' as const, kind: 'Telugu & Tamil' as const, group: 'more', groupTitle: 'Words and grown-ups', time: undefined, adult: 'For grown-ups', search: words(x.title, x.hook, 'telugu tamil') }));
  return [...say, ...sing, ...read, ...more];
}

/** Every item in the centre, in the order the hubs show them. */
export const ENTRIES: readonly Entry[] = [
  ...bookEntries(),
  ...situationEntries(),
  ...libraryEntries(),
  ...gameEntries('maths'),
  ...gameEntries('science'),
  ...activityEntries(),
  ...ideaEntries(),
  ...langEntries(),
];

/**
 * The directory under the five doors on home: every part, every group, every
 * item — except the Big Library, whose 193 stories stand as their six subjects.
 */
export function directory(): ReadonlyArray<{ readonly part: (typeof PARTS)[number]; readonly groups: readonly Group[] }> {
  const by = (part: Part, group: string) => ENTRIES.filter((e) => e.part === part && e.group === group);
  const stories: Group[] = [
    ...SHELVES.map((s) => ({ part: 'stories' as const, id: s.id, title: s.title, line: s.line, entries: by('stories', s.id) })),
    { part: 'stories', id: 'situations', title: 'Try a Situation', line: 'Short exercises from the same moments as the family books.', entries: by('stories', 'situations') },
    {
      part: 'stories',
      id: 'library',
      title: 'The Big Library',
      line: `${ARCHIVE.length} longer true read-alouds, by subject.`,
      entries: SUBJECTS.map((sub) => ({
        key: `library/${sub.id}`,
        part: 'stories' as const,
        kind: 'Longer read-aloud' as const,
        group: 'library',
        groupTitle: 'The Big Library',
        title: `${sub.title} (${storiesIn(sub.id).length})`,
        hook: sub.line,
        href: `#/library/${sub.id}`,
        art: storiesIn(sub.id)[0] ? `art/${storiesIn(sub.id)[0].slug}/cover.png` : undefined,
        adult: 'Read aloud together',
        search: words(sub.title, sub.line),
      })),
    },
  ];
  const groupsOf = (part: Part, list: ReadonlyArray<{ id: string; title: string; line: string }>): Group[] =>
    list.map((g) => ({ part, id: g.id, title: g.title, line: g.line, entries: by(part, g.id) })).filter((g) => g.entries.length > 0);
  const groups: Record<Part, Group[]> = {
    stories,
    maths: groupsOf('maths', MATHS_GROUPS),
    science: groupsOf('science', SCIENCE_GROUPS),
    make: groupsOf('make', MAKE_AREAS),
    together: groupsOf('together', PLAY_GROUPS),
    langs: groupsOf('langs', [
      { id: 'say', title: 'Say it together', line: 'Routine and play moments in both languages.' },
      { id: 'sing', title: 'Sing', line: 'Traditional Telugu and Tamil rhymes.' },
      { id: 'read', title: 'Read together', line: 'Picture books told in Telugu and in Tamil.' },
      { id: 'more', title: 'Words and grown-ups', line: 'Picture words, the guide, and recording.' },
    ]),
  };
  return PARTS.map((p) => ({ part: p, groups: groups[p.id] }));
}

/** How many things each part holds, for the door labels and the grown-ups note. */
export function counts(): Record<Part, number> {
  const c = { stories: 0, maths: 0, science: 0, make: 0, together: 0, langs: 0 } as Record<Part, number>;
  for (const e of ENTRIES) c[e.part] += 1;
  return c;
}

export { BOOKS };
