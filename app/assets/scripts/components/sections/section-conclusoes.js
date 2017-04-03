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
              <h3 className='section-category'>PORTUGAL</h3>
              <h1>Conclusões</h1>
              <p className='lead'>A recolha efetuada pela AMT constitui um marco quanto ao conhecimento dos serviços de transporte em táxi em Portugal. É necessário continuar a aprofundar o conhecimento sobre o setor. A estrutura da oferta tem-se mantido estável, apesar de se identificarem alterações em fatores que podem influir na procura. Verifica-se que, na sua maioria, os concelhos estabelecem contingentes com âmbito territorial infra concelhio e aplicam o regime de estacionamento fixo.</p>
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
                    <p>Apesar da sua expressão marginal, o CMR foi o que mais alterações sofreu na última década, observando um crescimento acentuado no número de licenças activas.</p>
                  </li>
                  <li>
                    <h4>Regimes de Estacionamento</h4>
                    <p>Sendo comum que num mesmo município coexistam vários regimes de estacionamento, constata-se que o regime fixo é aplicado em mais de 70% dos casos.</p>
                  </li>
                  <li>
                    <h4>Âmbito Geográfico</h4>
                    <p>A maioria das câmaras municipais estabelece contingentes com âmbito territorial infra concelhio (e.g. ao nível da freguesia), existindo concelhos que não definem contingentes ou que não efetuaram alterações ao contingente definido antes da assunção dessa competência por parte da câmara</p>
                  </li>
                  <li>
                    <h4>Evolução 2006&#8212;2016</h4>
                    <p>O crescimento do sector na última década foi inferior a 1%, não havendo alterações significativas no número de táxis licenciados, contingentes ou nas vagas disponíveis.</p>
                  </li>
                  <li>
                    <h4>Outros Indicadores</h4>
                    <p>Os indicadores utilizados que associam o número de táxis à população residente e ao nível de turismo indiciam que a procura por serviços de transporte em táxi possa ter vindo a alterar-se ao longo do tempo, quer pela redução ou aumento da população residente em alguns concelhos, quer pelo aumento generalizado do turismo. Existem inúmeros outros fatores que influenciam a procura destes serviços.</p>
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
