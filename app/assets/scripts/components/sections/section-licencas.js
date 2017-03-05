'use strict';
import React, { PropTypes as T } from 'react';
import { render } from 'react-dom';
import { Bar as BarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';

var SectionLicencas = React.createClass({
  displayName: 'SectionLicencas',

  propTypes: {
    data: T.object
  },

  render: function () {
    let data = this.props.data;
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
          backgroundColor: '#ccc'
        },
        {
          data: distritos.map(o => o.data.max2016 - o.data.licencas2016),
          backgroundColor: '#444'
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

    return (
      <div id='section-licencas' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>Portugal</h3>
            <h1>Licenças e Contingentes</h1>
            <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo IMT (acesso à actividade) e, simultaneamente, possua uma licença atribuída pelo município (acesso ao mercado). </p>
          </header>
          <div className='section-content'>
            <ul className='section-stats'>
              <li>
                <span className='stat-number'>{data.licencas2016}</span>
                <span className='stat-description'>Total de táxis licenciados em Agosto de 2016.</span>
              </li>
              <li>
                <span className='stat-number'>{data.max2016}</span>
                <span className='stat-description'>Total dos contingentes em Agosto de 2016.</span>
              </li>
              <li>
                <span className='stat-number'>{Math.round(data.licencasHab * 10) / 10}</span>
                <span className='stat-description'>Licenças activas por 1000 Habitantes</span>
              </li>
            </ul>

            <BarChart data={chartData} options={chartOptions} />

          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionLicencas;
