import { ForTheParent } from './ForTheParent';
import type { ComponentType } from 'react';
import { toHash } from '../App';
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
import WhatHappensNext from './sel/WhatHappensNext';
import TheWideView from './sel/TheWideView';
import BorrowedEyes from './sel/BorrowedEyes';
import MeantAndLanded from './sel/MeantAndLanded';
import BeforeYouDecide from './sel/BeforeYouDecide';
import HoldTheLine from './sel/HoldTheLine';
import OneSwingTwoKids from './sel/OneSwingTwoKids';
import FiveCookies from './sel/FiveCookies';
import NotTheSameRule from './sel/NotTheSameRule';
import BodyCheck from './sel/BodyCheck';
import PutItBackTogether from './sel/PutItBackTogether';
import TheFeelingRule from './sel/TheFeelingRule';
import { WHATHAPPENSNEXT_META } from '../sel/what-happens-next';
import { THE_WIDE_VIEW_META } from '../sel/the-wide-view';
import { BORROWED_EYES_META } from '../sel/borrowed-eyes';
import { MEANT_AND_LANDED_META } from '../sel/meant-and-landed';
import { BEFORE_YOU_DECIDE_META } from '../sel/before-you-decide';
import { HOLDTHELINE_META } from '../sel/hold-the-line';
import { ONE_SWING_TWO_KIDS_META } from '../sel/one-swing-two-kids';
import { FIVE_COOKIES_META } from '../sel/five-cookies';
import { NOT_THE_SAME_RULE_META } from '../sel/not-the-same-rule';
import { BODYCHECK_META } from '../sel/body-check';
import { PUT_IT_BACK_TOGETHER_META } from '../sel/put-it-back-together';
import { THE_FEELING_RULE_META } from '../sel/the-feeling-rule';
import '../styles/play.css';

const BASE = import.meta.env.BASE_URL;

/** The cards were buttons before they were links; play.css never suppressed the
 *  anchor underline that would otherwise strike through every card title. */
const NO_UNDERLINE = { textDecoration: 'none' } as const;

export interface PlayHubProps {
  /** Which exercise is open, read off the hash. `null` is the gallery. */
  readonly activeId: string | null;
}
interface GameMeta { readonly id: string; readonly title: string; readonly icon: string; readonly color: string; readonly tagline: string; }
interface GameEntry { readonly meta: GameMeta; readonly Component: ComponentType; readonly cat: string; }


/**
 * The social exercises describe themselves differently from the drills: they
 * have a note rather than a tagline, and none of them is scored. This shapes
 * one into a card without pretending it is a quiz.
 */
interface SelMeta { readonly id: string; readonly title: string; readonly eyebrow: string; readonly note: string }
const asCard = (m: SelMeta, color: string): GameMeta => ({
  id: m.id, title: m.title, icon: '', color, tagline: m.note,
});

const GAMES: readonly GameEntry[] = [
  { meta: asCard(WHATHAPPENSNEXT_META, 'berry'), Component: WhatHappensNext, cat: 'feelings' },
  { meta: asCard(THE_WIDE_VIEW_META, 'teal'), Component: TheWideView, cat: 'feelings' },
  { meta: asCard(BORROWED_EYES_META, 'slate'), Component: BorrowedEyes, cat: 'feelings' },
  { meta: asCard(MEANT_AND_LANDED_META, 'olive'), Component: MeantAndLanded, cat: 'feelings' },
  { meta: asCard(BEFORE_YOU_DECIDE_META, 'ochre'), Component: BeforeYouDecide, cat: 'feelings' },
  { meta: asCard(HOLDTHELINE_META, 'terracotta'), Component: HoldTheLine, cat: 'feelings' },
  { meta: asCard(ONE_SWING_TWO_KIDS_META, 'plum'), Component: OneSwingTwoKids, cat: 'feelings' },
  { meta: asCard(FIVE_COOKIES_META, 'sky'), Component: FiveCookies, cat: 'feelings' },
  { meta: asCard(NOT_THE_SAME_RULE_META, 'leaf'), Component: NotTheSameRule, cat: 'feelings' },
  { meta: asCard(BODYCHECK_META, 'grape'), Component: BodyCheck, cat: 'feelings' },
  { meta: asCard(PUT_IT_BACK_TOGETHER_META, 'coral'), Component: PutItBackTogether, cat: 'feelings' },
  { meta: asCard(THE_FEELING_RULE_META, 'aqua'), Component: TheFeelingRule, cat: 'feelings' },
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
];
/**
 * The exercise ids, in gallery order, read off the same array that renders the
 * cards. `App` validates `#/play/<id>` against this list, so an exercise cannot
 * be addressable without being on the bench, or on the bench without being
 * addressable.
 */
export const PLAY_EXERCISE_IDS: readonly string[] = GAMES.map((g) => g.meta.id);

/**
 * Number first: it is the work he is actually here for, and it used to sit
 * below two other sections.
 */
const CATEGORIES: readonly { key: string; title: string; blurb: string }[] = [
  { key: 'math', title: "Number & Quantity", blurb: "Place value, addition and subtraction, multiplication, division, fractions, money and the number line." },
  { key: 'early', title: "Letters, Shapes & Patterns", blurb: "Sounds and letters, plane shapes, colour, sequence and recall." },
  { key: 'feelings', title: "People & What Happens Next", blurb: "Watch what people do, decide what you do, and see what follows. Nothing here is marked." },
];

export function PlayHub({ activeId }: PlayHubProps) {
  const active = GAMES.find((g) => g.meta.id === activeId) ?? null;
  return (
    <main id="main-content" className="play-hub" aria-label="Practice" tabIndex={-1}>
      <header className="play-hub__hero">
        <div className="play-hub__copy">
          <a className="play-hub__back" style={NO_UNDERLINE} href={toHash({ kind: 'index' })}>
            <span aria-hidden="true">&larr;</span> Contents
          </a>
          <p className="play-hub__eyebrow">Exercises</p>
          <h1 className="play-hub__title">Practice</h1>
          <p className="play-hub__lede">
            {GAMES.length} exercises. Work at whichever you like, for as long as it
            holds your attention.
          </p>
        </div>
        <RikkiMascot className="play-hub__rikki" />
      </header>

      {active ? (
        <section aria-label={active.meta.title}>
          <a className="mini-game__back" style={NO_UNDERLINE} href={toHash({ kind: 'play' })}>
            <span aria-hidden="true">&larr;</span> All exercises
          </a>
          <active.Component />
          <ForTheParent id={active.meta.id} />
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
                    <a key={meta.id} className={`play-card play-card--${meta.color}`}
                      style={NO_UNDERLINE}
                      href={toHash({ kind: 'exercise', id: meta.id })} aria-label={`Play ${meta.title}`}>
                      <span className="play-card__pic">
                        <span className="play-card__icon" aria-hidden="true">{meta.icon}</span>
                        <img src={`${BASE}games/covers/${meta.id}.png`} alt="" loading="lazy"
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                      </span>
                      <span className="play-card__title">{meta.title}</span>
                    </a>
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
