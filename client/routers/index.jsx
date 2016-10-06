import { NotFound, Redirect } from 'COMPONENT';

import MainRouter from './start';
import About from './about';
import Game from './game';

// 把 game 游戏界面作为主界面
MainRouter.childRoutes = [
  About,
  Game,

  // 强制“刷新”页面的 hack
  { path: 'redirect', component: Redirect },

  // 无路由匹配, 404
  { path: '*', component: NotFound }
];

export default MainRouter;

/*
  当前路由树如下
  ├ /
  ├ /about
  ├ /game/:roomID/:players
  ├ /redirect
  ├ /404
*/
