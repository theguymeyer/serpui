// main controller - used to control index.html
// client-side

// './scripts/localIonSound.js'

require(['require', './scripts/localResponsiveVoice.js'], function(r) {
    console.log("Reached: Main Controller");
});

/* Variables */

// Globals Variables
var flag_recording = false; // true when recording
var flag_audioRecorded = false;
var myUrl = 'https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript';
// var audioChunks;
var audioBuffer = [];

/* Request Media Devices 

navigator.mediaDevices.getUserMedia({
        audio: true
    })
    .then(onSteamGetSuccess)
    .catch(onStreamGetFailure);

*/

var mediaRecorder;
var audio;
var audioChunks;
var rawAudio;
var formData

//  --------- Attempt to record audio locally only ---------
navigator.mediaDevices.getUserMedia({
        audio: true
    })
    .then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, {
                type: "audio/wav"
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            audio = new Audio(audioUrl);


            // GET request to get raw audio
            $.get(audio.src, d => {
                rawAudio = d;

                // add to form
                formData = new FormData();
                formData.append("rawAudioData", rawAudio);

                // Send to server
                $.ajax({
                    type: 'POST',
                    url: '/voice',
                    data: audioUrl,
                    // contentType: false,
                    cache: true,
                    processData: false,
                })
            })

        });

        // setTimeout(() => {
        //     mediaRecorder.stop();
        // }, 3000);
    });

function Start() {
    mediaRecorder.start();
    console.log('Started....');
}

function Stop() {
    mediaRecorder.stop();
    flag_audioRecorded = true;
    console.log('Stopped....');
}


function openTab(url) {

}


/* --------- JoyCon --------- */

// this function is invoked by getJoyCon.js interface
//      INPUT: buttonObject = { "id": int, "name": string }
function buttonRequest(buttonObject) {

    buttonID = buttonObject.id;

    switch (buttonID) {
        case "A": // unused
            openTab(myUrl);
            break;
        case "X": // Start Recording
            (!flag_recording) ? Start(): console.log('Not Recording (Press B)...');
            flag_recording = true;
            break;
        case "B": // Stop Recording
            (flag_recording) ? Stop(): console.log('Recording (Press X)');
            flag_recording = false;
            break;
        case "Y": // unused
            (flag_audioRecorded) ? audio.play(): console.log('No Recordings Found (Press B)');
            break;
        case "R": // unused 
            // TTS(getUserLocation());
            break;
        case "RT": // TODO: repeat current text 
            // TTS(getNeutralText());
            break;
        case "RSR": // + 5%
            changeVolume("up", optionsTTS);
            break;
        case "RSL": // - 5% 
            changeVolume("down", optionsTTS);
            break;
        case "HOME": // TODO: refresh page
            // goHome();
            break;
        default:
            console.log("Invalid Button");
    }
}