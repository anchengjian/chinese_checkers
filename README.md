# Chinese Checkers 中国跳棋
女朋友最近对这个跳棋游戏有些上瘾啊，想在某东上面买一副跳棋回来陪她下，可是要几十啊，算了，自己写个吧，又不是很难的东西，2333333333。

## 目录
#### [技术栈](#features)
#### [快速开始](#getting-started)
  * [安装依赖](#dependencies)
  * [初始化Libs](#init-libs)
  * [前端项目调试开发](#dev-for-fe)
  * [前端项目编译](#deploy-for-fe)
  * [服务端](#dev-for-server)

#### [项目架构](#architecture)
  * [目录结构](#tree)
  * [特色](#character)

#### [规范](#standard)
  * [CSS](#css)
  * [JS](#eslint)
  * [提交代码](#commit)

## <a name="features">技术栈</a>
> 详情可参阅 `package.json`

* React 15.3.1
* Redux
* React Router
* Fetch
* Webpack
* ES6 + Babel
* Node.js `>=6.4.0`
* Socket.io
* Sass

## <a name="getting-started">快速开始</a>

### <a name="dependencies">安装依赖</a>
```bash
# 推荐切换到淘宝 npm 源
npm set registry https://registry.npm.taobao.org/

npm install
```
请升级到 `>= node 6.4` + `>= npm 3.10` 环境  

### <a name="init-libs">初始化Libs </a>
```bash
npm run libs
```
在这个项目中初始化的时候，您必须先运行一次，以获得打包好的 `libs`;
原因参照：[用DllPlugin来优化webpack打包速度](http://blog.anchengjian.com/#!/posts/2016/%E5%AE%9E%E8%B7%B5DllPlugin%E6%9D%A5%E4%BC%98%E5%8C%96webpack%E6%89%93%E5%8C%85%E9%80%9F%E5%BA%A6.md)   

### <a name="dev-for-fe">前端项目调试开发 </a>
```bash
npm run dev
```

### <a name="deploy-for-fe">前端项目编译 </a>
```bash
npm run deploy
```

### <a name="dev-for-server">服务端 </a>
```bash
npm run server
```

## <a name="architecture">目录架构 </a>
### <a name="tree">目录 </a>
```
├─build                      # 打包编译出来的app
├─config                     # 配置文件夹
│  ├─app.config.js           # 整个应用的一些配置，包括 xhr、应用信息等的
│  ├─app.webpack.config.js   # 前端中调试开发、打包的 webpack 配置
│  ├─libs.webpack.config.js  # 前端的 libs 配置
│  └─manifest.json           # 前端 libs 打包的缓存信息
├─dist                       # 前端编译的静态资源文件夹
├─doc                        # 文档、项目设计等
├─client                     # 前端开发文件夹
│  ├─assets
│  │  ├─imgs
│  │  └─scss                 # 自制的 ui 组件库
│  ├─components              # 组件，与页面强相关
│  ├─redux                   # redux
│  │  ├─actions 
│  │  ├─reducers 
│  │  └─store 
│  ├─routers                 # router 的集散地，主要 connet
│  ├─services                # 整个应用的服务，主要跟 xhr 相关的
│  ├─utils                   # 公共的一些方法
│  ├─views                   # 主要页面布局，木偶组件
│  ├─app.js                  # app 启动
│  └─index.html              # 静态页面基页
├─server                     # 服务端开发文件夹
├─test                       # 测试
├─.babelrc                   # Babel 转码配置
├─.eslintrc                  # ESLint 配置
├─.gitignore                 # （配置）需被 Git 忽略的文件（夹）
├─package.json               # 不解释
└─README.md                  # 不解释
```

### <a name="character">特色</a>
* 本示例项目秉承最佳实践，地实现代码分离/复用
* 优化目录结构，更好的模块分离
* 引入服务层统一管理 XHR 请求（Fetch 实现）
* 引入 `路径别名` 实现优雅的加载模式
* 引入 `React Hot Reload`，支持热替换
* 使用 `Sode.js` 粗略实现了一套类 `Express` （天差地别的，但好歹是自己实现的）
* 使用 `Socket.io` 支持在线对战

## <a name="standard">规范</a>
[HTML/CSS 参考](https://github.com/doyoe/html-css-guide)

### <a name="css">CSS</a>
[CSS 开发规范](https://github.com/frozenui/frozenui/blob/master/doc/css.md)

### <a name="eslint">JS</a>
> 详情可参阅 `.eslintrc`
[JavaScript 编码规范](https://github.com/yuche/javascript)

### <a name="commit">提交代码</a>
[commit](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
####Type explain
>feat     | 新功能   
>fix      | 修补bug   
>docs     | 文档(documentation)   
>style    | 格式(不影响代码运行的变动)   
>refactor | 重构(即不是新增功能，也不是修改bug的代码变动)   
>test     | 增加测试   
>chore    | 构建过程或辅助工具的变动   

####Example
```bash
git commit -m "<type>(<scope>): <subject>"
# practical examples
git commit -m 'docs: 增加了git msg规范'
```

###包含功能
* 重来
* 悔棋

