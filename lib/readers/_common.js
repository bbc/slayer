'use strict';

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

module.exports = {
  cleanEmptyElement: cleanEmptyElement,
  objectMapper: objectMapper
};
