// Note: inspired by https://github.com/brikteknologier/disposable-seraph

// var async = require('async');
// var nvm = require('neo4j-vm');
// var nsv = require('neo4j-supervisor');

var neo = require('../src/neo');

var nodeCount = 0;

function creatingInstance (next) {
  var db = {
    cypherQuery: function (query, next) { next(null, {data: [nodeCount]}); }
  };
  next(null, db);
}

function install (sinon, next) {
  creatingInstance(function (err, instance) {
    if (!err) {
      sinon.stub(neo, 'instance', function () {
        return instance;
      });
      next(null);
    } else {
      next(err);
    }
  });
}

module.exports = {
  install: install,
  addNodes: function (n) { nodeCount += n; }
};
