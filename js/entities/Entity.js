// Base Entity class
import { Vector2D } from '../utils/Vector2D.js';

export class Entity {
    constructor(x, y, width, height) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.width = width;
        this.height = height;
        this.active = true;
    }

    // Update entity position
    update() {
        this.position.add(this.velocity);
    }

    // Render entity (to be overridden by subclasses)
    render(ctx) {
        // Default rendering - draw a rectangle
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Check if entity is off screen
    isOffScreen(canvasWidth, canvasHeight) {
        return (
            this.position.x + this.width < 0 ||
            this.position.x > canvasWidth ||
            this.position.y + this.height < 0 ||
            this.position.y > canvasHeight
        );
    }

    // Mark entity for removal
    destroy() {
        this.active = false;
    }

    // Check if entity is still active
    isActive() {
        return this.active;
    }

    // Get center position
    getCenter() {
        return new Vector2D(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
    }
}
