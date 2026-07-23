import { useState } from 'react';
import type { ComponentType } from 'react';
import { RikkiMascot } from './RikkiMascot';
import NameTheFeelingGame from './NameTheFeelingGame';
import ColorMatchGame from './ColorMatchGame';
import CountWithRikkiGame from './CountWithRikkiGame';
import LetterLandGame from './LetterLandGame';
import MemoryPairsGame from './MemoryPairsGame';
import NumberOrderGame from './NumberOrderGame';
import OddOneOutGame from './OddOneOutGame';
import OppositesGame from './OppositesGame';
import PatternParadeGame from './PatternParadeGame';
import RhymeTimeGame from './RhymeTimeGame';
import ShapeHuntGame from './ShapeHuntGame';
import WhichHasMoreGame from './WhichHasMoreGame';
import { NAMETHEFEELING_META } from '../games/feelings';
import { COLOR_MATCH_META } from '../games/color-match';
import { COUNT_WITH_RIKKI_META } from '../games/count-with-rikki';
import { LETTER_LAND_META } from '../games/letter-land';
import { MEMORY_PAIRS_META } from '../games/memory-pairs';
import { NUMBER_ORDER_META } from '../games/number-order';
import { ODDONEOUT_META } from '../games/odd-one-out';
import { OPPOSITES_META } from '../games/opposites';
import { PATTERN_PARADE_META } from '../games/pattern-parade';
import { RHYME_TIME_META } from '../games/rhyme-time';
import { SHAPE_HUNT_META } from '../games/shape-hunt';
import { WHICH_HAS_MORE_META } from '../games/which-has-more';
import '../styles/play.css';

export interface PlayHubProps {
  readonly onExit: () => void;
}

interface GameMeta {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly color: string;
  readonly tagline: string;
}

interface GameEntry {
  readonly meta: GameMeta;
  readonly Component: ComponentType;
}

/** Every playable game in Rikki's Play Zone. Add a game by dropping it in here. */
const GAMES: readonly GameEntry[] = [
  { meta: NAMETHEFEELING_META, Component: NameTheFeelingGame },
  { meta: COLOR_MATCH_META, Component: ColorMatchGame },
  { meta: COUNT_WITH_RIKKI_META, Component: CountWithRikkiGame },
  { meta: LETTER_LAND_META, Component: LetterLandGame },
  { meta: MEMORY_PAIRS_META, Component: MemoryPairsGame },
  { meta: NUMBER_ORDER_META, Component: NumberOrderGame },
  { meta: ODDONEOUT_META, Component: OddOneOutGame },
  { meta: OPPOSITES_META, Component: OppositesGame },
  { meta: PATTERN_PARADE_META, Component: PatternParadeGame },
  { meta: RHYME_TIME_META, Component: RhymeTimeGame },
  { meta: SHAPE_HUNT_META, Component: ShapeHuntGame },
  { meta: WHICH_HAS_MORE_META, Component: WhichHasMoreGame },
];

export function PlayHub({ onExit }: PlayHubProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = GAMES.find((g) => g.meta.id === activeId) ?? null;

  return (
    <main id="main-content" className="play-hub" aria-label="Rikki's Play Zone" tabIndex={-1}>
      <header className="play-hub__hero">
        <div className="play-hub__copy">
          <button type="button" className="play-hub__back" onClick={onExit}>
            <span aria-hidden="true">&larr;</span> Back to the learning center
          </button>
          <p className="play-hub__eyebrow">Learn by doing</p>
          <h1 className="play-hub__title">Rikki's Play Zone</h1>
          <p className="play-hub__lede">
            {GAMES.length} gentle games to help you notice feelings, numbers, letters,
            patterns, shapes, colors, and the world around you. Nobody ever loses &mdash;
            every try is a good one.
          </p>
        </div>
        <RikkiMascot className="play-hub__rikki" />
      </header>

      {active ? (
        <section aria-label={active.meta.title}>
          <button type="button" className="mini-game__back" onClick={() => setActiveId(null)}>
            <span aria-hidden="true">&larr;</span> All games
          </button>
          <active.Component />
        </section>
      ) : (
        <section className="game-gallery-wrap" aria-labelledby="games-title">
          <div className="game-shelf__head">
            <p className="game-shelf__eyebrow">Pick a game</p>
            <h2 id="games-title" className="game-shelf__title">
              The game box
            </h2>
          </div>
          <div className="game-gallery">
            {GAMES.map(({ meta }) => (
              <button
                key={meta.id}
                type="button"
                className={`game-card game-card--${meta.color}`}
                onClick={() => setActiveId(meta.id)}
                aria-label={`Play ${meta.title}`}
              >
                <span className="game-card__icon" aria-hidden="true">
                  {meta.icon}
                </span>
                <div>
                  <h3 className="game-card__title">{meta.title}</h3>
                  <p className="game-card__copy">{meta.tagline}</p>
                  <p className="game-card__go" aria-hidden="true">
                    Play <span>&rarr;</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default PlayHub;
