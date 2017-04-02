'use strict';
import React, { PropTypes as T } from 'react';
import { Bar as BarChart, Polar as PolarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { percent } from '../../utils/utils';

import Map from '../map';

var SectionEstacionamento = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminId: T.oneOfType([T.string, T.number]),
    municipios: T.array,
    totalMunicipios: T.number,
    mapGeometries: T.object,
    onMapClick: T.func,
    popoverContent: T.func
  },

  estLabels: {
    fixo: 'Fixo',
    condicionado: 'Condicionado',
    escala: 'Escala',
    livre: 'Livre',
    outros: 'Outros',
    nd: 'Não Definido'
  },

  renderPercentEstacionamento: function () {
    let data = {
      fixo: {value: 0},
      condicionado: {value: 0},
      escala: {value: 0},
      livre: {value: 0},
      nd: {value: 0}
    };

    this.props.municipios.forEach(m => m.data.estacionamento.forEach(e => {
      e = _.trim(e);
      if (!e) e = 'nd';
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

    return <BarChart data={chartData} options={chartOptions} height={160}/>;
  },

  renderCountEstacionamento: function () {
    let countGroup = {};

    this.props.municipios.forEach(m => {
      let types = _(m.data.estacionamento)
        .map(o => o === '' ? 'nd' : _.trim(o))
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

    if (rest.value) {
      mainEstacionamento.push(rest);
    }

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

    return <PolarChart data={chartData} options={chartOptions} height={160}/>;
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v === 'fixo') return '#7FECDA';
      if (v === 'condicionado-fixo') return '#00DFC1';
      if (v === 'condicionado') return '#2D8374';
      if (v === 'fixo-livre') return '#1F574D';
      if (v === 'condicionado-livre') return '#0F2B26';
      if (v === 'livre') return '#ff0000';
      // if (v === 'condicionado-fixo-livre') return '#00ff00';
      // if (v === 'escala-fixo') return '#0000ff';
      return '#eaeaea';
    };

    let tipoEstacionamentos = this.props.municipios.map(m => {
      let key = _(m.data.estacionamento)
        .map(_.trim)
        .sort()
        .join('-');

      return {
        id: m.id,
        color: getColor(key)
      };
    });

    return (
      <div>
        <h6 className='map-title'>Tipos principais de estacionamento</h6>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={tipoEstacionamentos}
          nut={this.props.adminId}
          onClick={this.props.onMapClick}
          popoverContent={this.props.popoverContent}
        />
        <ul className='color-legend side-by-side'>
          <li><span style={{backgroundColor: getColor('fixo')}}></span>Fixo</li>
          <li><span style={{backgroundColor: getColor('condicionado-fixo')}}></span>Condicionado & Fixo</li>
          <li><span style={{backgroundColor: getColor('condicionado')}}></span>Condicionado</li>
          <li><span style={{backgroundColor: getColor('fixo-livre')}}></span>Fixo & Livre</li>
          <li><span style={{backgroundColor: getColor('condicionado-livre')}}></span>Condicionado & Livre</li>
          <li><span style={{backgroundColor: getColor('livre')}}></span>Livre</li>
          <li><span style={{backgroundColor: getColor('outros')}}></span>Outros</li>
       </ul>
      </div>
    );
  },

  render: function () {
    return (
      <div className='content-wrapper'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div id='estacionamento' className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
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
      </div>
    );
  }
});

module.exports = SectionEstacionamento;
