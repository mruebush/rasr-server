"use strict";

var bodyParser    = require('body-parser'),
    middle        = require('./middleware'),
    mongoose      = require('mongoose'),
    morgan        = require('morgan'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(session),
    cors = require('cors');

    // compression = require('compression'),
    // favicon = require('static-favicon'),
    // path = require('path'),
    // config = require('./config'),
    // errorHandler = require('errorhandler'),


mongoose.connect(process.env.DB_URL || 'mongodb://localhost/myApp');
/*
 * Include all global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  // var env = app.get('env');

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
      url: config.mongo.uri,
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


  app.use('/login', routers.LoginRouter);

  // app.use('/public', routers.PublicRouter);
  app.use('/api/screen', routers.OpportunityRouter);
  app.use('/api/buildWorld', routers.TagRouter);
  // app.use('/api/users' , routers.UserRouter);
  // app.use('/api/matches', routers.MatchRouter);
  // app.use('/api/companies', routers.CompanyRouter);
  // app.use('/api/categories', routers.CategoryRouter);
  // app.use('/api/invite', routers.InviteRouter);
  app.use(middle.logError);
  app.use(middle.handleError);

  // Error handler - has to be last
  // if ('development' === app.get('env')) {
  //   app.use(errorHandler());
  // }
};

'use strict';

/**
 * Express configuration
 */
module.exports = function(app) {


};