var _ = require('lodash');

var neo = require('./neo');
var food = require('./food');
var person = require('./person');

function buildNodes (relations, index, nodeType) {
  var names = _(relations).map(function (relation) { return relation[index]; }).unique();
  var nodes = names.map(function (name) {
    return '(' + name + ':' + nodeType + ' {name: "' + name + '"})';
  });
  return nodes.value();
}

function creating (tastings) {
  var matchPersons = buildNodes(tastings, 0, person.nodeType).join(',');
  var matchFoods = buildNodes(tastings, 1, food.nodeType).join(',');
  var matches = matchPersons + ',' + matchFoods;
  var relations = _(tastings).map(function (tasting) {
    var relation = tasting[2] ? 'Like' : 'Dislike';
    return '(' + tasting[0] + ')-[:' + relation + ']->(' + tasting[1] + ')';
  });
  var query = 'MATCH ' + matches + ' CREATE ' + relations;
  return neo.instance().querying(query);
}

function cleaning () {
  var query = 'MATCH (p:Person)-[r1:Like]->(), (p:Person)-[r2:Dislike]->() DELETE r1,r2';
  return neo.instance().querying(query);
}

function computingCompatibility (personName1, personName2) {
  var queries = [
    'MATCH (p1:Person {name:"' + personName1 + '"})-[r:Dislike]->(f:Food)<-[:Dislike]-(p2:Person {name:"' + personName2 + '"}) RETURN count(r)',
    'MATCH (p1:Person {name:"' + personName1 + '"})-[r:Like]->(f:Food)<-[:Like]-(p2:Person {name:"' + personName2 + '"}) RETURN count(r)',
    'MATCH (p1:Person {name:"' + personName1 + '"})-[r:Dislike]->(f:Food)<-[:Like]-(p2:Person {name:"' + personName2 + '"}) RETURN count(r)',
    'MATCH (p1:Person {name:"' + personName1 + '"})-[r:Like]->(f:Food)<-[:Dislike]-(p2:Person {name:"' + personName2 + '"}) RETURN count(r)'
  ];
  return neo.instance().querying(queries).then(function (results) {
    var counts = _(results).map(function (result) { return result.data[0]; }).value();
    var shareCount = _(counts).sum();
    var matchCount = counts[0] + counts[1];
    return matchCount / shareCount;
  });
}

module.exports = {
  creating: creating,
  cleaning: cleaning,
  computingCompatibility: computingCompatibility
};
