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
    onMapClick: T.func,
    popoverContent: T.func
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
          backgroundColor: '#00ced1'
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

    return <BarChart data={chartData} options={chartOptions} height={280}/>;
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
        backgroundColor: '#00ced1'
      },
      {
        label: 'CMR',
        value: licencasMobReduzida2016,
        percent: percent(licencasMobReduzida2016, licencas2016, 1),
        backgroundColor: '#256465'
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

    return <PieChart data={chartData} options={chartOptions} height={280}/>;
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    let mobRedMunicipios = this.props.municipios.map(m => {
      let mobred = _.last(m.data['lic-mob-reduzida']).value > 0;

      return {
        id: m.id,
        color: mobred ? '#FFCC45' : '#f5f5f5'
      };
    });

    return (
      <div>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={mobRedMunicipios}
          nut={this.props.adminId}
          onClick={this.props.onMapClick}
          popoverContent={this.props.popoverContent}
        />
        <div className='map-legend'>
          <h6 className='legend-title'>Municípios com Contingente de Mobilidade Reduzida:</h6>
          <ul className='color-legend inline'>
            <li><span style={{backgroundColor: '#FFCC45'}}></span>Com CMR</li>
            <li><span style={{backgroundColor: '#f5f5f5'}}></span>Sem CMRs</li>
          </ul>
        </div>
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
      <div id='mobilidade' className='content-wrapper'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div className='section-wrapper'>
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
                    <span className='stat-description'>Número de novas licenças <span className='block'>emitidas em CMR.</span></span>
                  </li>
                  <li>
                    <span className='stat-number'>{percentNewMobRed.toLocaleString()}%</span>
                    <span className='stat-description'>Do aumento de licenças resulta do crescimento de licenças do CMR.</span>
                  </li>
                </ul>
              </div>

              <div className='graph'>
                <h6 className='legend-title'>Licenças por contingente (%)</h6>
                {this.renderLicencasChart()}
              </div>
              <div className='graph'>
                <h6 className='legend-title'>Evolução do contingente</h6>
                {this.renderEvolutionChart()}
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
