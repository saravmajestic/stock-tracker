var path = require('path'),
    auth = require(ROOT_PATH + '/app/controllers/auth'),
    home = require(ROOT_PATH + '/app/controllers/home');
var graphql = require('graphql');
var schema = require('./schema.es6');
var graphqlHTTP = require('express-graphql');

module.exports = function (server) {

    //Auth related routes
    server.post('/api/users/signup', auth.signup);
    server.post('/api/user/logout', auth.logout);
    server.post('/api/user/login', auth.login);

    server.use('/api/graphql', (req, res) => {
        return graphqlHTTP({
            schema: schema,
            graphiql: (ENV !== 'production'),
            context: { req, res },
        })(req, res);
    });

    //Send files ending with html - ng includes for main index.html
    server.get(/\.html$/, function (req, res, next) {
        res.render(path.join(ROOT_PATH, '/views/' + req.path), {});
    });

    //TODO: if we have * then it will match all routes and will be a overhead in server
    //This should serve only index page and routes defined in angular
    server.get('*', home.index);

};
