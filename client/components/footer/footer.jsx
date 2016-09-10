import React, { Component } from 'react';

import './footer.scss';

export default class Footer extends Component {
  constructor() {
    super();
  }
  render() {
    let app = this.props.app;
    return (
      <footer>
        <section className="container text-center">
          <p>{app.copyRight}</p>
        </section>
      </footer>
    );
  }
};
