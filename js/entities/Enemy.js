// Enemy entity
import { Entity } from './Entity.js';
import { drawRect, drawText } from '../utils/helpers.js';

export class Enemy extends Entity {
    constructor(x, y, config, problem) {
        super(x, y, config.ENEMY.WIDTH, config.ENEMY.HEIGHT);
        this.speed = config.ENEMY.SPEED;
        this.color = config.ENEMY.COLORS[Math.floor(Math.random() * config.ENEMY.COLORS.length)];
        this.problem = problem;
        this.velocity.y = this.speed;
    }

    // Update enemy position
    update() {
        super.update();
    }

    // Render enemy
    render(ctx) {
        // Draw enemy body
        drawRect(ctx, this.position.x, this.position.y, this.width, this.height, this.color, '#fff', 2);

        // Draw problem text
        drawText(
            ctx,
            this.problem.text,
            this.position.x + this.width / 2,
            this.position.y + this.height / 2,
            16,
            '#fff'
        );

        // Draw danger indicator
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(this.position.x, this.position.y + this.height - 5, this.width, 5);
    }

    // Get the problem associated with this enemy
    getProblem() {
        return this.problem;
    }
}
