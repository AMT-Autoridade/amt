import { REQUEST_NATIONAL, RECEIVE_NATIONAL, INVALIDATE_NATIONAL } from '../actions';

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
        state.data = action.data;
      }
      break;
  }
  return state;
}
