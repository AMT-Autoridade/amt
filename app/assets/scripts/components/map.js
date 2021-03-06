'use strict';
import React, { PropTypes as T } from 'react';
import ReactDOMServer from 'react-dom/server';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import _ from 'lodash';

import Popover from '../utils/popover';

// Cache for some values that are commom for all the maps but take some time
// to process.
var dataCache = {
  _projectionScaleValue: {}
};

// Matrix with the concelhos that belong to each nut.
const concelhosMatrix = [{"id":"PT16D","concelhos":[101,102,103,105,108,110,112,114,115,117,118]},{"id":"PT11A","concelhos":[104,107,109,113,116,119,1304,1306,1308,1310,1312,1313,1314,1315,1316,1317,1318]},{"id":"PT11C","concelhos":[106,305,1301,1302,1303,1305,1307,1309,1311,1804,1813]},{"id":"PT16E","concelhos":[111,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,1808]},{"id":"PT184","concelhos":[201,202,203,204,205,206,207,208,209,210,212,213,214]},{"id":"PT181","concelhos":[211,1501,1505,1509,1513]},{"id":"PT112","concelhos":[301,302,303,306,310,313]},{"id":"PT119","concelhos":[304,307,308,309,311,312,314,1705]},{"id":"PT11E","concelhos":[401,402,405,406,407,408,410,411,412]},{"id":"PT11D","concelhos":[403,404,409,914,1701,1704,1707,1708,1710,1711,1714,1801,1805,1807,1812,1815,1818,1819,1820]},{"id":"PT16J","concelhos":[501,503,504,902,903,904,905,906,907,908,909,910,911,912,913]},{"id":"PT16H","concelhos":[502,505,506,507,508,511]},{"id":"PT16I","concelhos":[509,510,1401,1402,1408,1410,1411,1413,1417,1418,1419,1420,1421]},{"id":"PT187","concelhos":[701,702,703,704,705,706,707,708,709,710,711,712,713,714]},{"id":"PT150","concelhos":[801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816]},{"id":"PT16G","concelhos":[901,1802,1803,1806,1809,1810,1811,1814,1816,1817,1821,1822,1823,1824]},{"id":"PT16B","concelhos":[1001,1005,1006,1011,1012,1014,1101,1102,1104,1108,1112,1113]},{"id":"PT16F","concelhos":[1002,1003,1004,1007,1008,1009,1010,1013,1015,1016]},{"id":"PT185","concelhos":[1103,1403,1404,1405,1406,1407,1409,1412,1414,1415,1416]},{"id":"PT170","concelhos":[1105,1106,1107,1109,1110,1111,1114,1115,1116,1502,1503,1504,1506,1507,1508,1510,1511,1512]},{"id":"PT186","concelhos":[1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1211,1212,1213,1214,1215]},{"id":"PT111","concelhos":[1601,1602,1603,1604,1605,1606,1607,1608,1609,1610]},{"id":"PT11B","concelhos":[1702,1703,1706,1709,1712,1713]},{"id":"PT200","concelhos":[4101,4201,4202,4203,4204,4205,4206,4301,4302,4401,4501,4502,4601,4602,4603,4701,4801,4802,4901]},{"id":"PT300","concelhos":[3101,3102,3103,3104,3105,3106,3107,3108,3109,3110,3201]}]; // eslint-disable-line

