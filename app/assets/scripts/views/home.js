'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';

import { fetchNational, fetchMapData } from '../actions';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionResidentes from '../components/sections/section-residentes';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicao from '../components/sections/section-distribuicao';
import SectionEvolucao from '../components/sections/section-evolucao';
import SectionConclusoes from '../components/sections/section-conclusoes';

var Home = React.createClass({
  propTypes: {
    national: T.object,
    mapData: T.object,
    _fetchNational: T.func,
    _fetchMapData: T.func
  },

  onMapClick: function (id) {
    // Find the right nut.
    let slug = this.props.national.data.nuts.find(o => o.id === id).slug;
    hashHistory.push(`/nuts/${slug}`);
  },

  popoverContent: function (id) {
    // Find the right nut.
    let name = this.props.national.data.nuts.find(o => o.id === id).name;
    return (
      <div>
        <p className='map-tooltip'>{name}</p>
        <span className='triangle'></span>
      </div>
    );
  },

  componentDidMount: function () {
    if (!this.props.national.fetched) {
      this.props._fetchNational();
    }
    if (!this.props.mapData.fetched) {
      this.props._fetchMapData();
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

    let chartResidentes = {
      labels: this.props.national.data.licencasTimeline.map(y => y.year),
      datasets: [
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000']),
          label: 'Portugal',
          color: '#1f8d8e',
        },
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000-lx']),
          label: 'Área Metropolitana de Lisboa',
          color: '#00ced1'
        },
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000-por']),
          label: 'Área Metropolitana de Porto',
          color: '#256465'
        }
      ]
    };

    return (
      <div>
        <SectionIntro />

        <div id="page-content" className='container-wrapper'>
          <SectionLicencas
            adminLevel='national'
            adminName='Portugal'
            adminList={data.nuts}
            licencas2016={data.licencas2016}
            max2016={data.max2016}
            licencasHab={data.licencasHab}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
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
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
          />

          <SectionEstacionamento
            adminLevel='national'
            adminName='Portugal'
            municipios={data.concelhos}
            totalMunicipios={data.totalMunicipios}
            mapGeometries={this.props.mapData}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
          />

          <SectionDistribuicao
            adminLevel='national'
            adminName='Portugal'
            adminList={data.nuts}
            licencas2016={data.licencas2016}
            populacaoNational={data.populacao}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
          />

          <SectionEvolucao
            adminLevel='national'
            adminName='Portugal'
            licencas2016={data.licencas2016}
            licencas2006={data.licencas2006}
            municipios={data.concelhos}
            totalMunicipios={data.totalMunicipios}
            licencasTimeline={data.licencasTimeline}
            mapGeometries={this.props.mapData}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
          />

          <SectionResidentes
            adminLevel='national'
            adminName='Portugal'
            licencasHab={data.licencasHab}
            chartDatasets={chartResidentes}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
          />

          <SectionConclusoes />
        </div>

        <ul className='section-nav'>
          <li className='nav-item'><Link to='/#intro'><span>Introdução</span></Link></li>
          <li className='nav-item active'><Link to='/#licencas'><span>Licenças e Contingentes</span></Link></li>
          <li className='nav-item'><Link to='/#mobilidade'><span>Mobilidade Reduzida</span></Link></li>
          <li className='nav-item'><Link to='/#estacionamento'><span>Regime Estacionamento</span></Link></li>
          <li className='nav-item'><Link to='/#distribuicao'><span>Âmbito Geográfico</span></Link></li>
          <li className='nav-item'><Link to='/#evolucao'><span>Evolução 2006-2016</span></Link></li>
          <li className='nav-item'><Link to='/#residentes'><span>Outros Indicadores</span></Link></li>
          <li className='nav-item'><Link to='/#conclusoes'><span>Conclusões</span></Link></li>
        </ul>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    national: state.national,
    mapData: state.mapData
  };
}

function dispatcher (dispatch) {
  return {
    _fetchNational: (...args) => dispatch(fetchNational(...args)),
    _fetchMapData: (...args) => dispatch(fetchMapData(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
