var graphql = require('graphql');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLNonNull = graphql.GraphQLNonNull;
var GraphQLList = graphql.GraphQLList;
var GraphQLID = graphql.GraphQLID;

var User = require('./app/models/User/UserSchema.es6');
var UserQueries = require('./app/models/User/UserQueriesQL.es6');
var UserMutations = require('./app/models/User/UserMutationsQL.es6');
var UserType = require('./app/models/User/UserTypeQL.es6');

// import {
//   HobbyType,
//   HobbyQueries,
//   HobbyMutations,
//   } from './Models/Hobby/HobbyQL.es6';


let RootQuery = new GraphQLObjectType({
  name: 'Query',      //Return this type of object
  description: "First GraphQL Server Config — Yay!",
  fields: () => ({
    user: UserQueries.user,
    users: UserQueries.users,
    userByToken: UserQueries.userByToken,
    // hobbies: HobbyQueries.hobbies
  })
});


let RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addUser: UserMutations.addUser,
    // addHobby: HobbyMutations.addHobby
  })
});


let schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

module.exports = schema;
