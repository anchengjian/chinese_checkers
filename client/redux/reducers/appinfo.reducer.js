import { appInfo } from 'CONFIG/app.config';

export default function todos(state = appInfo, action) {
  switch (action.type) {

    case 'UPDATE':
      let oldState = state;
      oldState[action.key] = action.val;
      return oldState;

    default:
      return state;
  }
}
