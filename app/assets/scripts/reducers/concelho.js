import _ from 'lodash';

import {
  REQUEST_CONCELHO,
  RECEIVE_CONCELHO,
  INVALIDATE_CONCELHO
} from '../actions';
import { startYear, endYear } from '../config';

const initialState = {
  fetching: false,
  fetched: false,
  data: {}
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_CONCELHO:
      return Object.assign({}, state, initialState);
    case REQUEST_CONCELHO:
      return Object.assign({}, state, {
        error: null,
        fetching: true,
        fetched: false
      });
    case RECEIVE_CONCELHO:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else {
        let concelho = action.data.results
          .find(o => o.slug === action.nutSlug)
          .concelhos.find(o => o.slug === action.concelhoSlug);
        state.data = processData(concelho);
      }
      break;
  }
  return state;
}

function processData (concelho) {
  const getLicencasForYear = (d, year) => {
    return _.find(d.data['lic-geral'], ['year', year]).value + _.find(d.data['lic-mob-reduzida'], ['year', year]).value;
  };

  // Total licenças start year.
  concelho.data.licencasStartY = getLicencasForYear(concelho, startYear);

  // Total licenças end year.
  concelho.data.licencasEndY = getLicencasForYear(concelho, endYear);

  // Max licenças end year
  concelho.data.maxEndY = _.last(concelho.data['max-lic-geral']).value + _.last(concelho.data['max-lic-mob-reduzida']).value;

  // Change in licenças
  concelho.data.change = concelho.data.licencasEndY - concelho.data.licencasStartY;

  // Licenças per 1000 dormidas.
  concelho.data.dormidas = concelho.data.dormidas.map(d => {
    let licYear = getLicencasForYear(concelho, d.year);
    d.lic1000 = d.value ? licYear / (d.value / 1000) : null;
    return d;
  });

  // Compute the timeline at the concelho level.
  concelho.data.licencasTimeline = _.range(startYear, endYear + 1).map((y, i) => {
    let d = {
      year: y,
      'lic-geral': concelho.data['lic-geral'][i].value,
      'lic-mob-reduzida': concelho.data['lic-mob-reduzida'][i].value,
      'max-lic-geral': concelho.data['max-lic-geral'][i].value,
      'max-lic-mob-reduzida': concelho.data['max-lic-mob-reduzida'][i].value
    };

    d['pop-residente'] = concelho.data['pop-residente'][i].value;

    d['lic1000'] = (d['lic-geral'] + d['lic-mob-reduzida']) / (d['pop-residente'] / 1000);
    return d;
  });

  return concelho;
}
