function Monitor () {

}

Monitor.prototype.nodeCount = function () {
  return 0;
  // return query('match n return count(*)');
};

function create () {
  return new Monitor();
}

module.exports = {
  create: create
};
