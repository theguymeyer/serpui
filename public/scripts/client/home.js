// main controller - used to control index.html
// client-side

require(['require', './scripts/localResponsiveVoice.js', './scripts/localIonSound.js'], function(r) {
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

//  --------- Attempt to record audio locally and send to server ---------
var session = {
    audio: true,
    video: false
};
var recordRTC = null;
navigator.getUserMedia(session, function(MediaStream) {
    recordRTC = RecordRTC(MediaStream);

}, err => {
    console.log(err);
});


function Start() {
    recordRTC.startRecording();
}

function Stop() {
    recordRTC.stopRecording(function(audioURL) {
        var formData = new FormData();
        formData.append('edition[audio]', recordRTC.getBlob().size);
        $.ajax({
            type: 'POST',
            url: '/voice',
            data: JSON.stringify(formData),
            // contentType: false,
            cache: false,
            processData: false,
        })

        console.log(formData);
    });
}


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