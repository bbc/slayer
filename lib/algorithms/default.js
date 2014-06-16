'use strict';

var utils = require('../utils.js');

/**
 * Returns an item if it is the highest local one. Otherwise returns null.
 *
 * It is intended to be used as an `Array.map` callback.
 *
 * @param distance {Number} Number of elements to look around
 * @param item {Number} Item value to compare against its neighbourhood.
 * @param i {Number} Current index of `item` within `array`
 * @param array {Array.<Number>}
 * @returns {Number|null}
 */
module.exports = function refineSpikes(distance, item, i, array){
  var max = utils.arrayMax(
    utils.getManyAround(distance, i, array)
  );

  return item > max ? item : null;
};