var Map = React.createClass({
  propTypes: {
    className: T.string,
    geometries: T.object,
    data: T.array,
    nut: T.string,
    concelho: T.number,
    onClick: T.func,
    popoverContent: T.func,
    overlayInfoContent: T.func
  },

  ptMap: null,

  onWindowResize: function () {
    this.ptMap.checkSize();
  },

  componentDidMount: function () {
    // console.log('PtMap componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.ptMap = PtMap();

    d3.select(this.refs.container).call(this.ptMap
      .geometries(this.props.geometries)
      .data(this.props.data)
      .nut(this.props.nut)
      .onClick(this.props.onClick)
      .popoverContent(this.props.popoverContent)
      .overlayInfoContent(this.props.overlayInfoContent)
      .concelho(this.props.concelho)
    );
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.onWindowResize);
    this.ptMap.destroy();
  },

  componentDidUpdate: function (prevProps/* prevState */) {
    this.ptMap.pauseUpdate();
    if (prevProps.geometries !== this.props.geometries) {
      this.ptMap.geometries(this.props.geometries);
    }
    if (prevProps.data !== this.props.data) {
      this.ptMap.data(this.props.data);
    }
    if (prevProps.nut !== this.props.nut) {
      this.ptMap.nut(this.props.nut);
    }
    if (prevProps.onClick !== this.props.onClick) {
      this.ptMap.onClick(this.props.onClick);
    }
    if (prevProps.popoverContent !== this.props.popoverContent) {
      this.ptMap.popoverContent(this.props.popoverContent);
    }
    if (prevProps.overlayInfoContent !== this.props.overlayInfoContent) {
      this.ptMap.overlayInfoContent(this.props.overlayInfoContent);
    }
    if (prevProps.concelho !== this.props.concelho) {
      this.ptMap.concelho(this.props.concelho);
    }
    this.ptMap.continueUpdate();
  },

  render: function () {
    return (
      // eslint-disable-next-line react/no-string-refs
      <div className={this.props.className} ref='container' />
    );
  }
});

module.exports = Map;

