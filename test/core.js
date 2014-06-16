'use strict';

var slayer = require('../index.js');
var path = require('path');
var expect = require("chai").expect;
var sinon = require('sinon');

describe('Slayer', function(){
  var fixtures = require(path.join(__dirname, 'fixtures', 'default.json'));

  it('should throw if minPeakHeight is not a number', function(){
    expect(function(){
      slayer({ minPeakHeight: '25' })
    }).to.throw(TypeError);
  });

  describe('.x()', function(){
    it('should update the X value accessor', function(){

    });

    it('should throw if the mapper is not a function', function(){
      expect(function(){
        slayer().x('');
      }).to.throw(TypeError);
    });
  });

  describe('.y()', function(){
    it('should update the Y value accessor', function(){

    });

    it('should throw if the mapper is not a function', function(){
      expect(function(){
        slayer().y('');
      }).to.throw(TypeError);
    });
  });

  describe('.transform()', function(){
    it('should update the item mapper with the provided function', function(){
      var spy = sinon.spy();
      var s = slayer().transform(spy);

      expect(s.getItem).to.equal(spy);
    });

    it('should throw if the mapper is not a function', function(){
      expect(function(){
        slayer().transform('');
      }).to.throw(TypeError);
    });
  });

  describe('.use()', function(){
    it('should load a Node module as an algorithm if the provided argument is a string', function(){
      var s = slayer().use('entropy');

      expect(s.algorithm.name).to.equal('entropy');
    });

    it('should use a JavaScript function as an algorithm if the provided argument is a function', function(){
      var spy = sinon.spy();

      var s = slayer().use(spy);
      expect(s.algorithm).to.equal(spy);
    });

    it('should throw if the node module cannot be found', function(){
      expect(function(){
        slayer({ algorithm: 'dummy-module' });
      }).to.throw(Error);
    });

    it('should throw if the provided argument is not a function', function(){
      expect(function(){
        slayer({ algorithm: {} });
      }).to.throw(TypeError);
    });
  });
});