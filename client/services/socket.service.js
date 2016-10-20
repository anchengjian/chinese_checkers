import io from 'socket.io-client';
import { serverHost } from 'CONFIG/app.config';
const socket = io(serverHost);
export default socket;

// 本身玩家落子了，通知另一个
export function sendMsg(key, move) {
  socket.emit('selfMove', { player: key, move });
}

// 接收到另一个玩家落子了
export function otherPlayerMove(cb) {
  socket.on('otherMove', (data) => {
    if (typeof cb === 'function') cb(data.player, data.move);
  });
}

// 根据玩家的对战人数选择房间
export function getRoom(num, callback) {
  socket.emit('getRoomByLength', num, function(room) {
    if (room) callback(room);
  });
}

// 加入房间
export function joinRoom(data, callback) {
  socket.emit('joinRoom', data, function(msg) {
    if (msg) callback(msg);
  });
}

// 离开房间
export function leaveRoom(data) {
  socket.emit('leaveRoom', data);
}

// 系统消息
socket.on('sysMsg', function(sysMsg) {
  console.log(sysMsg);
});
