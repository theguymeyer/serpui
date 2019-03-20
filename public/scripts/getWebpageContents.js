// otto_getWebpageContents.js
// Author: Guy Meyer
// server-side

'use strict';

var read = require('node-read');
var striptags = require('striptags');

async function getHTMLContent(url) {

    await read(url, function(err, article, res) {

        if (!(article.content)) {
            return "Incompatible Site";
        }

        console.log(striptags(article.content));

        return striptags(article.content);

    });
}

// remove specific char from str
function removeIndex(newstr, i) {
    return newstr.substr(0, i) + newstr.substr(i + 1, newstr.length)
}

// removes all html tags and leaves page contents
async function cleanContent(data) {

    var flag_tag = false;
    var i = 0;
    var newstr3 = data;

    console.log("Reached: Cleaning HTML Data");

    while (i < newstr3.length) {
        if (newstr3[i] == '<') {
            flag_tag = true;
            i++;
        } else if (newstr3[i] == '>') {
            flag_tag = false;
            i++;
        } else if (flag_tag) {
            newstr3 = removeIndex(newstr3, i);
            // i++;
        } else {
            i++;
        }
    }

    var newstr = newstr3.replace(/<>/g, ",");
    return (await newstr);
}

// testURL = 'https://ilikekillnerds.com/2016/05/removing-character-startend-string-javascript/';
// console.log(getHTMLContent(testURL));

module.exports = getHTMLContent;