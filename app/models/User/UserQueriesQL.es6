var graphql = require('graphql');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLNonNull = graphql.GraphQLNonNull;
var GraphQLList = graphql.GraphQLList;
var GraphQLID = graphql.GraphQLID;

var UserType = require('./UserTypeQL.es6');
var User = require('./UserSchema.es6');

module.exports = {
  users: {
    type: new GraphQLList(UserType),
    resolve: User.getListOfUsers
  },
  user: {
    type: UserType,
    args: {
      email:{
        name: 'email',
        type: GraphQLString
      }
    },
    resolve: User.getUserByPosition
  },
  userByToken: {
    type: UserType,
    resolve: User.getUserByToken
  }
};
