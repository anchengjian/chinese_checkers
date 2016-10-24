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
      console.log(msg);
      if (!msg || msg.error || !msg.room || msg.index < 0) return this.props.history.pushState(null, '/');
      // 开始游戏，互传消息
      this.checkerGame = new Checkers(this.refs.gameCanvas, msg.index, data.numOfPlayers);

      this.checkerGame.palyerMove = (ev, piece) => {
        sendMsg(this.checkerGame.current.playerID, [ev, piece]);
      };

      otherPlayerMove((player, move) => {
        if (player === this.checkerGame.current.playerID) return;
        this.checkerGame.clickHandle(...move);
      });
    });

  }

  componentWillUnmount() {
    if (this.checkerGame) {
      leaveRoom();
      this.checkerGame.destory();
    }
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
