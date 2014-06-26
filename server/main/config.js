"use strict";

var bodyParser     = require('body-parser'),
    middle         = require('./middleware'),
    mongoose       = require('mongoose'),
    morgan         = require('morgan'),
    cors           = require('cors'),
    expressJwt     = require('express-jwt'),
    json           = require('express-json'),
    Promise        = require('bluebird');

/*
 * Include all global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  // var env = app.get('env');

  app.set('DB_URL', process.env.DB_URL || 'mongodb://localhost/myApp');
  app.set('SECRET_JWT', process.env.SECRET_JWT || 'secret');
  app.set('port', process.env.PORT || 3000);
  app.set('base url', process.env.URL || 'http://localhost');

  // connect to MongoDB
  mongoose.connect(app.get('DB_URL'));

  // Bootstrap and promisify models
  var Screen = require('../screen/screen_model');
  var User = require('../user/user_model');
  var Player = require('../player/player_model');
  var Enemy = require('../enemy/enemy_model');

  Promise.promisifyAll(Screen);
  Promise.promisifyAll(User);
  Promise.promisifyAll(Player);
  Promise.promisifyAll(Enemy);
  Promise.promisifyAll(mongoose);

  // Passport Configuration
  var passport = require('../auth/passport')

  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(json());

  app.use(passport.initialize());

  app.use(middle.cors);

  app.use('/auth', routers.AuthRouter);
  app.use('/buildWorld', routers.BuildWorldRouter);

  app.use('/api/*', expressJwt({secret: app.get('SECRET_JWT')}))

  app.use('/api/screen', routers.ScreenRouter);
  app.use('/api/users' , routers.UserRouter);
  app.use('/api/player' , routers.PlayerRouter);
  app.use('/api/*', routers.NotFoundRouter);

  app.use(middle.logError);
  app.use(middle.handleError);

  // Error handler - has to be last
  // if ('development' === app.get('env')) {
  //   app.use(errorHandler());
  // }
};