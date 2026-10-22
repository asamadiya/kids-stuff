import type { ReactNode } from 'react';
import { useStored } from './scroll';
import { Card, CardGroup, GroupJumps, Page, jump } from './Page';
import { GrownUps } from './GrownUps';
import type { GrownUpNote } from '../notes/types';
import { booksOn, getShelf } from '../books/registry';
import type { ShelfId } from '../books/types';
import { SITUATIONS } from './situations';
import type { Story } from '../types';
import { ARCHIVE, CURATED_ARCHIVE, LIBRARY_NOTE, SUBJECTS, archiveLabel, archiveStory, storiesIn } from './library';
import { MATHS_GAMES, MATHS_GROUPS } from '../maths/registry';
import { SCIENCE_GAMES, SCIENCE_GROUPS } from '../science/registry';
import { ACTIVITIES, MAKE_AREAS } from '../make/activities';
import { playedBefore } from '../play/progress';
import type { AnyGame } from '../play/types';
import { ENTRIES, PARTS, cardSrc, counts, directory, thumbSrc } from './catalog';
import type { Entry, Part } from './catalog';

/**
 * The listing screens: home, the five part hubs, the shelves and the library.
 *
 * The parent, after living with the first version: "Hard to navigate. Too many
 * clicks to get a view of what the site contains." Every listing showed four
 * cards and a More button (an earlier advisor ruling), Stories was split over
 * two pages, and the library sat three levels down. Now (advisor q7 rulings
 * 1-3): home shows five picture doors and, under them, the whole contents as
 * linked titles; every hub shows all of its groups and all of their items;
 * the part navigation sits on every listing.
 */

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

/** "Read before" / "Played before" / "Done before", by the kind of thing. */
function tickFor(e: Entry): string | null {
  switch (e.kind) {
    case 'Picture book':
    case 'Longer read-aloud':
      return read(e.key) ? 'Read before' : null;
    case 'Situation':
      return playedBefore(e.key) || read(e.key) ? 'Played before' : null;
    case 'Maths game':
    case 'Science game':
      return playedBefore(e.key.split('/')[1]) ? 'Played before' : null;
    case 'Make & Do':
    case 'Play together':
      return read(e.key) ? 'Done before' : null;
  }
}

const tagFor = (e: Entry) =>
  e.kind === 'Longer read-aloud' ? archiveLabel(e.key.split('/')[1]) : e.where ? `${e.time} · ${e.where}` : e.time;

function EntryCard({ e, tone }: { readonly e: Entry; readonly tone?: Part }) {
  return <Card href={e.href} title={e.title} hook={e.hook} art={e.art ? cardSrc(e.key) : undefined} tone={tone ?? e.part} tag={tagFor(e)} tick={tickFor(e)} />;
}

/* ------------------------------------------------------------------ home --- */

const HOME_NOTE: GrownUpNote = {
  what: "Rikki's Learning Center has five parts: picture books and read-alouds (Stories), maths games, science games that ask him to predict before he looks, Make & Do (things to make together away from the screen), and Play with Dad & Mom (fifty games for the two of you with things already in the house).",
  expect: 'He can choose by picture alone from the five doors. Everything in the centre is listed under them, by part and group, so you can see it all on one page; Everything (top right) searches it, including the 193 longer read-alouds. Every item has a note like this one.',
  practising: 'Reading together, mathematical and scientific reasoning, making and testing things, and playing together: the everyday life of a five-year-old with a two-year-old sister.',
  ask: '"Which one do you want to show me?" — let him lead you to something he has done before.',
  next: 'Make & Do and Play with Dad & Mom are meant to end a session: something real, with your hands, after the screen.',
  honest: 'Nothing here is scored and nothing claims mastery. Games stop after five problems on purpose. The best of it happens when you are sitting next to him.',
};

