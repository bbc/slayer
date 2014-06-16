'use strict';

var utils = require('../lib/utils.js');
var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
chai.use(require("sinon-chai"));

describe('Slayer.utils', function(){
  var fixtures = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  var sandbox;

  beforeEach(function(){
    sandbox = sinon.sandbox.create();
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('should add the second parameter to the first one', function(){
    expect(utils.add(10, 10)).to.equal(20);
    expect(utils.add(10, -5)).to.equal(5);
  });

  it('should subtract the second parameter from the first one', function(){
    expect(utils.sub(10, 5)).to.equal(5);
    expect(utils.sub(10, -5)).to.equal(15);
  });

  it('should sum all the values of the array', function(){
    expect(utils.arraySum([1, -1, 5, 10])).to.equal(15);
  });

  it('should create a dense array of a defined amount of undefined values', function(){
    expect(utils.createArray(5)).to.deep.equal([undefined, undefined, undefined, undefined, undefined]);
  });

  it('should create a dense array populated with a custom mapper', function(){
    var mapper = function(el, i){
      return i * 2;
    };

    expect(utils.createArray(5, mapper)).to.deep.equal([0, 2, 4, 6, 8]);
  });

  describe('getManyFrom', function(){
    it('should return the requested in range index values', function(){
      var expectation = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

      expect(utils.getManyFrom(0, 15, fixtures)).to.deep.equal(expectation).and.to.have.lengthOf(15);
    });

    it('should return the requested in range index values and complete will null values for out of range data', function(){
      var expectation = [null, null, null, null, null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(utils.getManyFrom(-5, 10, fixtures)).to.deep.equal(expectation).and.to.have.lengthOf(15);
    });
  });

  describe('getManyBefore', function(){
    it('should request a range of data from 10 elements prior to the current index, excluding the current index', function(){
      var spy = sandbox.spy(utils, 'getManyFrom');

      utils.getManyBefore(10, 5, fixtures);

      expect(spy).to.be.calledWithExactly(-5, 5, fixtures);
    });
  });

  describe('getManyAfter', function(){
    it('should request a range of data from 10 elements after to the current index, excluding the current index', function(){
      var spy = sandbox.spy(utils, 'getManyFrom');

      utils.getManyAfter(10, 5, fixtures);

      expect(spy).to.be.calledWithExactly(6, 15, fixtures);
    });
  });
});