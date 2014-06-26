'use strict';

// var mongoose = require('mongoose'),
var passport = require('passport');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {

  /**
   * Logout - client deletes their JWT
   */

  /**
   * Login
   */

  login: function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      // user has authenticated correctly - provide user with JWT token, expires in one year, send back username
      User.findOneAsync({email: req.body.email})
      .then(function(foundUser) {
        var tokenSecret = process.env.SECRET_JWT || 'secret'
        var token = jwt.sign({ username: req.body.name }, tokenSecret, { expiresInMinutes: 60 * 24 * 365 });
        res.json({
          token: token,
          name: foundUser.name
        });
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })
    })(req, res, next);
  }
};
