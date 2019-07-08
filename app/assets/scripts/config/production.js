'use strict';
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  api: 'https://raw.githubusercontent.com/olafveerman/taxis',
  // From https://rawgit.com/
  // Needed to force the download of text files.
  rawGitApi: 'https://cdn.rawgit.com/olafveerman/taxis',
  startYear: 2006,
  endYear: 2016
};
