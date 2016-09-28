'use strict';

var Promise = require('es6-promise');

/**
 * Cleans up an array of objects based on a specific object property.
 *
 * It is mainly designed to be used as an `Array.filter` callback.
 *
 * ```js
 * cleanEmptyElement('y', { y: 0 });
 * // true
 *
 * cleanEmptyElement('y', { y: null });
 * // false
 * ```
 *
 * @param valueProperty {String}
 * @param item {Object}
 * @returns {Boolean}
 */
function cleanEmptyElement(valueProperty, item){
  return item[valueProperty] !== null;
}

/**
 * Remaps an initial item to a common working structure.
 *
 * It is intended to be bound to a slayer instance.
 *
 * @this {Slayer}
 * @param originalData {Array} The original array of data
 * @param y {Number} The value number detected as being a spike
 * @param i {Number} The index location of `y` in `originalData`
 * @returns {{x: *, y: Number}}
 */
function objectMapper(originalData, y, i){
  return this.getItem({
    x: this.getValueX(originalData[i], i),
    y: y
  }, originalData[i], i);
}

/**
 * Processes an array of data and calls an `onComplete` callback with `error` and `spikes` parameters.
 *
 * @example
 ```js
 slayer()
 .fromArray(arrayData, function(err, spikes){
    if (err){
      console.error(err);
      return;
    }

    console.log(spikes);   // { x: 4, y: 12, id: '21232f297a57a5a743894a0e4a801fc3' }
  });
 ```
 *
 * @api
 * @name Slayer.prototype.fromArray
 * @this {Slayer}
 * @param data {Array.<Object|Number>}
 */
function fromArray(data){
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!Array.isArray(data)){
      throw new TypeError('The data argument should be an array of time series values.')
    }

    var spikes = data
      .map(self.getValueY.bind(self))
      .map(self.filterDataItem.bind(self))
      .map(self.algorithm.bind(self, self.config.minPeakDistance))
      .map(objectMapper.bind(self, data))
      .filter(cleanEmptyElement.bind(null, self.config.transformedValueProperty));

      resolve(spikes);
  });
}

module.exports = fromArray;
