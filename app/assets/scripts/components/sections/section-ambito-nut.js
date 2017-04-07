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
    adminId: T.oneOfType([T.string, T.number]),
    adminName: T.string,
    adminList: T.array,
    mapGeometries: T.object,
    municipios: T.array,
    onMapClick: T.func,
    popoverContent: T.func,
    overlayInfoContent: T.func
  },

  contingenteMatrix: {
    'concelho': 'Concelho',
    'infra concelho': 'Infra Concelho'
  },

  chartsRef: [],

  onWindowResize: function () {
    this.chartsRef.map(ref => {
      this.refs[ref].chart_instance.resize();
    });
  },

  addChartRef: function (ref) {
    if (this.chartsRef.indexOf(ref) === -1) {
      this.chartsRef = this.chartsRef.concat([ref]);
    }
    return ref;
  },

  componentDidMount: function () {
    this.onWindowResize = _.debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  componentWillUnmount: function () {
    this.chartsRef = [];
    window.removeEventListener('resize', this.onWindowResize);
  },

  renderTrendLineChart: function (data, id) {
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
      responsive: false,
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
      <LineChart data={chartData} options={chartOptions} height={40} ref={this.addChartRef(`chart-trend-${id}`)} />
    );
  },

  renderTableRow: function (adminArea) {
    let url = `/nuts/${this.props.parentSlug}/concelhos/${_.kebabCase(adminArea.name)}`;
    return (
      <li key={adminArea.id}>
        <span className='table-region'><Link to={url} title={`Ver página de ${adminArea.name}`}>{adminArea.name}</Link></span>
        <div className='table-graph'>{this.renderTrendLineChart(adminArea.data['lic-geral'], adminArea.id)}</div>
        <div className='table-parking'>
          <ul className='inline-list'>
            <li className={c('est est-livre', {active: adminArea.data.estacionamento.indexOf('livre') !== -1})}>L</li>
            <li className={c('est est-condicionado', {active: adminArea.data.estacionamento.indexOf('condicionado') !== -1})}>C</li>
            <li className={c('est est-fixo', {active: adminArea.data.estacionamento.indexOf('fixo') !== -1})}>F</li>
            <li className={c('est est-escala', {active: adminArea.data.estacionamento.indexOf('escala') !== -1})}>E</li>
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
          <span className='table-region'>REGIÃO <span className='block'>(Concelho)</span></span>
           <span className='table-graph'>Evolução do <span className='block'>Total de Licenças</span></span>
          <span className='table-parking'>Regime(s) de <span className='block'>Estacionamento</span></span>
          <span className='table-scope'>Âmbito <span className='block'>Geográfico</span></span>
        </li>
        {adminList.map(this.renderTableRow)}
      </ul>
    );
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v === 0) return '#f5f5f5';
      if (v <= 10) return '#FFCC45';
      if (v <= 50) return '#FDB13A';
      if (v <= 100) return '#FB8F2C';
      return '#F8781F';
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
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={municipiosVagas}
          nut={this.props.adminId}
          onClick={this.props.onMapClick.bind(null, 'ambito')}
          popoverContent={this.props.popoverContent}
          overlayInfoContent={this.props.overlayInfoContent.bind(null, 'ambito')}
        />

        <div className='map-legend'>
          <h6 className='legend-title'>Vagas por município:</h6>
          <ul className='color-legend inline'>
            <li><span style={{backgroundColor: getColor(10)}}></span>&lt; 10</li>
            <li><span style={{backgroundColor: getColor(50)}}></span>11 a 50</li>
            <li><span style={{backgroundColor: getColor(51)}}></span>50 a 100</li>
            <li><span style={{backgroundColor: getColor(101)}}></span>&gt; 100</li>
            <li><span style={{backgroundColor: getColor(0)}}></span>Sem vagas</li>
          </ul>
        </div>
      </div>
    );
  },

  render: function () {
    return (
      <div id='distribuicao' className='content-wrapper vertical-center'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Detalhe Geográfico</h1>
              <p className='lead'>Não obstante as licenças municipais terem âmbito concelhio, apresenta-se a sua distribuição por concelho.</p>
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
