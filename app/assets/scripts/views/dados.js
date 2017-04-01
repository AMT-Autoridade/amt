'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Dados = React.createClass({
  propTypes: {
  },

  componentDidMount: function () {
  },

  render: function () {
    return (
      <div id='dados' className='container-wrapper section-wrapper'>

        <h1>Sobre os dados</h1>

        <section id='dados'>
          <div>
            <p className='lead'>Este site contém dados sobre os serviços de transporte em táxi em Portugal, no período entre 2006 e 2016. Os dados foram recolhidos pela AMT junto das 308 câmaras municipais do país. De forma a complementar os dados recolhidos e concretizar uma análise mais detalhada, foram também utilizados dados sobre a população residente e sobre as dormidas em estabelecimentos hoteleiros, disponibilizados pelo <a href="http://www.ine.pt" title="Ir para INE" target="_blank">Instituto Nacional de Estatística</a> na sua base de dados pública.</p>
            <p className='lead'>A AMT agradece a colaboração e disponibilidade das câmaras municipais na disponibilização da informação. Agradecem-se igualmente os contributos do Instituto da Mobilidade e dos Transportes, da Direção Regional da Economia e Transportes da Madeira e da Direção Regional dos Transportes dos Açores.</p>
          </div>
          <div>
            <h3>Tratamento de Dados</h3>
              <p>Existem dados relativos a 2016 para todos os concelhos. Para os concelhos em que não existia informação disponível para todo o período compreendido entre 2006 e 2016, os valores assumidos na análise da evolução do setor decorrem da aplicação das taxas de variação anual apuradas para os concelhos com informação.</p>

              <h3>Ferramentas Utilizadas</h3>
              <p>Falta este texto</p>
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

module.exports = connect(selector, dispatcher)(Dados);
