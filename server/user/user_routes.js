"use strict";

var controller = require('./user_controllers.js');

module.exports = function(router) {
  router.route('/')
    .post(controller.create)
    .put(controller.changePassword);

  router.route('/me')
    .get(controller.me);
  router.route('/:id')
    .get(controller.show)
}

