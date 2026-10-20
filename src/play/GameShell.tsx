import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { AnyGame, Level } from './types';
import { ROUNDS } from './types';
import type { ProblemResult } from './progress';
import { finishSet, loadRecord, recordProblem, saveRecord, setLevel } from './progress';
import { GrownUps } from '../learn/GrownUps';

/**
 * The frame every game sits in. A board draws and answers; this owns the rest:
 * the one-line prompt, Check, Help, Skip, Easier/Harder, the round dots, the
 * hint-then-worked-answer sequence, and "Done for now".
 *
 * Owning those here is the point. The old 35 games each implemented feedback
 * their own way — some said "try again", some pinned the answer to slot two,
 * one dropped difficulty off a cliff at round eight — and no rule held across
 * them. One shell means the advisor's rulings hold everywhere by construction.
 *
 * In an investigation the shell never puts words in his mouth. Try it stays
 * muted until he has made a prediction, so "Just as you said" can only answer
 * something he said. Help there goes hint, then the evidence itself: the same
 * before/after and why that Try it shows, introduced as "Here is what happens."
 * with no claim about a prediction.
 */

type Stage = 'answering' | 'hint' | 'worked' | 'solved';

type IconName = 'check' | 'try' | 'help' | 'skip' | 'next';

/**
 * Every control carries a drawn symbol as well as its word, for a child who
 * reads the picture before the word. Line drawings in the button's own colour,
 * so a muted button mutes its symbol with it.
 */
const ICON: Record<IconName, ReactNode> = {
  check: <path d="M4.5 12.5l5 5 10-11" />,
  try: <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.2 9.2a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.6-2.8 3.8" />
      <path d="M12 17.3h.01" />
    </>
  ),
  skip: <path d="M5 6l6 6-6 6M13 6l6 6-6 6" />,
  next: <path d="M4 12h15M13 6l6 6-6 6" />,
};

function ControlIcon({ name }: { readonly name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON[name]}
    </svg>
  );
}

/** Try it before a prediction: still focusable and announced, visibly off (as .btn[disabled]). */
const MUTED: CSSProperties = { opacity: 0.45, cursor: 'default', transform: 'none' };

export interface GameShellProps {
  readonly game: AnyGame;
  /** Where "back" goes: the hub hash. */
  readonly backHref: string;
  readonly backLabel: string;
}

