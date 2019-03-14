// app.js
// NOTE: this file acts as a server.js file for now
// server-side

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('/var/www/html/serpui/public')); // root directory

// merge route.js with app
require('./routes.js')(app);

app.listen(port);


console.log('App Started!');