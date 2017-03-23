'use strict';
import React, { PropTypes as T } from 'react';
import * as d3 from 'd3';
import { geoConicConformalPortugal } from 'd3-composite-projections';
import * as topojson from 'topojson';
import _ from 'lodash';

var natTopo = require('../data/admin-areas.json');

var Map = React.createClass({
  propTypes: {
  },

  componentDidMount: function () {
    let islandsPortugal = _.cloneDeep(natTopo.objects.all_areas);
    islandsPortugal.geometries = islandsPortugal.geometries.filter(o => o.properties.type === 'distrito' && parseInt(o.properties.id) > 30);

    const isIn = (id, ids) => {
      return ids.indexOf(parseInt(id)) !== -1;
    };

    const getIsland = (ids) => {
      var island = _.cloneDeep(islandsPortugal);
      island.geometries = island.geometries.filter(o => isIn(o.properties.id, ids));
      return topojson.feature(natTopo, island);
    };

    const baseSize = 374;
    let newSize = 374;

    const s = (v) => newSize * v / baseSize;

    let scaleValue = s(6000);

    let acores = [
      {
        id: 41,
        center: [-25.1312, 36.9762],
        feature: getIsland([41]),
        offset: [s(111), s(72)]
      },
      {
        id: 42,
        center: [-25.4883, 37.7751],
        feature: getIsland([42]),
        offset: [s(101), s(55)]
      },
      {
        id: 43,
        center: [-27.2131, 38.7069],
        feature: getIsland([43]),
        offset: [s(65), s(20)]
      },
      {
        id: 44,
        center: [-28.0151, 39.0533],
        feature: getIsland([44]),
        offset: [s(28), s(1)]
      },
      {
        id: 45,
        center: [-28.0261, 38.6340],
        feature: getIsland([45]),
        offset: [s(34), s(24)]
      },
      {
        id: 4647,
        center: [-28.5370, 38.5138],
        feature: getIsland([46, 47]),
        offset: [s(9), s(37)]
      },
      {
        id: 48,
        center: [-31.2067, 39.4320],
        feature: getIsland([48]),
        offset: [s(-23), s(7)]
      },
      {
        id: 49,
        center: [-31.1188, 39.7030],
        feature: getIsland([49]),
        offset: [s(-8), s(-13)]
      }
    ];

    let madeira = [
      {
        id: 31,
        center: [-16.7473, 32.6220],
        feature: getIsland([31]),
        offset: [s(-101), s(34)]
      },
      {
        id: 32,
        center: [-16.3435, 33.0754],
        feature: getIsland([32]),
        offset: [s(-95), s(-3)]
      }
    ];

    let w = s(200);
    let h = s(780);

    function drawIsland (selection) {
      selection.each(function (d, i) {
        let el = d3.select(this);

        let projection = d3.geoMercator()
          .scale(scaleValue)
          .center(d.center)
          .translate([w + d.offset[0], h + d.offset[1]]);

        let path = d3.geoPath().projection(projection);

        el.append('g')
          .attr('class', d => `island island--${d.id}`)
          .style('transform', 'translate(0px, 0px)')
          .selectAll('path')
          .data(d.feature.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#000')
          .style('stroke-width', o => {
            return '1px';
          })
          .style('fill', o => {
            return 'none';
          });
      });
    }

    var svg = d3.select(this.refs.container).append('svg')
      .attr('width', '100%')
      .attr('height', '1000px');

    svg
      .append('g')
      .attr('class', 'acores')
        .selectAll('g.island')
        .data(acores)
        .enter()
        .call(drawIsland);

    svg
      .append('g')
      .attr('class', 'madeira')
        .selectAll('g.island')
        .data(madeira)
        .enter()
        .call(drawIsland);

//

    let portugal = _.cloneDeep(natTopo.objects.all_areas);
    portugal.geometries = portugal.geometries.filter(o => o.properties.type === 'nut3' && ['PT200', 'PT300'].indexOf(o.properties.id) === -1);

    var projection = d3.geoMercator()
      .scale(scaleValue)
      .center([-8, 38])
      .translate([s(180), s(600)]);

    var path = d3.geoPath()
      .projection(projection);

    var land = topojson.feature(natTopo, portugal);

    svg
      .append('g')
      .attr('class', 'continente')
      .selectAll('path')
      .data(land.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('stroke', '#000')
      .style('stroke-width', '1px')
      .style('fill', 'none');

//
  },

  render: function () {
    return (
      <div className='map-wrapper' ref='container'>
      </div>
    );
  }
});

module.exports = Map;
