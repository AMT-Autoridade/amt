'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { fetchNational, fetchMapData } from '../actions';
import { percent } from '../utils/utils';

import SectionIntro from '../components/sections/section-intro';
import SectionLicencas from '../components/sections/section-licencas';
import SectionResidentes from '../components/sections/section-residentes';
import SectionMobilidade from '../components/sections/section-mobilidade';
import SectionEstacionamento from '../components/sections/section-estacionamento';
import SectionDistribuicao from '../components/sections/section-distribuicao';
import SectionEvolucao from '../components/sections/section-evolucao';
import SectionConclusoes from '../components/sections/section-conclusoes';

import Map from '../components/map';

var Home = React.createClass({
  propTypes: {
    national: T.object,
    mapData: T.object,
    _fetchNational: T.func,
    _fetchMapData: T.func
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

    const mapGeometries = this.props.mapData;

    let licencasMunicipios = data.concelhos.map(m => {
      let licencas = _.last(m.data['lic-geral']).value;

      const getColor = (v) => {
        if (v <= 10) return '#7FECDA';
        if (v <= 30) return '#00DFC1';
        if (v <= 100) return '#2D8374';
        if (v <= 1000) return '#1F574D';
        return '#0F2B26';
      };

      return {
        id: m.id,
        color: getColor(licencas)
      };
    });

    let mobRedMunicipios = data.concelhos.map(m => {
      let mobred = _.last(m.data['lic-mob-reduzida']).value > 0;

      return {
        id: m.id,
        color: mobred ? '#2D8374' : '#eaeaea'
      };
    });

    let evolucaoMunicipios = data.concelhos.map(m => {
      let c = '#2D8374';
      if (m.data.change > 0) {
        c = '#0F2B26';
      } else if (m.data.change < 0) {
        c = '#7FECDA';
      }

      return {
        id: m.id,
        color: c
      };
    });

    let licencas1000Hab = data.concelhos.map(m => {
      let totalLic = _.last(m.data['lic-geral']).value + _.last(m.data['lic-mob-reduzida']).value;
      let lic1000 = totalLic / (_.last(m.data['pop-residente']).value / 1000);

      const getColor = (v) => {
        if (v <= 1) return '#7FECDA';
        if (v <= 2) return '#00DFC1';
        if (v <= 3) return '#2D8374';
        if (v <= 4) return '#1F574D';
        return '#0F2B26';
      };

      return {
        id: m.id,
        color: getColor(lic1000)
      };
    });

    let municipiosVagas = data.concelhos.map(m => {
      let lic = _.last(m.data['lic-geral']).value + _.last(m.data['lic-mob-reduzida']).value;
      let max = _.last(m.data['max-lic-geral']).value + _.last(m.data['max-lic-mob-reduzida']).value;
      let vagas = max - lic;

      const getColor = (v) => {
        if (v === 0) return '#eaeaea';
        if (v <= 10) return '#7FECDA';
        if (v <= 50) return '#2D8374';
        return '#0F2B26';
      };

      return {
        id: m.id,
        color: getColor(vagas)
      };
    });

    let tipoEstacionamentos = data.concelhos.map(m => {
      let key = _(m.data.estacionamento)
        .map(_.trim)
        .sort()
        .join('-');

      const getColor = (v) => {
        if (v === 'fixo') return '#7FECDA';
        if (v === 'condicionado-fixo') return '#00DFC1';
        if (v === 'condicionado') return '#2D8374';
        if (v === 'fixo-livre') return '#1F574D';
        if (v === 'condicionado-livre') return '#0F2B26';
        if (v === 'livre') return '#ff0000';
        // if (v === 'condicionado-fixo-livre') return '#00ff00';
        // if (v === 'escala-fixo') return '#0000ff';
        return '#eaeaea';
      };

      return {
        id: m.id,
        color: getColor(key)
      };
    });

    let percentLicOverPop = data.concelhos.map(m => {
      let lic = _.last(m.data['lic-geral']).value + _.last(m.data['lic-mob-reduzida']).value;
      let percentNational = percent(lic, this.props.national.data.licencas2016, 0);
      let pop = _.last(m.data['pop-residente']).value;
      let percentPop = percent(pop, this.props.national.data.populacao, 0);

      let color = '#2D8374';
      // More relative licenses than population.
      if (percentNational > percentPop) {
        color = '#7FECDA';
      // More relative population than licenses.
      } else if (percentNational < percentPop) {
        color = '#0F2B26';
      }

      return {
        id: m.id,
        color: color
      };
    });

    return (
      <div>
        <SectionIntro />

        <div id="page-content" className='container-wrapper'>
        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={licencasMunicipios} />
          ) : null}
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
          </div>
        </div>

        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={licencas1000Hab} />
          ) : null}
          </div>

          <div className='content-wrapper'>
            <SectionResidentes
              licencasHab={data.licencasHab}
              licencasTimeline={data.licencasTimeline}
            />
          </div>
        </div>

        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={mobRedMunicipios} />
          ) : null}
          </div>

          <div className='content-wrapper'>
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
          </div>
        </div>

        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={tipoEstacionamentos} />
          ) : null}
          </div>

          <div className='content-wrapper'>
            <SectionEstacionamento
              municipios={data.concelhos}
              totalMunicipios={data.totalMunicipios}
            />
          </div>
        </div>

        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={percentLicOverPop} />
          ) : null}
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={municipiosVagas} />
          ) : null}
          </div>

          <div className='content-wrapper'>
            <SectionDistribuicao
              adminLevel='national'
              adminName='Portugal'
              adminList={data.nuts}
              licencas2016={data.licencas2016}
              populacaoNational={data.populacao}
            />
          </div>
        </div>

        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          {mapGeometries.fetched ? (
            <Map
              geometries={mapGeometries.data}
              data={evolucaoMunicipios} />
          ) : null}
          </div>

          <div className='content-wrapper'>
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

        <div style={{overflow: 'hidden'}}>
          <div className='map-wrapper'>
          </div>

          <div className='content-wrapper'>
            <SectionConclusoes />
          </div>
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
