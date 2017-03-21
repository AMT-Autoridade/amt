'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { syncHistoryWithStore } from 'react-router-redux';

import config from './config';
import store from './utils/store';

// Views.
import App from './views/app';
import Home from './views/home';
import Nuts from './views/nuts';
import Concelhos from './views/concelhos';
import Glossario from './views/glossario';
import Sobre from './views/sobre';
import Dados from './views/dados';
import UhOh from './views/uhoh';

const history = syncHistoryWithStore(hashHistory, store);

const scrollerMiddleware = useScroll((prevRouterProps, currRouterProps) => {
  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !== decodeURIComponent(prevRouterProps.location.pathname);
});

// TEMP.
// We need to use a meta file for the navigation.
// Or check the value on component enter.
var admin = require('./data/national.json');
import _ from 'lodash';

var onEnter = (nextState, replace) => {
  let nuts = admin.results.map(o => _.kebabCase(o.name));
  let nut = nextState.params.nut;
  if (nuts.indexOf(nut) === -1) {
    return replace('/404');
  }
};

render((
  <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(scrollerMiddleware)}>
      <Route path='/' component={App}>
        <Route path="404" component={UhOh}/>
        <Route path="glossario" component={Glossario}/>
        <Route path="sobre" component={Sobre}/>
        <Route path="dados" component={Dados}/>
        <Route path='/nuts/:nut' component={Nuts} onEnter={onEnter} />
        <Route path='/nuts/:nut/concelhos/:concelho' component={Concelhos} />
        <IndexRoute component={Home} pageClass='page--homepage' />
        <Route path="*" component={UhOh}/>
      </Route>
    </Router>
  </Provider>
), document.querySelector('#app-container'));
