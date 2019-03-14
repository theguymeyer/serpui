// app routes
// server-side
module.exports = function(app) {

    /* Constant and Imports */

    const homeDIR = '/var/www/html/serpui/public';

    // npm imports
    const {
        body,
        validationResult
    } = require('express-validator/check');
    const fs = require('fs');
    var https = require('https');
    var http = require('http');
    const Multipart = require('multi-part');
    var request = require("request")



    // local imports
    const createQuery = require('./getGoogleResultsJSON.js');

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
        console.log('POST: audio file received', req.body);

        console.log(req.body);

        // blobUrl = url[0];
        // console.log('blobUrl:\t', blobUrl);

        // request({
        //     url: blobUrl
        // }, function(error, response, body) {

        //     if (!error && response.statusCode === 200) {
        //         console.log(body) // Print the json response
        //     } else {
        //         console.log(error, response, body);
        //     }
        // })

        //-----------------------------------------

        // var multipart_data = new Multipart(JSON.stringify(req.body));
        // // console.log(multipart_data.opts);

        // // write to file
        // fs.writeFile(homeDIR + '/audio/sound.json', JSON.stringify(multipart_data.opts), function(err, data) {
        //     (err) ? console.log(err): console.log("Successfully Written to File.");
        // });


        // var tmp = multipart_data.opts;
        // var audioFile = '';
        // for (var i = 0; i < Object.keys(tmp).length; i++) {
        //     audioFile = audioFile + tmp[i].toString();
        //     // console.log(tmp[i]);
        // }

        // console.log(audioFile);

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