import { useState, type CSSProperties } from 'react';
import {
  GROUP_ROUNDS,
  HOW_MANY_GROUPS_META,
  getGroupFeedback,
  getGroupOptions,
  groupAnswer,
  groupOptionLabel,
  groupPrompt,
} from '../games/how-many-groups';
import { counted } from '../games/nouns';
import { canSpeak, say } from '../workshop/say';

const EYEBROW = 'Division · make equal groups';
const TITLE = HOW_MANY_GROUPS_META.title;

/**
 * The stimulus used to arrive pre-grouped — a `marginLeft` every `per` items on
 * a wrapping row, which both solved the problem for the child and stopped
 * matching `per` once the row wrapped. Here the items start as one heap and the
 * grouping is something the child performs: each filled vessel is a real
 * element holding exactly `per` items, so "the picture shows the groups" is a
 * fact about the DOM and can be checked, rather than a claim about a margin.
 */
const HEAP: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.4rem',
  maxWidth: '26rem',
  padding: '0.5rem',
  border: '1px dashed var(--rule)',
  borderRadius: 'var(--radius-sm)',
};

const VESSEL: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.4rem',
  border: '1px solid var(--rule-strong)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--paper-sunken)',
};

const TRAY: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '0.5rem',
  width: '100%',
};

const PIECE: CSSProperties = {
  fontSize: 'clamp(1.3rem, 1rem + 1.1vw, 1.9rem)',
  lineHeight: 1,
};

const CAPTION: CSSProperties = {
  width: '100%',
  color: 'var(--ink-faint)',
  fontSize: 'var(--step--1)',
  textAlign: 'center',
};

const CONTROLS: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  marginTop: 'var(--space-2)',
};

export function HowManyGroupsGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [filled, setFilled] = useState(0);
  const [score, setScore] = useState(0);

  const round = GROUP_ROUNDS[index % GROUP_ROUNDS.length];
  const answer = groupAnswer(round);
  const opts = getGroupOptions(index);
  const answered = chosen !== null;
  const feedback = answered ? getGroupFeedback(round, chosen) : '';

  const loose = round.total - filled * round.per;
  const canFill = loose >= round.per;

  const description =
    filled === 0
      ? `A heap of ${counted(round.total, round.item)}, not yet sorted.`
      : `${counted(filled, round.vessel)} filled with ${counted(round.per, round.item)} in each` +
        (loose === 0
          ? '. The heap is empty.'
          : `, and ${counted(loose, round.item)} still in the heap.`);

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    // The reveal: the grouping is carried out in full, remainder and all.
    setFilled(answer);
    if (value === answer) setScore((s) => s + 1);
  }

  function next() {
    const nextIndex = (index + 1) % GROUP_ROUNDS.length;
    setIndex(nextIndex);
    setChosen(null);
    setFilled(0);
    say(groupPrompt(GROUP_ROUNDS[nextIndex]));
  }

  return (
    <section className="mini-game" aria-labelledby="how-many-groups-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="how-many-groups-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage" data-testid="stage">
        <div style={TRAY} role="img" aria-label={description} data-testid="tray">
          {Array.from({ length: filled }, (_, g) => (
            <div key={`vessel-${g}`} style={VESSEL} data-testid="group" data-per={round.per}>
              {Array.from({ length: round.per }, (_, k) => (
                <span key={k} style={PIECE} data-testid="item">
                  {round.item.glyph}
                </span>
              ))}
            </div>
          ))}

          {loose > 0 ? (
            <div style={HEAP} data-testid="heap">
              {Array.from({ length: loose }, (_, k) => (
                <span key={k} style={PIECE} data-testid="item">
                  {round.item.glyph}
                </span>
              ))}
            </div>
          ) : null}

          {filled > 0 && !canFill && loose > 0 ? (
            <p style={CAPTION} data-testid="leftover-caption">left over</p>
          ) : null}
        </div>

        {answered ? null : (
          <div style={CONTROLS}>
            <button
              type="button"
              className="mini-game__next"
              data-testid="fill"
              disabled={!canFill}
              onClick={() => setFilled((f) => f + 1)}
            >
              Fill a {round.vessel.singular}
            </button>
            <button
              type="button"
              className="mini-game__next"
              data-testid="tip-out"
              disabled={filled === 0}
              onClick={() => setFilled(0)}
            >
              Tip them out
            </button>
          </div>
        )}
      </div>

      <p className="mini-game__prompt" data-testid="prompt">{groupPrompt(round)}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            data-testid="option"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {groupOptionLabel(o)}
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
        <>
          <p className="mini-game__hint">
            Fill one {round.vessel.singular} at a time, then count the {round.vessel.plural} you
            filled. Some rounds leave a few over.
          </p>
          {canSpeak() ? (
            <p className="mini-game__hint">
              <button
                type="button"
                className="mini-game__next"
                onClick={() => say(groupPrompt(round))}
              >
                Read the question out
              </button>
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

export default HowManyGroupsGame;
