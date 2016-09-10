import { ADD_INFO, UPDATE_INFO } from 'ACTION/game.action';

export default function(state = {}, action) {
  switch (action.type) {

    case ADD_INFO:
      return Object.assign({}, state, action.payload);

    case UPDATE_INFO:
      let oldState = state;
      oldState[action.key] = action.val;
      return oldState;

    default:
      return state;
  }
}
