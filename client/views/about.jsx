import React, { Component } from 'react';
import { Link } from 'react-router';
import { Header, Footer } from 'COMPONENT';

export default class About extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    // console.log(this.props);
  }
  render() {
    return (
      <div className="about-page container">
        <h1>about</h1>
        <p>就是一个跳棋游戏，哈哈，女朋友喜欢就行！！</p>
      </div>
    );
  }
};