export function Home() {
  const dir = directory();
  const n = counts();
  return (
    <main id="main-content" className="lc-page lc-page--home" tabIndex={-1}>
      <header className="lc-top lc-top--home">
        <h1 className="home__name">
          Rikki&rsquo;s <span>Learning Center</span>
        </h1>
        <div className="lc-top__tools">
          <a className="everything-link" href="#/all">
            <SearchGlyph />
            <span className="everything-link__label">Everything</span>
          </a>
          <GrownUps note={HOME_NOTE} title="Rikki's Learning Center" />
        </div>
      </header>
      <nav className="doors" aria-label="Choose">
        {PARTS.map((p) => (
          <a key={p.id} className={`door door--${p.id}`} href={p.href}>
            <span className="door__art" aria-hidden="true">
              <img src={cardSrc(`hub/${p.id}`)} alt="" width={560} height={436} decoding="async" />
            </span>
            <span className="door__label">
              <span className="door__name">{p.name}</span>
              <span className="door__meta">
                {n[p.id]} {p.id === 'stories' ? 'things to read' : p.id === 'together' ? 'ways to play' : p.id === 'make' ? 'things to make' : 'games'}
                {p.badge ? <span className="door__badge">{p.badge}</span> : null}
              </span>
            </span>
          </a>
        ))}
      </nav>

      <section className="dir" aria-labelledby="dir-title">
        <div className="dir__head">
          <h2 id="dir-title" className="dir__title">Everything here</h2>
          <nav className="dir__jumps" aria-label="Jump to a part">
            {PARTS.map((p) => (
              <a key={p.id} href={`#d-${p.id}`} className={`dir__jump dir__jump--${p.id}`} onClick={(e) => jump(e, `d-${p.id}`)}>
                {p.name}
              </a>
            ))}
          </nav>
        </div>
        {dir.map(({ part, groups }) => (
          <section key={part.id} id={`d-${part.id}`} className={`dir__part dir__part--${part.id}`} aria-labelledby={`dh-${part.id}`}>
            <h3 id={`dh-${part.id}`} className="dir__part-title">
              <a href={part.href}>{part.name}</a>
              <span className="dir__part-n">{n[part.id]}</span>
            </h3>
            <div className="dir__groups">
              {groups.map((g) => (
                <section key={g.id} className="dir__group" aria-label={g.title}>
                  <h4 className="dir__group-title">{g.title}</h4>
                  <ul className="dir__list">
                    {g.entries.map((e) => (
                      <li key={e.key}>
                        <a className="dir__item" href={e.href}>
                          {e.art ? <img className="dir__thumb" src={thumbSrc(e.key)} alt="" width={64} height={50} loading="lazy" decoding="async" /> : <span className="dir__thumb" />}
                          <span className="dir__item-title">{e.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <path d="m15 15 5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------------------------------------- stories --- */

const STORIES_NOTE: GrownUpNote = {
  what: 'Every story in one place: picture books about Arjun and his family and friends, tales from India, festivals at home, how things work, and people and discoveries; the Try a Situation exercises; and the Big Library of longer true read-alouds, by subject.',
  expect: 'The picture books are for reading aloud together in about five minutes each. He can follow the story from the pictures; you read the words.',
  practising: 'Listening to a story with a problem and a turn; talking about what a character felt and chose.',
  ask: '"What do you think happens next?" — once, at the turning point, not on every page.',
  next: 'Every family and science book ends with an optional Try-this card for later.',
  honest: "Reading levels follow a developmental advisor's guidance (15 to 35 words a page for reading aloud). They are written to be read TO him, not BY him.",
};

export function Stories() {
  const groups = directory().find((d) => d.part.id === 'stories')!.groups;
  return (
    <Page title="Stories" back={null} part="stories" note={STORIES_NOTE} expect="Picture books for reading aloud together, about five minutes each.">
      <GroupJumps groups={groups.map((g) => ({ id: g.id, title: g.title, n: g.id === 'library' ? ARCHIVE.length : g.entries.length }))} />
      {groups.map((g) => (
        <CardGroup key={g.id} id={g.id} title={g.title} line={g.line}>
          {g.entries.map((e) => (g.id === 'library' ? <Card key={e.key} href={e.href} title={e.title} hook={e.hook} art={e.art ? cardSrc(e.key) : undefined} tone="stories" /> : <EntryCard key={e.key} e={e} />))}
        </CardGroup>
      ))}
      <p className="hub__more">
        <a className="btn" href="#/library">
          Open the Big Library <span aria-hidden="true">→</span>
        </a>
      </p>
    </Page>
  );
}

export function ShelfPage({ shelf }: { readonly shelf: ShelfId }) {
  const s = getShelf(shelf)!;
  const books = booksOn(shelf);
  return (
    <Page title={s.title} back={{ href: '#/stories', label: 'Stories' }} part="stories" note={s.note} expect={s.line}>
      <CardGroup id="books" title="Books">
        {books.map((b) => (
          <EntryCard key={b.slug} e={entryFor(`book/${b.slug}`)} />
        ))}
      </CardGroup>
      {shelf === 'family' ? (
        <CardGroup id="situations" title="Try a Situation" line="Short exercises built from the same moments as the books.">
          {SITUATIONS.map((x) => (
            <EntryCard key={x.id} e={entryFor(`sel/${x.id}`)} />
          ))}
        </CardGroup>
      ) : null}
      {shelf === 'people' ? (
        <CardGroup id="longer" title="Longer read-alouds" line="True stories from the Big Library about thinkers in India and around the world.">
          {CURATED_ARCHIVE.map((slug) => archiveStory(slug))
            .filter((st): st is Story => st !== undefined)
            .map((st) => (
              <EntryCard key={st.slug} e={entryFor(`read/${st.slug}`)} />
            ))}
        </CardGroup>
      ) : null}
    </Page>
  );
}

export function LibraryPage() {
  return (
    <Page title="The Big Library" back={{ href: '#/stories', label: 'Stories' }} part="stories" note={LIBRARY_NOTE} expect="Longer read-alouds, one or two a night." lede={`${ARCHIVE.length} longer read-alouds about people who measured, counted, built and found the way. Every story is listed below by subject.`}>
      <GroupJumps groups={SUBJECTS.map((s) => ({ id: s.id, title: s.title, n: storiesIn(s.id).length }))} />
      {SUBJECTS.map((s) => (
        <CardGroup key={s.id} id={s.id} title={s.title} line={s.line}>
          {storiesIn(s.id).map((st) => (
            <EntryCard key={st.slug} e={entryFor(`read/${st.slug}`)} />
          ))}
        </CardGroup>
      ))}
    </Page>
  );
}

export function SubjectPage({ subject }: { readonly subject: string }) {
  const s = SUBJECTS.find((x) => x.id === subject)!;
  return (
    <Page title={s.title} back={{ href: '#/library', label: 'The Big Library' }} part="stories" note={LIBRARY_NOTE} expect={s.line}>
      <CardGroup id={s.id} title={`${storiesIn(subject).length} stories`} line={s.line}>
        {storiesIn(subject).map((st) => (
          <EntryCard key={st.slug} e={entryFor(`read/${st.slug}`)} />
        ))}
      </CardGroup>
    </Page>
  );
}

/* ----------------------------------------------------------- game hubs ---- */

function GameHub({
  title,
  games,
  groups,
  tone,
  note,
  expect,
  glyph,
}: {
  readonly title: string;
  readonly games: readonly AnyGame[];
  readonly groups: ReadonlyArray<{ id: string; title: string; line: string }>;
  readonly tone: 'maths' | 'science';
  readonly note: GrownUpNote;
  readonly expect: string;
  readonly glyph: () => ReactNode;
}) {
  const live = groups.map((g) => ({ ...g, list: games.filter((x) => x.group === g.id) })).filter((g) => g.list.length > 0);
  return (
    <Page title={title} back={null} part={tone} note={note} expect={expect}>
      <GroupJumps groups={live.map((g) => ({ id: g.id, title: g.title, n: g.list.length }))} />
      {live.map((grp) => (
        <CardGroup key={grp.id} id={grp.id} title={grp.title} line={grp.line}>
          {grp.list.map((g) => {
            const e = entryFor(`${tone}/${g.id}`);
            return <Card key={g.id} href={e.href} title={e.title} hook={e.hook} art={e.art ? cardSrc(e.key) : undefined} glyph={glyph()} tone={tone} tick={tickFor(e)} />;
          })}
        </CardGroup>
      ))}
    </Page>
  );
}

const MATHS_NOTE: GrownUpNote = {
  what: 'Maths games he does with his hands: building numbers from tens and ones, loading a balance, filling nests with equal groups, cutting a roti fairly, measuring a dinosaur in blocks. Each has three levels.',
  expect: 'A set is five problems, about five minutes, then the game stops and says "Done for now". If he gets four of the last five right first time, without pressing Help, the next set starts a level higher; two misses in a row and it steps down. He can also press a level himself.',
  practising: 'Place value, equality as balance, part-whole thinking, equal groups and sharing, fractions as equal parts, measuring, shapes, patterns, chance and charts — the ideas that later maths is built on.',
  ask: '"How did you know?" after a right answer — the strategy matters more than the number.',
  next: 'Each game\'s note has an off-screen version with things you have at home. Do that one next.',
  honest: 'There are no scores or stars on purpose. Getting a game right on screen is evidence, not proof: check the same idea with real objects before deciding he "has it".',
};

const SCIENCE_NOTE: GrownUpNote = {
  what: 'Science games that ask him to predict before he looks: will it float, which one lands first, which way will the beam tip. He taps a guess, presses Try, and sees what happens beside the picture he started from.',
  expect: 'He will often predict wrong — that is the point. Most of these are built around a common wrong idea (heavy things sink, heavy things fall faster). A wrong prediction is never marked wrong; the evidence does the work. Levels here change only when he or you choose one, since a guess right or wrong says little about understanding.',
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
      note={SCIENCE_NOTE}
      expect="Guess first, then Try, then see why. Three investigations a set."
      glyph={() => <GlyphFlask />}
    />
  );
}

/* --------------------------------------------------------------- make ----- */

const MAKE_NOTE: GrownUpNote = {
  what: 'Things to do together off the screen, grouped by the idea they are about: counting and measuring, shapes and patterns, forces, building, air, sound and light, water and weather, and kitchen changes. Each card lists what you need, the steps with pictures, what to notice, one question, and where it came from.',
  expect: 'Most take 10 to 30 minutes with household things; a few run over days. Try the tricky step yourself first: each card says what to check. He will want to repeat the "fun" step (the drop, the float, the note) over and over — let him, and count.',
  practising: 'The same ideas as the maths and science games, with real materials: floating, sound and vibration, air pushing back, light, evaporation, changes in materials, structures, balance and levers, measuring, sharing, patterns and maps.',
  ask: 'Each card has its own question.',
  next: 'Write down or draw what happened, and try again tomorrow with one thing changed.',
  honest: 'These need you, and household materials vary: steel that will not ring, cream that will not thicken, a puddle that dries before lunch. When a result surprises you both, that is the experiment working. Each card has a safety line; keep small parts, cords and water away from the two-year-old.',
};

const PLACES = ['kitchen', 'table', 'garden', 'outdoors'] as const;
const PLACE_LABEL: Record<(typeof PLACES)[number], string> = { kitchen: 'Kitchen', table: 'Table or floor', garden: 'Garden', outdoors: 'Outdoors' };

export function MakeHub() {
  const [place, onPlace] = useStored<string>('make/place', 'any');
  const fits = (a: (typeof ACTIVITIES)[number]) => place === 'any' || a.where === place || (a.places ?? []).includes(place as (typeof PLACES)[number]);
  const live = MAKE_AREAS.map((ar) => ({ ...ar, list: ACTIVITIES.filter((a) => a.area === ar.id && fits(a)) })).filter((g) => g.list.length > 0);
  return (
    <Page title="Make & Do" back={null} part="make" note={MAKE_NOTE} expect="Real things to make together, away from the screen." lede={`${ACTIVITIES.length} things to make and find out together, with what you already have at home.`}>
      <div className="filters" role="group" aria-label="Where">
        {(['any', ...PLACES] as const).map((p) => (
          <button key={p} type="button" className={`chip${place === p ? ' is-on' : ''}`} aria-pressed={place === p} onClick={() => onPlace(p)}>
            {p === 'any' ? 'Anywhere' : PLACE_LABEL[p]}
          </button>
        ))}
      </div>
      <GroupJumps groups={live.map((g) => ({ id: g.id, title: g.title, n: g.list.length }))} />
      {live.map((g) => (
        <CardGroup key={g.id} id={g.id} title={g.title} line={g.line}>
          {g.list.map((a) => (
            <EntryCard key={a.id} e={entryFor(`make/${a.id}`)} />
          ))}
        </CardGroup>
      ))}
    </Page>
  );
}

/* --------------------------------------------------------------- shared --- */

const BY_KEY: ReadonlyMap<string, Entry> = new Map(ENTRIES.map((e) => [e.key, e]));
const entryFor = (key: string): Entry => BY_KEY.get(key)!;

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


