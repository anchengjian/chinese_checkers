// 辅助
import socket from 'SERVICE/socket.service';

// action 类型
export const ADD = 'ADD_FIELD';
export const DEL = 'DEL_FIELD';
export const UPDATE = 'UPDATE_FIELD';

export const SELF_MOVE = 'SELF_MOVE';
export const OTHER_MOVE = 'OTHER_MOVE';

// action 创建函数
export function addGame(payload) {
  return { type: ADD, payload };
}

export function delGame(key) {
  return { type: DEL, key };
}

export function updateGame(key, val) {
  if (key !== 'player') sendMsg(key, val);
  return { type: UPDATE, key, val };
}

// 本身玩家落子了，通知另一个
export function sendMsg(key, val) {
  socket.emit(SELF_MOVE, val);
}

// 接收到另一个玩家落子了
socket.on(OTHER_MOVE, (data) => {
  playerMove(data.player, data.data);
});

export function playerMove(player, move) {
  return { type: UPDATE, player, move };
}
