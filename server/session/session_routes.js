var controller = require('./session_controllers.js');

module.exports = function(router) {
  router.route('/')
    .post(controller.login)
    .delete(controller.logout);
};
