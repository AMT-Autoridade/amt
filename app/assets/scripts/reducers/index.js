'use strict';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import national from './national';
import nut from './nut';

export const reducers = {
  national,
  nut
};

export default combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));
