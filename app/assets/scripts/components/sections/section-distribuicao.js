'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import { percent, round } from '../../utils/utils';

var SectionDistribuicao = React.createClass({
  propTypes: {
    data: T.object
  },

  renderTrendLineChart: function (data) {
    let chartData = {
      labels: data.map(o => o.year),
      datasets: [{
        data: data.map(o => o.value),
        lineTension: 0,
        pointRadius: 0,
        // backgroundColor: 'transparent',
        borderColor: '#2EB199',
        borderWidth: 1
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
      <LineChart data={chartData} options={chartOptions} height={20} />
    );
  },

  renderTableRow: function (adminArea) {
    let totNat2016 = this.props.data.licencas2016;

    let licencas2016 = adminArea.data.licencas2016;
    let availableLicencas = adminArea.data.max2016 - licencas2016;
    let percentNational = percent(adminArea.data.licencas2016, totNat2016);
    let pop = _.last(adminArea.data['pop-residente']).value;
    let licencas1000Hab = licencas2016 / (pop / 1000);

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
            <th>Região</th>
            <th>Total de Licenças</th>
            <th>Vagas Disponíveis</th>
            <th>% do Total Nacional de Licenças</th>
            <th>% do Total de População</th>
          </tr>
        </thead>
        <tbody>
          {data.nuts.map(this.renderTableRow)}
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
            <p className='lead'>Não obstante as licenças de táxi serem atribuídas a nível municipal apresenta-se a sua distribuição pelas regiões autónomas, pelos distritos e pelas áreas metropolitanas de Lisboa e do Porto.</p>
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
