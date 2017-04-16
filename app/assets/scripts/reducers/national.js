import { REQUEST_NATIONAL, RECEIVE_NATIONAL, INVALIDATE_NATIONAL, RECEIVE_NUT, RECEIVE_CONCELHO } from '../actions';
import _ from 'lodash';

const initialState = {
  fetching: false,
  fetched: false,
  data: {
  }
};

// Cache processing.
let processed = false;

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_NATIONAL:
      processed = false;
      return Object.assign({}, state, initialState);
    case REQUEST_NATIONAL:
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
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
  console.log('processing national');
  let nuts = rawData.results;
  let data = {nuts, dormidas: rawData.dormidas};

  // Sort nuts.
  data.nuts = _.sortBy(nuts, 'slug');

  // Licenças and max per district.
  nuts = nuts.map(d => {
    d.data.licencas2006 = d.data['lic-geral'][0].value + d.data['lic-mob-reduzida'][0].value;
    d.data.licencas2016 = _.last(d.data['lic-geral']).value + _.last(d.data['lic-mob-reduzida']).value;
    d.data.max2016 = _.last(d.data['max-lic-geral']).value + _.last(d.data['max-lic-mob-reduzida']).value;

    // For each município compute the change on the total number of licenças.
    var indexLast = d.data['lic-geral'].length - 1;
    d.concelhos = d.concelhos.map(c => {
      if (!c.data['lic-geral']) {
        console.error(`Concelho: ${c.name} doesn't have data on "lic-geral"`);
      }
      // They all have the same length.
      let licencas2006 = _.get(c.data, 'lic-geral[0].value', 0) + _.get(c.data, 'lic-mob-reduzida[0].value', 0);
      let licencas2016 = _.get(c.data, `lic-geral[${indexLast}].value`, 0) + _.get(c.data, `lic-mob-reduzida[${indexLast}].value`, 0);
      c.data.change = licencas2016 - licencas2006;
      return c;
    });
    return d;
  });

  // All concelhos.
  data.concelhos = data.nuts.reduce((acc, nut) => acc.concat(nut.concelhos), []);

  // Total licenças 2006.
  data.licencas2006 = _.sumBy(nuts, 'data.licencas2006');

  // Total licenças mob reduzida 2006.
  data.licencasMobReduzida2006 = _.sumBy(nuts, d => d.data['lic-mob-reduzida'][0].value);

  // Total licenças mob reduzida 2016.
  data.licencasMobReduzida2016 = _.sumBy(nuts, d => _.last(d.data['lic-mob-reduzida']).value);

  // Total licenças 2016.
  data.licencas2016 = _.sumBy(nuts, 'data.licencas2016');

  // Max licenças 2016
  data.max2016 = _.sumBy(nuts, 'data.max2016');

  // Pouplação
  data.populacao = _.sumBy(nuts, d => _.last(d.data['pop-residente']).value);

  // Licenças per 1000 habitants.
  data.licencasHab = data.licencas2016 / (data.populacao / 1000);

  data.totalMunicipios = _.sumBy(nuts, d => d.concelhos.length);

  // Licenças per 1000 dormidas.
  data.dormidas = data.dormidas.map(d => {
    d.lic1000 = data.licencas2016 / (d.value / 1000);
    return d;
  });

  // Number of municípios with lic-mob-reduzida.
  data.totalMunicipiosMobReduzida = _.sumBy(nuts, d => d.concelhos.filter(o => {
    if (!o.data['lic-mob-reduzida']) {
      console.error(`Concelho: ${o.name} doesn't have data on "lic-mob-reduzida"`);
      return false;
    }
    return _.last(o.data['lic-mob-reduzida']).value !== 0;
  }).length);

  let nutAmLx = nuts.find(n => n.id === 'PT170');
  let nutAmPor = nuts.find(n => n.id === 'PT11A');

  // Compute the timeline at the national level.
  // To calculate the variation chart we use the 2006 data as basis.
  let varBaseline = {
    dormidas: data.dormidas[0].value,
    populacao: _.sumBy(nuts, d => d.data['pop-residente'][0].value),
    licencas: data.licencas2006
  };
  data.licencasTimeline = _.range(2006, 2017).map((y, i) => {
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
