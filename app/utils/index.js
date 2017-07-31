var graphql = require('graphql');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLNonNull = graphql.GraphQLNonNull;
var GraphQLList = graphql.GraphQLList;
var GraphQLID = graphql.GraphQLID;

exports.getFields = function (paths, name, desc) {
    //Get fields
    var fields = {};
    for (var fieldName in paths) {
        if(fieldName === '__v'){
            continue;
        }
        var type = paths[fieldName].instance;
        if (type === 'ObjectID') {
            type = GraphQLID;
        } else if (type === 'Number') {
            type = GraphQLInt;
        } else {//Default
            type = GraphQLString;
        }
        fields['_id'] = { type: GraphQLID };
        fields[fieldName] = { type: type };
    };
    return new GraphQLObjectType({
        name: name,
        description: desc,
        fields: () => (fields)
    });
}