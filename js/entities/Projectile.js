// Projectile entity
import { Entity } from './Entity.js';

export class Projectile extends Entity {
    constructor(x, y, config, answer) {
        super(x, y, config.PROJECTILE.WIDTH, config.PROJECTILE.HEIGHT);
        this.speed = config.PROJECTILE.SPEED;
        this.color = config.PROJECTILE.COLOR;
        this.answer = answer;
        this.velocity.y = -this.speed; // Move upward
    }

    // Update projectile
    update() {
        super.update();
    }

    // Render projectile
    render(ctx) {
        // Draw projectile
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    // Get the answer this projectile carries
    getAnswer() {
        return this.answer;
    }
}
