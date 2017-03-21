'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

var Concelho = React.createClass({
  propTypes: {
    params: T.object,
  },

  componentDidMount: function () {
  },

  render: function () {
    return (
      <div>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Concelho);
