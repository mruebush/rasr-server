module.exports.init = function(io) {

  io.on('connection', function(socket) {
    
    var methods = require('./socket');
    methods.registerAll(io, socket);
    var handlers = methods.handlers;

    // Dev-testing handlers
    socket.on('resetAll', handlers.resetAll);
    socket.on('freeXp', handlers.freeXp);

    // Game handlers
    socket.on('login', handlers.login);
    socket.on('disconnect', handlers.disconnect);
    socket.on('gameOver', handlers.gameOver);
    socket.on('enemyMoving', handlers.enemyMoving);
    socket.on('enemyDies', handlers.enemyDies);
    socket.on('damageEnemy', handlers.damageEnemy);
    socket.on('logout', handlers.disconnect);
    socket.on('shoot', handlers.shoot);
    socket.on('stopEnemy', handlers.stopEnemy);
    socket.on('join', handlers.join);
    socket.on('leave', handlers.leave);
    socket.on('move', handlers.move);
    socket.on('message', handlers.message);

  });
};


