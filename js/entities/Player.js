// Player entity
import { Entity } from './Entity.js';
import { Vector2D } from '../utils/Vector2D.js';
import { clamp, drawTriangle } from '../utils/helpers.js';

export class Player extends Entity {
    constructor(x, y, config) {
        super(x, y, config.PLAYER.WIDTH, config.PLAYER.HEIGHT);
        this.speed = config.PLAYER.SPEED;
        this.lives = config.PLAYER.LIVES;
        this.maxLives = config.PLAYER.LIVES;
        this.color = config.PLAYER.COLOR;
        this.canvasWidth = config.CANVAS_WIDTH;
        this.canvasHeight = config.CANVAS_HEIGHT;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.shield = false;
    }

    // Update player based on input
    update(inputManager, speedMultiplier = 1.0) {
        const direction = inputManager.getMovementDirection();

        // Apply movement (player speed is not affected by game speed - stays responsive)
        this.velocity.set(direction.x * this.speed, direction.y * this.speed);

        // Update position (pass 1.0 to keep player at normal speed)
        super.update(1.0);

        // Keep player within bounds
        this.position.x = clamp(this.position.x, 0, this.canvasWidth - this.width);
        this.position.y = clamp(this.position.y, 0, this.canvasHeight - this.height);

        // Update invincibility timer
        if (this.invincibleTimer > 0) {
            this.invincibleTimer--;
            if (this.invincibleTimer === 0) {
                this.invincible = false;
            }
        }
    }

    // Render player
    render(ctx) {
        const centerX = this.position.x + this.width / 2;
        const centerY = this.position.y + this.height / 2;

        // Flashing effect when invincible
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return; // Don't draw to create flashing effect
        }

        ctx.save();

        // Draw shield if active
        if (this.shield) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.width * 0.9, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Engine trail (animated)
        const enginePulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        const trailGradient = ctx.createLinearGradient(
            centerX,
            this.position.y + this.height,
            centerX,
            this.position.y + this.height + 15
        );
        trailGradient.addColorStop(0, `rgba(255, 136, 0, ${enginePulse})`);
        trailGradient.addColorStop(0.5, `rgba(255, 200, 0, ${enginePulse * 0.5})`);
        trailGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = trailGradient;
        ctx.fillRect(centerX - 6, this.position.y + this.height, 4, 15);
        ctx.fillRect(centerX + 2, this.position.y + this.height, 4, 15);

        // Main ship body
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // Nose cone
        ctx.beginPath();
        ctx.moveTo(centerX, this.position.y);
        ctx.lineTo(centerX + 8, centerY - 5);
        ctx.lineTo(centerX + 8, centerY);
        ctx.lineTo(centerX - 8, centerY);
        ctx.lineTo(centerX - 8, centerY - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Main fuselage
        ctx.fillRect(centerX - 10, centerY, 20, 25);
        ctx.strokeRect(centerX - 10, centerY, 20, 25);

        // Wings
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY + 5);
        ctx.lineTo(centerX - 25, centerY + 10);
        ctx.lineTo(centerX - 25, centerY + 18);
        ctx.lineTo(centerX - 10, centerY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY + 5);
        ctx.lineTo(centerX + 25, centerY + 10);
        ctx.lineTo(centerX + 25, centerY + 18);
        ctx.lineTo(centerX + 10, centerY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(centerX - 5, centerY + 3, 10, 8);
        ctx.strokeRect(centerX - 5, centerY + 3, 10, 8);

        // Cockpit glass effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(centerX - 4, centerY + 4, 4, 6);

        // Engine details
        ctx.fillStyle = '#333';
        ctx.fillRect(centerX - 8, centerY + 23, 5, 2);
        ctx.fillRect(centerX + 3, centerY + 23, 5, 2);

        // Engine glow
        ctx.fillStyle = '#ff8800';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur = 8;
        ctx.fillRect(centerX - 8, centerY + 23, 5, 3);
        ctx.fillRect(centerX + 3, centerY + 23, 5, 3);

        // Accent lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 6, centerY + 12);
        ctx.lineTo(centerX - 6, centerY + 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 6, centerY + 12);
        ctx.lineTo(centerX + 6, centerY + 20);
        ctx.stroke();

        ctx.restore();
    }

    // Take damage
    takeDamage() {
        if (this.invincible || this.shield) {
            if (this.shield) {
                this.shield = false;
            }
            return false;
        }

        this.lives--;
        this.makeInvincible(120); // 2 seconds at 60 FPS
        this.updateLivesDisplay();
        return true;
    }

    // Make player invincible for a duration
    makeInvincible(frames) {
        this.invincible = true;
        this.invincibleTimer = frames;
    }

    // Activate shield
    activateShield(duration) {
        this.shield = true;
        setTimeout(() => {
            this.shield = false;
        }, duration);
    }

    // Add a life
    addLife() {
        if (this.lives < this.maxLives) {
            this.lives++;
            this.updateLivesDisplay();
        }
    }

    // Check if player is alive
    isAlive() {
        return this.lives > 0;
    }

    // Get lives count
    getLives() {
        return this.lives;
    }

    // Update lives display
    updateLivesDisplay() {
        const livesElement = document.getElementById('lives');
        if (livesElement) {
            livesElement.textContent = this.lives;
        }
    }

    // Reset player position and state
    reset(config) {
        this.position.set(config.PLAYER.START_X, config.PLAYER.START_Y);
        this.velocity.set(0, 0);
        this.lives = config.PLAYER.LIVES;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.shield = false;
        this.updateLivesDisplay();
    }
}
