import { UserLogin } from 'COMPONENT';
import createContainer from 'UTIL/create_container';
import * as userAction from 'ACTION/user.action';

import layout from 'VIEW/layout';

export default {
  path: '/',

  // 全局布局基页
  component: layout,

  // 页面布局
  indexRoute: {
    getComponent(nextState, cb) {
      // 组件连接 state, 注入 props
      const loginContainer = createContainer(
        ({ user }) => ({ user }), // mapStateToProps
        userAction // mapActionCreators
      )(UserLogin);

      cb(null, loginContainer);
    }
  }
};
