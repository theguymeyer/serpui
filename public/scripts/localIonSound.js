// methods for ION Sound
// client-side

ion.sound({
    sounds: [{
        name: "my_cool_sound"
    }, {
        name: "notify_sound",
        volume: 0.2
    }, {
        name: "alert_sound",
        volume: 0.3,
        preload: false
    }],
    volume: 0.5,
    path: "sounds/",
    preload: true
});