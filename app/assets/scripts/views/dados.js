'use strict';
import React from 'react';
import { connect } from 'react-redux';

import config from '../config';

var Dados = React.createClass({
  propTypes: {
  },

  componentDidMount: function () {
  },

  render: function () {
    return (
      <div id='dados' className='container-wrapper'>
        <section id='dados' className='content-wrapper'>
        <h1>Sobre os dados</h1>
          <div>
            <p className='lead'>Este site contém dados sobre o número de <a href={`${config.rawGitApi}/master/data/taxis.csv`} title='Descarregar dados'>taxis licenciados</a> pelos municípios, os <a href={`${config.rawGitApi}/master/data/area-metadata.csv`} title='Descarregar dados'>contingentes</a> estabelecidos (número máximo de táxis a licenciar) e as disposições relativas ao seu estacionamento. Os dados referem-se ao período entre 2006 e 2016 e foram recolhidos, pela AMT, junto dos 308 municípios portugueses. De forma a complementar os dados recolhidos e concretizar uma análise mais detalhada, foram também utilizados dados sobre a <a href={`${config.rawGitApi}/master/data/population.csv`} title='Descarregar dados'>população residente</a> e sobre as <a href={`${config.rawGitApi}/master/data/dormidas.csv`} title='Descarregar dados'>dormidas</a> em estabelecimentos hoteleiros, disponibilizados pelo <a href="http://www.ine.pt" title="Ir para INE" target="_blank">Instituto Nacional de Estatística</a> na sua base de dados pública.</p>
          </div>
          <div>
            <h3>Agradecimentos</h3>
            <p>A AMT agradece a colaboração dos municípios na disponibilização da informação. Agradecem-se igualmente os contributos do Instituto da Mobilidade e dos Transportes, da Direção Regional da Economia e Transportes da Região Autónoma da Madeira e da Direção Regional dos Transportes da Região Autónoma dos Açores.</p>

            <h3>Tratamento de Dados</h3>
            <p>Existem dados relativos a 2016 para todos os concelhos. Para os concelhos em que não existia informação disponível para todo o período compreendido entre 2006 e 2016, os valores assumidos na análise resultam de imputação do primeiro valor disponível aos anos anteriores. Neste caso, a metodologia descrita é equivalente à utilização das taxas de variação anual apuradas para os concelhos com informação, na imputação dos valores dos concelhos sem dados para todos os anos.</p>
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
