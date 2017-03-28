'use strict';
import React, { PropTypes as T } from 'react';
import { Bar as BarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round } from '../../utils/utils';

var SectionLicencas = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminList: T.array,
    licencas2016: T.number,
    max2016: T.number,
    licencasHab: T.number
  },

  renderChart: function () {
    let dataList = _(this.props.adminList)
      .sortBy('data.licencas2016')
      .reverse()
      .value();

    let tooltipFn = makeTooltip(entryIndex => {
      let datum = dataList[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{datum.name}</span></li>
          <li><span className='tooltip-label'>Contingente:</span><span className='tooltip-number'>{datum.data.max2016.toLocaleString()}</span></li>
          <li><span className='tooltip-label'>Licenças activas:</span> <span className='tooltip-number'>{datum.data.licencas2016.toLocaleString()}</span></li>
          <li><span className='tooltip-label'>Vagas disponíveis:</span> <span className='tooltip-number'>{(datum.data.max2016 - datum.data.licencas2016).toLocaleString()}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: dataList.map(o => o.display),
      datasets: [
        {
          data: dataList.map(o => o.data.licencas2016),
          backgroundColor: '#F6B600'
        },
        {
          data: dataList.map(o => o.data.max2016 - o.data.licencas2016),
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
                return tick.toLocaleString();
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
    let { licencas2016, max2016, licencasHab } = this.props;

    return (
      <div id='licencas' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3 className='section-category'>{this.props.adminName}</h3>
            <h1>Licenças e Contingentes</h1>
            <p className="lead">A prestação de serviços de táxi implica que o prestador de serviço detenha uma licença por cada veículo utilizado. As câmaras municipais atribuem estas licenças e definem o número máximo de veículos que poderá prestar serviços no seu concelho — contingente de táxis.</p>
          </header>
          <div className='section-content'>
            <div className='section-stats'>
              <ul>
                <li>
                  <span className='stat-number'>{licencas2016.toLocaleString()}</span>
                  <span className='stat-description'>Total de táxis licenciados em agosto de 2016.</span>
                </li>
                <li>
                  <span className='stat-number'>{max2016.toLocaleString()}</span>
                  <span className='stat-description'>Total dos contingentes em agosto de 2016.</span>
                </li>
                <li>
                  <span className='stat-number'>{max2016.toLocaleString()}</span>
                  <span className='stat-description'>Total de vagas existentes em agosto de 2016.</span>
                </li>
                <li>
                  <span className='stat-number'>{round(licencasHab, 1).toLocaleString()}</span>
                  <span className='stat-description'>Licenças activas por 1 000 residentes.</span>
                </li>
              </ul>
            </div>

            {this.renderChart()}

          </div>
        </section>
      </div>
    );
  }
});

module.exports = SectionLicencas;
