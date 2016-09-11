import './game.scss';

import React, { Component } from 'react';
import notify from 'UTIL/notify';

import Checkers from './checkers';
import { sendMsg, otherPlayerMove } from 'SERVICE/socket.service';

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
    let game = this.props.game;
    // 初始化 dom 后开始游戏
    this.checkerGame = new Checkers(this.refs.gameCanvas);

    // 自己动了告诉其他人
    this.checkerGame.palyerMove = (ev, chess) => {
      // this.props.updateGame(game.player, [ev, chess]);
      sendMsg(game.player, [ev, chess]);
    };

    otherPlayerMove((player, move) => {
      this.checkerGame.clickHandle(...move);
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // TODO： 接收其他人的消息

  }

  componentWillUnmount() {
    this.checkerGame.destory();
  }

  render() {
    return (
      <section className="game-container">
        <div>
          <canvas ref="gameCanvas" className="game-warp" width={ this.canvasRect.width } height={ this.canvasRect.height }></canvas>
        </div>
      </section>
    );
  }
};
