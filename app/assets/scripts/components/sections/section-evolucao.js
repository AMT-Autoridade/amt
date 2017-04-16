'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round, percent, formatPT } from '../../utils/utils';

import Map from '../map';

var SectionEvolucao = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminId: T.oneOfType([T.string, T.number]),
    licencas2016: T.number,
    licencas2006: T.number,
    totalMunicipios: T.number,
    municipios: T.array,
    licencasTimeline: T.array,
    data: T.object,
    mapGeometries: T.object,
    onMapClick: T.func,
    popoverContent: T.func,
    overlayInfoContent: T.func
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

  renderTimelineChart: function () {
    let nationalTimeline = this.props.licencasTimeline;
    let l = nationalTimeline.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = nationalTimeline[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>Contingentes:</span></li>
          <li><span className='tooltip-label'>Geral:</span> <span className='tooltip-number'>{formatPT(year['lic-geral'])}</span></li>
          <li><span className='tooltip-label'>Mob. Reduzida:</span> <span className='tooltip-number'>{formatPT(year['lic-mob-reduzida'])}</span></li>
          <li><span style={{backgroundColor: '#FFCC45'}} className='tooltip-marker'></span><span className='tooltip-label'>Total Contingentes:</span><span className='tooltip-number'>{formatPT(year['lic-geral'] + year['lic-mob-reduzida'])}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let labels = nationalTimeline.map((o, i) => i === 0 || i === l ? o.year : '');

    let chartData = {
      labels: labels,
      datasets: [{
        data: nationalTimeline.map(o => o['lic-geral'] + o['lic-mob-reduzida']),
        backgroundColor: '#eaeaea',
        borderColor: '#FFCC45',
        pointBorderWidth: 0,
        pointBackgroundColor: '#FFCC45',
        pointRadius: 3
      }]
    };

    let chartOptions = {
      responsive: false,
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

    return <LineChart data={chartData} options={chartOptions} height={300} ref={this.addChartRef('chart-timeline')}/>;
  },

  renderTopMunicipiosChart: function () {
    const topMunicipios = _(this.props.municipios)
      .sortBy('data.change')
      .reverse()
      .take(5)
      .filter(o => o.data.change > 0)
      .value();

    let tooltipFn = makeTooltip(entryIndex => {
      let municipio = topMunicipios[entryIndex];
      return (
        <ul className='small'>
          <li><span className='tooltip-label'>{municipio.name}:</span> <span className='tooltip-number'>+{municipio.data.change}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: topMunicipios.map(o => o.name),
      datasets: [
        {
          data: topMunicipios.map(o => o.data.change),
          backgroundColor: '#FFCC45'
        }
      ]
    };

    let chartOptions = {
      responsive: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          categoryPercentage: 1,
          gridLines: {
            display: false
          },
          ticks: {
            autoSkip: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
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

    // Different height depending on the number of datasets
    let height = [300, 300, 370, 370, 370][topMunicipios.length - 1];

    return <BarChart data={chartData} options={chartOptions} height={height} ref={this.addChartRef('chart-municipios')}/>;
  },

  renderChangeLicencasChart: function () {
    const {municipios, totalMunicipios} = this.props;

    const licencasChange = _(municipios)
      .groupBy(d => {
        if (d.data.change > 0) {
          return 'increase';
        } else if (d.data.change < 0) {
          return 'decrease';
        } else {
          return 'equal';
        }
      })
      .map((v, k) => ({key: k, value: v.length, percent: v.length / totalMunicipios * 100}))
      .value();

    const keyIndex = {
      increase: 'Aumentou',
      equal: 'Manteve',
      decrease: 'Diminuiu'
    };

    let tooltipFn = makeTooltip(entryIndex => {
      let entry = licencasChange[entryIndex];
      return (
        <ul className='small'>
          <li><span className='tooltip-label'>{keyIndex[entry.key]}:</span><span className='tooltip-number'>{formatPT(round(entry.percent, 1))}%</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: licencasChange.map(o => o.key),
      datasets: [{
        data: licencasChange.map(o => o.value),
        borderWidth: 0,
        backgroundColor: ['#FFCC45', '#FDB13A', '#FB8F2C']
      }]
    };

    let chartOptions = {
      responsive: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        position: 'nearest',
        custom: tooltipFn
      }
    };

    return <DoughnutChart data={chartData} options={chartOptions} height={280} ref={this.addChartRef('chart-change')}/>;
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v > 0) return '#256465';
      if (v < 0) return '#00ced1';
      return '#1f8d8e';
    };

    let evolucaoMunicipios = this.props.municipios.map(m => {
      return {
        id: m.id,
        color: getColor(m.data.change)
      };
    });

    return (
      <div>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={evolucaoMunicipios}
          nut={this.props.adminId}
          onClick={this.props.onMapClick.bind(null, 'evolucao')}
          popoverContent={this.props.popoverContent}
          overlayInfoContent={this.props.overlayInfoContent.bind(null, 'evolucao')}
        />

       <div className='map-legend'>
          <h6 className='legend-title'>Variação de Licenças por Município:</h6>
          <ul className='color-legend inline'>
            <li><span style={{backgroundColor: getColor(-1)}}></span>Diminuiu</li>
            <li><span style={{backgroundColor: getColor(0)}}></span>Manteve</li>
            <li><span style={{backgroundColor: getColor(1)}}></span>Aumentou</li>
         </ul>
        </div>

      </div>
    );
  },

  render: function () {
    let { licencas2016, licencas2006, totalMunicipios } = this.props;

    let newLicencas = licencas2016 - licencas2006;
    let increaseLicencas = newLicencas / licencas2006 * 100;

    // Municipios without change in number on licenças.
    let totalMunicipiosNoChange = this.props.municipios.reduce((acc, c) => c.data.change === 0 ? acc + 1 : acc, 0);

    return (
      <div id='evolucao' className='content-wrapper vertical-center'>
        <div className='center'>
          <div className='section-wrapper'>
            <section className='section-container'>
              <header className='section-header'>
                <h3 className='section-category'>
                  {this.props.adminLevel === 'nut' ? <Link to='/#evolucao' title='Ver Portugal'>Portugal</Link> : null}
                  {this.props.adminLevel === 'nut' ? ' › ' : null}
                  {this.props.adminName}
                </h3>
                <h1>Evolução 2006&#8212;2016</h1>
                <p className='lead'>Para além de conhecer a realidade atual importa igualmente conhecer a evolução existente. Analisam-se os desenvolvimentos ocorridos de 2006 a 2016.</p>
              </header>
              <div className='section-content'>
                <div className='section-stats'>
                  <ul>
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
                      <span className='stat-description'>Variação da % do número de <span className='block'>licenças entre 2006 e 2016.</span></span>
                    </li>
                    <li>
                      <span className='stat-number'>{formatPT(percent(totalMunicipiosNoChange, totalMunicipios, 0))}%</span>
                      <span className='stat-description'>Dos municípios não registaram alteração nos táxis licenciados.</span>
                    </li>
                  </ul>
                </div>

                <div className='graph-container'>
                  <div className='graph'>
                    <h6 className='legend-title'>Evolução das licenças 2006 a 2016:</h6>
                    {this.renderTimelineChart()}
                  </div>
                  <div className='graph'>
                    <h6 className='legend-title'>Municípios com maior aumento:</h6>
                    {this.renderTopMunicipiosChart()}
                  </div>
                  <div className='graph'>
                    <h6 className='legend-title'>Alterações do número de licenças:</h6>
                    {this.renderChangeLicencasChart()}
                  </div>
                </div>

              </div>
              <footer className='section-footer'>
                <p><strong>Nota:</strong> Existem dados relativos a 2016 para todos os concelhos. Para os poucos concelhos em que não está disponível informação para todos os anos foram usados valores imputados. <Link to='/dados'>Saber mais</Link></p>
              </footer>
            </section>
          </div>
          <div className='map-wrapper'>
            {this.renderMap()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SectionEvolucao;
