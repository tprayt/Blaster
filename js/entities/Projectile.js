// Projectile entity
import { Entity } from './Entity.js';

export class Projectile extends Entity {
    constructor(x, y, config, answer) {
        super(x, y, config.PROJECTILE.WIDTH, config.PROJECTILE.HEIGHT);
        this.speed = config.PROJECTILE.SPEED;
        this.color = config.PROJECTILE.COLOR;
        this.answer = answer;
        this.velocity.y = -this.speed; // Move upward
        this.animFrame = 0;
    }

    // Update projectile
    update(speedMultiplier = 1.0) {
        super.update(speedMultiplier);
        this.animFrame++;
    }

    // Render projectile as energy bolt
    render(ctx) {
        ctx.save();

        const centerX = this.position.x + this.width / 2;
        const centerY = this.position.y + this.height / 2;

        // Energy trail
        const trailGradient = ctx.createLinearGradient(
            centerX,
            this.position.y,
            centerX,
            this.position.y + this.height + 10
        );
        trailGradient.addColorStop(0, 'transparent');
        trailGradient.addColorStop(0.3, 'rgba(255, 255, 0, 0.4)');
        trailGradient.addColorStop(1, 'rgba(255, 255, 0, 0.8)');
        ctx.fillStyle = trailGradient;
        ctx.fillRect(centerX - 3, this.position.y + this.height, 6, 10);

        // Outer glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.color;

        // Main bolt shape (elongated hexagon)
        ctx.beginPath();
        ctx.moveTo(centerX, this.position.y);
        ctx.lineTo(centerX + 4, this.position.y + 5);
        ctx.lineTo(centerX + 4, this.position.y + this.height - 5);
        ctx.lineTo(centerX, this.position.y + this.height);
        ctx.lineTo(centerX - 4, this.position.y + this.height - 5);
        ctx.lineTo(centerX - 4, this.position.y + 5);
        ctx.closePath();
        ctx.fill();

        // Inner bright core
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(centerX, this.position.y + 2);
        ctx.lineTo(centerX + 2, this.position.y + 6);
        ctx.lineTo(centerX + 2, this.position.y + this.height - 6);
        ctx.lineTo(centerX, this.position.y + this.height - 2);
        ctx.lineTo(centerX - 2, this.position.y + this.height - 6);
        ctx.lineTo(centerX - 2, this.position.y + 6);
        ctx.closePath();
        ctx.fill();

        // Energy sparks
        ctx.shadowBlur = 5;
        ctx.fillStyle = this.color;
        const sparkOffset = Math.sin(this.animFrame * 0.3) * 2;
        ctx.fillRect(centerX - 1 + sparkOffset, centerY - 3, 2, 2);
        ctx.fillRect(centerX - 1 - sparkOffset, centerY + 3, 2, 2);

        ctx.restore();
    }

    // Get the answer this projectile carries
    getAnswer() {
        return this.answer;
    }
}
