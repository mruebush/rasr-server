var enemies = {};
var methods = {};

methods.get = function(room, dbId, enemyId) {
  if (!room) {
    return enemies;
  }

  if (!dbId) {
    if (enemies[room]) {
      return enemies[room];
    }
  }

  if (!enemyId) {
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
