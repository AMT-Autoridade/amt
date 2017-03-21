'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';

var App = React.createClass({
  propTypes: {
    routes: T.array,
    children: T.object
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <header id="page-header">
          <h1><a href="#">AMT</a></h1>
          <ul>
            <li><a href="/#/sobre">Sobre</a></li>
            <li><a href="/#/glossario">Glossário</a></li>
            <li><a href="#">Relatório</a></li>
            <li><a href="/#/dados">Dados</a></li>
          </ul>
        </header>
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);
