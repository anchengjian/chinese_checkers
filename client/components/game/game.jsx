import './game.scss';

import React, { Component } from 'react';
import notify from 'UTIL/notify';

import Checkers from './checkers';

export default class GameComponent extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    // canvas 的宽高设置
    this.canvasRect = {
      width: document.body.clientWidth,
      height: document.body.clientWidth * 1.3
    };
  }

  componentDidMount() {
    // 初始化 dom 后开始游戏
    const isDev = true;
    this.checkerGame = new Checkers(this.refs.gameCanvas, isDev);

    setTimeout(() => {
      this.checkerGame.removeEvent();
    }, 100);
  }

  render() {
    return (<section className="game-container">
        <button className="btn btn-primary">开始游戏</button>
        <div>
          <canvas ref="gameCanvas" className="game-warp" width={ this.canvasRect.width } height={ this.canvasRect.height }></canvas>
        </div>
      </section>);
  }
};
