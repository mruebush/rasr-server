"use strict";

module.exports = exports = function (router) {

  // All undefined API routes return "Not Found"
  router.route('*')
    .get(function(req, res) {
      res.send(404);
    });

};
