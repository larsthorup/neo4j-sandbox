// Note: inspired by https://github.com/brikteknologier/disposable-seraph

var async = require('async');
var nvm = require('neo4j-vm');
var supervise = require('neo4j-supervisor');
var Neo4j = require('node-neo4j');

var neo = require('../src/neo');

var config = {
  version: '2.0.0',
  edition: 'community',
  port: 7484,
  startupLatency: 1000
};

var supervisor;

function getNeoInstall (next) {
  nvm(config.version, config.edition, function (err, neoLocation) {
    console.log('Local Neo4j location', neoLocation);
    next(err, neoLocation);
  });
}

function createSupervisor (neoLocation, next) {
  supervisor = supervise(neoLocation);
  supervisor.port(config.port);
  next(null);
}

function stopNeo (next) {
  supervisor.stop(function (err) {
    if (!err) {
      console.log('Local Neo4j stopped');
      next(null);
    } else {
      next(err);
    }
  });
}

function startNeo (next) {
  supervisor.start(function (err) {
    console.log('Local Neo4j starting');
    next(err);
  });
}

function wait (next) {
  setTimeout(function () {
    next(null);
  }, config.startupLatency);
}

function cleanNeo (next) {
  supervisor.clean(function (err) {
    if (!err) {
      console.log('Local Neo4j cleaned');
      next(null);
    } else {
      next(err);
    }
  });
}

function createInstance (next) {
  supervisor.endpoint(function (err, endpoint) {
    if (!err) {
      // console.log(endpoint);
      // 'http://neo4j:neo4j@localhost:7475'
      var instance = new Neo4j(endpoint.server);
      next(null, instance);
    } else {
      next(err);
    }
  });
}

function creatingInstance (next) {
  async.waterfall([
    getNeoInstall,
    createSupervisor,
    stopNeo,
    startNeo,
    wait,
    cleanNeo,
    createInstance
  ], next);
}

var instance = null;
function gettingInstance (next) {
  if (!instance) {
    creatingInstance(function (err, newInstance) {
      if (!err) {
        instance = newInstance;
        next(null, instance);
      } else {
        next(err);
      }
    });
  } else {
    next(null, instance);
  }
}

function installing (mochaTestContext, next) {
  mochaTestContext.timeout(0); // Note: installing Neo4j takes forever the first time, so disable Mocha timeout
  gettingInstance(function (err, instance) {
    if (!err) {
      mochaTestContext.sinon.stub(neo, 'instance', function () {
        return instance;
      });
      next(null);
    } else {
      next(err);
    }
  });
}

function stopping (next) {
  stopNeo(next);
}

module.exports = {
  installing: installing,
  stopping: stopping
};
