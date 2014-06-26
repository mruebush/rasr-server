'use strict';

/*
 *
 * Entry file into the server
 * app -
 *    our express app. Exported for testing and flexibility.
 *
*/

var app   = require('./server/main/app.js'),
    port  = app.get('port'),
    log   = 'Listening on ' + app.get('base url') + ':' + port;

var server = require('http').createServer(app);
server.listen(port, function(){
  console.log(log);
});

// boostrap socket
require('./server/socket/socket').init(server);
