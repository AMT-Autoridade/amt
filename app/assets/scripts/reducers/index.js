'use strict';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import national from './national';

export const reducers = {
  national
};

export default combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));
