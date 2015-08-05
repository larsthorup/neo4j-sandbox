var neo = require('./neo');

var nodeType = 'Person';

function creating (names) {
  var queries = names.map(function (name) { return 'CREATE (:' + nodeType + ' { name: {name} })'; });
  var params = names.map(function (name) { return {name: name}; });
  return neo.instance().querying(queries, params);
}

function counting () {
  var query = 'MATCH (x:' + nodeType + ') RETURN count(x)';
  return neo.instance().querying(query).then(function (result) {
    return result.data[0];
  });
}

function cleaning () {
  var query = 'MATCH (x:' + nodeType + ') DELETE x';
  return neo.instance().querying(query);
}

module.exports = {
  nodeType: nodeType,
  creating: creating,
  counting: counting,
  cleaning: cleaning
};
