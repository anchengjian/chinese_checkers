'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const _ = require('lodash');

const log = require('../log.js');
const mime = require('./mine.js');
let config = require('./default.config.js');

class AppRouter {
  constructor(options) {
    this.router = {
      // '/app/test/':{
      //   'POST': [function(req, res){}],
      //   'GET': function(req, res){}    // 放弃此模式，全部用队列管道模式
      // }
    };

    // 请求过来后的server管道
    this.queue = [cors /* function(req, res){} */ ];

    if (_.isObject(options)) config = _.merge(config, options);
    this.createServer(config);
  }

  use(callback) {
    if (_.isFunction(callback)) this.queue.push(callback);
  }

  request(method, path, callback) {
    if (!path || !_.isString(path)) return log('path 不能为空');
    method = method.toUpperCase() || 'GET';

    let collect = this.router[path];

    if (!collect || !_.isObject(collect)) this.router[path] = {};

    let queue = this.router[path][method];
    if (!queue || !_.isArray(queue)) this.router[path][method] = [];

    if (callback && _.isFunction(callback)) this.router[path][method].push(callback);
  }

  get(path, callback) {
    return this.request('get', path, callback);
  }

  post(path, callback) {
    return this.request('post', path, callback);
  }

  put(path, callback) {
    return this.request('put', path, callback);
  }

  update(path, callback) {
    return this.request('update', path, callback);
  }

  delete(path, callback) {
    return this.request('delete', path, callback);
  }

  run(req, res) {

    // 快捷send
    res.send = function(msg) {
      send(req, res, msg);
      res.sended = true;
    };

    // server 管道服务
    let queueLen = this.queue.length;
    if (queueLen > 0) {
      let next = true;
      let i = 0;
      while (queueLen > i && next) {
        let fn = this.queue[i];
        next = false;
        fn(req, res, () => next = true);
        i++;
      }
    }

    // 已经走完了整个请求的话，没必要走后面的路由啊什么的了
    if (res.sended) return;

    // 路由管道
    let queue = this.router[req.urlParse.path] ? this.router[req.urlParse.path][req.method] : null;
    // if (_.isFunction(queue)) return queue(req, res);
    if (_.isArray(queue)) return queue.forEach((fn, i) => fn(req, res));

    // 静态资源服务
    if (!this.assets(req, res)) return;

    // 404
    sendNotFound(req, res);
  }

  assets(req, res) {
    res.setHeader('Server', 'Node.anchengjian');
    let pathname = req.urlParse.pathname;
    if (pathname.slice(-1) === '/') pathname = pathname + config.Welcome.file;
    let realPath = path.join(config.pulicPath, path.normalize(pathname.replace(/\.\./g, '')));
    return pathHandle(realPath, req, res);
  }

  createServer(config) {
    this.httpServer = http
      .createServer((req, res) => {
        req.setEncoding('utf-8');

        log(req.url);

        let bodyData = '';
        req.on('data', (bodyChunk) => {
          bodyData += bodyChunk;
          // Too much POST data, kill the connection!
          // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (bodyData.length > 1e6) req.connection.destroy();
        });

        req.on('end', () => {
          // 解析body
          req.body = querystring.parse(bodyData);
          // 针对json的降级优雅处理，妈的，一点都不优雅，不过速度还凑合
          if (req.body._jsonData) req.body = JSON.parse(req.body._jsonData);
          req.rawBody = bodyData;

          // 解析URL
          req.urlParse = url.parse(req.url, true);

          this.run(req, res);
        });
      });
    if (config && _.isObject(config) && config.port) {
      this.httpServer.listen(config.port);
      log('server start => port : ', config.port);
    }
  }

};

// 暴露其他模块
module.exports = function(options) {
  return new AppRouter(options);
};

function cors(req, res, next) {
  // 默认允许全部跨域
  res.setHeader('Access-Control-Request-Headers', 'X-Requested-With,accept,origin,mock-case');
  res.setHeader('Access-Control-Request-Method', 'PUT,POST,GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,accept,origin,mock-case')
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:8080/');
  
  if (req.headers['access-control-request-method']) {
    return res.send('朕允许你跨域了');
  }
  next();
}

// server client send msg
function send(req, res, data) {
  data = data || res.body;
  let type = res.contentType;
  if (data && _.isObject(data)) {
    type = 'application/json;charset=utf-8';
    data = JSON.stringify(data);
  }
  if (_.isString(data)) {
    type = 'text/html;charset=utf-8';
    data = data;
  }

  res.writeHead(200, { 'Content-Type': type });
  res.write(data);
  res.end();
}

// server client send 404
function sendNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.write('404');
  res.end();
}

// assets 静态资源服务器方法
function pathHandle(realPath, req, res) {
  // 用fs.stat方法获取文件
  fs.stat(realPath, function(err, stats) {
    if (err || (stats && stats.isDirectory())) return;

    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    let contentType = mime[ext] || 'text/plain';
    res.setHeader('Content-Type', contentType);

    let lastModified = stats.mtime.toUTCString();
    let ifModifiedSince = 'If-Modified-Since'.toLowerCase();
    res.setHeader('Last-Modified', lastModified);

    if (ext.match(config.Expires.fileMatch)) {
      let expires = new Date();
      expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
      res.setHeader('Expires', expires.toUTCString());
      res.setHeader('Cache-Control', 'max-age=' + config.Expires.maxAge);
    }

    if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
      res.writeHead(304, 'Not Modified');
      res.end();
    } else {
      let raw = fs.createReadStream(realPath);
      let acceptEncoding = req.headers['accept-encoding'] || '';
      let matched = ext.match(config.Compress.match);

      if (matched && acceptEncoding.match(/\bgzip\b/)) {
        res.writeHead(200, 'Ok', { 'Content-Encoding': 'gzip' });
        raw.pipe(zlib.createGzip()).pipe(res);
      } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
        res.writeHead(200, 'Ok', { 'Content-Encoding': 'deflate' });
        raw.pipe(zlib.createDeflate()).pipe(res);
      } else {
        res.writeHead(200, 'Ok');
        raw.pipe(res);
      }
    }
    return 'assets 发送成功';
  });
}
