'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import { percent, round } from '../../utils/utils';

var SectionDistribuicao = React.createClass({
  displayName: 'SectionDistribuicao',

  propTypes: {
    data: T.object
  },

  renderTrendLineChart: function (data) {
    let chartData = {
      labels: data.map(o => o.year),
      datasets: [{
        data: data.map(o => o.value),
        lineTension: 0,
        pointRadius: 0
      }]
    };

    let chartOptions = {
      events: [],
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false,
          ticks: {
            min: 0
          }
        }]
      },
      tooltips: {
        enabled: false
      }
    };

    return (
      <LineChart data={chartData} options={chartOptions} height={50} />
    );
  },

  renderTableRow: function (adminArea) {
    let totNat2016 = this.props.data.licencas2016;

    let licencas2016 = adminArea.data.licencas2016;
    let availableLicencas = adminArea.data.max2016 - licencas2016;
    let percentNational = percent(adminArea.data.licencas2016, totNat2016);
    let pop = _.last(adminArea.data['pop-residente']).value;
    let licencas1000Hab = licencas2016 / (pop / 1000);

    if (adminArea.id === 7) {
      //évora
      console.log('lic-geral', adminArea.data['lic-geral']);
    }

    return (
      <tr key={adminArea.id}>
        <td>{adminArea.name}</td>
        <td>{this.renderTrendLineChart(adminArea.data['lic-geral'])}</td>
        <td>{availableLicencas}</td>
        <td>{percentNational}%</td>
        <td>{round(licencas1000Hab, 1)}</td>
      </tr>
    );
  },

  renderTable: function () {
    let data = this.props.data;

    return (
      <table>
        <thead>
          <tr>
            <th>Distrito</th>
            <th>Licenças Geral</th>
            <th>Vagas</th>
            <th>Percentagem Taxis Nacional</th>
            <th>Taxis por 1000 residentes</th>
          </tr>
        </thead>
        <tbody>
          {data.distritos.map(this.renderTableRow)}
        </tbody>
      </table>
    );
  },

  render: function () {
    return (
      <div id='section-distribuicao' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>Portugal</h3>
            <h1>Distribuição Geográfica</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies, in rhoncus nulla volutpat. Donec id imperdiet ipsum. Morbi interdum eros rhoncus metus ultricies.</p>
          </header>
          <div className='section-content'>
            {this.renderTable()}
          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionDistribuicao;
