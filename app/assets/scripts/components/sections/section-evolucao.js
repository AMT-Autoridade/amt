'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round, percent } from '../../utils/utils';

var SectionEvolucao = React.createClass({
  propTypes: {
    data: T.object
  },

  renderTimelineChart: function () {
    let nationalTimeline = this.props.data.licencasTimeline;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = nationalTimeline[entryIndex];
      return (
        <div>
          <p>total {year['lic-geral'] + year['lic-mob-reduzida']}</p>
          <p>geral {year['lic-geral']}</p>
          <p>reduzida {year['lic-mob-reduzida']}</p>
        </div>
      );
    });

    let chartData = {
      labels: nationalTimeline.map(o => o.year),
      datasets: [
        {
          data: nationalTimeline.map(o => o['lic-geral'] + o['lic-mob-reduzida'])
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

    return <LineChart data={chartData} options={chartOptions} />;
  },

  render: function () {
    let data = this.props.data;

    let newLicencas = data.licencas2016 - data.licencas2006;
    let increaseLicencas = newLicencas / data.licencas2006 * 100;

    // Municipios without change in number on licenças.
    let municipiosNoChange = data.distritos.reduce((acc, distrito) => {
      return acc + distrito.concelhos.reduce((acc_, concelho) => concelho.data.change === 0 ? acc_ + 1 : acc_, 0);
    }, 0);

    return (
      <div id='section-evolucao' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>Portugal</h3>
            <h1>Evolução 2006 - 2016</h1>
            <p>O número total de táxis manteve-se estável, sendo o maior aumento sentido em Lisboa,  e a maior diminuição nas regiões autónomas da Madeira e Açores.</p>
          </header>
          <div className='section-content'>
            <ul className='section-stats three-columns'>
              <li>
                <span className='stat-number'>{newLicencas}</span>
                <span className='stat-description'>Aumento do número de licenças entre 2006 e 2016.</span>
              </li>
              <li>
                <span className='stat-number'>{round(increaseLicencas, 2)}%</span>
                <span className='stat-description'>Crescimento dos táxis licenciados desde 2006.</span>
              </li>
              <li>
                <span className='stat-number'>{percent(municipiosNoChange, data.totalMunicipios)}%</span>
                <span className='stat-description'>Dos municípios não registaram alteração no número de licenças.</span>
              </li>
            </ul>

            <div className='three-columns'>
              <div className='graph'>
                {this.renderTimelineChart()}
                <p>Evolução das licenças 2006 a 2016.</p>
              </div>
              <div className='graph'>
                <strong>Graph goes here</strong>
                <p>Municipios com maior aumento.</p>
              </div>
              <div className='graph'>
                <strong>Graph goes here</strong>
                <p>Alterações do número de licenças.</p>
              </div>
            </div>

            
          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> Para os concelhos em que não existia informação disponível para todos os anos existiu interpolação de valores. A percentagem de valores interpolados correspondeu a apenas 0,2% do total de valores considerados. <a href="#">Saber mais</a></p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEvolucao;
