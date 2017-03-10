'use strict';
import React, { PropTypes as T } from 'react';

var SectionEstacionamento = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
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
                <span className='stat-description'><strong>Fixo:</strong> locais determinados e constantes da respetiva licença</span>
              </li>
              <li>
                <span className='stat-number'>L</span>
                <span className='stat-description'><strong>Livre:</strong> não existem locais de estacionamento obrigatórios </span>
              </li>
            </ul>

            { /*
            // Graph goes here
           */}

            <p><strong>Graph goes here</strong> Barchart - Percentagem de Municípios Regime de Estacionamento</p>
            <p><strong>Graph goes here</strong> Polarchart - Número de Municípios por Regime de Estacionamento</p>

          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEstacionamento;
