// Definition for the SEResult object
// client-side

require(['require', './scripts/getWebsiteContent.js'], function(s) {
    console.log("Reached: SEResult");
});

function SEResult(data, pos) {
    /*
    Object definition for SE result (a set of tiles)
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
                // console.log('Condition', (elem in this.myData));
            }
        }

        // generate new tile that include HTML from link of SE Result
        //      TODO: should also include a Type

        var newType = this.myData["pagemap"]["metatags"][0]["og:type"];
        (newType) ? console.log(newType): newType = "none";

        (this.generateTile({
            newTileName: 'Site Content',
            newTileContent: this.myData['link'],
            newTileType: newType,
        })) ? console.log("Added More..."): console.log("Error with Adding More!"); // add more custom tiles
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

    /* This function will create a new tile at the end
     *      Input: single content object to be added
     *      Output: true    if successfully added
     *              false   if no object given
     */
    this.generateTile = function(contentObj) {

        if (typeof contentObj === "undefined") { // no content to add
            return false;
        }

        // Prep Tile positioning
        this.tileContentPos = this.tileContentPos.concat(contentObj.newTileName);

        var tileType = contentObj.newTileType;
        if (tileType.includes('video')) { // type = video

            this.tiles[contentObj.newTileName] = "iframe:" + this.getYoutubeVideo(contentObj.newTileContent);

        } else { // type = other

            $.post('/externalSite', {
                    url: contentObj.newTileContent
                })
                .done(data => {
                    this.tiles[contentObj.newTileName] = data;
                })
                .fail(err => {
                    this.tiles[contentObj.newTileName] = "Could not resolve website";
                });

        }

        return true;

    }


    this.getYoutubeVideo = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }

};