// Enemy entity
import { Entity } from './Entity.js';
import { drawText } from '../utils/helpers.js';

export class Enemy extends Entity {
    constructor(x, y, config, problem) {
        super(x, y, config.ENEMY.WIDTH, config.ENEMY.HEIGHT);
        this.speed = config.ENEMY.SPEED;
        this.color = config.ENEMY.COLORS[Math.floor(Math.random() * config.ENEMY.COLORS.length)];
        this.problem = problem;
        this.velocity.y = this.speed;
        this.animFrame = 0;
        this.shipType = Math.floor(Math.random() * 3); // 3 different ship designs
    }

    // Update enemy position
    update(speedMultiplier = 1.0) {
        super.update(speedMultiplier);
        this.animFrame++;
    }

    // Render enemy spaceship
    render(ctx) {
        const centerX = this.position.x + this.width / 2;
        const centerY = this.position.y + this.height / 2;

        ctx.save();

        // Engine glow/trail (pulsing effect)
        const enginePulse = Math.sin(this.animFrame * 0.2) * 0.3 + 0.7;
        const trailLength = 8;
        const gradient = ctx.createLinearGradient(
            centerX,
            this.position.y - trailLength,
            centerX,
            this.position.y
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, this.color + Math.floor(enginePulse * 255).toString(16).padStart(2, '0'));
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX - 3, this.position.y - trailLength, 6, trailLength);

        // Draw ship based on type
        if (this.shipType === 0) {
            this.drawClassicShip(ctx, centerX, centerY);
        } else if (this.shipType === 1) {
            this.drawWingedShip(ctx, centerX, centerY);
        } else {
            this.drawHexagonShip(ctx, centerX, centerY);
        }

        // Draw cockpit window
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(centerX - 4, centerY - 8, 8, 6);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fillRect(centerX - 3, centerY - 7, 6, 4);

        // Draw problem text with background
        const problemY = this.position.y + this.height + 15;
        const textMetrics = ctx.measureText(this.problem.text);
        const textWidth = textMetrics.width || this.problem.text.length * 10;

        // Problem background box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(centerX - textWidth / 2 - 5, problemY - 12, textWidth + 10, 20);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - textWidth / 2 - 5, problemY - 12, textWidth + 10, 20);

        // Problem text
        drawText(ctx, this.problem.text, centerX, problemY, 14, '#fff');

        ctx.restore();
    }

    // Classic invader-style ship
    drawClassicShip(ctx, centerX, centerY) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // Main body
        ctx.fillRect(centerX - 15, centerY - 10, 30, 20);
        ctx.strokeRect(centerX - 15, centerY - 10, 30, 20);

        // Top fin
        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY - 10);
        ctx.lineTo(centerX, centerY - 18);
        ctx.lineTo(centerX + 8, centerY - 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Side wings
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY);
        ctx.lineTo(centerX - 25, centerY - 5);
        ctx.lineTo(centerX - 25, centerY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY);
        ctx.lineTo(centerX + 25, centerY - 5);
        ctx.lineTo(centerX + 25, centerY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Engine ports
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(centerX - 12, centerY + 8, 5, 4);
        ctx.fillRect(centerX + 7, centerY + 8, 5, 4);
    }

    // Winged fighter ship
    drawWingedShip(ctx, centerX, centerY) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // Main fuselage
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX + 10, centerY + 10);
        ctx.lineTo(centerX - 10, centerY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wings
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY);
        ctx.lineTo(centerX - 28, centerY - 8);
        ctx.lineTo(centerX - 28, centerY + 2);
        ctx.lineTo(centerX - 10, centerY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY);
        ctx.lineTo(centerX + 28, centerY - 8);
        ctx.lineTo(centerX + 28, centerY + 2);
        ctx.lineTo(centerX + 10, centerY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Engines
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(centerX - 4, centerY + 8, 3, 4);
        ctx.fillRect(centerX + 1, centerY + 8, 3, 4);
    }

    // Hexagon ship
    drawHexagonShip(ctx, centerX, centerY) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // Hexagonal main body
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX + 12, centerY - 7);
        ctx.lineTo(centerX + 12, centerY + 7);
        ctx.lineTo(centerX, centerY + 15);
        ctx.lineTo(centerX - 12, centerY + 7);
        ctx.lineTo(centerX - 12, centerY - 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Side panels
        ctx.fillRect(centerX - 20, centerY - 3, 8, 6);
        ctx.strokeRect(centerX - 20, centerY - 3, 8, 6);
        ctx.fillRect(centerX + 12, centerY - 3, 8, 6);
        ctx.strokeRect(centerX + 12, centerY - 3, 8, 6);

        // Engine glow
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(centerX - 6, centerY + 12, 4, 3);
        ctx.fillRect(centerX + 2, centerY + 12, 4, 3);
    }

    // Get the problem associated with this enemy
    getProblem() {
        return this.problem;
    }
}
