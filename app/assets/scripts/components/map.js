'use strict';
import React, { PropTypes as T } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import _ from 'lodash';

var Map = React.createClass({
  propTypes: {
    className: T.string,
    geometries: T.object,
    data: T.array
  },

  chart: null,

  onWindowResize: function () {
    console.log('resize');
    this.chart.checkSize();
  },

  componentDidMount: function () {
    // console.log('LineChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = Chart();

    d3.select(this.refs.container).call(this.chart
      .geometries(this.props.geometries)
      .data(this.props.data)
    );
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function (prevProps/* prevState */) {
    this.chart.pauseUpdate();
    if (prevProps.geometries !== this.props.geometries) {
      this.chart.geometries(this.props.geometries);
    }
    if (prevProps.data !== this.props.data) {
      this.chart.data(this.props.data);
    }
    this.chart.continueUpdate();
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = Map;

var Chart = function (options) {
  // Data related variables for which we have getters and setters.
  var _data = null;
  var _geometries = null;

  // Islands.
  var _islandsPortugal = null;
  // Continental Portugal.
  var _portugal = null;

  // Pause
  var _pauseUpdate = false;

  // Containers
  var $el, $svg;
  // Var declaration.
  var margin = {top: 0, right: 0, bottom: 0, left: 0};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Geo scale.
  var _projectionScaleValue;

  // Update functions.
  var updateData, upateSize;

  function _calcSize () {
    _width = parseInt($el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt($el.style('height'), 10) - margin.top - margin.bottom;
  }

  /**
   * Checks whether the id is in a list of ids.
   * @param  {String} id  Id to check
   * @param  {Array} ids List of numeric ids
   * @return {boolean}
   */
  const isIn = (id, ids) => ids.indexOf(parseInt(id)) !== -1;

  /**
   * Returns the topojson with only the features with the given ids.
   * @param  {Array} ids  ids of the features to find
   * @return {Object}    Topojson
   */
  const getIsland = (ids) => {
    var island = _.cloneDeep(_islandsPortugal);
    island.geometries = island.geometries.filter(o => {
      let id = id = o.properties.id;
      if (id.length === 4) {
        id = id.substring(0, 2);
      }
      return isIn(id, ids);
    });
    return topojson.feature(_geometries, island);
  };

  // The offset values must be scaled according the the projection
  // scale value.
  const scalar = (v) => _projectionScaleValue * v / 6439.143067978895;

  /**
   * Returns the path for drawing the islands taking into account their
   * new projection.
   * @param  {array} center    New center
   * @param  {array} translate Offset from the new center.
   * @return {Function}        Path drawing function
   */
  const getPathFn = (center, translate) => {
    const tw = _width / 2;
    // The vertical value for the translate is computed from the width.
    const th = 125 / 114 * _width;

    const projection = d3.geoMercator()
      .scale(_projectionScaleValue)
      .center(center)
      .translate([tw + scalar(translate[0]), th + scalar(translate[1])]);

    return d3.geoPath().projection(projection);
  };

  // Make charts reusable!
  // Helper function to draw a group of features. Originally used to draw the
  // different archipelagos, but extended to include the main land.
  // Usage: .call(drawFeatureGroup('name'))
  // opts = {
  //   name: // Name for the feature group
  //   type: // What this refers to (island|main)
  // }
  function drawFeatureGroup (opts) {
    let {name, type} = opts;
    let aaLevel = type === 'island' ? 'distrito' : 'nut3';
    // Return a function to handle each individual island.
    // Wrapped in a closure to include path variables.
    function drawFeature (data) {
      let additionalHOffset = type === 'island' ? 400 : 0;
      let path = getPathFn(data.center, [data.offset[0], data.offset[1] + additionalHOffset]);

      return function (sel) {
        return sel.attr('d', path)
          .attr('class', d => `aa--${d.properties.type}`)
          .style('stroke', d => d.properties.type === aaLevel ? '#fff' : '#fff')
          .style('stroke-width', d => d.properties.type === aaLevel ? '1.5px' : '0.5px')
          .style('fill', d => d.properties.type === aaLevel ? '#fff' : 'none')
          .style('fill-opacity', d => d.properties.type === aaLevel ? 0.32 : 1)
          .style('pointer-events', d => d.properties.type === aaLevel ? 'all' : 'none')
          .on('mouseover', function (d, i) {
            d3.select(this).style('cursor', 'pointer');
            let el = type === 'island' ? $svg.selectAll(`.${name} .aa--distrito`) : d3.select(this);
            el.transition()
              .style('fill-opacity', 0);
          })
          .on('mouseout', function (d, i) {
            d3.select(this).style('cursor', 'default');
            let el = type === 'island' ? $svg.selectAll(`.${name} .aa--distrito`) : d3.select(this);
            el.transition()
              .style('fill-opacity', 0.32);
          });
      };
    }

    // Returns a function to draw the archipelago.
    return function (selection) {
      selection.enter().each(function (d, i) {
        let el = d3.select(this);

        el.append('g')
          .attr('class', d => `feature feature--${d.id}`)
          .selectAll('path')
          .data(d.feature.features)
          .enter()
          .append('path')
          .call(drawFeature(d));
      });

      selection.each(function (d, i) {
        let el = d3.select(this);

        el.selectAll('path')
          .data(d.feature.features)
          .call(drawFeature(d));
      });
    };
  }

  function chartFn (selection) {
    $el = selection;

    var layers = {
      baseGeometries: function () {
        // Açores and their coordinates to allow for reprojetion.
        let acores = [
          {
            id: 41,
            center: [-25.1312, 36.9762],
            feature: getIsland([41]),
            offset: [111, 72]
          },
          {
            id: 42,
            center: [-25.4883, 37.7751],
            feature: getIsland([42]),
            offset: [103, 53]
          },
          {
            id: 43,
            center: [-27.2131, 38.7069],
            feature: getIsland([43]),
            offset: [65, 20]
          },
          {
            id: 44,
            center: [-28.0151, 39.0533],
            feature: getIsland([44]),
            offset: [28, 1]
          },
          {
            id: 45,
            center: [-28.0261, 38.6340],
            feature: getIsland([45]),
            offset: [34, 24]
          },
          {
            id: 4647,
            center: [-28.5370, 38.5138],
            feature: getIsland([46, 47]),
            offset: [9, 37]
          },
          {
            id: 48,
            center: [-31.2067, 39.4320],
            feature: getIsland([48]),
            offset: [-23, 7]
          },
          {
            id: 49,
            center: [-31.1188, 39.7030],
            feature: getIsland([49]),
            offset: [-8, -13]
          }
        ];

        // Madeira and their coordinates to allow for reprojetion.
        let madeira = [
          {
            id: 31,
            center: [-16.7473, 32.6220],
            feature: getIsland([31]),
            offset: [-85, 50]
          },
          {
            id: 32,
            center: [-16.3435, 33.0754],
            feature: getIsland([32]),
            offset: [-80, 13]
          }
        ];

        // Add group for Açores if it doesn't exist.
        let $acoresG = $svg.select('g.acores');
        if ($acoresG.empty()) {
          $acoresG = $svg
            .append('g')
            .attr('class', 'acores');
        }

        // Draw Açores.
        $acoresG
            .selectAll('g.feature')
            .data(acores)
            .call(drawFeatureGroup({name: 'acores', type: 'island'}));

        // Add group for Madeira if it doesn't exist.
        let $madeiraG = $svg.select('g.madeira');
        if ($madeiraG.empty()) {
          $madeiraG = $svg
            .append('g')
            .attr('class', 'madeira');
        }

        // Draw Madeira
        $madeiraG
            .selectAll('g.feature')
            .data(madeira)
            .call(drawFeatureGroup({name: 'madeira', type: 'island'}));

        // Add group for Portugal if it doesn't exist.
        let $portugalG = $svg.select('g.continente');
        if ($portugalG.empty()) {
          $portugalG = $svg
            .append('g')
            .attr('class', 'continente');
        }

        // Draw continental Portugal.
        $portugalG
            .selectAll('g.feature')
            .data([{
              id: 1,
              center: [-8.2245, 39.3999],
              feature: topojson.feature(_geometries, _portugal),
              offset: [-42, 0]
            }])
            .call(drawFeatureGroup({name: 'continente', type: 'main'}));
      },

      municipioColors: function () {
        $svg.selectAll('.aa--concelho').each(function () {
          let el = d3.select(this);
          let d = el.datum();
          let bucket = _data.find(o => o.id === parseInt(d.properties.id));
          el.style('fill', bucket ? bucket.color : 'none');
        });
      },

      islandsBounds: function () {
        let bounds = $svg.selectAll('.island-bound')
          .data([
            {
              x: 130,
              y: 785,
              width: 210,
              height: 110
            },
            {
              x: 20,
              y: 785,
              width: 110,
              height: 110
            }
          ]);

        bounds.enter()
          .append('rect')
          .attr('class', 'island-bound')
          .style('stroke-width', '1px')
          .style('stroke', '#ddd')
          .style('fill', 'none')
          .merge(bounds)
            .attr('x', d => scalar(d.x))
            .attr('y', d => scalar(d.y))
            .attr('width', d => scalar(d.width))
            .attr('height', d => scalar(d.height));
      }
    };

    upateSize = function () {
      $svg
        .attr('width', _width + margin.left + margin.right)
        .attr('height', _height + margin.top + margin.bottom);

      // Compute the scale value by using fitSize on the country.
      _projectionScaleValue = d3.geoMercator()
        .fitSize([_width, _height], topojson.feature(_geometries, _portugal))
        .scale();

      // console.log('_width', _width);
      // console.log('_height', _height);
      // console.log('_projectionScaleValue', _projectionScaleValue);
      // Redraw.
      layers.baseGeometries();
      layers.municipioColors();
      layers.islandsBounds();
    };

    updateData = function () {
      if (!_data || _pauseUpdate) {
        return;
      }

      // Redraw.
      layers.municipioColors();
      layers.islandsBounds();
    };

    // -----------------------------------------------------------------
    // INIT.
    $svg = $el.append('svg')
      .attr('class', 'chart')
      .style('display', 'block');

    _calcSize();
    upateSize();
    updateData();
  }

  chartFn.checkSize = function () {
    _calcSize();
    upateSize();
    return chartFn;
  };

  chartFn.destroy = function () {
    // Cleanup.
  };

  // --------------------------------------------
  // Getters and setters.
  chartFn.data = function (d) {
    if (!arguments.length) return _data;
    _data = _.cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.geometries = function (d) {
    if (!arguments.length) return _geometries;
    _geometries = _.cloneDeep(d);
    _islandsPortugal = _.cloneDeep(_geometries.objects.all_areas);
    _islandsPortugal.geometries = _islandsPortugal.geometries.filter(o => {
      if (o.properties.type === 'concelho') {
        if (o.properties.id.length !== 4) {
          return false;
        }
        return parseInt(o.properties.id.substring(0, 2)) > 30;
      }
      return o.properties.type === 'distrito' && parseInt(o.properties.id) > 30;
    });

    _portugal = _.cloneDeep(_geometries.objects.all_areas);
    _portugal.geometries = _portugal.geometries.filter(o => {
      if (o.properties.type === 'concelho') {
        let id = o.properties.id.substring(0, o.properties.id.length === 3 ? 1 : 2);
        return id < 30;
      }
      if (o.properties.type === 'nut3') {
        return ['PT200', 'PT300'].indexOf(o.properties.id) === -1;
      }
    });

    return chartFn;
  };

  chartFn.pauseUpdate = function () {
    _pauseUpdate = true;
    return chartFn;
  };

  chartFn.continueUpdate = function () {
    _pauseUpdate = false;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  return chartFn;
};
