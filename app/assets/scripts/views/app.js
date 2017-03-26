'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import {Link } from 'react-router';
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
        <header id='page-header'>
          <h1 id='page-logo'><a href='#'>AMT</a></h1>
          <nav className='page-nav'>
            <ul className='primary-nav'>
              <li><a href='#licencas'>Licenças</a></li>
              <li><a href='#mobilidade'>Mobilidade Reduzida</a></li>
              <li><a href='#'>Estacionamento</a></li>
              <li><a href='#'>Distribuição</a></li>
              <li><a href='#'>Evolução</a></li> 
              <li><a href='#'>Conclusões</a></li>
            </ul>
            <ul className='secondary-nav'>
              <li><Link to='/sobre'>Sobre</Link></li>
              <li><Link to='/glossario'>Glossário</Link></li>
              <li><Link to='/relatorio'>Relatório</Link></li>
              <li><Link to='/dados'>Dados</Link></li>
            </ul>
          </nav>
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
