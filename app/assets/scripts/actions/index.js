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
}

export const REQUEST_NATIONAL = 'REQUEST_NATIONAL';
export const RECEIVE_NATIONAL = 'RECEIVE_NATIONAL';
export const INVALIDATE_NATIONAL = 'INVALIDATE_NATIONAL';

export const REQUEST_NUT = 'REQUEST_NUT';
export const RECEIVE_NUT = 'RECEIVE_NUT';
export const INVALIDATE_NUT = 'INVALIDATE_NUT';

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
  // Fake data load.
  return (dispatch) => {
    dispatch(requestNational());
    fetchAndCacheData()
      .then(national => dispatch(receiveNational(national)));
  };
  // return getAndDispatch(`${config.api}/National`, requestNational, receiveNational);
}

// National

export function invalidateNut () {
  return { type: INVALIDATE_NUT };
}

export function requestNut () {
  return { type: REQUEST_NUT };
}

export function receiveNut (data, error = null) {
  return { type: RECEIVE_NUT, data: data, error, receivedAt: Date.now() };
}

export function fetchNut (nut) {
  // Fake data load.
  return (dispatch) => {
    dispatch(requestNut());
    fetchAndCacheData()
      .then(national => national.results.find(o => o.slug === nut))
      .then(nut => dispatch(receiveNut(nut)));
  };
  // return getAndDispatch(`${config.api}/National`, requestNational, receiveNational);
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
