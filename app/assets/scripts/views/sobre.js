'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Sobre = React.createClass({
  propTypes: {
  },

  componentDidMount: function () {
  },

  render: function () {
    return (
      <div id='sobre-wrapper' className='container-wrapper'>
        <section id='sobre' className='content-wrapper'>
          <h1>Sobre o Projeto</h1>
          <div className="wrapper">
            <div>
              <p className='lead'>A Autoridade da Mobilidade e dos Transportes identificou o desenvolvimento do Observatório dos Mercados da Mobilidade, Preços e Estratégias empresariais, como uma prioridade estratégica e um instrumento fundamental à aplicação de uma regulação eficiente no Ecossistema da Mobilidade e dos Transportes. </p>
              <p>A recolha estatística apresentada visa dar a conhecer factos essenciais sobre as condições de prestação de serviços de táxi em Portugal, constituindo mais um contributo da AMT para a reflexão sobre o quadro legislativo e regulatório no transporte de passageiros em veículos ligeiros. Potenciam-se assim decisões informadas e adequadas aos interesses dos utilizadores destes serviços e possibilita-se um acompanhamento dos efeitos das opções que venham a ser tomadas.</p>
            </div>
            <div>
              <h3>Relatório</h3>
                <p>Este microsite é baseado no Relatório Estatístico - Serviços de Transporte em Táxi: A realidade atual e a evolução na última década.</p>

                <h3>Informações e Contactos</h3>
                <p>Este projeto foi coordenado pela Divisão dos Mercados da Mobilidade da Direção de Supervisão dos Mercados da Mobilidade. Para mais informações contactar <a href="mailto:dsmm@amt-autoridade.pt
">dsmm@amt-autoridade.pt</a></p>
                
                <p>AMT - Autoridade da Mobilidade e dos Transportes:</p>
                <p><a href="mailto:geral@amt-autoridade.pt">geral@amt-autoridade.pt</a></p>
                <p><a href="http://www.amt-autoridade.pt/" target="_blank">www.amt-autoridade.pt</a></p>

            </div>
          </div>

        </section>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Sobre);
