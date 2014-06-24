'use strict';

var express      = require('express');
var app          = express();

/* Router */
var ScreenRouter      = express.Router();
var BuildWorldRouter  = express.Router();
var UserRouter        = express.Router();
var PlayerRouter      = express.Router();
var SessionRouter     = express.Router();
var NotFoundRouter    = express.Router();

var routers = {};

routers.ScreenRouter      = ScreenRouter;
routers.BuildWorldRouter  = BuildWorldRouter;
routers.UserRouter        = UserRouter;
routers.PlayerRouter      = PlayerRouter;
routers.SessionRouter     = SessionRouter;
routers.NotFoundRouter    = NotFoundRouter;

require('./config.js')(app, express, routers);

require('../screen/screen_routes')(ScreenRouter);
require('../buildWorld/buildWorld_routes')(BuildWorldRouter);
require('../user/user_routes')(UserRouter);
require('../player/player_routes')(PlayerRouter);
require('../session/session_routes')(SessionRouter);
require('./notFound')(NotFoundRouter);

module.exports = exports = app;