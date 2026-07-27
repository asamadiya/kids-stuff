import ComicSelGame from './ComicSelGame';
import { SAYING_SORRY_META, SAYING_SORRY_SCENARIOS } from '../games/saying-sorry';

export function SayingSorryGame() {
  return <ComicSelGame meta={SAYING_SORRY_META} scenarios={SAYING_SORRY_SCENARIOS} />;
}

export default SayingSorryGame;
