function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
}

// Usage example
const canvas = document.getElementById('gameCanvas');
const ctx = setupCanvas(canvas);

const breakout = new Sprite(100, 100, 299, { filepath: 'Breakout/Breakout.svg', xoffset: 0, yoffset: 0 }, { color: 0, pixelation: 2, ghost: 0.5, whirl: 30, fisheye: 1 });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    breakout.draw(ctx);
    requestAnimationFrame(draw);
}

draw();

