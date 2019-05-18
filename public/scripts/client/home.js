// main controller - used to control index.html
// client-side

require(['require', './scripts/localResponsiveVoice.js', './scripts/keyboardButtonMapping.js'], function(r) {
    console.log("Reached: Main Controller");
    TTS("Home Page");

    document.getElementById('txtEntry').focus();
    document.getElementById('txtEntry').select();

});

/* Variables */

// Globals Variables
var flag_recording = false; // true when recording
var final_transcript = '';
Synth instanceof AudioSynth; // audio object 
var piano = Synth.createInstrument('piano');
var recog;

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

    recog = new webkitSpeechRecognition();
    recog.continuous = true; // keeps recording when user not speaking
    recog.interimResults = true; // real-time STT results


    /* ----- Recognition STT Handlers ----- */

    recog.onstart = function() {
        console.log("Started STT");

        // add bkgd recording color
        changeBkgd("blue");
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
        changeBkgd("black");
    }

}

/* ----- Local Functions ----- */

function changeBkgd(color) {
    document.body.style['background'] = color;
}

function setFormValue(txt, color) {
    var entry = document.getElementById("txtEntry");
    entry.value = txt;
    entry.style.color = color;
}


/* ----- User Functionality ----- */

function Start() { // start recording
    recog.start();
    piano.play('G', 3, 1);
}

function Stop() { // stop recording
    final_transcript = final_transcript + " "; // prep for more text
    recog.stop();
    piano.play('C', 3, 1);
}

function Clear() { // clear recording buffer
    final_transcript = '';
    setFormValue(final_transcript);
    piano.play('E', 3, 1);
}

function ClarifySTT() { // read back recording buffer
    if (!(isTextFieldEmpty())) {
        TTS(getTextFieldValue());
    } else {
        TTS("Empty Query");
    }
}

function Submit() {
	console.log(getTextFieldValue(), "Text Field value");

    if (!(isTextFieldEmpty())) {
        // dont submit empty query
        var subBtn = document.getElementById("submitBtn");
        subBtn.click();
    } else {
        TTS("Cannot Submit Empty Query");
        Clear(); // clear any false positives
    }
}

function getTextFieldValue() {
    return document.getElementById('txtEntry').value;
}

function isTextFieldEmpty() {
    return $.trim(getTextFieldValue()) == "";
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
            (flag_recording) ? null: Submit();
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
            (flag_recording) ? null: Clear();
            break;
        case "R": // unused 
            (flag_recording) ? TTS("I'm listening! Press down to submit your query"): TTS("Home Page. Press up to record a query");
            break;
        case "RA": // Joystick - Helper Mode
            console.log("TODO: Key Helper Function");
            // helpMe(); 
            break;
        case "RT": // Repeat current STT buffer text 
            (!flag_recording) ? ClarifySTT(): TTS("Press down to stop recording");
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