var PtMap = function (options) {
  //
  // Note: Throughout the code there will be some weird numbers and ratios.
  // These values were computed by manually checking what the optimal values
  // were for a certain sizes and then coming up with the ratio using a rule
  // of three since the scale is linear.
  //

  // Data related variables for which we have getters and setters.
  var _data = null;
  var _topology = null;

  // Continental Portugal.
  var _portugalFeature = null;

  // Pause. Ensure that all data is added before redrawing stuff.
  var _pauseUpdate = false;

  // Selected nut and concelho, if any..
  var _nut, _concelho;

  // Interactivity. Callback functions
  var _onClickFn, _popoverContentFn, _overlayInfoContentFn;

  // Containers
  var $el, $svg, $aaOverlayInfo;
  // Var declaration.
  var margin = { top: 0, right: 0, bottom: 0, left: 0 };
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;

  // Update functions.
  var updateData, upateSize;

  // Size and position of the overlay circle.
  var _overlayAAr, _overlayAAcx, _overlayAAcy;

  // Base color for the aa.
  var DEFAULT_COLOR = '#f2f2f2';

  // Geo scale.
  var _projectionScaleValue;
  // The values must be scaled according to the projection scale value.
  // Construct a scale using the given value.
  const scalarFactory = (scaleValue) => (v) => scaleValue * v / 6439.143067978895;
  // Default scalar using the global projection scale value. Created when
  // computing the scale value.
  var scalar;

  var chartPopover = new Popover();

  function _calcSize () {
    _width = parseInt($el.style('width'), 10) - margin.left - margin.right;
    // Use a ratio to set the height.
    _height = 73 / 30 * _width;
    $el.style('height', `${_height}px`);
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
    var topoIsland = {
      type: 'GeometryCollection',
      geometries: _topology.objects.all_areas.geometries.filter(o => {
        let id = o.properties.id;
        if (id.length === 4) {
          id = id.substring(0, 2);
        }
        return isIn(id, ids);
      })
    };

    return topojson.feature(_topology, topoIsland);
  };

  // Açores Feature and their coordinates to allow for reprojection.
  const getAcoresFC = () => [
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

  // Madeira Feature and their coordinates to allow for reprojection.
  const getMadeiraFC = () => [
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

  /**
   * Returns the path for drawing the islands taking into account their
   * new projection.
   * @param  {array} center    New center
   * @param  {array} translate Offset from the new center.
   * @param  {number} scale    Map scale to use when creating the scalar function
   *                           Default to `_projectionScaleValue`.
   *                           See `scalarFactory()` for more info
   * @return {Function}        Path drawing function
   */
  const getPathFn = (center, translate, scale = _projectionScaleValue) => {
    const tw = _width / 2;
    // The vertical value for the translate is computed from the width.
    const th = 125 / 114 * _width;

    const scalar = scalarFactory(scale);

    const projection = d3.geoMercator()
      .scale(scale)
      .center(center)
      .translate([tw + scalar(translate[0]), th + scalar(translate[1])]);

    return d3.geoPath().projection(projection);
  };

  const getNutId = (d) => {
    if (d.properties.type === 'nut3') {
      return d.properties.id;
    } else if (d.properties.type === 'distrito') {
      let id = parseInt(d.properties.id);
      return id >= 40 ? 'PT200' : 'PT300';
    }
  };

  const getElementPos = (d3El) => {
    let _thisEl = d3El.node();
    let bbox = _thisEl.getBBox();
    let matrix = _thisEl.getScreenCTM()
      .translate(bbox.x + bbox.width / 2, bbox.y);
    let posX = window.pageXOffset + matrix.e;
    let posY = window.pageYOffset + matrix.f;

    return { posX, posY };
  };

  const showTooltip = (d3El, data) => {
    if (_popoverContentFn) {
      let { posX, posY } = getElementPos(d3El);
      chartPopover.setContent(_popoverContentFn(data)).show(posX, posY);
    }
  };

  const hideTooltip = () => {
    chartPopover.hide();
  };

  const getConcelhoColor = (id) => {
    if (_concelho) {
      return _concelho === id ? '#f8781f' : DEFAULT_COLOR;
    } else {
      // Get the color from the bucket.
      let bucket = _data ? _data.find(o => o.id === id) : null;
      return bucket ? bucket.color : DEFAULT_COLOR;
    }
  };

  const concelhoInNut = (nutId, concelhoId) => {
    let nut = concelhosMatrix.find(c => c.id === nutId);
    return nut.concelhos.indexOf(parseInt(concelhoId)) !== -1;
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
    let { name, type } = opts;
    // Return a function to handle each individual island.
    // Wrapped in a closure to include path variables.
    function drawFeature (data) {
      let additionalHOffset = type === 'island' ? 400 : 0;
      let path = getPathFn(data.center, [data.offset[0], data.offset[1] + additionalHOffset]);

      return function drawFeatureSel (sel) {
        let selConcelho = sel.filter(d => d.properties.type === 'concelho');
        let selNuts = sel.filter(d => d.properties.type === 'nut3');
        let selDistrito = sel.filter(d => d.properties.type === 'distrito');

        // Concelhos.
        selConcelho
          .attr('d', path)
          .attr('class', d => `aa--${d.properties.type}`)
          .attr('stroke', '#fff')
          .attr('stroke-width', '0.1px')
          .attr('fill', d => {
            if (_concelho) return DEFAULT_COLOR;
            let bucket = _data ? _data.find(o => o.id === parseInt(d.properties.id)) : null;
            let color = bucket ? bucket.color : DEFAULT_COLOR;
            return color;
          })
          .attr('fill-opacity', 1)
          .style('pointer-events', d => {
            if (_concelho) return 'none';
            if (_nut) {
              return concelhoInNut(_nut, d.properties.id) ? 'all' : 'none';
            }
            return 'none';
          })
          .on('mouseover', function (d, i) {
            d3.select(this).style('cursor', 'pointer');

            let id = parseInt(d.properties.id);
            showTooltip(d3.select(this), { type: 'concelho', id: id });
            // Get the correct color form the concelho id.
            let color = getConcelhoColor(id);

            d3.select(this).transition()
              .attr('fill', d3.color(color).darker(1));
          })
          .on('mouseout', function (d, i) {
            hideTooltip();
            d3.select(this).style('cursor', 'default');
            // Get the correct color form the concelho id.
            let color = getConcelhoColor(parseInt(d.properties.id));

            d3.select(this).transition()
              .attr('fill', color);
          })
          .on('click', function (d, i) {
            if (!_onClickFn) return;
            let id = parseInt(d.properties.id);
            if (id) _onClickFn({ type: 'concelho', id });
          });

        // Nuts.
        selNuts
          .attr('d', path)
          .attr('class', d => `aa--${d.properties.type} aa--${d.properties.id}`)
          .attr('stroke', '#fff')
          .attr('stroke-width', '1px')
          .attr('fill', d => {
            // if (_nut) {
            //   return '#fff';
            // }
            return '#000';
          })
          .attr('fill-opacity', d => {
            if (_concelho) return 0;
            if (_nut) {
              // return getNutId(d) === _nut ? 0 : 0.80;
              return getNutId(d) === _nut ? 0 : 0;
            }
            return 0;
          })
          .style('pointer-events', d => {
            if (_concelho) return 'none';
            if (_nut) {
              return getNutId(d) === _nut ? 'none' : 'all';
            }
            return 'all';
          })
          .on('mouseover', function (d, i) {
            d3.select(this).style('cursor', 'pointer');

            showTooltip(d3.select(this), { type: 'nut3', id: getNutId(d) });
            d3.select(this).transition()
              .attr('fill-opacity', d => {
                // When there's a nut selected the background is white
                // so on over we want to get rid of it.
                // When no nut is selected, the background is black and
                // transparent so we want to darken it.
                // return _nut ? 0 : 0.20;
                return _nut ? 0.20 : 0.20;
              });
          })
          .on('mouseout', function (d, i) {
            d3.select(this).style('cursor', 'default');
            hideTooltip();
            d3.select(this).transition()
              .attr('fill-opacity', d => {
                // When there's a nut selected the background is white
                // so on "out" we want it to be a bit visible.
                // When no nut is selected, the background is black so we
                // want to get rid of it.
                // return _nut ? 0.80 : 0;
                return _nut ? 0 : 0;
              });
          })
          .on('click', function (d, i) {
            if (!_onClickFn) return;
            let id = getNutId(d);
            if (id) _onClickFn({ type: 'nut3', id });
          });

        // Distritos.
        selDistrito
          .attr('d', path)
          .attr('class', d => `aa--${d.properties.type}`)
          .attr('stroke', '#fff')
          .attr('stroke-width', '1px')
          .attr('fill', d => {
            // if (_nut) {
            //   return '#fff';
            // }
            return '#000';
          })
          .attr('fill-opacity', d => {
            if (_concelho) return 0;
            if (_nut) {
              // return getNutId(d) === _nut ? 0 : 0.80;
              return getNutId(d) === _nut ? 0 : 0;
            }
            return 0;
          })
          .style('pointer-events', d => {
            if (_concelho) return 'none';
            if (_nut) {
              return getNutId(d) === _nut ? 'none' : 'all';
            }
            return 'all';
          })
          .on('mouseover', function (d, i) {
            d3.select(this).style('cursor', 'pointer');

            showTooltip(d3.select(this), { type: 'nut3', id: getNutId(d) });
            $svg.selectAll(`.${name} .aa--distrito`).transition()
              .attr('fill-opacity', d => {
                // When there's a nut selected the background is white
                // so on over we want to get rid of it.
                // When no nut is selected, the background is black and
                // transparent so we want to darken it.
                // return _nut ? 0 : 0.20;
                return _nut ? 0.20 : 0.20;
              });
          })
          .on('mouseout', function (d, i) {
            d3.select(this).style('cursor', 'default');
            hideTooltip();
            $svg.selectAll(`.${name} .aa--distrito`).transition()
              .attr('fill-opacity', d => {
                // When there's a nut selected the background is white
                // so on "out" we want it to be a bit visible.
                // When no nut is selected, the background is black so we
                // want to get rid of it.
                // return _nut ? 0.80 : 0;
                return _nut ? 0 : 0;
              });
          })
          .on('click', function (d, i) {
            if (!_onClickFn) return;
            let id = getNutId(d);
            if (id) _onClickFn({ type: 'nut3', id });
          });
      };
    }

    // Returns a function to draw the archipelago.
    return function drawFeatureGroupSel (selection) {
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

  // Make charts reusable!
  // Similar to `drawFeatureGroup` but for the overlay.
  function drawFeatureGroupOverlay (opts) {
    let { type, groupOffset, groupScale } = opts;
    let aaLevel = type === 'island' ? 'distrito' : 'nut3';
    // Return a function to handle each individual island.
    // Wrapped in a closure to include path variables.
    function drawFeature (data) {
      let path;
      if (type === 'island') {
        path = getPathFn(data.center, [data.offset[0] + groupOffset[0], data.offset[1] + groupOffset[1]], groupScale);
      } else {
        // Calculate path function the size of the circle for the projection.
        let circleDiameter = _overlayAAr * 2;
        let inscribedSqr = circleDiameter / Math.sqrt(2);

        let bounds = [
          [_overlayAAcx - inscribedSqr / 2, _overlayAAcy - inscribedSqr / 2],
          [_overlayAAcx + inscribedSqr / 2, _overlayAAcy + inscribedSqr / 2]
        ];

        const projection = d3.geoMercator()
          .fitExtent(bounds, opts.nutTopo);

        path = d3.geoPath().projection(projection);
        // END path calculation.
      }

      return function (sel) {
        return sel.attr('d', path)
          .attr('class', d => `aa--${d.properties.type}`)
          .attr('stroke', d => d.properties.type === 'distrito' ? 'none' : '#fff')
          .attr('stroke-width', d => d.properties.type === aaLevel ? '1px' : '0.1px')
          .attr('fill', d => {
            if (d.properties.type !== 'concelho') return 'none';
            let id = parseInt(d.properties.id);

            // Get the correct color form the concelho id.
            return getConcelhoColor(id);
          })
          .style('pointer-events', d => d.properties.type === 'concelho' ? 'all' : 'none')
          .on('mouseover', function (d, i) {
            let id = parseInt(d.properties.id);
            showTooltip(d3.select(this), { type: 'concelho', id });

            // Get the correct color form the concelho id.
            let color = getConcelhoColor(id);

            d3.select(this)
              .style('cursor', 'pointer')
              .transition()
              .attr('fill', d3.color(color).darker(1));
          })
          .on('mouseout', function (d, i) {
            let id = parseInt(d.properties.id);
            hideTooltip();

            // Get the correct color form the concelho id.
            let color = getConcelhoColor(id);

            d3.select(this)
              .style('cursor', 'default')
              .transition()
              .attr('fill', color);
          })
          .on('click', function (d, i) {
            if (!_onClickFn) return;
            let id = parseInt(d.properties.id);
            if (id) _onClickFn({ type: 'concelho', id });
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

  /**
   * Main chart function
   * @param  {element} selection  d3 selection
   * @return {mapVizFn}
   */
  function mapVizFn (selection) {
    $el = selection;

    var layers = {
      baseGeometries: function () {
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
          .data(getAcoresFC())
          .call(drawFeatureGroup({ name: 'acores', type: 'island' }));

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
          .data(getMadeiraFC())
          .call(drawFeatureGroup({ name: 'madeira', type: 'island' }));

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
            feature: _portugalFeature,
            offset: [-42, 0]
          }])
          .call(drawFeatureGroup({ name: 'continente', type: 'main' }));
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
          .attr('stroke-width', '1px')
          .attr('stroke', '#ddd')
          .attr('fill', 'none')
          .merge(bounds)
          .attr('x', d => scalar(d.x))
          .attr('y', d => scalar(d.y))
          .attr('width', d => scalar(d.width))
          .attr('height', d => scalar(d.height));
      },

      aaOverlay: function () {
        // Show special overlayInfo for when a nut is selected.
        if (_nut && !_concelho) {
          if (_overlayInfoContentFn) {
            let infoHeight = parseInt($aaOverlayInfo.style('height'));

            let pos;
            if (_nut === 'PT200' || _nut === 'PT300') {
              pos = scalar(760);
            } else {
              pos = d3.select(`.aa--${_nut}`).node().getBBox().y;
            }
            // Position it on top of the nut.
            $aaOverlayInfo
              .style('display', '')
              .style('top', `${pos - scalar(infoHeight + 10)}px`);

            $aaOverlayInfo.html(ReactDOMServer.renderToStaticMarkup(_overlayInfoContentFn()));
          } else {
            $aaOverlayInfo.style('display', 'none');
          }
        }

        if (!_concelho) return;

        let overlayAA = $svg.selectAll('.overlay-aa')
          .data([[1]]);

        let enterG = overlayAA.enter()
          .append('g')
          .attr('class', 'overlay-aa');

        enterG
          .append('circle')
          .attr('class', 'overlay-aa-base');

        enterG
          .append('g')
          .attr('class', 'overlay-aa-geometry');

        overlayAA.merge(overlayAA)
          .select('.overlay-aa-base')
          .attr('r', _overlayAAr)
          .attr('cx', _overlayAAcx)
          .attr('cy', _overlayAAcy)
          .attr('stroke', '#ccc')
          .attr('stroke-width', '1px')
          .attr('fill', 'white')
          .attr('fill-opacity', 0.8);

        // Fill in the name of the aa we're seeing.
        // Render element sent by the parent.
        if (_nut && _overlayInfoContentFn) {
          let infoHeight = parseInt($aaOverlayInfo.style('height'));

          // Position it on top of the circle.
          $aaOverlayInfo
            .style('display', '')
            .style('top', `${_overlayAAcy - _overlayAAr - scalar(infoHeight + 10)}px`);

          $aaOverlayInfo.html(ReactDOMServer.renderToStaticMarkup(_overlayInfoContentFn()));
        } else {
          $aaOverlayInfo.style('display', 'none');
        }

        let geometryGroup = overlayAA.merge(overlayAA)
          .select('.overlay-aa-geometry');

        // Açores.
        if (_nut === 'PT200') {
          geometryGroup
            .selectAll('g.feature')
            .data(getAcoresFC())
            .call(drawFeatureGroupOverlay({
              name: 'overlay-aa-geometry',
              type: 'island',
              groupOffset: [-60, -70],
              groupScale: _projectionScaleValue * 1.65
            }));
        } else if (_nut === 'PT300') {
          geometryGroup
            .selectAll('g.feature')
            .data(getMadeiraFC())
            .call(drawFeatureGroupOverlay({
              name: 'overlay-aa-geometry',
              type: 'island',
              groupOffset: [95, -65],
              groupScale: _projectionScaleValue * 3
            }));
        } else {
          let nutTopo = _.cloneDeep(_topology.objects.all_areas);
          nutTopo.geometries = nutTopo.geometries.filter(o => {
            if (o.properties.type === 'concelho') {
              return concelhoInNut(_nut, parseInt(o.properties.id));
            }
            return o.properties.id === _nut;
          });

          geometryGroup
            .selectAll('g.feature')
            .data([{
              id: 99999,
              center: [-8.2245, 39.3999],
              feature: topojson.feature(_topology, nutTopo),
              offset: [0, 0]
            }])
            .call(drawFeatureGroupOverlay({
              name: 'overlay-aa-geometry',
              type: 'main',
              nutTopo: topojson.feature(_topology, nutTopo)
            }));
        }
      }
    };

    upateSize = function () {
      $svg
        .attr('width', _width + margin.left + margin.right)
        .attr('height', _height + margin.top + margin.bottom);

      _overlayAAr = _width / 2 - 10;
      _overlayAAcx = _width / 2;
      _overlayAAcy = _height * 0.75 / 2;

      // Cache by width and height because when they change the cache is void.
      let cacheKey = `w${_width}h${_height}`;

      if (dataCache._projectionScaleValue[cacheKey]) {
        _projectionScaleValue = dataCache._projectionScaleValue[cacheKey];
      } else {
        // Compute the scale value by using fitSize on the country.
        _projectionScaleValue = d3.geoMercator()
          .fitSize([_width, _height], _portugalFeature)
          .scale();

        // Delete other keys and cache new.
        dataCache._projectionScaleValue = {};
        dataCache._projectionScaleValue[cacheKey] = _projectionScaleValue;
      }

      // Default scalar using the global projection scale value.
      scalar = scalarFactory(_projectionScaleValue);

      // Redraw.
      layers.baseGeometries();
      layers.islandsBounds();
      layers.aaOverlay();
    };

    updateData = function () {
      if (_pauseUpdate) {
        return;
      }

      // Redraw.
      layers.islandsBounds();
      layers.aaOverlay();
    };

    // -----------------------------------------------------------------
    // INIT.
    $svg = $el.append('svg')
      .attr('class', 'chart')
      .style('display', 'block');

    $aaOverlayInfo = $el.append('div')
      .attr('class', 'aa-overlay-info')
      .style('width', '100%')
      .style('position', 'absolute')
      .style('display', 'none');

    _calcSize();
    upateSize();
    updateData();
  }

  mapVizFn.checkSize = function () {
    _calcSize();
    upateSize();
    return mapVizFn;
  };

  mapVizFn.destroy = function () {
    // Cleanup.
    hideTooltip();
  };

  // --------------------------------------------
  // Getters and setters.
  mapVizFn.data = function (d) {
    if (!arguments.length) return _data;
    _data = _.cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  mapVizFn.geometries = function (d) {
    if (!arguments.length) return _topology;
    // _topology = jsonClone(d);
    // Probably there's no need to clone the topology.
    _topology = d;

    var topoPortugal = {
      type: 'GeometryCollection',
      geometries: _topology.objects.all_areas.geometries.filter(o => {
        if (o.properties.type === 'concelho') {
          let id = o.properties.id.substring(0, o.properties.id.length === 3 ? 1 : 2);
          return id < 30;
        }
        if (o.properties.type === 'nut3') {
          return ['PT200', 'PT300'].indexOf(o.properties.id) === -1;
        }
      })
    };

    _portugalFeature = topojson.feature(_topology, topoPortugal);

    return mapVizFn;
  };

  mapVizFn.nut = function (d) {
    if (!arguments.length) return _nut;

    // Special handling of archipelagos
    // For açores and madeira store the id. Islands need to be moved
    // individually and we can't rely on nuts.
    // if (d === 'PT200' || d === 'PT300') {
    _nut = d;

    // For everything else get the nut and concelhos using the id matrix
    // to know which concelhos belong to the nut.
    // } else if (d) {
    //   let nutConcelhos = concelhosMatrix.find(o => o.id === d);
    //   _nut = _.cloneDeep(_topology.objects.all_areas);
    //   _nut.geometries = _nut.geometries.filter(o => {
    //     if (o.properties.type === 'concelho') {
    //       return nutConcelhos.concelhos.indexOf(parseInt(o.properties.id)) !== -1;
    //     }
    //     return o.properties.id === d;
    //   });
    // }

    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  mapVizFn.concelho = function (d) {
    if (!arguments.length) return _concelho;
    _concelho = d;
    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  mapVizFn.onClick = function (d) {
    if (!arguments.length) return _onClickFn;
    _onClickFn = d;
    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  mapVizFn.popoverContent = function (d) {
    if (!arguments.length) return _popoverContentFn;
    _popoverContentFn = d;
    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  mapVizFn.overlayInfoContent = function (d) {
    if (!arguments.length) return _overlayInfoContentFn;
    _overlayInfoContentFn = d;
    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  mapVizFn.pauseUpdate = function () {
    _pauseUpdate = true;
    return mapVizFn;
  };

  mapVizFn.continueUpdate = function () {
    _pauseUpdate = false;
    if (typeof updateData === 'function') updateData();
    return mapVizFn;
  };

  return mapVizFn;
};
