class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vel = 0;
        this.acceleration = 0.2;
        this.maxVel = 3;
        this.friction = 0.04;
        this.angle = 0;

        this.controls = new Controls();
    }

    update() {
        this.#move();
    }

    #move() {
        if (this.controls.forward) {
            this.vel += this.acceleration;
        }
        if (this.controls.reverse) {
            this.vel -= this.acceleration;
        }
        if (this.vel > this.maxVel) {
            this.vel = this.maxVel;
        }
        if (this.vel < -this.maxVel/2) {
            this.vel = -this.maxVel/2;
        }
        if (this.vel > 0) {
            this.vel -= this.friction;
        }
        if (this.vel < 0) {
            this.vel += this.friction;
        }
        if (Math.abs(this.vel) < this.friction) {
            this.vel = 0;
        }
        if (this.speed != 0) {
            const flip = this.vel >= 0 ? 1:-1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.vel;
        this.y -= Math.cos(this.angle) * this.vel;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();
    }
}