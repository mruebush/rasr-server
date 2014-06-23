"use strict";

var bodyParser    = require('body-parser'),
    middle        = require('./middleware'),
    mongoose      = require('mongoose'),
    morgan        = require('morgan'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    cors = require('cors');

    // compression = require('compression'),
    // favicon = require('static-favicon'),
    // path = require('path'),
    // config = require('./config'),
    // errorHandler = require('errorhandler'),
/*
 * Include all global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  // var env = app.get('env');

  var db_url = process.env.DB_URL || 'mongodb://localhost/myApp';
  app.set('DB_URL', db_url);

  // connect to MongoDB
  mongoose.connect(app.get('DB_URL'));

  // Bootstrap and promisify models
  var Screen = require('../screen/screen_model');
  var User = require('../user/user_model');
  var Player = require('../player/player_model');
  var Enemy = require('../enemy/enemy_model');
    // Passport Configuration
  var passport = require('../session/passport')
    
  // if ('development' === env) {
  //   app.use(require('connect-livereload')());


  //   app.use(express.static(path.join(config.root, '.tmp')));
  //   app.use(express.static(path.join(config.root, 'app')));
  //   app.set('views', config.root + '/app/views');
  // }

  // if ('production' === env) {
  //   app.use(compression());
  //   app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
  //   app.use(express.static(path.join(config.root, 'public')));
  //   app.set('views', config.root + '/views');
  // }


  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(cookieParser());

  // Persist sessions with mongoStore
  app.use(session({
    secret: 'angular-fullstack secret',
    store: new mongoStore({
      url: app.get('DB_URL'),
      collection: 'sessions'
    }, function () {
      console.log('db connection open');
    })
  }));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());


  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(middle.cors);

  // Disable caching of scripts for easier testing
  app.use(function noCache(req, res, next) {
    if (req.url.indexOf('/scripts/') === 0) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
    }
    next();
  });


  app.use('/login', routers.SessionRouter);

  app.use('/api/screen', routers.ScreenRouter);
  app.use('/api/buildWorld', routers.BuildWorldRouter);
  app.use('/api/users' , routers.UserRouter);
  app.use('/api/player' , routers.PlayerRouter);

  //All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  app.use(middle.logError);
  app.use(middle.handleError);

  // Error handler - has to be last
  // if ('development' === app.get('env')) {
  //   app.use(errorHandler());
  // }
};