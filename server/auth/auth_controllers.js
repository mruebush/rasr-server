'use strict';

// var mongoose = require('mongoose'),
var passport = require('passport');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Screen = mongoose.model('Screen');
var Player = mongoose.model('Player');

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
  },


  create: function (req, res, next) {
    console.log('inside create');
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save(function(err, user) {
      if (err) {
        console.log('ERROR', err);
        return res.json(400, err);
      }

      /**
       * Create new player with random mapId
       */
      console.log(req.body);
      // update player with new mapId
      return Screen.findAsync()
      .then(function(screens) {
        var mapId = screens[0]._id;
        var newPlayer = new Player({
          user: user._id,
          username: req.body.name,
          mapId: mapId
        });

        newPlayer.save(function(err, result) {
          if (err) {
            console.log('ERROR with player', err);
            return res.json(400, err);
          }

          var tokenSecret = process.env.SECRET_JWT || 'secret'
          var token = jwt.sign({ username: req.body.name }, tokenSecret, { expiresInMinutes: 60 * 24 * 365 });
          console.log(req.body.name);
          return res.json({
            token: token,
            name: req.body.name
          });
        });
      });
      
    });
  },

};
