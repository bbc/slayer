'use strict';

var Factory = require('./lib/core.js');

Factory.Slayer.prototype.fromArray = require('./lib/readers/array.js');
Factory.Slayer.prototype.createReadStream = require('./lib/readers/stream.js');

module.exports = Factory;
