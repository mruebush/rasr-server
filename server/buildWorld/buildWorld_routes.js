"use strict";

var controller = require('./buildWorld_controllers.js');

module.exports = exports = function (router) {

  // POPULATE A WORLD
  router.route('/populateAll')
    .get(controller.populateWorld);
    
};
