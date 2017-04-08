'use strict';
import React, { PropTypes as T } from 'react';

var SectionConclusoes = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='conclusoes-wrapper'>
        <div id='conclusoes' className='container-wrapper content-wrapper vertical-center'>
          <section className=''>
            <header className='section-header'>
              <h3 className='section-category'>Portugal</h3>
              <h1>Conclusões</h1>
              <p className='lead'>A recolha efetuada pela AMT constitui um marco quanto ao conhecimento sobre os serviços de transporte em táxi em Portugal. É necessário continuar a aprofundar o conhecimento sobre o setor.</p>
            </header>

            <div className='section-content'>
              <div className='section-stats'>
                <ul className='section-stats three-columns'>
                  <li>
                    <h4>Licenças e Contingentes</h4>
                    <p>Existe uma grande disparidade no número de táxis por concelho. Os concelhos de Lisboa e do Porto possuem cerca de 31% dos táxis licenciados. Cerca de metade dos concelhos possuem 20 ou menos táxis licenciados.</p>
                  </li>
                  <li>
                    <h4>Mobilidade Reduzida</h4>
                    <p>Apesar da sua expressão marginal, observa-se um aumento significativo no número de licenças e no número de lugares previstos nestes contingentes.</p>
                  </li>
                  <li>
                    <h4>Regimes de Estacionamento</h4>
                    <p>Sendo comum que num mesmo município coexistam vários regimes de estacionamento, constata-se que o regime fixo é aplicado em cerca de 80% dos municípios.</p>
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
