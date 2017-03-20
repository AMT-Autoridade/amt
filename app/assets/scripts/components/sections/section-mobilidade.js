'use strict';
import React, { PropTypes as T } from 'react';
import { Pie as PieChart, Bar as BarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { percent } from '../../utils/utils';

var SectionMobilidade = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    totalMunicipiosMobReduzida: T.number,
    totalMunicipios: T.number,
    licencas2016: T.number,
    licencas2006: T.number,
    licencasMobReduzida2016: T.number,
    licencasMobReduzida2006: T.number
  },

  renderEvolutionChart: function () {
    let licencasMobReduzida2016 = this.props.licencasMobReduzida2016;
    let licencasMobReduzida2006 = this.props.licencasMobReduzida2006;

    let data = [
      {
        label: '2006',
        display: 'Contingente Mobilidade Reduzida em 2006',
        value: licencasMobReduzida2006
      },
      {
        label: '2016',
        display: 'Contingente Mobilidade Reduzida em 2016',
        value: licencasMobReduzida2016
      }
    ];

    let tooltipFn = makeTooltip(entryIndex => {
      let datum = data[entryIndex];
      return (
        <div>
          <p>{datum.value}</p>
        </div>
      );
    });

    let chartData = {
      labels: _.map(data, 'label'),
      datasets: [
        {
          data: _.map(data, 'value'),
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

    return <BarChart data={chartData} options={chartOptions} height={240}/>;
  },

  renderLicencasChart: function () {
    let licencas2016 = this.props.licencas2016;
    let licencasMobReduzida2016 = this.props.licencasMobReduzida2016;
    let licencas2016Geral = licencas2016 - licencasMobReduzida2016;

    let data = [
      {
        label: 'Contingente Geral',
        value: licencas2016Geral,
        percent: percent(licencas2016Geral, licencas2016),
        backgroundColor: '#41D6B9'
      },
      {
        label: 'Contingente Mobilidade Reduzida',
        value: licencasMobReduzida2016,
        percent: percent(licencasMobReduzida2016, licencas2016),
        backgroundColor: '#227868'
      }
    ];

    let tooltipFn = makeTooltip(entryIndex => {
      let datum = data[entryIndex];
      return (
        <div>
          <p>{datum.label}</p>
          <p>{datum.value} ({datum.percent}%)</p>
        </div>
      );
    });

    let chartData = {
      labels: _.map(data, 'label'),
      datasets: [
        {
          data: _.map(data, 'value'),
          backgroundColor: _.map(data, 'backgroundColor'),
          borderWidth: 0
        }
      ]
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

    return <PieChart data={chartData} options={chartOptions} height={240}/>;
  },

  render: function () {
    let {
      totalMunicipiosMobReduzida,
      totalMunicipios,
      licencas2016,
      licencas2006,
      licencasMobReduzida2016,
      licencasMobReduzida2006
    } = this.props;

    let percentMobRed = percent(totalMunicipiosMobReduzida, totalMunicipios);
    let newLicencas = licencas2016 - licencas2006;
    let newMobReduzida = licencasMobReduzida2016 - licencasMobReduzida2006;
    let percentNewMobRed = percent(newMobReduzida, newLicencas);

    return (
      <div id='section-mobilidade' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>{this.props.adminName}</h3>
            <h1>Mobilidade Reduzida</h1>
            <p className='lead'>A legislação prevê a possibilidade de existência de contingentes específicos de táxis para o transporte de pessoas com mobilidade reduzida (CMR) sempre que a necessidade deste tipo de veículos não possa ser assegurada pela adaptação dos táxis existentes no concelho.</p>
          </header>

          <div className='section-content'>
            <div className='section-stats'>
              <ul>
                <li>
                  <span className='stat-number'>{percentMobRed}%</span>
                  <span className='stat-description'>Municípios ({totalMunicipiosMobReduzida}) com contingentes mobilidade reduzida.</span>
                </li>
                <li>
                  <span className='stat-number'>{newMobReduzida}</span>
                  <span className='stat-description'>Número de novas licenças emitidas em CMR.</span>
                </li>
                <li>
                  <span className='stat-number'>{percentNewMobRed}%</span>
                  <span className='stat-description'>Do aumento de licenças resulta do crescimento de licenças emitidas em CMR.</span>
                </li>
              </ul>
            </div>

            <div className='graph'>
              {this.renderLicencasChart()}
              <p className='graph-description'>Licenças por contingente (%)</p>
            </div>
            <div className='graph'>
              {this.renderEvolutionChart()}
              <p className='graph-description'>Evolução do contingente</p>
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

module.exports = SectionMobilidade;
