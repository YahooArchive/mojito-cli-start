// mocks this:
//
//     var Store = tryRequire(join(mojito_dir, 'lib/store')),
//         store,
//         appConfig;
//
//     if (Store) {
//         store = Store.createStore({
//             root: cwd,
//             preload: 'skip', // skip preload for appConfig
//             context: context
//         });
//

function getAppConfig(opts) {
    return {
        appPort: 12345
    }
}

function createStore(opts) {
    return {
        getAppConfig: getAppConfig
    }
}

module.exports = {
    createStore: createStore
};
