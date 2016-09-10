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
        // this.props.history.push('/about');
        this.context.router.replace('/about');
      });
  }

  render() {
    console.log(this.context.router);
    return (<section className="jumbotron">
        <h1>欢迎来到一个奇妙的世界</h1>
        <form className="m-t-20" onSubmit={this.submitHandle.bind(this)}>
          <div className="form-group">
            <input type="text" className="form-control" name="name" placeholder="用户名" />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" name="pwd" placeholder="密码"/>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" type="submit">登陆</button>
            <a href="#/about" className="btn btn-link">注册</a>
          </div>
        </form>
      </section>);
  }
};
