'use strict';

var mongoose = require('mongoose');
var Screen = mongoose.model('Screen');
var Enemy = mongoose.model('Enemy');
var Promise = require('bluebird');
var sampleScreens = require('./sampleScreens');
var sampleEnemies = require('./sampleEnemies');

var screenHandler = require('../screen/screen_helpers.js')
var enemyHandler = require('../enemy/enemy_controllers.js')

Promise.promisifyAll(Enemy);
Promise.promisifyAll(Screen);


var methods = {

  // POPULATE WORLD FOR FIRST TIME
  populateWorld: function(req, res) {

    var screen1 = sampleScreens.screen1;
    var screen2 = sampleScreens.screen2;
    var screen3 = sampleScreens.screen3;
    var screen4 = sampleScreens.screen4;
    var screen5 = sampleScreens.screen5;
    var screen6 = sampleScreens.screen6;
    var screen7 = sampleScreens.screen7;
    var screen8 = sampleScreens.screen8;
    var screen9 = sampleScreens.screen9;

    var enemy1 = sampleEnemies.enemy1;
    var enemyOnScreen1 = sampleEnemies.enemyOnScreen1;

    return Enemy.removeAsync()
    .then(function() {
      return Screen.removeAsync();
    })
    .then(function() {
      return enemyHandler.makeEnemy(enemy1);
    })
    .then(function() {
      return Screen.createAsync(screen1)
    })
    .then(function(createdScreen) {
      console.log(createdScreen._id)
      return enemyHandler.populateEnemy(enemyOnScreen1, createdScreen._id)
    })
    .then(function(createdScreenId) {
      return methods.createWorld('right', screen2, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId, 'line 53 - DOWN');
      return methods.createWorld('down', screen3, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return methods.createWorld('left', screen4, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return methods.createWorld('left', screen5, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return methods.createWorld('up', screen6, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return methods.createWorld('up', screen7, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return methods.createWorld('right', screen8, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return methods.createWorld('right', screen9, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      res.send({id: createdScreenId}, 200);
    })
    .catch(function(err) {
      handleError(err, res);
    })
  },

  createWorld: function(direction, newScreen, currentScreenId, req, res) {
    var adjacentDirections = {
      'up': 'right',
      'right': 'down',
      'down': 'left',
      'left': 'up'
    }

    var enemyOnScreen1 = sampleEnemies.enemyOnScreen1;

    // create new screen
    return Screen.createAsync(newScreen)
    .then(function(createdScreen) {
      return enemyHandler.populateEnemy(enemyOnScreen1, createdScreen._id)
    })
    .then(function(createdScreenId) {
      return screenHandler.addDirectionReference(direction, currentScreenId, createdScreenId)
    })
    // go around the horn, adding all necessary references
    .then(function(createdScreenId) {
      return screenHandler.placementHelper(currentScreenId, createdScreenId, direction, adjacentDirections[direction]);
    })
    .catch(function(err) {
      handleError(err, res);
    });
  }
}

var handleError = function(err, res) {
  console.log(err);
  res.send(err);
};

module.exports = methods
