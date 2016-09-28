'use strict';

var through = require('through2');

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

function incrementOffset(xProperty, offset, d) {
  d[xProperty] = d[xProperty] + offset;

  return d;
}

function pushToStream(d){
  this.push(d);

  return d;
}

function cleanEmitted(xProperty, cache, d) {
  if (cache.indexOf(d[xProperty]) === -1) {
    cache.push(d[xProperty]);

    return true;
  }
  else {
    return false;
  }
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
 * @param onComplete {Function}
 */
function createReadStream(){
  var buffer = [];
  var emittedCache = [];
  var offset = 0;
  var self = this;
  var BUFFER_SIZE = 50;

  return through.obj(function(chunk, enc, callback){
    buffer.push(chunk);

    if (buffer.length >= BUFFER_SIZE) {
      var spikes = buffer
        .map(self.getValueY.bind(self))
        .map(self.filterDataItem.bind(self))
        .map(self.algorithm.bind(self, self.config.minPeakDistance))
        .map(objectMapper.bind(self, buffer))
        .filter(cleanEmptyElement.bind(null, self.config.transformedValueProperty))
        .map(incrementOffset.bind(self, 'x', offset))
        .filter(cleanEmitted.bind(self, 'x', emittedCache))
        .map(pushToStream, this);

      emittedCache = emittedCache.slice(-BUFFER_SIZE);
      buffer = buffer.slice(1);
      offset++;
    }

    callback();
  });
}

module.exports = createReadStream;
