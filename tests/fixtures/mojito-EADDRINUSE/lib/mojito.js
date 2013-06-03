// mocks this:
//
//     function afterListen(err) {
//         var okmsg = util.fmt('\tMojito v%s started "%s" on port %d', env.mojito.version, env.app.name, mojitoOpts.port);
// 
//         if (err) {
//             if (err.code === 'EADDRINUSE') {
//                 cb(util.error(9, util.fmt('Port %d already in use.', mojitoOpts.port)));
//             } else {
//                 log.error(err);
//                 cb(util.error(11, 'Cannot start mojito'));
//             }
//         } else {
//             log.info('');
//             cb(null, util.EOL + okmsg + util.EOL);
//         }
//     }
//
//     var Mojito = tryRequire(join(env.mojito.path, 'lib/mojito')),
//         app;
//
//     try {
//         app = Mojito.createServer(mojitoOpts);
//         app.listen(null, null, afterListen);
//     } catch (err) {
//         cb(err);
//     }

function listener(unused1, unused2, afterListen) {
    var err = new Error('ohnoes.');
    err.code = 'EADDRINUSE';
    afterListen(err);
}

function createServer(opts) {
    return {
        listen: listener
    }
}

module.exports = {
    createServer: createServer
};
