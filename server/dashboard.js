'use strict';

const _ = require('lodash');
const log = require('./log.js');
let userNames = require('./data.json').names.split(',');

// mock的后台 api router
module.exports = function(app) {
  // 以下为mockserver配置页面逻辑
  app.get('/api/1.0/username/', function(req, res) {
    let index = ~~(Math.random() * userNames.length);
    let data = userNames[index];
    res.send({ data });
    log('/login 来了一个请求');
  });
};
