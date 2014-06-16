'use strict';

var slayer = require('../../index.js');
var path = require('path');
var expect = require("chai").expect;
var DEFAULTS = {
  minPeakDistance: 30,
  minPeakHeight: 4.1
};

describe('Slayer.fromArray', function(){
  var fixtures = require(path.join(__dirname, '..', 'fixtures', 'default.json'));

  it('should throw if the provided data are not an array', function(){
    expect(function(){
      slayer(DEFAULTS).fromArray({});
    }).to.throw(TypeError);
  });

  it('should throw if no callback is provided', function(){
    expect(function(){
      slayer(DEFAULTS).fromArray([]);
    }).to.throw(TypeError);
  });

  it('should throw if the callback argument is not a function', function(){
    expect(function(){
      slayer(DEFAULTS).fromArray([], 'callback');
    }).to.throw(TypeError);
  });

  it('should return an empty array if no spike are detected.', function(done){
    slayer(DEFAULTS).fromArray(fixtures.none, function(err, spikes){
      expect(spikes).to.deep.equal([]);

      done();
    });
  });

  it('should return a series of spikes, represented as {x: Number, y:Number} objects.', function(done){
    slayer(DEFAULTS).fromArray(fixtures.pyramidal, function(err, spikes){
      expect(spikes).to.have.deep.property('[0]').to.include.keys('x', 'y');

      done();
    });
  });

  it('should only the highest spike within 30 values around', function(done){
    slayer(DEFAULTS).fromArray(fixtures.pyramidal, function(err, spikes){
      expect(spikes).to.have.deep.property('[0].y').to.equal(12);

      done();
    });
  });

  it('should detect only one peak in the real data', function(done){
    slayer(DEFAULTS).fromArray(fixtures.realData, function(err, spikes){
      expect(spikes).to.have.deep.property('[0].y').to.equal(4.262610);

      done();
    });
  });

  it('should keep track of the proper original index', function(done){
    slayer(DEFAULTS).fromArray(fixtures.realData, function(err, spikes){
      expect(spikes).to.have.deep.property('[0].x').to.equal(99);

      done();
    });
  });

  it('should keep track of the proper original index', function(done){
    slayer({ minPeakHeight: 3 })
      .x(function(item){ return item.time; })
      .y(function(item){ return item.fast; })
      .fromArray(fixtures.realDataObject, function(err, spikes){
        expect(spikes).to.have.deep.property('[0].x').to.equal('19-79');
        expect(spikes).to.have.deep.property('[1].x').to.equal('99-159');

        done();
      });
  });
});