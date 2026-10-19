import type { ComponentType } from 'react';
import '../styles/workshop.css';
import '../styles/sel.css';
import '../styles/print.css';
import '../styles/lc/bridge.css';
import type { GrownUpNote } from '../notes/types';
import { parentNote } from '../components/parentNotes';
import WhatHappensNext from '../components/sel/WhatHappensNext';
import TheWideView from '../components/sel/TheWideView';
import BorrowedEyes from '../components/sel/BorrowedEyes';
import MeantAndLanded from '../components/sel/MeantAndLanded';
import BeforeYouDecide from '../components/sel/BeforeYouDecide';
import HoldTheLine from '../components/sel/HoldTheLine';
import OneSwingTwoKids from '../components/sel/OneSwingTwoKids';
import FiveCookies from '../components/sel/FiveCookies';
import NotTheSameRule from '../components/sel/NotTheSameRule';
import BodyCheck from '../components/sel/BodyCheck';
import PutItBackTogether from '../components/sel/PutItBackTogether';
import TheFeelingRule from '../components/sel/TheFeelingRule';
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

/**
 * The twelve social exercises, as "Try a situation" items on the Family &
 * Friends shelf (advisor ruling RULINGS-3: they share the cast and the
 * situations, so they sit beside the books rather than in a separate,
 * remedial-looking section).
 *
 * The exercises themselves are unchanged — they were rebuilt and verified in
 * the earlier practice redesign — so this only gives each a card and a note in
 * the new shape. The old notes had `what/practising/ask/honest`; `expect` and
 * `next` are written here, per exercise.
 */

interface SelMeta {
  readonly id: string;
  readonly title: string;
  readonly note: string;
}

export interface Situation {
  readonly id: string;
  readonly title: string;
  readonly hook: string;
  readonly Component: ComponentType;
  readonly note: GrownUpNote;
}

const EXPECT: Record<string, { expect: string; next: string }> = {
  'what-happens-next': {
    expect: 'He will usually pick the kind choice first because he knows it is the "right" one. The useful moment is when he chooses the other one on purpose to see what follows.',
    next: 'When a real grab is about to happen, say "Two roads — what happens next?" and let him finish the sentence.',
  },
  'the-wide-view': {
    expect: 'He will spot the obvious feeling first and miss the person in the background. Point at the edges of the picture.',
    next: 'At a park or a party, ask him who else is watching and what they might be feeling.',
  },
  'borrowed-eyes': {
    expect: 'Seeing the same moment from the little sister\'s side is hard at five. Expect him to describe what happened rather than how it felt to her.',
    next: 'After a real squabble, ask "What did it look like from where Mia was standing?"',
  },
  'meant-and-landed': {
    expect: 'He will defend what he meant. The exercise is about separating that from how it landed, which takes several goes.',
    next: 'Use the words "I meant… but it landed…" yourself after a small mistake of your own.',
  },
  'before-you-decide': {
    expect: 'He will want to decide fast. Slow the first one down and let him look at every option before choosing.',
    next: 'Before a real choice ("which park?") ask him to say two options out loud before picking.',
  },
  'hold-the-line': {
    expect: 'Saying a boundary in a calm voice is the hard part; expect giggles or a shout the first time.',
    next: 'Practise one line ("Stop. I\'m using that.") in a calm voice at bath time, then use it for real.',
  },
  'one-swing-two-kids': {
    expect: 'He will propose "me first". Let the exercise show what happens next rather than correcting him.',
    next: 'At the playground, let him negotiate a turn with a timer you hold.',
  },
  'five-cookies': {
    expect: 'Equal shares feel fair at first; the exercise asks whether equal is always fair. Expect a real argument — that is the point.',
    next: 'Share a snack between three people and ask him how to make it fair.',
  },
  'not-the-same-rule': {
    expect: 'He may say a different rule for his sister is unfair. Let him say why, then talk about why the rule differs.',
    next: 'When a rule differs for his sister at home, explain why in one sentence instead of "because she is little".',
  },
  'body-check': {
    expect: 'Naming where a feeling sits in the body is new for most five-year-olds. Start with a strong feeling like angry.',
    next: 'When he is upset, ask "Where do you feel it?" before asking why.',
  },
  'put-it-back-together': {
    expect: 'He will offer "sorry" first. The exercise is about the repair that comes with it.',
    next: 'After a real accident, ask "What can you do to help fix it?" before asking for sorry.',
  },
  'the-feeling-rule': {
    expect: 'He will mix up the feeling and what he did about it. Separating the two is the whole exercise.',
    next: 'Say "All feelings are allowed; not all actions are" once, then point back to it when it fits.',
  },
};

const ENTRIES: ReadonlyArray<readonly [SelMeta, ComponentType]> = [
  [WHATHAPPENSNEXT_META, WhatHappensNext],
  [HOLDTHELINE_META, HoldTheLine],
  [ONE_SWING_TWO_KIDS_META, OneSwingTwoKids],
  [PUT_IT_BACK_TOGETHER_META, PutItBackTogether],
  [BORROWED_EYES_META, BorrowedEyes],
  [MEANT_AND_LANDED_META, MeantAndLanded],
  [THE_FEELING_RULE_META, TheFeelingRule],
  [BODYCHECK_META, BodyCheck],
  [FIVE_COOKIES_META, FiveCookies],
  [NOT_THE_SAME_RULE_META, NotTheSameRule],
  [BEFORE_YOU_DECIDE_META, BeforeYouDecide],
  [THE_WIDE_VIEW_META, TheWideView],
];

export const SITUATIONS: readonly Situation[] = ENTRIES.map(([meta, Component]) => {
  const old = parentNote(meta.id);
  const extra = EXPECT[meta.id];
  return {
    id: meta.id,
    title: meta.title,
    hook: meta.note.split(/(?<=\.)\s/)[0],
    Component,
    note: {
      what: old?.what ?? meta.note,
      expect: extra?.expect ?? '',
      practising: old?.practising ?? '',
      ask: old?.ask ?? '',
      next: extra?.next ?? '',
      honest: old?.honest ?? '',
    },
  };
});

export function getSituation(id: string): Situation | undefined {
  return SITUATIONS.find((s) => s.id === id);
}
