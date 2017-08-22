var express = require('express');
var path    = require('path');
var game    = require('./game');


var port = (process.argv.slice(2).length > 0) ? parseInt(process.argv.slice(2)) : 5000 ;
// setting up express server

var app = express();

// static file server

app.use('/',express.static(path.join(__dirname,'../src')));

//console.log(game.getResults)
app.get('/api/getResults', game.getResults);
//starting server


var server = app.listen(port, function () {
  console.log ('Server started on port: ' + server.address().port);
});//server start up
