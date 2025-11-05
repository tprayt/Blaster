// Game Configuration
export const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,

    // Game States
    STATES: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },

    // Player
    PLAYER: {
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 5,
        START_X: 600,
        START_Y: 700,
        LIVES: 3,
        COLOR: '#00ffff'
    },

    // Enemy
    ENEMY: {
        WIDTH: 60,
        HEIGHT: 60,
        SPEED: 1,
        SPAWN_RATE: 2000, // milliseconds
        MAX_ON_SCREEN: 5,
        COLORS: ['#ff0000', '#ff6600', '#ff00ff', '#ff0088']
    },

    // Projectile
    PROJECTILE: {
        WIDTH: 8,
        HEIGHT: 20,
        SPEED: 8,
        COLOR: '#ffff00'
    },

    // Power-ups
    POWERUP: {
        WIDTH: 40,
        HEIGHT: 40,
        SPEED: 2,
        SPAWN_CHANCE: 0.15, // 15% chance on enemy destroy
        TYPES: {
            SHIELD: { color: '#00ff00', duration: 5000 },
            RAPID_FIRE: { color: '#ff8800', duration: 8000 },
            DOUBLE_POINTS: { color: '#ffff00', duration: 10000 },
            EXTRA_LIFE: { color: '#ff00ff', duration: 0 }
        }
    },

    // Scoring
    SCORE: {
        ENEMY_DESTROY: 100,
        STREAK_MULTIPLIER: 50,
        MAX_STREAK: 10
    },

    // Difficulty Settings
    DIFFICULTY: {
        EASY: {
            name: 'Easy',
            operations: ['addition', 'subtraction'],
            maxNumber: 20,
            enemySpeed: 1,
            spawnRate: 2500
        },
        MEDIUM: {
            name: 'Medium',
            operations: ['addition', 'subtraction', 'multiplication'],
            maxNumber: 50,
            enemySpeed: 1.5,
            spawnRate: 2000
        },
        HARD: {
            name: 'Hard',
            operations: ['addition', 'subtraction', 'multiplication', 'division'],
            maxNumber: 100,
            enemySpeed: 2,
            spawnRate: 1500
        }
    },

    // Physics
    PHYSICS: {
        GRAVITY: 0,
        FRICTION: 0.95
    },

    // Rendering
    RENDERING: {
        FPS: 60,
        STAR_COUNT: 100
    },

    // Game Speed Control
    GAME_SPEED: {
        SUPER_SLOW: { name: 'Super Slow (0.1x)', multiplier: 0.1 },
        VERY_SLOW: { name: 'Very Slow (0.25x)', multiplier: 0.25 },
        SLOW: { name: 'Slow (0.5x)', multiplier: 0.5 },
        MEDIUM: { name: 'Medium (0.75x)', multiplier: 0.75 },
        NORMAL: { name: 'Normal (1x)', multiplier: 1.0 },
        FAST: { name: 'Fast (1.25x)', multiplier: 1.25 }
    },
    DEFAULT_SPEED: 'NORMAL'
};
