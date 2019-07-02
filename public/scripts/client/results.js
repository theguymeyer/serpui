// se results controller (similar to serpManager...)
// client-side

/* SERP Manager */

require(['require', './scripts/SEResult.js', './scripts/localResponsiveVoice.js', './scripts/keyboardButtonMapping.js'], function(r) {
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
    neutralBkgd: "black",
    neutralText: "white",
}


/* Functions */

/* ----- SERP Initializers ----- */

// determines arrangement and content of every tile - organizes db
function setupSERP() {

    console.log("Executing: Setup SERP function");

    // jQuery request JSON query data from server 
    $.get('/db/resultData.json', function(data) {
        // console.log(data);
        generateResultsList(data);
        initUser();
        drawSERP(planSERP());
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
}

// create initial state SERP
//  - this function sets user to first Tile, user = {0,1}
function initUser() {
    // start at title of Result 1
    user = $.extend(user, {
        resultPos: 0,
        contentPos: 1 // init to 1 since 0 is positions
    });
}

// set content of tiles to draw SERP
// Note that this func only requires user positioning
function planSERP() { // user is global
    var currResult = getCurrentResult(user);
    var currBorders = getBorders(user);

    console.log(currResult);

    // tiles = [neutral, up, left, down, right]
    var tilesPlan = Array(5).fill(''); //[borderTEXT, borderTEXT, user.resultPos + 1, borderTEXT, borderTEXT];

    for (var i = 0; i < currBorders.length; i++) {
        if (!(currBorders[i])) {
            if (i == 0) { // neutral
                tilesPlan[0] = currResult[resultsList[user.resultPos].getKeyPosition(user.contentPos)];
            } else if (i == 1) { // up
                tilesPlan[1] = "Result " + (user.resultPos);
            } else if (i == 2) { // left
                tilesPlan[2] = currResult[resultsList[user.resultPos].getKeyPosition(user.contentPos - 1)];
            } else if (i == 3) { // down
                tilesPlan[3] = "Result " + (user.resultPos + 2);
            } else if (i == 4) { // right
                tilesPlan[4] = currResult[resultsList[user.resultPos].getKeyPosition(user.contentPos + 1)];
            } else {
                console.log("Error: Incorrect Border Count " + i)
            }

        }
    }

    // apply border scheme
    for (var j = 0; j < tilesPlan.length; j++) {
        (currBorders[j]) ? tilesPlan[j] = borderTEXT: console.log('ERROR with border Plan');
    }

    // console.log("\nPLANNED STATUS:");
    // console.log("USER:", user);
    // console.log("BORDERS:", currBorders);
    // console.log("CURRENT RESULT DATA:", currResult);
    // console.log("\n");

    // return plan
    return tilesPlan;
}

// implements the plan ( planSERP() )
//      Input: Serp Plan to be implemented
//      Output: SerpUI
function drawSERP(tilesData) {

    // assignment order: neutral -> up -> left -> down -> right
    elementIDs = ['neutralButton', 'upButton', 'leftButton', 'downButton', 'rightButton']

    for (var i = 0; i < tilesData.length; i++) {

        currButton = document.getElementById(elementIDs[i]);
        console.log('tilesData[i]', tilesData[i]);

        if (tilesData[i].includes('iframe') && elementIDs[i] == 'neutralButton') { // include iframe if requested
            var myId = (tilesData[i].split(':'))[1];
            currButton.text = "";

            // embed iframe for video
            currButton.innerHTML = '<iframe id="yt_player_iframe" width="100%" height="100%" src="//www.youtube.com/embed/' + myId +
                `?autoplay=1&enablejsapi=1" frameborder="0" allowscriptaccess="always" allow="autoplay" allowfullscreen></iframe>`;
            //currButton.innerHTML = '<iframe id="yt_player_iframe" width="100%" height="100%" src="//www.youtube.com/embed/' + myId +
//                `?autoplay=${(i == 0) ? 1 : 0}&enablejsapi=1" frameborder="0" allowscriptaccess="always" allowfullscreen></iframe>`;

            // enlarge video content to fit Tile
            var spanChild = document.getElementById('neutralButton').children[0]
            spanChild.setAttribute("style", "height: 100%; width: 100%;");

        } else { // iframe not requested

            currButton.innerHTML = tilesData[i];

            if (tilesData[i] == borderTEXT || tilesData[i] == (user.resultPos + 1)) {
                currButton.style.background = colourScheme.borderBkgd;
                currButton.style.color = colourScheme.borderText;
            } else if (elementIDs[i] == 'neutralButton') {
		currButton.style.background = colourScheme.neutralBkgd;
		currButton.style.color = colourScheme.neutralText;
	    } else {
                currButton.style.background = colourScheme.activeBkgd;
                currButton.style.color = colourScheme.activeText;
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

    }


    // dictate to user position if on first content tile
    if (user.contentPos == 1) {
        TTS("Result" + (user.resultPos + 1) + ". Title. " + tilesData[0], optionsTTS);
    } else {
        // dictate neutral tile content - ALWAYS
        TTS(tilesData[0], optionsTTS);
    }
}

/* ----- Accessors ----- */

// maximum user result position
function getMaxPosition() {
    return resultsList.length - 1;
}

// maximum user content position for unique result
function getMaxContentPos(result) {
    return Object.keys(result).length - 1; // -1 since 'position' doesnt count
}

// the tile object of the current user result position
function getCurrentResult(userObj) {
    return resultsList[userObj.resultPos].getTiles();
}

// get user location on SERP
function getUserLocation(userObj) {
    return ("Result " + (userObj.resultPos + 1) + ". Observing " + resultsList[userObj.resultPos].getKeyPosition(userObj.contentPos));
}

// get text in neutral tile
function getNeutralText(userObj) {
    var currentResult = getCurrentResult(userObj);
    return currentResult[resultsList[userObj.resultPos].getKeyPosition(userObj.contentPos)];
}

// returns an array indicating current exisiting borders
function getBorders(userObj) {

    // borders = [neutral, up, left, down, right]
    var borders = Array(5).fill(false);

    // results (vertical)
    if (userObj.resultPos == 0) {
        borders[1] = true;
        // borders[3] = false;
    } else if (userObj.resultPos == getMaxPosition()) {
        // borders[1] = false;
        borders[3] = true;
    } else if (userObj.resultPos == 0 && resultsList.length == 1) { // only 1 result
        borders[1] = true;
        borders[3] = true;
    } else {
        // borders[1] = false;
        // borders[3] = false;
    }

    // content (horizontal)
    if (userObj.contentPos == 1) {
        borders[2] = true;
        // borders[4] = false;
    } else if (userObj.contentPos == getMaxContentPos(getCurrentResult(user))) {
        // borders[2] = false;
        borders[4] = true;
    } else if (getMaxContentPos(getCurrentResult(user)) == 1) { // only one content Tile
        borders[2] = true;
        borders[4] = true;
    } else {
        // borders[2] = false;
        // borders[4] = false;
    }

    return borders;
}

/* ----- User Functionality ----- */

function resetContentPos() {
    user.contentPos = 1;
}

// user input to move tiles
function moveToTile(direction) {

    // get border to check if move is possible
    var currBorders = getBorders(user);

    switch (direction) {
        case "up": // more significant result - lower position value (... -> 2 -> 1 -> BORDER)
            if (currBorders[1]) {
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                user.resultPos--;
                resetContentPos();

                drawSERP(planSERP());
            }

            break;
        case "left": // more significant content (... -> displayLink -> title -> BORDER)
            if (currBorders[2]) { // max left = 'title'
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                // TODO: go to - title of new position
                user.contentPos--;

                drawSERP(planSERP());
            }

            break;
        case "down": // less significant result - lower position value (1 -> 2 -> ... -> BORDER)
            if (currBorders[3]) {
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                user.resultPos++;
                resetContentPos();

                drawSERP(planSERP());
            }

            break;
        case "right": // less significant content (title -> displayLink -> ... -> BORDER)
            if (currBorders[4]) {
                console.log("Invalid Move - BORDER");
                TTS(optionsTTS.borderTxt + ". Result " + (user.resultPos + 1), optionsTTS);
            } else {
                // TODO: go to - title of new position
                user.contentPos++;

                drawSERP(planSERP());
            }

            break;
        case "neutral": // current Tile
            TTS(getNeutralText(user), optionsTTS);
            break;

        default:
            // null (read text)
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

function pauseVideo() {

    $('.yt_player_iframe').each(function() {
        this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
    });
}

/* ----- Key Binding - JoyCon ----- */

// this function is invoked by getJoyCon.js interface
//      INPUT: buttonObject = { "id": int, "name": string }
function buttonRequest(buttonObject) {
    buttonID = buttonObject.id;
    //console.log(buttonID);

    switch (buttonID) {
        case "A": // move Right
            moveToTile('right');
            break;
        case "X": // move up
            moveToTile('up');
            break;
        case "B": // move down
            moveToTile('down');
            break;
        case "Y": // move Left
            moveToTile('left');
            break;
        case "R": // repeat current location 
            TTS(getUserLocation(user), optionsTTS);
            break;
        case "RT": // repeat current text 
            TTS(getNeutralText(user), optionsTTS);
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
        case "PLUS": // stop talking
            TTS("");
            pauseVideo();
            break;
        default:
            console.log("Invalid Button");
    }
}
