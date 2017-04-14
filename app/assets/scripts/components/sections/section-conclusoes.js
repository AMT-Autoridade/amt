'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import makeTooltip from '../../utils/tooltip';
import { round, formatPT } from '../../utils/utils';

var SectionConclusoes = React.createClass({
  propTypes: {
    licencasTimeline: T.array
  },

  chartsRef: [],

  onWindowResize: function () {
    this.chartsRef.map(ref => {
      this.refs[ref].chart_instance.resize();
    });
  },

  addChartRef: function (ref) {
    if (this.chartsRef.indexOf(ref) === -1) {
      this.chartsRef = this.chartsRef.concat([ref]);
    }
    return ref;
  },

  componentDidMount: function () {
    this.onWindowResize = _.debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  componentWillUnmount: function () {
    this.chartsRef = [];
    window.removeEventListener('resize', this.onWindowResize);
  },

  renderTimeline: function () {
    let data = this.props.licencasTimeline.filter(y => y.year !== 2006);
    let licencasTimeline = {
      labels: data.map(y => y.year),
      datasets: [
        {
          data: data.map(o => o['var-lic-all']),
          label: 'Licenças',
          color: '#00ced1',
          backgroundColor: 'transparent'
        },
        {
          data: data.map(o => o['var-populacao']),
          label: 'Residentes',
          color: '#FFCC45',
          backgroundColor: 'transparent'
        },
        {
          data: data.map(o => o['var-dormidas']),
          label: 'Dormidas',
          color: '#F8781F',
          backgroundColor: 'transparent'
        }
      ]
    };

    let l = licencasTimeline.labels.length - 1;

    let tooltipFn = makeTooltip(entryIndex => {
      let year = licencasTimeline.labels[entryIndex];
      return (
        <ul>
          <li><span className='tooltip-title'>{year}:</span></li>
          {licencasTimeline.datasets.map(o => <li key={o.label}><span className='tooltip-label'>{o.label}:</span> <span className='tooltip-number'>{formatPT(round(o.data[entryIndex], 0))}%</span></li>)}
          <span className='triangle'></span>
        </ul>
      );
    });

    let labels = licencasTimeline.labels.map((o, i) => i === 0 || i === l ? o : '');

    let chartData = {
      labels: labels,
      datasets: licencasTimeline.datasets.map(o => ({
        data: o.data,
        backgroundColor: o.backgroundColor,
        borderColor: o.color,
        pointBorderWidth: 0,
        pointBackgroundColor: o.color,
        pointRadius: 2
      }))
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
          },
          ticks: {
            maxRotation: 0
          }
        }],
        yAxes: [{
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

    return <LineChart data={chartData} options={chartOptions} height={80} ref={this.addChartRef(`chart-timeline`)}/>;
  },

  render: function () {
    return (
      <div id='conclusoes-wrapper' className='content-wrapper vertical-center'>
        <div id='conclusoes' className='container-wrapper content-wrapper vertical-center'>
          <section className='section-wrapper'>
            <header className='section-header'>
              <h3 className='section-category'>Portugal</h3>
              <h1>Conclusões</h1>
              <p className='lead'>A recolha efetuada pela AMT constitui um marco quanto ao conhecimento sobre os serviços de transporte em táxi em Portugal. É necessário continuar a aprofundar o conhecimento sobre o setor.</p>
            </header>

            <div className='section-content'>
              <div className='graph'>
                <h6 className='legend-title'>Taxa de variação acumulada (contingentes, residentes e dormidas):</h6>
                {this.renderTimeline()}
              </div>
              <div className='section-stats'>
                <ul className='two-columns'>
                  <li>
                    <h4>Licenças e Contingentes</h4>
                    <p>Existe uma grande disparidade no número de táxis por concelho. Os concelhos de Lisboa e do Porto possuem cerca de 31% dos táxis licenciados. Cerca de metade dos concelhos possuem 20 ou menos táxis licenciados.</p>
                  </li>
                  <li>
                    <h4>Detalhe Geográfico</h4>
                    <p>Existem vagas nos contingentes em cerca de 46% dos concelhos. É comum identificarem-se diferenças entre a % de táxis licenciados numa região e a % da população aí residente.</p>
                  </li>
                  <li>
                    <h4>Evolução 2006&#8212;2016</h4>
                    <p>A estrutura da oferta tem-se mantido estável. O número de táxis licenciados e o número de lugares nos contingentes cresceu menos de 1% na última década.</p>
                  </li>
                  <li>
                    <h4>Indicadores</h4>
                    <p>Num cenário de estabilidade da oferta observam-se alterações relevantes em 2 fatores que podem influenciar a procura: a população residente e o turismo.</p>
                  </li>
                  <li>
                    <h4>Mobilidade Reduzida</h4>
                    <p>Apesar da sua expressão marginal, observa-se um aumento significativo no número de licenças e no número de lugares previstos nestes contingentes.</p>
                  </li>
                  <li>
                    <h4>Regimes de Estacionamento</h4>
                    <p>Sendo comum que num mesmo município coexistam vários regimes de estacionamento, constata-se que o regime fixo é aplicado em cerca de 80% dos municípios.</p>
                  </li>         
                </ul>
              </div>
              
            </div>

            <footer className='section-footer'>
              <p>Este site foi desenvolvido pela AMT com base no <a href="#">Relatório Estatístico Sobre Serviços de Transporte em Táxi: <span className=''>A Realidade Atual e a Evolução da Última Década.</span></a></p>
            </footer>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionConclusoes;
