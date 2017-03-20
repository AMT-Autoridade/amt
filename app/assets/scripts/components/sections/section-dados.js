'use strict';
import React, { PropTypes as T } from 'react';

var SectionDados = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='section-dados' className='container-wrapper section-wrapper'>
        
        <h1>Sobre os dados</h1>   

        <section id='dados'>
             
          <div>
            <p className='lead'>O <a href="#">Observatório da Mobilidade</a> contém dados detalhados sobre o setor dos serviços de transporte em táxi em Portugal no período entre 2006 e 2016. Os dados foram recolhidos pela Autoridade da Mobilidade e dos Transportes junto das 308 câmaras municipais do país.</p>
            <p className='lead'>De forma a complementar os dados recolhidos e para fazer uma análise mais completa ao panorama actual, foram também utilizados dados sobre a população residente e sobre as dormidas nos estabelecimentos hoteleiros, disponibilizada pelo Instituto Nacional de Estatística através da sua base de dados pública (www.ine.pt).</p>
            <p className='lead'>A AMT agradece a colaboração e disponibilidade das câmaras municipais na disponibilização da informação.</p>
          </div>

          <div>
            <h3>Tratamento de Dados</h3>
              <p>Para os concelhos em que não existia informação disponível para todos os anos no período compreendido entre 2006 e 2016, os valores assumidos na análise da evolução do setor decorrem da aplicação da taxa de variação anual apurada para os restantes concelhos.</p>
              <p>A percentagem de valores interpolados da forma descrita corresponde apenas a 0,2% dos dados analisados.</p>

              <h3>Ferramentas Utilizadas</h3>
              <p>Falta este texto</p>
          </div>
        </section>
      </div>
    );
  }
});

module.exports = SectionDados;








