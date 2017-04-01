'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';

import makeTooltip from '../../utils/tooltip';
import { round } from '../../utils/utils';

var SectionResidentes = React.createClass({
  propTypes: {
    licencasHab: T.number,
    licencasTimeline: T.array
  },

  renderLicencas100Hab: function () {
    let nationalTimeline = this.props.licencasTimeline;
    let l = nationalTimeline.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = nationalTimeline[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{year.year}:</span></li>
          <li><span className='tooltip-label'>AM Lisboa:</span> <span className='tooltip-number'>{round(year['lic1000-lx'])}</span></li>
          <li><span className='tooltip-label'>Geral:</span> <span className='tooltip-number'>{round(year['lic1000'])}</span></li>
          <li><span className='tooltip-label'>AM Porto:</span><span className='tooltip-number'>{round(year['lic1000-por'])}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let labels = nationalTimeline.map((o, i) => i === 0 || i === l ? o.year : '');

    let chartData = {
      labels: labels,
      datasets: [
        {
          data: nationalTimeline.map(o => o['lic1000']),
          backgroundColor: 'transparent',
          borderColor: '#F6B600',
          pointBorderWidth: 0,
          pointBackgroundColor: '#F6B600',
          pointRadius: 2
        },
        {
          data: nationalTimeline.map(o => o['lic1000-lx']),
          backgroundColor: 'transparent',
          borderColor: '#F6B600',
          pointBorderWidth: 0,
          pointBackgroundColor: '#F6B600',
          pointRadius: 2
        },
        {
          data: nationalTimeline.map(o => o['lic1000-por']),
          backgroundColor: 'transparent',
          borderColor: '#F6B600',
          pointBorderWidth: 0,
          pointBackgroundColor: '#F6B600',
          pointRadius: 2
        }
      ]
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

  render: function () {
    return (
       <div id='residentes' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3 className='section-category'>PORTUGAL</h3>
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
    );
  }
});

module.exports = SectionResidentes;
