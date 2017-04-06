'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import _ from 'lodash';
import c from 'classnames';
import scrollIntoView from 'scroll-into-view';

var App = React.createClass({
  propTypes: {
    routes: T.array,
    params: T.object,
    location: T.object,
    children: T.object,
    national: T.object
  },

  getInitialState: function () {
    return {
      showHeader: !!this.props.params.nut
    };
  },

  ignoreNextSectionChange: false,

  isAutoScrolling: false,

  goToAnchor: function (hash) {
    if (!hash) return;
    let el = document.querySelector(hash);
    if (el) {
      this.isAutoScrolling = true;
      scrollIntoView(el, {time: 500}, () => {
        this.isAutoScrolling = false;
      });
    }
  },

  onSroll: function (e) {
    let introEl = document.getElementById('intro');
    if (introEl) {
      let introHeight = introEl.getBoundingClientRect().height;
      if (window.pageYOffset >= introHeight - 80) {
        !this.state.showHeader && this.setState({showHeader: true});
      } else {
        this.state.showHeader && this.setState({showHeader: false});
      }
    }
  },

  onSectionChange: function (sectionId, type) {
    if (!this.isAutoScrolling) {
      this.ignoreNextSectionChange = true;
      let basepath = type === 'nut' ? `/nuts/${this.props.params.nut}` : '/';
      hashHistory.push(`${basepath}#${sectionId}`);
    }
  },

  componentDidMount: function () {
    this.goToAnchor(this.props.location.hash);
    this.onSroll = _.throttle(this.onSroll, 50);
    document.addEventListener('scroll', this.onSroll);
    // Call onScroll to show header if the page loads in a section.
    this.onSroll();
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.location.hash !== nextProps.location.hash) {
      if (!this.ignoreNextSectionChange) {
        this.goToAnchor(nextProps.location.hash);
      }
      this.ignoreNextSectionChange = false;
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
        <header id='page-header' className={c('header-fixed', {'header-active': this.state.showHeader})}>
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
          {React.cloneElement(this.props.children, {
            onSectionChange: this.onSectionChange
          })}
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
