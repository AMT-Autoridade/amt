import fetch from 'isomorphic-fetch';

import config from '../config';

var dataCache = null;
function fetchAndCacheData () {
  // return new Promise((resolve, reject) => {
  //   if (dataCache) {
  //     return resolve(JSON.parse(JSON.stringify(dataCache)));
  //   }
  //   dataCache = require('../data/national.json');
  //   setTimeout(() => resolve(JSON.parse(JSON.stringify(dataCache))), 300);
  // });

  return new Promise((resolve, reject) => {
    if (dataCache) {
      return resolve(JSON.parse(JSON.stringify(dataCache)));
    }

    fetchJSON(`${config.api}/api/national.json`)
      .then(national => {
        dataCache = national;
        resolve(dataCache);
      }, err => reject(err));
  });
}

export const REQUEST_NATIONAL = 'REQUEST_NATIONAL';
export const RECEIVE_NATIONAL = 'RECEIVE_NATIONAL';
export const INVALIDATE_NATIONAL = 'INVALIDATE_NATIONAL';

export const REQUEST_NUT = 'REQUEST_NUT';
export const RECEIVE_NUT = 'RECEIVE_NUT';
export const INVALIDATE_NUT = 'INVALIDATE_NUT';

export const REQUEST_CONCELHO = 'REQUEST_CONCELHO';
export const RECEIVE_CONCELHO = 'RECEIVE_CONCELHO';
export const INVALIDATE_CONCELHO = 'INVALIDATE_CONCELHO';

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

export function receiveNut (data, nutSlug, error = null) {
  return { type: RECEIVE_NUT, data: data, nutSlug, error, receivedAt: Date.now() };
}

export function fetchNut (nutSlug) {
  return (dispatch) => {
    dispatch(requestNut());
    fetchAndCacheData()
      .then(national => dispatch(receiveNut(national, nutSlug)),
        err => dispatch(receiveNut(null, null, err)));
  };
}

// Nut

export function invalidateConcelho () {
  return { type: INVALIDATE_CONCELHO };
}

export function requestConcelho () {
  return { type: REQUEST_CONCELHO };
}

export function receiveConcelho (data, nutSlug, concelhoSlug, error = null) {
  return { type: RECEIVE_CONCELHO, data: data, nutSlug, concelhoSlug, error, receivedAt: Date.now() };
}

export function fetchConcelho (nutSlug, concelhoSlug) {
  return (dispatch) => {
    dispatch(requestNut());
    fetchAndCacheData()
      .then(national => dispatch(receiveConcelho(national, nutSlug, concelhoSlug)),
        err => dispatch(receiveConcelho(null, null, null, err)));
  };
}

// Map Data

export function requestMapData () {
  return { type: REQUEST_MAP_DATA };
}

export function receiveMapData (data, error = null) {
  return { type: RECEIVE_MAP_DATA, data: data, error, receivedAt: Date.now() };
}

var cacheMapData = null;
export function fetchMapData () {
  return function (dispatch, getState) {
    dispatch(requestMapData());

    if (cacheMapData) {
      return dispatch(receiveMapData(cacheMapData));
    }

    fetchJSON(`assets/data/admin-areas.topojson`)
      .then(json => {
        cacheMapData = json;
        return dispatch(receiveMapData(json));
      }, err => dispatch(receiveMapData(null, err)));
  };
}

// Fetcher function
export function fetchJSON (url, options) {
  return fetch(url, options)
    .then(response => {
      return response.text()
        .then(body => {
          var json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            // eslint-disable-next-line no-console
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
