var test = require('tap').test,
    log = require('../lib/log');

test('debug level was added', function(t) {
    t.equal('function', typeof log.debug);
    t.ok('debug' in log.style);
    t.ok('debug' in log.disp);
    t.ok('debug' in log.levels);
    t.end();
});

test('debug log level is below verbose', function(t) {
    t.ok(log.levels.verbose > log.levels.debug);
    t.equal(999, log.levels.debug);
    t.end();
});

test('no heading', function(t) {
    t.equal('', log.heading);
    t.end();
});
