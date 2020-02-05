// app.js
// NOTE: this file acts as a server.js file for now
// server-side

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;
var sport = 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname, {
    dotfiles: 'allow'
})); // root directory

// merge route.js with app
require('./routes.js')(app);


//app.listen(port);
app.listen(process.env.PORT || 5000);
// app.listen(sport);

console.log('\n\n', new Date() ,'\n\n')
console.log('App Started!', __dirname);
