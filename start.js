/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
*/

/*jslint node:true*/

'use strict';

var join = require('path').join,
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
    var packageJson,
        app,
        main;

    packageJson = tryRequire(join(env.cwd, 'package.json'));
    if (!packageJson) {
        cb(util.error(7, 'Missing package.json in app directory'));
        return;
    }

    main = packageJson.main || 'app.js' || 'index.js';

    app = tryRequire(join(env.cwd, main));

    if (!app) {
        cb(util.error(7, 'Could not load startup file: ' + main));
        return;
    }
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
    var // appConfig,
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

    exec(env, options, cb);
}

module.exports = main;

main.usage = [
    'Usage: mojito start'
].join(util.EOL);

main.options = [
];
