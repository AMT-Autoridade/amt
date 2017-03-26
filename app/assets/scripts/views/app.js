'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import c from 'classnames';
import scrollToElement from 'scroll-to-element';

var App = React.createClass({
  propTypes: {
    routes: T.array,
    location: T.object,
    children: T.object
  },

  goToAnchor: function (hash) {
    let el = document.getElementById(hash);
    if (el) {
      scrollToElement(el);
    }
  },

  componentDidMount: function () {
    scrollToElement(this.props.location.hash);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.location.hash !== nextProps.location.hash) {
      scrollToElement(nextProps.location.hash);
    }
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <header id='page-header'>
          <h1 id='page-logo'><a href='#'>AMT</a></h1>
          <nav className='page-nav'>
            <ul className='primary-nav'>
              <li><Link to='/#licencas'>Licenças</Link></li>
              <li><Link to='/#mobilidade'>Mobilidade Reduzida</Link></li>
              <li><Link to='/#estacionamento'>Estacionamento</Link></li>
              <li><Link to='/#distribuicao'>Distribuição</Link></li>
              <li><Link to='/#evolucao'>Evolução</Link></li>
              <li><Link to='/#conclusoes'>Conclusões</Link></li>
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
