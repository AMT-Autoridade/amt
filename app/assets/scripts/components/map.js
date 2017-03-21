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
    let acores = _.cloneDeep(natTopo.objects.all_areas);
    acores.geometries = acores.geometries.filter(o => o.properties.type === 'distrito' && parseInt(o.properties.id) > 40);

    const isIn = (id, ids) => {
      return ids.indexOf(parseInt(id)) !== -1;
    };

    const getIsland = (ids) => {
      var island = _.cloneDeep(acores);
      island.geometries = island.geometries.filter(o => isIn(o.properties.id, ids));
      return topojson.feature(natTopo, island);
    };

    let islands = [
      {
        id: 41,
        center: [-25.1312, 36.9762],
        feature: getIsland([41]),
        offset: [76, 52]
      },
      {
        id: 42,
        center: [-25.4883, 37.7751],
        feature: getIsland([42]),
        offset: [66, 35]
      },
      {
        id: 43,
        center: [-27.2131, 38.7069],
        feature: getIsland([43]),
        offset: [30, 0]
      },
      {
        id: 44,
        center: [-28.0151, 39.0533],
        feature: getIsland([44]),
        offset: [-7, -19]
      },
      {
        id: 45,
        center: [-28.0261, 38.6340],
        feature: getIsland([45]),
        offset: [-1, 4]
      },
      {
        id: 4647,
        center: [-28.5370, 38.5138],
        feature: getIsland([46, 47]),
        offset: [-26, 17]
      },
      {
        id: 48,
        center: [-31.2067, 39.4320],
        feature: getIsland([48]),
        offset: [-58, -13]
      },
      {
        id: 49,
        center: [-31.1188, 39.7030],
        feature: getIsland([49]),
        offset: [-43, -33]
      }
    ];

    let w = 200;
    let h = 780;

    function drawIsland (selection) {
      selection.each(function (d, i) {
        let el = d3.select(this);

        let projection = d3.geoMercator()
          .scale(6000)
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
        .data(islands)
        .enter()
        .call(drawIsland);

//

    let portugal = _.cloneDeep(natTopo.objects.all_areas);
    portugal.geometries = portugal.geometries.filter(o => o.properties.type === 'nut3' && ['PT200', 'PT300'].indexOf(o.properties.id) === -1);

    var projection = d3.geoMercator()
      .scale(6000)
      .center([-8, 38])
      .translate([180, 600]);

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

    let madeira = _.cloneDeep(natTopo.objects.all_areas);
    madeira.geometries = madeira.geometries.filter(o => o.properties.type === 'distrito' && parseInt(o.properties.id) >= 30 && parseInt(o.properties.id) < 40);

    var projectionM = d3.geoMercator()
      .scale(6000)
      .center([-16.7157, 32.9027])
      .translate([80, 780]);

    var pathM = d3.geoPath()
      .projection(projectionM);

    var landM = topojson.feature(natTopo, madeira);

    svg
      .append('g')
      .attr('class', 'madeira')
      .selectAll('path')
      .data(landM.features)
      .enter()
      .append('path')
      .attr('d', pathM)
      .style('stroke', '#000')
      .style('stroke-width', '1px')
      .style('fill', 'none');
  },

  render: function () {
    return (
      <div className='map-wrapper' ref='container'>
      </div>
    );
  }
});

module.exports = Map;
