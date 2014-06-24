var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Enemy = mongoose.model('Enemy'),
    Screen = mongoose.model('Screen');

module.exports = {
  populateEnemy: function(data, mapId) {
    var screenToAdd;

    return Screen.findByIdAsync(mapId)
    .then(function(foundScreen) {
      screenToAdd = foundScreen;
      return Enemy.findAsync({name: data.enemy});
    }).then(function(foundEnemy) {

      var enemyId = foundEnemy[0]._id;

      screenToAdd.enemies = screenToAdd.enemies || {};
      screenToAdd.enemies[enemyId] = screenToAdd.enemies[enemyId] || {};

      screenToAdd.enemies[enemyId].count = data.count;
      screenToAdd.enemies[enemyId].positions = data.positions;

      return screenToAdd.saveAsync();
    }).then(function(){
      return new Promise(function(onResolved, onRejected) {
        console.log(screenToAdd._id, 'new promise returning')
        onResolved(screenToAdd._id);
      });
    });
  },

  makeEnemy: function(enemyData) {
    return Enemy.createAsync(enemyData);
  }
};
