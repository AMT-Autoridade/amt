'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

import { fetchNut } from '../actions';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicao from '../components/sections/section-distribuicao';
import SectionEvolucao from '../components/sections/section-evolucao';

var Home = React.createClass({
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
        <SectionIntro />

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
            <SectionMobilidade
              adminLevel='nut'
              adminName={data.name}
              totalMunicipiosMobReduzida={data.data.totalMunicipiosMobReduzida}
              totalMunicipios={data.data.totalMunicipios}
              licencas2016={data.data.licencas2016}
              licencas2006={data.data.licencas2006}
              licencasMobReduzida2016={data.data.licencasMobReduzida2016}
              licencasMobReduzida2006={data.data.licencasMobReduzida2006}
            />
            <SectionEstacionamento data={data} />
            <SectionDistribuicao
              adminLevel='nut'
              adminName={data.name}
              adminList={data.concelhos}
              licencas2016={data.data.licencas2016}
              />
            <SectionEvolucao
              adminLevel='nut'
              adminName={data.name}
              licencas2016={data.data.licencas2016}
              licencas2006={data.data.licencas2006}
              municipios={data.concelhos}
              totalMunicipios={data.data.totalMunicipios}
              licencasTimeline={data.data.licencasTimeline}
              data={data}
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

module.exports = connect(selector, dispatcher)(Home);
