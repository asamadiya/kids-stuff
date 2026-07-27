import ComicSelGame from './ComicSelGame';
import { BRAVE_FEELINGS_META, BRAVE_FEELINGS_SCENARIOS } from '../games/brave-feelings';

export function BraveFeelingsGame() {
  return <ComicSelGame meta={BRAVE_FEELINGS_META} scenarios={BRAVE_FEELINGS_SCENARIOS} />;
}

export default BraveFeelingsGame;
