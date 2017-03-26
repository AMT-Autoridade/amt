'use strict';
import React, { PropTypes as T } from 'react';
import * as d3 from 'd3';
import { geoConicConformalPortugal } from 'd3-composite-projections';
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

    // d3.select(this.refs.container).call(this.chart
    //   .data(this.props.data)
    //   .axisLineVal(this.props.axisLineVal)
    //   .axisValueMax(this.props.axisLineMax)
    //   .axisValueMin(this.props.axisLineMin)
    //   .numDaysVisible(this.props.numDaysVisible)
    //   .dataUnitSuffix(this.props.dataUnitSuffix));
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
    // if (prevProps.axisLineVal !== this.props.axisLineVal) {
    //   this.chart.axisLineVal(this.props.axisLineVal);
    // }
    // if (prevProps.axisLineMax !== this.props.axisLineMax) {
    //   this.chart.axisValueMax(this.props.axisLineMax);
    // }
    // if (prevProps.axisLineMin !== this.props.axisLineMin) {
    //   this.chart.axisValueMin(this.props.axisLineMin);
    // }
    // if (prevProps.dataUnitSuffix !== this.props.dataUnitSuffix) {
    //   this.chart.dataUnitSuffix(this.props.dataUnitSuffix);
    // }
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

  var _axisLineVal, _axisValueMin, _axisValueMax, _numDaysVisible, _dataUnitSuffix;

  // Pause
  var _pauseUpdate = false;

  // Containters
  var $el, $svg;
  // Var declaration.
  var margin = {top: 0, right: 0, bottom: 0, left: 0};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;

  // Update functions.
  var updateData, upateSize;

  function _calcSize () {
    _width = parseInt($el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt($el.style('height'), 10) - margin.top - margin.bottom;
  }

  const isIn = (id, ids) => ids.indexOf(parseInt(id)) !== -1;

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

  // Scale function based on a predefined size.
  const baseSize = 374;
  const s = (v) => _width * v / baseSize;

  function chartFn (selection) {
    $el = selection;

    var layers = {
      baseGeometries: function () {
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
            offset: [101, 55]
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

        let madeira = [
          {
            id: 31,
            center: [-16.7473, 32.6220],
            feature: getIsland([31]),
            offset: [-101, 34]
          },
          {
            id: 32,
            center: [-16.3435, 33.0754],
            feature: getIsland([32]),
            offset: [-95, -3]
          }
        ];

        const getPathFn = (center, translate) => {
          const scaleValue = s(6000);
          let projection = d3.geoMercator()
            .scale(scaleValue)
            .center(center)
            .translate(translate);

          return d3.geoPath().projection(projection);
        };

        function drawIsland (name) {
          const draw = function (data) {
            let path = getPathFn(data.center, [s(_width / 2) + s(data.offset[0]), s(_height * 0.85) + s(data.offset[1])]);

            return function (sel) {
              return sel.attr('d', path)
                .attr('class', d => `aa--${d.properties.type}`)
                .style('stroke', d => d.properties.type === 'distrito' ? '#fff' : '#fff')
                .style('stroke-width', d => d.properties.type === 'distrito' ? '1.5px' : '0.5px')
                .style('fill', d => d.properties.type === 'distrito' ? '#fff' : 'none')
                .style('fill-opacity', d => d.properties.type === 'distrito' ? 0.32 : 1)
                .style('pointer-events', d => d.properties.type === 'distrito' ? 'all' : 'none')
                .on('mouseover', function (d, i) {
                  d3.select(this).style('cursor', 'pointer');
                  $svg.selectAll(`.${name} .aa--distrito`)
                    .transition()
                    .style('fill-opacity', 0);
                })
                .on('mouseout', function (d, i) {
                  d3.select(this).style('cursor', 'default');
                  $svg.selectAll(`.${name} .aa--distrito`)
                    .transition()
                    .style('fill-opacity', 0.32);
                });
            };
          };

          return function (selection) {
            selection.enter().each(function (d, i) {
              let el = d3.select(this);

              el.append('g')
                .attr('class', d => `island island--${d.id}`)
                .style('transform', 'translate(0px, 0px)')
                .selectAll('path')
                .data(d.feature.features)
                .enter()
                .append('path')
                .call(draw(d));
            });

            selection.each(function (d, i) {
              let el = d3.select(this);

              el.selectAll('path')
                .data(d.feature.features)
                .call(draw(d));
            });
          };
        }

        let $acoresG = $svg.select('g.acores');
        if ($acoresG.empty()) {
          $acoresG = $svg
            .append('g')
            .attr('class', 'acores');
        }

        $acoresG
            .selectAll('g.island')
            .data(acores)
            .call(drawIsland('acores'));

        let $madeiraG = $svg.select('g.madeira');
        if ($madeiraG.empty()) {
          $madeiraG = $svg
            .append('g')
            .attr('class', 'madeira');
        }

        $madeiraG
            .selectAll('g.island')
            .data(madeira)
            .call(drawIsland('madeira'));

        let $portugalG = $svg.select('g.continente');
        if ($portugalG.empty()) {
          $portugalG = $svg
            .append('g')
            .attr('class', 'continente');
        }

        let path = getPathFn([-8, 38], [s(_width / 2) - s(10), s(_height / 2) + s(130)]);
        let land = topojson.feature(_geometries, _portugal);

        let sel = $portugalG.selectAll('path')
          .data(land.features);

        sel.enter()
            .append('path')
          .merge(sel)
            .attr('class', d => `aa--${d.properties.type}`)
            .attr('d', path)
            .style('stroke', d => d.properties.type === 'nut3' ? '#fff' : '#fff')
            .style('stroke-width', d => d.properties.type === 'nut3' ? '1.5px' : '0.5px')
            .style('fill', d => d.properties.type === 'nut3' ? '#fff' : 'none')
            .style('fill-opacity', d => d.properties.type === 'nut3' ? 0.32 : 1)
            .style('pointer-events', d => d.properties.type === 'nut3' ? 'all' : 'none')
            .on('mouseover', function (d, i) {
              d3.select(this).style('cursor', 'pointer');
              d3.select(this)
                .transition()
                .style('fill-opacity', 0);
            })
            .on('mouseout', function (d, i) {
              d3.select(this).style('cursor', 'default');
              d3.select(this)
                .transition()
                .style('fill-opacity', 0.32);
            });
      },

      municipioColors: function () {
        d3.selectAll('.aa--concelho').each(function () {
          let el = d3.select(this);
          let d = el.datum();
          let bucket = _data.find(o => o.id === parseInt(d.properties.id));
          el.style('fill', bucket ? bucket.color : 'none');
        });
      }
    };

    upateSize = function () {
      $svg
        .attr('width', _width + margin.left + margin.right)
        .attr('height', _height + margin.top + margin.bottom);

      // DEBUG:
      // To view the area taken by the #clip rect.
      // $dataCanvas.select('.data-canvas-shadow')
      //   .attr('x', -margin.left)
      //   .attr('y', -margin.top)
      //   .attr('width', _width + margin.left)
      //   .attr('height', _height + margin.top + margin.bottom);

      // Redraw.
      layers.baseGeometries();
      layers.municipioColors();
      // layers.line();
      // layers.minMax();
      // layers.days();
      // layers.xAxis();
      // layers.yAxis();
    };

    updateData = function () {
      if (!_data || _pauseUpdate) {
        return;
      }

      // Redraw.
      layers.municipioColors();
      // layers.line();
      // layers.minMax();
      // layers.days();
      // layers.xAxis();
      // layers.yAxis();
    };

    // -----------------------------------------------------------------
    // INIT.
    $svg = $el.append('svg')
      .attr('class', 'chart')
      .style('display', 'block');

    // DEBUG:
    // To view the area taken by the #clip rect.
    // $dataCanvas.append('rect')
    //   .attr('class', 'data-canvas-shadow')
    //   .style('fill', '#000')
    //   .style('opacity', 0.326);

    _calcSize();
    upateSize();
    updateData();
    console.log('_width', _width);
    console.log('_height', _height);
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

    // if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.axisLineVal = function (d) {
    if (!arguments.length) return _axisLineVal;
    _axisLineVal = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.axisValueMin = function (d) {
    if (!arguments.length) return _axisValueMin;
    _axisValueMin = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.axisValueMax = function (d) {
    if (!arguments.length) return _axisValueMax;
    _axisValueMax = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.numDaysVisible = function (d) {
    if (!arguments.length) return _numDaysVisible;
    _numDaysVisible = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.dataUnitSuffix = function (d) {
    if (!arguments.length) return _dataUnitSuffix;
    _dataUnitSuffix = d;
    if (typeof updateData === 'function') updateData();
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
