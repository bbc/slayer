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

  it('should reject if the provided data are not an array', function(){
    return slayer(DEFAULTS).fromArray({}).catch(function(err){
      expect(err.message).to.match(/should be an array/);
    });
  });

  it('should return an empty array if no spike are detected.', function(){
    return slayer(DEFAULTS).fromArray(fixtures.none).then(function(spikes){
      expect(spikes).to.deep.equal([]);
    });
  });

  it('should return a series of spikes, represented as {x: Number, y:Number} objects.', function(){
    return slayer(DEFAULTS).fromArray(fixtures.pyramidal).then(function(spikes){
      expect(spikes).to.have.deep.property('[0]').to.include.keys('x', 'y');
    });
  });

  it('should only the highest spike within 30 values around', function(){
    return slayer(DEFAULTS).fromArray(fixtures.pyramidal).then(function(spikes){
      expect(spikes).to.have.deep.property('[0].y').to.equal(12);
    });
  });

  it('should detect only one peak in the real data', function(){
    slayer(DEFAULTS).fromArray(fixtures.realData).then(function(spikes){
      expect(spikes).to.have.deep.property('[0].y').to.equal(4.262610);
    });
  });

  it('should keep track of the proper original index', function(){
    return slayer(DEFAULTS).fromArray(fixtures.realData).then(function(spikes){
      expect(spikes).to.have.deep.property('[0].x').to.equal(99);
    });
  });

  it('should keep track of the proper original index', function(){
    return slayer({ minPeakHeight: 3 })
      .x(function(item){ return item.time; })
      .y(function(item){ return item.fast; })
      .fromArray(fixtures.realDataObject)
      .then(function(spikes){
        expect(spikes).to.have.deep.property('[0].x').to.equal('19-79');
        expect(spikes).to.have.deep.property('[1].x').to.equal('99-159');
      });
  });
});
