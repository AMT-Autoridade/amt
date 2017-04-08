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
              <p className='lead'>A recolha efetuada pela AMT constitui um marco quanto ao conhecimento dos serviços de transporte em táxi em Portugal. É necessário continuar a aprofundar o conhecimento sobre o setor. A estrutura da oferta tem-se mantido estável, apesar de se identificarem alterações em fatores que podem influir na procura. Na sua maioria, os concelhos estabelecem contingentes com âmbito territorial infra concelhio e aplicam o regime de estacionamento fixo.</p>
            </header>

            <div className='section-content'>
              <div className='section-stats'>
                <ul className='section-stats three-columns'>
                  <li>
                    <h4>Licenças e Contingentes</h4>
                    <p>Existe uma grande disparidade no sector, observando-se que 49% das licenças activas estão concentradas nas Áreas Metropolitanas de Lisboa e Porto.</p>
                  </li>
                  <li>
                    <h4>Mobilidade Reduzida</h4>
                    <p>Apesar da sua expressão marginal, observa-se um aumento significativo no número de licenças e no número de lugares previstos nestes contingentes.</p>
                  </li>
                  <li>
                    <h4>Regimes de Estacionamento</h4>
                    <p>Sendo comum que num mesmo município coexistam vários regimes de estacionamento, constata-se que o regime fixo é aplicado em mais de 70% dos casos.</p>
                  </li>
                  <li>
                    <h4>Âmbito Geográfico</h4>
                    <p>Existem vagas nos contingentes em cerca de 46% dos concelhos e é comum haver diferenças entre o número total de táxis licenciados e a população residente de uma região.</p>
                  </li>
                  <li>
                    <h4>Evolução 2006&#8212;2016</h4>
                    <p>A estrutura da oferta tem-se mantido muito estável, sendo que o número de táxis licenciados e o número de lugares nos contingentes cresceu menos de 1% na última década.</p>
                  </li>
                  <li>
                    <h4>Outros Indicadores</h4>
                    <p>Apesar do pouco crescimento da última década, houve um aumento de 8% do número de táxis por mil residentes, e uma redução de 26% no número de táxis por mil dormidas em estabelecimentos hoteleiros. </p>
                  </li>
                </ul>
              </div>

              <div className='download-wrapper'>
                <h6>DOWNLOAD</h6>
                <p>Este site foi desenvolvido pela AMT com base no:</p>
                <a href="#">Relatório Estatístico de Serviços de Transporte em Táxi: <span className=''>A Realidade Atual e a Evolução da Última Década.</span></a>
              </div>

            </div>
          </section>
        </div>
      </div>
    );
  }
});

module.exports = SectionConclusoes;
