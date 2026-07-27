import ComicSelGame from './ComicSelGame';
import { KIND_FRIEND_META, KIND_FRIEND_SCENARIOS } from '../games/kind-friend';

export function KindFriendGame() {
  return <ComicSelGame meta={KIND_FRIEND_META} scenarios={KIND_FRIEND_SCENARIOS} />;
}

export default KindFriendGame;
