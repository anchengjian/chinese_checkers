import aboutView from 'VIEW/about';

export default {
  path: 'about',

  // 页面布局
  getComponent(nextState, cb) {
    cb(null, aboutView);
  }
};