export function GameShell({ game, backHref, backLabel }: GameShellProps) {
  const total = ROUNDS[game.kind];
  const isInvestigate = game.kind === 'investigate';
  const [record, setRecord] = useState(() => loadRecord(game.id));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [stage, setStage] = useState<Stage>('answering');
  const [misses, setMisses] = useState(0);
  const [hint, setHint] = useState<string | undefined>();
  // Help pressed at any point on this problem: a right answer after it is not
  // his own first try, so it does not count toward a step up.
  const [helped, setHelped] = useState(false);
  // He pressed the muted Try it: say what it is waiting for.
  const [nudged, setNudged] = useState(false);
  const [moved, setMoved] = useState<'up' | 'down' | null>(null);
  // `index` advances by set; `serial` makes every problem a fresh round even
  // when a Skip or a level change replays the same index.
  const [serial, setSerial] = useState(0);
  const level = record.level;

  const round = useMemo(() => game.generate(level, serial), [game, level, serial]);
  const [answer, setAnswer] = useState(() => game.emptyAnswer(round));
  const [answerFor, setAnswerFor] = useState(round);
  if (answerFor !== round) {
    // A new round always starts from an empty answer, synchronously, so the
    // board never draws the last round's answer against the new question.
    setAnswerFor(round);
    setAnswer(game.emptyAnswer(round));
  }

  // Compared by value: an empty answer may be null, a number, or a fresh array.
  const empty = useMemo(() => JSON.stringify(game.emptyAnswer(round)), [game, round]);
  const predicted = JSON.stringify(answer) !== empty;
  const waiting = isInvestigate && !predicted;

  const persist = (next: typeof record) => {
    setRecord(next);
    saveRecord(game.id, next);
  };

  const fresh = () => {
    setStage('answering');
    setMisses(0);
    setHint(undefined);
    setHelped(false);
    setNudged(false);
  };

  /** How this problem went, for the record. An investigation carries nothing: it never moves the level. */
  const result = (rightFirst: boolean): ProblemResult =>
    game.kind === 'investigate' ? { kind: 'investigate' } : { kind: 'solve', rightFirst, helped, missedTwice: misses >= 2 };

  const advance = (r: ProblemResult) => {
    const { record: next, moved: m } = recordProblem(record, r);
    setMoved(m);
    const last = index + 1 >= total;
    persist(last ? finishSet(next) : next);
    if (last) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setSerial(serial + 1);
    fresh();
  };

  const check = () => {
    if (game.kind === 'investigate') {
      if (waiting) {
        setNudged(true);
        return;
      }
      setStage('solved');
      return;
    }
    const verdict = game.check(round, answer);
    if (verdict.ok) {
      setStage('solved');
      return;
    }
    if (misses === 0) {
      setMisses(1);
      setHint(verdict.hint);
      setStage('hint');
    } else {
      setMisses(2);
      setStage('worked');
    }
  };

  const help = () => {
    setHelped(true);
    setNudged(false);
    setStage(stage === 'answering' ? 'hint' : 'worked');
  };

  const changeLevel = (l: Level) => {
    persist(setLevel(record, l));
    setMoved(null);
    setSerial(serial + 1);
    fresh();
  };

  const again = () => {
    setDone(false);
    setIndex(0);
    setSerial(serial + 1);
    fresh();
    setMoved(null);
  };

  const { Board } = game;
  // An investigation shows its evidence after Try it, and after Help has run
  // through the hint: the outcome is the worked answer.
  const reveal = isInvestigate && (stage === 'solved' || stage === 'worked');

  return (
    <main id="main-content" className={`shell shell--${isInvestigate ? 'science' : 'maths'}`}>
      <header className="shell__bar">
        <a className="shell__back" href={backHref}>
          <span aria-hidden="true">←</span> {backLabel}
        </a>
        <h1 className="shell__title">{game.title}</h1>
        <GrownUps note={game.note} title={game.title} />
      </header>

      <nav className="shell__levels" aria-label="Level">
        {game.levels.map((name, i) => {
          const l = (i + 1) as Level;
          return (
            <button
              key={name}
              type="button"
              className={`level-chip${l === level ? ' is-current' : ''}`}
              aria-pressed={l === level}
              onClick={() => changeLevel(l)}
            >
              <span className="level-chip__n">{l}</span> {name}
            </button>
          );
        })}
      </nav>

      {done ? (
        <section className="shell__done" aria-live="polite">
          <h2>Done for now.</h2>
          <p>
            {isInvestigate ? `${total} investigations` : `${total} problems`}
            {moved === 'up' ? ' — and the next set starts a level higher.' : '.'}
          </p>
          <div className="shell__done-actions">
            <button type="button" className="btn btn--primary" onClick={again}>
              Another set
            </button>
            <a className="btn" href={backHref}>
              {backLabel}
            </a>
          </div>
        </section>
      ) : (
        <>
          <p className="shell__prompt">{game.prompt(round)}</p>

          <div className={`shell__board stage-${stage}`}>
            {reveal && game.kind === 'investigate' ? (
              <div className="evidence">
                <figure className="evidence__pane">
                  <figcaption>Before</figcaption>
                  <Board round={round} level={level} answer={answer} setAnswer={() => {}} stage="solved" />
                </figure>
                <figure className="evidence__pane evidence__pane--after">
                  <figcaption>What happened</figcaption>
                  <game.Outcome round={round} level={level} />
                </figure>
              </div>
            ) : (
              <Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />
            )}
          </div>

          <div className="shell__feedback" aria-live="polite">
            {nudged && waiting ? <p className="feedback feedback--hint">First choose what you think will happen.</p> : null}
            {stage === 'hint' && hint ? <p className="feedback feedback--hint">{hint}</p> : null}
            {stage === 'worked' && game.kind === 'solve' ? <p className="feedback feedback--worked">Here is how it works.</p> : null}
            {stage === 'solved' && game.kind === 'solve' ? (
              <p className="feedback feedback--ok">{misses === 0 ? 'Yes. ' : ''}{game.explain(round)}</p>
            ) : null}
            {reveal && game.kind === 'investigate' ? (
              <p className="feedback feedback--ok">
                <strong>
                  {stage === 'solved' && predicted
                    ? game.matches(round, answer)
                      ? 'Just as you said. '
                      : 'Not what you said — look. '
                    : 'Here is what happens. '}
                </strong>
                {game.why(round)}
              </p>
            ) : null}
          </div>

          <div className="shell__controls">
            <span className="shell__dots" aria-label={`Problem ${index + 1} of ${total}`}>
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className={`dot${i < index ? ' is-done' : i === index ? ' is-now' : ''}`} />
              ))}
            </span>
            {stage === 'solved' || stage === 'worked' ? (
              <button
                type="button"
                className="btn btn--primary btn--big"
                onClick={() => advance(result(stage === 'solved' && misses === 0))}
              >
                Next <ControlIcon name="next" />
              </button>
            ) : (
              <>
                <button type="button" className="btn" onClick={help}>
                  <ControlIcon name="help" /> Help
                </button>
                <button type="button" className="btn" onClick={() => advance(result(false))}>
                  <ControlIcon name="skip" /> Skip
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--big"
                  onClick={check}
                  aria-disabled={waiting || undefined}
                  style={waiting ? MUTED : undefined}
                >
                  <ControlIcon name={isInvestigate ? 'try' : 'check'} /> {isInvestigate ? 'Try it' : 'Check'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default GameShell;
