const canvas = document.getElementById('gameCanvas');
const ctx = setupCanvas(canvas);
let started = false;

const imagePaths = ['Breakout/Breakout.svg', 'Breakout/Breakout-Blink.svg', 'Nebula/Nebula.svg', 'Nebula/Nebula-Blink.svg'];
const soundPaths = ['Lines/baseband artifect.wav', 'Lines/hifi artifect.wav'];

let sounds = [];

preloadImages(imagePaths, (images) => {
    const breakout = new Sprite(100, 100, 300, { filepath: images[0].src }, { color: 0, pixelation: 2, ghost: 0.5, whirl: 30, fisheye: 1 });
    const nebula = new Sprite(300, 100, 300, { filepath: images[2].src }, { color: 0, pixelation: 2, ghost: 0.5, whirl: 30, fisheye: 1 });
    const nebulaAnimation = new Animation();
    const breakoutAnimation = new Animation();

    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.addFrame(images[1]);
    breakoutAnimation.addFrame(images[0]);
    breakoutAnimation.frameDuration = 1000;

    nebulaAnimation.addFrame(images[2]);
    nebulaAnimation.addFrame(images[2]);
    nebulaAnimation.addFrame(images[3]);
    nebulaAnimation.addFrame(images[2]);
    nebulaAnimation.frameDuration = 1000;

    function draw(timestamp) {
        if (started && breakout.animation === null && nebula.animation === null) {
            breakout.setAnimation(breakoutAnimation);
            nebula.setAnimation(nebulaAnimation);
        }

        const deltaTime = timestamp - lastTimestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        breakout.draw(ctx, deltaTime);
        nebula.draw(ctx, deltaTime);
        requestAnimationFrame(draw);
        lastTimestamp = timestamp;
    }

    let lastTimestamp = 0;
    requestAnimationFrame(draw);
});

preloadSounds(soundPaths, (loadedSounds) => {
    sounds = loadedSounds;
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', () => {
        if (sounds.length > 0) {
            sounds[0].play();
            sounds[1].play();
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
