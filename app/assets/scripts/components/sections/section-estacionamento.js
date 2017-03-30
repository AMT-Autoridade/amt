'use strict';
import React, { PropTypes as T } from 'react';
import { Bar as BarChart, Polar as PolarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { percent } from '../../utils/utils';

var SectionEstacionamento = React.createClass({
  propTypes: {
    municipios: T.array,
    totalMunicipios: T.number
  },

  estLabels: {
    fixo: 'Fixo',
    condicionado: 'Condicionado',
    escala: 'Escala',
    livre: 'Livre',
    outros: 'Outros'
  },

  renderPercentEstacionamento: function () {
    let data = {
      fixo: {value: 0},
      condicionado: {value: 0},
      escala: {value: 0},
      livre: {value: 0}
    };

    this.props.municipios.forEach(m => m.data.estacionamento.forEach(e => {
      e = _.trim(e);
      if (!e) return;
      data[e].value++;
    }));

    // Calc percent.
    data = _(data)
      .map((d, k) => {
        d.percent = percent(d.value, this.props.totalMunicipios, 0);
        d.name = this.estLabels[k];
        return d;
      })
      .sortBy('value')
      .reverse()
      .value();

    let tooltipFn = makeTooltip(entryIndex => {
      let estacionamento = data[entryIndex];
      return (
        <ul className='small'>
          <li><span className='tooltip-label'>{estacionamento.name}:</span> <span className='tooltip-number'>{estacionamento.percent}%</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: data.map(o => o.name),
      datasets: [
        {
          data: data.map(o => o.percent),
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

  renderCountEstacionamento: function () {
    let countGroup = {};

    this.props.municipios.forEach(m => {
      let types = _(m.data.estacionamento)
        .filter()
        .map(_.trim)
        .sort()
        .value();

      let k = types.join('-');

      if (!countGroup[k]) {
        countGroup[k] = {value: 0, types: types.map(o => this.estLabels[o]), key: k};
      }
      countGroup[k].value++;
    });

    // Flatten
    let data = _(countGroup)
      .values()
      .sortBy('value')
      .reverse()
      .value();

    let mainEstacionamento = _.take(data, 4);
    let rest = _.takeRight(data, data.length - 4)
      .reduce((acc, val) => {
        acc.value += val.value;
        return acc;
      }, {key: 'outros', types: ['Outros'], value: 0});

    mainEstacionamento.push(rest);

    let tooltipFn = makeTooltip(entryIndex => {
      let estacionamento = mainEstacionamento[entryIndex];
      return (
        <ul className='small'>
          <li><span className='tooltip-label'>{estacionamento.types.join(' & ')}:</span> <span className='tooltip-number'>{estacionamento.value}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: mainEstacionamento.map(o => o.name),
      datasets: [
        {
          data: mainEstacionamento.map(o => o.value),
          backgroundColor: [
            '#FFB712', '#FFC700', '#FDD259', '#FDDC7E', '#FFE49D'
          ],
          borderColor: 'transparent'
        }
      ]
    };

    let chartOptions = {
      legend: {
        display: false
      },
      startAngle: -1.25 * Math.PI,
      scale: {
        ticks: {
          display: false
        },
        gridLines: {
          lineWidth: 0.5
        }
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        position: 'nearest',
        custom: tooltipFn
      }
    };

    return <PolarChart data={chartData} options={chartOptions} height={260}/>;
  },

  render: function () {
    return (
      <div id='estacionamento' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3 className='section-category'>Portugal</h3>
            <h1>Regime de Estacionamento</h1>
            <p className='lead'>As câmaras municipais estabelecem os regimes de estacionamento de táxis que se aplicam no seu concelho. Estas disposições são estabelecidas por regulamento municipal ou aquando da atribuição da licença municipal ao veículo.</p>
          </header>
          <div className='section-content'>
           <div className='two-columns'>
             <div className='graph'>
              {this.renderPercentEstacionamento()}
              <p className='graph-description'>Percentagem de municípios por regime de estacionamento</p>
             </div>

             <div className='graph'>
              {this.renderCountEstacionamento()}
              <p className='graph-description'>Número de municípios por (conjunto de) regimes de estacionamento</p>
             </div>
           </div>

          </div>
          <footer className='section-footer'>
            <p><strong>Legenda:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEstacionamento;
