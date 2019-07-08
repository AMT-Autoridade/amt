'use strict';
import React from 'react';

var UhOh = React.createClass({
  render: function () {
    return (
      <div className='container-wrapper'>
        <section className='content-wrapper'>
          <h1>Página não encontrada</h1>
          <div className='wrapper'>
            <div>
              <p className='lead'>A página que procura não existe ou foi removida mas poderá encontrar todos os dados na <a href='/' title='Visitar página principal'>página principal</a>.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
});

export default UhOh;
