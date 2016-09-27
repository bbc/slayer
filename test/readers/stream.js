'use strict';

var slayer = require('../../index.js');
var fs = require('fs');
var csv = require('csv2');
var path = require('path');
var expect = require("chai").expect;
var DEFAULTS = {
  minPeakDistance: 20,
  minPeakHeight: 4.1
};

function getFile() {
  return fs.createReadStream(path.join(__dirname, '..', 'fixtures', 'default.csv'))
    .pipe(csv());
}

function getSlayer() {
  return slayer(DEFAULTS)
    .y(function(d) {
      return d[2];
    });
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
          { x: 77, y: '4.107187' },
          { x: 78, y: '4.140581' },
          { x: 79, y: '4.149971' },
          { x: 83, y: '4.189285' },
          { x: 84, y: '4.217253' },
          { x: 85, y: '4.231319' },
          { x: 87, y: '4.245672' }
        ]);
        done();
      })
      .on('error', done);
  });
});
