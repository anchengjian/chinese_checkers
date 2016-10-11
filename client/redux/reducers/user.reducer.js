import { ADD_INFO, UPDATE_INFO } from 'ACTION/user.action';
import { getUserName } from 'SERVICE/user.service';
import storage from 'UTIL/storage';

let userInfo = storage.get('userInfo') || { name: '' };

if (!userInfo.name && userInfo.name !== 0) {
  getUserName().then((data) => {
    userInfo.name = data.data;
  });
}

export default function(state = userInfo, action) {
  let oldState = Object.assign({}, state);

  switch (action.type) {
    case ADD_INFO:
      oldState = Object.assign(oldState, action.payload);
      break;
    case UPDATE_INFO:
      oldState[action.key] = action.val;
      break;
    default:
  }
  storage.set('userInfo', oldState);
  return oldState;
}
