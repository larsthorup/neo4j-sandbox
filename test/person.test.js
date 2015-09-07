/* eslint-env node, mocha */

var sinon = require('sinon');

var fakeneo = require('./fakeneo');
var person = require('../src/person');

describe('person', function () {
  beforeEach(function (done) {
    this.sinon = sinon.sandbox.create();
    fakeneo.installing(this, done);
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('creating', function () {
    beforeEach(function () {
      return person.creating(['Susan', 'Anna']);
    });

    afterEach(function () {
      return person.cleaning();
    });

    it('should count the persons', function () {
      return person.counting().should.become(2);
    });
  });
});
