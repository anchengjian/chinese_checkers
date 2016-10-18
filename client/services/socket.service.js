import io from 'socket.io-client';
import { serverHost } from 'CONFIG/app.config';
const socket = io(serverHost);
export default socket;

// socket.emit('hello', '233');
// socket.on('word', function(msg) {
//   console.log('握手成功。message: ' + msg);
// });

const SELF_MOVE = 'SELF_MOVE';
const OTHER_MOVE = 'OTHER_MOVE';

// 本身玩家落子了，通知另一个
export function sendMsg(key, move) {
  socket.emit(SELF_MOVE, { player: key, move });
}

// 接收到另一个玩家落子了
export function otherPlayerMove(cb) {
  socket.on(OTHER_MOVE, (data) => {
    if (typeof cb === 'function') cb(data.player, data.move);
  });
}

// 加入房间
socket.on('connect', function() {
  socket.emit('join', 'userName');
});

// 监听消息
socket.on('msg', function(userName, msg) {

});

// 监听系统消息
socket.on('sys', function(sysMsg, users) {

});
// 发送消息
// socket.send(msg);

// 退出房间
// socket.emit('leave');
