/* eslint-env node, mocha */

var sinon = require('sinon');

var fakeneo = require('./fakeneo');
var person = require('../src/person');
var food = require('../src/food');
var taste = require('../src/taste');

describe('taste', function () {

  beforeEach(function (done) {
    this.sinon = sinon.sandbox.create();
    fakeneo.installing(this, done);
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('compatibility', function () {

    beforeEach(function () {
      return Promise.all([
        person.creating(['Barak', 'Lars']),
        food.creating(['Icecream', 'Steak', 'Beer', 'Broccoli', 'Coffee'])
      ]).then(function () {
        return taste.creating([
          ['Lars', 'Icecream', true],
          ['Lars', 'Steak', true],
          ['Lars', 'Beer', false],
          ['Lars', 'Broccoli', true],
          ['Barak', 'Icecream', false],
          ['Barak', 'Steak', true],
          ['Barak', 'Beer', false],
          ['Barak', 'Coffee', true]
        ]);
      });
    });

    afterEach(function () {
      return taste.cleaning().then(function () {
        return Promise.all([
          person.cleaning(),
          food.cleaning()
        ]);
      });
    });

    it('should compute compatibility as matches / shares ', function () {
      return taste.computingCompatibility('Lars', 'Barak').should.eventually.be.closeTo(0.67, 0.01); // Note: 2/3
    });

  });
});
