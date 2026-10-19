import type { ReactNode } from 'react';
import { Card, Page } from './Page';
import { GrownUps } from './GrownUps';
import type { GrownUpNote } from '../notes/types';
import { BOOKS, SHELVES, booksOn, getShelf } from '../books/registry';
import { artSrc } from '../books/BookReader';
import type { ShelfId } from '../books/types';
import { SITUATIONS } from './situations';
import { ARCHIVE, CURATED_ARCHIVE, LIBRARY_NOTE, SUBJECTS, archiveStory, storiesIn } from './library';
import { MATHS_GAMES, MATHS_GROUPS } from '../maths/registry';
import { SCIENCE_GAMES, SCIENCE_GROUPS } from '../science/registry';
import { ACTIVITIES } from '../make/activities';
import { playedBefore } from '../play/progress';
import type { AnyGame } from '../play/types';

const BASE = import.meta.env.BASE_URL;

/* ------------------------------------------------------------------ home --- */

const HOME_NOTE: GrownUpNote = {
  what: "Rikki's Learning Center has four parts: picture books and read-alouds (Stories), maths games, science games that ask him to predict before he looks, and things to make and do together away from the screen.",
  expect: 'He can choose by picture alone. Every game and book has a "For grown-ups" note like this one, in the same top-right place, saying what it is for and what to watch for.',
  practising: 'Reading together, mathematical and scientific reasoning, and the everyday social situations of a five-year-old with a two-year-old sister.',
  ask: '"Which one do you want to show me?" — let him lead you to something he has done before.',
  next: 'Make & Do is designed to be the end of a session: something real, with your hands, after the screen.',
  honest: 'Nothing here is scored and nothing claims mastery. Games stop after five problems on purpose. The best of it happens when you are sitting next to him.',
};

const QUADS: ReadonlyArray<{ id: 'stories' | 'maths' | 'science' | 'make'; name: string; href: string; art: string; badge?: string }> = [
  { id: 'stories', name: 'Stories', href: '#/stories', art: 'art/hubs/stories.webp' },
  { id: 'maths', name: 'Maths', href: '#/maths', art: 'art/hubs/maths.webp' },
  { id: 'science', name: 'Science', href: '#/science', art: 'art/hubs/science.webp' },
  { id: 'make', name: 'Make & Do', href: '#/make', art: 'art/hubs/make.webp', badge: 'With a grown-up' },
];

export function Home() {
  return (
    <main id="main-content" className="lc-page" tabIndex={-1}>
      <header className="lc-top">
        <span className="lc-top__spacer" />
        <GrownUps note={HOME_NOTE} title="Rikki's Learning Center" />
      </header>
      <div className="home__hello">
        <div>
          <h1 className="home__name">
            Rikki&rsquo;s <span>Learning Center</span>
          </h1>
          <p className="home__sub">Books, maths, science, and things to make. Pick one.</p>
        </div>
      </div>
      <nav className="quad" aria-label="Choose">
        {QUADS.map((q) => (
          <a key={q.id} className={`quad__card quad__card--${q.id}`} href={q.href}>
            <span className="quad__art" style={{ backgroundImage: `url(${BASE}${q.art})` }} aria-hidden="true" />
            <span className="quad__label">
              <span className="quad__name">{q.name}</span>
              {q.badge ? <span className="quad__badge">{q.badge}</span> : null}
            </span>
          </a>
        ))}
      </nav>
    </main>
  );
}

/* --------------------------------------------------------------- stories --- */

const STORIES_NOTE: GrownUpNote = {
  what: 'Six shelves: picture books about Arjun and his family and friends, tales from India, festivals at home, how things work, people and discoveries, and the Big Library of longer true read-alouds.',
  expect: 'The picture books are for reading aloud together in about five minutes each. He can follow the story from the pictures; you read the words.',
  practising: 'Listening to a story with a problem and a turn; talking about what a character felt and chose.',
  ask: '"What do you think happens next?" — once, at the turning point, not on every page.',
  next: 'Every family and science book ends with an optional Try-this card for later.',
  honest: 'Reading levels follow a developmental advisor\'s guidance (15 to 35 words a page for reading aloud). They are written to be read TO him, not BY him.',
};

