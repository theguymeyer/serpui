// methods for responsive JS - maybe better to just Extend responsivevoice.js ??
// client-side

// TTS - Responsive JS
function TTS(txt, options = optionsTTS) {
    responsiveVoice.speak(txt, options.voice, {
        volume: Math.round(options.vol_curr) / 100
    });
}

// changes the volume for Responsive JS
function changeVolume(direction, options = optionsTTS) {
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
var optionsTTS = {
    borderTxt: "border",
    voice: "UK English Male",
    vol_max: 100,
    vol_min: 0,
    vol_step: 5,
};
optionsTTS.vol_curr = eval((optionsTTS.vol_max + optionsTTS.vol_min) / 2);