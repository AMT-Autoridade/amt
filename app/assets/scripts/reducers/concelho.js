import { REQUEST_CONCELHO, RECEIVE_CONCELHO, INVALIDATE_CONCELHO } from '../actions';
import _ from 'lodash';

const initialState = {
  fetching: false,
  fetched: false,
  data: {
  }
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_CONCELHO:
      return Object.assign({}, state, initialState);
    case REQUEST_CONCELHO:
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case RECEIVE_CONCELHO:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else {
        let concelho = action.data.results
          .find(o => o.slug === action.nutSlug)
          .concelhos
          .find(o => o.slug === action.concelhoSlug);
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

  // Total licenças 2006.
  concelho.data.licencas2006 = getLicencasForYear(concelho, 2006);

  // Total licenças 2016.
  concelho.data.licencas2016 = getLicencasForYear(concelho, 2016);

  // Max licenças 2016
  concelho.data.max2016 = _.last(concelho.data['max-lic-geral']).value + _.last(concelho.data['max-lic-mob-reduzida']).value;

  // Change in licenças
  concelho.data.change = concelho.data.licencas2016 - concelho.data.licencas2006;

  // Licenças per 1000 dormidas.
  concelho.data.dormidas = concelho.data.dormidas.map(d => {
    let licYear = getLicencasForYear(concelho, d.year);
    d.lic1000 = d.value ? licYear / (d.value / 1000) : null;
    return d;
  });

  // Compute the timeline at the concelho level.
  concelho.data.licencasTimeline = _.range(2006, 2017).map((y, i) => {
    let d = {
      year: y,
      'lic-geral': concelho.data['lic-geral'][i].value,
      'lic-mob-reduzida': concelho.data['lic-mob-reduzida'][i].value,
      'max-lic-geral': concelho.data['max-lic-geral'][i].value,
      'max-lic-mob-reduzida': concelho.data['max-lic-mob-reduzida'][i].value
    };
    // Population is only available until 2015.
    // when computing for years over 2015 use last available.
    let idx = concelho.data['pop-residente'].length - 1;
    if (idx > i) {
      idx = i;
    }
    d['pop-residente'] = concelho.data['pop-residente'][idx].value;

    d['lic1000'] = (d['lic-geral'] + d['lic-mob-reduzida']) / (d['pop-residente'] / 1000);
    return d;
  });

  return concelho;
}
