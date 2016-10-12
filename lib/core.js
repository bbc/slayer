'use strict';

var extend = require('xtend');
var defaultAlgorithm = require('./algorithms/default.js');

var CONFIG_DEFAULTS = {
  minPeakDistance: 30,
  minPeakHeight: 0,
  transformedValueProperty: 'y'
};

function Slayer(config){
  /**
   * Algorithm object responsible to retrieve spikes in a series of data.
   * @type {Function}
   */
  this.algorithm = null;

  /**
   * Filters to apply when the data to exclude unwanted points.
   *
   * @type {Array.<Function>}
   */
  this.filters = [];

  /**
   * Instance configuration object.
   * @type {Object}
   */
  this.config = extend({}, CONFIG_DEFAULTS, config || {});

  this.use(defaultAlgorithm);

  this.configureFilters(this.config);
}

Slayer.prototype = {
  /**
   * Default item accessor.
   *
   * @param item {Number}
   * @param originalItem {Number}
   * @param i {Number}
   * @returns {Number}
   */
  // eslint-disable-next-line no-unused-vars
  getItem: function getItem(item, originalItem, i){
    return item;
  },
  /**
   * Default X value accessor.
   *
   * @param item {*}
   * @param i {Number}
   * @returns {Number}
   */
  getValueX: function(item, i){
    return i;
  },
  /**
   * Default Y value accessor.
   *
   * @param item {Number}
   * @returns {Number}
   */
  getValueY: function(item){
    return item;
  },
  /**
   * Configures the internal filters of a slayer instance
   */
  configureFilters: function configureFilters(config){
    if (typeof config.minPeakHeight !== 'number' || isNaN(config.minPeakHeight)){
      throw new TypeError('config.minPeakHeight should be a numeric value. Was: ' + String(config.minPeakHeight));
    }

    this.filters.push(function minHeightFilter(item){
      return item >= config.minPeakHeight;
    });
  },
  /**
   * Filters out any time series value which does not satisfy the filter.
   *
   * @param item {Number}
   * @returns {Boolean}
   */
  filterDataItem: function filterDataItem(item){
    return this.filters.some(function(filter){
      return filter.call(null, item);
    }) ? item : null;
  },
  /**
   * Plugs a new peak detection algorithm.
   *
   *
   * @param module {Function}
   * @returns {Slayer}
   */
  use: function use(fn){
    // external module
    if (typeof fn === 'function'){
      this.algorithm = fn;

      return this;
    }

    throw new TypeError('.use() expects its first and only paramter to be a peak detection function.');
  },
  /**
   * Index accessor applied to each series item.
   *
   * It will return this value as the `x` value of a spike object.
   *
   * @example
   ```js
   slayer()
   .x(function(item, i){
    return item.date;      // considering item looks like `{ date: '2014-04-12T17:31:40.000Z', value: 12 }`
  })
   .fromArray(arrayData, function(err, spikes){
    console.log(spikes);   // { x: '2014-04-12T17:31:40.000Z', y: 12 }
  });
   ```
   * @api
   * @param mapper {Function}
   * @returns {Slayer}
   */
  x: function(mapper){
    if (typeof mapper !== 'function'){
      throw new TypeError('The x() mapper argument should be a function.');
    }

    this.getValueX = mapper;

    return this;
  },
  /**
   * Data accessor applied to each series item and used to determine spike values.
   *
   * It will return this value as the `y` value of a spike object.
   *
   * @example
   ```js
   slayer()
   .y(function(item){
    return item.value;     // considering item looks like `{ value: 12 }`
  })
   .fromArray(arrayData, function(err, spikes){
    console.log(spikes);   // { x: 4, y: 12 }
  });
   ```
   * @api
   * @param mapper {Function}
   * @returns {Slayer}
   */
  y: function(mapper){
    if (typeof mapper !== 'function'){
      throw new TypeError('The y() mapper argument should be a function.');
    }

    this.getValueY = mapper;

    return this;
  },
  /**
   * Transforms the spike object before returning it as part of the found spike collections.
   *
   * It is useful if you want to add extra data to the returned spike object.
   *
   * @example
   ```js
   slayer()
   .transform(function(xyItem, originalItem, i){
    xyItem.id = originalItem.id;

    return xyItem;
  })
   .fromArray(arrayData, function(err, spikes){
    console.log(spikes);   // { x: 4, y: 12, id: '21232f297a57a5a743894a0e4a801fc3' }
  });
   ```
   * @api
   * @param mapper {Function}
   * @returns {Slayer}
   */
  transform: function(mapper){
    if (typeof mapper !== 'function'){
      throw new TypeError('The transform() mapper argument should be a function.');
    }

    this.getItem = mapper;

    return this;
  }
};


module.exports = function SlayerFactory(config){
  return new Slayer(config);
};

module.exports.Slayer = Slayer;
