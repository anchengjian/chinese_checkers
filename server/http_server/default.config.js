'use strict';

module.exports = {
  Expires: {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60 * 60 * 24 * 365
  },
  Compress: {
    match: /css|js|html/ig
  },
  Welcome: {
    file: '/index.html'
  },
  pulicPath: './public',
  port: 80
};
