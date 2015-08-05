var _ = require('lodash');
var Neo4j = require('node-neo4j');

var db = null;

// Note: promisified API
Neo4j.prototype.querying = function (query) {
  if (_.isArray(query)) {
    return Promise.all(_(query).map(function (q) { return this.querying(q); }.bind(this)).value());
  } else {
    // console.log(query);
    return new Promise(function (resolve, reject) {
      this.cypherQuery(query, function (err, result) {
        if (!err) resolve(result); else reject(err);
      });
    }.bind(this));
  }
};

function instance () {
  if (!db) {
    db = new Neo4j('http://neo4j:neo4j@localhost:7474');
  }
  return db;
}

module.exports = {
  instance: instance
};