const SHELF_ART: Record<string, string> = {
  family: 'art/hubs/shelf-family.webp',
  tales: 'art/hubs/shelf-tales.webp',
  festivals: 'art/hubs/shelf-festivals.webp',
  how: 'art/hubs/shelf-how.webp',
  people: 'art/hubs/shelf-people.webp',
  library: 'art/hubs/shelf-library.webp',
};

export function Stories({ page }: { readonly page: number }) {
  const shelves: ReadonlyArray<{ id: string; title: string; line: string; href: string }> = [
    ...SHELVES.map((s) => ({ id: s.id, title: s.title, line: s.line, href: `#/stories/${s.id}` })),
    { id: 'library', title: 'The Big Library', line: `${ARCHIVE.length} longer true read-alouds, by subject.`, href: '#/library' },
  ];
  const shown = page === 2 ? shelves.slice(4) : shelves.slice(0, 4);
  return (
    <Page title="Stories" back={{ href: '#/', label: 'Home' }} note={STORIES_NOTE} band="stories" expect="Picture books for reading aloud together, about five minutes each.">
      <div className="cards cards--four">
        {shown.map((s) => (
          <Card key={s.id} href={s.href} title={s.title} hook={s.line} art={`${BASE}${SHELF_ART[s.id]}`} tone="stories" />
        ))}
      </div>
      <nav className="pager" aria-label="More shelves">
        {page === 2 ? (
          <a className="btn btn--big" href="#/stories">
            <span aria-hidden="true">←</span> First shelves
          </a>
        ) : (
          <a className="btn btn--big btn--primary" href="#/stories?p=2">
            More shelves <span aria-hidden="true">→</span>
          </a>
        )}
      </nav>
    </Page>
  );
}

const read = (key: string) => {
  try {
    return window.localStorage.getItem(`rlc/read/${key}`) === '1';
  } catch {
    return false;
  }
};
export const markRead = (key: string) => {
  try {
    window.localStorage.setItem(`rlc/read/${key}`, '1');
  } catch {
    /* a blocked store only costs the tick */
  }
};

export function ShelfPage({ shelf }: { readonly shelf: ShelfId }) {
  const s = getShelf(shelf)!;
  const books = booksOn(shelf);
  return (
    <Page title={s.title} back={{ href: '#/stories', label: 'Stories' }} note={s.note} band="stories" expect={s.line}>
      <section className="hub__group" aria-label="Books">
        <div className="cards">
          {books.map((b) => (
            <Card
              key={b.slug}
              href={`#/book/${b.slug}/1`}
              title={b.title}
              hook={b.hook}
              art={artSrc(b.slug, 'cover')}
              tone="stories"
              tick={read(`book/${b.slug}`) ? 'Read before' : null}
            />
          ))}
        </div>
      </section>
      {shelf === 'family' ? (
        <section className="hub__group" aria-labelledby="situations">
          <div className="hub__group-head">
            <h2 id="situations" className="hub__group-title">Try a situation</h2>
            <p className="hub__group-line">Short exercises built from the same moments as the books.</p>
          </div>
          <div className="cards">
            {SITUATIONS.map((x) => (
              <Card
                key={x.id}
                href={`#/situation/${x.id}`}
                title={x.title}
                hook={x.hook}
                art={`${BASE}games/covers/${x.id}.png`}
                tone="stories"
                tag="Try a situation"
                tick={playedBefore(`sel/${x.id}`) || read(`sel/${x.id}`) ? 'Played before' : null}
              />
            ))}
          </div>
        </section>
      ) : null}
      {shelf === 'people' ? (
        <section className="hub__group" aria-labelledby="longer">
          <div className="hub__group-head">
            <h2 id="longer" className="hub__group-title">Longer read-alouds</h2>
            <p className="hub__group-line">True stories from the Big Library about thinkers in India and around the world.</p>
          </div>
          <div className="cards">
            {CURATED_ARCHIVE.map((slug) => archiveStory(slug)).filter(Boolean).map((st) => (
              <Card
                key={st!.slug}
                href={`#/read/${st!.slug}/1`}
                title={st!.title}
                hook={st!.subtitle}
                art={`${BASE}art/${st!.slug}/cover-560.webp`}
                tone="stories"
                tag="Longer read-aloud"
                tick={read(`read/${st!.slug}`) ? 'Read before' : null}
              />
            ))}
          </div>
        </section>
      ) : null}
    </Page>
  );
}

