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
              <p>A recolha estatística apresentada visa dar a conhecer factos essenciais sobre as condições de prestação de serviços de táxi em Portugal, constituindo mais um contributo da AMT para a reflexão sobre o quadro legislativo e regulatório no transporte de passageiros em veículos ligeiros, que favorece decisões informadas e adequadas aos interesses dos utilizadores e permite um acompanhamento dos efeitos das opções que venham a ser tomadas.</p>
            </div>
            <div>
              <h3>Relatório</h3>
                <p>Este site é baseado no <strong>Relatório Estatístico de Serviços de Transporte em Táxi: A Realidade Atual e a Evolução da Última Década</strong>, desenvolvido pela AMT, e que constitui um marco quanto à transparência das condições de prestação de serviços de transporte em táxi em Portugal.</p>

                <h3>Informações e Contactos</h3>
                <p>Falta este texto</p>
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
