'use strict';

var slayer = require('../../index.js');
var fs = require('fs');
var split = require('split');
var path = require('path');
var expect = require("chai").expect;
var DEFAULTS = {
  minPeakDistance: 30,
  minPeakHeight: 4.1
};

function getFile() {
  return fs.createReadStream(path.join(__dirname, '..', 'fixtures', 'default.txt'))
    .pipe(split());
}

function getSlayer() {
  return slayer(DEFAULTS);
}

describe('Slayer.createReadStream', function(){
  it('should extract values from a readable stream', function(done){
    var spikes = [];

    getFile()
      .pipe(getSlayer().createReadStream())
      .on('data', function(spike) {
        spikes.push(spike);
      })
      .on('end', function(){
        expect(spikes).to.deep.equal([
          { x: 99, y: '4.262610' },
        ]);
        done();
      })
      .on('error', done);
  });

  it('should extract values from a stream bigger than the sliding window', function(done){
    var spikes = [];

    getFile()
      .pipe(getSlayer().createReadStream({ bufferingFactor: 1 }))
      .on('data', function(spike) {
        spikes.push(spike);
      })
      .on('end', function(d){
        expect(spikes).to.deep.equal([
          { x: 99, y: '4.262610' },
        ]);
        done();
      })
      .on('error', done);
  });
});