export function LibraryPage() {
  return (
    <Page title="The Big Library" back={{ href: '#/stories', label: 'Stories' }} note={LIBRARY_NOTE} band="stories" expect="Longer true stories to read aloud, one or two a night.">
      <div className="cards">
        {SUBJECTS.map((s) => {
          const first = storiesIn(s.id)[0];
          return (
            <Card
              key={s.id}
              href={`#/library/${s.id}`}
              title={s.title}
              hook={`${storiesIn(s.id).length} stories. ${s.line}`}
              art={first ? `${BASE}art/${first.slug}/cover-560.webp` : undefined}
              tone="stories"
            />
          );
        })}
      </div>
    </Page>
  );
}

export function SubjectPage({ subject }: { readonly subject: string }) {
  const s = SUBJECTS.find((x) => x.id === subject)!;
  const list = storiesIn(subject);
  return (
    <Page title={s.title} back={{ href: '#/library', label: 'The Big Library' }} note={LIBRARY_NOTE} band="stories" expect={s.line}>
      <div className="cards">
        {list.map((st) => (
          <Card
            key={st.slug}
            href={`#/read/${st.slug}/1`}
            title={st.title}
            hook={st.subtitle}
            art={`${BASE}art/${st.slug}/cover-560.webp`}
            tone="stories"
            tag="Longer read-aloud"
            tick={read(`read/${st.slug}`) ? 'Read before' : null}
          />
        ))}
      </div>
    </Page>
  );
}

/* ----------------------------------------------------------- game hubs ---- */

function GameHub({
  title,
  games,
  groups,
  tone,
  base,
  note,
  expect,
  glyph,
}: {
  readonly title: string;
  readonly games: readonly AnyGame[];
  readonly groups: ReadonlyArray<{ id: string; title: string; line: string }>;
  readonly tone: 'maths' | 'science';
  readonly base: string;
  readonly note: GrownUpNote;
  readonly expect: string;
  readonly glyph: (g: AnyGame) => ReactNode;
}) {
  return (
    <Page title={title} back={{ href: '#/', label: 'Home' }} note={note} band={tone} expect={expect}>
      {groups.map((grp) => {
        const list = games.filter((g) => g.group === grp.id);
        if (list.length === 0) return null;
        return (
          <section key={grp.id} className="hub__group" aria-labelledby={`grp-${grp.id}`}>
            <div className="hub__group-head">
              <h2 id={`grp-${grp.id}`} className="hub__group-title">{grp.title}</h2>
              <p className="hub__group-line">{grp.line}</p>
            </div>
            <div className="cards">
              {list.map((g) => (
                <Card
                  key={g.id}
                  href={`#/${base}/${g.id}`}
                  title={g.title}
                  hook={g.hook}
                  art={g.cover ? `${BASE}${g.cover.replace(/\.png$/, '.webp')}` : undefined}
                  glyph={glyph(g)}
                  tone={tone}
                  tick={playedBefore(g.id) ? 'Played before' : null}
                />
              ))}
            </div>
          </section>
        );
      })}
    </Page>
  );
}

const MATHS_NOTE: GrownUpNote = {
  what: 'Maths games he does with his hands: building numbers from tens and ones, loading a balance, filling nests with equal groups, cutting a roti fairly, measuring a dinosaur in blocks. Each has three levels.',
  expect: 'A set is five problems, about five minutes, then the game stops and says "Done for now". If he gets four of the last five right first time, the next set starts a level higher; two misses in a row and it steps down. He can also press a level himself.',
  practising: 'Place value, equality as balance, part-whole thinking, equal groups and sharing, fractions as equal parts, measuring, shapes, patterns, chance and charts — the ideas that later maths is built on.',
  ask: '"How did you know?" after a right answer — the strategy matters more than the number.',
  next: 'Each game\'s note has an off-screen version with things you have at home. Do that one next.',
  honest: 'There are no scores or stars on purpose. Getting a game right on screen is evidence, not proof: check the same idea with real objects before deciding he "has it".',
};

