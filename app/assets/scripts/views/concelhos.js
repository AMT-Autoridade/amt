'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

var Concelho = React.createClass({
  propTypes: {
    params: T.object,
  },

  componentDidMount: function () {
  },

  render: function () {
    return (
      <div>

        <div id="page-content">

          <div className='map-wrapper'>
            This is a map
          </div>

          <div className='content-wrapper'>
            <div id='licencas' className='section-wrapper'>
              <section className='section-container'>
                <header className='section-header'>
                  <h3 className='section-category'>PORTUGAL &rsaquo; NOME DA NUT3</h3>
                  <h1>Nome do Concelho</h1>
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

module.exports = connect(selector, dispatcher)(Concelho);
