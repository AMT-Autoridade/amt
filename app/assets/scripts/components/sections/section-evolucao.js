'use strict';
import React, { PropTypes as T } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import _ from 'lodash';

import { percent, round } from '../../utils/utils';

var SectionEvolucao = React.createClass({
  propTypes: {
    data: T.object
  },

  render: function () {
    return (
      <div id='section-evolucao' className='section-wrapper'>
        <section className='section-container'>
          <header className='section-header'>
            <h3>Portugal</h3>
            <h1>Evolução 2006 - 2016</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies, in rhoncus nulla volutpat. Donec id imperdiet ipsum. Morbi interdum eros rhoncus metus ultricies.</p>
          </header>
          <div className='section-content'>
          </div>
          <footer className='section-footer'>
            <p><strong>Notas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum eros rhoncus metus ultricies</p>
          </footer>
        </section>
      </div>
    );
  }
});

module.exports = SectionEvolucao;
