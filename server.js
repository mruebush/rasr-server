'use strict';

var app   = require('./server/main/app.js'),
    port  = app.get('port'),
    log   = 'Listening on ' + app.get('base url') + ':' + port;

var server = require('http').createServer(app);
server.listen(port, function(){
  console.log(log);
});

// boostrap socket
// require('./server/socket/socket').init(server);
require('./server/socket/init')(server);

