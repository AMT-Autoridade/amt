import { REQUEST_NATIONAL, RECEIVE_NATIONAL, INVALIDATE_NATIONAL } from '../actions';
import _ from 'lodash';

const initialState = {
  fetching: false,
  fetched: false,
  data: {
  }
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_NATIONAL:
      return Object.assign({}, state, initialState);
    case REQUEST_NATIONAL:
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case RECEIVE_NATIONAL:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = processData(action.data.results);
      }
      break;
  }
  return state;
}

function processData (distritos) {
  let data = {distritos};

  // Licenças and max per district.
  distritos = distritos.map(d => {
    d.data.licencas2006 = d.data['lic-geral'][0].value + d.data['lic-mob-reduzida'][0].value;
    d.data.licencas2016 = _.last(d.data['lic-geral']).value + _.last(d.data['lic-mob-reduzida']).value;
    d.data.max2016 = _.last(d.data['max-lic-geral']).value + _.last(d.data['max-lic-mob-reduzida']).value;
    return d;
  });

  // Total licenças 2006.
  data.licencas2006 = _.sumBy(distritos, 'data.licencas2006');

  // Total licenças mob reduzida 2006.
  data.licencasMobReduzida2006 = _.sumBy(distritos, d => d.data['lic-mob-reduzida'][0].value);

  // Total licenças mob reduzida 2016.
  data.licencasMobReduzida2016 = _.sumBy(distritos, d => _.last(d.data['lic-mob-reduzida']).value);

  // Total licenças 2016.
  data.licencas2016 = _.sumBy(distritos, 'data.licencas2016');

  // Max licenças 2016
  data.max2016 = _.sumBy(distritos, 'data.max2016');

  // Pouplação
  data.populacao = _.sumBy(distritos, distrito => _.last(distrito.data['pop-residente']).value);

  // Licenças per 1000 habitants.
  data.licencasHab = data.licencas2016 / (data.populacao / 1000);

  data.totalMunicipios = _.sumBy(distritos, d => d.concelhos.length);

  // Number of municípios with lic-mob-reduzida.
  data.totalMunicipiosMobReduzida = _.sumBy(distritos, d => d.concelhos.filter(o => {
    if (!o.data['lic-mob-reduzida']) {
      console.error(`Concelho: ${o.name} doesn't have data on "lic-mob-reduzida"`);
      return false;
    }
    return _.last(o.data['lic-mob-reduzida']).value !== 0;
  }).length);

  // Compute the timeline at the national level.
  data.licencasTimeline = _.range(2006, 2017).map((y, i) => {
    return {
      year: y,
      'lic-geral': _.sumBy(distritos, `data['lic-geral'][${i}].value`),
      'lic-mob-reduzida': _.sumBy(distritos, `data['lic-mob-reduzida'][${i}].value`),
      'max-lic-geral': _.sumBy(distritos, `data['max-lic-geral'][${i}].value`),
      'max-lic-mob-reduzida': _.sumBy(distritos, `data['max-lic-mob-reduzida'][${i}].value`)
    };
  });

  // For each município compute the change on the total number of licenças.
  distritos = distritos.map(d => {
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


  return data;
}
