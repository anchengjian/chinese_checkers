import React, { Component } from 'react';
import SetUserName from './set-user-name';
import SetNumOfPlayers from './set-num-of-players';

export default class StartComponent extends Component {
  constructor() {
    super();

    this.steps = ['show', 'hidden'];

    this.nextStep = (step) => {
      for (let i = 0; i <= step; i++) {
        this.steps[i] = 'hidden';
      }
      this.steps[step + 1] = 'show';

      this.setState(this.steps);
    };
  }

  render() {
    return (
      <section className="text-center">
        <SetUserName className={this.steps[0]} user={this.props.user} nextStep={this.nextStep} updateUserInfo={this.props.updateUserInfo} />
        <SetNumOfPlayers className={this.steps[1]} />
      </section>
    );
  }
};
