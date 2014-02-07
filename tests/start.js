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

// test('err- bad store path', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts, join(fixtures, 'app'));

//     function cb(err, msg) {
//         t.ok(err instanceof Error);
//         t.equal(msg, undefined);
//         t.equal(err.errno, 3);
//         t.equal(err.message, 'Cannot read application.json.');
//     }

//     t.plan(4);
//     env.app = {dependencies: {mojito:'1.2.3'}};
//     env.mojito = {path: 'nonesuch'};
//     fn(env, cb);
// });

// test('err- fail to load Store.', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts);

//     function cb(err, msg) {
//         t.ok(err instanceof Error);
//         t.equal(msg, undefined);
//         t.equal(err.errno, 3);
//         t.equal(err.message, 'Cannot read application.json.');
//     }

//     t.plan(4);
//     env.app = {dependencies: {mojito:'1.2.3'}};
//     env.mojito = {path: 'nonesuch'};
//     fn(env, cb);
// });

// test('err- fail to load lib/mojito.js', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts);

//     function cb(err, msg) {
//         t.ok(err instanceof Error);
//         t.equal(msg, undefined);
//         t.equal(err.errno, 7);
//         t.equal(err.message, 'Couldn’t load lib/mojito.js');
//     }

//     t.plan(4);
//     env.app = {dependencies: {mojito:'1.2.3'}};
//     env.mojito = {path: join(fixtures, 'mojito-store_only')};
//     fn(env, cb);
// });

// test('err- "Can’t start mojito."', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts);

//     function cb(err, msg) {
//         t.ok(err instanceof Error);
//         t.equal(msg, undefined);
//         t.equal(err.errno, 11);
//         t.equal(err.message, 'Can’t start mojito.');
//     }

//     t.plan(4);
//     env.app = {dependencies: {mojito:'1.2.3'}};
//     env.mojito = {path: join(fixtures, 'mojito-ohnoes')};
//     fn(env, cb);
// });

// test('err- "Port 8666 already in use."', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts);

//     function cb(err, msg) {
//         t.ok(err instanceof Error);
//         t.equal(msg, undefined);
//         t.equal(err.errno, 9);
//         t.equal(err.message, 'Port 8666 already in use.');
//     }

//     t.plan(4);
//     env.app = {dependencies: {mojito:'1.2.3'}};
//     env.mojito = {path: join(fixtures, 'mojito-EADDRINUSE')};
//     fn(env, cb);
// });

// test('err- app.listen throws', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts);

//     function cb(err, msg) {
//         t.ok(err instanceof Error);
//         t.equal(msg, undefined);
//         t.equal(err.errno, undefined);
//         t.equal(err.message, 'ohnoes!!');
//     }

//     t.plan(4);
//     env.app = {dependencies: {mojito:'1.2.3'}};
//     env.mojito = {path: join(fixtures, 'mojito-throws')};
//     fn(env, cb);
// });

// test('app.listen OK', function(t) {
//     var args = [],
//         opts = {},
//         env = getEnv(args, opts),
//         app = {
//             name: 'bob',
//             dependencies: {
//                 mojito:'1.2.3'
//             }
//         },
//         moj = {
//             version: '1.2.3',
//             path: join(fixtures, 'mojito-ok')
//         };

//     function cb(err, msg) {
//         t.ok(!err);
//         t.equal(msg, '\n\tMojito v1.2.3 started \"bob\" on port 8666\n');
//     }

//     t.plan(2);
//     env.app = app;
//     env.mojito = moj;
//     fn(env, cb);
// });

// test('app.listen OK on --port 67890', function(t) {
//     var args = ['67890'],
//         opts = {},
//         env = getEnv(args, opts),
//         app = {
//             name: 'bob',
//             dependencies: {
//                 mojito:'1.2.3'
//             }
//         },
//         moj = {
//             version: '1.2.3',
//             path: join(fixtures, 'mojito-ok_has_port')
//         };

//     function cb(err, msg) {
//         t.ok(!err);
//         t.equal(msg, '\n\tMojito v1.2.3 started "bob" on port 67890\n');
//     }

//     t.plan(2);
//     env.app = app;
//     env.mojito = moj;
//     fn(env, cb);
// });

