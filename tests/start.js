var test = require('tap').test,
    join = require('path').join,
    log = require('../lib/log'),
    fn = require('../start'),

    fixtures = join(__dirname, 'fixtures');


log.pause();

function getEnv(args, opts, cwd) {
    return {
        args: args || [],
        opts: opts || {},
        cwd: cwd || __dirname
    };
}

test('err- no package.json', function(t) {
    var args = [],
        opts = {loglevel: 'error'},
        env = getEnv(args, opts);

    function cb(err, msg) {
        t.ok(err instanceof Error);
        t.equal(msg, undefined);
        t.equal(err.errno, 1);
        t.equal(err.message, 'No package.json, please re-try from your application’s directory.');
    }

    t.plan(4)
    fn(env, cb);
});

test('err- not a mojito app', function(t) {
    var args = [],
        opts = {},
        env = getEnv(args, opts);

    function cb(err, msg) {
        t.ok(err instanceof Error);
        t.equal(msg, undefined);
        t.equal(err.errno, 3);
        t.equal(err.message, 'Mojito isn’t a dependency in package.json. Try `npm i --save mojito`.');
    }

    t.plan(4);
    env.app = {};
    fn(env, cb);
});

test('err- env.mojito falsey', function(t) {
    var args = [],
        opts = {},
        env = getEnv(args, opts);

    function cb(err, msg) {
        t.ok(err instanceof Error);
        t.equal(msg, undefined);
        t.equal(err.errno, 3);
        t.equal(err.message, 'Mojito is not installed locally. Try `npm i mojito`');
    }

    t.plan(4);
    env.app = {dependencies: {mojito:'1.2.3'}};
    fn(env, cb);
});


