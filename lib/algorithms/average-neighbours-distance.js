'use strict';

var utils = require('../utils.js');

/**
 * average neighbours distance  algorithm described as S2 in the following paper.
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
module.exports = function averageNeighboursDistance(distance, item, i, array){
  var xDiff = utils.sub.bind(null, item);

  var diffBefore = utils.getManyBefore(distance, i, array).map(xDiff);
  var diffAfter = utils.getManyAfter(distance, i, array).map(xDiff);

  var average = ((utils.arraySum(diffBefore) / distance) + (utils.arraySum(diffAfter) / distance)) / 2;

  return null;
};
