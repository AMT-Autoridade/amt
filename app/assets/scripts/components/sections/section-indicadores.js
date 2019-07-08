'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round, formatPT } from '../../utils/utils';

import Map from '../map';

var SectionResidentes = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminId: T.oneOfType([T.string, T.number]),
    licencasHab: T.number,
    dormidas: T.array,
    chartLic1000Hab: T.object,
    chartLic1000Dor: T.object,
    mapGeometries: T.object,
    municipios: T.array,
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

  renderLicencas1000Chart: function (lic1000Data, id) {
    let l = lic1000Data.labels.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = lic1000Data.labels[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{year}:</span></li>
          {lic1000Data.datasets.map(o => <li key={o.label}><span style={{ backgroundColor: o.color }} className='tooltip-marker'></span><span className='tooltip-label'>{o.label}:</span> <span className='tooltip-number'>{formatPT(round(o.data[entryIndex]))}</span></li>)}
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

    return <LineChart data={chartData} options={chartOptions} height={200} ref={this.addChartRef(`chart-lic1000${id}`)} />;
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v <= 1) return '#FFCC45';
      if (v <= 2) return '#FDB13A';
      if (v <= 3) return '#FB8F2C';
      if (v <= 4) return '#F8781F';
      if (v <= 5) return '#CE4116';
      return '#B23E1D';
    };

    let licencas1000Hab = this.props.municipios.map(m => {
      let totalLic = _.last(m.data['lic-geral']).value + _.last(m.data['lic-mob-reduzida']).value;
      let lic1000 = totalLic / (_.last(m.data['pop-residente']).value / 1000);

      return {
        id: m.id,
        color: getColor(lic1000)
      };
    });

    return (
      <div>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={licencas1000Hab}
          nut={this.props.adminId}
          onClick={this.props.onMapClick.bind(null, 'indicadores')}
          popoverContent={this.props.popoverContent}
          overlayInfoContent={this.props.overlayInfoContent.bind(null, 'indicadores')}
        />

        <div className='map-legend'>
          <h6 className='legend-title'>Táxis licenciados por 1000 residentes:</h6>
          <ul className='color-legend inline'>
            <li><span style={{ backgroundColor: getColor(1) }}></span>1</li>
            <li><span style={{ backgroundColor: getColor(2) }}></span>2</li>
            <li><span style={{ backgroundColor: getColor(3) }}></span>3</li>
            <li><span style={{ backgroundColor: getColor(4) }}></span>4</li>
            <li><span style={{ backgroundColor: getColor(5) }}></span>5</li>
            <li><span style={{ backgroundColor: getColor(6) }}></span>+6</li>
          </ul>
        </div>
      </div>
    );
  },

  render: function () {
    let dormidas = _.last(this.props.dormidas).lic1000;
    dormidas = dormidas ? round(dormidas, 1) : 'N/A';

    return (
      <div id='indicadores' className='content-wrapper vertical-center'>
        <div className='center'>
          <div className='section-wrapper'>
            <section className='section-container'>
              <header className='section-header'>
                <h3 className='section-category'>
                  {this.props.adminLevel === 'nut' ? <Link to='/#indicadores' title='Ver Portugal'>Portugal</Link> : null}
                  {this.props.adminLevel === 'nut' ? ' › ' : null}
                  {this.props.adminName}
                </h3>
                <h1>Indicadores</h1>
                <p className='lead'>Os indicadores que associam o número de táxis a fatores com influência na sua procura são uma forma útil de analisar a realidade e a sua evolução.</p>
              </header>

              <div className='section-content'>
                <div className='section-stats'>
                  <ul className='two-columns'>
                    <li>
                      <span className='stat-number'>{formatPT(round(this.props.licencasHab, 1))}</span>
                      <span className='stat-description'>Táxis licenciados por 1000 residentes.</span>
                    </li>
                    {this.props.adminLevel === 'national' ? (
                      <li>
                        <span className='stat-number'>{formatPT(dormidas)}</span>
                        <span className='stat-description'>Táxis licenciados por 1000 dormidas.</span>
                      </li>
                    ) : null }
                  </ul>
                </div>

                <div className='graph-container'>
                  <div className='graph'>
                    <h6 className='legend-title'>Evolução dos táxis licenciados por 1000 residentes:</h6>
                    {this.renderLicencas1000Chart(this.props.chartLic1000Hab, 'hab')}
                  </div>
                  {this.props.adminLevel === 'national' ? (
                    <div className='graph'>
                      <h6 className='legend-title'>Evolução dos táxis licenciados por 1000 dormidas:</h6>
                      {this.renderLicencas1000Chart(this.props.chartLic1000Dor, 'dor')}
                    </div>
                  ) : null}
                </div>
              </div>
              <footer className='section-footer'>
                <p><strong>Nota I:</strong> Os valores dos indicadores devem ser analisados caso a caso e comparados com particular precaução. A consideração de outros fatores com influência na procura poderá melhor enquadrar as diferenças existentes.</p>
                {this.props.adminLevel === 'national' ? (
                  <p><strong>Nota II:</strong> Dormidas nos estabelecimentos hoteleiros (estabelecimento cuja atividade principal consiste na prestação de serviços de alojamento e de outros serviços acessórios ou de apoio, mediante pagamento).</p>
                ) : null }
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

module.exports = SectionResidentes;
