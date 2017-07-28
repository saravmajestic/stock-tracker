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
  addUser:{
    type:UserType,
    args: {
      first_name:{
        name:'first_name',
        type:new GraphQLNonNull(GraphQLString)
      },
      email:{
        name:'email',
        type: new GraphQLNonNull(GraphQLString)
      },
      // age:{
      //   name:'age',
      //   type: GraphQLInt
      // }
    },
    resolve: (root, {email}) => {
      var newUser = new User({email:email/*, surname:surname, age:age*/});

      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err): resolve(res);
        });
      });
    }
  }
};
