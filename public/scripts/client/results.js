// se results controller (similar to serpManager...)
// client-side

/* SERP Manager */

require(['require', './scripts/SEResult.js', './scripts/localResponsiveVoice.js'], function(r) {
    console.log("Reached: serpManager");
});

/* Variables */

// Global Variables
var resultsList = [];
var user = {
    resultPos: null,
    contentPos: null
};
const borderTEXT = "!";

// TTS constants
const optionsTTS = {
    borderTxt: "border",
    voice: "UK English Male",
    vol_max: 100,
    vol_min: 0,
    vol_step: 5,
};
optionsTTS.vol_curr = eval((optionsTTS.vol_max + optionsTTS.vol_min) / 2);

// Colour Scheme
const colourScheme = {
    borderBkgd: "#ff0000",
    borderText: "white",
    activeBkgd: "#cbb4a9",
    activeText: "black",
}


/* Functions */

// determines arrangement and content of every tile - organizes db
function setupSERP() {

    console.log("Executing: Setup SERP function");

    // jQuery request JSON query data from server 
    $.get('/db/resultData.json', function(data) {
        console.log(data);
        generateResultsList(data);
    })


};

function generateResultsList(data) {

    // Creating SE Result objects for each result
    var results = data.items;
    var pos = 0;
    for (var key in results) {
        if (results.hasOwnProperty(key)) {
            var tmpOBJ = new SEResult(results[key], pos);
            tmpOBJ.createObject();
            resultsList.push(tmpOBJ);

            pos++;
        }
    };

    initSERP();
}

// create initial state SERP
function initSERP() {
    // start at title of Result 1
    user = $.extend(user, {
        resultPos: 0,
        contentPos: 1
    });

    planSERP();
}

// set content of tiles to draw SERP - only requires user positioning
function planSERP() {
    var currentResult = getCurrentResult();
    var currBorders = getBorders(user);

    tiles = [borderTEXT, borderTEXT, user.resultPos + 1, borderTEXT, borderTEXT];

    for (i = 0; i < currBorders.length; i++) {
        if (!(currBorders[i])) {
            if (i == 0) {
                tiles[0] = cleanText(currentResult[resultsList[user.resultPos].getKeyPosition(user.contentPos)]);
            } else if (i == 1) {
                tiles[1] = "Result " + (user.resultPos);
            } else if (i == 2) {
                tiles[2] = currentResult[resultsList[user.resultPos].getKeyPosition(user.contentPos - 1)];
            } else if (i == 3) {
                tiles[3] = "Result " + (user.resultPos + 2);
            } else if (i == 4) {
                tiles[4] = currentResult[resultsList[user.resultPos].getKeyPosition(user.contentPos + 1)];
            } else {
                console.log("Error: Incorrect Border Count " + i)
            }

        }
    }

    drawSERP(tiles);

    console.log("\nNEUTRAL STATUS:");
    console.log("USER:", user);
    console.log("BORDERS:", currBorders);
    console.log("CURRENT RESULT DATA:", currentResult);
    console.log("\n");
}

// implements the plan ( planSERP() )
function drawSERP(tilesData) {

    // assignment order: neutral -> front -> left -> back -> right
    elementIDs = ['neutralButton', 'frontButton', 'leftButton', 'backButton', 'rightButton']

    for (var i = 0; i < tilesData.length; i++) {

        currButton = document.getElementById(elementIDs[i])
        currButton.innerHTML = tilesData[i];

        // change colour for borders - TODO: user chooses colours
        elem = document.getElementById(elementIDs[i]);
        if (tilesData[i] == borderTEXT || tilesData[i] == (user.resultPos + 1)) {
            elem.style.background = colourScheme.borderBkgd;
            elem.style.color = colourScheme.borderText;
        } else {
            elem.style.background = colourScheme.activeBkgd;
            elem.style.color = colourScheme.activeText;
        }

        // Adjust font size to button size
        if (elementIDs[i] == 'neutralButton') {
            textFit(document.getElementById(elementIDs[i]), {
                multiLine: true,
                minFontSize: 50,
                maxFontSize: 100,
                alignHoriz: true,
                alignVert: true,
                widthOnly: false
            });
        } else {
            textFit(document.getElementById(elementIDs[i]), {
                multiLine: true,
                minFontSize: 15,
                maxFontSize: 100
            });
        }
    }


    // dictate to user position if on first content tile
    if (user.contentPos == 1) {
        TTS("Result" + (user.resultPos + 1) + ". Title. " + tilesData[0], optionsTTS);
    } else {
        // dictate neutral tile content - ALWAYS
        TTS(tilesData[0], optionsTTS);
    }
}

