import './user.scss';

import React, { Component } from 'react';
import notify from 'UTIL/notify';
import { userLogin } from 'SERVICE/user.service';

export default class LoginComponent extends Component {
  constructor() {
    super();
  }

  submitHandle(ev) {
    ev.preventDefault();
    userLogin(new FormData(ev.target))
      .then((data) => {
        this.props.addUserInfo(data.data);
        this.context.router.replace('/game');
      });
  }

  render() {
    return (<section className="jumbotron">
        <form className="m-t-20" onSubmit={this.submitHandle.bind(this)}>
          <h3>获得一个昵称，并开始玩耍</h3>
          <p>不然就只能本地单机自娱自乐啦</p>
          <div className="form-group">
            <button className="btn btn-primary" type="submit">开始游戏</button>
          </div>
        </form>
      </section>);
  }
};

LoginComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};
