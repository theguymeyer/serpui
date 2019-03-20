// Definition for the SEResult object
// client-side

require(['require', './scripts/getWebpageContents.js'], function(s) {
    console.log("Reached: SEResult");
});

function SEResult(data, pos) {
    /*
    Object definition for SE result (a set of tiles)
        - Each Search Result has n 'tiles' that 
            the user can access (excluding position, which 
            they can request at any time) 
        - To add additional Tiles use 'generateTile' method
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
        var newType = "";
        try {
            newType = this.myData["pagemap"]["metatags"][0]["og:type"];
            (newType) ? console.log(newType): newType = "none";

            (this.generateTile({
                newTileName: 'Site Content',
                newTileContent: this.myData['link'],
                newTileType: newType,
            })) ? console.log("Added More..."): console.log("Error with Adding More!"); // add more custom tiles

        } catch (e) {
            console.log(e);
        }
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
     *      Input: single tile object to be added (contains tile data)
     *      Output: true    if successfully added
     *              false   if no object given /  could not resolve data
     */
    this.generateTile = function(tileObj) {

        if (typeof tileObj === "undefined") { // no content to add
            return false;
        }

        // Prep Tile positioning
        this.tileContentPos = this.tileContentPos.concat(tileObj.newTileName);

        var tileType = tileObj.newTileType;
        if (tileType.includes('video')) { // type = video

            this.tiles[tileObj.newTileName] = "iframe:" + this.getYoutubeVideo(tileObj.newTileContent);

        } else { // type = other

            $.post('/externalSite', {
                    url: tileObj.newTileContent
                })
                .done(data => {
                    this.tiles[tileObj.newTileName] = data;
                })
                .fail(err => {
                    this.tiles[tileObj.newTileName] = "Could not resolve website";
                    return false;
                });

        }

        return true;
    }


    // converts youtube URL to iframe compatible link
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