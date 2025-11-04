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
        // Draw ship as triangle
        const centerX = this.position.x;
        const centerY = this.position.y;

        // Flashing effect when invincible
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return; // Don't draw to create flashing effect
        }

        // Draw shield if active
        if (this.shield) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(
                centerX + this.width / 2,
                centerY + this.height / 2,
                this.width,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }

        // Draw the ship
        drawTriangle(ctx, centerX, centerY, this.width, this.height, this.color);

        // Draw engine glow
        ctx.fillStyle = '#ff8800';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(
            centerX + this.width / 2 - 5,
            centerY + this.height,
            10,
            8
        );
        ctx.globalAlpha = 1;
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
