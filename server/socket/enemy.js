var enemies = {};
var methods = {};

// var Enemy = require('mongoose').model('Enemy');


// enemies
// { '<ROOM ID>': { '<enemy ID #1>': { '0': Object, '1': Object, '2': Object } } }
//
// where Object = { 
//        pos: [x,y]
//        health: 5,
//       }

methods.debug = function(room, dbId, enemyId) {
  console.log('debug', room, dbId, enemyId);
  if (room === void 0) {
    console.log('enemies', enemies);
    return enemies;
  }

  if (dbId === void 0) {
    if (enemies[room]) {
      console.log('enemies[room]', enemies[room]);
      return enemies[room];
    }
  }

  if (enemyId === void 0) {
    if (enemies[room]) {
      if (enemies[room][dbId]) {
        console.log('enemies[room][dbid]', enemies[room][dbId]);
        return enemies[room][dbId];
      }
    }
  }

  if(enemies[room]) {
    if (enemies[room][dbId]) {
      if (enemies[room][dbId][enemyId]) {
        console.log('last', enemies[room][dbId][enemyId]);
        return enemies[room][dbId][enemyId];
      }
    }
  }
};

methods.get = function(room, dbId, enemyId) {
  if (room === void 0) {
    return enemies;
  }

  if (dbId === void 0) {
    if (enemies[room]) {
      return enemies[room];
    }
  }

  if (enemyId === void 0) {
    if (enemies[room]) {
      if (enemies[room][dbId]) {
        return enemies[room][dbId];
      }
    }
  }

  if(enemies[room]) {
    if (enemies[room][dbId]) {
      if (enemies[room][dbId][enemyId]) {
        return enemies[room][dbId][enemyId];
      }
    }
  }
};

methods.delete = function(room, dbId, enemyId) {
  delete enemies[room][dbId][enemyId];
};

methods.initRoom = function(room) {
  enemies[room] = {};
};

methods.unattack = function(user, room) {
  var enemies = methods.get(room);
  var dbIds = [];

  for (var dbId in enemies) {
    dbIds.push(dbId);
  }

  for (var i = 0, _len = dbIds.length; i < _len; i++) {
    enemies = methods.get(room, dbIds[i]);

    for (var enemyId in enemies) {
      if (enemies[enemyId].attacking === user) {
        delete enemies[enemyId].attacking;
      }
    }
  }
};


methods.initDbId = function(room, dbId) {
  enemies[room][dbId] = {};
};

methods.initEnemyId = function(room, dbId, enemyId) {
  enemies[room][dbId][enemyId] = {};
  enemies[room][dbId][enemyId].position = [];
};

methods.damage = function(room, dbId, enemyId) {
  var enemy = methods.get(room, dbId, enemyId);
  if (enemy) {
    enemy.health--;
  }
};

methods.attack = function(room, dbId, enemyId, user) {
  var enemy = methods.get(room, dbId, enemyId);
  if (enemy) {
    enemy.attacking = user;
  }
};

methods.setPosition = function(room, dbId, enemyId, position) {
  var enemy = methods.get(room, dbId, enemyId);
  if (enemy) {
    enemy.position[0] = position[0];
    enemy.position[1] = position[1];
  }
};

methods.exist = function(room, dbId, enemyId) {
  return !!methods.get(room, dbId, enemyId);
};

methods.pushInfo = function(enemies, data) {

    for (var key in enemies) {
      enemies[key].health = data.health;
      enemies[key].name = data.name;
      enemies[key]._id = data._id;
      enemies[key].png = data.png;
      enemies[key].speed = data.speed;
      enemies[key].xp = data.xp;
      enemies[key].attacking = data.attacking;
     }

  };

methods.isAttacking = function(room, dbId, enemyId) {
  return !!enemies[room][dbId][enemyId].attacking;
};

methods.calcDirection = function(enemy) {

    var enemyX = enemy.position[0];
    var enemyY = enemy.position[1];

    var playerX = enemy.attacking.x;
    var playerY = enemy.attacking.y;

    var eps = 40;

    // directions:
    // 0 -> up
    // 1 -> down
    // 2 -> left
    // 3 -> right

    var xdiff = playerX - enemyX;
    var ydiff = playerY - enemyY;

    if (Math.abs(xdiff) > eps) {

      if (xdiff > 0) {
        return 3;
      } else {
        return 2;
      }

    } else {

      if (ydiff > 0) {
        return 1;
      } else {
        return 0;
      }

    }

  };

module.exports.methods = methods;
