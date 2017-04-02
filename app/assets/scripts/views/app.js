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
    children: T.object,
    national: T.object
  },

  goToAnchor: function (hash) {
    if (!hash) return;
    let el = document.querySelector(hash);
    if (el) {
      scrollToElement(el);
    }
  },

  componentDidMount: function () {
    this.goToAnchor(this.props.location.hash);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.location.hash !== nextProps.location.hash) {
      this.goToAnchor(nextProps.location.hash);
    }
  },

  componentDidUpdate: function (prevProps) {
    // Once national is loaded navigate.
    // Use componentDidUpdate because we have to ensure that the elements
    // were actually rendered.
    if (!prevProps.national.fetched && this.props.national.fetched) {
      this.goToAnchor(this.props.location.hash);
    }
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <header id='page-header'>
          <nav className='page-nav container-wrapper'>
            <h1 id='page-logo'><Link to='/'>Autoridade da Mobilidade e dos Transportes</Link></h1>
            <ul className='primary-nav'>
              <li><Link to='/sobre'>Sobre</Link></li>
              <li><Link to='/dados'>Dados</Link></li>
              <li><Link to='/glossario'>Glossário</Link></li>
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
    national: state.national
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);
