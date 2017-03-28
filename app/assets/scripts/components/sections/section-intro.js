'use strict';
import React, { PropTypes as T } from 'react';

var SectionIntro = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='intro' className='container-wrapper'>
        <section id='intro'>
          <h3 className='section-category'>Observatório dos Mercados da Mobilidade, Preços e Estratégias Empresariais</h3>
          <h1> Táxis em Portugal 2006-2016</h1>
          <p className='lead'>Num momento em que discute o enquadramento regulatório do transporte de passageiros em veículos ligeiros, considera-se prioritário reforçar e promover o conhecimento sobre o sector, nomeadamente sobre os serviços de transporte em táxi.</p>

          <ul>
            <li>Facebook</li>
            <li>Linkedin</li>
            <li>Twitter</li>
            <li>Google +</li>
          </ul>

        </section>
      </div>
    );
  }
});

module.exports = SectionIntro;
