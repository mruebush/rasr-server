var controller = require('./auth_controllers.js');

module.exports = function(router) {
  router.route('/')
    .post(controller.login)
};
