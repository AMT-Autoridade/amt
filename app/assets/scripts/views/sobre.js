'use strict';
import React from 'react';

import config from '../config';

var Sobre = React.createClass({
  render: function () {
    return (
      <div id='sobre-wrapper' className='container-wrapper'>
        <section id='sobre' className='content-wrapper'>
          <h1>Sobre o Projeto</h1>
          <div className='wrapper'>
            <div>
              <p className='lead'>A Autoridade da Mobilidade e dos Transportes identificou o desenvolvimento do Observatório dos Mercados da Mobilidade, Preços e Estratégias empresariais, como uma prioridade estratégica e um instrumento fundamental à aplicação de uma regulação eficiente no Ecossistema da Mobilidade e dos Transportes. </p>
              <p>Este microsite é baseado no Relatório Estatístico - <strong><a href={`${config.rawGitApi}@master/files/amt-servico-transporte-taxis.pdf`} title='Descarregar Relatório'>Serviços de Transporte em Táxi: A realidade atual e a evolução na última década</a></strong>. A recolha estatística apresentada visa dar a conhecer factos essenciais sobre as condições de prestação de serviços de táxi em Portugal, constituindo mais um contributo da AMT para a reflexão sobre o quadro legislativo e regulatório no transporte de passageiros em veículos ligeiros. Potenciam-se assim decisões informadas e adequadas aos interesses dos utilizadores destes serviços e possibilita-se um acompanhamento dos efeitos das opções que venham a ser tomadas.</p>
            </div>
            <div>
              <h3>Informações e Contactos</h3>
              <p>Este projeto foi coordenado pela Divisão dos Mercados da Mobilidade da Direção de Supervisão dos Mercados da Mobilidade. Para mais informações contactar <a href='mailto:dsmm@amt-autoridade.pt
'>dsmm@amt-autoridade.pt</a>.</p>

              <p><strong>AMT - Autoridade da Mobilidade e dos Transportes:</strong><a className='block' href='mailto:geral@amt-autoridade.pt'>geral@amt-autoridade.pt</a> <a className='block' href='http://www.amt-autoridade.pt/' target='_blank' rel='noopener noreferrer'>www.amt-autoridade.pt</a></p>

              <h3>Tecnologias e Licenças</h3>
              <p>Este site foi desenvolvido pela Major, com recurso apenas a tecnologias Open Source. Para a framework base foram utilizados <a href='https://facebook.github.io/react/' target='_blank' rel='noopener noreferrer'>React</a> e <a href='http://redux.js.org/' target='_blank' rel='noopener noreferrer'>Redux</a>. Para os gráficos, foi utilizada a biblioteca <a href='http://www.chartjs.org/' target='_blank' rel='noopener noreferrer'>Chart.js</a> e, para os mapas, a biblioteca <a href='https://d3js.org/' target='_blank' rel='noopener noreferrer'>D3.js</a>.</p>
              <p>Todo o código deste site está disponível sob a licença MIT <a href='https://opensource.org/licenses/MIT' target='_blank' rel='noopener noreferrer'>https://opensource.org/licenses/MIT</a>.</p>
            </div>
          </div>

        </section>
      </div>
    );
  }
});

module.exports = Sobre;
