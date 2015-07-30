/* eslint-env node, mocha */
var monitor = require('../src/monitor');

describe('monitor', function () {

  beforeEach(function () {
    this.monitor = monitor.create();
  });

  describe('nodeCount', function () {

    it('can tell that the data store is initially empty', function () {
      this.monitor.nodeCount().should.equal(0);
    });

    describe.skip('when data has been loaded', function () {

      it('reports the number of nodes', function () {
        this.monitor.nodeCount().should.equal(2);
      });

    });

  });
});
