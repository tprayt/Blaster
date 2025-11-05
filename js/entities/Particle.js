// Particle entity for explosions and effects
import { Entity } from './Entity.js';
import { Vector2D } from '../utils/Vector2D.js';

export class Particle extends Entity {
    constructor(x, y, color, angle, speed) {
        super(x, y, 3, 3);
        this.color = color;
        this.velocity = Vector2D.fromAngle(angle, speed);
        this.life = 60; // frames
        this.maxLife = 60;
        this.size = Math.random() * 3 + 2;
    }

    update(speedMultiplier = 1.0) {
        super.update(speedMultiplier);
        this.life--;

        // Fade and shrink over time
        this.size *= 0.96;

        // Mark for removal when life expires
        if (this.life <= 0) {
            this.active = false;
        }
    }

    render(ctx) {
        ctx.save();

        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;

        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.fillStyle = this.color;

        // Draw particle
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Create an explosion effect
export function createExplosion(x, y, color, particleCount = 20) {
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = Math.random() * 3 + 1;
        particles.push(new Particle(x, y, color, angle, speed));
    }

    return particles;
}
