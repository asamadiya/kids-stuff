import ComicSelGame from './ComicSelGame';
import { TELLING_TRUTH_META, TELLING_TRUTH_SCENARIOS } from '../games/telling-truth';

export function TellingTruthGame() {
  return <ComicSelGame meta={TELLING_TRUTH_META} scenarios={TELLING_TRUTH_SCENARIOS} />;
}

export default TellingTruthGame;
