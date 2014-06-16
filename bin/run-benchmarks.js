#!/usr/bin/env node

'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var path = require('path');
var slayer = require('../index.js')();
var fixtures = require(path.join(__dirname, '..', 'test', 'fixtures', 'default.json'));


// Regular algorithm
suite.add('default', {
  onStart: function(){
    slayer.use('default');
  },
  fn: function(){
    slayer.fromArray(fixtures.realData);
  }
});

suite.add('max-average', {
  onStart: function(){
    slayer.use('max-average');
  },
  fn: function(){
    slayer.fromArray(fixtures.realData);
  }
});

suite.add('average-neighbours-distance', {
  onStart: function(){
    slayer.use('average-neighbours-distance');
  },
  fn: function(){
    slayer.fromArray(fixtures.realData);
  }
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('error', function(event) {
  console.log(event.target.error)
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run();