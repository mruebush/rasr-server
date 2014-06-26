var enemies = {};
var methods = {};

methods.getEnemies = function(room, dbId, enemyId) {
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

module.exports.methods = methods;
