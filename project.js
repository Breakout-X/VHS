const canvas = document.getElementById('gameCanvas');
const ctx = setupCanvas(canvas);
let started = false;

const imagePaths = {
    Breakout: [
        'Breakout/Breakout.svg', 
        'Breakout/Breakout-Wag-1.svg',
        'Breakout/Breakout-Wag-2.svg',
        'Breakout/Breakout-Wag-3.svg',
        'Breakout/Breakout-Wag-4.svg',
        'Breakout/Breakout-Wag-5.svg',
        'Breakout/Breakout-Wag-6.svg',
        'Breakout/Breakout-Blink.svg', 
    ],

    Nebula: [
        'Nebula/Nebula.svg', 
        'Nebula/Nebula-Glitch-1.png',
        'Nebula/Nebula-Glitch-2.png',
        'Nebula/Nebula-Glitch-3.png',
        'Nebula/Nebula-Blink.svg', 
    ],

    Background: [
        //'Backdrop/_wall_.svg',
        'Backdrop/wall_.svg'
    ],

    Static: [
        'static-dark/25.png',
        'static-dark/26.png',
        'static-dark/27.png',
        'static-dark/28.png',
        'static-dark/29.png',
        'static-dark/30.png',
        'static-dark/31.png',
        'static-dark/32.png',
    ],

    Lines: [
        'Lines/1.svg',
    ],

    Red_Button: [
        'Red Button/1.png',
        'Red Button/2.png',
    ]
};
const soundPaths = [
    'Lines/baseband artifect.wav', 
    //'Lines/hifi artifect.wav'
];

let sounds = [];

preloadImages(imagePaths, (images) => {
    console.log("Images preloaded successfully.");

    // Create Sprites
    const background = new Sprite(0, -200, 150, { filepath: images[13].src });
    const breakout = new Sprite(75, 100, 300, { filepath: images[8].src });
    const nebula = new Sprite(275, 100, 300, { filepath: images[2].src });
    const _static = new Sprite(-150, 0, 135, { filepath: images[14].src });
    const lines = new Sprite(0, 60, 200, { filepath: images[22].src });
    const redButton = new Sprite(-300, 60, 100, { filepath: images[23].src });

    // Give them animation
    const nebulaAnimation = new Animation();
    const breakoutAnimation = new Animation();
    const staticAnimation = new Animation();
    const redButtonAnimation = new Animation();

    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[7]);
    breakoutAnimation.addFrame(images[7]);
    breakoutAnimation.addFrame(images[7]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[1]);
    breakoutAnimation.addFrame(images[2]);
    breakoutAnimation.addFrame(images[3]);
    breakoutAnimation.addFrame(images[4]);
    breakoutAnimation.addFrame(images[5]);
    breakoutAnimation.addFrame(images[6]);
    breakoutAnimation.addFrame(images[1]);
    breakoutAnimation.addFrame(images[2]);
    breakoutAnimation.addFrame(images[3]);
    breakoutAnimation.addFrame(images[4]);
    breakoutAnimation.addFrame(images[5]);
    breakoutAnimation.addFrame(images[6]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.frameDuration = 50;

    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[12]);
    nebulaAnimation.addFrame(images[12]);
    nebulaAnimation.addFrame(images[12]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[9]);
    nebulaAnimation.addFrame(images[10]);
    nebulaAnimation.addFrame(images[11]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[9]);
    nebulaAnimation.addFrame(images[10]);
    nebulaAnimation.addFrame(images[11]);
    nebulaAnimation.frameDuration = 50;

    staticAnimation.addFrame(images[14]);
    staticAnimation.addFrame(images[15]);
    staticAnimation.addFrame(images[16]);
    staticAnimation.addFrame(images[17]);
    staticAnimation.addFrame(images[18]);
    staticAnimation.addFrame(images[19]);
    staticAnimation.addFrame(images[20]);
    staticAnimation.addFrame(images[21]);
    staticAnimation.frameDuration = 50;

    redButtonAnimation.addFrame(images[23]);
    redButtonAnimation.addFrame(images[24]);
    redButtonAnimation.frameDuration = 1000;

    function draw(timestamp) {
        if (started && breakout.animation === null && nebula.animation === null) {
            breakout.setAnimation(breakoutAnimation);
            nebula.setAnimation(nebulaAnimation);
            _static.setAnimation(staticAnimation);
            redButton.setAnimation(redButtonAnimation);
        }
        if (started) {
            const deltaTime = timestamp - lastTimestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            background.draw(ctx, deltaTime);

            // Sprites
            breakout.draw(ctx, deltaTime);
            nebula.draw(ctx, deltaTime);
            _static.draw(ctx, deltaTime);
            lines.draw(ctx, deltaTime);
            redButton.draw(ctx, deltaTime);

            // Effects
            nebula.fx.color += 1;
            _static.fx.ghost = 75;
            //_static.fx.fisheye += 1;
            //_static.fx.pixelation += 1;
            //_static.fx.spin += 1;
            //_static.fx.ghost = 50;
            lines.fx.ghost = 50;
            redButton.ghost = 50;
        }
        requestAnimationFrame(draw);
        lastTimestamp = timestamp;
    }

    let lastTimestamp = 0;
    requestAnimationFrame(draw);
});

preloadSounds(soundPaths, (loadedSounds) => {
    console.log("Sounds preloaded successfully.");

    sounds = loadedSounds;
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', () => {
        if (sounds.length > 0) {
            sounds[0].loop = true;
            sounds[0].play().catch(error => console.error("Error playing sound 0:", error));
            //sounds[1].play().catch(error => console.error("Error playing sound 1:", error));
        } else {
            console.error("Something went wrong in playing the sounds. It appears they are missing.");
        }
        if (started) {
            return;
        }

        started = true;
        console.log("Project Started");

        // Change the button text and color
        const startButton = document.getElementById('startButton');
        startButton.innerText = 'Project Started';
        startButton.style.backgroundColor = 'red';
    });
});
