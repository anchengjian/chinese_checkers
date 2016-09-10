import { Game } from 'COMPONENT';
import layout from 'VIEW/layout';
import createContainer from 'UTIL/create_container';
import * as gameAction from 'ACTION/game.action';

export default {
  path: '/',

  // 全局布局基页
  component: layout,

  indexRoute: {
    getComponent(nextState, cb) {

      // 组件连接 state, 注入 props
      const gameContainer = createContainer(
        ({ game, user }) => ({ game, user }), // mapStateToProps
        gameAction // mapActionCreators
      )(Game);

      cb(null, gameContainer);
    }
  }
};
