'use strict';

var express      = require('express');
var app          = express();

/* Router */
var ScreenRouter       = express.Router();
var BuildWorldRouter      = express.Router();
var UserRouter        = express.Router();
var PlayerRouter        = express.Router();

var routers      = {};

routers.ScreenRouter       = ScreenRouter;
routers.BuildWorldRouter      = BuildWorldRouter;
routers.UserRouter        = UserRouter;
routers.PlayerRouter        = PlayerRouter;

require('./config.js')(app, express, routers);

require('../screen/screen_routes.js')(ScreenRouter);
require('../buildWorld/buildWorld_routes.j')(BuildWorldRouter);
require('../user/user_routes.js')(UserRouter);
require('../user/player_routes.js')(PlayerRouter);
require('../user/session_routes.js')(SessionRouter);

module.exports = exports = app;