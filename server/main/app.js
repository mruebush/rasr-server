'use strict';

var express      = require('express');
var app          = express();

/* Router */
var ScreenRouter       = express.Router();
var BuildWorldRouter      = express.Router();
// var TagRouter         = express.Router();
// var UserRouter        = express.Router();
// var MatchRouter       = express.Router();
// var CompanyRouter     = express.Router();
// var CategoryRouter    = express.Router();
// var InviteRouter      = express.Router();

var routers      = {};

routers.ScreenRouter       = ScreenRouter;
routers.BuildWorldRouter      = BuildWorldRouter;
// routers.OpportunityRouter = OpportunityRouter;
// routers.TagRouter         = TagRouter;
// routers.UserRouter        = UserRouter;
// routers.MatchRouter       = MatchRouter;
// routers.CompanyRouter     = CompanyRouter;
// routers.CategoryRouter    = CategoryRouter;
// routers.InviteRouter      = InviteRouter;

require('./config.js')(app, express, routers);

require('../screen/screen_routes.js')(ScreenRouter);
require('../buildWorld/buildWorld_routes.js')(BuildWorldRouter);
// require('../opportunity/opportunity_routes.js')(OpportunityRouter);
// require('../tag/tag_routes.js')(TagRouter);
// require('../user/user_routes.js')(UserRouter);
// require('../match/match_routes.js')(MatchRouter);
// require('../company/company_routes.js')(CompanyRouter);
// require('../category/category_routes.js')(CategoryRouter);
// require('../invite/invite_routes.js')(InviteRouter);

module.exports = exports = app;