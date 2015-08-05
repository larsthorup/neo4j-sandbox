var neo = require('./neo');

var nodeType = 'Food';

function creating (names) {
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

function computingCompatibility () {
}

module.exports = {
  nodeType: nodeType,
  creating: creating,
  counting: counting,
  cleaning: cleaning,
  computingCompatibility: computingCompatibility
};
