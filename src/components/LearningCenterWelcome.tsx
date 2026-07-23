import { useState } from 'react';
import { CATEGORY_LABEL, CATEGORY_ORDER, SUBJECT_DETAILS } from '../data/meta';
import type { StoryDomain } from '../types';
import { RikkiMascot } from './RikkiMascot';

const FACTS = [
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
          <p className="learning-hero__eyebrow">Read, wonder, make, and play</p>
          <h1 className="learning-hero__title">Rikki's Learn &amp; Play Center</h1>
          <p className="learning-hero__lede">
            Hi, I&rsquo;m Rikki! We can meet real people from history, travel across
            time and around the world, discover big ideas, and make a brand-new
            story together.
          </p>
          <button type="button" className="learning-hero__start" onClick={onOpenLibrary}>
            Start exploring
            <span aria-hidden="true"> &darr;</span>
          </button>
        </div>
        <div className="learning-hero__mascot">
          <span className="learning-hero__bubble">What will we discover today?</span>
          <RikkiMascot />
        </div>
      </header>

      <section className="learning-zones" aria-label="Choose a learning zone">
        <button
          type="button"
          className="learn-zone learn-zone--library"
          onClick={onOpenLibrary}
        >
          <span className="learn-zone__icon" aria-hidden="true">
            &#128218;
          </span>
          <span className="learn-zone__copy">
            <span className="learn-zone__kicker">Read &amp; discover</span>
            <span className="learn-zone__title" role="heading" aria-level={2}>
              The Library
            </span>
            <span className="learn-zone__text">
              Explore {historicalCount}+ illustrated true stories by shelf, time,
              place, map, or subject.
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
            aria-label="Play games with Rikki"
          >
            <span className="learn-zone__icon" aria-hidden="true">
              &#9733;
            </span>
            <span className="learn-zone__copy">
              <span className="learn-zone__kicker">Play &amp; practice</span>
              <span className="learn-zone__title" role="heading" aria-level={2}>
                Play Games
              </span>
              <span className="learn-zone__text">
                Name feelings, build patterns, count, and learn by trying things
                yourself.
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
            aria-label="Make a story with Rikki"
          >
            <span className="learn-zone__icon" aria-hidden="true">
              &#10024;
            </span>
            <span className="learn-zone__copy">
              <span className="learn-zone__kicker">Imagine &amp; create</span>
              <span className="learn-zone__title" role="heading" aria-level={2}>
                Make a Story
              </span>
              <span className="learn-zone__text">
                Pick a few favorite things and the Story Loom will weave them into
                your own tale.
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
          ?
        </div>
        <div className="fact-card__copy">
          <p id="fact-title" className="fact-card__title">
            Rikki&rsquo;s did-you-know corner
          </p>
          <p className="fact-card__fact" aria-live="polite">
            {FACTS[factIndex]}
          </p>
        </div>
        <button
          type="button"
          className="fact-card__next"
          onClick={() => setFactIndex((current) => (current + 1) % FACTS.length)}
        >
          Show another fact
        </button>
      </aside>

      <section className="subject-zone" aria-labelledby="subject-zone-title">
        <div className="subject-zone__head">
          <div>
            <p className="subject-zone__eyebrow">Follow your curiosity</p>
            <h2 id="subject-zone-title" className="subject-zone__title">
              Explore by Subject
            </h2>
          </div>
          <p className="subject-zone__lede">
            Choose something you wonder about. Rikki will gather stories that help
            you investigate it.
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
                aria-label={`Explore ${CATEGORY_LABEL[domain]} stories`}
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
