import { useMemo, useState } from 'react';
import {
  MEMORY_PAIRS_META,
  buildDeck,
  matchFeedback,
  winFeedback,
  memoryHint,
  PAIRS_PER_ROUND,
  type MemoryCard,
} from '../games/memory-pairs';

const EYEBROW = 'Memory Game';
const TITLE = MEMORY_PAIRS_META.title;

export function MemoryPairsGame() {
  const [round, setRound] = useState(0);
  const deck = useMemo<readonly MemoryCard[]>(() => buildDeck(round), [round]);

  const [flipped, setFlipped] = useState<readonly number[]>([]);
  const [matched, setMatched] = useState<readonly number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const foundPairs = matched.length / 2;
  const solved = foundPairs === PAIRS_PER_ROUND;

  function choose(cardId: number) {
    if (matched.includes(cardId) || flipped.includes(cardId)) return;

    // Two already showing an unresolved pair -> reset before flipping the new one.
    if (flipped.length === 2) {
      setFlipped([cardId]);
      setFeedback('');
      return;
    }

    const next = [...flipped, cardId];
    setFlipped(next);

    if (next.length === 2) {
      const a = deck.find((c) => c.id === next[0]);
      const b = deck.find((c) => c.id === next[1]);
      const isMatch = !!a && !!b && a.pairId === b.pairId;
      setFeedback(matchFeedback(isMatch));
      if (isMatch) {
        setMatched((m) => [...m, next[0], next[1]]);
        setScore((s) => s + 1);
        setFlipped([]);
      }
    } else {
      setFeedback('');
    }
  }

  function playAgain() {
    setRound((r) => r + 1);
    setFlipped([]);
    setMatched([]);
    setFeedback('');
  }

  function isShown(card: MemoryCard) {
    return matched.includes(card.id) || flipped.includes(card.id);
  }

  return (
    <section className="mini-game" aria-labelledby="memory-pairs-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="memory-pairs-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} found`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">found</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__grid" aria-label="Memory cards">
          {deck.map((card) => {
            const shown = isShown(card);
            const isMatched = matched.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                className={`mini-option${flipped.includes(card.id) ? ' is-chosen' : ''}${
                  isMatched ? ' is-correct' : ''
                }`}
                aria-pressed={shown}
                aria-label={shown ? `Card showing ${card.emoji}` : 'Face-down card'}
                disabled={isMatched}
                onClick={() => choose(card.id)}
              >
                <span className="mini-game__emoji" aria-hidden="true">
                  {shown ? card.emoji : '?'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mini-game__prompt">
        {solved ? winFeedback() : 'Find the two cards that match!'}
      </p>

      {solved ? (
        <div className="mini-game__feedback">
          <p role="status">{winFeedback()}</p>
          <button type="button" className="mini-game__next" onClick={playAgain}>
            Play again <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : feedback ? (
        <div className="mini-game__feedback">
          <p role="status">{feedback}</p>
        </div>
      ) : (
        <p className="mini-game__hint">{memoryHint(foundPairs)}</p>
      )}
    </section>
  );
}

export default MemoryPairsGame;
