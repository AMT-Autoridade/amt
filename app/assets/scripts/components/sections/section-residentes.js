'use strict';
import React, { PropTypes as T } from 'react';

var SectionResidentes = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
       <div id='section-residentes' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3 className='section-category'>PORTUGAL</h3>
            <h1>Residentes</h1>
            <p className='lead'>Lorem ipsum dolor sit amet.</p>
          </header>

          <div className='section-content'>
            <div className='section-stats'>
              <ul>
  
              </ul>
            </div>

            <div className='graph'>
   
              <p className='graph-description'>Licenças por contingente (%)</p>
            </div>
            <div className='graph'>
              
              <p className='graph-description'>Evolução do contingente</p>
            </div>

          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> O número de veículos habilitados ao transporte de pessoas com mobilidade reduzida será superior ao apresentado. Este tipo de veículos podem estar licenciados no âmbito dos contingentes gerais. A AMT pretende aprofundar o conhecimento sobre esta matéria.</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionResidentes;
