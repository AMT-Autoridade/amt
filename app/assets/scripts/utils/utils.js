'use strict';
export function percent (value, total, decimals = 2) {
  let val = value / total * 100;
  return round(val, decimals);
}

export function round (value, decimals = 2) {
  if (decimals === 0) {
    decimals = value < 1 ? 2 : 0;
  }
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function format (value, thousandSep = ',', decimalSep = '.') {
  let parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
  return parts.join(decimalSep);
}

export function formatPT (value) {
  return format(value, ' ', ',');
}
