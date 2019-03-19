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
    var request = require("request");
    var html2json = require('html2json').html2json;
    var htmlToJson = require('html-to-json');
    var read = require('node-read');
    var striptags = require('striptags');


    // local imports
    const createQuery = require('./getGoogleResultsJSON.js');
    const getHTMLContent = require('./getWebpageContents.js');

    /* ---------- Routes ---------- */

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

            // Works! In order to get the 'message body' do: req.body

            var queryObj = new Object({
                data: req.body.userQuery
            });
            console.log(queryObj);

            // createQuery() exported from /scripts/getGoogleResultsJSON.js
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

    // POST request voice transcriptions
    app.post('/voice', (req, res) => {
        console.log('POST: audio file received', req.body);

        console.log(req.body);

    });

    app.post('/externalSite', (req, res) => {
        console.log(req.body.url);

        read(req.body.url, function(err, article, response) {

            if (!(article.content)) {
                res.send("Incompatible Site");
            } else {

                console.log(striptags(article.content));

                res.send(striptags(article.content));
            }

        })



        /*

        // console.log(getHTMLContent(req.body.url));
        http.createServer(getHTMLContent(req.body.url), (content) => {
            // console.log('____This is my response for POST____');

            console.log('My Data', content);

            res.send(content);
        })

        */


    })

};