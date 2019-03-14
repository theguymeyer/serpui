// main controller - used to control index.html
// client-side

// './scripts/localIonSound.js'

require(['require', './scripts/localResponsiveVoice.js'], function(r) {
    console.log("Reached: Main Controller");
});

/* Variables */

// Globals Variables
var flag_recording = false; // true when recording
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
    console.log('Stopped....');
}


//  --------- Attempt to record audio locally and send to server ---------
/*

var session = {
    audio: true,
    // video: false
};
var recordRTC = null;
var formData = new FormData();
navigator.getUserMedia(session, function(MediaStream) {
    recordRTC = RecordRTC(MediaStream);
    recordRTC.mimeType = 'audio/webm';

    recordRTC.stopRecording(function(audioURL) {

        var blobOBJ = recordRTC.getBlob();
        formData.append('edition[audio]', blobOBJ);

        console.log(JSON.stringify(blobOBJ));
        // console.log(formData);
    });

}, err => {
    console.log(err);
});


function Start() {
    recordRTC.startRecording();
}


function Stop() {
    $.ajax({
        type: 'POST',
        url: '/voice',
        data: formData,
        // contentType: false,
        cache: false,
        processData: false,
    })

}
*/

/*  --------- Attempt to send audio stream to server ---------
var session = {
    audio: true,
    video: false
};
var recordRTC = null;

// Detect Browser Type 
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

navigator.getUserMedia(session, initializeRecorder, function(e) {
    console.log(e); //Error
});


// Binary Client Setup
var client = new BinaryClient('ws://localhost:3000');
client.on('open', function() {
    console.log(2);
    // for the sake of this example let's put the stream in the window
    window.Stream = client.createStream();
})

function initializeRecorder(stream) {
    console.log(1);
    var audioContext = window.AudioContext;
    var context = new audioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;

    // create a javascript node
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);

    // specify the processing function
    recorder.onaudioprocess = recorderProcess;

    // connect stream to our recorder
    audioInput.connect(recorder);

    // connect our recorder to the previous destination
    recorder.connect(context.destination);
    console.log(1.1);
}

function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
}

function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    // console.log(convertFloat32ToInt16(left));
    // document.write(convertFloat32ToInt16(left));
}

*/

/* Functions */

/* --------- Audio Recording --------- 

function onStreamGetFailure() {
    console.log("Recording Failure!!!");
}

// audio stream handler
function onSteamGetSuccess(stream) {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = onDataAvailable;
    // recorder.start();
}

function onDataAvailable(e) {
    if (e.data) {
        audioBuffer.push(e.data);
    }
}

// blob -> URL
function bufferToDataUrl(callback) {
    var blob = new Blob(audioBuffer, {
        type: 'audio/ogg'
    });

    var reader = new FileReader();
    reader.onload = function() {
        callback(reader.result);
    }

    reader.readAsDataURL(blob);
}

// URL -> File
function dataUrlToFile(dataUrl) {
    var binary = atob(dataUrl.split(',')[1]),
        data = [];

    for (var i = 0; i < binary.length; i++) {
        data.push(binary.charCodeAt(i));
    }

    return new File([new Uint8Array(data)], 'recorded-audio.ogg', {
        type: 'audio/ogg'
    })
}

// Stop Recording
function Stop() {
    try {
        recorder.stop();
        var tmp = recorder.stream.getTracks().forEach(function(track) {
            track.stop();
        });
        console.log(tmp);
    } catch (e) {
        console.log(e);
    }

    bufferToDataUrl(function(dataUrl) {

        console.log({
            data: dataUrl
        });
        var file = dataUrlToFile(dataUrl);
        GETgoogleSTT(file);
    })
}

// Start Recording
function Start() {
    recorder.start();
}


// Send recording to server
function GETgoogleSTT(file) {

    console.log(file);

    $.get('/voice', {
        file: file
    }).done(function(data) {
        console.log(file);
    });

}
*/

/* --------- JoyCon --------- */

// this function is invoked by getJoyCon.js interface
//      INPUT: buttonObject = { "id": int, "name": string }
function buttonRequest(buttonObject) {

    buttonID = buttonObject.id;

    switch (buttonID) {
        case "A": // unused
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
            audio.play();
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