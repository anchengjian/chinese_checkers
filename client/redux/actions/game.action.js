// action 类型
export const ADD = 'ADD_FIELD';
export const DEL = 'DEL_FIELD';
export const UPDATE = 'UPDATE_FIELD';

// action 创建函数
export function addGame(payload) {
  return { type: ADD, payload };
}

export function delGame(key) {
  return { type: DEL, key };
}

export function updateGame(key, val) {
  return { type: UPDATE, key, val };
}
