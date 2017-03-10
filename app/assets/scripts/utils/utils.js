'use strict';
export function percent (value, total, decimals = 2) {
  return round(value / total * 100);
}

export function round (value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
