import { NameTheFeelingGame } from './NameTheFeelingGame';
import { RikkiMascot } from './RikkiMascot';
import '../styles/play.css';

export interface PlayHubProps {
  readonly onExit: () => void;
}

const COMING_GAMES = [
  {
    title: 'Count with Rikki',
    icon: '123',
    copy: 'Count playful objects and build number confidence.',
    color: 'sun',
  },
  {
    title: 'Pattern Parade',
    icon: '◇○',
    copy: 'Spot what comes next in colorful shape and sound patterns.',
    color: 'berry',
  },
] as const;

export function PlayHub({ onExit }: PlayHubProps) {
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
            Play gentle games that help you notice feelings, numbers, patterns,
            shapes, and the world around you.
          </p>
        </div>
        <RikkiMascot className="play-hub__rikki" />
      </header>

      <NameTheFeelingGame />

      <section className="game-shelf" aria-labelledby="more-games-title">
        <div className="game-shelf__head">
          <p className="game-shelf__eyebrow">More play is growing</p>
          <h2 id="more-games-title" className="game-shelf__title">
            Next in the game box
          </h2>
        </div>
        <div className="game-shelf__grid">
          {COMING_GAMES.map((game) => (
            <article
              key={game.title}
              className={`game-card game-card--${game.color}`}
              aria-label={`${game.title}, coming soon`}
            >
              <span className="game-card__icon" aria-hidden="true">
                {game.icon}
              </span>
              <div>
                <p className="game-card__status">Coming soon</p>
                <h3 className="game-card__title">{game.title}</h3>
                <p className="game-card__copy">{game.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PlayHub;
