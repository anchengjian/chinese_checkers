'use strict';

const _ = require('lodash');
const log = require('./log.js');

class Socket {
  constructor(app) {
    // 先启一个socket服务
    this.io = require('socket.io')(app.httpServer);

    // 房间信息
    this.roomInfo = {
      // roomID: {
      //   id: roomID,
      //   numOfPlayers: 2,
      //   players: [
      //     { name: 'tom', playerID: 'A'},
      //   ]
      // }
    };

    this.socketRunWithEvents();
  }

  socketRunWithEvents() {
    // 建立长连接后开始执行逻辑
    this.io.on('connection', (socket) => {
      log('建立了一个socket的长连接哦', socket.id);

      // getRoomIdByLength
      socket.on('getRoomByNum', (num, callback) => {
        callback(this.getRoomByNum(num));
      });

      // 加入房间
      let user = '';
      let roomID = '';
      socket.on('joinRoom', (data, callback) => {
        user = data.userName;
        roomID = data.roomID;
        callback(this.joinRoom(socket, user, roomID, ~~data.numofplayers));
      });

      // 离开房间
      socket.on('leaveRoom', () => socket.emit('disconnect'));
      socket.on('disconnect', () => this.leaveRoom(socket, user, roomID));
      socket.on('error', () => log('一个错误了', 'socketId=>', socket.id));

      // 游戏移动棋子的状态中转
      socket.on('selfMove', (data) => {
        log('收到一个玩家的运动', data);
        this.io.to(roomID).emit('otherMove', data);
      });
    });
  }

  getRoomByNum(num) {
    for (let i in this.roomInfo) {
      if (!this.roomInfo.hasOwnProperty(i)) continue;
      let room = this.roomInfo[i];
      if (room.numOfPlayers === num && num > room.players.length) return room;
    }
    let newRoom = this.createRoom(num);
    return newRoom;
  }

  joinRoom(socket, user, roomID, len) {
    if (!user || !roomID || !this.roomInfo.hasOwnProperty(roomID) || this.roomInfo[roomID].numOfPlayers !== len) return { error: true, msg: '加入房间：参数错误' };
    // 做断网刷新等容错处理
    let room = this.roomInfo[roomID];
    let index = -1;
    let player = room.players.filter((v, i) => {
      if (v.name === user) {
        index = i;
        return true;
      }
    })[0];
    if (player) {
      if (player.active) return { error: true, msg: '加入房间：已有同名活跃玩家' };
      room.players[index].active = true;
    } else {
      // 将新用户昵称加入房间名单中
      index = room.players.length;
      room.players.push({ name: user, active: true });
    }
    socket.join(roomID); // 加入房间
    // 通知房间内人员
    this.sendSysMsg(roomID, { user, msg: '加入了房间' });
    return { error: false, msg: '加入房间：成功', index, room: this.roomInfo[roomID] };
  }

  leaveRoom(socket, user, roomID) {
    log('断开了一个连接', 'socketId=>', socket.id);
    // 从房间名单中移除
    if (!this.roomInfo.hasOwnProperty(roomID)) return;
    socket.leave(roomID); // 退出房间
    let room = this.roomInfo[roomID];
    let remain = 0;
    room.players = room.players.map((player) => {
      if (player.name === user) player.active = false;
      if (player.active) remain++;
      return player;
    });

    if (remain <= 0 && room.players.length >= room.numOfPlayers) room.used = true;
    this.sendSysMsg(roomID, { user, msg: '退出了房间', roomID });

    this.cleanRoom();
  }

  sendSysMsg(roomID, msg) {
    Object.assign(msg, { type: 'sysMsg' });
    this.io.to(roomID).emit('sysMsg', msg);
  }

  createRoom(numOfPlayers, players = []) {
    if (numOfPlayers > 6 || numOfPlayers < 2) return;
    let id = this.getRoomID();
    let creatAt = new Date().getTime();
    let used = false;
    return this.roomInfo[id] = { id, numOfPlayers, players, creatAt, used };
  }

  getRoomID() {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0;
      let v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  cleanRoom() {
    // 超过一天要被清理 86400000 = 24 * 60 * 60 *1000
    let currentTime = new Date().getTime() - 86400000;
    for (let i in this.roomInfo) {
      let room = this.roomInfo[i];
      if (room.used || room.creatAt < currentTime) delete this.roomInfo[i];
    }
  }
}

// socket 的逻辑
module.exports = function(app, store) {
  return new Socket(app, store);
};
