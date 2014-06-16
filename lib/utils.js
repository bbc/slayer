'use strict';

var defaultArrayMap = function(el){
  return el;
};

module.exports = {
  /**
   * Adds the second value to first one.
   *
   * @param a {Number}
   * @param b {Number}
   * @returns {Number}
   */
  add: function(a, b){
    return a + b;
  },
  /**
   * Subtracts the second value from the first one.
   *
   * @param a {Number}
   * @param b {Number}
   * @returns {Number}
   */
  sub: function(a, b){
    return a - b;
  },
  /**
   * Returns the max value from an array.
   *
   * @param array {Array}
   * @returns {number}
   */
  arrayMax: function arrayMax(array){
    return Math.max.apply(null, array);
  },
  /**
   * Returns the sum of all the array values.
   *
   * @param array {Array}
   * @returns {Number}
   */
  arraySum: function arraySum(array){
    return array.reduce(function(memo, value){
      return memo + value;
    }, 0);
  },
  /**
   * Reads and returns a predictable length from an initial array.
   *
   * ```js
   * getManyFrom(2, 5, [0, 1, 2, 3]);
   * // [2, 3, null]
   * ```
   *
   * @param startIndex {Number}
   * @param endIndex {Number}
   * @param data {Array}
   * @returns {Array}
   */
  getManyFrom: function(startIndex, endIndex, data){
    var many = [];
    var i = parseInt(startIndex, 10);
    var z = parseInt(endIndex, 10);

    for(i; i < z; i++){
      many.push(data[i] === undefined ? null : data[i]);
    }

    return many;
  },
  /**
   * Returns a defined amount of array values before a specific index.
   *
   * ```js
   * getManyBefore(3, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * // [0, 1, 2]
   *
   * getManyBefore(5, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * // [null, null, 0, 1, 2]
   * ```
   *
   * @param count {Number}
   * @param index {Number}
   * @param data {Array}
   * @returns {Array}
   */
  getManyBefore: function(count, index, data){
    return this.getManyFrom(index - count, index, data);
  },
  /**
   * Returns a defined amount of array values after a specific index.
   *
   * ```js
   * getManyAfter(3, 6, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * // [7, 8, 9]
   *
   * getManyAfter(5, 6, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * // [7, 8, 9, null, null]
   * ```
   *
   * @param count {Number}
   * @param index {Number}
   * @param data {Array}
   * @returns {Array}
   */
  getManyAfter: function(count, index, data){
    return this.getManyFrom(index + 1, index + count, data);
  },
  /**
   * A combination of `getManyAfter` and `getManyBefore`
   *
   * @param count {Number}
   * @param index {Number}
   * @param data {Array}
   * @returns {Array}
   */
  getManyAround: function(count, index, data){
    return []
      .concat(this.getManyBefore(count, index, data))
      .concat(this.getManyAfter(count, index, data));
  },
  /**
   * Create a dense array of values.
   * The values can be dynamically generated thanks to an optional mapper.
   *
   * @param length {Number}
   * @param mapper {Function=}
   * @returns {Array}
   */
  createArray: function(length, mapper){
    return Array.apply(null, Array(length)).map(mapper || defaultArrayMap);
  }
};