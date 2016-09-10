#!/usr/bin/env node

'use strict';
const _ = require('lodash');

let serverConfig = require('../config/app.config.js').serverConfig;

// 生成http server 实例
let app = require('./http_server/')(serverConfig.httpServer);

// mock的后台图形化设置界面
let dashboard = require('./dashboard.js')(app);

// socket 服务的拦截、代理等功能
let socketRules = require('./socket.js')(app);
