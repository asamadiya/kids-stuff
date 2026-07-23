import ComicSelGame from './ComicSelGame';
import { EVERYONE_INCLUDED_META, EVERYONE_INCLUDED_SCENARIOS } from '../games/everyone-included';

export function EveryoneIncludedGame() {
  return <ComicSelGame meta={EVERYONE_INCLUDED_META} scenarios={EVERYONE_INCLUDED_SCENARIOS} />;
}

export default EveryoneIncludedGame;
