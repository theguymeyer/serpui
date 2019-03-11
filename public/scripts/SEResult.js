// Definition for the SEResult object
// client-side

require(['require'], function(s) {
    console.log("Reached: SEResult");
});

function SEResult(data, pos) {
    /*
    Object definition for SE result 
        - Each Search Result has three 'tiles' (atm) that 
            the user can access (excluding position, which 
            they can request at any time) 
    */

    console.log("Created: SEResult object");

    this.myData = data;

    this.tiles = {
        position: pos
    };

    this.tilePos = { // Content Position
        0: "position",
        1: "title",
        2: "displayLink",
        3: "snippet"
    }

    this.getTiles = function() {
        return (this.tiles);
    };


    this.getKeyPosition = function(tileNum) {
        return this.tilePos[tileNum];
    };

    this.getLength = function() {
        return this.tilePos.length;
        // return Object.keys(tiles).length
    };

    // create object
    this.createObject = function() {
        for (var elem in this.tilePos) {
            if (this.tilePos[elem] in this.myData) { // to exclude position
                this.tiles[this.tilePos[elem]] = cleanText(this.myData[this.tilePos[elem]], this.tilePos[elem]);
            }
        }
    }


    // removes all '\' escape characters and unnecessary text
    cleanText = function(txt, tileType) {
        txt = JSON.stringify(txt);
        txt = txt.replace(/\\n/g, "");
        txt = txt.replace(/\\t/g, "");
        txt = txt.replace("...", ".");

        if (tileType == "displayLink") {
            txt = txt.replace("www.", "");
        }

        return JSON.parse(txt);
    }

};