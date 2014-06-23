"use strict";

var controller = require('./buildWorld_controllers.js');

module.exports = exports = function (router) {

  // POPULATE A WORLD
  app.route('/populateAll')
    .get(buildWorld.populateWorld);
    
};
