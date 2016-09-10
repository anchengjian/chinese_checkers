import { UserLogin } from 'COMPONENT';
import createContainer from 'UTIL/create_container';
import * as userAction from 'ACTION/user.action';

export default {
  path: 'user',

  // 页面布局
  getComponent(nextState, cb) {
    // 组件连接 state, 注入 props
    const loginContainer = createContainer(
      ({ user }) => ({ user }), // mapStateToProps
      userAction // mapActionCreators
    )(UserLogin);

    cb(null, loginContainer);
  }
};
