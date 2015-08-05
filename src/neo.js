var _ = require('lodash');
var Neo4j = require('node-neo4j');

var db = null;

// Note: promisified API
Neo4j.prototype.querying = function (query, params) {
  if (_.isArray(query)) {
    if (!params) {
      params = _.fill(Array(query.length), null);
    }
    var qps = _.zip(query, params);
    return Promise.all(_(qps).map(function (qp) { return this.querying(qp[0], qp[1]); }.bind(this)).value());
  } else {
    // console.log(query, params);
    return new Promise(function (resolve, reject) {
      this.cypherQuery(query, params, function (err, result) {
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
