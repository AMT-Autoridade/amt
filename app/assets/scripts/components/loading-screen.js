'use strict';
import React from 'react';

import { startYear, endYear } from '../config';

export default function LoadingScreen () {
  return (
    <div id='intro-wrapper' className='loading-screen'>
      <div id='intro' className='container-wrapper content-wrapper'>
        <section>
          <h2 id='intro-logo'><a href='#'>Autoridade da Mobilidade e dos Transportes</a></h2>
          <h1>Táxis em Portugal <span className='block'>{startYear}&ndash;{endYear}</span></h1>
          <h3 className='section-category'>A carregar dados</h3>
        </section>
        <div className='loading-car'>
          <img src='/assets/graphics/layout/amt-taxi.jpg' title='Taxy drawing' width='200px' />
        </div>
      </div>
    </div>
  );
}