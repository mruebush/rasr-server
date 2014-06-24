"use strict";

var controller = require('./player_controllers.js');

module.exports = function(router) {

  // Get my player
  router.route('/me')
    .get(controller.getPlayer);

  // Create my player
  router.route('/makeuser')
    .post(controller.newPlayer);

};
