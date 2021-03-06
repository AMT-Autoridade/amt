'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { StickyContainer, Sticky } from 'react-sticky';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';
import c from 'classnames';

import makeTooltip from '../../utils/tooltip';
import { formatPT } from '../../utils/utils';

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
          <li><span className='tooltip-label'>{year.year}</span> <span className='tooltip-number'>{formatPT(year.value)}</span></li>
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
          top: 3,
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
    let pop = _.last(adminArea.data['pop-residente']).value;

    return (
      <li key={adminArea.id}>
        <span className='table-cell table-region'><Link to={url} title={`Ver página de ${adminArea.name}`}>{adminArea.name}</Link></span>
        <div className='table-cell table-graph'>{this.renderTrendLineChart(adminArea.data['lic-geral'], adminArea.id)}</div>
        <span className='table-cell table-scope'>{adminArea.data.contingente ? this.contingenteMatrix[adminArea.data.contingente] : 'Não Definido'}</span>
        <div className='table-cell table-parking'>
          <ul className='inline-list'>
            <li className={c('est est-livre', { active: adminArea.data.estacionamento.indexOf('livre') !== -1 })}>L</li>
            <li className={c('est est-condicionado', { active: adminArea.data.estacionamento.indexOf('condicionado') !== -1 })}>C</li>
            <li className={c('est est-fixo', { active: adminArea.data.estacionamento.indexOf('fixo') !== -1 })}>F</li>
            <li className={c('est est-escala', { active: adminArea.data.estacionamento.indexOf('escala') !== -1 })}>E</li>
          </ul>
        </div>
        <span className='table-cell table-pop'>{formatPT(pop)}</span>
      </li>
    );
  },

  renderTable: function () {
    let adminList = this.props.adminList;

    return (
      <StickyContainer>
        <ul className='table-distribution'>
          <li className='table-header'>
            <Sticky topOffset={-56}>
              <span className='table-cell table-region'>REGIÃO <span className='block'>(Concelho)</span></span>
              <span className='table-cell table-graph'>Evolução do <span className='block'>Total de Licenças</span></span>
              <span className='table-cell table-scope'>Âmbito Geográfico <span className='block'>do Contingente</span></span>
              <span className='table-cell table-parking'>Regime(s) de <span className='block'>Estacionamento</span></span>
              <span className='table-cell table-pop'>População <span className='block'>Residente</span></span>
            </Sticky>
          </li>
          {adminList.map(this.renderTableRow)}
        </ul>
      </StickyContainer>
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
          onClick={this.props.onMapClick.bind(null, 'distribuicao')}
          popoverContent={this.props.popoverContent}
          overlayInfoContent={this.props.overlayInfoContent.bind(null, 'distribuicao')}
        />

        <div className='map-legend'>
          <h6 className='legend-title'>Vagas por município:</h6>
          <ul className='color-legend inline'>
            <li><span style={{ backgroundColor: getColor(10) }}></span>&lt; 10</li>
            <li><span style={{ backgroundColor: getColor(50) }}></span>11 a 50</li>
            <li><span style={{ backgroundColor: getColor(51) }}></span>50 a 100</li>
            <li><span style={{ backgroundColor: getColor(101) }}></span>&gt; 100</li>
            <li><span style={{ backgroundColor: getColor(0) }}></span>Sem vagas</li>
          </ul>
        </div>
      </div>
    );
  },

  render: function () {
    return (
      <div id='distribuicao' className='content-wrapper vertical-center'>
        <div className='center'>
          <div className='map-wrapper'>
            {this.renderMap()}
          </div>
          <div className='section-wrapper'>
            <section className='section-container'>
              <header className='section-header'>
                <h3 className='section-category'>
                  {this.props.adminLevel === 'nut' ? <Link to='/#distribuicao' title='Ver Portugal'>Portugal</Link> : null}
                  {this.props.adminLevel === 'nut' ? ' › ' : null}
                  {this.props.adminName}
                </h3>
                <h1>Detalhe Geográfico</h1>
                <p className='lead'>Apresenta-se informação sobre as licenças, contingentes e regimes de estacionamento existentes a nível concelhio.</p>
              </header>
              <div className='section-content'>
                {this.renderTable()}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SectionDistribuicao;
