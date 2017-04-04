'use strict';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import national from './national';
import nut from './nut';
import concelho from './concelho';
import mapData from './map';

export const reducers = {
  national,
  nut,
  concelho,
  mapData
};

export default combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));
