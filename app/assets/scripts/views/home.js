'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
  },

  render: function () {
    return (
      <div>
        <div id='section-intro' className='section-wrapper'>
          <section id='intro'>
            <h2>Observatório da Mobilidade:</h2>
            <h1> Táxis em Portugal 2006-2016</h1>
            <p>Num momento em que discute o enquadramento regulatório do transporte de passageiros em veículos ligeiros, considera-se prioritário reforçar e promover o conhecimento sobre o sector, nomeadamente sobre os serviços de transporte em táxi.</p>
            
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Google +</li>
            </ul>

          </section>
        </div>

        <div id="page-content">

          <div className='map-wrapper'>
            This is a map
          </div>

          <div className='content-wrapper'>

            <div id='section-licencas' className='section-wrapper'>
              <section className='section-container'>
                <header className='section-header'>
                  <h3>Portugal</h3>
                  <h1>Licenças e Contingentes</h1>
                  <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo IMT (acesso à actividade) e, simultaneamente, possua uma licença atribuída pelo município (acesso ao mercado). 
        </p>      
                </header>
                <div className='section-content'>
                  <ul className='section-stats'>
                    <li>
                      <span className='stat-number'>13.779</span>
                      <span className='stat-description'>Total de táxis licenciados em Agosto de 2016.</span>
                    </li>
                    <li>
                      <span className='stat-number'>14.399</span>
                      <span className='stat-description'>Total dos contingentes  em Agosto de 2016.</span>
                    </li>
                    <li>
                      <span className='stat-number'>1.3</span>
                      <span className='stat-description'>Licenças activas por 1000 Habitantes</span>
                    </li>
                  </ul>

                  { /* 
                  // Graph goes here
                 */}

                  <p><strong>Graph goes here</strong> Barchart with totals by district</p>

                </div>
                <footer className='section-footer'>
                  <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
                </footer>
              </section>
            </div>


            <div id='section-mobilidade' className='section-wrapper'>
              <section className='section-container'>
                <header className='section-header'>
                  <h3>Portugal</h3>
                  <h1>Mobilidade Reduzida</h1>
                  <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo IMT (acesso à actividade) e, simultaneamente, possua uma licença atribuída pelo município (acesso ao mercado). 
        </p>      
                </header>
                <div className='section-content'>
                  <ul className='section-stats'>
                    <li>
                      <span className='stat-number'>8.6%</span>
                      <span className='stat-description'>Municípios com contingentes mobilidade reduzida.</span>
                    </li>
                    <li>
                      <span className='stat-number'>78</span>
                      <span className='stat-description'>Número de novas licenças de Mobiliade Reduzida.</span>
                    </li>
                    <li>
                      <span className='stat-number'>60%</span>
                      <span className='stat-description'>Das novas licenças emitadas foram de Mobilidade Reduzida.</span>
                    </li>
                  </ul>

                  { /* 
                  // Graph goes here
                 */}
                 
                  <p><strong>Graph goes here</strong> Piechart - Licenças por contingente (%)</p>
                  <p><strong>Graph goes here</strong> Barchart - Evolução do Contingente</p>

                </div>
                <footer className='section-footer'>
                  <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
                </footer>
              </section>
            </div>

            <div id='section-estacionamento' className='section-wrapper'>
              <section className='section-container'>
                <header className='section-header'>
                  <h3>Portugal</h3>
                  <h1>Regime de Estacionamento</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies, in rhoncus nulla volutpat. Donec id imperdiet ipsum. Morbi interdum eros rhoncus metus ultricies.</p>      
                </header>
                <div className='section-content'>
                  <ul className='section-stats'>
                    <li>
                      <span className='stat-number'>C</span>
                      <span className='stat-description'>Municípios com contingentes mobilidade reduzida.</span>
                    </li>
                    <li>
                      <span className='stat-number'>E</span>
                      <span className='stat-description'>Número de novas licenças de Mobiliade Reduzida.</span>
                    </li>
                    <li>
                      <span className='stat-number'>F</span>
                      <span className='stat-description'><strong>Fixo:</strong> locais determinados e  constantes da respetiva licença</span>
                    </li>
                    <li>
                      <span className='stat-number'>L</span>
                      <span className='stat-description'><strong>Livre:</strong> não existem locais de estacionamento obrigatórios </span>
                    </li>
                  </ul>

                  { /* 
                  // Graph goes here
                 */}
                 
                  <p><strong>Graph goes here</strong> Barchart - Percentagem de Municípios  Regime de Estacionamento</p>
                  <p><strong>Graph goes here</strong> Polarchart - Número de Municípios por  Regime de Estacionamento</p>

                </div>
                <footer className='section-footer'>
                  <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
                </footer>
              </section>
            </div>

            <div id='section-estacionamento' className='section-wrapper'>
              <section className='section-container'>
                <header className='section-header'>
                  <h3>Portugal</h3>
                  <h1>Distribuição Distrital</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies, in rhoncus nulla volutpat. Donec id imperdiet ipsum. Morbi interdum eros rhoncus metus ultricies.</p>      
                </header>
                <div className='section-content'>
                  <ul className='section-stats'>
                    <li>
                      <span className='stat-number'>C</span>
                      <span className='stat-description'>Municípios com contingentes mobilidade reduzida.</span>
                    </li>
                    <li>
                      <span className='stat-number'>E</span>
                      <span className='stat-description'>Número de novas licenças de Mobiliade Reduzida.</span>
                    </li>
                    <li>
                      <span className='stat-number'>F</span>
                      <span className='stat-description'><strong>Fixo:</strong> locais determinados e  constantes da respetiva licença</span>
                    </li>
                    <li>
                      <span className='stat-number'>L</span>
                      <span className='stat-description'><strong>Livre:</strong> não existem locais de estacionamento obrigatórios </span>
                    </li>
                  </ul>

                  { /* 
                  // Graph goes here
                 */}
                 
                  <p><strong>Graph goes here</strong> Barchart - Percentagem de Municípios  Regime de Estacionamento</p>
                  <p><strong>Graph goes here</strong> Polarchart - Número de Municípios por  Regime de Estacionamento</p>

                </div>
                <footer className='section-footer'>
                  <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
                </footer>
              </section>
            </div>
          </div>

        </div>
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

module.exports = connect(selector, dispatcher)(Home);


