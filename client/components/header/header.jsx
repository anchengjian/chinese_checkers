import React, { Component } from 'react';
import { Link } from 'react-router';

import './header.scss';

export default class Header extends Component {
  constructor() {
    super();
  }
  render() {
    let currentPath = this.props.location.pathname;
    let user = this.props.user;
    return (
      <header className="header">
        <section className="container two-column">
          <nav className="header-nav">
            <Link to="/" className="btn btn-link" activeClassName="btn-primary" onlyActiveOnIndex={true}>个人中心</Link>
            <Link to="/game" className="btn btn-link" activeClassName="btn-primary">游戏</Link>
            <Link to="/about" className="btn btn-link" activeClassName="btn-primary">关于</Link>
          </nav>
        </section>
      </header>
    );
  }
};
