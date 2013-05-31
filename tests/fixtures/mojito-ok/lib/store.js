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
//         appConfig = store.getAppConfig();

function getAppConfig(opts) {
    return {
        appPort: 0
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
