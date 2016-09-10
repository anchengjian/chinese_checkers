import { ADD, UPDATE, DEL } from 'ACTION/game.action';

// 默认A和D角色进行对战
const gameData = {
  player: 'A',
  'A': {
    // move: [ev, chess]
  },
  'D': {
    // move: [ev, chess]
  }
};

export default function(state = gameData, action) {
  let oldState = Object.assign({}, state);
  switch (action.type) {

    case ADD:
      return Object.assign({}, state, action.payload);

    case DEL:
      delete oldState[action.key];
      return oldState;

    case UPDATE:
      oldState[action.key] = action.val;
      return oldState;

    default:
      return oldState;
  }
}
