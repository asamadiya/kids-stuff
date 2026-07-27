import ComicSelGame from './ComicSelGame';
import { SHARING_TURNS_META, SHARING_TURNS_SCENARIOS } from '../games/sharing-turns';

export function SharingTurnsGame() {
  return <ComicSelGame meta={SHARING_TURNS_META} scenarios={SHARING_TURNS_SCENARIOS} />;
}

export default SharingTurnsGame;
