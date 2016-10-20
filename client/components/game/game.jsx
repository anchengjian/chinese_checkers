import './game.scss';

import React, { Component } from 'react';
import notify from 'UTIL/notify';

import Checkers from './checkers';
import { joinRoom, leaveRoom, sendMsg, otherPlayerMove } from 'SERVICE/socket.service';

export default class GameComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

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
    // 加入游戏房间，失败到首页
    let data = this.props.location.query;
    data.userName = this.props.user.name;
    joinRoom(data, (msg) => {
      if (msg.error) this.props.history.pushState(null, '/');
    });

    // 开始游戏，互传消息
    let game = this.props.game;
    this.checkerGame = new Checkers(this.refs.gameCanvas, data.players);
    // 自己动了告诉其他人
    this.checkerGame.palyerMove = (ev, piece) => {
      // this.props.updateGame(game.player, [ev, piece]);
      sendMsg(game.player, [ev, piece]);
    };
    otherPlayerMove((player, move) => {
      this.checkerGame.clickHandle(...move);
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }

  componentWillUnmount() {
    leaveRoom();
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
