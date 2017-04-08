'use strict';
import 'babel-polyfill';
import './utils/classlist-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './utils/store';
import { onEnterNut, onEnterConcelho } from './utils/admin-areas';

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
  // When a hash is set do not scroll to the top.
  // This messes with section navigation.
  if (currRouterProps.location.hash) return false;

  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !== decodeURIComponent(prevRouterProps.location.pathname);
});

render((
  <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(scrollerMiddleware)}>
      <Route path='/' component={App}>
        <Route path="404" component={UhOh}/>
        <Route path="glossario" component={Glossario}/>
        <Route path="sobre" component={Sobre}/>
        <Route path="dados" component={Dados}/>
        <Route path='/nuts/:nut' component={Nuts} onEnter={onEnterNut} />
        <Route path='/nuts/:nut/concelhos/:concelho' component={Concelhos} onEnter={onEnterConcelho} />
        <IndexRoute component={Home} pageClass='page--homepage' />
        <Route path="*" component={UhOh}/>
      </Route>
    </Router>
  </Provider>
), document.querySelector('#app-container'));
