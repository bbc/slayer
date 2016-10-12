'use strict';

var utils = require('../utils.js');

/* istanbul ignore next */
function filterNull(item){
  return item === null ? false : true;
}

/**
 * maxAverage algorithm described as S1 in the following paper.
 *
 * Not yet complete.
 *
 * @param distance {Number} Number of elements to look around
 * @param item {Number} Item value to compare against its neighbourhood.
 * @param i {Number} Current index of `item` within `array`
 * @param array {Array.<Number>}
 * @returns {Number|null}
 */
/* istanbul ignore next */
module.exports = function maxAverage(distance, item, i, array){
  var xDiff = utils.sub.bind(null, item);

  var diffBefore = utils.getManyBefore(distance, i, array).filter(filterNull).map(xDiff);
  var diffAfter = utils.getManyAfter(distance, i, array).filter(filterNull).map(xDiff);

  return null;
};
