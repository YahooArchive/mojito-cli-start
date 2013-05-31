/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var log = require('npmlog');

// cust config
log.addLevel('debug', 999, {fg: 'grey'}, 'debu');

// monkey patch npmlog…
log.heading = '';
log.headingStyle.fg = 'blue';
log.disp.verbose = 'verbose';
log.disp.error = 'err!';
log.disp.warn = 'warn';
log.style.error.bold = true;
log.style.warn.bold = true;
log.style.warn.fg = 'yellow';

// no bg colors
log.headingStyle.bg =
log.style.verbose.bg =
log.style.warn.bg =
log.style.error.bg =
log.style.http.bg = null;

// disable prefixing
Object.keys(log.levels).forEach(function(level) {
	log[level] = log[level].bind(log, '');
});

module.exports = log;
