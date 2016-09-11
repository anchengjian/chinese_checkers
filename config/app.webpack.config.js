const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const manifest = require('./manifest.json');

const ip = getIP()[1];
const serverPath = `http://${ip}:8080/`;
const isDev = process.argv[2] === '--hot';

// 这个用法有点233
process.env.NODE_ENV = isDev ? 'development' : 'production';

const src = path.resolve(__dirname, '../client');

let config = {
  entry: {
    app: isDev ? ['webpack/hot/dev-server', './client/app.jsx'] : ['./client/app.jsx']
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', 'scss', 'html'],
    modulesDirectories: ['node_modules'],
    alias: {
      // 自定义路径别名
      COMPONENT: path.join(src, 'components'),
      ACTION: path.join(src, 'redux/actions'),
      REDUCER: path.join(src, 'redux/reducers'),
      STORE: path.join(src, 'redux/store'),
      ROUTE: path.join(src, 'routers'),
      SERVICE: path.join(src, 'services'),
      VIEW: path.join(src, 'views'),
      UTIL: path.join(src, 'utils'),
      CONFIG: path.join(__dirname)
    }
  },
  cache: true,
  output: {
    publicPath: isDev ? serverPath : './',
    path: './dist/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    noParse: [],
    preLoaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-2', 'react']
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}')
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version"]}!sass-loader')
    }, {
      test: /\.(jpe?g|png|gif|svg|webp)$/,
      loader: 'url?limit=8192&name=imgs/[name].[ext]'
    }, {
      test: /\.json$/,
      loader: 'file?name=data/[name].[ext]'
    }, {
      test: /\.(svg|ttf|eot|woff|woff2)/,
      loader: 'file?name=fonts/[name].[ext]'
    }]
  },
  eslint: {
    emitError: true,
    emitWarning: true,
    failOnWarning: true,
    failOnError: true,
    configFile: '.eslintrc'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: manifest
    }),
    // new webpack.ProvidePlugin({
    //   React: 'react',
    //   ReactDOM: 'react-dom'
    // }),
    new ExtractTextPlugin('css/[name].css')
  ]
};

// HtmlWebpackPlugin
const appInfo = require('./app.config.js').appInfo;
let htmlOptions = Object.assign({}, appInfo, {
  filename: './index.html',
  template: './client/index.html',
  inject: 'body',
  hash: true,
  minify: {
    removeComments: !isDev,
    collapseWhitespace: !isDev
  }
});
config.plugins.push(new HtmlWebpackPlugin(htmlOptions));

// UglifyJsPlugin
if (!isDev) {
  let uglify = new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  });
  config.plugins.push(uglify);
}

// getIP
function getIP() {
  const os = require('os');
  let ips = [];
  let network = os.networkInterfaces();
  for (let i in network) {
    let arr = network[i];
    arr.forEach((json, i) => {
      if (json.family == 'IPv4') ips.push(json.address);
    });
  }
  return ips;
}

module.exports = config;
