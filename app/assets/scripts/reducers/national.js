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
        state.data = processData(action.data);
      }
      break;
  }
  return state;
}

function processData (distritos) {
  let data = {distritos};

  // Licenças and max per district.
  distritos = distritos.map(d => {
    d.data.licencas2016 = _.last(d.data['lic-geral']).value + _.last(d.data['lic-mob-reduzida']).value;
    d.data.max2016 = _.last(d.data['max-lic-geral']).value + _.last(d.data['max-lic-mob-reduzida']).value;
    return d;
  });

  // Total licenças 2016.
  data.licencas2016 = distritos.reduce((acc, distrito) => {
    return acc + distrito.data.licencas2016;
  }, 0);

  // Max licenças 2016
  data.max2016 = distritos.reduce((acc, distrito) => {
    return acc + distrito.data.max2016;
  }, 0);

  // Pouplação
  data.populacao = distritos.reduce((acc, distrito) => {
    return acc + _.last(distrito.data['pop-residente']).value;
  }, 0);

  // Licenças per 1000 habitants.
  data.licencasHab = data.licencas2016 / (data.populacao / 1000);

  console.log('data', data);

  return data;
}
