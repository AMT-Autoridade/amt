import { REQUEST_MAP_DATA, RECEIVE_MAP_DATA } from '../actions';

const initialState = {
  fetching: false,
  fetched: false,
  data: {
  }
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MAP_DATA:
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case RECEIVE_MAP_DATA:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.data;
      }
      break;
  }
  return state;
}
