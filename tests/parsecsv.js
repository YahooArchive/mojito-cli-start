var test = require('tap').test,
    fn = require('../lib/utils').parseCsvObj;


test('parse "aaa:111,bbb:222,,"', function(t) {
    var expected = {
            aaa:111,
            bbb:222
        };
    t.same(fn('aaa:111,bbb:222,,'), expected);
    t.end();
});

test('parse ",aaa:111,,bbb:222"', function(t) {
    var expected = {
            aaa:111,
            bbb:222
        };
    t.same(fn(',aaa:111,,bbb:222'), expected);
    t.end();
});

test('later occurances of a key take precedence', function(t) {
    var expected = {
            aaa:888,
            bbb:999
        };
    t.same(fn('aaa:111,bbb:222,aaa:888,bbb:999'), expected);
    t.end();
});

test('missing keys ignored', function(t) {
    var expected = {
            aaa:888,
        };
    t.same(fn(':111,:,:222,aaa:888'), expected);
    t.end();
});

test('a value CAN contain colons', function(t) {
    var expected = {
            aaa: 'bbb:ccc:ddd:',
        };
    t.same(fn('aaa:bbb:ccc:ddd:'), expected);
    t.end();
});

test('space between inner value-colons not trimmed', function(t) {
    var expected = {
            aaa: 'bbb : ccc : ddd :',
        };
    t.same(fn('aaa: bbb : ccc : ddd : '), expected);
    t.end();
});

test('empty values ok', function(t) {
    var expected = {
            aaa:888,
            bbb:''
        };
    t.same(fn('aaa:111,bbb:222,aaa:888,bbb:'), expected);
    t.same(fn('aaa:888,bbb:222,bbb:,'), expected);
    t.same(fn('bbb:,aaa:888,,'), expected);
    t.same(fn('bbb:,aaa:888,,:'), expected);
    t.end();
});

test('empty sections are ignored', function(t) {
    var expected = {
            aaa:111,
            bbb:222
        };
    t.same(fn('aaa:111,:,bbb:222,,,:'), expected);
    t.end();
});

test('keys & values are trimmed & can contain spaces', function(t) {
    var expected = {
            'a to the A': 'first letter yo',
            'bees wax': 'tastes yucky'
        };

    t.same(fn(' a to the A : first letter yo\t, bees wax: tastes yucky '), expected);
    t.end();
});

test('parse ":::" -> {}', function(t) {
    var expected = {};
    t.same(fn(':::'), expected);
    t.end();
});

test('parse "" -> {}', function(t) {
    var expected = {};
    t.same(fn(''), expected);
    t.end();
});

test('parse "ohhaikthxbai" -> {}', function(t) {
    var expected = {};
    t.same(fn('ohhaikthxbai'), expected);
    t.end();
});

test('parse ":ohhaikthxbai" -> {}', function(t) {
    var expected = {};
    t.same(fn(':ohhaikthxbai'), expected);
    t.end();
});

test('parse ",,," -> {}', function(t) {
    var expected = {};
    t.same(fn(',,,'), expected);
    t.end();
});

test('parse ":valonly,keyonly:,,"', function(t) {
    var expected = {keyonly:''};
    t.same(fn(':valonly,keyonly:,,'), expected);
    t.end();
});

test('parse ",:,:,," -> {}', function(t) {
    var expected = {};
    t.same(fn(',:,:,,'), expected);
    t.end();
});

test('parse null -> {}', function(t) {
    var expected = {};
    t.same(fn(null), expected);
    t.end();
});

test('parse undefined -> {}', function(t) {
    var expected = {};
    t.same(fn(), expected);
    t.end();
});
