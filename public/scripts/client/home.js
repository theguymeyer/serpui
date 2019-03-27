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
Synth instanceof AudioSynth; // audio object 
var piano = Synth.createInstrument('piano');

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
    piano.play('C', 2, 1);
}

function Stop() { // stop recording
    final_transcript = final_transcript + " "; // prep for more text
    recog.stop();
    piano.play('G', 3, 1);
}

function Clear() { // clear recording buffer
    final_transcript = '';
    setFormValue(final_transcript);
    piano.play('E', 3, 1);
}

function ClarifySTT() { // read back recording buffer
    TTS(final_transcript);
}

function Submit() {
    if (_.trim(final_transcript) != "") {
        // dont submit empty query
        var subBtn = document.getElementById("submitBtn");
        subBtn.click();
    } else {
        TTS("Cannot Submit Empty Query");
        Clear(); // clear any false positives
    }
}

// Disables all buttons and explains what a pressed button does
// function helpMe() {

// }

/* ----- Key Binding - JoyCon ----- */

// this function is invoked by getJoyCon.js interface
//      INPUT: buttonObject = { "id": int, "name": string }
function buttonRequest(buttonObject) {

    console.log('buttonObject', buttonObject);

    buttonID = buttonObject.id;

    switch (buttonID) {
        case "A": // submit - RIGHT
            Submit();
            break;
        case "X": // Start Recording - UP
            (!flag_recording) ? Start(): console.log('Not Recording (Press DOWN)...');
            flag_recording = true;
            break;
        case "B": // Stop Recording - DOWN
            (flag_recording) ? Stop(): console.log('Recording (Press UP)');
            flag_recording = false;
            break;
        case "Y": // clear buffer - LEFT
            Clear();
            break;
        case "R": // unused 
            TTS("Home Page. Press up to record a query");
            break;
        case "RA": // Joystick - Helper Mode
            console.log("TODO: Key Helper Function");
            // helpMe(); 
            break;
        case "RT": // Repeat current STT buffer text 
            (!flag_recording) ? ClarifySTT(): TTS("Press Stop (B Button)");
            break;
        case "RSR": // + 5%
            changeVolume("up", optionsTTS);
            break;
        case "RSL": // - 5% 
            changeVolume("down", optionsTTS);
            break;
        case "HOME": // refresh page
            document.location.reload(true);
            break;
        case "PLUS": // stop talking
            TTS("");
            break;
        default:
            console.log("Invalid Button... ID:", buttonObject.id);
    }
}


/* ----- Key Binding - Keyboard ----- */

var keyMap = {
    "LEFT": 52,
    "UP": 56,
    "RIGHT": 54,
    "DOWN": 50,
    "REPEAT": 53,
    "LOCATION": 48,
    "HOME": 55,
    "STOP": 49
}

// This event maps keyboard buttons to buttonObject requests
// does not include volume control
$(document).keypress(function(e) {

    var keyObject = {
        active: false,
        duration: 1,
        id: ""
    };

    switch (e.which) {
        case keyMap["LEFT"]: // left - 4
            keyObject.id = "Y";
            break;

        case keyMap["UP"]: // up - 8
            keyObject.id = "X";
            break;

        case keyMap["RIGHT"]: // right - 6
            keyObject.id = "A";
            break;

        case keyMap["DOWN"]: // down - 2
            keyObject.id = "B";
            break;

        case keyMap["REPEAT"]: // Repeat Tile - 5
            keyObject.id = "RT";
            break;

        case keyMap["LOCATION"]: // User Location - 0
            keyObject.id = "R";
            break;

        case keyMap["HOME"]: // Home - 7
            keyObject.id = "HOME";
            break;

        case keyMap["STOP"]: // Stop TTS - 1
            keyObject.id = "PLUS";
            break;

        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)

    buttonRequest(keyObject);

});