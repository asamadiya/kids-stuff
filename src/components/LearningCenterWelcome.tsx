import { COLLECTION, era } from '../data/collection';
import { getStory } from '../stories';
import { PLAY_EXERCISE_IDS } from './PlayHub';
import { WORKSHOP_TOOL_IDS } from './WorkshopHub';
import { RikkiMascot } from './RikkiMascot';
import { PLAIN_ROUTES, toHash } from '../App';
import type { PlainRouteKind } from '../App';
import '../styles/library.css';
import '../styles/home.css';

/**
 * The cards were buttons before they were links; the stylesheet therefore never
 * suppressed the anchor underline that would now strike through every line of
 * card text. Declared once here rather than in eight places.
 */
const NO_UNDERLINE = { textDecoration: 'none' } as const;

/**
 * The index. Not the collection — the way into it.
 *
 * This screen renders no story tiles at all. Every one of the ways in is a real
 * anchor pointing at its own route, so the browser owns the history: a child
 * who takes a wrong turning gets out with one Back. The count of what is on the
 * shelves is stated here as a fact, and is read off the collection itself, so
 * it cannot drift from what is actually there.
 */

interface WayIn {
  readonly kind: PlainRouteKind;
  readonly numeral: string;
  readonly kicker: string;
  readonly label: string;
  readonly text: string;
  readonly tone: 'library' | 'play' | 'make';
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

function waysIn(): readonly WayIn[] {
  const ways: readonly Omit<WayIn, 'numeral'>[] = [
    {
      kind: 'shelf',
      kicker: 'Read',
      label: 'Shelf',
      text: `All ${COLLECTION.stories} accounts, in two groups: ${COLLECTION.accounts} real, ${COLLECTION.invented} invented.`,
      tone: 'library',
    },
    {
      kind: 'timeline',
      kicker: 'Read',
      label: 'Timeline',
      text: `The same accounts in order, from ${era(COLLECTION.earliestYear)} to ${era(COLLECTION.latestYear)}.`,
      tone: 'library',
    },
    {
      kind: 'map',
      kicker: 'Read',
      label: 'Map',
      text: `Where each one happened: ${COLLECTION.places} places on one chart.`,
      tone: 'library',
    },
    {
      kind: 'topics',
      kicker: 'Read',
      label: 'By subject',
      text: `${COLLECTION.subjects} subjects, from number to fossils. Each account belongs to one.`,
      tone: 'library',
    },
    {
      kind: 'places',
      kicker: 'Read',
      label: 'By place',
      text: `${COLLECTION.regions} regions of the world, each with its own accounts.`,
      tone: 'library',
    },
    {
      kind: 'play',
      kicker: 'Work',
      label: 'Practice',
      text: `${PLAY_EXERCISE_IDS.length} exercises: place value, multiplication, fractions, money, letters and patterns.`,
      tone: 'play',
    },
    {
      kind: 'make',
      kicker: 'Compose',
      label: 'Workshop',
      text: `${WORKSHOP_TOOL_IDS.length} instruments and the Story Loom. You supply the decisions.`,
      tone: 'make',
    },
  ];
  return ways.map((way, index) => ({ ...way, numeral: NUMERALS[index] ?? String(index + 1) }));
}

export interface Resume {
  readonly slug: string;
  readonly title: string;
  /** 0-based page index, as stored. */
  readonly page: number;
  readonly pageCount: number;
}

/**
 * The one story to offer to resume. Bookmarks are held in insertion order, so
 * the last usable entry is the most recently started story; a bookmark for a
 * story that no longer exists, or one past its end, is not offered at all.
 */
export function pickResume(bookmarks: ReadonlyMap<string, number>): Resume | null {
  let found: Resume | null = null;
  for (const [slug, page] of bookmarks) {
    const story = getStory(slug);
    if (!story) continue;
    if (!Number.isInteger(page) || page <= 0 || page >= story.pages.length) continue;
    found = { slug, title: story.title, page, pageCount: story.pages.length };
  }
  return found;
}

export interface LearningCenterWelcomeProps {
  readonly bookmarks: ReadonlyMap<string, number>;
}

export function LearningCenterWelcome({ bookmarks }: LearningCenterWelcomeProps) {
  const resume = pickResume(bookmarks);

  return (
    <main
      id="main-content"
      className="library"
      aria-label="Rikki's Field Guide"
      tabIndex={-1}
    >
      <header className="learning-hero">
        <div className="learning-hero__copy">
          <p className="learning-hero__eyebrow">An illustrated field guide</p>
          <h1 className="learning-hero__title">Rikki&rsquo;s Field Guide</h1>
          <p className="learning-hero__lede">
            How people worked things out, what they built, and how the numbers
            behind it are done.
          </p>
          <dl className="learning-hero__stats">
            <div>
              <dt>Accounts</dt>
              <dd>{COLLECTION.accounts}</dd>
            </div>
            <div>
              <dt>Places</dt>
              <dd>{COLLECTION.places}</dd>
            </div>
            <div>
              <dt>Subjects</dt>
              <dd>{COLLECTION.subjects}</dd>
            </div>
            <div>
              <dt>Deep time</dt>
              <dd>{COLLECTION.deepTime}</dd>
            </div>
          </dl>
        </div>
        <div className="learning-hero__mascot">
          <RikkiMascot />
        </div>
      </header>

      {resume ? (
        <aside className="fact-card" aria-labelledby="resume-title">
          <div className="fact-card__badge" aria-hidden="true">
            &para;
          </div>
          <div className="fact-card__copy">
            <p id="resume-title" className="fact-card__title">
              Where you stopped
            </p>
            <p className="fact-card__fact">
              {resume.title} &mdash; page {resume.page + 1} of {resume.pageCount}.
            </p>
          </div>
          <a
            className="fact-card__next"
            style={NO_UNDERLINE}
            href={toHash({ kind: 'reader', slug: resume.slug, page: resume.page })}
          >
            Carry on reading
          </a>
        </aside>
      ) : null}

      <nav className="learning-zones" aria-label="Ways in">
        {waysIn().map((way) => (
          <a
            key={way.kind}
            className={`learn-zone learn-zone--${way.tone}`}
            style={NO_UNDERLINE}
            href={toHash(PLAIN_ROUTES[way.kind])}
          >
            <span className="learn-zone__icon" aria-hidden="true">
              {way.numeral}
            </span>
            <span className="learn-zone__copy">
              <span className="learn-zone__kicker">{way.kicker}</span>
              <span className="learn-zone__title" role="heading" aria-level={2}>
                {way.label}
              </span>
              <span className="learn-zone__text">{way.text}</span>
            </span>
            <span className="learn-zone__arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        ))}
      </nav>
    </main>
  );
}

export default LearningCenterWelcome;
