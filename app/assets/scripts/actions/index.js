import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import config from '../config';

var dataCache = null;
function fetchAndCacheData () {
  return new Promise((resolve, reject) => {
    if (dataCache) {
      return resolve(_.cloneDeep(dataCache));
    }
    dataCache = require('../data/national.json');
    setTimeout(() => resolve(_.cloneDeep(dataCache)), 300);
  });

  // return new Promise((resolve, reject) => {
  //   if (dataCache) {
  //     return resolve(_.cloneDeep(dataCache));
  //   }

  //   fetchJSON(`${config.api}/national.json`)
  //     .then(national => {
  //       dataCache = national;
  //       resolve(dataCache);
  //     }, err => reject(err));
  // });
}

export const REQUEST_NATIONAL = 'REQUEST_NATIONAL';
export const RECEIVE_NATIONAL = 'RECEIVE_NATIONAL';
export const INVALIDATE_NATIONAL = 'INVALIDATE_NATIONAL';

export const REQUEST_NUT = 'REQUEST_NUT';
export const RECEIVE_NUT = 'RECEIVE_NUT';
export const INVALIDATE_NUT = 'INVALIDATE_NUT';

export const REQUEST_MAP_DATA = 'REQUEST_MAP_DATA';
export const RECEIVE_MAP_DATA = 'RECEIVE_MAP_DATA';

// National

export function invalidateNational () {
  return { type: INVALIDATE_NATIONAL };
}

export function requestNational () {
  return { type: REQUEST_NATIONAL };
}

export function receiveNational (data, error = null) {
  return { type: RECEIVE_NATIONAL, data: data, error, receivedAt: Date.now() };
}

export function fetchNational () {
  return (dispatch) => {
    dispatch(requestNational());
    fetchAndCacheData()
      .then(national => dispatch(receiveNational(national)),
        err => dispatch(receiveNational(null, err)));
  };
}

// Nut

export function invalidateNut () {
  return { type: INVALIDATE_NUT };
}

export function requestNut () {
  return { type: REQUEST_NUT };
}

export function receiveNut (data, slug, error = null) {
  return { type: RECEIVE_NUT, data: data, slug, error, receivedAt: Date.now() };
}

export function fetchNut (nutSlug) {
  // Fake data load.
  return (dispatch) => {
    dispatch(requestNut());
    fetchAndCacheData()
      .then(national => dispatch(receiveNut(national, nutSlug)),
        err => dispatch(receiveNut(null, null, err)));
  };
}

// Map Data

export function requestMapData () {
  return { type: REQUEST_MAP_DATA };
}

export function receiveMapData (data, error = null) {
  return { type: RECEIVE_MAP_DATA, data: data, error, receivedAt: Date.now() };
}

export function fetchMapData () {
  return getAndDispatch(`assets/data/admin-areas.topojson`, requestMapData, receiveMapData);
}

// Fetcher function

function getAndDispatch (url, requestFn, receiveFn) {
  return fetchDispatchFactory(url, null, requestFn, receiveFn);
}

function fetchDispatchFactory (url, options, requestFn, receiveFn) {
  return function (dispatch, getState) {
    dispatch(requestFn());

    fetchJSON(url, options)
      .then(json => dispatch(receiveFn(json)), err => dispatch(receiveFn(null, err)));
  };
}

export function fetchJSON (url, options) {
  return fetch(url, options)
    .then(response => {
      return response.text()
      // .then(body => ((new Promise(resolve => setTimeout(() => resolve(body), 1000)))))
      .then(body => {
        var json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          console.log('json parse error', e);
          return Promise.reject({
            error: e.message,
            body
          });
        }

        return response.status >= 400
          ? Promise.reject(json)
          : Promise.resolve(json);
      });
    });
}
