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
    adminId: T.oneOfType([T.string, T.number]),
    licencasHab: T.number,
    chartDatasets: T.object,
    mapGeometries: T.object,
    municipios: T.array,
    onMapClick: T.func,
    popoverContent: T.func
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
      if (v <= 1) return '#7FECDA';
      if (v <= 2) return '#00DFC1';
      if (v <= 3) return '#2D8374';
      if (v <= 4) return '#1F574D';
      return '#0F2B26';
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
        <h6 className='map-title'>Licenças por 1000 habitantes</h6>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={licencas1000Hab}
          nut={this.props.adminId}
          onClick={this.props.onMapClick}
          popoverContent={this.props.popoverContent}
        />
        <ul className='color-legend side-by-side'>
          <li><span style={{backgroundColor: getColor(1)}}></span>1</li>
          <li><span style={{backgroundColor: getColor(2)}}></span>2</li>
          <li><span style={{backgroundColor: getColor(3)}}></span>3</li>
          <li><span style={{backgroundColor: getColor(4)}}></span>4</li>
          <li><span style={{backgroundColor: getColor(5)}}></span>+4</li>
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
         <div id='residentes' className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Indicadores</h1>
              <p className='lead'>A ponderação de indicadores que associem o número de táxis a fatores com influência na sua procura é uma forma interessante de conhecer a realidade e a sua evolução, em diferentes regiões, permitindo analisar tendências, fatores que influenciam a procura e estimar o efeito de alterações regulatórias. Os fatores que podem influenciar a procura de táxis são imensos. Não é adequado efetuar considerações sobre o número “adequado” de táxis, tendo por base comparações simplistas e descontextualizadas entre regiões.</p>
            </header>

            <div className='section-content'>
              <div className='section-stats'>
                <ul>
                  <li>
                    <span className='stat-number'>{round(this.props.licencasHab, 1)}</span>
                    <span className='stat-description'>Licenças por 1000 habitantes</span>
                  </li>
                  <li>
                    <span className='stat-number'>{round(this.props.licencasHab, 1)}</span>
                    <span className='stat-description'>Licenças por 1000 habitantes</span>
                  </li>
                </ul>
              </div>

               <div className='graph'>
                {this.renderLicencas100Hab()}
                <p className='graph-description'>Evolução das licenças por 1000 residentes</p>
              </div>
              <div className='graph'>
                {this.renderLicencas100Hab()}
                <p className='graph-description'>Evolução das licenças por 1000 dormidas</p>
              </div>

            </div>
            <footer className='section-footer'>
              <p><strong>Notas:</strong> O número de veículos habilitados ao transporte de pessoas com mobilidade reduzida será superior ao apresentado. Este tipo de veículos podem estar licenciados no âmbito dos contingentes gerais. A AMT pretende aprofundar o conhecimento sobre esta matéria.</p>
            </footer>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionResidentes;
