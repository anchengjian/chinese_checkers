import { NotFound, Redirect } from 'COMPONENT';

import MainRouter from './game';
import about from './about';
import user from './user';

// 把 game 游戏界面作为主界面
MainRouter.childRoutes = [
  about,
  user,

  // 强制“刷新”页面的 hack
  { path: 'redirect', component: Redirect },

  // 无路由匹配, 404
  { path: '*', component: NotFound }
];

export default MainRouter;

/*
  当前路由树如下
  ├ /
  |
  ├ /redirect
*/
