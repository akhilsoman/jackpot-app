var express = require('express');
var path    = require('path');

var port = 5000;
// setting up express server

var app = express();

// static file server

app.use('/',express.static(path.join(__dirname,'../src')));

//starting server


var server = app.listen(port, function () {
  console.log ('Server started on port: ' + server.address().port);
});//server start up
