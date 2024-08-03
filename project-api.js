//x = 100, y = 100, size = 400, image = { filepath: 'Breakout/Breakout.svg' }, fx = { color: 0, pixelation: 2, ghost: 0.5, whirl: 30, fisheye: 1 }
class Sprite {
    constructor(x, y, size, image, fx) {
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

    draw(ctx) {
        if (this.deleted) return;

        const centerX = this.x + ((this.size / 100) * this.imageWidth) / 2;
        const centerY = this.y + ((this.size / 100) * this.imageHeight) / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
        if (this.direction === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.imageXOffset, this.imageYOffset, this.image.width, this.image.height, -this.x - ((this.size / 100) * this.imageWidth), this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
        } else {
            ctx.drawImage(this.image, this.imageXOffset, this.imageYOffset, this.image.width, this.image.height, this.x, this.y, (this.size / 100) * this.imageWidth, (this.size / 100) * this.imageHeight);
        }
        this.applyEffects(ctx);
        ctx.restore();
        ctx.globalAlpha = 1.0;
        ctx.filter = 'none';
    }
}
