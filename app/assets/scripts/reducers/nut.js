import _ from 'lodash';

import {
  REQUEST_NUT,
  RECEIVE_NUT,
  INVALIDATE_NUT,
  RECEIVE_CONCELHO
} from '../actions';
import { startYear, endYear } from '../config';

const initialState = {
  fetching: false,
  fetched: false,
  data: {}
};

// Cache processing.
let processed = false;

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_NUT:
      processed = false;
      return Object.assign({}, state, initialState);
    case REQUEST_NUT:
      return Object.assign({}, state, {
        error: null,
        fetching: true,
        fetched: false
      });
    case RECEIVE_NUT:
    case RECEIVE_CONCELHO:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else if (processed !== action.nutSlug) {
        processed = action.nutSlug;
        let nut = action.data.results.find(o => o.slug === action.nutSlug);
        state.data = processData(nut);
      }
      break;
  }
  return state;
}

function processData (nut) {
  // Sanitize.
  // nut.concelhos = nut.concelhos.map((d, i) => {
  //   if (!d.data['lic-geral']) {
  //     console.info(`Concelho: ${d.name} doesn't have data on "lic-geral"`);
  //     d.data['lic-geral'] = _.range(startYear, endYear + 1).map(y => ({year: y, value: 1}));
  //   }
  //   if (!d.data['lic-mob-reduzida']) {
  //     console.info(`Concelho: ${d.name} doesn't have data on "lic-mob-reduzida"`);
  //     d.data['lic-mob-reduzida'] = _.range(startYear, endYear + 1).map(y => ({year: y, value: 1}));
  //   }
  //   if (!d.data['max-lic-geral']) {
  //     console.info(`Concelho: ${d.name} doesn't have data on "max-lic-geral"`);
  //     d.data['max-lic-geral'] = _.range(startYear, endYear + 1).map(y => ({year: y, value: 1}));
  //   }
  //   if (!d.data['max-lic-mob-reduzida']) {
  //     console.info(`Concelho: ${d.name} doesn't have data on "max-lic-mob-reduzida"`);
  //     d.data['max-lic-mob-reduzida'] = _.range(startYear, endYear + 1).map(y => ({year: y, value: 1}));
  //   }

  //   return d;
  // });

  // Sort concelhos.
  nut.concelhos = _.sortBy(nut.concelhos, 'slug');

  // Licenças and max per district.
  nut.concelhos = nut.concelhos.map(d => {
    d.data.licencasStartY = d.data['lic-geral'][0].value + d.data['lic-mob-reduzida'][0].value;
    d.data.licencasEndY = _.last(d.data['lic-geral']).value + _.last(d.data['lic-mob-reduzida']).value;
    d.data.maxEndY = _.last(d.data['max-lic-geral']).value + _.last(d.data['max-lic-mob-reduzida']).value;

    d.data.change = d.data.licencasEndY - d.data.licencasStartY;

    return d;
  });

  // Total licenças start year.
  nut.data.licencasStartY = nut.data['lic-geral'][0].value + nut.data['lic-mob-reduzida'][0].value;

  // Total licenças mob reduzida start year.
  nut.data.licencasMobReduzidaStartY = _.sumBy(nut.concelhos, d => d.data['lic-mob-reduzida'][0].value);

  // Total licenças mob reduzida end year.
  nut.data.licencasMobReduzidaEndY = _.sumBy(nut.concelhos, d => _.last(d.data['lic-mob-reduzida']).value);

  // Total licenças end year.
  nut.data.licencasEndY = _.last(nut.data['lic-geral']).value + _.last(nut.data['lic-mob-reduzida']).value;

  // Max licenças end year
  nut.data.maxEndY = _.last(nut.data['max-lic-geral']).value + _.last(nut.data['max-lic-mob-reduzida']).value;

  // Pouplação
  nut.data.populacao = _.last(nut.data['pop-residente']).value;

  // Licenças per 1000 habitants.
  nut.data.licencasHab = nut.data.licencasEndY / (nut.data.populacao / 1000);

  nut.data.totalMunicipios = nut.concelhos.length;

  // Number of municípios with lic-mob-reduzida.
  nut.data.totalMunicipiosMobReduzida = _.sumBy(nut.concelhos, d => _.last(d.data['lic-mob-reduzida']).value ? 1 : 0);

  // Compute the timeline at the nut level.
  nut.data.licencasTimeline = _.range(startYear, endYear + 1).map((y, i) => {
    let d = {
      year: y,
      'lic-geral': nut.data['lic-geral'][i].value,
      'lic-mob-reduzida': nut.data['lic-mob-reduzida'][i].value,
      'max-lic-geral': nut.data['max-lic-geral'][i].value,
      'max-lic-mob-reduzida': nut.data['max-lic-mob-reduzida'][i].value
    };
    // Population is only available until 2015.
    // when computing for years over 2015 use last available.
    let idx = nut.data['pop-residente'].length - 1;
    if (idx > i) {
      idx = i;
    }
    d['pop-residente'] = nut.data['pop-residente'][idx].value;

    d['lic1000'] = (d['lic-geral'] + d['lic-mob-reduzida']) / (d['pop-residente'] / 1000);

    return d;
  });

  return nut;
}
