'use strict';
import React, { PropTypes as T } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';
import { Line as LineChart } from 'react-chartjs-2';

import { fetchConcelho, fetchMapData } from '../actions';
import makeTooltip from '../utils/tooltip';
import { round, percent, formatPT } from '../utils/utils';

import Map from '../components/map';

var Concelho = React.createClass({
  propTypes: {
    location: T.object,
    params: T.object,
    concelho: T.object,
    nut: T.object,
    national: T.object,
    mapData: T.object,
    _fetchConcelho: T.func,
    _fetchMapData: T.func
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
    this.chartsRef.indexOf(ref) === -1 && this.chartsRef.push(ref);
    return ref;
  },

  onMapClick: function (data) {
    // Find the right nut.
    let slug = this.props.nut.data.concelhos.find(o => o.id === data.id).slug;
    hashHistory.push(`/nuts/${this.props.params.nut}/concelhos/${slug}`);
  },

  popoverContent: function (data) {
    // Find the right concelho.
    let name = this.props.nut.data.concelhos.find(o => o.id === data.id).name;
    return (
      <div>
        <p className='map-tooltip'>{name}</p>
        <span className='triangle'></span>
      </div>
    );
  },

  overlayInfoContent: function () {
    let hash = this.props.location.hash || '';
    return (
      <div className='map-aa-info'>
        <ul className='map-aa-list inline-list'>
          <li><a className='map-back-link' href={`#/nuts/${this.props.nut.data.slug}${hash}`} title={`Ir para ${this.props.nut.data.name}`}><span className='i-arrow-left2'></span>{this.props.concelho.data.name}</a></li>
        </ul>
      </div>
    );
  },

  componentDidMount: function () {
    this.onWindowResize = _.debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
    this.props._fetchConcelho(this.props.params.nut, this.props.params.concelho);

    if (!this.props.mapData.fetched) {
      this.props._fetchMapData();
    }
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.params.concelho !== nextProps.params.concelho ||
    this.props.params.nut !== nextProps.params.nut) {
      return this.props._fetchConcelho(nextProps.params.nut, nextProps.params.concelho);
    }
  },

  renderLicencas1000Chart: function (lic1000Data, id) {
    let l = lic1000Data.labels.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = lic1000Data.labels[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{year}:</span></li>
          {lic1000Data.datasets.map(o => <li key={o.label}><span style={{backgroundColor: o.color}} className='tooltip-marker'></span><span className='tooltip-label'>{o.label}:</span> <span className='tooltip-number'>{round(o.data[entryIndex])}</span></li>)}
          <span className='triangle'></span>
        </ul>
      );
    });

    let labels = lic1000Data.labels.map((o, i) => i === 0 || i === l ? o : '');

    let chartData = {
      labels: labels,
      datasets: lic1000Data.datasets.map(o => ({
        data: o.data,
        backgroundColor: o.backgroundColor,
        borderColor: o.color,
        pointBorderWidth: 0,
        pointBackgroundColor: o.color,
        pointRadius: 2
      }))
    };

    let chartOptions = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            maxRotation: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
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

    return <LineChart data={chartData} options={chartOptions} height={240} ref={this.addChartRef(`chart-${id}`)}/>;
  },

  renderTimelineChart: function () {
    let nationalTimeline = this.props.concelho.data.data.licencasTimeline;
    let l = nationalTimeline.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = nationalTimeline[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>Licenças e Contingentes:</span></li>
          <li><span style={{backgroundColor: '#1f8d8e'}} className='tooltip-marker'></span><span className='tooltip-label'>Total Licenças:</span><span className='tooltip-number'>{formatPT(year['lic-geral'] + year['lic-mob-reduzida'])}</span></li>
          <li><span className='tooltip-label'>Total Contingentes:</span> <span className='tooltip-number'>{formatPT(year['max-lic-geral'] + year['max-lic-mob-reduzida'])}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let labels = nationalTimeline.map((o, i) => i === 0 || i === l ? o.year : '');

    let chartData = {
      labels: labels,
      datasets: [{
        data: nationalTimeline.map(o => o['lic-geral'] + o['lic-mob-reduzida']),
        backgroundColor: '#f5f5f5',
        borderColor: '#1f8d8e',
        pointBorderWidth: 0,
        pointBackgroundColor: '#1f8d8e',
        pointRadius: 3
      }]
    };

    let chartOptions = {
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 10
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            maxRotation: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
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

    return <LineChart data={chartData} options={chartOptions} height={240} ref={this.addChartRef(`chart-timeline`)}/>;
  },

  renderLic1000HabChart: function () {
    let chartLic1000Had = {
      labels: this.props.concelho.data.data.licencasTimeline.map(y => y.year),
      datasets: _.sortBy([
        {
          data: this.props.national.data.licencasTimeline.map(o => o['lic1000']),
          label: 'Portugal',
          color: '#1f8d8e',
          backgroundColor: 'rgba(245, 245, 245, 0.2)'
        },
        {
          data: this.props.nut.data.data.licencasTimeline.map(o => o['lic1000']),
          label: this.props.nut.data.name,
          color: '#00ced1',
          backgroundColor: 'rgba(245, 245, 245, 0.2)'
        },
        {
          data: this.props.concelho.data.data.licencasTimeline.map(o => o['lic1000']),
          label: this.props.concelho.data.name,
          color: '#256465',
          backgroundColor: 'rgba(245, 245, 245, 0.2)'
        }
      ], d => d.data[d.data.length - 1])
    };
    return this.renderLicencas1000Chart(chartLic1000Had, '1000hab');
  },

  renderLic1000DormidasChart: function () {
    let availableYears = [];
    this.props.concelho.data.data.dormidas.forEach(o => {
      if (o.value !== null) availableYears.push(o.year);
    });

    let chartLic1000Dormidas = {
      labels: availableYears,
      datasets: _.sortBy([
        {
          data: this.props.national.data.dormidas.filter(o => _.includes(availableYears, o.year)).map(o => o.lic1000),
          label: 'Portugal',
          color: '#1f8d8e',
          backgroundColor: 'rgba(245, 245, 245, 0.2)'
        },
        {
          data: this.props.concelho.data.data.dormidas.filter(o => _.includes(availableYears, o.year)).map(o => o.lic1000),
          label: this.props.concelho.data.name,
          color: '#256465',
          backgroundColor: 'rgba(245, 245, 245, 0.2)'
        }
      ], d => d.data[0])
    };
    return this.renderLicencas1000Chart(chartLic1000Dormidas, '1000dor');
  },

  renderMap: function () {
    if (!this.props.mapData.fetched) return null;

    return (
      <Map
        className='map-svg'
        geometries={this.props.mapData.data}
        nut={this.props.nut.data.id}
        concelho={this.props.concelho.data.id}
        onClick={this.onMapClick}
        popoverContent={this.popoverContent}
        overlayInfoContent={this.overlayInfoContent}
      />
    );
  },

  renderFileLink: function () {
    let files = this.props.concelho.data.files;

    return (
      <div>
        {files.length ? (
          <p className='aa-doc-download'><a href={files[0]} title='Descarregar documento'>Descarregue o documento relativo a {this.props.concelho.data.name}.</a></p>
        ) : null}
      </div>
    );
  },

  render: function () {
    let { fetched, fetching, error, data: concelho } = this.props.concelho;
    let nut = this.props.nut.data;

    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return <p>Loading</p>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    let hash = this.props.location.hash || '';

    let {
      licencas2016,
      licencas2006,
      max2016,
      dormidas,
      licencasTimeline,
      estacionamento,
      contingente
    } = concelho.data;

    dormidas = _.last(dormidas).lic1000;
    dormidas = dormidas ? round(dormidas, 1) : 'N/A';

    let licencas1000Hab = _.last(licencasTimeline).lic1000;
    licencas1000Hab = round(licencas1000Hab, 1);

    let licMobRed = _.last(concelho.data['lic-mob-reduzida']).value;

    let newLicencas = licencas2016 - licencas2006;
    let increaseLicencas = newLicencas / licencas2006 * 100;

    let totNat2016 = this.props.national.data.licencas2016;

    let percentNational = percent(licencas2016, totNat2016, 0);
    let pop = _.last(concelho.data['pop-residente']).value;
    let percentPop = percent(pop, this.props.national.data.populacao, 0);

    return (
      <div id="page-content">

         <div id='concelho' className='content-wrapper vertical-center'>

          <div className='map-wrapper'>
            {this.renderMap()}
          </div>

          <div className='section-wrapper'>
            <section className='section-container'>
              <header className='section-header'>
                <h3 className='section-category'><Link to={`/${hash}`} title='Ver Portugal'>Portugal</Link> &rsaquo; <Link to={`/nuts/${nut.slug}${hash}`} title={`Ver ${nut.name}`}>{nut.name}</Link></h3>
                <h1>{concelho.name}</h1>
              </header>
              <div className='section-content'>
                <div className='section-stats'>
                  <ul>
                    <li>
                      <span className='stat-number'>{formatPT(licencas2016)}</span>
                      <span className='stat-description'>Total de táxis licenciados <span className='block'>em agosto de 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>{formatPT(max2016)}</span>
                      <span className='stat-description'>Total dos contingentes <span className='block'>em agosto de 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>{formatPT(max2016 - licencas2016)}</span>
                      <span className='stat-description'>Total de vagas existentes <span className='block'>em agosto de 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>{licMobRed}</span>
                      <span className='stat-description'>Licenças existentes no <span className='block'>CMR em Agosto de 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>
                        <span>{newLicencas < 0 ? '-' : '+'}</span>
                        {formatPT(Math.abs(newLicencas))}
                      </span>
                      <span className='stat-description'>Variação no número de <span className='block'>licenças entre 2006 e 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>
                        <span>{increaseLicencas < 0 ? '-' : '+'}</span>
                        {formatPT(round(Math.abs(increaseLicencas), 0))}%
                      </span>
                      <span className='stat-description'>Variação percentual do número de licenças<span className='block'> entre 2006 e 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>{licencas1000Hab}</span>
                      <span className='stat-description'>Táxis licenciados por 1000 residentes.</span>
                    </li>
                    <li>
                      <span className='stat-number'>{dormidas}</span>
                      <span className='stat-description'>Táxis licenciados por 1000 dormidas.</span>
                    </li>
                  </ul>
                </div>

                <ul className='table-distribution'>
                  <li className='table-header'>
                    <span className='table-cell table-scope'>Âmbito Geográfico<span className='block'>do Contingente</span></span>
                    <span className='table-cell table-parking'>Regime(s) de <span className='block'>Estacionamento</span></span>
                    <span className='table-cell table-national'>% do Total de <span className='block'>Licenças em Portugal</span></span>
                    <span className='table-cell table-residents'>% do Total de Pop. <span className='block'>Residente em Portugal</span></span>
                    <span className='table-cell table-pop'>População <span className='block'>Residente (2015)</span></span>
                  </li>
                  <li>
                    <span className='table-cell table-scope'>{contingente ? this.contingenteMatrix[contingente] : 'Não Definido'}</span>
                    <div className='table-cell table-parking'>
                      <ul className='inline-list'>
                        <li className={c('est est-livre', {active: estacionamento.indexOf('livre') !== -1})}>L</li>
                        <li className={c('est est-condicionado', {active: estacionamento.indexOf('condicionado') !== -1})}>C</li>
                        <li className={c('est est-fixo', {active: estacionamento.indexOf('fixo') !== -1})}>F</li>
                        <li className={c('est est-escala', {active: estacionamento.indexOf('escala') !== -1})}>E</li>
                      </ul>
                    </div>
                    <span className='table-cell table-national'>{formatPT(percentNational)}%</span>
                    <span className='table-cell table-residents'>{formatPT(percentPop)}%</span>
                    <span className='table-cell table-pop'>{formatPT(pop)}</span>
                  </li>
                </ul>

                <div className='graph-container'>
                  <div className='graph'>
                    <h6 className='legend-title'>Evolução dos táxis licenciados <span className='block'>de 2006 a 2016</span></h6>
                    {this.renderTimelineChart()}
                  </div>
                  <div className='graph'>
                    <h6 className='legend-title'>Evolução dos táxis licenciados <span className='block'>por 1000 residentes</span></h6>
                    {this.renderLic1000HabChart()}
                  </div>
                  <div className='graph'>
                    <h6 className='legend-title'>Evolução dos táxis licenciados <span className='block'>por 1000 dormidas</span></h6>
                    {this.renderLic1000DormidasChart()}
                  </div>
                </div>
                {this.renderFileLink()}
              </div>
              <footer className='section-footer'>
                <p><strong>Nota I:</strong> Os valores dos indicadores devem ser analisados caso a caso e comparados com particular precaução. A consideração de outros fatores com influência na procura poderá melhor enquadrar as diferenças existentes.</p>
                <p><strong>Nota II:</strong> Dormidas nos estabelecimentos hoteleiros (estabelecimento cuja atividade principal consiste na prestação de serviços de alojamento e de outros serviços acessórios ou de apoio, mediante pagamento).</p>
              </footer>
            </section>
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
    concelho: state.concelho,
    nut: state.nut,
    national: state.national,
    mapData: state.mapData
  };
}

function dispatcher (dispatch) {
  return {
    _fetchConcelho: (...args) => dispatch(fetchConcelho(...args)),
    _fetchMapData: (...args) => dispatch(fetchMapData(...args))
  };
}

module.exports = connect(selector, dispatcher)(Concelho);
