import redux, { createStore } from 'redux';
import { createRootReducer } from 'REDUCER';

let rootReducer = createRootReducer();

// 实例化 Store
let store = createStore(rootReducer);
export default store;

/*
  目前的 store 中的 state 树
  ├ app    // app.info
  |
  ├ user   // 登陆的 user.info
*/
