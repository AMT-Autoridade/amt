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
    adminId: T.oneOfType([T.string, T.number]),
    adminList: T.array,
    licencas2016: T.number,
    max2016: T.number,
    licencasHab: T.number,
    mapGeometries: T.object,
    municipios: T.array,
    onMapClick: T.func,
    popoverContent: T.func,
    overlayInfoContent: T.func
  },

  chartsRef: [],

  onWindowResize: function () {
    this.chartsRef.map(ref => {
      this.refs[ref].chart_instance.resize();
    });
  },

  addChartRef: function (ref) {
    this.chartsRef.indexOf(ref) === -1 && this.chartsRef.push(ref);
    return ref;
  },

  componentDidMount: function () {
    this.onWindowResize = _.debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
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
          backgroundColor: '#FFCC45'
        },
        {
          data: dataList.map(o => o.data.max2016 - o.data.licencas2016),
          backgroundColor: '#FDB13C'
        }
      ]
    };

    let chartOptions = {
      responsive: false,
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

    return <BarChart data={chartData} options={chartOptions} height={120} ref={this.addChartRef('chart')} />;
  },

  renderMap: function () {
    if (!this.props.mapGeometries.fetched) return null;

    const getColor = (v) => {
      if (v <= 10) return '#00ced1';
      if (v <= 30) return '#0eaeaf';
      if (v <= 100) return '#1f8d8e';
      if (v <= 1000) return '#256465';
      return '#264242';
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
          nut={this.props.adminId}
          onClick={this.props.onMapClick}
          popoverContent={this.props.popoverContent}
          overlayInfoContent={this.props.overlayInfoContent}
        />

       <div className='map-legend'>
          <h6 className='legend-title'>Licenças por Município:</h6>
          <ul className='color-legend inline'>
            <li><span style={{backgroundColor: getColor(10)}}></span> &lt; 10</li>
            <li><span style={{backgroundColor: getColor(30)}}></span>11 a 30</li>
            <li><span style={{backgroundColor: getColor(100)}}></span>31 a 100</li>
            <li><span style={{backgroundColor: getColor(1000)}}></span>101 a 1000</li>
            <li><span style={{backgroundColor: getColor(10000)}}></span> &gt; 1000 </li>
          </ul>
        </div>
      </div>
    );
  },

  render: function () {
    let { licencas2016, max2016 } = this.props;

    return (
      <div id='licencas' className='content-wrapper vertical-center'>
        <div className='map-wrapper'>
          {this.renderMap()}
        </div>
        <div className='section-wrapper'>
          <section className='section-container'>
            <header className='section-header'>
              <h3 className='section-category'>{this.props.adminName}</h3>
              <h1>Licenças e Contingentes</h1>
              <p className="lead">A prestação de serviços de táxi implica a posse de uma licença por cada veículo utilizado. Os municípios atribuem estas licenças e definem o número máximo de veículos que pode ser licenciado no seu concelho – o contingente.</p>
            </header>
            <div className='section-content'>
              <div className='section-stats'>
                <ul>
                  <li>
                    <span className='stat-number'>{licencas2016.toLocaleString()}</span>
                    <span className='stat-description'>Total de táxis licenciados <span className='block'>em agosto de 2016.</span></span>
                  </li>
                  <li>
                    <span className='stat-number'>{max2016.toLocaleString()}</span>
                    <span className='stat-description'>Total dos contingentes <span className='block'>em agosto de 2016.</span></span>
                  </li>
                  <li>
                    <span className='stat-number'>{(max2016 - licencas2016).toLocaleString()}</span>
                    <span className='stat-description'>Total de vagas existentes <span className='block'>em agosto de 2016.</span></span>
                  </li>
                </ul>
              </div>

              <h6 className='legend-title'>Licenças e vagas nos contingentes:</h6>
              {this.renderChart()}

            </div>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionLicencas;