const SCIENCE_NOTE: GrownUpNote = {
  what: 'Science games that ask him to predict before he looks: will it float, which one lands first, which way will the beam tip. He taps a guess, presses Try, and sees what happens beside the picture he started from.',
  expect: 'He will often predict wrong — that is the point. Most of these are built around a common wrong idea (heavy things sink, heavy things fall faster). A wrong prediction is never marked wrong; the evidence does the work.',
  practising: 'Making a prediction, comparing it with evidence, and changing his mind. The physics ideas: friction, gravity and air, stored energy, levers and balance, floating, sound, light and shadow, magnets, heat, day and night, scale, and what seeds need.',
  ask: '"What made you think that?" before Try, and "What surprised you?" after.',
  next: 'Every science game has a matching Make & Do activity. The real version is the lesson; the screen is the warm-up.',
  honest: 'A picture can only show what happens; it cannot let him feel it. These are static pictures, not simulations, and they simplify the physics.',
};

export function MathsHub() {
  return (
    <GameHub
      title="Maths"
      games={MATHS_GAMES}
      groups={MATHS_GROUPS}
      tone="maths"
      base="maths"
      note={MATHS_NOTE}
      expect="Five problems a set, three levels, no scores. He can start anywhere."
      glyph={() => <GlyphNumber />}
    />
  );
}

export function ScienceHub() {
  return (
    <GameHub
      title="Science"
      games={SCIENCE_GAMES}
      groups={SCIENCE_GROUPS}
      tone="science"
      base="science"
      note={SCIENCE_NOTE}
      expect="Guess first, then Try, then see why. Three investigations a set."
      glyph={() => <GlyphFlask />}
    />
  );
}

/* --------------------------------------------------------------- make ----- */

const MAKE_NOTE: GrownUpNote = {
  what: 'Things to do together off the screen: in the kitchen, at the table, in the garden and outdoors. Each card lists what you need, the steps with pictures, what to notice and one question.',
  expect: 'Most take 10 to 30 minutes with household things. He will want to do the "fun" step (the drop, the float) over and over — let him, and count.',
  practising: 'The same ideas as the maths and science games, with real materials: floating, shadows, seeds, ramps, balance, magnets, measuring, symmetry, sorting and charts.',
  ask: 'Each card has its own question.',
  next: 'Write down or draw what happened, and try again tomorrow with one thing changed.',
  honest: 'These need you. Each card has a safety line; follow it, and keep small parts away from the two-year-old.',
};

export function MakeHub() {
  return (
    <Page title="Make & Do" back={{ href: '#/', label: 'Home' }} note={MAKE_NOTE} band="make" expect="Real things to make together, away from the screen.">
      <div className="cards">
        {ACTIVITIES.map((a) => (
          <Card
            key={a.id}
            href={`#/make/${a.id}`}
            title={a.title}
            hook={a.hook}
            art={`${BASE}art/make/${a.id}/step-1.webp`}
            tone="make"
            tag={`${a.minutes} min · ${WHERE[a.where]}`}
            tick={read(`make/${a.id}`) ? 'Done before' : null}
          />
        ))}
      </div>
    </Page>
  );
}

const WHERE: Record<string, string> = { kitchen: 'Kitchen', garden: 'Garden', outdoors: 'Outdoors', table: 'At the table' };

/* ------------------------------------------------------------ glyphs ------ */

function GlyphNumber() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="18" y="20" width="16" height="60" rx="4" fill="var(--tens)" />
      <rect x="40" y="20" width="16" height="60" rx="4" fill="var(--tens)" />
      <rect x="64" y="64" width="16" height="16" rx="4" fill="var(--ones)" />
    </svg>
  );
}

function GlyphFlask() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M40 14h20v24l20 40a6 6 0 0 1-5 9H25a6 6 0 0 1-5-9l20-40z" fill="var(--science-tint)" stroke="var(--ink)" strokeWidth="4" />
      <path d="M28 70h44l5 9H23z" fill="var(--science)" />
    </svg>
  );
}

export { BOOKS };
