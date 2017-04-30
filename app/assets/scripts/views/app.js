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
    national: T.object,
    nut: T.object
  },

  getInitialState: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return {
      showHeader: pageClass !== 'page--homepage'
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
    // Correctly show header.
    this.setState({showHeader: nextProps.location.pathname !== '/'});

    if (this.props.location.hash !== nextProps.location.hash ||
    this.props.location.pathname !== nextProps.location.pathname) {
      if (!this.ignoreNextSectionChange) {
        this.goToAnchor(nextProps.location.hash);
      }
      this.ignoreNextSectionChange = false;
    }
  },

  componentDidUpdate: function (prevProps) {
    // Several different things trigger a scroll to an anchor:
    // - National data being loaded.
    // - Nut data being loaded.
    // - Path change.
    if (!prevProps.national.fetched && this.props.national.fetched ||
    !prevProps.nut.fetched && this.props.nut.fetched ||
    prevProps.location.pathname !== this.props.location.pathname) {
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
    national: state.national,
    nut: state.nut
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);
