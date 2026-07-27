import { useState } from 'react';
import { CATEGORY_LABEL, CATEGORY_ORDER, SUBJECT_DETAILS } from '../data/meta';
import { COLLECTION, era } from '../data/collection';
import type { StoryDomain } from '../types';
import { RikkiMascot } from './RikkiMascot';

const NOTES = [
  'The word mathematics comes from an ancient Greek word meaning learning or knowledge.',
  'Honeybees use a waggle dance to show their hive-mates where flowers are growing.',
  'A shadow changes size when an object moves closer to or farther from a light.',
  'The North Star has helped travelers find north for hundreds of years.',
  'Plants can bend toward light because the cells on their darker side grow longer.',
] as const;

export interface LearningCenterWelcomeProps {
  readonly historicalCount: number;
  readonly onOpenLibrary: () => void;
  readonly onPlay?: () => void;
  readonly onMakeStory?: () => void;
  readonly onExploreSubject: (domain: StoryDomain) => void;
}

export function LearningCenterWelcome({
  historicalCount,
  onOpenLibrary,
  onPlay,
  onMakeStory,
  onExploreSubject,
}: LearningCenterWelcomeProps) {
  const [factIndex, setFactIndex] = useState(0);

  return (
    <>
      <header className="learning-hero">
        <div className="learning-hero__copy">
          <p className="learning-hero__eyebrow">An illustrated field guide</p>
          <h1 className="learning-hero__title">Rikki&rsquo;s Field Guide</h1>
          <p className="learning-hero__lede">
            {COLLECTION.accounts} illustrated accounts of real people working
            something out &mdash; from {era(COLLECTION.earliestYear)} to{' '}
            {era(COLLECTION.latestYear)}, across {COLLECTION.places} places. Plus
            exercises in number, letter and feeling, and a workshop for composing
            your own.
          </p>
          <dl className="learning-hero__stats">
            <div><dt>Accounts</dt><dd>{COLLECTION.accounts}</dd></div>
            <div><dt>Places</dt><dd>{COLLECTION.places}</dd></div>
            <div><dt>Subjects</dt><dd>{COLLECTION.subjects}</dd></div>
            <div><dt>Deep time</dt><dd>{COLLECTION.deepTime}</dd></div>
          </dl>
          <button type="button" className="learning-hero__start" onClick={onOpenLibrary}>
            Open the library
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </div>
        <div className="learning-hero__mascot">
          <RikkiMascot />
        </div>
      </header>

      <section className="learning-zones" aria-label="Sections">
        <button
          type="button"
          className="learn-zone learn-zone--library"
          onClick={onOpenLibrary}
        >
          <span className="learn-zone__icon" aria-hidden="true">
            I
          </span>
          <span className="learn-zone__copy">
            <span className="learn-zone__kicker">Read</span>
            <span className="learn-zone__title" role="heading" aria-level={2}>
              Library
            </span>
            <span className="learn-zone__text">
              {historicalCount} accounts, arranged by shelf, timeline, map,
              subject or place.
            </span>
          </span>
          <span className="learn-zone__arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>

        {onPlay ? (
          <button
            type="button"
            className="learn-zone learn-zone--play"
            onClick={onPlay}
            aria-label="Open practice"
          >
            <span className="learn-zone__icon" aria-hidden="true">
              II
            </span>
            <span className="learn-zone__copy">
              <span className="learn-zone__kicker">Work</span>
              <span className="learn-zone__title" role="heading" aria-level={2}>
                Practice
              </span>
              <span className="learn-zone__text">
                45 exercises: place value, multiplication, fractions, letters
                and patterns, and what people do next.
              </span>
            </span>
            <span className="learn-zone__arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>
        ) : null}

        {onMakeStory ? (
          <button
            type="button"
            className="learn-zone learn-zone--make"
            onClick={onMakeStory}
            aria-label="Open the workshop"
          >
            <span className="learn-zone__icon" aria-hidden="true">
              III
            </span>
            <span className="learn-zone__copy">
              <span className="learn-zone__kicker">Compose</span>
              <span className="learn-zone__title" role="heading" aria-level={2}>
                Workshop
              </span>
              <span className="learn-zone__text">
                Name three or more things. The Loom composes an adventure that
                uses every one of them.
              </span>
            </span>
            <span className="learn-zone__arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>
        ) : null}
      </section>

      <aside className="fact-card" aria-labelledby="fact-title">
        <div className="fact-card__badge" aria-hidden="true">
          &sect;
        </div>
        <div className="fact-card__copy">
          <p id="fact-title" className="fact-card__title">
            From the notebook
          </p>
          <p className="fact-card__fact" aria-live="polite">
            {NOTES[factIndex]}
          </p>
        </div>
        <button
          type="button"
          className="fact-card__next"
          onClick={() => setFactIndex((current) => (current + 1) % NOTES.length)}
        >
          Next note
        </button>
      </aside>

      <section className="subject-zone" aria-labelledby="subject-zone-title">
        <div className="subject-zone__head">
          <div>
            <p className="subject-zone__eyebrow">Index</p>
            <h2 id="subject-zone-title" className="subject-zone__title">
              By subject
            </h2>
          </div>
          <p className="subject-zone__lede">
            Choose a subject to see every account that touches it.
          </p>
        </div>
        <div className="subject-grid">
          {CATEGORY_ORDER.map((domain) => {
            const detail = SUBJECT_DETAILS[domain];
            return (
              <button
                key={domain}
                type="button"
                className="subject-card"
                onClick={() => onExploreSubject(domain)}
                aria-label={`${CATEGORY_LABEL[domain]} — see accounts`}
                style={({ ['--subject-accent' as string]: detail.color })}
              >
                <span className="subject-card__icon" aria-hidden="true">
                  {detail.icon}
                </span>
                <span className="subject-card__label">{CATEGORY_LABEL[domain]}</span>
                <span className="subject-card__prompt">{detail.prompt}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default LearningCenterWelcome;
