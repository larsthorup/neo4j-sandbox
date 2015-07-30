var neo = require('../src/neo');

var nodeCount = 0;

var db = {
  cypherQuery: function (query, next) { next(null, {data: [nodeCount]}); }
};

function instance () {
  return db;
}

function install (sinon) {
  sinon.stub(neo, 'instance', instance);
}

module.exports = {
  install: install,
  addNodes: function (n) { nodeCount += n; }
};
