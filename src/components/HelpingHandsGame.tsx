import ComicSelGame from './ComicSelGame';
import { HELPING_HANDS_META, HELPING_HANDS_SCENARIOS } from '../games/helping-hands';

export function HelpingHandsGame() {
  return <ComicSelGame meta={HELPING_HANDS_META} scenarios={HELPING_HANDS_SCENARIOS} />;
}

export default HelpingHandsGame;
