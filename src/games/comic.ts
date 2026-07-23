import type { Feeling } from './feelings';

/** One answer choice. `face` (a Feeling) renders a studio face picture; else text. */
export interface ComicOption {
  readonly id: string;
  readonly label: string;
  readonly face?: Feeling;
}

/** One comic-strip scenario: a multi-panel picture + a question about it. */
export interface ComicScenario {
  readonly id: string;
  /** Image key -> games/comics/<comic>.png */
  readonly comic: string;
  /** 'feel' = pick a feeling face; 'do' = pick the kind choice. */
  readonly kind: 'feel' | 'do';
  readonly prompt: string;
  readonly options: readonly ComicOption[];
  readonly answerId: string;
  readonly feedbackCorrect: string;
  readonly feedbackOther?: string;
}

export interface ComicMeta {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly color: string;
  readonly tagline: string;
}

/** Deterministic option order that always keeps the answer present. */
export function comicOptions(scn: ComicScenario, index: number): readonly ComicOption[] {
  const opts = scn.options;
  const rot = index % opts.length;
  return [...opts.slice(rot), ...opts.slice(0, rot)];
}

export function comicFeedback(scn: ComicScenario, chosenId: string): string {
  if (chosenId === scn.answerId) return scn.feedbackCorrect;
  const answer = scn.options.find((o) => o.id === scn.answerId);
  return (
    scn.feedbackOther ??
    `Good thinking! ${answer ? answer.label + '.' : ''} That fits this story well.`
  );
}
