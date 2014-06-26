
module.exports = function(server) {

  var io = require('socket.io').listen(server);
  io.attach(server);

  var handlers = require('./handlers').init(io);

  // io.on('connection', handlers.connection);

};