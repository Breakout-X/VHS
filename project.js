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
        'Backdrop/_wall_.svg'
    ],
};
const soundPaths = [
    'Lines/baseband artifect.wav', 
    'Lines/hifi artifect.wav'
];

let sounds = [];

preloadImages(imagePaths, (images) => {
    const background = new Sprite(0, -200, 150, { filepath: images[13].src });
    const breakout = new Sprite(75, 100, 300, { filepath: images[8].src });
    const nebula = new Sprite(275, 100, 300, { filepath: images[2].src });

    const nebulaAnimation = new Animation();
    const breakoutAnimation = new Animation();

    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[7]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.frameDuration = 1000;

    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.addFrame(images[12]);
    nebulaAnimation.addFrame(images[8]);
    nebulaAnimation.frameDuration = 1000;

    function draw(timestamp) {
        if (started && breakout.animation === null && nebula.animation === null) {
            breakout.setAnimation(breakoutAnimation);
            nebula.setAnimation(nebulaAnimation);
        }
        if (started) {
            const deltaTime = timestamp - lastTimestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            background.draw(ctx, deltaTime);
            breakout.draw(ctx, deltaTime);
            nebula.draw(ctx, deltaTime);
            nebula.fx.color += 1;
            //nebula.fx.fisheye += 1;
            //nebula.fx.pixelation += 1;
            //nebula.fx.spin += 1;
            //nebula.fx.ghost = 50;
        }
        requestAnimationFrame(draw);
        lastTimestamp = timestamp;
    }

    let lastTimestamp = 0;
    requestAnimationFrame(draw);
});

preloadSounds(soundPaths, (loadedSounds) => {
    sounds = loadedSounds;
    console.log("Sounds preloaded successfully.");
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', () => {
        if (sounds.length > 0) {
            sounds[0].play().catch(error => console.error("Error playing sound 0:", error));
            sounds[1].play().catch(error => console.error("Error playing sound 1:", error));
        } else {
            console.error("Something went wrong in playing the sounds. It appears they are missing.");
        }

        started = true;
        console.log("click");

        // Change the button text and color
        const startButton = document.getElementById('startButton');
        startButton.innerText = 'Project Started';
        startButton.style.backgroundColor = 'red';
    });
});
