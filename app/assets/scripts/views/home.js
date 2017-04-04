'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import c from 'classnames';

import { fetchNational, fetchMapData } from '../actions';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionIndicadores from '../components/sections/section-indicadores';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionAmbito from '../components/sections/section-ambito';
import SectionEvolucao from '../components/sections/section-evolucao';
import SectionConclusoes from '../components/sections/section-conclusoes';

var Home = React.createClass({
  propTypes: {
    location: T.object,
    national: T.object,
    mapData: T.object,
    _fetchNational: T.func,
    _fetchMapData: T.func
  },

  onMapClick: function (data) {
    // Find the right nut.
    let slug = this.props.national.data.nuts.find(o => o.id === data.id).slug;
    hashHistory.push(`/nuts/${slug}`);
  },

  popoverContent: function (data) {
    // Find the right nut.
    let name = this.props.national.data.nuts.find(o => o.id === data.id).name;
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
    let hash = this.props.location.hash.replace('#', '');

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
      labels: this.props.national.data.licencasTimeline.map(y => y.year),
      datasets: [
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000-por']),
          label: 'Área Metropolitana de Porto',
          color: '#256465',
          backgroundColor: '#f5f5f5'
        },
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000']),
          label: 'Portugal',
          color: '#1f8d8e',
          backgroundColor: '#f5f5f5'
        },
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000-lx']),
          label: 'Área Metropolitana de Lisboa',
          color: '#00ced1',
          backgroundColor: '#f5f5f5'
        }
      ]
    };

    let chartLic1000Dor = {
      labels: this.props.national.data.dormidas.map(y => y.year),
      datasets: [
        {
          data: this.props.national.data.dormidas.map(o => o.lic1000),
          label: 'Portugal',
          color: '#1f8d8e',
          backgroundColor: '#f5f5f5'
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

          <SectionAmbito
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

          <SectionIndicadores
            adminLevel='national'
            adminName='Portugal'
            licencasHab={data.licencasHab}
            dormidas={data.dormidas}
            chartLic1000Hab={chartLic1000Hab}
            chartLic1000Dor={chartLic1000Dor}
            mapGeometries={this.props.mapData}
            municipios={data.concelhos}
            onMapClick={this.onMapClick}
            popoverContent={this.popoverContent}
          />
        </div>

        <SectionConclusoes />

        <ul className='section-nav'>
          <li className={c('nav-item', {active: hash === 'intro'})}><Link to='/#intro'><span>Introdução</span></Link></li>
          <li className={c('nav-item', {active: hash === 'licencas'})}><Link to='/#licencas'><span>Licenças e Contingentes</span></Link></li>
          <li className={c('nav-item', {active: hash === 'mobilidade'})}><Link to='/#mobilidade'><span>Mobilidade Reduzida</span></Link></li>
          <li className={c('nav-item', {active: hash === 'estacionamento'})}><Link to='/#estacionamento'><span>Regime Estacionamento</span></Link></li>
          <li className={c('nav-item', {active: hash === 'distribuicao'})}><Link to='/#distribuicao'><span>Âmbito Geográfico</span></Link></li>
          <li className={c('nav-item', {active: hash === 'evolucao'})}><Link to='/#evolucao'><span>Evolução 2006-2016</span></Link></li>
          <li className={c('nav-item', {active: hash === 'indicadores'})}><Link to='/#indicadores'><span>Outros Indicadores</span></Link></li>
          <li className={c('nav-item', {active: hash === 'conclusoes'})}><Link to='/#conclusoes'><span>Conclusões</span></Link></li>
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
