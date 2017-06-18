var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.get('/api/user', function(req, res){
  res.json({isSuccess: true, data: {name: 'Saravanan', '_id': '53245'}});
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
var server = app.listen(3000, function() {
	  var port = server.address().port;
	  console.log("Started server at port", port);
  });