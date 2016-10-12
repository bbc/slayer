'use strict';

var through = require('through2');
var extend = require('xtend');
var commons = require('./_common.js');
var OPTIONS_DEFAULTS = {
  bufferingFactor: 4,
  lookAheadFactor: 0.33
};

function incrementOffset(xProperty, offset, d) {
  d[xProperty] = d[xProperty] + offset;

  return d;
}

function pushToStream(d) {
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
function createReadStream(options){
  options = extend({}, OPTIONS_DEFAULTS, options || {});

  var self = this;
  var buffer = [];
  var emittedCache = [];
  var currentOffset = 0;
  var SLIDING_WINDOW_SIZE = this.config.minPeakDistance * options.bufferingFactor;
  var SLIDING_WINDOW_OVERLAP = SLIDING_WINDOW_SIZE * options.lookAheadFactor;

  var findSpikes = function findSpikes(items, stream) {
    return items
      .map(self.getValueY.bind(self))
      .map(self.filterDataItem.bind(self))
      .map(self.algorithm.bind(self, self.config.minPeakDistance))
      .map(commons.objectMapper.bind(self, buffer))
      .filter(commons.cleanEmptyElement.bind(null, self.config.transformedValueProperty))
      .map(incrementOffset.bind(self, 'x', currentOffset))
      .filter(cleanEmitted.bind(self, 'x', emittedCache))
      .map(pushToStream, stream);
  };

  var flush = function flushBuffer(done) {
    findSpikes(buffer, this);

    done();
  };

  return through.obj(function(chunk, enc, callback){
    buffer.push(chunk);

    if (buffer.length >= SLIDING_WINDOW_SIZE+SLIDING_WINDOW_OVERLAP) {
      findSpikes(buffer, this);

      emittedCache = emittedCache.slice(-SLIDING_WINDOW_SIZE);
      buffer = buffer.slice(SLIDING_WINDOW_SIZE);
      currentOffset += SLIDING_WINDOW_SIZE;
    }

    callback();
  }, flush);
}

module.exports = createReadStream;