// maximum user result position
function getMaxPosition() {
    return resultsList.length - 1;
}

// maximum user content position for unique result
function getMaxContentPos(result) {
    return Object.keys(result).length - 1; // -1 since 'position' doesnt count
}

// the tile object of the current user result position
function getCurrentResult() {
    return currentResult = resultsList[user.resultPos].getTiles();
}

// returns an array indicating current exisiting borders
function getBorders() {
    // borders = [neutral, front, left, back, right]
    var borders = [false, false, false, false, false];

    // results
    if (user.resultPos == 0) {
        borders[1] = true;
        borders[3] = false;
    } else if (user.resultPos == getMaxPosition()) {
        borders[1] = false;
        borders[3] = true;
    } else if (user.resultPos == 0 && resultsList.length == 1) {
        borders[1] = true;
        borders[3] = true;
    } else {
        borders[1] = false;
        borders[3] = false;
    }

    // content
    if (user.contentPos == 1) {
        borders[2] = true;
        borders[4] = false;
    } else if (user.contentPos == getMaxContentPos(getCurrentResult())) {
        borders[2] = false;
        borders[4] = true;
    } else if (getMaxContentPos(getCurrentResult()) == 1) {
        borders[2] = true;
        borders[4] = true;
    } else {
        borders[2] = false;
        borders[4] = false;
    }

    return borders;
}

function resetContentPos() {
    user.contentPos = 1;
}

// get user location on SERP
function getUserLocation() {
    return ("Result " + (user.resultPos + 1) + ". Observing " + resultsList[user.resultPos].getKeyPosition(user.contentPos));
}

// get text in neutral tile
function getNeutralText() {
    return currentResult[resultsList[user.resultPos].getKeyPosition(user.contentPos)];
}

// user input to move tiles
function moveToTile(direction) {

    // get border to check if move is possible
    var currBorders = getBorders(user);

    switch (direction) {
        case "front": // more significant result - lower position value (... -> 2 -> 1 -> BORDER)
            if (currBorders[1]) {
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                user.resultPos--;
                resetContentPos();
                planSERP();
            }

            break;
        case "left": // more significant content (... -> website -> title -> BORDER)
            if (currBorders[2]) { // max left = 'title'
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                // TODO: go to - title of new position
                user.contentPos--;
                planSERP();
            }

            break;
        case "back": // less significant result - lower position value (1 -> 2 -> ... -> BORDER)
            if (currBorders[3]) {
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                user.resultPos++;
                resetContentPos();
                planSERP();
            }

            break;
        case "right": // less significant content (title -> website -> ... -> BORDER)
            if (currBorders[4]) {
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                // TODO: go to - title of new position
                user.contentPos++;
                planSERP();
            }

            break;
        case "neutral": // less significant content (title -> website -> ... -> BORDER)
            TTS(getNeutralText(), optionsTTS);
            break;
        default:
            // null (read text)
    }
}

// this function is invoked by getJoyCon.js interface
//      INPUT: buttonObject = { "id": int, "name": string }
function buttonRequest(buttonObject) {
    buttonID = buttonObject.id;
    //console.log(buttonID);

    switch (buttonID) {
        case "A": // move Right
            moveToTile('right');
            break;
        case "X": // move Front
            moveToTile('front');
            break;
        case "B": // move Back
            moveToTile('back');
            break;
        case "Y": // move Left
            moveToTile('left');
            break;
        case "R": // repeat current location 
            TTS(getUserLocation(), optionsTTS);
            break;
        case "RT": // repeat current text 
            TTS(getNeutralText(), optionsTTS);
            break;
        case "RSR": // + 5%  
            changeVolume("up", optionsTTS);
            break;
        case "RSL": // - 5%  
            changeVolume("down", optionsTTS);
            break;
        case "HOME": // go to /home route
            goHome();
            break;
        default:
            console.log("Invalid Button");
    }
}

// takes user back to '/home' page
function goHome() {
    var referLink = document.createElement("a");
    referLink.href = '/home';
    document.body.appendChild(referLink);
    referLink.click();

    console.log('Attempted home');
}