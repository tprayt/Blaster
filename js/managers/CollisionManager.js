// Collision Manager - Handles collision detection
import { checkCollision } from '../utils/helpers.js';

export class CollisionManager {
    constructor() {
        this.collisionCallbacks = [];
    }

    // Check collision between two entities
    checkEntityCollision(entity1, entity2) {
        return checkCollision(
            {
                x: entity1.position.x,
                y: entity1.position.y,
                width: entity1.width,
                height: entity1.height
            },
            {
                x: entity2.position.x,
                y: entity2.position.y,
                width: entity2.width,
                height: entity2.height
            }
        );
    }

    // Check collisions between projectiles and enemies
    checkProjectileEnemyCollisions(projectiles, enemies) {
        const collisions = [];

        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];

            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];

                if (this.checkEntityCollision(projectile, enemy)) {
                    collisions.push({
                        projectile: projectile,
                        enemy: enemy,
                        projectileIndex: i,
                        enemyIndex: j
                    });
                }
            }
        }

        return collisions;
    }

    // Check collisions between player and enemies
    checkPlayerEnemyCollisions(player, enemies) {
        const collisions = [];

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            if (this.checkEntityCollision(player, enemy)) {
                collisions.push({
                    enemy: enemy,
                    enemyIndex: i
                });
            }
        }

        return collisions;
    }

    // Check collisions between player and powerups
    checkPlayerPowerupCollisions(player, powerups) {
        const collisions = [];

        for (let i = powerups.length - 1; i >= 0; i--) {
            const powerup = powerups[i];

            if (this.checkEntityCollision(player, powerup)) {
                collisions.push({
                    powerup: powerup,
                    powerupIndex: i
                });
            }
        }

        return collisions;
    }

    // Register collision callback
    onCollision(callback) {
        this.collisionCallbacks.push(callback);
    }

    // Trigger collision callbacks
    triggerCollision(type, data) {
        this.collisionCallbacks.forEach(callback => callback(type, data));
    }
}
