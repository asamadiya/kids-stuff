import ComicSelGame from './ComicSelGame';
import { CALM_DOWN_META, CALM_DOWN_SCENARIOS } from '../games/calm-down';

export function CalmDownGame() {
  return <ComicSelGame meta={CALM_DOWN_META} scenarios={CALM_DOWN_SCENARIOS} />;
}

export default CalmDownGame;
