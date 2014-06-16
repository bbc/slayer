'use strict';

var Factory = require('./lib/core.js');

Factory.Slayer.prototype.fromArray = require('./lib/readers/array.js');

module.exports = Factory;