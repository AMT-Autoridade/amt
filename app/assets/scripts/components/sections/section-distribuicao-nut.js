'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';
import c from 'classnames';

import makeTooltip from '../../utils/tooltip';

import Map from '../map';

var SectionDistribuicao = React.createClass({
  propTypes: {
    parentSlug: T.string,
    adminLevel: T.string,
    adminName: T.string,
    adminList: T.array,
    mapGeometries: T.object,
    municipios: T.array
  },

  contingenteMatrix: {
    'concelho': 'Concelho',
    'infra concelho': 'Infra Concelho'
  },

  renderTrendLineChart: function (data) {
    let tooltipFn = makeTooltip(entryIndex => {
      let year = data[entryIndex];
      return (
         <ul className='x-small'>
          <li><span className='tooltip-label'>{year.year}</span> <span className='tooltip-number'>{year.value.toLocaleString()}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: data.map(o => o.year),
      datasets: [{
        data: data.map(o => o.value),
        lineTension: 0,
        pointRadius: 2,
        pointBorderWidth: 0,
        pointBackgroundColor: '#2EB199',
        borderColor: '#2EB199',
        backgroundColor: '#fff',
        borderWidth: 1
      }]
    };

    let chartOptions = {
      layout: {
        padding: {
          left: 5,
          top: 2,
          right: 5
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false,
          ticks: {
            min: 0
          }
        }]
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        position: 'nearest',
        custom: tooltipFn
      }
    };

    return (
      <LineChart data={chartData} options={chartOptions} height={40} />
    );
  },

  renderTableRow: function (adminArea) {
    let url = `/nuts/${this.props.parentSlug}/concelhos/${_.kebabCase(adminArea.name)}`;
    return (
      <li key={adminArea.id}>
        <span className='table-region'><Link to={url} title={`Ver página de ${adminArea.name}`}>{adminArea.name}</Link></span>
        <div className='table-graph'>{this.renderTrendLineChart(adminArea.data['lic-geral'])}</div>
        <div className='table-parking'>
          <ul>
            <li className={c('est est-livre', {active: adminArea.data.estacionamento.indexOf('livre') !== -1})}>Livre</li>
            <li className={c('est est-condicionado', {active: adminArea.data.estacionamento.indexOf('condicionado') !== -1})}>Condicionado</li>
            <li className={c('est est-fixo', {active: adminArea.data.estacionamento.indexOf('fixo') !== -1})}>Fixo</li>
            <li className={c('est est-escala', {active: adminArea.data.estacionamento.indexOf('escala') !== -1})}>Escala</li>
          </ul>
        </div>
        <span className='table-scope'>{this.contingenteMatrix[adminArea.data.contingente]}</span>
      </li>
    );
  },

  renderTable: function () {
    let adminList = this.props.adminList;

    return (
      <ul className='table-distribution'>
        <li className='table-header'>
          <span className='table-region'>Concelho</span>
          <span className='table-graph'>Total de Licenças</span>
          <span className='table-parking'>Estacionamento</span>
          <span className='table-scope'>Âmbito Geográfico</span>
        </li>
        {adminList.map(this.renderTableRow)}
      </ul>
    );
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v === 0) return '#eaeaea';
      if (v <= 10) return '#7FECDA';
      if (v <= 50) return '#2D8374';
      return '#0F2B26';
    };

    let municipiosVagas = this.props.municipios.map(m => {
      let lic = _.last(m.data['lic-geral']).value + _.last(m.data['lic-mob-reduzida']).value;
      let max = _.last(m.data['max-lic-geral']).value + _.last(m.data['max-lic-mob-reduzida']).value;
      let vagas = max - lic;

      return {
        id: m.id,
        color: getColor(vagas)
      };
    });

    return (
      <div>
        <h6 className='map-title'>Vagas por município</h6>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={municipiosVagas}
        />
        <ul className='color-legend side-by-side'>
          <li><span style={{backgroundColor: getColor(0)}}></span>Sem vagas</li>
          <li><span style={{backgroundColor: getColor(10)}}></span>menos que 10</li>
          <li><span style={{backgroundColor: getColor(50)}}></span>11 - 50</li>
          <li><span style={{backgroundColor: getColor(51)}}></span>+50</li>
       </ul>
      </div>
    );
  },

  render: function () {
    return (
      <div className='content-wrapper'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div id='distribuicao' className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Distribuição Geográfica</h1>
            </header>
            <div className='section-content'>
              {this.renderTable()}
            </div>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionDistribuicao;
