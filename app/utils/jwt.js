"use strict";

var path = require('path'),
    jsonwebtoken = require("jsonwebtoken"),
    TOKEN_EXPIRATION = 60,
    TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60,
    invalid_token_str = 'invalid_token';

/**
 * Find the authorization headers from the headers in the request
 *
 * @param headers
 * @returns {*}
 */
module.exports.fetch = function (headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        if (part.length === 2) {
            var token = part[1];
            return part[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

/**
 * Creates a new token for the user that has been logged in
 *
 * @param user
 * @param req
 * @param res
 * @param next
 *
 * @returns {*}
 */
module.exports.create = function (user, req, res, next) {
    // if (_.isEmpty(user)) {
    //     return next(new Error('User data cannot be empty.'));
    // }

    var data = {
        // _id: user._id,
        // username: user.username,
        // access: user.access,
        // name: user.name,
        email: user.email,
        token: jsonwebtoken.sign({ email: user.email }, app_config.jwt_secret, {
            // expiresIn: TOKEN_EXPIRATION
        })
    };

    var decoded = jsonwebtoken.decode(data.token);

    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    redisClient.set(data.token, JSON.stringify(data), function (err, reply) {
        if (err) {
            return next(new Error(err));
        }

        if (reply) {
            redisClient.expire(data.token, TOKEN_EXPIRATION_SEC, function (err, reply) {
                if (err) {
                    return next(new Error("Can not set the expire value for the token key"));
                }
                if (reply) {
                    req.user = data;
                    next(); // we have succeeded
                } else {
                    return next(new Error('Expiration not set on redis'));
                }
            });
        }
        else {
            return next(new Error('Token not set in redis'));
        }
    });

    return data;

};

/**
 * Fetch the token from redis for the given key
 *
 * @param id
 * @param done
 * @returns {*}
 */
module.exports.retrieve = function (id, done) {
    // if (_.isNull(id)) {
    //     return done(new Error("token_invalid"), {
    //         "message": "Invalid token"
    //     });
    // }

    redisClient.get(id, function (err, reply) {
        if (err) {
            return done(err, {
                "message": err
            });
        }

        if (!reply) {
            return done(new Error(invalid_token_str), {
                "message": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
            });
        } else {
            var data = JSON.parse(reply);
            if (data.token === id) {
                return done(null, data);
            } else {
                return done(new Error(invalid_token_str), {
                    "message": "Token doesn't exists, login into the system so it can generate new token."
                });
            }

        }

    });

};

/**
 * Verifies that the token supplied in the request is valid, by checking the redis store to see if it's stored there.
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.verify = function (req, res, next) {

    var token = exports.fetch(req.headers);

    jsonwebtoken.verify(token, app_config.jwt_secret, function (err, decode) {

        if (err) {
            // req.user = undefined;
            return next(new Error("UnauthorizedAccessError"), {
                    "message": "You are not allowed to view this!"
                });
        }

        exports.retrieve(token, function (err, data) {

            if (err) {
                // req.user = undefined;
                return next(new Error(invalid_token_str), {
                    "message": "You are not allowed to view this!"
                });
            }

            // req.user = data;
            next(null, data);

        });

    });
};

/**
 * Expires the token, so the user can no longer gain access to the system, without logging in again or requesting new token
 *
 * @param headers
 * @returns {boolean}
 */
module.exports.expire = function (headers) {

    var token = exports.fetch(headers);

    if (token !== null) {
        redisClient.expire(token, 0);
    }

    return token !== null;

};

/**
 * Middleware for getting the token into the user
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.middleware = function () {

    var func = function (req, res, next) {

        var token = exports.fetch(req.headers);

        exports.retrieve(token, function (err, data) {

            if (err) {
                req.user = undefined;
                return next(new Error(invalid_token_str), {
                    "message": "You are not allowed to view this!"
                });
            } else {
                req.user = require('util')._extend(req.user, data);
                next();
            }

        });
    };

    func.unless = require("express-unless");

    return func;

};

module.exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
module.exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;
module.exports.invalid_token = invalid_token_str;
