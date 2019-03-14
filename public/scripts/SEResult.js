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
    this.pos = pos;

    this.tiles = { // Tile data + mapping to content
        position: this.pos
    };

    this.tileContentPos = [ // Content Position - Basic Info
        "position",
        "title",
        "displayLink",
        "snippet"
    ];

    this.getTiles = function() {
        return this.tiles;
    };

    // Get position of specific tiles
    this.getKeyPosition = function(tileNum) {
        if (typeof tileNum != "number") { // only accept string
            return -1;
        }
        // console.log("key pos", this.tileContentPos.indexOf(tileNum));
        return this.tileContentPos[tileNum];
    };

    this.getLength = function() {
        return this.tileContentPos.length;
    };

    // create object
    this.createObject = function() {

        console.log("Reached: Create object");
        // console.log(this.tileContentPos, this.myData);

        for (var e in this.tileContentPos) {
            // console.log('e', e);

            var elem = this.tileContentPos[e];
            if (elem in this.myData) { // to exclude position

                // console.log('DATA,', this.cleanText(this.myData[elem], elem));
                // console.log('pre', this.tiles);
                this.tiles[elem] = this.cleanText(this.myData[elem], elem);
                // console.log('post', this.tiles);
            } else {
                console.log('Condition', (elem in this.myData));
            }
        }

        (this.generateMore([{
            tileName: 'Content',
            tileContent: this.myData
        }])) ? console.log("Added More..."): console.log("Error with Adding More!"); // add more custom tiles
    }

    // removes all '\' escape characters and unnecessary text
    this.cleanText = function(txt, tileType) {
        var tmpTxt = JSON.stringify(txt);
        tmpTxt = tmpTxt.replace(/\\n/g, "");
        tmpTxt = tmpTxt.replace(/\\t/g, "");
        // tmpTxt = tmpTxt.replace("...", ".");

        if (tileType == "displayLink") {
            tmpTxt = tmpTxt.replace("www.", "");
        }

        return JSON.parse(tmpTxt);
    }

    /* This function will create more tiles as necessary
     *      Input: list of content object to add
     *      Output: true    if more content requested
     *              false   if Input.length == 0
     */
    this.generateMore = function(contentList) {

        if (typeof contentList === "undefined") { // no content to add
            return false;
        }

        // console.log('contentList', contentList);

        for (var i = 0; i < contentList.length; i++) {

            // console.log(contentList[i].tileName);
            this.tileContentPos.concat(contentList[i].tileName);

            // use tileContent to determine between the modalities:
            //      standard webpage, video, audio, form (user I/O),... 
            // console.log(contentList[i].tileContentLink);
            // this.tiles[contentList.tileName] = `${contentList.tileContentLink}`;
        }

        return true;
    }

};