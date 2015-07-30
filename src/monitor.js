var neo = require('./neo');

function Monitor () {
  this.db = neo.instance();
}

Monitor.prototype.countingNodes = function (next) {
  return this.db.cypherQuery('match n return count(*)', function (err, result) {
    if (!err) {
      next(null, result.data[0]);
    } else {
      next(err);
    }
  });
};

function create () {
  return new Monitor();
}

module.exports = {
  create: create
};
