var controller = require('./screen_controllers.js');

module.exports = function(router) {
  router.route('/action')
    .post(controller.login)
    .delete(controller.logout);
};
