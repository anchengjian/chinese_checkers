import './assets';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';

import store from 'STORE';
import routes from 'ROUTE';

const app = document.querySelector('#app');

render(
  <Provider store={store} >
    <Router history={hashHistory} children={routes} />
  </Provider>,
  app);
