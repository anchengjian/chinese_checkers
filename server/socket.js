'use strict';

const _ = require('lodash');
const log = require('./log.js');

class Socket {
  constructor(app) {
    // 先启一个socket服务
    this.io = require('socket.io')(app.httpServer);

    // 建立长连接后开始执行逻辑
    this.io.on('connection', function(socket) {
      let socketId = socket.id;
      log('建立了一个socket的长连接哦', socketId);

      // socket._events = {
      //   'test': function(from, msg) { }
      // };

      socket.on('disconnect', () => log('断开了一个连接', 'socketId=>', socketId));
      socket.on('error', () => log('一个错误了', 'socketId=>', socketId));

      socket.on('hello', (msg) => {
        log('一个官方的正式握手');
        socket.emit('word', '666');
      });
    });
  }
  emitToAll(socket = this.io.sockets, eventName, data) {
    socket.emit(eventName, data);
    log('返回给客户端一个事件', eventName, data);
  }
}

// socket 的逻辑
module.exports = function(app, store) {
  return new Socket(app, store);
};
