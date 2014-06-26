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

  if (enemies[room][dbId][enemyId]) {
    return enemies[room][dbId][enemyId];
  }
};

methods.exists = function(room, dbId, enemyId) {
  if (!dbId) {
    return !!enemies[room];
  }

  if (!enemyId) {
    return !!enemies[room][dbId];
  }
};

methods.isAttacking = function(room, dbId, enemyId) {
  return !!enemies[room][dbId][enemyId].attacking;
};

module.exports.methods = methods;
