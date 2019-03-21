// main controller - used to control index.html
// client-side

// './scripts/localIonSound.js'

require(['require', './scripts/localResponsiveVoice.js'], function(r) {
    console.log("Reached: Main Controller");
});

/* Variables */

// Globals Variables
var flag_recording = false; // true when recording
var final_transcript = '';
// var form = document.getElementById("formDiv");

// TTS constants
const optionsTTS = {
    borderTxt: "border",
    voice: "UK English Male",
    vol_max: 100,
    vol_min: 0,
    vol_step: 5,
};
optionsTTS.vol_curr = eval((optionsTTS.vol_max + optionsTTS.vol_min) / 2);


/* ----- STT setup ----- */

// STT google API - https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
if (!('webkitSpeechRecognition' in window)) {
    // upgrade();
    console.log("ERROR: No webkitSpeechRecognition... need to upgrade");
} else {

    var recog = new webkitSpeechRecognition();
    recog.continuous = true; // keeps recording when user not speaking
    recog.interimResults = true; // real-time STT results


    /* ----- Recognition STT Handlers ----- */

    recog.onstart = function() {
        console.log("Started STT");

        // add bkgd recording color
        changeBkgd("green");
    }

    recog.onresult = function(event) {
        console.log("New STT Result");

        var interim_transcript = '';

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        setFormValue(interim_transcript, 'grey');
    }

    recog.onerror = function(err) {
        console.log("STT ERROR: ", err);

        // Error bkgd recording color
        changeBkgd("red");
    }

    recog.onend = function() {
        console.log("STT Finished!");

        // set transcription to form value
        setFormValue(final_transcript, 'black');

        // remove bkgd recording color
        changeBkgd("white");
    }

}

/* ----- Local Functions ----- */

function changeBkgd(color) {
    var form = document.getElementById("formDiv");
    form.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
}

function setFormValue(txt, color) {
    var entry = document.getElementById("txtEntry");
    entry.value = txt;
    entry.style.color = color;
}


/* ----- User Functionality ----- */

function Start() { // start recording
    recog.start();
}

function Stop() { // stop recording
    final_transcript = final_transcript + " "; // prep for more text
    recog.stop();
}

function Clear() { // clear recording buffer
    final_transcript = '';
    setFormValue(final_transcript);
}

function ClarifySTT() { // read back recording buffer
    TTS(final_transcript);
}

function submit() {
    if (final_transcript != "") { // dont submit empty query
        var subBtn = document.getElementById("submitBtn");
        subBtn.click();
    } else {
        TTS("Cannot Submit Empty Query");
        Clear(); // clear any false positives
    }
}

/* ----- JoyCon ----- */

// this function is invoked by getJoyCon.js interface
//      INPUT: buttonObject = { "id": int, "name": string }
function buttonRequest(buttonObject) {

    buttonID = buttonObject.id;

    switch (buttonID) {
        case "A": // submit
            submit();
            break;
        case "X": // Start Recording
            (!flag_recording) ? Start(): console.log('Not Recording (Press B)...');
            flag_recording = true;
            break;
        case "B": // Stop Recording
            (flag_recording) ? Stop(): console.log('Recording (Press X)');
            flag_recording = false;
            break;
        case "Y": // clear buffer
            Clear();
            break;
        case "R": // unused 
            // TTS(getUserLocation());
            break;
        case "RT": // Repeat current STT buffer text 
            (!flag_recording) ? ClarifySTT(): TTS("Press Stop")
            break;
        case "RSR": // + 5%
            changeVolume("up", optionsTTS);
            break;
        case "RSL": // - 5% 
            changeVolume("down", optionsTTS);
            break;
        case "HOME": // TODO: refresh page
            document.location.reload(true);
            break;
        case "PLUS": // stop talking
            TTS("");
            break;
        default:
            console.log("Invalid Button");
    }
}