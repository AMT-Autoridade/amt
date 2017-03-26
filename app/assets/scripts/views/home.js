'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

import { fetchNational } from '../actions';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicao from '../components/sections/section-distribuicao';
import SectionEvolucao from '../components/sections/section-evolucao';

var Home = React.createClass({
  propTypes: {
    national: T.object,
    _fetchNational: T.func
  },

  componentDidMount: function () {
    if (!this.props.national.fetched) {
      this.props._fetchNational();
    }
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

        <div id="page-content" className='container-wrapper'>

          <div className='map-wrapper'>
            This is a map
          </div>

          <div className='content-wrapper'>

            <SectionLicencas
              adminLevel='national'
              adminName='Portugal'
              adminList={data.nuts}
              licencas2016={data.licencas2016}
              max2016={data.max2016}
              licencasHab={data.licencasHab}
            />
            <SectionMobilidade
              adminLevel='national'
              adminName='Portugal'
              totalMunicipiosMobReduzida={data.totalMunicipiosMobReduzida}
              totalMunicipios={data.totalMunicipios}
              licencas2016={data.licencas2016}
              licencas2006={data.licencas2006}
              licencasMobReduzida2016={data.licencasMobReduzida2016}
              licencasMobReduzida2006={data.licencasMobReduzida2006}
            />
            <SectionEstacionamento data={data} />
            <SectionDistribuicao
              adminLevel='national'
              adminName='Portugal'
              adminList={data.nuts}
              licencas2016={data.licencas2016}
            />
            <SectionEvolucao
              adminLevel='national'
              adminName='Portugal'
              licencas2016={data.licencas2016}
              licencas2006={data.licencas2006}
              municipios={data.nuts.reduce((acc, nut) => acc.concat(nut.concelhos), [])}
              totalMunicipios={data.totalMunicipios}
              licencasTimeline={data.licencasTimeline}
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
    national: state.national
  };
}

function dispatcher (dispatch) {
  return {
    _fetchNational: (...args) => dispatch(fetchNational(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
