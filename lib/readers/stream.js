'use strict';

var through = require('through2');
var extend = require('xtend');
var commons = require('./_common.js');
var OPTIONS_DEFAULTS = {
  slidingWindowSize: 50,
  slidingWindowOverlap: 20
};

function incrementOffset(xProperty, offset, d) {
  d[xProperty] = d[xProperty] + offset;

  return d;
}

function pushToStream(d) {
  this.push(d);

  return d;
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

  var buffer = [];
  var offset = 0;
  var self = this;
  var SLIDING_WINDOW_SIZE = options.slidingWindowSize;
  var SLIDING_WINDOW_OVERLAP = options.slidingWindowOverlap;

  var findSpikes = function findSpikes(items, stream) {
    var spikes = items
      .map(self.getValueY.bind(self))
      .map(self.filterDataItem.bind(self))
      .map(self.algorithm.bind(self, self.config.minPeakDistance))
      .map(commons.objectMapper.bind(self, buffer))
      .filter(commons.cleanEmptyElement.bind(null, self.config.transformedValueProperty))
      .map(incrementOffset.bind(self, 'x', offset))
      .map(pushToStream, stream);
  }

  var flush = function flushBuffer(done) {
    findSpikes(buffer, this);

    done();
  };

  return through.obj(function(chunk, enc, callback){
    buffer.push(chunk);

    if (buffer.length === SLIDING_WINDOW_SIZE+SLIDING_WINDOW_OVERLAP) {
      findSpikes(buffer, this);

      buffer = buffer.slice(SLIDING_WINDOW_SIZE);
      offset += SLIDING_WINDOW_SIZE;
    }

    callback();
  }, flush);
}

module.exports = createReadStream;
