/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

// TODO this module contains common functions to mojito-cli* packages, and
// should be provided as a common, shared package.

var EOL = require('os').EOL,
    fmt = require('util').format;

function error(code, msg) {
    var err = new Error(msg);
    err.errno = code;
    return err;
}

/**
 * @param {string|null} str Mojito context strings are comma-separated key/value
 *   pairs like "key1:val1,key2:val2", or "device:iphone,lang:en-US"
 * @return {object} An object/hash/dict representing the parsed context string.
 *   Returns an empty object if `str` is a falsey value.
 */
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
    //errorWithUsage: errorWithUsage,
    //exists: exists,
    //findInPaths: findInPaths,
    parseCsvObj: parseCsvObj
};
