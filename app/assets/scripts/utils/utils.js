'use strict';
export function percent (value, total, decimals = 2) {
  let val = value / total * 100;
  if (decimals === 0) {
    decimals = val < 1 ? 1 : 0;
  }
  return round(val, decimals);
}

export function round (value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
