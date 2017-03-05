'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicao from '../components/sections/section-distribuicao';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
  },

  render: function () {
    return (
      <div>
        <SectionIntro />

        <div id="page-content">

          <div className='map-wrapper'>
            This is a map
          </div>

          <div className='content-wrapper'>

            <SectionLicencas />
            <SectionMobilidade />
            <SectionEstacionamento />
            <SectionDistribuicao />

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
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Home);
