// 为了兼容 Node 所以接下来的模块化方式

// 区别是不是 Node 环境
if (typeof window !== 'undefined') {

  exports.serverHost = 'http://localhost:8000';

  // 全局的xhr
  // https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch
  exports.xhrConfig = {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    mode: 'cors',
    credentials: 'credentials',
    cache: 'default'
  };
} else {
  exports.serverConfig = {
    httpServer: {
      port: 8000,
      pulicPath: './dist'
    }
  };

}

// app的info信息
exports.appInfo = {
  name: 'Chinese Checkers',
  title: 'Chinese Checkers by React.js & Socket.io.',
  keywords: 'Chinese Checkers,React.js,Socket.io,中国跳棋',
  description: 'Chinese Checkers by React.js & Socket.io. 一个由 React 为主要轮子写的中国跳棋，加上 Socket.io 通信，使两端都能链接玩耍。女朋友最近对这个跳棋游戏有些上瘾啊，想在某东上面买一副跳棋回来陪她下，可是要几十啊，算了，自己写个吧，又不是很难的东西，2333333333。',
  webAppTitle: 'Chinese Checkers',
  version: '0.1.0',
  copyRight: '©2016 blog.anchengjian.com'
};
