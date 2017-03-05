'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

import { fetchNational } from '../actions';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicao from '../components/sections/section-distribuicao';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    national: T.object,
    _fetchNational: T.func
  },

  componentDidMount: function () {
    this.props._fetchNational();
  },

  render: function () {
    let { fetched, fetching, error, data } = this.props.national;

    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return <p>Loading</p>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <SectionIntro />

        <div id="page-content">

          <div className='map-wrapper'>
            This is a map
          </div>

          <div className='content-wrapper'>

            <SectionLicencas data={data} />
            <SectionMobilidade data={data} />
            <SectionEstacionamento data={data} />
            <SectionDistribuicao data={data} />

          </div>

        </div>
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
    _fetchNational: (...args) => dispatch(fetchNational(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
