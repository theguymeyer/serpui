// methods for responsive JS - maybe better to just Extend responsivevoice.js ??
// client-side

// TTS - Responsive JS
function TTS(txt, options) {

    if (typeof options === "undefined") {
        options = localOptionsTTS;
    }

    responsiveVoice.speak(txt, options.voice, {
        volume: Math.round(options.vol_curr) / 100
    });
}

// changes the volume for Responsive JS
function changeVolume(direction, options) {

    if (typeof options === "undefined") {
        options = localOptionsTTS;
    }

    if (direction == "up") {
        options.vol_curr += options.vol_step;
        if (options.vol_curr > options.vol_max) {
            options.vol_curr = options.vol_max;
        }
    } else if (direction == "down") {
        options.vol_curr -= options.vol_step;
        if (options.vol_curr < options.vol_min) {
            options.vol_curr = options.vol_min;
        }
    }

    TTS((options.vol_curr).toString(), options);
}

// TTS constants
var localOptionsTTS = {
    borderTxt: "border",
    voice: "UK English Male",
    vol_max: 100,
    vol_min: 0,
    vol_step: 5,
};
localOptionsTTS.vol_curr = eval((localOptionsTTS.vol_max + localOptionsTTS.vol_min) / 2);