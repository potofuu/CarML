class Car {
    constructor(x, y, width, height, controlType, maxVel = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vel = 0;
        this.acceleration = 0.2;
        this.maxVel = maxVel;
        this.friction = 0.04;
        this.angle = 0;
        this.damaged = false;

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
        }

        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({x: this.x - Math.sin(this.angle - alpha) * rad, 
                    y: this.y - Math.cos(this.angle - alpha) * rad});
        points.push({x: this.x - Math.sin(this.angle + alpha) * rad, 
                    y: this.y - Math.cos(this.angle + alpha) * rad});
        points.push({x: this.x - Math.sin(this.angle - alpha + Math.PI) * rad, 
                    y: this.y - Math.cos(this.angle - alpha + Math.PI) * rad});
        points.push({x: this.x - Math.sin(this.angle + alpha + Math.PI) * rad, 
                    y: this.y - Math.cos(this.angle + alpha + Math.PI) * rad});
        return points;
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

    draw(ctx, color) {
        if (this.damaged) {
            ctx.fillStyle = "red";
        } else { 
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        
        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}