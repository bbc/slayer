'use strict';

var slayer = require('../../index.js');
var algorithm = require('../../lib/algorithms/average-signed-distance.js');
var expect = require("chai").expect;

describe('Average Signed Distance', function(){
  var spikes;

  beforeEach(function(){
    spikes = slayer().use(algorithm);
  });

  afterEach(function(){
    spikes = null;
  });

  it('should detect two max value in a pyramidal series', function(done){
    done();
  });
});
