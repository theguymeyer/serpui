/*
 * Starting point is from a working example found in:
 * https://medium.com/@dominicvalenciana/adding-nintendo-joycon-support-to-your-website-with-the-gamepad-api-1e00ac9ab27
 * 
 * This function library only works for usage of Right JoyCon Controller
 */
var lastButtonPress;

(function() {
    let interval;
    var flag = false;
    var gamepadID;

    //let interval;

    // current active button
    lastButtonPress = {
        "id": null,
        "duration": 0,
        "active": false
    }


    // Mapping button index to each button
    // Each joycon contains 16 buttons indexed
    var buttonMapping = {
        0: 'A',
        1: 'X',
        2: 'B',
        3: 'Y',
        4: 'RSL',
        5: 'RSR',
        9: 'PLUS',
        11: 'RA',
        12: 'HOME',
        14: 'R',
        15: 'RT',
        16: 'LEFT',
        17: 'DOWN',
        18: 'UP',
        19: 'RIGHT',
        20: 'LSL',
        21: 'LSR',
        24: 'MINUS',
        26: 'LA',
        29: 'CAPTURE',
        30: 'L',
        31: 'LT'
    }

    if ('GamepadEvent' in window) {
        window.addEventListener("gamepadconnected", e => createHandlerConnected(e), false);
        window.addEventListener("gamepaddisconnected", e => {
            removeGamepad(e.gamepad);
        });
    } else {
        interval = setInterval(pollGamepads, 1000);
    }

    // event handler for gamepad connected
    var createHandlerConnected = function(event) {
        console.log("Reached: JoyCon Setup");
        gamepadID = event.gamepad.id;

        //addGamepad(e.gamepad);
        if (!flag) {
            flag = true;
            window.requestAnimationFrame(pollGamepads);
        }
    }

    function pollGamepads() {

        let seenGamepad = false;

        let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let gamepadArray = [];
        for (let i = 0; i < gamepads.length; i++) {
            gamepadArray.push(gamepads[0]);
        }
        let orderedGamepads = [];
        orderedGamepads.push(gamepadArray.find(g => g.id.indexOf('Wireless Gamepad')));
        //orderedGamepads.push(gamepadArray.find(g => g.id.indexOf('Joy-Con (L)') > -1)); // no need for left controller
        let pressedButtons = [];


        for (let g = 0; g < orderedGamepads.length; g++) {

            seenGamepad = true;
            const gp = orderedGamepads[g];


            if (!!gp) {
                for (let i = 0; i < gp.buttons.length; i++) {

                    if (gp.buttons[i].pressed) {


                        const id = (g * 15) + i + g;
                        const button = buttonMapping[id] || id;
                        pressedButtons.push(button);

                        // first time pressing button
                        if (!lastButtonPress.active) {
                            lastButtonPress.id = button;
                            lastButtonPress.duration = 0; // reset duration
                            lastButtonPress.active = true;
                        }

                        lastButtonPress.duration++;

                    } else if (lastButtonPress.active && (buttonMapping[i] === lastButtonPress.id)) {
                        // lastButtonPress no longer pressed but still labeled as 'active'

                        lastButtonPress.active = false;
                        buttonRequest(lastButtonPress);

                    }

                }

            }
        }

        /* // No need for html support
        if (pressed.length === 0) {
            input.innerHTML = 'No button pressed at the moment...';
        } else {
            input.innerHTML = pressed.join(' + ');
        }*/


        // check if gamepads are still present
        if (seenGamepad) {
            window.requestAnimationFrame(pollGamepads);
        }
    }

})();