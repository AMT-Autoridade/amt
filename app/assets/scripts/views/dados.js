'use strict';
import React from 'react';

import config from '../config';

var Dados = React.createClass({
  render: function () {
    return (
      <div id='dados' className='container-wrapper'>
        <section id='dados' className='content-wrapper'>
          <h1>Sobre os dados</h1>
          <div>
            <p className='lead'> Este site contém dados sobre o número de <a href={`${config.rawGitApi}@master/data/taxis.csv`} title='Descarregar dados'>táxis licenciados e os contingentes estabelecidos</a> (número máximo de táxis a licenciar) pelos municípios. São também utilizados dados relativos ao <a href={`${config.rawGitApi}@master/data/area-metadata.csv`} title='Descarregar dados'>âmbito geográfico dos contingentes e quanto às disposições relativas ao estacionamento dos táxis</a>. Os dados referem-se ao período entre {config.startYear} e {config.endYear} e foram recolhidos, pela AMT, junto dos 308 municípios portugueses. De forma a complementar os dados recolhidos e concretizar uma análise mais detalhada, foram também utilizados dados sobre a <a href={`${config.rawGitApi}@master/data/population.csv`} title='Descarregar dados'>população residente</a> e sobre as <a href={`${config.rawGitApi}@master/data/dormidas.csv`} title='Descarregar dados'>dormidas</a> em estabelecimentos hoteleiros, disponibilizados pelo <a href='http://www.ine.pt' title='Ir para INE' target='_blank' rel='noopener noreferrer'>Instituto Nacional de Estatística</a> na sua base de dados pública.</p>

            <p>A AMT agradece a colaboração dos municípios na disponibilização da informação. Agradecem-se igualmente os contributos do Instituto da Mobilidade e dos Transportes, da Direção Regional da Economia e Transportes da Região Autónoma da Madeira e da Direção Regional dos Transportes da Região Autónoma dos Açores.</p>
          </div>
          <div>
            <h3>Tratamento de Dados</h3>
            <p>Existem dados relativos a {config.endYear} para todos os concelhos. Para os concelhos em que não existia informação disponível para todo o período compreendido entre {config.startYear} e {config.endYear}, os valores assumidos na análise resultam de imputação do primeiro valor disponível aos anos anteriores. Neste caso, a metodologia descrita é equivalente à utilização das taxas de variação anual apuradas para os concelhos com informação, na imputação dos valores dos concelhos sem dados para todos os anos.</p>

            <h3>Ferramentas Utilizadas</h3>
            <p>Os dados originais, publicados em quatro ficheiros, foram processados por um conjunto de scripts desenvolvidos à medida em Node.js. Os dados geográficos para o mapa foram processados com Ogr2ogr. O Github foi utilizado para controlo de versões e disponibilização do código em formato Open Source. Finalmente, o Travis CI é usado para um processo de testes e publicação automática do site.</p>
          </div>
        </section>
      </div>
    );
  }
});

module.exports = Dados;
