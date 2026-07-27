import ComicSelGame from './ComicSelGame';
import { MAKING_FRIENDS_META, MAKING_FRIENDS_SCENARIOS } from '../games/making-friends';

export function MakingFriendsGame() {
  return <ComicSelGame meta={MAKING_FRIENDS_META} scenarios={MAKING_FRIENDS_SCENARIOS} />;
}

export default MakingFriendsGame;
