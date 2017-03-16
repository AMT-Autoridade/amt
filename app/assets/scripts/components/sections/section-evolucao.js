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
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies, in rhoncus nulla volutpat. Donec id imperdiet ipsum. Morbi interdum eros rhoncus metus ultricies.</p>
          </header>
          <div className='section-content'>
            <ul className='section-stats three-columns'>
              <li>
                <span className='stat-number'>{newLicencas}</span>
                <span className='stat-description'>Novas licenças emitidas entre 2006 e 2016</span>
              </li>
              <li>
                <span className='stat-number'>{round(increaseLicencas, 2)}%</span>
                <span className='stat-description'>Crescimento dos taxis licenciados desde 2006</span>
              </li>
              <li>
                <span className='stat-number'>{percent(municipiosNoChange, data.totalMunicipios)}%</span>
                <span className='stat-description'>Dos municípios ({municipiosNoChange}/ {data.totalMunicipios}) não alteraram o número de licenças</span>
              </li>
            </ul>

            {this.renderTimelineChart()}
          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEvolucao;
