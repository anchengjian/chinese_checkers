const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const fs = require('fs');
const indexPath = path.resolve(__dirname, '../src/index.html');

// 同步是为了确保webpack在执行前得到的经过调整的文件
let indexFile = fs.readFileSync(indexPath, 'utf-8').toString().replace(/\<script\ type\=\"text\/javascript\"\ src\=\"\.\/js\/libs\.js.*?\>\<\/script\>/, '');
fs.writeFile(indexPath, indexFile, 'utf-8');

module.exports = {
  entry: {
    libs: ['react', 'react-dom', 'react-router', 'redux', 'react-redux']
  },
  output: {
    publicPath: './',
    path: './dist/',
    filename: 'js/[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DefinePlugin({
      // development
      // production
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.DllPlugin({
      context: __dirname,
      path: './config/manifest.json',
      name: '[name]'
    }),
    new HtmlWebpackPlugin({
      filename: '../src/index.html',
      template: 'raw!./src/index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: false,
        collapseWhitespace: false
      }
    })
  ]
};
