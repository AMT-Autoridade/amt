'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Glossario = React.createClass({
  propTypes: {
  },

  componentDidMount: function () {
  },

  render: function () {
    return (
      <div id='glossario' className='container-wrapper'>
        <section id='glossario' className='content-wrapper'>
          <h1>Glossário dos Conceitos Principais </h1>
          <p className='lead'></p>

          <ul>
            <li>
              <h4>Serviços de transporte em táxi</h4>
              <p>Consistem no transporte de passageiros utilizando um veículo automóvel ligeiro de passageiros conduzido por um motorista certificado. Em regra, este veículo está equipado com taxímetro e possui distintivos próprios. O transporte ocorre ao serviço de uma entidade, de acordo com o itinerário escolhido por esta e mediante o pagamento do preço calculado pelo taxímetro, aplicando a convenção estabelecida entre a extinta Direção-Geral das Atividades Económicas e as associações representantes dos detentores de licenças de táxi.</p>
            </li>
            <li>
              <h4>Licenças Municipais</h4>
              <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo Instituto da Mobilidade e dos Transportes (IMT) e uma licença municipal para cada veículo que utiliza. As licenças podem ser obtidas através de concurso público lançado pelas câmaras municipais ou pela sua aquisição no mercado secundário (a quem já as detenha).
</p>
            </li>
            <li>
              <h4>Contingentes Municipais</h4>
              <p>A atribuição de licenças encontra-se limitada pelos contingentes de âmbito municipal, que correspondem ao número máximo de licenças que pode ser concedido num concelho. Este contingente é fixado pelas câmaras municipais, com uma periodicidade não inferior a 2 anos.</p>
            </li>
            <li>
              <h4>Contingentes especiais para pessoas com mobilidade reduzida</h4>
              <p>Em complemento aos contingentes gerais, a legislação prevê a possibilidade de criação de um contingentes especiais de táxis para pessoas com mobilidade reduzida, sempre que a necessidade deste tipo de veículos não possa ser assegurada pela adaptação dos táxis existentes no concelho.</p>
            </li>
            <li>
              <h4>Âmbito geográfico dos contingentes</h4>
              <p>Os contingentes municipais podem ser estabelecidos por freguesia, para um conjunto de freguesias ou para as freguesias que constituem a sede do concelho. A AMT analisa se o âmbito geográfico geográfico definido pelas câmaras municipais corresponde ao concelho ou se tem dimensão infra concelhia</p>
            </li>
            <li>
              <h4>Regimes de Estacionamento</h4>
              <ul>
                <li><strong>Fixo:</strong> existe obrigação de estacionar nos locais determinados na licença;</li>
                <li><strong>Condicionado:</strong> podem estacionar em qualquer dos locais definidos, até ao limite dos lugares fixados;</li>
                <li><strong>Escala:</strong> existe obrigação de cumprir um regime sequencial de prestação de serviço.</li>
                <li><strong>Livre:</strong> podem circular livremente à disposição do público, não existindo locais obrigatórios para estacionamento;</li>
              </ul>
            </li>
          </ul>

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

module.exports = connect(selector, dispatcher)(Glossario);
