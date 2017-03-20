'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round, percent } from '../../utils/utils';

var SectionEvolucao = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    licencas2016: T.number,
    licencas2006: T.number,
    totalMunicipios: T.number,
    municipios: T.array,
    licencasTimeline: T.array,
    data: T.object
  },

  renderTimelineChart: function () {
    let nationalTimeline = this.props.licencasTimeline;

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
      datasets: [{
        data: nationalTimeline.map(o => o['lic-geral'] + o['lic-mob-reduzida']),
        backgroundColor: '#FFE7A2',
        borderColor: '#F6B600',
        pointBorderWidth: 0,
        pointBackgroundColor: '#F6B600',
        pointRadius: 2
      }]
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

  renderTopMunicipiosChart: function () {
    const topMunicipios = _(this.props.municipios)
      .sortBy('data.change')
      .reverse()
      .take(5)
      .value();

    let tooltipFn = makeTooltip(entryIndex => {
      let municipio = topMunicipios[entryIndex];
      return (
        <div>
          <p>{municipio.name}</p>
          <p>aumento {municipio.data.change}</p>
        </div>
      );
    });

    let chartData = {
      labels: topMunicipios.map(o => o.name),
      datasets: [
        {
          data: topMunicipios.map(o => o.data.change),
          backgroundColor: '#F6B600'
        }
      ]
    };

    let chartOptions = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          categoryPercentage: 1,
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          display: false
        }]
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        position: 'nearest',
        custom: tooltipFn
      }
    };

    return <BarChart data={chartData} options={chartOptions} height={260}/>;
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
      increase: 'Aumento',
      equal: 'Manteve',
      decrease: 'Diminuiu'
    };

    let tooltipFn = makeTooltip(entryIndex => {
      let entry = licencasChange[entryIndex];
      return (
        <div>
          <p>{round(entry.percent)}%</p>
          <p>{keyIndex[entry.key]}</p>
        </div>
      );
    });

    let chartData = {
      labels: licencasChange.map(o => o.key),
      datasets: [{
        data: licencasChange.map(o => o.value),
        borderWidth: 0,
        backgroundColor: ['#FFC700', '#FDD259', '#FDDC7E']
      }]
    };

    let chartOptions = {
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

    return <DoughnutChart data={chartData} options={chartOptions} height={240}/>;
  },

  render: function () {
    let { licencas2016, licencas2006, totalMunicipios } = this.props;

    let newLicencas = licencas2016 - licencas2006;
    let increaseLicencas = newLicencas / licencas2006 * 100;

    // Municipios without change in number on licenças.
    let totalMunicipiosNoChange = this.props.municipios.reduce((acc, c) => c.data.change === 0 ? acc + 1 : acc, 0);
    console.log('this.props.totalMunicipios', totalMunicipios);

    return (
      <div id='section-evolucao' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>{this.props.adminName}</h3>
            <h1>Evolução 2006 - 2016</h1>
            <p className='lead'>O número total de táxis manteve-se estável, sendo o maior aumento sentido em Lisboa, é a maior diminuição nas regiões autónomas da Madeira e Açores.</p>
          </header>
          <div className='section-content'>
            <div className='section-stats'>
              <ul>
                <li>
                  <span className='stat-number'>{newLicencas}</span>
                  <span className='stat-description'>Aumento do número de licenças entre 2006 e 2016.</span>
                </li>
                <li>
                  <span className='stat-number'>{round(increaseLicencas, 2)}%</span>
                  <span className='stat-description'>Crescimento dos táxis licenciados desde 2006.</span>
                </li>
                <li>
                  <span className='stat-number'>{percent(totalMunicipiosNoChange, totalMunicipios)}%</span>
                  <span className='stat-description'>Dos municípios não registaram alteração no número de licenças.</span>
                </li>
              </ul>
            </div>

            <div className='graph-container'>
              <div className='graph'>
                {this.renderTimelineChart()}
                <p className='graph-description'>Evolução das licenças 2006 a 2016.</p>
              </div>
              <div className='graph'>
                {this.renderTopMunicipiosChart()}
                <p className='graph-description'>Municipios com maior aumento.</p>
              </div>
              <div className='graph'>
                {this.renderChangeLicencasChart()}
                <p className='graph-description'>Alterações do número de licenças.</p>
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
