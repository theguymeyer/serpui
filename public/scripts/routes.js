// app routes
// server-side
module.exports = function(app) {

    /* Constant and Imports */

    const homeDIR = '/var/www/html/firstApp/public';
    const {
        body,
        validationResult
    } = require('express-validator/check');
    const fs = require('fs');
    var https = require('https');
    var http = require('http');

    const createQuery = require('./getJSON_new.js');
    const Transform = require('stream').Transform;
    const parser = new Transform();

    /* Routes */

    // GET request to go Home (ie. Query entry page)
    app.get('/home', (req, res) => {
        // require(__dirname + '/client/index.js');
        res.sendFile(homeDIR + '/views/index.html', function(err) {
            if (err) {
                console.log('ERROR in transmission');
                res.status(err.status).end();
            }
        });
        console.log('/home');

    });

    // POST request for entering SERP
    app.post('/results', (req, res) => {

        // console.log('/test');
        // console.log(req.body.userQuery);

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('ERRORS');
        } else {

            // Works! In order to get the message body do: req.body

            var queryObj = new Object({
                data: req.body.userQuery
            });
            console.log(queryObj);

            // createQuery() exported from /scripts/getJSON_new.js
            createQuery(queryObj.data).then(q => {

                fs.writeFile(homeDIR + '/db/resultData.json', JSON.stringify(q), function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(`The JSON data file for ${queryObj.data} was saved!`);
                });

                res.sendFile(homeDIR + '/views/results.html', function(err) {
                    if (err) {
                        console.log('ERROR in transmission');
                        res.status(err.status).end();
                    }
                });
                console.log('/results');

            });

        }

    });

    app.post('/voice', (req, res) => {
        console.log('POST: audio file received')
        console.log(req);



        /*

        var url = req.query.link;
        url = url.replace('blob:', '');
        console.log(url);

        var file = fs.createWriteStream(homeDIR + '/audio/test.wav');
        var request = http.get(url, function(response) {
            response.pipe(file);
        });
        */

    });

};