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
app.use(express.static('/var/www/html/firstApp/public')); // root directory

// merge route.js with app
require('./routes.js')(app);

app.listen(port);

// Add Binary Server
var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var server = binaryServer({
    server: app
});

// Action on established connection
server.on('connection', function(client) {
    console.log('HERE');
    var fileWriter = null;

    // On start of stream
    client.on('stream', function(stream, meta) {
        var fileWriter = new wav.FileWriter('/audio/test.wav', {
            channels: 1,
            sampleRate: 48000,
            bitDepth: 16
        });
        stream.pipe(fileWriter);
        stream.on('end', function() {
            fileWriter.end();
        });
    });

    client.on('close', function() {
        if (fileWriter != null) {
            fileWriter.end();
        }
    });
});

console.log('App Started!');