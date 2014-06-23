"use strict";

var controller = require('./screen_controllers');

module.exports = function(router) {

  // Get specific screen data
  router.route('/get/:screenId')
    .get(controller.getScreen)
    .delete(controller.deleteScreen);

  // Map editor API route
  router.route('/save/:screenId')
    .put(controller.saveScreen);
  
  // Map editor new tileset route
  router.route('/tileset')
    .post(controller.saveTileSet); 
  
  // get next screen player moves to.
  router.route('/move/:direction/:currentScreenId')
    .get(controller.moveScreen);

  // builds screen next to "currentScreenId"
  router.route('/make/:direction/:currentScreenId')
    .get(controller.createPlacedScreen);

};
