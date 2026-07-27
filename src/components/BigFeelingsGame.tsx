import { useMemo, useState } from 'react';
import {
  EMOTION_FACE_ROUNDS,
  EMOTION_STORY_ROUNDS,
  emotionLabel,
  emotionOptions,
  emotionSupport,
} from '../games/emotions';

const BASE = import.meta.env.BASE_URL;
type Mode = 'faces' | 'stories';
const MODES: readonly { id: Mode; label: string }[] = [
  { id: 'faces', label: '😊 Faces' },
  { id: 'stories', label: '📖 Stories' },
];

export function BigFeelingsGame() {
  const [mode, setMode] = useState<Mode>('faces');
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const roundCount = mode === 'faces' ? EMOTION_FACE_ROUNDS.length : EMOTION_STORY_ROUNDS.length;
  const faceRound = EMOTION_FACE_ROUNDS[index % EMOTION_FACE_ROUNDS.length];
  const storyRound = EMOTION_STORY_ROUNDS[index % EMOTION_STORY_ROUNDS.length];
  const answer = mode === 'faces' ? faceRound.emotion : storyRound.emotion;
  const storyText = storyRound.text;
  const options = useMemo(() => emotionOptions(answer, index, 4), [answer, index]);
  const answered = chosen !== null;

  const choose = (key: string) => {
    if (answered) return;
    setChosen(key);
    if (key === answer) setScore((s) => s + 1);
  };
  const next = () => {
    setIndex((i) => (i + 1) % roundCount);
    setChosen(null);
  };
  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setIndex(0);
    setChosen(null);
  };

  const feedback = answered
    ? chosen === answer
      ? `Yes — that's ${emotionLabel(answer)}. ${emotionSupport(answer)}`
      : `You picked ${emotionLabel(chosen)}. ${emotionSupport(chosen)} This one is ${emotionLabel(answer)}. ${emotionSupport(answer)}`
    : '';

  return (
    <section className="mini-game" aria-labelledby="big-feelings-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">Feelings words</p>
          <h3 id="big-feelings-title" className="mini-game__title">Big Feelings</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__modes" role="tablist" aria-label="Choose a way to play">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            className="mini-mode-tab"
            aria-pressed={mode === m.id}
            onClick={() => switchMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mini-game__stage">
        {mode === 'faces' ? (
          <img
            className="mini-face-big"
            src={`${BASE}games/faces/${answer}.png`}
            alt="a feeling face"
          />
        ) : (
          <p className="big-feelings__story">{storyText}</p>
        )}
      </div>
      <p className="mini-game__prompt">
        {mode === 'faces' ? 'What feeling is this?' : 'How does Leo feel?'}
      </p>

      <div
        className={`mini-game__options${mode === 'stories' ? ' mini-game__options--faces' : ''}`}
        aria-label="Choose a feeling"
      >
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`mini-option${mode === 'stories' ? ' mini-option--face' : ''}${
              chosen === o ? ' is-chosen' : ''
            }${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {mode === 'stories' ? <img src={`${BASE}games/faces/${o}.png`} alt="" aria-hidden="true" /> : null}
            <span>{emotionLabel(o)}</span>
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{feedback}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">Every feeling is okay to feel. Take your best guess!</p>
      )}
    </section>
  );
}

export default BigFeelingsGame;
