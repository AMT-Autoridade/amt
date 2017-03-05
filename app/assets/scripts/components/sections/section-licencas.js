'use strict';
import React, { PropTypes as T } from 'react';

var SectionLicencas = React.createClass({
  displayName: 'SectionLicencas',

  propTypes: {
  },

  render: function () {
    return (
      <div id='section-licencas' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>Portugal</h3>
            <h1>Licenças e Contingentes</h1>
            <p>A prestação de serviços de transporte em táxi implica que o prestador detenha um alvará emitido pelo IMT (acesso à actividade) e, simultaneamente, possua uma licença atribuída pelo município (acesso ao mercado). </p>
          </header>
          <div className='section-content'>
            <ul className='section-stats'>
              <li>
                <span className='stat-number'>13.779</span>
                <span className='stat-description'>Total de táxis licenciados em Agosto de 2016.</span>
              </li>
              <li>
                <span className='stat-number'>14.399</span>
                <span className='stat-description'>Total dos contingentes em Agosto de 2016.</span>
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
    );
  }
});

module.exports = SectionLicencas;
