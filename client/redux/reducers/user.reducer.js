import { ADD_INFO, UPDATE_INFO } from 'ACTION/user.action';

const userInfo = {
  name: '233333'
};

export default function(state = userInfo, action) {
  let oldState = Object.assign({}, state);

  switch (action.type) {
    case ADD_INFO:
      return Object.assign(oldState, action.payload);

    case UPDATE_INFO:
      oldState[action.key] = action.val;
      return oldState;

    default:
      return oldState;
  }
}
