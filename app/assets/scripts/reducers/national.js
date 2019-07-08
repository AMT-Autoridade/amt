import _ from 'lodash';

import {
  REQUEST_NATIONAL,
  RECEIVE_NATIONAL,
  INVALIDATE_NATIONAL,
  RECEIVE_NUT,
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
    case INVALIDATE_NATIONAL:
      processed = false;
      return Object.assign({}, state, initialState);
    case REQUEST_NATIONAL:
      return Object.assign({}, state, {
        error: null,
        fetching: true,
        fetched: false
      });
    case RECEIVE_CONCELHO:
    case RECEIVE_NUT:
    case RECEIVE_NATIONAL:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else if (!processed) {
        processed = true;
        state.data = processData(action.data);
      }
      break;
  }
  return state;
}

function processData (rawData) {
  let nuts = rawData.results;

  // The data for dormidas is stored as a result in the results array.
  // We have to remove it from there and just leave the nuts.
  let dormidasIdx = _.findIndex(rawData.results, o => parseInt(o.id) === 1);
  let data = {
    nuts,
    dormidas: _.sortBy(rawData.results[dormidasIdx].data.dormidas, 'year')
  };
  rawData.results.splice(dormidasIdx, 1);

  const getLicencasForYear = (d, year) => {
    return _.find(d.data['lic-geral'], ['year', year]).value + _.find(d.data['lic-mob-reduzida'], ['year', year]).value;
  };

  // Sort nuts.
  data.nuts = _.sortBy(nuts, 'slug');

  // Licenças and max per district.
  nuts = nuts.map(d => {
    d.data.licencasStartY = getLicencasForYear(d, startYear);
    d.data.licencasEndY = getLicencasForYear(d, endYear);
    d.data.maxEndY = _.last(d.data['max-lic-geral']).value + _.last(d.data['max-lic-mob-reduzida']).value;

    // For each município compute the change on the total number of licenças.
    var indexLast = d.data['lic-geral'].length - 1;
    d.concelhos = d.concelhos.map(c => {
      if (!c.data['lic-geral']) {
        // eslint-disable-next-line no-console
        console.error(`Concelho: ${c.name} doesn't have data on "lic-geral"`);
      }
      // They all have the same length.
      let licencasStartY = _.get(c.data, 'lic-geral[0].value', 0) + _.get(c.data, 'lic-mob-reduzida[0].value', 0);
      let licencasEndY = _.get(c.data, `lic-geral[${indexLast}].value`, 0) + _.get(c.data, `lic-mob-reduzida[${indexLast}].value`, 0);
      c.data.change = licencasEndY - licencasStartY;
      return c;
    });
    return d;
  });

  // All concelhos.
  data.concelhos = data.nuts.reduce((acc, nut) => acc.concat(nut.concelhos), []);

  // Total licenças start year.
  data.licencasStartY = _.sumBy(nuts, 'data.licencasStartY');

  // Total licenças mob reduzida start year.
  data.licencasMobReduzidaStartY = _.sumBy(nuts, d => d.data['lic-mob-reduzida'][0].value);

  // Total licenças mob reduzida end year.
  data.licencasMobReduzidaEndY = _.sumBy(nuts, d => _.last(d.data['lic-mob-reduzida']).value);

  // Total licenças end year.
  data.licencasEndY = _.sumBy(nuts, 'data.licencasEndY');

  // Max licenças end year
  data.maxEndY = _.sumBy(nuts, 'data.maxEndY');

  // Pouplação
  data.populacao = _.sumBy(nuts, d => _.last(d.data['pop-residente']).value);

  // Licenças per 1000 habitants.
  data.licencasHab = data.licencasEndY / (data.populacao / 1000);

  data.totalMunicipios = _.sumBy(nuts, d => d.concelhos.length);

  // Licenças per 1000 dormidas.
  data.dormidas = data.dormidas.map(d => {
    let licYear = _.sumBy(nuts, n => getLicencasForYear(n, d.year));
    d.lic1000 = licYear / (d.value / 1000);
    return d;
  });

  // Number of municípios with lic-mob-reduzida.
  data.totalMunicipiosMobReduzida = _.sumBy(nuts, d => d.concelhos.filter(o => {
    if (!o.data['lic-mob-reduzida']) {
      // eslint-disable-next-line no-console
      console.error(`Concelho: ${o.name} doesn't have data on "lic-mob-reduzida"`);
      return false;
    }
    return _.last(o.data['lic-mob-reduzida']).value !== 0;
  }).length);

  let nutAmLx = nuts.find(n => n.id === 'PT170');
  let nutAmPor = nuts.find(n => n.id === 'PT11A');

  // Compute the timeline at the national level.
  // To calculate the variation chart we use the start year data as basis.
  let varBaseline = {
    dormidas: data.dormidas[0].value,
    populacao: _.sumBy(nuts, d => d.data['pop-residente'][0].value),
    licencas: data.licencasStartY
  };
  data.licencasTimeline = _.range(startYear, endYear + 1).map((y, i) => {
    let d = {
      year: y,
      'lic-geral': _.sumBy(nuts, `data['lic-geral'][${i}].value`),
      'lic-mob-reduzida': _.sumBy(nuts, `data['lic-mob-reduzida'][${i}].value`),
      'max-lic-geral': _.sumBy(nuts, `data['max-lic-geral'][${i}].value`),
      'max-lic-mob-reduzida': _.sumBy(nuts, `data['max-lic-mob-reduzida'][${i}].value`)
    };
    // Population is only available until 2015.
    // when computing for years over 2015 use last available.
    let idx = nuts[0].data['pop-residente'].length - 1;
    if (idx > i) {
      idx = i;
    }
    d['pop-residente'] = _.sumBy(nuts, `data['pop-residente'][${idx}].value`);

    d['lic1000'] = (d['lic-geral'] + d['lic-mob-reduzida']) / (d['pop-residente'] / 1000);

    // Lic 1000 for Lisboa
    d['lic1000-lx'] = (nutAmLx.data['lic-geral'][i].value + nutAmLx.data['lic-mob-reduzida'][i].value) / (nutAmLx.data['pop-residente'][idx].value / 1000);
    // Lic 1000 for Porto
    d['lic1000-por'] = (nutAmPor.data['lic-geral'][i].value + nutAmPor.data['lic-mob-reduzida'][i].value) / (nutAmPor.data['pop-residente'][idx].value / 1000);

    // Variation data. (newVal - oldVal) / oldVal
    d['var-lic-all'] = ((d['lic-geral'] + d['lic-mob-reduzida']) - varBaseline.licencas) / varBaseline.licencas * 100;

    if (y <= 2015) {
      d['var-populacao'] = (d['pop-residente'] - varBaseline.populacao) / varBaseline.populacao * 100;
      d['var-dormidas'] = (data.dormidas[idx].value - varBaseline.dormidas) / varBaseline.dormidas * 100;
    }

    return d;
  });

  return data;
}
