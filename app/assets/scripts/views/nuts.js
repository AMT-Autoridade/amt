'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

import { fetchNut } from '../actions';

import SectionLicencas from '../components/sections/section-licencas';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicaoNut from '../components/sections/section-distribuicao-nut';

var Nuts = React.createClass({
  propTypes: {
    params: T.object,
    nut: T.object,
    _fetchNut: T.func
  },

  componentDidMount: function () {
    this.props._fetchNut(this.props.params.nut);
  },

  render: function () {
    let { fetched, fetching, error, data } = this.props.nut;

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

        <div id="page-content">

          <div className='map-wrapper'>
            This is a map
          </div>

          <div className='content-wrapper'>

            <SectionLicencas
              adminLevel='nut'
              adminName={data.name}
              adminList={data.concelhos}
              licencas2016={data.data.licencas2016}
              max2016={data.data.max2016}
              licencasHab={data.data.licencasHab}
            />
            <SectionEstacionamento
              municipios={data.concelhos}
              totalMunicipios={data.concelhos.length}
            />
            <SectionDistribuicaoNut
              adminLevel='nut'
              parentSlug={this.props.params.nut}
              adminName={data.name}
              adminList={data.concelhos}
              />
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
    nut: state.nut
  };
}

function dispatcher (dispatch) {
  return {
    _fetchNut: (...args) => dispatch(fetchNut(...args))
  };
}

module.exports = connect(selector, dispatcher)(Nuts);
