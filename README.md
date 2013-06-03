mojito-cli-start [![Build Status](https://travis-ci.org/yahoo/mojito-cli-start.png?branch=develop)](https://travis-ci.org/yahoo/mojito-cli-start)
==========

This package provides the `start` command to start a Mojito server, for the [`mojito-cli`](https://github.com/yahoo/mojito-cli) tool. Install with `npm install -g mojito-cli`.

Start a node.js http server and running your Mojito application:

    mojito start [<port>] [--context "key1:value1,key2:value2,key3:value3"]

If a port is not specified, the environment variable `$PORT` will be used if it's set. Otherwise, the `appPort` config in the application's application.json will be used, or lastly `8666` is the default.

See [Specifying Context](http://developer.yahoo.com/cocktails/mojito/docs/reference/mojito_cmdline.html#specifying-context) to learn how to use the --context option.

Discussion/Forums
-----------------

http://developer.yahoo.com/forum/Yahoo-Mojito

Licensing and Contributions
---------------------------

This software is free to use under the Yahoo! Inc. BSD license. See LICENSE.txt. To contribute to the Mojito project, please
see [Contributing](https://github.com/yahoo/mojito/wiki/Contributing-Code-to-Mojito).

The Mojito project is a [meritocratic, consensus-based community project](https://github.com/yahoo/mojito/wiki/Governance-Model),
which allows anyone to contribute and gain additional responsibilities.
