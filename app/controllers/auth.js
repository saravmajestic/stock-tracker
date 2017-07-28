var jwt_utils = require(path.join(ROOT_PATH, 'app/utils', 'jwt'));
exports.signup = function(req, res){
	var params = req.body;
	var User = mongoose.model('User');
	User.signup(params, function(err, user){
		if(err){
			logger.error("Signup failed %s %s %j", params.first_name, params.email, params, err);
			res.json({isSuccess : false, err : err});
		}else{
			logger.info("Signup completed for %s", params.first_name);
            jwt_utils.create(user, req, res, function(err){
				if(err){
					logger.error("Signup API failed while creating token %s", params.email, err);
				}
				res.json({isSuccess : true, data : user, token: (req.user && req.user.token)});
			});
		}
	});
};
exports.logout = function(req, res){
	if (jwt_utils.expire(req.headers)) {
		delete req.user;
		return res.json({ isSuccess: true });
	} else {
		return res.json({ isSuccess: false, logout: true});
	}
};
exports.login = function(req, res){
	var params = req.body;
	var User = mongoose.model('User');
	User.login(params.email, params.password, function(err, user){
		if(err || !user){
			logger.error("login API failed %s", params.email, err);
			res.json({isSuccess : false, user : null, errMsg : err});
		}else{
			jwt_utils.create(user, req, res, function(err){
				if(err){
					logger.error("login API failed while creating token %s", params.email, err);
				}
				delete user.password;
				user.token = user.token;
				user.name = user.first_name + ' ' + (user.last_name || '');
				res.json({isSuccess : true, data: user, token: (req.user && req.user.token)});
			});
		}
	});
};