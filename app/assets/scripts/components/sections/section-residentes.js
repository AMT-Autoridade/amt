'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round } from '../../utils/utils';

import Map from '../map';

var SectionResidentes = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    licencasHab: T.number,
    chartDatasets: T.object,
    mapGeometries: T.object,
    municipios: T.array
  },

  renderLicencas100Hab: function () {
    let chartDatasets = this.props.chartDatasets;
    let l = chartDatasets.labels.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = chartDatasets.labels[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{year}:</span></li>
          {chartDatasets.datasets.map(o => <li key={o.label}><span className='tooltip-label'>{o.label}:</span> <span className='tooltip-number'>{round(o.data[entryIndex])}</span></li>)}
          <span className='triangle'></span>
        </ul>
      );
    });

    let labels = chartDatasets.labels.map((o, i) => i === 0 || i === l ? o : '');

    let chartData = {
      labels: labels,
      datasets: chartDatasets.datasets.map(o => ({
        data: o.data,
        backgroundColor: 'transparent',
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

    return <LineChart data={chartData} options={chartOptions} height={220}/>;
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
        />
        
       <div className='map-legend'>
          <h6 className='legend-title'>Licenças por 1000 habitantes:</h6>
          <ul className='color-legend inline'>
            <li><span style={{backgroundColor: getColor(1)}}></span>1</li>
            <li><span style={{backgroundColor: getColor(2)}}></span>2</li>
            <li><span style={{backgroundColor: getColor(3)}}></span>3</li>
            <li><span style={{backgroundColor: getColor(4)}}></span>4</li>
            <li><span style={{backgroundColor: getColor(5)}}></span>+4</li>
            <li><span style={{backgroundColor: getColor(6)}}></span>+4</li>
         </ul>
        </div>
      </div>
    );
  },

  render: function () {
    return (
      <div id='residentes' className='content-wrapper'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
         <div className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Outros Indicadores</h1>
              <p className='lead'>Os indicadores que associam o número de táxis a fatores com influência na sua procura é uma forma interessante de analisar a realidade e a sua evolução. Não é adequado efetuar comparações simplistas e descontextualizadas entre regiões.</p>
            </header>

            <div className='section-content'>
              <div className='section-stats'>
                <ul className='two-columns'>
                  <li>
                    <span className='stat-number'>{round(this.props.licencasHab, 1)}</span>
                    <span className='stat-description'>Licenças activas por 1000 residentes</span>
                  </li>
                  <li>
                    <span className='stat-number'>{round(this.props.licencasHab, 1)}</span>
                    <span className='stat-description'>Licenças activas por 1000 dormidas</span>
                  </li>
                </ul>
              </div>

              <div className='two-columns'>
                <div className='graph'>
                  <h6 className='legend-title'>Evolução das licenças por 1000 residentes</h6>
                  {this.renderLicencas100Hab()}
                </div>
                <div className='graph'>
                  <h6 className='legend-title'>Evolução das licenças por 1000 dormidas</h6>
                  {this.renderLicencas100Hab()}
                </div>
              </div>
            </div>
            <footer className='section-footer'>
              <ul className='color-legend inline'>
                <li><strong>Legenda:</strong></li>
                <li><span style={{backgroundColor: '#00ced1'}}></span> Área Metropolitana de Lisboa</li>
                <li><span style={{backgroundColor: '#1f8d8e'}}></span> Portugal</li>
                <li><span style={{backgroundColor: '#256465'}}></span> Área Metropolitana do Porto</li>
              </ul>
            </footer>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionResidentes;
