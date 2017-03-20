'use strict';
import React, { PropTypes as T } from 'react';

var SectionSobre = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='section-sobre' className='container-wrapper'>
        <section id='intro'>
          <h1>Sobre o Projeto</h1>
          <p>Num momento em que discute o enquadramento regulatório do transporte de passageiros em veículos ligeiros, considera-se prioritário reforçar e promover o conhecimento sobre o sector, nomeadamente sobre os serviços de transporte em táxi.</p>

          

        </section>
      </div>
    );
  }
});

module.exports = SectionSobre;
