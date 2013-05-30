/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var join = require('path').join,
    util = require('./lib/utils'),
    log = require('./lib/log');

function tryRequire(str) {
    var mod = false;
    try {
        mod = require(str);
        log.debug('required %s', str);
    } catch (err) {
        log.debug('module error', err);
    }
    return mod;
}

function exec(env, mojitoOpts, cb) {
    var Mojito = tryRequire(join(env.mojito.path, 'lib/mojito')),
        app;

    if (!Mojito) {
        cb(util.error(7, 'Couldn’t load lib/mojito.js'));
        return;
    }

    function afterListen(err) {
        var okmsg = util.fmt('\tMojito v%s started "%s" on port %d', env.mojito.version, env.app.name, mojitoOpts.port);

        if (err) {
            if (err.code === 'EADDRINUSE') {
                cb(util.error(9, util.fmt('Port %d already in use.', mojitoOpts.port)));
            } else {
                log.error(err);
                cb(util.error(11, 'Cannot start mojito'));
            }
        } else {
            log.info('');
            cb(null, util.EOL + okmsg + util.EOL);
        }
    }

    try {
        app = Mojito.createServer(mojitoOpts);
        app.listen(null, null, afterListen);
    } catch (err) {
        cb(err);
    }
}

function getAppConfig(mojito_dir, cwd, context) {
    var Store = tryRequire(join(mojito_dir, 'lib/store')),
        store,
        appConfig;

    if (Store) {
        store = Store.createStore({
            root: cwd,
            preload: 'skip', // skip preload for appConfig
            context: context
        });
        appConfig = store.getAppConfig();
    }

    return appConfig;
}

function main(env, cb) {
    var appConfig,
        options = {
            port: ~~env.args.shift(),
            context: util.parseCsvObj(env.opts.context),
            perf: env.opts.perf
        };

    if (!env.app) {
        cb(util.error(1, 'No package.json, please re-try from your application’s directory.'));
        return;
    }

    if (!(env.app.dependencies && env.app.dependencies.mojito)) {
        cb(util.error(3, 'Mojito isn’t a dependency in package.json. Try `npm i --save mojito`.'));
        return;
    }

    if (!env.mojito) {
        cb(util.error(3, 'Mojito is not installed locally. Try `npm i mojito`'));
        return;
    }

    // get application.json for the current context, because we need appPort
    appConfig = getAppConfig(env.mojito.path, env.cwd, options.context);

    if (!appConfig) {
        cb(util.error(3, 'Cannot read application.json.'));
        return;
    }

    if (!options.port) {
        options.port = appConfig.appPort || process.env.PORT || 8666;
    }

    exec(env, options, cb);
}

module.exports = main;

main.usage = [
    'Usage: mojito start [options] [port]',
    'Parameters:',
    '  port       (optional) Port for Mojito to listen on. If omitted, appPort',
    '             from application.json, or process.env.PORT, or 8666, is used.',
    '',
    'Options',
    '  --context  A comma-separated list of key:value pairs that define the base',
    '             context used to read configuration files',
    '  --perf     Path and filename to save performance instrumentation data if',
    '             you have configured a "perf" object in your application.json.'
].join(util.EOL);

main.options = [
    {shortName: null, hasValue: true, longName: 'context'},
    {shortName: null, hasValue: true, longName: 'perf'}
];
