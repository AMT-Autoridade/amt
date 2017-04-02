'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchNut, fetchMapData } from '../actions';

import SectionLicencas from '../components/sections/section-licencas';
import SectionIndicadores from '../components/sections/section-indicadores';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionAmbitoNut from '../components/sections/section-ambito-nut';
import SectionEvolucao from '../components/sections/section-evolucao';

var Nuts = React.createClass({
  propTypes: {
    params: T.object,
    mapData: T.object,
    nut: T.object,
    national: T.object,
    _fetchNut: T.func,
    _fetchMapData: T.func
  },

  componentDidMount: function () {
    this.props._fetchNut(this.props.params.nut);

    if (!this.props.mapData.fetched) {
      this.props._fetchMapData();
    }
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

    let chartLic1000Hab = {
      labels: data.data.licencasTimeline.map(y => y.year),
      datasets: [
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000']),
          label: 'Portugal',
          color: '#1f8d8e',
          backgroundColor: '#1f8d8e7f'
        },
        {
          data: data.data.licencasTimeline.map(o => o['lic1000']),
          label: data.name,
          color: '#00ced1',
          backgroundColor: '#00ced17f'
        }
      ]
    };

    let chartLic1000Dor = {
      labels: data.data.dormidas.map(y => y.year),
      datasets: [
        {
          data: this.props.national.data.dormidas.map(o => o.lic1000),
          label: 'Portugal',
          color: '#1f8d8e',
          backgroundColor: '#1f8d8e7f'
        }
      ]
    };

    return (
      <div>
        <div id="page-content">
          <SectionLicencas
            adminLevel='nut'
            adminName={data.name}
            adminId={data.id}
            adminList={data.concelhos}
            licencas2016={data.data.licencas2016}
            max2016={data.data.max2016}
            licencasHab={data.data.licencasHab}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
          />

          <SectionMobilidade
            adminLevel='nut'
            adminName={data.name}
            adminId={data.id}
            totalMunicipiosMobReduzida={data.data.totalMunicipiosMobReduzida}
            totalMunicipios={data.data.totalMunicipios}
            licencas2016={data.data.licencas2016}
            licencas2006={data.data.licencas2006}
            licencasMobReduzida2016={data.data.licencasMobReduzida2016}
            licencasMobReduzida2006={data.data.licencasMobReduzida2006}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
          />

          <SectionEstacionamento
            adminLevel='nut'
            adminName={data.name}
            adminId={data.id}
            municipios={data.concelhos}
            totalMunicipios={data.data.totalMunicipios}
            mapGeometries={this.props.mapData}
          />

          <SectionAmbitoNut
            adminLevel='nut'
            adminName={data.name}
            adminId={data.id}
            adminList={data.concelhos}
            parentSlug={this.props.params.nut}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
          />

          <SectionIndicadores
            adminLevel='nut'
            adminName={data.name}
            adminId={data.id}
            licencasHab={data.data.licencasHab}
            dormidas={data.data.dormidas}
            chartLic1000Hab={chartLic1000Hab}
            chartLic1000Dor={chartLic1000Dor}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
          />

          <SectionEvolucao
            adminLevel='nut'
            adminName={data.name}
            adminId={data.id}
            licencas2016={data.data.licencas2016}
            licencas2006={data.data.licencas2006}
            municipios={data.concelhos}
            totalMunicipios={data.data.totalMunicipios}
            licencasTimeline={data.data.licencasTimeline}
            mapGeometries={this.props.mapData}
          />

        </div>
        <ul className='section-nav'>
          <li className='nav-item'><Link to={`/nuts/${this.props.params.nut}#licencas`}><span>Licenças e Contingentes</span></Link></li>
          <li className='nav-item'><Link to={`/nuts/${this.props.params.nut}#mobilidade`}><span>Mobilidade Reduzida</span></Link></li>
          <li className='nav-item'><Link to={`/nuts/${this.props.params.nut}#estacionamento`}><span>Regime Estacionamento</span></Link></li>
          <li className='nav-item'><Link to={`/nuts/${this.props.params.nut}#distribuicao`}><span>Âmbito Geográfico</span></Link></li>
          <li className='nav-item'><Link to={`/nuts/${this.props.params.nut}#indicadores`}><span>Outros Indicadores</span></Link></li>
          <li className='nav-item'><Link to={`/nuts/${this.props.params.nut}#evolucao`}><span>Evolução 2006-2016</span></Link></li>
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
    nut: state.nut,
    mapData: state.mapData
  };
}

function dispatcher (dispatch) {
  return {
    _fetchNut: (...args) => dispatch(fetchNut(...args)),
    _fetchMapData: (...args) => dispatch(fetchMapData(...args))
  };
}

module.exports = connect(selector, dispatcher)(Nuts);
