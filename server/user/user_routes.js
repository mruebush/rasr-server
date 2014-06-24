"use strict";

var controller = require('./user_controllers.js');

module.exports = function(router) {
  router.route('/:id')
    .post(controller.create)
    .put(controller.changePassword)
    .get(controller.show);

  // router.route('/me')
  //   .get(controller.me);
  // router.route('/:id')
}

