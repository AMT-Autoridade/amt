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
            <p>As câmaras municipais estabelecem os regimes de estacionamento de táxis que se aplicam no seu concelho. Estas disposições são estabelecidas por regulamento municipal ou aquando da atribuição da licença municipal ao veículo.</p>
          </header>
          <div className='section-content'>
            <ul className='section-stats two-columns'>
              <li>
                <span className='stat-number'>F</span>
                <span className='stat-description'><strong>Fixo:</strong> obrigados a estacionar em locais determinados e constantes da licença.</span>
              </li>
              <li>
                <span className='stat-number'>C</span>
                <span className='stat-description'><strong>Condicionado:</strong> podem estacionar em locais reservados para o efeito, até ao limite fixado.</span>
              </li>
              <li>
                <span className='stat-number'>L</span>
                <span className='stat-description'><strong>Livre:</strong> podem circular livremente, não existindo locais obrigatórios para estacionamento.</span>
              </li>
              <li>
                <span className='stat-number'>E</span>
                <span className='stat-description'><strong>Escala:</strong> cumprem um regime sequencial de prestação de serviço</span>
              </li>
            </ul>

            { /*
            // Graph goes here
           */}
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
            <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEstacionamento;
