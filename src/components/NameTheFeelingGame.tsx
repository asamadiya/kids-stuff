import { useMemo, useState } from 'react';
import {
  FACE_ROUNDS,
  FEELING_MODES,
  FEELING_ROUNDS,
  FIND_ROUNDS,
  LETTER_ROUNDS,
  NAMETHEFEELING_META,
  OPPOSITE_ROUNDS,
  feelingFace,
  feelingLabel,
  feelingModeInfo,
  getFaceFeedback,
  getFaceOptions,
  getFeelingFeedback,
  getFeelingOptions,
  getFindFeedback,
  getFindOptions,
  getLetterFeedback,
  getLetterOptions,
  getOppositeFeedback,
  getOppositeOptions,
  type Feeling,
  type FeelingMode,
} from '../games/feelings';

interface RoundView {
  readonly stage: React.ReactNode;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly answer: string;
  readonly label: (option: string) => string;
  readonly feedbackFor: (option: string) => string;
}

function buildRound(mode: FeelingMode, roundIndex: number): RoundView {
  switch (mode) {
    case 'faces': {
      const round = FACE_ROUNDS[roundIndex % FACE_ROUNDS.length];
      const options = getFaceOptions(roundIndex);
      return {
        stage: (
          <span className="mini-game__emoji" role="img" aria-label="feeling face">
            {round.face}
          </span>
        ),
        prompt: 'What feeling does this face show?',
        options,
        answer: round.feeling,
        label: (option) => feelingLabel(option as Feeling),
        feedbackFor: (option) => getFaceFeedback(round, option as Feeling),
      };
    }
    case 'letter': {
      const round = LETTER_ROUNDS[roundIndex % LETTER_ROUNDS.length];
      const options = getLetterOptions(roundIndex);
      return {
        stage: (
          <span className="mini-game__emoji" role="img" aria-label={`${feelingLabel(round.feeling)} face`}>
            {round.face}
          </span>
        ),
        prompt: `Which letter does ${feelingLabel(round.feeling)} start with?`,
        options,
        answer: round.letter,
        label: (option) => option,
        feedbackFor: (option) => getLetterFeedback(round, option),
      };
    }
    case 'find': {
      const round = FIND_ROUNDS[roundIndex % FIND_ROUNDS.length];
      const options = getFindOptions(roundIndex);
      return {
        stage: (
          <div className="mini-game__seq" aria-hidden="true">
            <span className="mini-game__emoji">{feelingLabel(round.feeling)}</span>
          </div>
        ),
        prompt: `Which face shows ${feelingLabel(round.feeling)}?`,
        options,
        answer: round.face,
        label: (option) => option,
        feedbackFor: (option) => getFindFeedback(round, option),
      };
    }
    case 'opposite': {
      const round = OPPOSITE_ROUNDS[roundIndex % OPPOSITE_ROUNDS.length];
      const options = getOppositeOptions(roundIndex);
      return {
        stage: (
          <span className="mini-game__emoji" role="img" aria-label={`${feelingLabel(round.feeling)} face`}>
            {feelingFace(round.feeling)}
          </span>
        ),
        prompt: `Which feeling is the other way from ${feelingLabel(round.feeling)}?`,
        options,
        answer: round.opposite,
        label: (option) => feelingLabel(option as Feeling),
        feedbackFor: (option) => getOppositeFeedback(round, option as Feeling),
      };
    }
    case 'story':
    default: {
      const round = FEELING_ROUNDS[roundIndex % FEELING_ROUNDS.length];
      const options = getFeelingOptions(roundIndex);
      return {
        stage: (
          <span className="mini-game__emoji" role="img" aria-label="story feeling">
            {round.face ?? feelingFace(round.feeling)}
          </span>
        ),
        prompt: round.prompt,
        options,
        answer: round.feeling,
        label: (option) => feelingLabel(option as Feeling),
        feedbackFor: (option) => getFeelingFeedback(round, option as Feeling),
      };
    }
  }
}

export function NameTheFeelingGame() {
  const [mode, setMode] = useState<FeelingMode>('story');
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const view = useMemo(() => buildRound(mode, roundIndex), [mode, roundIndex]);
  const info = feelingModeInfo(mode);
  const answered = chosen !== null;
  const feedback = chosen === null ? '' : view.feedbackFor(chosen);

  function choose(option: string) {
    if (answered) return;
    setChosen(option);
    setScore((value) => value + 1);
  }

  function next() {
    setChosen(null);
    setRoundIndex((value) => value + 1);
  }

  function switchMode(nextMode: FeelingMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    setRoundIndex(0);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="name-the-feeling-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{info.eyebrow}</p>
          <h3 id="name-the-feeling-title" className="mini-game__title">
            {NAMETHEFEELING_META.title}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} found`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__modes" role="tablist" aria-label="Choose a way to play">
        {FEELING_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`mini-mode-tab${mode === m.id ? ' is-chosen' : ''}`}
            aria-pressed={mode === m.id}
            onClick={() => switchMode(m.id)}
          >
            <span aria-hidden="true">{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      <div className="mini-game__stage">{view.stage}</div>

      <p className="mini-game__prompt">{view.prompt}</p>

      <div className="mini-game__options" aria-label="Choose">
        {view.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`mini-option${chosen === option ? ' is-chosen' : ''}${
              answered && option === view.answer ? ' is-correct' : ''
            }`}
            aria-pressed={chosen === option}
            disabled={answered}
            onClick={() => choose(option)}
          >
            {view.label(option)}
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{feedback}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">{info.hint}</p>
      )}
    </section>
  );
}

export default NameTheFeelingGame;
