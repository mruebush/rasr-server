module.exports = {};
var handlers = {};

// State:isolate state and access it from this file

// state, game logic & data handling

// var io;

// sample users object:
// { user1: { room: 'name of room', x: xCoord, y: yCoord, xp:, level:}, user2: {...}, ...}
var users = {};

// sample rooms object:
// { room1: 5, room2: 0, ... }
var rooms = {}; 

// enemies
// var allEnemies = {};

// var allEnemies = {};
// allEnemies looks like:
// { '<ROOM ID>': { '<enemy ID #1>': { '0': Object, '1': Object, '2': Object } } }
//
// where Object = { 
//        pos: [x,y]
//        health: 5,
//       }

var xpToLevel = require('./level').level;

var enemies = require('./enemy').methods;
var users = require('./user').methods;

// console.log('API', enemies);



var mongoose = require('mongoose'),
    // Player = mongoose.model('Player'),
    Enemy = mongoose.model('Enemy');

module.exports.registerAll = function(io, socket) {

  var getEnemyData = function(enemyId) {
    return Enemy.findByIdAsync(enemyId);
  };

  var movePassiveEnemies = function() {

    var nums = [];

    for (var room in rooms) {
      if (rooms[room] && enemies.exist(room)) {
        for (var dbId in enemies.get(room)) {
          for (var id in enemies.get(room, dbId)){
            if (!enemies.isAttacking(room, dbId, id)) {
              nums.push({
                dir: Math.floor(Math.random() * 4),
                passive: true
              });
            } 
            else {
              nums.push({
                dir: void 0,
                passive: false
              });
            }
          }
        }
        emitToRoom(room, 'move enemies',{
          param: 'move dem enemies!',
          nums: nums 
        });
      }
    }
  };

  var passiveEnemyTimer = setInterval(movePassiveEnemies, 2500);

  var distance = function(enemy, player) {
    return Math.sqrt(Math.pow(enemy[0] - player[0], 2) + Math.pow(enemy[1] - player[1], 2));
  };

  var serverMessage = function(message) {
    message = '[' + new Date().toDateString() + '] ' + message;
    io.emit('message', {
      user: 'Server',
      message: message
    });
  };

  var emitToRoom = function(room, event, data) {
    io.in(room).emit(event, data);
  };
//emitToRoom()
  var emitToAll = function(event, data) {
    io.emit(event, data);
  };

  handlers.login = function(user) {
    socket.user = user;
    users.login(user);
    serverMessage(user + ' has joined the game!');
  };

  handlers.disconnect = function() {
    console.log('a wild troll disappears');
    users.logout({
      user: socket.user
    });
  };

  handlers.gameOver = function(data) {
    var room = data.room;
    var user = data.user;

    users.gameOver(user, data);
    emitToRoom(room, 'gameOver', {
      user: user
    });
  };

  handlers.enemyMoving = function(data) {
    var room = data.room;
    var dbId = data._id;
    var enemyId = data.enemy;

    if (enemies.exist(room, dbId, enemyId)) {

      var enemy = enemies.get(room, dbId, enemyId);

      enemy.position[0] = data.x;
      enemy.position[1] = data.y;

      if (distance([data.x, data.y],[enemy.attacking.x, enemy.attacking.y]) > 37) {

        var num = enemies.calcDirection(enemy);
        emitToRoom(room, 'enemyMoving', {
          dir: num,
          dbId: dbId,
          serverId: enemyId
        });
      }
    }
  };

  handlers.resetAll = function(data) {
    users.resetAll(data.user);
  };

  handlers.freeXp = function(data) {
    var user = data.user;
    var xp = data.xp;

    var message = users.freeXp(user, xp);

    serverMessage(message);
    emitToAll('levelUp');
  };

  handlers.enemyDies = function(data) {
    var room = data.mapId;
    var user = data.user;
    var dbId = data._id;
    var enemyId = data.enemy;
    var xp = data.xp;

    enemies.delete(room, dbId, enemyId);
    emitToRoom(room, 'derenderEnemy', data);

    var message = user + ' has slain a ' + data.enemyName + ' for ' + xp + ' exp!';
    var levelUp = users.awardXp(user, xp);

    if (levelUp) {
      message = username + ' reached level ' + user.level;
      emitToRoom(room, 'levelUp', {
        user: user
      });

    }
    console.log('current xp ', users[user].xp);
    console.log('total xp needed to level', xpToLevel(users[user].level));
    serverMessage(message);
  };

  handlers.damageEnemy = function(data) {
    // console.log('data', data)
    var room = data.room;
    var dbId = data._id;
    var enemyId = data.enemy;
    var user = data.user;
    console.log(user + ' damages enemy ' + enemyId + ' in ' + room);
    console.log(room, dbId, enemyId);

    enemies.damage(room, dbId, enemyId);
    enemies.attack(room, dbId, enemyId, users.get(user));

    console.log(data.enemy);
    emitToRoom(room, 'damageEnemy', {
      serverId: data.enemy
    });
  };

  handlers.shoot = function(data) {
    emitToRoom(data.mapId, 'shoot', data);
  };

  handlers.stopEnemy = function(data) {

    var room = data.room;
    var dbId = data._id;
    var enemyId = data.enemy;

    enemies.setPosition(room, dbId, enemyId, [data.x, data.y]);
  };

  handlers.join = function(data) {

    var room = data.mapId;
    var user = data.user;
    var x = data.x;
    var y = data.y;
    var creatures = data.enemies;

    socket.join(room);

    rooms[room] && rooms[room]++;
    rooms[room] = rooms[room] || 1;


    users.extend(user, {
      name: user,
      room: room,
      x: x,
      y: y
    });


    console.log(user + ' joined ' + room + ' in ' + x + ',' + y);

    if (creatures.length === 0) {

      console.log('no enemies in room');

      emitToRoom(room, room, {
        user: user,
        others: users.others(user, room),
        x: x,
        y: y
      });

    } else if (enemies.exist(room)) {

      console.log('got enemies in memory.. ');

      emitToRoom(room, room, {
        user: user,
        others: users.others(user, room),
        x: x,
        y: y,
        enemies: enemies.get(room)
      });

    } else {

      console.log('querying db for enemies');
      // allEnemies[room] = {};
      enemies.initRoom(room);
      for (var i = 0, _len = creatures.length; i < _len; i++) {

        // console.log('crash', data.creatures);
        var dbId = data.enemies[i].id;
        enemies.initDbId(room, dbId);

        for (var j = 0, _len2 = creatures[i].count; j < _len2; j++) {
          // allEnemies[room][dbId][j] = {};
          enemies.initEnemyId(room, dbId, j);
          enemies.setPosition(room, dbId, j, data.positions[dbId][j]);
          // allEnemies[room][dbId][j].position = data.positions[dbId][j];
        }
      }

      var callbacksFired = 0;

      for (var i = 0, _len = creatures.length; i < _len; i++) {

        var count = creatures[i].count;
        var enemyId = creatures[i].id;

        getEnemyData(enemyId).then(function(result){

          enemies.pushInfo(enemies.get(room, enemyId), {
            health: result.health,
            name: result.name,
            _id: result._id,
            png: result.png,
            speed: result.speed,
            xp: result.xp,
            attacking: false
          });

          callbacksFired++;
          if (callbacksFired === _len) {

            console.log('sending', enemies.get(room));

            emitToRoom(room, room, {
              user: user,
              others: users.others(user, room),
              x: x,
              y: y,
              enemies: enemies.get(room)
            });
          }
        });
      }
    }
  };

  handlers.leave = function(data) {  
    var user = data.user;
    var room = data.mapId;
    emitToRoom(room, 'leave', {
      user: user
    });

    socket.leave(room);
    console.log(user + ' left ' + room);
  };

  handlers.move = function(data) {
    var emitter = data.user;

    if (users[emitter]) {
      
      var dir = data.dir;
      var room = data.room;
      var x = data.x;
      var y = data.y;
      
      users[emitter].x = x;
      users[emitter].y = y;

      emitToRoom(room, 'move', {
        user: emitter,
        dir: dir,
        x: x,
        y: y
      });
    }
  };

  handlers.message = function(data) {  
    var message = data.message.message;
    var user = data.message.user;

    console.log('recieved message ' + message);

    emitToAll('message', {
      message: message,
      user: user
    });
  };

};

module.exports.handlers = handlers;







