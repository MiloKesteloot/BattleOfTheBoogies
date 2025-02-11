// Name: Milo Kesteloot
// Game: Battle Of The Boogies
// Time: 8 hours
// Creative Tilt Justification:
//    Technology Justification: The 3D aspects of my technology were incredibly difficult to implument and I think are worthey of an extra point.
//         Style Justification: The 3D aspect of my game also looks great and unique and I think is worth of another point.
// Notes: I do not use a scrolling texture because of the visual style of my game. This was approved by Nathan in class and he said that I could get full points for the scrolling tetxure point.

'use strict'

let config = {
    type: Phaser.AUTO,
    pixelArt: true, // Ensures nearest-neighbor scaling globally
    scale: {
        mode: Phaser.Scale.RESIZE, // Fit the game to the screen
        autoCenter: Phaser.Scale.CENTER_BOTH // Center the game canvas
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
        }
    },
    scene: [ Play, Credits ]
}

let game = new Phaser.Game(config)

let { width, height } = game.config