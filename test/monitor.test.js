/* eslint-env node, mocha */

var should = require('chai').should();
var sinon = require('sinon');

var fakeneo = require('./fakeneo');
var monitor = require('../src/monitor');
var neo = require('../src/neo');

describe('monitor', function () {
  beforeEach(function (done) {
    this.sinon = sinon.sandbox.create();
    fakeneo.installing(this, done);
  });

  beforeEach(function () {
    this.monitor = monitor.create();
  });

  afterEach(function () {
    this.sinon.restore();
  });

  describe('countingNodes', function () {
    it('can tell that the data store is initially empty', function (done) {
      this.monitor.countingNodes(function (err, nodeCount) {
        should.not.exist(err);
        nodeCount.should.equal(0);
        done();
      });
    });

    describe('when data has been loaded', function () {
      beforeEach(function (done) {
        neo.instance().cypherQuery('CREATE (ben:User {name:"Ben"}),(arnold:User {name:"Arnold"})', done);
      });

      afterEach(function (done) {
        neo.instance().cypherQuery('MATCH (ben:User {name:"Ben"}),(arnold:User {name:"Arnold"}) DELETE ben,arnold', done);
      });

      it('reports the number of nodes', function (done) {
        this.monitor.countingNodes(function (err, nodeCount) {
          should.not.exist(err);
          nodeCount.should.equal(2);
          done();
        });
      });
    });
  });
});
