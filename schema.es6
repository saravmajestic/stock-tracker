var graphql = require('graphql');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLSchema = graphql.GraphQLSchema;

var rootQueries = {};
var mutationQueries = {};

var User = require('./app/models/UserSchema.es6');
Object.assign(rootQueries, User.getGraphQLGetQueries());
Object.assign(mutationQueries, User.getMutationQueries());

var Symbol = require('./app/models/SymbolSchema');
Object.assign(rootQueries, Symbol.getGraphQLGetQueries());

let RootQuery = new GraphQLObjectType({
  name: 'Query',      //Return this type of object
  description: "Get calls",
  fields: () => (rootQueries)
});

let RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => (mutationQueries)
});


let schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

module.exports = schema;
