'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';

var SectionDistribuicao = React.createClass({
  propTypes: {
    parentSlug: T.string,
    adminLevel: T.string,
    adminName: T.string,
    adminList: T.array
  },

  renderTrendLineChart: function (data) {
    let l = data.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = data[entryIndex];
      return (
         <ul className='x-small'>
          <li><span className='tooltip-label'>Year:</span><span className='tooltip-number'>{year.value.toLocaleString()}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let pointRadius = data.map((o, i) => i === 0 || i === l ? 2 : 0);

    let chartData = {
      labels: data.map(o => o.year),
      datasets: [{
        data: data.map(o => o.value),
        lineTension: 0,
        pointRadius: pointRadius,
        pointBorderWidth: 0,
        pointBackgroundColor: '#2EB199',
        borderColor: '#2EB199',
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
    let url = `/nuts/${this.props.parentSlug}/concelhos/${_.kebabCase(adminArea.name)}`;
    return (
      <li key={adminArea.id}>
        <span className='table-region'><Link to={url} title={`Ver página de ${adminArea.name}`}>{adminArea.name}</Link></span>
        <div className='table-graph'>{this.renderTrendLineChart(adminArea.data['lic-geral'])}</div>
        <span className='table-parking'>Estacionamento</span>
        <span className='table-scope'>ambito</span>
      </li>
    );
  },

  renderTable: function () {
    let adminList = this.props.adminList;

    return (
      <ul className='table-distribution'>
        <li className='table-header'>
          <span className='table-region'>Concelho</span>
          <span className='table-graph'>Total de Licenças</span>
          <span className='table-parking'>Estacionamento</span>
          <span className='table-scope'>Âmbito Geográfico</span>
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
