import { useState } from 'react';
import type { ComponentType } from 'react';
import { RikkiMascot } from './RikkiMascot';
import CountWithRikkiGame from './CountWithRikkiGame';
import PatternParadeGame from './PatternParadeGame';
import ShapeHuntGame from './ShapeHuntGame';
import LetterLandGame from './LetterLandGame';
import RhymeTimeGame from './RhymeTimeGame';
import OppositesGame from './OppositesGame';
import ColorMatchGame from './ColorMatchGame';
import OddOneOutGame from './OddOneOutGame';
import WhichHasMoreGame from './WhichHasMoreGame';
import NumberOrderGame from './NumberOrderGame';
import MemoryPairsGame from './MemoryPairsGame';
import NameTheFeelingGame from './NameTheFeelingGame';
import TensAndOnesGame from './TensAndOnesGame';
import CountByTensGame from './CountByTensGame';
import SkipCountGame from './SkipCountGame';
import BuildTheNumberGame from './BuildTheNumberGame';
import AddWithThingsGame from './AddWithThingsGame';
import NumberBondsGame from './NumberBondsGame';
import TwoDigitAddGame from './TwoDigitAddGame';
import TakeAwayGame from './TakeAwayGame';
import TwoDigitSubtractGame from './TwoDigitSubtractGame';
import GroupsOfGame from './GroupsOfGame';
import TimesTablesGame from './TimesTablesGame';
import ShareFairlyGame from './ShareFairlyGame';
import HowManyGroupsGame from './HowManyGroupsGame';
import HalvesAndWholesGame from './HalvesAndWholesGame';
import FractionPizzaGame from './FractionPizzaGame';
import CompareNumbersGame from './CompareNumbersGame';
import NumberLineJumpGame from './NumberLineJumpGame';
import DoublesGame from './DoublesGame';
import OddEvenGame from './OddEvenGame';
import MoneyCoinsGame from './MoneyCoinsGame';
import TenMoreTenLessGame from './TenMoreTenLessGame';
import WhatsMissingGame from './WhatsMissingGame';
import ScenesGame from './ScenesGame';
import { COUNT_WITH_RIKKI_META } from '../games/count-with-rikki';
import { PATTERN_PARADE_META } from '../games/pattern-parade';
import { SHAPE_HUNT_META } from '../games/shape-hunt';
import { LETTER_LAND_META } from '../games/letter-land';
import { RHYME_TIME_META } from '../games/rhyme-time';
import { OPPOSITES_META } from '../games/opposites';
import { COLOR_MATCH_META } from '../games/color-match';
import { ODDONEOUT_META } from '../games/odd-one-out';
import { WHICH_HAS_MORE_META } from '../games/which-has-more';
import { NUMBER_ORDER_META } from '../games/number-order';
import { MEMORY_PAIRS_META } from '../games/memory-pairs';
import { NAMETHEFEELING_META } from '../games/feelings';
import { TENS_AND_ONES_META } from '../games/tens-and-ones';
import { COUNT_BY_TENS_META } from '../games/count-by-tens';
import { SKIP_COUNT_META } from '../games/skip-count';
import { BUILD_THE_NUMBER_META } from '../games/build-the-number';
import { ADD_WITH_THINGS_META } from '../games/add-with-things';
import { NUMBER_BONDS_META } from '../games/number-bonds';
import { TWO_DIGIT_ADD_META } from '../games/two-digit-add';
import { TAKE_AWAY_META } from '../games/take-away';
import { TWO_DIGIT_SUBTRACT_META } from '../games/two-digit-subtract';
import { GROUPS_OF_META } from '../games/groups-of';
import { TIMES_TABLES_META } from '../games/times-tables';
import { SHARE_FAIRLY_META } from '../games/share-fairly';
import { HOW_MANY_GROUPS_META } from '../games/how-many-groups';
import { HALVES_AND_WHOLES_META } from '../games/halves-and-wholes';
import { FRACTIONPIZZA_META } from '../games/fraction-pizza';
import { COMPARE_NUMBERS_META } from '../games/compare-numbers';
import { NUMBER_LINE_JUMP_META } from '../games/number-line-jump';
import { DOUBLES_META } from '../games/doubles';
import { ODD_EVEN_META } from '../games/odd-even';
import { MONEY_COINS_META } from '../games/money-coins';
import { TEN_MORE_TEN_LESS_META } from '../games/ten-more-ten-less';
import { WHATS_MISSING_META } from '../games/whats-missing';
import { SCENES_META } from '../games/scenes';
import '../styles/play.css';

const BASE = import.meta.env.BASE_URL;

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
  readonly cat: string;
}

