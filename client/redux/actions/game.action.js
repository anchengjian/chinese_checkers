// action 类型
export const ADD_INFO = 'ADD_INFO';
export const UPDATE_INFO = 'UPDATE_INFO';

// action 创建函数
export function addUserInfo(payload) {
  return { type: ADD_INFO, payload };
}

export function updateUserInfo(key, val) {
  return { type: UPDATE_INFO, key, val };
}
