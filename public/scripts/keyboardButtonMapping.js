// keyboard mapping - used to map keyboard keys to joycon actions 
// client-side

/* ----- Key Binding - Keyboard ----- */

var keyMap = {
    "LEFT": 37, // arrow keys
    "UP": 38,
    "RIGHT": 39,
    "DOWN": 40,
    "REPEAT": 16, // shift
    "LOCATION": 32, // space 
    "HOME": 17, // ctrl
    "STOP-esc": 27, // escs
    "STOP-alt": 18 // alt
}

// This event maps keyboard buttons to buttonObject requests
// does not include volume control

document.onkeydown = pressedKey; // assign handler

function pressedKey(e) {
    e = e || window.event;

    var keyObject = {
        active: false,
        duration: 1,
        id: ""
    };

    console.log(e.keyCode);

    switch (e.keyCode) {
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

        case keyMap["STOP-esc"]: // Stop TTS - 1
        case keyMap["STOP-alt"]:
            keyObject.id = "PLUS";
            break;

        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)

    buttonRequest(keyObject);
}