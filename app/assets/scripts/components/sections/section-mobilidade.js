'use strict';
import React, { PropTypes as T } from 'react';
import { Pie as PieChart, Bar as BarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { percent } from '../../utils/utils';

import Map from '../map';

var SectionMobilidade = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminId: T.oneOfType([T.string, T.number]),
    totalMunicipiosMobReduzida: T.number,
    totalMunicipios: T.number,
    licencas2016: T.number,
    licencas2006: T.number,
    licencasMobReduzida2016: T.number,
    licencasMobReduzida2006: T.number,
    mapGeometries: T.object,
    municipios: T.array,
    onMapClick: T.func
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
        <ul className='x-small'>
          <li><span className='tooltip-label'>{datum.label.toLocaleString()}:</span><span className='tooltip-number'>{datum.value.toLocaleString()}</span></li>
          <span className='triangle'></span>
        </ul>
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
        label: 'Geral',
        value: licencas2016Geral,
        percent: percent(licencas2016Geral, licencas2016, 1),
        backgroundColor: '#41D6B9'
      },
      {
        label: 'CMR',
        value: licencasMobReduzida2016,
        percent: percent(licencasMobReduzida2016, licencas2016, 1),
        backgroundColor: '#227868'
      }
    ];

    let tooltipFn = makeTooltip(entryIndex => {
      let datum = data[entryIndex];
      return (
        <ul className='small'>
          <li><span className='tooltip-label'>{datum.label.toLocaleString()}:</span><span className='tooltip-number'>{datum.percent.toLocaleString()}%</span></li>
          <span className='triangle'></span>
        </ul>
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

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    let mobRedMunicipios = this.props.municipios.map(m => {
      let mobred = _.last(m.data['lic-mob-reduzida']).value > 0;

      return {
        id: m.id,
        color: mobred ? '#2D8374' : '#eaeaea'
      };
    });

    return (
      <div>
        <h6 className='map-title'>Licenças por 1000 habitantes</h6>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={mobRedMunicipios}
          nut={this.props.adminId}
          onClick={this.props.onMapClick}
        />
        <ul className='color-legend side-by-side'>
          <li><span style={{backgroundColor: '#2D8374'}}></span>Com mobilidade reduzida</li>
          <li><span style={{backgroundColor: '#eaeaea'}}></span>Sem mobilidade reduzida</li>
       </ul>
      </div>
    );
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

    let percentMobRed = percent(totalMunicipiosMobReduzida, totalMunicipios, 0);
    let newLicencas = licencas2016 - licencas2006;
    let newMobReduzida = licencasMobReduzida2016 - licencasMobReduzida2006;
    let percentNewMobRed = percent(newMobReduzida, newLicencas, 0);

    return (
      <div className='content-wrapper'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div id='mobilidade' className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Mobilidade Reduzida</h1>
              <p className='lead'>A legislação prevê a possibilidade de existência de contingentes específicos de táxis para o transporte de pessoas com mobilidade reduzida (CMR) sempre que a necessidade deste tipo de veículos não possa ser assegurada pela adaptação dos táxis existentes no concelho.</p>
            </header>

            <div className='section-content'>
              <div className='section-stats'>
                <ul>
                  <li>
                    <span className='stat-number'>{percentMobRed.toLocaleString()}%</span>
                    <span className='stat-description'>Municípios ({totalMunicipiosMobReduzida}) com contingentes mobilidade reduzida.</span>
                  </li>
                  <li>
                    <span className='stat-number'>{newMobReduzida.toLocaleString()}</span>
                    <span className='stat-description'>Número de novas licenças emitidas em CMR.</span>
                  </li>
                  <li>
                    <span className='stat-number'>{percentNewMobRed.toLocaleString()}%</span>
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
      </div>
    );
  }
});

module.exports = SectionMobilidade;
