'use strict';
var admin = require('./admin-areas.json');

export function getNutBySlug (slug) {
  return admin.results.find(o => o.slug === slug) || false;
}

export function getConcelhoBySlug (nutSlug, slug) {
  let nut = getNutBySlug(nutSlug);
  if (!nut) {
    return false;
  }
  return nut.concelhos.find(o => o.slug === slug) || false;
}

export function onEnterNut (nextState, replace) {
  let nut = nextState.params.nut;
  if (!getNutBySlug(nut)) {
    return replace('/404');
  }
}

export function onEnterConcelho (nextState, replace) {
  let nut = nextState.params.nut;
  let concelho = nextState.params.concelho;
  if (!getConcelhoBySlug(nut, concelho)) {
    return replace('/404');
  }
}
