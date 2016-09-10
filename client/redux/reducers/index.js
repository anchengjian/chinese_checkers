import { combineReducers } from 'redux';
import store from 'STORE';

import appInfo from 'REDUCER/appinfo.reducer';
import userReducer from 'REDUCER/user.reducer';
import gameReducer from 'REDUCER/game.reducer';

// 同步的 Reducers（即应用初始化所必需的）
let syncReducers = {
  app: appInfo,
  user: userReducer,
  game: gameReducer
};

// 异步加载的 Reducers（Code Splitting 按需加载的）
let asyncReducers = {};

/**
 * 创建root
 * @method   createRootReducer
 * @author   anchengjian
 * @dateTime 2016-08-31T17:22:41+0800
 * @return   {[type]}                 [description]
 */
export function createRootReducer() {
  return combineReducers({
    ...syncReducers,
    ...asyncReducers
  });
};

/**
 * 按需加载时，立即注入对应的 Reducer
 * @method   injectReducer
 * @author   anchengjian
 * @dateTime 2016-08-31T17:23:09+0800
 * @param    {[type]}                 key     [description]
 * @param    {[type]}                 reducer [description]
 * @return   {[type]}                         [description]
 */
export function injectReducer(key, reducer) {
  asyncReducers[key] = reducer;
  // 替换当前的 rootReducer
  store.replaceReducer(createRootReducer());
};
