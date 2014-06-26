var io;

// handlers.login = function(user) {

//   socket.user = user;
//   console.log(user + ' attempts to login')

//   Player.findOneAsync({
//     username: user
//   }).then(function(result) {

//     users[user] = {
//       room: result.mapId,
//       png: result.png,
//       speed: result.speed,
//       xp: +result.xp,
//       level: +result.level,
//       x: result.x,
//       y: result.y
//     };

//     console.log('loaded ', users[user]);
//   });

//   io.emit('message', {
//     user: 'Server',
//     message: user + ' has joined the game!'
//   });

// };

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
    socket.on('enemyMoving', handler.enemyMoving);
    socket.on('enemyDies', handler.enemyDies);
    socket.on('damageEnemy', handler.damageEnemy);

  });


};


// module.exports.handlers = handlers;

