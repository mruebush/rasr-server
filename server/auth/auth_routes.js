var controller = require('./auth_controllers.js');

module.exports = function(router) {
  router.route('/login')
    .post(controller.login)

  router.route('/signup')
    .post(controller.create)
};
