import React, { Component } from 'react';
import { Link } from 'react-router';

export default class SetNumOfPlayersComponent extends Component {
  constructor() {
    super();

    this.linkToGame = {
      pathname: '/game/',
      query: {
        roomID: '123456',
        players: '2'
      }
    };

    this.setNum = (ev) => {
      let val = ev.target.value;
      this.linkToGame.query.players = val;
      // change roomID
    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <section className={this.props.className}>
        <div className="form-group">
          <label>
            <input className="form-control" type="radio" name="num" value="2" onChange={this.setNum} defaultChecked />
            <span>两个玩家</span>
          </label>
          <label>
            <input className="form-control" type="radio" name="num" value="3" onChange={this.setNum} />
            <span>三个玩家</span>
          </label>
          <label>
            <input className="form-control" type="radio" name="num" value="4" onChange={this.setNum} />
            <span>四个玩家</span>
          </label>
          <label>
            <input className="form-control" type="radio" name="num" value="6" onChange={this.setNum} />
            <span>六个玩家</span>
          </label>
        </div>
        <Link to={this.linkToGame} className="btn btn-primary">开始</Link>
      </section>
    );
  }
};
