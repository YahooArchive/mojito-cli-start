/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var exists = require('fs').existsSync,
    join = require('path').join,
    util = require('./lib/utils'),
    log = require('./lib/log');


function tryRequire(str) {
    var mod = false;
    try {
        mod = require(str);
        log.debug('required', str);
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
                cb(util.error(11, 'Can’t start mojito.'));
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

function appConfigExists(cwd) {
    return exists(join(cwd, 'application.json')) ||
        exists(join(cwd, 'application.yml')) ||
        exists(join(cwd, 'application.yaml'));
}

function getAppConfig(mojito_dir, cwd, context) {
    var Store = tryRequire(join(mojito_dir, 'lib/store')),
        store,
        appConfig;

    if (!appConfigExists(cwd)) {
        log.info('No "application.json" found in the current directory.');
    }

    if (Store) {
        store = Store.createStore({
            root: cwd,
            preload: 'skip', // skip preload for appConfig
            context: context
        });
        appConfig = store.getAppConfig();

    } else {
        log.error('Failed to load Mojito store.');
    }

    return appConfig;
}

/**
 * invoke `mojito start` subcommand with env metadata and callback
 * @see https://github.com/yahoo/mojito-cli/blob/develop/cli.js exec()
 * @param {object} env
 *   @param {string} command, the first non-option cli arg (i.e. "create")
 *   @param {array} args command line arguments
 *   @param {object} opts command line options
 *   @param {array} orig the argv array originaly passed to cli
 *   @param {string} cwd absolute path to current working directory
 *   @param {object} cli metadata
 *   @param {object|false} app metadata
 *   @param {object|false} mojito metadata
 * @param {function(err, msg)} callback
 */
function main(env, cb) {
    var appConfig,
        options = {
            port: ~~env.args.shift(),
            context: util.parseCsvObj(env.opts.context),
            perf: env.opts.perf
        };

    if (env.opts.loglevel) {
        log.level = env.opts.loglevel;
    }

    if (!env.app) {
        cb(util.error(1, 'No package.json, please re-try from your application’s directory.'));
        return;
    }

    if (!(env.app.dependencies && env.app.dependencies.mojito)) {
        log.error('The current directory doesn’t appear to be a Mojito application.');
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
        options.port = process.env.PORT || appConfig.appPort || 8666;
    }

    exec(env, options, cb);
}

module.exports = main;

main.usage = [
    'Usage: mojito start [options] [port]',
    'Parameters:',
    '  port       (optional) Port for Mojito to listen on. If omitted, $PORT,',
    '             or appPort from application.json, or (default) 8666, is used.',
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
