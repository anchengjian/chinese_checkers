'use strict';

const _ = require('lodash');
const log = require('./log.js');

class Socket {
  constructor(app) {
    // 先启一个socket服务
    this.io = require('socket.io')(app.httpServer);

    // 房间信息
    this.roomInfo = {};

    this.socketRunWithEvents();
  }
  socketRunWithEvents() {
    // 建立长连接后开始执行逻辑
    this.io.on('connection', function(socket) {
      let socketId = socket.id;
      log('建立了一个socket的长连接哦', socketId);

      socket.on('error', () => log('一个错误了', 'socketId=>', socketId));

      // 无聊,先握手
      // socket.on('hello', (msg) => {
      //   log('一个官方的正式握手');
      //   socket.emit('word', '666');
      // });

      // socket.on('SELF_MOVE', (data) => {
      //   socket.broadcast.emit('OTHER_MOVE', data);
      // });

      let user = '';
      let roomID = '';

      socket.on('join', (data) => {
        user = data.user;
        roomID = data.roomID;
        if (!user || !roomID) return;

        // 将用户昵称加入房间名单中
        if (!this.roomInfo[roomID]) this.roomInfo[roomID] = [];
        this.roomInfo[roomID].push(data);

        socket.join(roomID); // 加入房间
        // 通知房间内人员
        socketIO.to(roomID).emit('sys', user + '加入了房间', this.roomInfo[roomID]);
      });

      socket.on('leave', () => socket.emit('disconnect'));

      socket.on('disconnect', () => {
        log('断开了一个连接', 'socketId=>', socketId);
        // 从房间名单中移除
        var index = this.roomInfo[roomID].indexOf(user);
        if (index >= 0) this.roomInfo[roomID].splice(index, 1);

        socket.leave(roomID); // 退出房间
        socketIO.to(roomID).emit('sys', user + '退出了房间', this.roomInfo[roomID]);
      });

      // 接收用户消息,发送相应的房间
      socket.on('message', (msg) => {
        // 验证如果用户不在房间内则不给发送
        if (this.roomInfo[roomID].indexOf(user) === -1) return;
        socketIO.to(roomID).emit('msg', user, msg);
      });

    });
  }
}

// socket 的逻辑
module.exports = function(app, store) {
  return new Socket(app, store);
};
