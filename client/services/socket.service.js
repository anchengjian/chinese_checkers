import io from 'socket.io-client';
import { serverHost } from 'CONFIG/app.config';
const socket = io(serverHost);
export default socket;

socket.emit('hello', '233');
socket.on('word', function(msg) {
  console.log('握手成功。message: ' + msg);
});

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
