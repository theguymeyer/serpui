// server-side

const e = require('dotenv').config({
    path: __dirname + '/.env'
});

// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const myUri = 'gs://recorded_audio_bucket/output.pcm';
const encoding = 'LINEAR16'; // Encoding of the audio file
const sampleRateHertz = 16000;
const languageCode = 'en-US'; // BCP-47 language code

const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
};

const audio = {
    uri: myUri,
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