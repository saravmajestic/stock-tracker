import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore.js';
import Root from './routes';
import 'base.scss';
require('./favicon.ico'); // Tell webpack to load favicon.ico

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable-next-line no-unused-vars,react/no-deprecated */
  let createClass = require('create-react-class');
  Object.defineProperty(React, 'createClass', {
    set: (nextCreateClass) => {
      createClass = nextCreateClass;
    },
  });
  /* eslint-disable-next-line global-require */
  
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React)
}

const store = configureStore();

render(
  <Provider store={store}  history={history}>
    <Root />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NewRoot = require('./routes').default;

    render(
      <Provider store={store}><NewRoot /></Provider>,
      document.getElementById('root')
    );
  });
}
