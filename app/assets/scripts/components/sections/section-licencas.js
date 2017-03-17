'use strict';
import React, { PropTypes as T } from 'react';
import { Bar as BarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round } from '../../utils/utils';

var SectionLicencas = React.createClass({
  propTypes: {
    data: T.object
  },

  renderChart: function () {
    let distritos = _.sortBy(this.props.data.distritos, 'data.licencas2016').reverse();

    let tooltipFn = makeTooltip(entryIndex => {
      let distrito = distritos[entryIndex];
      return (
        <div>
          <p>{distrito.name}</p>
          <p>geral {distrito.data.licencas2016}</p>
          <p>max {distrito.data.max2016}</p>
          <p>Vagas {distrito.data.max2016 - distrito.data.licencas2016}</p>
        </div>
      );
    });

    let chartData = {
      labels: distritos.map(o => o.name),
      datasets: [
        {
          data: distritos.map(o => o.data.licencas2016),
          backgroundColor: '#F6B600'
        },
        {
          data: distritos.map(o => o.data.max2016 - o.data.licencas2016),
          backgroundColor: '#2EB199'
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
          stacked: true,
          type: 'logarithmic',
          gridLines: {
            display: false
          },
          ticks: {
            callback: (tick, index, ticks) => {
              var remain = tick / (Math.pow(10, Math.floor(Math.log10(tick))));

              if (tick === 0) {
                return '0';
              } else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) {
                return tick;
              }
              return '';
            }
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

    return <BarChart data={chartData} options={chartOptions} />;
  },

  render: function () {
    let data = this.props.data;

    return (
      <div id='section-licencas' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3 className='section-category'>Portugal</h3>
            <h1>Licenças e Contingentes</h1>
            <p className="lead">A prestação de serviços de táxi implica que o prestador de serviço detenha uma licença por cada veículo utilizado. As câmaras municipais atribuem estas licenças e definem o número máximo de veículos que poderá prestar serviços no seu concelho — contingente de táxis.</p>
          </header>
          <div className='section-content'>
            <ul className='section-stats three-columns'>
              <li>
                <span className='stat-number'>{data.licencas2016}</span>
                <span className='stat-description'>Total de táxis licenciados em agosto de 2016.</span>
              </li>
              <li>
                <span className='stat-number'>{data.max2016}</span>
                <span className='stat-description'>Total dos contingentes  em agosto de 2016.</span>
              </li>
              <li>
                <span className='stat-number'>{round(data.licencasHab, 1)}</span>
                <span className='stat-description'>Licenças activas por 1000 residentes.</span>
              </li>
            </ul>

            {this.renderChart()}

          </div>
          <footer className='section-footer'>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionLicencas;
