module.exports = {};
var io;

// sample users object:
// { user1: { room: 'name of room', x: xCoord, y: yCoord}, user2: {...}, ...}
var users = {};

// sample rooms object:
// { room1: 5, room2: 0, ... }
var rooms = {}; 

// enemies
var allEnemies = {};

// var allEnemies = {};
// allEnemies looks like:
// { '<ROOM ID>': { '<enemy ID #1>': { '0': Object, '1': Object, '2': Object } } }
//
// where Object = { 
//        pos: [x,y]
//        health: 5,
//       }



var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Player = mongoose.model('Player'),
    Enemy = mongoose.model('Enemy');

Promise.promisifyAll(Player);


module.exports.init = function(server) {

  io = require('socket.io').listen(server);
  io.attach(server);


  io.on('connection', function(socket){
    console.log('yo appears');

    socket.on('enemyDies', function(data) {

      console.log('enemy dies' , data);
      console.log('allenemies', allEnemies);

      console.log(allEnemies[data.mapId][data._id][data.enemy])
      delete allEnemies[data.mapId][data._id][data.enemy]

      console.log('newData', allEnemies)

      io.in(data.mapId).emit('derenderEnemy', data);
    });


    socket.on('disconnect', function() {
      console.log('a wild connection dissappears');
    });

    console.log('a wild troll appears');
    // console.log(io.sockets);

    socket.on('logout', function(data) {
      console.log(data.user + ' logs out at ' + data.x + ',' + data.y + ' in ' + data.mapId);
      
      Player.findOneAsync({
        username: data.user
      }).then(function(user) {
        console.log(user)
        console.log('Saving user data .. ' + data.mapId);
        user.x = data.x;
        user.y = data.y;
        user.mapId = data.mapId;


        user.save();
      });

    });

    socket.on('shoot', function(data) {

      console.log(data.user + ' shooting in map ' + data.mapId + ' at ' + data.x + ',' + data.y );

      io.in(data.mapId).emit('shoot', {
        user: data.user,
        x: data.x,
        y: data.y,
        angle: data.angle,
        num: data.num
      });

    });

    socket.on('stopEnemy', function(data) {

      // console.log('stop', data)


      if (allEnemies[data.room][data._id][data.enemy]) {
        // console.log(allEnemies[data.room][data._id][data.enemy].position);
        // console.log('update ' + data.x + ',' + data.y + ' on ' + data.enemy);
        allEnemies[data.room][data._id][data.enemy].position[0] = data.x;
        allEnemies[data.room][data._id][data.enemy].position[1] = data.y;
      }



    });


    socket.on('join', function(data) {

      var room = data.mapId;
      var user = data.user;
      var x = data.x;
      var y = data.y;
      var enemies = data.enemies;
      // var enemyData = [];

      console.log('enemies', enemies);

      socket.join(room);

      rooms[room] && rooms[room]++;
      rooms[room] = rooms[room] || 1;

      users[user] = {
        room: room,
        x: x,
        y: y
      };

      console.log(user + ' joined ' + room + ' in ' + x + ',' + y);
      console.log(allEnemies[room])


      if (enemies.length === 0) {

        console.log('no enemies in room');

        io.in(room).emit(room, {
          user: user,
          others: get(users, room, user),
          x: x,
          y: y
        });

      } else if (allEnemies[room]) {


        console.log('got enemies in memory.. ', allEnemies[room]);

        for (var key in allEnemies[room]) {
          for (var key2 in allEnemies[room][key]) {
            console.log(allEnemies[room][key][key2])
          }
        }

        // console.log(allEnemies[room])
        // console.log(allEnemies[room][1].position)




        io.in(room).emit(room, {
          user: user,
          others: get(users, room, user),
          x: x,
          y: y,
          enemies: allEnemies[room]
        });

      } else {

        allEnemies[room] = {};
        for (var i = 0, _len = enemies.length; i < _len; i++) {

          var monsterId = data.enemies[i].id;
          
          allEnemies[room][monsterId] = {};

          for (var j = 0, _len2 = enemies[i].count; j < _len2; j++) {
            allEnemies[room][monsterId][j] = {};
            allEnemies[room][monsterId][j].position = data.positions[monsterId][j];
          }
        }

        console.log('before', allEnemies[room]);
        console.log('querying db for enemies')

        var callbacksFired = 0;

        for (var i = 0, _len = enemies.length; i < _len; i++) {

          var count = enemies[i].count;
          var enemyId = enemies[i].id;

          getEnemyData(enemyId).then(function(result){


            // enemyData.push({
            //   data: result,
            //   count: count
            // });

            // populateHealth(allEnemies[room][enemyId], result.health);
            pushInfo(allEnemies[room][enemyId], {
              health: result.health,
              name: result.name,
              _id: result._id,
              png: result.png,
              speed: result.speed
            });

            callbacksFired++;
            if (callbacksFired === _len) {

              

              io.in(room).emit(room, {
                user: user,
                others: get(users, room, user),
                x: x,
                y: y,
                enemies: allEnemies[room]
              });
            }
          });
        }
      }
    });

    socket.on('leave', function(data) {
      var user = data.user;
      var mapId = data.mapId;
      delete users[user];

      rooms[mapId]--;

      io.in(mapId).emit('leave', {
        user: user
      });

      socket.leave(mapId);
      console.log(user + ' left ' + mapId);
      // console.log(users);
    });

    socket.on('move', function(data) {

      var emitter = data.user;

      // console.log(data);

      if (users[emitter]) {
        
        var dir = data.dir;
        var room = data.room;
        var x = data.x;
        var y = data.y;
        // console.log(emitter + ' moved to ' + x + ',' + y);
        users[emitter].x = x;
        users[emitter].y = y;

        io.in(room).emit('move', {
          user: emitter,
          dir: dir,
          x: x,
          y: y
        });
      }
    });

    socket.on('message', function(data){

      var message = data.message.message;
      var user = data.message.user;

      console.log('recieved message ' + message);
      io.emit('message', {
        message: message,
        user: user
      })

    });

  });

};


var getEnemyData = function(enemyId) {
  return Enemy.findByIdAsync(enemyId);
};

var moveEnemies = function() {

  var nums = [];
  
  for (var room in rooms) {
    if (rooms[room] && allEnemies[room]) {
      for (var dbId in allEnemies[room]) {
          for (var id in allEnemies[room][dbId]){
            nums.push(Math.floor(Math.random() * 4));
          }
      }
      io.in(room).emit('move enemies',{
        param: 'move dem enemies!',
        nums: nums 
      });
    }
  }

};


var enemyTimer = setInterval(moveEnemies, 2500);


var pushInfo = function(enemies, data) {

  for (var key in enemies) {
    enemies[key].health = data.health;
    enemies[key].name = data.name;
    enemies[key]._id = data._id;
    enemies[key].png = data.png;
    enemies[key].speed = data.speed;
   }

};

var get = function(users, room, user) {
  var res = [];
  var obj;
  for (var key in users) {
    if (key !== user && users[key].room === room) {
      obj = users[key];
      obj.user = key;
      res.push(obj);
    }
  }
  return res;
};

