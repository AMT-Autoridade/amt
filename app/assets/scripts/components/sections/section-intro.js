'use strict';
import React, { PropTypes as T } from 'react';

var SectionIntro = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='intro' className='container-wrapper'>
        <section id='intro' className='section-wrapper'>
          <h3 className='section-category'>Observatório dos Mercados da Mobilidade,<span className='block'> Preços e Estratégias Empresariais</span></h3>
          <h1>Táxis em Portugal 2006-2016</h1>
          <p className='lead'>Num momento em que discute o enquadramento regulatório do transporte de passageiros em veículos ligeiros, considera-se prioritário reforçar e promover o conhecimento sobre o sector, nomeadamente sobre os serviços de transporte em táxi.</p>

          <ul>
            <li><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A//leihla.github.io/amt/%23/" title="Partilhar no Facebook">Facebook</a></li>
            <li><a href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A//leihla.github.io/amt/%23/&title=Observat%C3%B3rio%20da%20Mobilidade%20e%20dos%20Transportes%20&summary=&source=" title="Partilhar no LinkedIn">LinkedIn</a></li>
            <li><a href="https://twitter.com/home?status=https%3A//leihla.github.io/amt/%23/" title="Partilhar no Twitter">Twitter</a></li>
            <li><a href="https://plus.google.com/share?url=https%3A//leihla.github.io/amt/%23/" title="Partilhar no Google+">Google+</a></li>
          </ul>

        </section>
      </div>
    );
  }
});

module.exports = SectionIntro;
