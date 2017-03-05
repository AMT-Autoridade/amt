'use strict';
import React, { PropTypes as T } from 'react';

var SectionMobilidade = React.createClass({
  displayName: 'SectionMobilidade',

  propTypes: {
  },

  render: function () {
    return (
      <div id='section-mobilidade' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>Portugal</h3>
            <h1>Mobilidade Reduzida</h1>
            <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo IMT (acesso à actividade) e, simultaneamente, possua uma licença atribuída pelo município (acesso ao mercado).</p>
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
    );
  }
});

module.exports = SectionMobilidade;
