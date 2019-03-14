// server-side

const e = require('dotenv').config({
    path: __dirname + '/.env'
});

// Imports the Google Cloud client library
const fs = require('fs');
const https = require('https');
const http = require('http');

const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */

const filename = 'blob:http://localhost:3000/eaf7564a-30f3-49b6-9d14-0a3ad0f3a211'; //'/var/www/html/serpui/public/audio/output.pcm';
const encoding = 'LINEAR16'; // Encoding of the audio file
const sampleRateHertz = 16000;
const languageCode = 'en-US'; // BCP-47 language code

// --------attempt at http get--------
var c = {
    responseType: 'blob'
};

https.get(filename, c, d => {
    console.lo('Raw Audio Content', d);
    fs.writeFile('sound.wav', d, err => {
        console.log(err);
    })
})

// ------------------------------------

const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
};

const audio = {
    content: fs.readFileSync(filename).toString('base64'),
};

const request = {
    config: config,
    audio: audio,
};

// Detects speech in the audio file
async function detect() {
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: `, transcription);
};

detect();