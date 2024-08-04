class Sprite {
    constructor(x = 0, y = 0, size = 100, image, fx) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = new Image();
        this.image.src = image.filepath;
        this.image.onload = () => {
            this.imageWidth = this.image.width;
            this.imageHeight = this.image.height;
        };
        this.imageXOffset = image.xoffset || 0;
        this.imageYOffset = image.yoffset || 0;
        this.fx = fx;
        this.direction = 'right';
        this.rotation = 0;
        this.deleted = false;
        this.animation = null;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    delete() {
        this.deleted = true;
    }

    clone() {
        return new Sprite(this.x, this.y, this.size, {
            filepath: this.image.src,
            xoffset: this.imageXOffset,
            yoffset: this.imageYOffset
        }, this.fx);
    }

    collidesWith(sprite) {
        return this.x < sprite.x + (sprite.size / 100) * sprite.imageWidth &&
               this.x + (this.size / 100) * this.imageWidth > sprite.x &&
               this.y < sprite.y + (sprite.size / 100) * sprite.imageHeight &&
               this.y + (this.size / 100) * this.imageHeight > sprite.y;
    }

    flipDirection() {
        this.direction = this.direction === 'right' ? 'left' : 'right';
    }

    rotate(angle) {
        this.rotation += angle;
    }

    applyEffects(ctx) {
        if (this.fx.color) {
            ctx.fillStyle = this.fx.color;
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillRect(this.x, this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
            ctx.globalCompositeOperation = 'source-over';
        }
        if (this.fx.pixelation) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(ctx.canvas, this.x, this.y, (this.size / 100) * this.imageWidth / this.fx.pixelation, (this.size / 100) * this.imageHeight / this.fx.pixelation, this.x, this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
            ctx.imageSmoothingEnabled = true;
        }
        if (this.fx.ghost) {
            ctx.globalAlpha = this.fx.ghost;
        }
        if (this.fx.whirl) {
            ctx.translate(this.x + ((this.size / 100) * this.imageWidth) / 2, this.y + ((this.size / 100) * this.imageHeight) / 2);
            ctx.rotate(this.fx.whirl * Math.PI / 180);
            ctx.translate(-(this.x + ((this.size / 100) * this.imageWidth) / 2), -(this.y + ((this.size / 100) * this.imageHeight) / 2));
        }
        if (this.fx.fisheye) {
            ctx.filter = `url(#fisheye)`;
        }
    }

    draw(ctx, deltaTime) {
        if (this.deleted) return;

        const centerX = this.x + ((this.size / 100) * this.imageWidth) / 2;
        const centerY = this.y + ((this.size / 100) * this.imageHeight) / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);

        if (this.direction === 'left') {
            ctx.scale(-1, 1);
            if (this.animation) {
                this.animation.update(deltaTime);
                const currentFrame = this.animation.getCurrentFrame();
                ctx.drawImage(currentFrame, this.imageXOffset, this.imageYOffset, currentFrame.width, currentFrame.height, -this.x - ((this.size / 100) * this.imageWidth), this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
            } else {
                ctx.drawImage(this.image, this.imageXOffset, this.imageYOffset, this.image.width, this.image.height, -this.x - ((this.size / 100) * this.imageWidth), this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
            }
        } else {
            if (this.animation) {
                this.animation.update(deltaTime);
                const currentFrame = this.animation.getCurrentFrame();
                ctx.drawImage(currentFrame, this.imageXOffset, this.imageYOffset, currentFrame.width, currentFrame.height, this.x, this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
            } else {
                ctx.drawImage(this.image, this.imageXOffset, this.imageYOffset, this.image.width, this.image.height, this.x, this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
            }
        }

        this.applyEffects(ctx);
        ctx.restore();
        ctx.globalAlpha = 1.0;
        ctx.filter = 'none';
    }
};

class SpriteSheet {
    constructor(image, frameWidth, frameHeight, frameCount, frameDuration) {
        console.warn("Using this class is depreciated. Instead, use the `Animation` Class and use the built in `Sprite.setAnimation` script instead.");
        this.image = new Image();
        this.image.src = image.filepath;
        this.image.onload = () => {
            this.imageWidth = frameWidth;
            this.imageHeight = frameHeight;
        };
        this.frameWidth = this.image.width; //- frameWidth;
        this.frameHeight = this.image.height; //- frameHeight;
        this.frameCount = frameCount;
        this.frameDuration = frameDuration;
        this.currentFrame = 0;
        this.elapsedTime = 0;
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.elapsedTime = 0;
        }
    }

    draw(ctx, x, y, width, height) {
        const frameX = this.currentFrame * this.frameWidth;
        ctx.drawImage(this.image, frameX, 0, this.frameWidth, this.frameHeight, x, y, width, height);
    }
};

class Animation {
    constructor() {
        this.frames = [];
        this.frameDuration = 0;
        this.currentFrame = 0;
        this.elapsedTime = 0;
    }

    addFrame(image) {
        this.frames.push(image);
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.elapsedTime = 0;
        }
    }

    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }
};

function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr*1.2, dpr*1.2);
    return ctx;
};

function preloadImages(imagePaths, callback) {
    let loadedImages = 0;
    const images = [];

    imagePaths.forEach((path, index) => {
        images[index] = new Image();
        images[index].src = path;
        images[index].onload = () => {
            loadedImages++;
            if (loadedImages === imagePaths.length) {
                callback(images);
            }
        };
    });
};

function preloadSounds(soundPaths, callback) {
    let loadedSounds = 0;
    const sounds = [];

    soundPaths.forEach((path, index) => {
        sounds[index] = new Audio(path);
        sounds[index].onloadeddata = () => {
            loadedSounds++;
            if (loadedSounds === soundPaths.length) {
                callback(sounds);
            }
        };
    });
}

function playSound(filename, loop = false, pitch = 1, tempo = 1) {
    const audio = new Audio(filename);
    audio.loop = loop;
    audio.playbackRate = pitch;
    audio.play();
    return audio;
}

function stopSound(audio) {
    audio.pause();
    audio.currentTime = 0;
}

function stopAllSounds() {
    const audios = document.getElementsByTagName('audio');
    for (let audio of audios) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function pauseSound(audio) {
    audio.pause();
}
