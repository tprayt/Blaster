// Particle entity for explosions and effects
import { Entity } from './Entity.js';
import { Vector2D } from '../utils/Vector2D.js';

export class Particle extends Entity {
    constructor(x, y, color, angle, speed, shape = 'circle') {
        super(x, y, 3, 3);
        this.color = color;
        this.velocity = Vector2D.fromAngle(angle, speed);
        this.life = 60; // frames
        this.maxLife = 60;
        this.size = Math.random() * 5 + 3; // Larger particles (3-8px)
        this.shape = shape; // 'circle' or 'square'
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update(speedMultiplier = 1.0) {
        super.update(speedMultiplier);
        this.life--;
        this.rotation += this.rotationSpeed;

        // Fade and shrink over time
        this.size *= 0.95;

        // Mark for removal when life expires
        if (this.life <= 0) {
            this.active = false;
        }
    }

    render(ctx) {
        ctx.save();

        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;

        // Enhanced glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = this.color;

        if (this.shape === 'square') {
            // Draw rotated square
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            // Draw circle
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Create an enhanced explosion effect
export function createExplosion(x, y, color, particleCount = 20) {
    const particles = [];

    // Create lighter color variants
    const colorVariants = [
        color,
        lightenColor(color, 0.3),
        lightenColor(color, 0.6),
        '#ffffff'  // Some white particles
    ];

    // Add white flash particle at center
    const flash = new Particle(x, y, '#ffffff', 0, 0);
    flash.size = 15;
    flash.life = 10;
    flash.maxLife = 10;
    particles.push(flash);

    // Create main explosion particles
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = Math.random() * 4 + 2; // Faster particles
        const particleColor = colorVariants[Math.floor(Math.random() * colorVariants.length)];
        const shape = Math.random() > 0.7 ? 'square' : 'circle'; // 30% squares
        particles.push(new Particle(x, y, particleColor, angle, speed, shape));
    }

    return particles;
}

// Helper to lighten a color
function lightenColor(color, amount) {
    // Parse hex color if provided
    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(255 * amount));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(255 * amount));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(255 * amount));
        return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
}