const GAMES: readonly GameEntry[] = [
  { meta: COUNT_WITH_RIKKI_META, Component: CountWithRikkiGame, cat: 'early' },
  { meta: PATTERN_PARADE_META, Component: PatternParadeGame, cat: 'early' },
  { meta: SHAPE_HUNT_META, Component: ShapeHuntGame, cat: 'early' },
  { meta: LETTER_LAND_META, Component: LetterLandGame, cat: 'early' },
  { meta: RHYME_TIME_META, Component: RhymeTimeGame, cat: 'early' },
  { meta: OPPOSITES_META, Component: OppositesGame, cat: 'early' },
  { meta: COLOR_MATCH_META, Component: ColorMatchGame, cat: 'early' },
  { meta: ODDONEOUT_META, Component: OddOneOutGame, cat: 'early' },
  { meta: WHICH_HAS_MORE_META, Component: WhichHasMoreGame, cat: 'early' },
  { meta: NUMBER_ORDER_META, Component: NumberOrderGame, cat: 'early' },
  { meta: MEMORY_PAIRS_META, Component: MemoryPairsGame, cat: 'early' },
  { meta: NAMETHEFEELING_META, Component: NameTheFeelingGame, cat: 'early' },
  { meta: TENS_AND_ONES_META, Component: TensAndOnesGame, cat: 'math' },
  { meta: COUNT_BY_TENS_META, Component: CountByTensGame, cat: 'math' },
  { meta: SKIP_COUNT_META, Component: SkipCountGame, cat: 'math' },
  { meta: BUILD_THE_NUMBER_META, Component: BuildTheNumberGame, cat: 'math' },
  { meta: ADD_WITH_THINGS_META, Component: AddWithThingsGame, cat: 'math' },
  { meta: NUMBER_BONDS_META, Component: NumberBondsGame, cat: 'math' },
  { meta: TWO_DIGIT_ADD_META, Component: TwoDigitAddGame, cat: 'math' },
  { meta: TAKE_AWAY_META, Component: TakeAwayGame, cat: 'math' },
  { meta: TWO_DIGIT_SUBTRACT_META, Component: TwoDigitSubtractGame, cat: 'math' },
  { meta: GROUPS_OF_META, Component: GroupsOfGame, cat: 'math' },
  { meta: TIMES_TABLES_META, Component: TimesTablesGame, cat: 'math' },
  { meta: SHARE_FAIRLY_META, Component: ShareFairlyGame, cat: 'math' },
  { meta: HOW_MANY_GROUPS_META, Component: HowManyGroupsGame, cat: 'math' },
  { meta: HALVES_AND_WHOLES_META, Component: HalvesAndWholesGame, cat: 'math' },
  { meta: FRACTIONPIZZA_META, Component: FractionPizzaGame, cat: 'math' },
  { meta: COMPARE_NUMBERS_META, Component: CompareNumbersGame, cat: 'math' },
  { meta: NUMBER_LINE_JUMP_META, Component: NumberLineJumpGame, cat: 'math' },
  { meta: DOUBLES_META, Component: DoublesGame, cat: 'math' },
  { meta: ODD_EVEN_META, Component: OddEvenGame, cat: 'math' },
  { meta: MONEY_COINS_META, Component: MoneyCoinsGame, cat: 'math' },
  { meta: TEN_MORE_TEN_LESS_META, Component: TenMoreTenLessGame, cat: 'math' },
  { meta: WHATS_MISSING_META, Component: WhatsMissingGame, cat: 'math' },
  { meta: SCENES_META, Component: ScenesGame, cat: 'feelings' },
];

const CATEGORIES: readonly { key: string; title: string; blurb: string }[] = [
  { key: 'feelings', title: "Feelings & Friends", blurb: "Notice and name feelings, and be a kind friend." },
  { key: 'math', title: "Numbers & Math", blurb: "Tens, adding, take-away, times, sharing, and fractions." },
  { key: 'early', title: "First Learning", blurb: "Letters, shapes, colors, patterns, and memory." },
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
            {GAMES.length} playful games for feelings, friends, and real math. Nobody
            ever loses &mdash; every try counts.
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
        <div className="play-cats">
          {CATEGORIES.map((cat) => {
            const games = GAMES.filter((g) => g.cat === cat.key);
            if (games.length === 0) return null;
            return (
              <section key={cat.key} className="play-cat" aria-labelledby={`cat-${cat.key}`}>
                <div className="play-cat__head">
                  <h2 id={`cat-${cat.key}`} className="play-cat__title">{cat.title}</h2>
                  <p className="play-cat__blurb">{cat.blurb}</p>
                </div>
                <div className="play-grid">
                  {games.map(({ meta }) => (
                    <button
                      key={meta.id}
                      type="button"
                      className={`play-card play-card--${meta.color}`}
                      onClick={() => setActiveId(meta.id)}
                      aria-label={`Play ${meta.title}`}
                    >
                      <span className="play-card__pic">
                        <span className="play-card__icon" aria-hidden="true">{meta.icon}</span>
                        <img
                          src={`${BASE}games/covers/${meta.id}.png`}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.visibility = 'hidden';
                          }}
                        />
                      </span>
                      <span className="play-card__title">{meta.title}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default PlayHub;
