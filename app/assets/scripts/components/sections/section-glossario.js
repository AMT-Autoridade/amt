'use strict';
import React, { PropTypes as T } from 'react';

var SectionGlossario = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='section-glossario' className='container-wrapper'>
        <section id='glossario' className='section-wrapper'>
          <h1>Glossário</h1>
          <p className='lead'>Conceitos, Indicadores e Nomenclaturas</p>

          <ul>
            <li>
              <h4>Serviços de transporte em táxi</h4>
              <p>Consistem no transporte de passageiros utilizando um veículo automóvel ligeiro de passageiros. Em regra, este veículo está equipado com um taxímetro (medidor de tempo e distância) e possui distintivos próprios. O transporte ocorre unicamente ao serviço de uma entidade, de acordo com o itinerário escolhido por esta e mediante o pagamento do preço calculado pelo taxímetro, aplicando a convenção estabelecida entre a Direção-Geral das Atividades Económicas e asassociações representantes dos detentores de licenças de táxi.</p>
            </li>
            <li>
              <h4>Licenças</h4>
              <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo Instituto da Mobilidade e dos Transportes (IMT) e uma licença municipal para cada veículo que utiliza. As licenças podem ser obtidas através de concurso público lançado pelas câmaras municipais ou pela sua aquisição no mercado secundário (a quem já as detenha).
</p>
            </li>
            <li>
              <h4>Contingentes</h4>
              <p>O acesso às licenças municipais encontra-se limitado pela existência um contingente municipal, correspondente ao número máximo de veículos que pode prestar serviços de táxi com origem nesse concelho. Este contingente é fixado pelas câmaras municipais, com uma periodicidade não inferior a 2 anos.
</p>
            </li>
            <li>
              <h4>Contingentes Especiais</h4>
              <p>Em complemento aos contingentes gerais, a legislação prevê a possibilidade de regimes específicos de contingentação de táxis, existindo nomeadamente contingentes especiais para táxis para pessoas com mobilidade reduzida, sempre que a necessidade deste tipo de veículos não possa ser assegurada pela adaptação dos táxis existentes no concelho.</p>
            </li>
            <li>
              <h4>Âmbito Geográfico</h4>
              <p>Os contingentes municipais podem ser estabelecidos por freguesia, para um conjunto de freguesias ou para as freguesias que constituem a sede do concelho.</p>
            </li>
            <li>
              <h4>Regumes de Estacionamento</h4>
              <p>Livre: podem circular livremente à disposição do público, não existindo locais obrigatórios para estacionamento; Condicionado: podem estacionar em qualquer dos locais reservados para o efeito, até ao limite dos lugares fixados;
Fixo: existe obrigação de estacionar nos locais determinados na licença;  Escala: existe obrigação de cumprir um regime sequencial de prestação de
serviço.</p>
            </li>
          </ul>

        </section>
      </div>
    );
  }
});

module.exports = SectionGlossario;
