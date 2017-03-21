'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Dados = React.createClass({
  propTypes: {
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

module.exports = connect(selector, dispatcher)(Dados);
