'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { percent } from '../../utils/utils';

var SectionDistribuicao = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminList: T.array,
    licencas2016: T.number,
    populacaoNational: T.number
  },

  renderTrendLineChart: function (data) {
    let tooltipFn = makeTooltip(entryIndex => {
      let year = data[entryIndex];
      return (
        <ul className='x-small'>
          <li><span className='tooltip-label'>{year.year}</span> <span className='tooltip-number'>{year.value.toLocaleString()}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: data.map(o => o.year),
      datasets: [{
        data: data.map(o => o.value),
        lineTension: 0,
        pointRadius: 2,
        pointBorderWidth: 0,
        pointBackgroundColor: '#2EB199',
        borderColor: '#2EB199',
        backgroundColor: '#fff',
        borderWidth: 1
      }]
    };

    let chartOptions = {
      layout: {
        padding: {
          left: 5,
          top: 2,
          right: 5
        }
      },
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
        enabled: false,
        mode: 'index',
        position: 'nearest',
        custom: tooltipFn
      }
    };

    return (
      <LineChart data={chartData} options={chartOptions} height={40} />
    );
  },

  renderTableRow: function (adminArea) {
    let totNat2016 = this.props.licencas2016;

    let licencas2016 = adminArea.data.licencas2016;
    let availableLicencas = adminArea.data.max2016 - licencas2016;
    let percentNational = percent(adminArea.data.licencas2016, totNat2016);
    let pop = _.last(adminArea.data['pop-residente']).value;
    let percentPop = percent(pop, this.props.populacaoNational, 1);

    return (
      <li key={adminArea.id}>
        <span className='table-region'><Link to={`/nuts/${_.kebabCase(adminArea.name)}`} title={`Ver página de ${adminArea.name}`}>{adminArea.name}</Link></span>
        <div className='table-graph'>{this.renderTrendLineChart(adminArea.data['lic-geral'])}</div>
        <span className='table-available'>{availableLicencas.toLocaleString()}</span>
        <span className='table-national'>{percentNational.toLocaleString()}%</span>
        <span className='table-residents'>{percentPop.toLocaleString()}%</span>
      </li>
    );
  },

  renderTable: function () {
    let adminList = this.props.adminList;

    return (
      <ul className='table-distribution'>
        <li className='table-header'>
          <span className='table-region'>Região</span>
          <span className='table-graph'>Total de Licenças</span>
          <span className='table-available'>Vagas Disponíveis</span>
          <span className='table-national'>% do Total de Licenças</span>
          <span className='table-residents'>% do Total de População</span>
        </li>
        {adminList.map(this.renderTableRow)}
      </ul>
    );
  },

  render: function () {
    return (
      <div id='section-distribuicao'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>{this.props.adminName}</h3>
            <h1>Distribuição Geográfica</h1>
            <p className='lead'>Não obstante as licenças de táxi serem atribuídas a nível municipal apresenta-se a sua distribuição pelas regiões autónomas, pelos distritos e pelas áreas metropolitanas de Lisboa e do Porto.</p>
          </header>
          <div className='section-content'>
            {this.renderTable()}
          </div>
        </section>
      </div>
    );
  }
});

module.exports = SectionDistribuicao;
