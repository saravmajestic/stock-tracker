global.ROOT_PATH = __dirname;
global.ENV = process.env.ENV || "development";
exports = port = (process.env.PORT || 8080);
exports = app_config = require(ROOT_PATH + '/config/'+ENV+'/app.json');
exports = logger = require(ROOT_PATH + '/app/utils/log');
exports = path = require('path');
process.on('uncaughtException', function(err) {
	console.log('uncaughtException caught the error', err.message, err.stack);
	logger.error('uncaughtException caught the error', err.message, err.stack);
});

/**
 * Module dependencies.
 */
var express = require('express'),
	cookieParser = require('cookie-parser'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	http = require('http'),
	fs = require('fs'),
	morgan = require('morgan'),
	express_jwt = require('express-jwt'),
	unless = require('express-unless');

exports = server = express();

//Resource version for cache busting
if(!app_config.resVersion){
	app_config.resVersion = Math.floor(Math.random() * (1001));
}
app_config.jwt_secret = process.env.jwt;
server.locals.res_version = app_config.resVersion;

require(ROOT_PATH + '/app/utils/database');

server.set('port', port);
// server.use(compress());  
server.use(bodyParser.json());
//https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
//5MB for image upload options
server.use(bodyParser.urlencoded({extended : true, limit: '7mb'}));
//Let's use the body-parser middleware
server.use(bodyParser.text({type: 'application/graphql'}));
server.use(cookieParser());
server.set('views', __dirname + '/client');
server.set('view engine', 'html'); // set up html for templating
server.engine('.html', require('ejs').__express);
server.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url" :status :res[content-length] ":referrer" ":user-agent"  - :response-time ms', {"stream": logger.stream}));
server.use(methodOverride());

exports = ipaddress = (process.env.OPENSHIFT_NODEJS_IP || process.env.NODEJS_IP);

//used to create hashmap to avoid db calls in every api
var redis = require("redis");
exports = redisClient = redis.createClient();
redisClient.on("error", function (err) {
    logger.error("Error in redis", err.stack, err.message, err);
});

//path consists of all the routes which can be accessed without jwt
var jwtCheck = express_jwt({ secret: app_config.jwt_secret});
var jwt_utils = require(path.join(ROOT_PATH, 'app/utils', 'jwt'));
jwtCheck.unless = unless;
var unauthorizedAPIs = ['/api/graphql','/api/user/login','/api/users/signup'];
var ignorePaths = function(req){return (req.url.indexOf('/api') === -1) || (unauthorizedAPIs.indexOf(req.url) !== -1);};
// server.use(jwtCheck.unless(ignorePaths));
// server.use(jwt_utils.middleware().unless(ignorePaths));

//Routes for all commands
require('./routes.js')(server);
server.use(myErrorHandler);

server.set('jsonp callback name', 'callback');

server.locals.node_name = process.env.APP_NAME;
server.locals.env = ENV;
server.listen(port, ipaddress, function() {
	console.log('%s: Node server started on http://%s:%d ...', Date(Date.now()), (ipaddress || 'localhost'), port);
});

function myErrorHandler(err, req, res, next) {
	logger.error("Error happened in %s", req.path, err.stack, err.message, err, req.headers);
	
	if(req.url.indexOf('/api/') == 0){
		var extra = null;
		if(ENV !== "production"){
			extra = {stack : err.stack, message : err.message};
		}
		var errMsg = err && err.message || "Internal error happened!";
		res.json({"isSuccess" : false, errMsg : errMsg, extra : extra, logout: (errMsg === jwt_utils.invalid_token)});
	}else{
		res.setHeader('Content-Type', 'text/html');
		res.status(404); 
		res.render('404');
	}
}