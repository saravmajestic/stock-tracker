var Validator = require('validator').Validator, crypto = require('crypto'), 
    bcrypt = require('bcrypt-nodejs');

let UserSchema;

var exports = module.exports = UserSchema = new mongoose.Schema({},{collection : 'user'});

UserSchema.add({
    uid: 		{type: String, index: true, unique : true },
    email:      {type: String, index: true, unique: true, select: false },
    provider:   {type: String, index: true, unique: false },
	password: 	{type: String, select: false},
  	first_name: {type: String, required : false},
    last_name: 	{type: String, required : false},
    token: 	{type: String, required : false},
  	picture: 	{type: String, index: true },
    updated_at: {type: Date, default: Date.now, select: false },
    created_at: {type: Date, default: Date.now, select: false }
});

UserSchema.set('toJSON', { getters: true });

UserSchema.pre('save', function(next){
	if(!this.created_at){
		this.created_at = (new Date()).toISOString();
	}

	this.updated_at = (new Date()).toISOString();
	next();
});
/** 
 * Find user by id
 * @static
 */
UserSchema.statics.findUserById = function (id, callback) {
	this.findOne({_id: id}, callback);
};

/**
 * Verify Password
 * @static
 */
UserSchema.statics.verifyPassword = function (password, user) {
    return user.password == password;
};

/**
 * Authenticate user 
 *
 * @api static
 */
UserSchema.statics.login = function(email, password, callback) {
	var User = mongoose.model('User');
	
	this.findOne({ email: { $regex: email, $options: 'i'}}).select('+password +email').lean().exec(function (err, user) {
		if (err) callback(err, null);
		if(user) {

            if (user.email && bcrypt.compareSync(password, user.password)){
				callback(null, user);
			} else {
				callback("Invalid password.", null);
			}

		} else {
			callback("You are not registered. Please signup.", null);
		}
	});
};

/**
 * Encode string with hash method sha1 or md5
 *
 * @api static
 * @todo move to utils
 */
UserSchema.statics.sign = function(str, hash) {
	return require('crypto').createHash(hash).update(str.toString()).digest('hex');	
};

/**
 * Register user (not used)
 *
 * @api static
 */
UserSchema.statics.signup = function(data, callback) {
	var User = mongoose.model('User');
	var user = new User();

  //For social signups, we will not have password
  if(data.password){
    data.password = bcrypt.hashSync(data.password);
  }
	//TODO: verify whether "pre" is getting called when saving this document after updating to mongoose 3.9.8
	/*User.findOneAndUpdate({'email' : params.email}, {$set : params}, {upsert : true, new : true}, function(err, user){
		
	});*/

    User.findOne({email:{ $regex: data.email, $options: 'i'}}, function(err, user) {
        if(err){
            callback(err);
        }else
        if (user){
            callback('USER_EXISTS');
    	}else{
            // append date stamp when record was created //
            var user = new User(data);
            user.save(function (err, savedUser) {
                if (err) {
                    logger.error("In signup: Couldnt save new user: ", err);
                    callback(err);
                    return;
                } else {
                    logger.info("User '" + data.email + "' created: ");
                    callback(null, savedUser);
                }
            });
            
        }
    });

}

/* private encryption & validation methods */

UserSchema.statics.generateSalt = function()
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

UserSchema.statics.md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

UserSchema.statics.saltAndHash = function(pass, callback)
{
    var salt = this.generateSalt();
    callback(salt + this.md5(pass + salt));
}

UserSchema.statics.validatePassword = function(plainPass, hashedPass, callback)
{
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + this.md5(plainPass + salt);
    return (hashedPass === validHash);
}
/**
 * Validate user form when create or update
 *
 * @api static
 */
UserSchema.statics.validateUser = function(req) {
	req.assert(['User', 'email'], 'Please enter a valid Email').isEmail();		
  	req.assert(['User', 'username'], 'Please enter a Username').notEmpty();
  	req.assert(['User', 'first_name'], 'Please enter a Firstname.').notEmpty();
  	req.assert(['User', 'lastname'], 'Please enter a Lastname.').notEmpty();	
  	req.assert(['User', 'gender'], 'Please fill out gender.').notEmpty();	
	return req.validationErrors();
};

/**
 * Update user
 *
 * @api static
 */
UserSchema.methods.updateAll = function(user, callback) {
	var User = mongoose.model('User');
	this.username 		= user.username;
	this.first_name 	= user.first_name;
	this.lastname 		= user.lastname;
	this.email 			= user.email;
	this.gender			= user.gender;
	this.activated 	= (typeof user.activated === "undefined" ? false : true);
	
	this.save(callback);					// save the user		
};

UserSchema.statics.findUsers = function(query, fields, callback){
	this.find(query, fields, function (err, users) {
		callback(err, users);
	});
}


UserSchema.statics.getUserByPosition = (root, {email}) => {
  return new Promise((resolve, reject) => {
    mongoose.model('User').find({email:email}).exec((err, res) => {
      err ? reject(err) : resolve(res[0]);
    })
  });
};

UserSchema.statics.updateUser = (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, res) => {
      err ? reject(err): resolve(res);
    });
  });
};

UserSchema.statics.getListOfUsers = function(root, args, context){
  return new Promise((resolve, reject) => {
    mongoose.model('User').find({}).select('+email +updated_at').lean().exec((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};
UserSchema.statics.getUserByToken = function(root, args, context){
  return new Promise((resolve, reject) => {
    var jwt_utils = require(path.join(ROOT_PATH, 'app/utils', 'jwt'));
    jwt_utils.verify(context.req, context.res, function(err, user){
		if(err){
			logger.error("getUserByToken API failed %s", err);
            reject(err);
		}else{
			var User = mongoose.model('User');
			User.findOne({ email: { $regex: user.email, $options: 'i'}}).lean().exec(function (err, userDoc) {
				if(err){
                    logger.error("getUserByToken API finding user failed %s", err);
                    reject(err);
				}else{
                    userDoc.token = user.token;
                    resolve(userDoc);
                }
			});
		}
	});
  });
};

exports = module.exports = mongoose.model('User', UserSchema);
