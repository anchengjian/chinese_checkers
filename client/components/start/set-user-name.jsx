import React, { Component } from 'react';

export default class SetNumOfPlayersComponent extends Component {
  constructor() {
    super();

    this.nextBtnDisabled = false;

    this.updateUserName = (ev) => {
      let name = ev.target.value;
      this.nextBtnDisabled = name.length <= 0;
      this.props.updateUserInfo('name', name);
    };

    this.nextStep = (ev) => {
      this.props.nextStep(0);
    };
  }

  render() {
    return (
      <section className={this.props.className}>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="设置昵称" defaultValue={this.props.user.name} onChange={this.updateUserName} />
        </div>
        <button className='btn btn-primary' disabled={this.nextBtnDisabled} type="button" onClick={this.nextStep}>继续</button>
      </section>
    );
  }
};
