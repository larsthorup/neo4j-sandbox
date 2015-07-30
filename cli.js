var monitor = require('./src/monitor').create();

var done = function (err) {
  var exitCode = 0;
  if (err) {
    exitCode = 1;
    console.log('Error', err);
  }
  process.exit(exitCode);
};

monitor.countingNodes(function (err, nodeCount) {
  if (!err) {
    console.log('Node Count is', nodeCount);
  }
  done(err);
});
