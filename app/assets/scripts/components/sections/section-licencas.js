'use strict';
import React, { PropTypes as T } from 'react';
import { Bar as BarChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';

import Map from '../map';

var SectionLicencas = React.createClass({
  propTypes: {
    adminLevel: T.string,
    adminName: T.string,
    adminList: T.array,
    licencas2016: T.number,
    max2016: T.number,
    licencasHab: T.number,
    mapGeometries: T.object,
    municipios: T.array
  },

  renderChart: function () {
    let dataList = _(this.props.adminList)
      .sortBy('data.licencas2016')
      .reverse()
      .value();

    let tooltipFn = makeTooltip(entryIndex => {
      let datum = dataList[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{datum.name}</span></li>
          <li><span className='tooltip-label'>Contingente:</span><span className='tooltip-number'>{datum.data.max2016.toLocaleString()}</span></li>
          <li><span className='tooltip-label'>Licenças activas:</span> <span className='tooltip-number'>{datum.data.licencas2016.toLocaleString()}</span></li>
          <li><span className='tooltip-label'>Vagas disponíveis:</span> <span className='tooltip-number'>{(datum.data.max2016 - datum.data.licencas2016).toLocaleString()}</span></li>
          <span className='triangle'></span>
        </ul>
      );
    });

    let chartData = {
      labels: dataList.map(o => o.display),
      datasets: [
        {
          data: dataList.map(o => o.data.licencas2016),
          backgroundColor: '#F6B600'
        },
        {
          data: dataList.map(o => o.data.max2016 - o.data.licencas2016),
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
          stacked: true,
          gridLines: {
            display: false
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

    return <BarChart data={chartData} options={chartOptions} height={120}/>;
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v <= 10) return '#7FECDA';
      if (v <= 30) return '#00DFC1';
      if (v <= 100) return '#2D8374';
      if (v <= 1000) return '#1F574D';
      return '#0F2B26';
    };

    let licencasMunicipios = this.props.municipios.map(m => {
      let licencas = _.last(m.data['lic-geral']).value;
      return {
        id: m.id,
        color: getColor(licencas)
      };
    });

    return (
      <div>
        <Map
          className='map-svg'
          geometries={this.props.mapGeometries.data}
          data={licencasMunicipios}
        />
        <h6 className='map-title'>Licenças por Município</h6>
        <ul className='color-legend side-by-side'>
          <li><span style={{backgroundColor: getColor(10)}}></span>0 - 10</li>
          <li><span style={{backgroundColor: getColor(30)}}></span>11 - 30</li>
          <li><span style={{backgroundColor: getColor(100)}}></span>31 - 100</li>
          <li><span style={{backgroundColor: getColor(1000)}}></span>101 - 1000</li>
          <li><span style={{backgroundColor: getColor(10000)}}></span>+1000</li>
       </ul>
      </div>
    );
  },

  render: function () {
    let { licencas2016, max2016 } = this.props;

    return (
      <div id='licencas' className='content-wrapper'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Licenças e Contingentes</h1>
              <p className="lead">A prestação de serviços de táxi implica que o prestador de serviço detenha uma licença por cada veículo utilizado. As câmaras municipais atribuem estas licenças e definem o número máximo de veículos que poderá prestar serviços no seu concelho — contingente de táxis.</p>
            </header>
            <div className='section-content'>
              <div className='section-stats'>
                <ul>
                  <li>
                    <span className='stat-number'>{licencas2016.toLocaleString()}</span>
                    <span className='stat-description'>Total de táxis licenciados em agosto de 2016.</span>
                  </li>
                  <li>
                    <span className='stat-number'>{max2016.toLocaleString()}</span>
                    <span className='stat-description'>Total dos contingentes em agosto de 2016.</span>
                  </li>
                  <li>
                    <span className='stat-number'>{(max2016 - licencas2016).toLocaleString()}</span>
                    <span className='stat-description'>Total de vagas existentes em agosto de 2016.</span>
                  </li>
                </ul>
              </div>

              {this.renderChart()}

            </div>
            <footer className='section-footer'>
              <ul className='color-legend inline'>
                <li><span style={{backgroundColor: '#F6B600'}}></span>Licenças Ativas</li>
                <li><span style={{backgroundColor: '#2EB199'}}></span>Vagas Disponíveis</li>
              </ul>
            </footer>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionLicencas;
