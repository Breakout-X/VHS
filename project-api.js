class Sprite {
    constructor(x = 0, y = 0, size = 100, image, fx = { color: 0, pixelation: 0, ghost: 0, spin: 0, fisheye: 0 }) {
        this.x = x;
        this.y = y;
        this.size = (size / 100);
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
               this.x + this.size * this.imageWidth > sprite.x &&
               this.y < sprite.y + (sprite.size / 100) * sprite.imageHeight &&
               this.y + this.size * this.imageHeight > sprite.y;
    }

    flipDirection() {
        this.direction = this.direction === 'right' ? 'left' : 'right';
    }

    rotate(angle) {
        this.rotation += angle;
    }

    applyEffects(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
    
        if (this.fx.color) {
            // Works perfectly
            ctx.globalCompositeOperation = 'source-over';
            ctx.filter = `hue-rotate(${this.fx.color}deg)`;
        }
    
        if (this.fx.pixelation) {
            console.error("Mehod \"Pixelation\" Not Supported.")
            this.pixelSize = Math.max(1, Math.floor(100 / this.fx.pixelation));
        }
    
        if (this.fx.ghost) {
            // Works perfectly for every value under 101.
            ctx.globalAlpha = 1 - (this.fx.ghost / 100);
        }
    
        if (this.fx.spin) {
            // Spin the sprite image.
            const swirlAmount = this.fx.spin / 100;
            ctx.translate(this.x + this.imageWidth / 2, this.y + this.imageHeight / 2);
            ctx.rotate(swirlAmount * Math.PI);
            ctx.translate(-(this.x + this.imageWidth / 2), -(this.y + this.imageHeight / 2));
        }
    
        if (this.fx.fisheye) {
            console.error("Mehod \"Fisheye\" Not Supported.")
        }
    }    

    draw(ctx, deltaTime) {
        if (this.deleted) return;

        const centerX = this.x + (this.size * this.imageWidth) / 2;
        const centerY = this.y + (this.size * this.imageHeight) / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);

        this.applyEffects(ctx);

        if (this.direction === 'left') {
            ctx.scale(-1, 1);
            if (this.animation) {
                this.animation.update(deltaTime);
                const currentFrame = this.animation.getCurrentFrame();
                ctx.drawImage(currentFrame, this.imageXOffset, this.imageYOffset, currentFrame.width, currentFrame.height, -this.x - (this.size * this.imageWidth), this.y, this.size * this.imageWidth, this.size * this.imageHeight);
            } else {
                ctx.drawImage(this.image, this.imageXOffset, this.imageYOffset, this.image.width, this.image.height, -this.x - (this.size * this.imageWidth), this.y, this.size * this.imageWidth, this.size * this.imageHeight);
            }
        } else {
            if (this.animation) {
                this.animation.update(deltaTime);
                const currentFrame = this.animation.getCurrentFrame();
                ctx.drawImage(currentFrame, this.imageXOffset, this.imageYOffset, currentFrame.width, currentFrame.height, this.x, this.y, this.size * this.imageWidth, this.size * this.imageHeight);
            } else {
                ctx.drawImage(this.image, this.imageXOffset, this.imageYOffset, this.image.width, this.image.height, this.x, this.y, this.size * this.imageWidth, this.size * this.imageHeight);
            }
        }

        //this.applyEffects(ctx);
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

    Object.values(imagePaths).forEach((paths) => {
        paths.forEach((path) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loadedImages++;
                if (loadedImages === Object.values(imagePaths).flat().length) {
                    callback(images);
                }
            };
            images.push(img);
        });
    });
}


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
