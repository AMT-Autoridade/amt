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
      <div id='sobre' className='container-wrapper section-wrapper'>
        <h1>Sobre o Projeto</h1>
        <section id='intro'>
          <div>
            <p className='lead'>A Autoridade da Mobilidade e dos Transportes identificou como uma prioridade estratégica o desenvolvimento e a implementação do Observatório da Mobilidade, como uma ferramenta essencial à compreensão, definição e aplicação de uma regulação eficiente no Ecossistema da Mobilidade e dos Transportes.</p>
            <p className='lead'>A recolha estatística apresentada visa dar a conhecer factos essenciais sobre as condições de prestação de serviços de táxi, sendo o conhecimento resultante desta análise constitui um esforço proactivo que possibilita uma avaliação adequada dos efeitos das opções legislativas e regulatórias que venham a ser tomadas quanto ao transporte de passageiros em veículos ligeiros.</p>
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
