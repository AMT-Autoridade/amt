'use strict';
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  api: 'https://raw.githubusercontent.com/AMT-Autoridade/taxis',
  // From https://cdn.jsdelivr.net
  // Needed to force the download of text files.
  rawGitApi: 'https://cdn.jsdelivr.net/gh/AMT-Autoridade/taxis',
  startYear: 2006,
  endYear: 2016
};
