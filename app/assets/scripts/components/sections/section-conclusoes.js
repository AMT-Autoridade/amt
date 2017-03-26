'use strict';
import React, { PropTypes as T } from 'react';

var SectionConclusoes = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
       <div id='conclusoes' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3 className='section-category'>PORTUGAL</h3>
            <h1>Conclusões</h1>
            <p className='lead'>Lorem ipsum dolor sit amet.</p>
          </header>

          <div className='section-content'>
            <div className='section-stats'>
              <ul>
                 <li>
                  <span className='stat-number'>49%</span>
                  <span className='stat-description'>Dos táxis licenciados estão nas Áreas Metropolitanas de Lisboa e Porto.</span>
                </li>
                <li>
                  <span className='stat-number'></span>
                  <span className='stat-description'>Total dos contingentes em agosto de 2016.</span>
                </li>
                <li>
                  <span className='stat-number'></span>
                  <span className='stat-description'>Licenças activas por 1 000 residentes.</span>
                </li>
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

module.exports = SectionConclusoes;
