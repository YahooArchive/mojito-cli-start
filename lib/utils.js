/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var EOL = require('os').EOL,
    resolve = require('path').resolve,
    getstat = require('fs').statSync,
    fmt = require('util').format,
    log = require('./log');


function error(code, msg) {
    var err = new Error(msg);
    err.errno = code;
    return err;
}

function errorWithUsage(code, msg, usage) {
    var err = error(code, msg + EOL + usage);
    return err;
}

function exists(filepath) {
    var stat = false;
    try {
        stat = getstat(filepath);
    } catch(err) {
    }
    return stat;
}

function findInPaths(paths, target) {
    var pathname;

    function checkpath(basedir) {
        var stat;
        pathname = resolve(basedir, target);
        stat = exists(pathname);
        log.debug('%s is%s in %s', target, stat ? '' : ' not', basedir);
        return stat;
    }

    return paths.some(checkpath) && pathname;
}

function parseCsvObj(str) {
    var out = {};

    function splitcolon(item) {
        return item.split(':');
    }

    function onpair(pair) {
        if ((pair.length > 1) && pair[0].length) {
            // extra join to restore colon values like "a:b:c" -> {a: "b:c"}
            out[pair[0].trim()] = pair.slice(1).join(':').trim();
        }
    }

    (str || '').split(',').map(splitcolon).forEach(onpair);
    return out;
}

module.exports = {
    fmt: fmt,
    EOL: EOL,
    error: error,
    errorWithUsage: errorWithUsage,
    exists: exists,
    findInPaths: findInPaths,
    parseCsvObj: parseCsvObj
};
