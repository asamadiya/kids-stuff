import ComicSelGame from './ComicSelGame';
import { WIN_OR_LOSE_META, WIN_OR_LOSE_SCENARIOS } from '../games/win-or-lose';

export function WinOrLoseGame() {
  return <ComicSelGame meta={WIN_OR_LOSE_META} scenarios={WIN_OR_LOSE_SCENARIOS} />;
}

export default WinOrLoseGame;
