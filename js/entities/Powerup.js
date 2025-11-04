// Powerup entity
import { Entity } from './Entity.js';
import { drawText } from '../utils/helpers.js';

export class Powerup extends Entity {
    constructor(x, y, config, type) {
        super(x, y, config.POWERUP.WIDTH, config.POWERUP.HEIGHT);
        this.speed = config.POWERUP.SPEED;
        this.type = type;
        this.typeData = config.POWERUP.TYPES[type];
        this.color = this.typeData.color;
        this.velocity.y = this.speed;
        this.rotation = 0;
    }

    // Update powerup
    update() {
        super.update();
        this.rotation += 0.05; // Rotate for visual effect
    }

    // Render powerup
    render(ctx) {
        ctx.save();

        // Center position
        const centerX = this.position.x + this.width / 2;
        const centerY = this.position.y + this.height / 2;

        // Rotate
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        // Draw diamond shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(-this.width / 2, 0);
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.restore();

        // Draw type indicator
        const icon = this.getPowerupIcon();
        drawText(ctx, icon, centerX, centerY, 20, '#fff');
    }

    // Get icon for powerup type
    getPowerupIcon() {
        switch (this.type) {
            case 'SHIELD':
                return '🛡';
            case 'RAPID_FIRE':
                return '⚡';
            case 'DOUBLE_POINTS':
                return '2x';
            case 'EXTRA_LIFE':
                return '❤';
            default:
                return '?';
        }
    }

    // Get powerup type
    getType() {
        return this.type;
    }

    // Get type data
    getTypeData() {
        return this.typeData;
    }
}
