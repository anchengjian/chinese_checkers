import { NotFound, Redirect } from 'COMPONENT';

import game from './game';
import about from './about';
import MainRouter from './user';

// 把 game 游戏界面作为主界面
MainRouter.childRoutes = [
  game,
  about,

  // 强制“刷新”页面的 hack
  { path: 'redirect', component: Redirect },

  // 无路由匹配, 404
  { path: '*', component: NotFound }
];

export default MainRouter;

/*
  当前路由树如下
  ├ /
  ├ /game
  ├ /about
  ├ /redirect
*/
