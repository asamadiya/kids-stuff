import { useMemo, useState } from 'react';
import type { AnyGame, Level } from './types';
import { ROUNDS } from './types';
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
 */

type Stage = 'answering' | 'hint' | 'worked' | 'solved';

export interface GameShellProps {
  readonly game: AnyGame;
  /** Where "back" goes: the hub hash. */
  readonly backHref: string;
  readonly backLabel: string;
}

export function GameShell({ game, backHref, backLabel }: GameShellProps) {
  const total = ROUNDS[game.kind];
  const [record, setRecord] = useState(() => loadRecord(game.id));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [stage, setStage] = useState<Stage>('answering');
  const [misses, setMisses] = useState(0);
  const [hint, setHint] = useState<string | undefined>();
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

  const persist = (next: typeof record) => {
    setRecord(next);
    saveRecord(game.id, next);
  };

  const advance = (firstTry: boolean, missedTwice: boolean) => {
    const { record: next, moved: m } = recordProblem(record, firstTry, missedTwice);
    setMoved(m);
    const last = index + 1 >= total;
    persist(last ? finishSet(next) : next);
    if (last) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setSerial(serial + 1);
    setStage('answering');
    setMisses(0);
    setHint(undefined);
  };

  const check = () => {
    if (game.kind === 'investigate') {
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

  const changeLevel = (l: Level) => {
    persist(setLevel(record, l));
    setMoved(null);
    setSerial(serial + 1);
    setStage('answering');
    setMisses(0);
    setHint(undefined);
  };

  const again = () => {
    setDone(false);
    setIndex(0);
    setSerial(serial + 1);
    setStage('answering');
    setMisses(0);
    setHint(undefined);
    setMoved(null);
  };

  const { Board } = game;
  const isInvestigate = game.kind === 'investigate';

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
            {isInvestigate && stage === 'solved' ? (
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
            {stage === 'hint' && hint ? <p className="feedback feedback--hint">{hint}</p> : null}
            {stage === 'worked' ? <p className="feedback feedback--worked">Here is how it works.</p> : null}
            {stage === 'solved' && game.kind === 'solve' ? (
              <p className="feedback feedback--ok">{misses === 0 ? 'Yes. ' : ''}{game.explain(round)}</p>
            ) : null}
            {stage === 'solved' && game.kind === 'investigate' ? (
              <p className="feedback feedback--ok">
                <strong>{game.matches(round, answer) ? 'Just as you said. ' : 'Not what you said — look. '}</strong>
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
                onClick={() => advance(misses === 0 && stage === 'solved', misses >= 2)}
              >
                Next <span aria-hidden="true">→</span>
              </button>
            ) : (
              <>
                <button type="button" className="btn" onClick={() => setStage(stage === 'answering' ? 'hint' : 'worked')}>
                  Help
                </button>
                <button type="button" className="btn" onClick={() => advance(false, false)}>
                  Skip
                </button>
                <button type="button" className="btn btn--primary btn--big" onClick={check}>
                  {isInvestigate ? 'Try it' : 'Check'}
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
