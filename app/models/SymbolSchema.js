var graphql = require('graphql');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLString = graphql.GraphQLString;
var GraphQLList = graphql.GraphQLList;

let SymbolSchema = this;
let graphQLFields = {
    link_src : {type: GraphQLString},
    link_track : {type: GraphQLString},
    pdt_dis_nm : {type: GraphQLString},
    sc_id : {type: GraphQLString},
    sc_sector : {type: GraphQLString},
    sc_sector_id : {type: GraphQLString},
    stock_name : {type: GraphQLString},
};
SymbolSchema.getGraphQLGetQueries = function () {
    var type = new GraphQLObjectType({
        name: 'Symbol',
        description: 'Symbol type',
        fields: () => (graphQLFields)
    });
    return {
        searchSymbol: {
            type: new GraphQLList(type),
            resolve: SymbolSchema.getSymbols
        }
    };
}
SymbolSchema.getSymbols = function(root, args, context){
    return new Promise((resolve, reject) => {
        var params = context.req.body;
        var http = require('http');
        var async = require('async');
        var data = [];
        var stockName = params.search.stock;
            var options = { 
            host: 'www.moneycontrol.com',
            path: '/mccode/common/autosuggesion.php?query='+escape(stockName)+'&type=1&format=json'
            };

            callback = function(response) {
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function () {
                    var localData = {};
                    if(str){
                        var data = JSON.parse(str);
                        data.sort(function (a, b) {
                            nameA = a.stock_name;
                            nameB = b.stock_name;
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            // names must be equal
                            return 0;
                        });
                        resolve(data);
                    }else{
                        reject({message: 'Not able to fetch data!!!'});
                    }
                });
            }

            http.request(options, callback).end();
    });
};

exports = module.exports = SymbolSchema;