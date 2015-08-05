/* eslint-env node, mocha */

var sinon = require('sinon');

var fakeneo = require('./fakeneo');
var food = require('../src/food');

describe('food', function () {

  beforeEach(function (done) {
    this.sinon = sinon.sandbox.create();
    fakeneo.installing(this, done);
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('creating', function () {

    beforeEach(function () {
      return food.creating(['Steak', 'Lunch']);
    });

    afterEach(function () {
      return food.cleaning();
    });

    it('should count the food', function () {
      return food.counting().should.become(2);
    });

  });

});
