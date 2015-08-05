var neo = require('./neo');

var nodeType = 'Person';

function creating (names) {
  // ToDo: use properties instead of string concatenation
  var nodes = names.map(function (name) { return '(' + name + ':' + nodeType + ' {name:"' + name + '"})'; });
  var query = 'CREATE ' + nodes.join(',');
  return neo.instance().querying(query);
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
