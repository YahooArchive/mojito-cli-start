// this boilerplate can go away when we can switch back to tape from tap
var fs = require('fs'),
    resolve = require('path').resolve;

function load(name) {
    var tf = resolve(__dirname, name);
    if(name.match(/[.]js$/) && (tf !== __filename)) {
        require(tf); // tests in this file get run
    }
}

fs.readdir(__dirname, function onreaddir(err, list) {
    list.forEach(load);
});
