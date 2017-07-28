var graphql = require('graphql');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLNonNull = graphql.GraphQLNonNull;
var GraphQLList = graphql.GraphQLList;
var GraphQLID = graphql.GraphQLID;

var User = require('./UserSchema.es6');

//Get fields
var fields = {};
var paths = User.schema.paths;
for(var fieldName in paths){
  if(fieldName === '__v'){
    continue;
  }
  var type = paths[fieldName].instance;
  if(type === 'ObjectID'){
    type = GraphQLID;
  }else if(type === 'Number'){
    type = GraphQLInt;
  }else{//Default
    type = GraphQLString;
  }
  fields[fieldName] = {type: type};
}

module.exports = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: () => (fields)
});
