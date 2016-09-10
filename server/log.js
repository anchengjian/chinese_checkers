module.exports = function(...msg) {
  let data = `--------------------
${new Date()}
${msg}
`;
  // 输出到屏幕
  console.log(data);
}
