var Neo4j = require('node-neo4j');

var db = null;

function instance () {
  if (!db) {
    db = new Neo4j('http://neo4j:neo4j@localhost:7474');
  }
  return db;
}

module.exports = {
  instance: instance
};
