/* eslint-env node, mocha */

var fakeneo = require('./fakeneo');

after(function (done) {
  fakeneo.stopping(done);
});
