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
            <p className='lead'>As câmaras municipais estabelecem os regimes de estacionamento de táxis que se aplicam no seu concelho. Estas disposições são estabelecidas por regulamento municipal ou aquando da atribuição da licença municipal ao veículo.</p>
          </header>
          <div className='section-content'>
           <div className='two-columns'>
             <div className='graph'>
              <p><strong>Graph goes here</strong> Percentagem de municípios por regime de estacionamento</p>
             </div>

             <div className='graph'>
              <p><strong>Graph goes here</strong> Número de municípios por (conjunto de) regimes de estacionamento</p>
             </div>
           </div>
            
          </div>
          <footer className='section-footer'>
            <p><strong>Legenda:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEstacionamento;
