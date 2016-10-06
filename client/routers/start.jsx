import { Start } from 'COMPONENT';
import createContainer from 'UTIL/create_container';
// import * as gameAction from 'ACTION/game.action';
import * as userAction from 'ACTION/user.action';

import layout from 'VIEW/layout';

export default {
  path: '/',

  // 全局布局基页
  component: layout,

  indexRoute: {
    getComponent(nextState, cb) {

      // 组件连接 state, 注入 props
      const StartContainer = createContainer(
        ({ game, user }) => ({ game, user }), // mapStateToProps
        userAction // mapActionCreators
      )(Start);
      cb(null, StartContainer);
    }
  }
};
