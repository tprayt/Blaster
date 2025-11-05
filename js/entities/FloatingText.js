// Floating Text entity for score feedback
import { Entity } from './Entity.js';

export class FloatingText extends Entity {
    constructor(x, y, text, color = '#ffff00') {
        super(x, y, 0, 0);
        this.text = text;
        this.color = color;
        this.life = 60; // frames (1 second)
        this.maxLife = 60;
        this.velocity.y = -1; // Float upward
        this.fontSize = 20;
    }

    update(speedMultiplier = 1.0) {
        super.update(1.0); // Don't apply speed multiplier to floating text
        this.life--;

        // Mark for removal when life expires
        if (this.life <= 0) {
            this.active = false;
        }
    }

    render(ctx) {
        ctx.save();

        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;

        // Text styling
        ctx.font = `bold ${this.fontSize}px 'Courier New', monospace`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;

        // Draw text with outline
        ctx.strokeText(this.text, this.position.x, this.position.y);
        ctx.fillText(this.text, this.position.x, this.position.y);

        ctx.restore();
    }
}
