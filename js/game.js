// Main Game class
import { CONFIG } from './config.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Projectile } from './entities/Projectile.js';
import { Powerup } from './entities/Powerup.js';
import { InputManager } from './managers/InputManager.js';
import { MathManager } from './managers/MathManager.js';
import { CollisionManager } from './managers/CollisionManager.js';
import { ScoreManager } from './managers/ScoreManager.js';
import { StateManager } from './managers/StateManager.js';
import { AudioManager } from './managers/AudioManager.js';
import { randomInt, randomChoice } from './utils/helpers.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = CONFIG;

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize managers
        this.inputManager = new InputManager();
        this.mathManager = new MathManager('EASY');
        this.collisionManager = new CollisionManager();
        this.scoreManager = new ScoreManager();
        this.stateManager = new StateManager(this.config.STATES.MENU);
        this.audioManager = new AudioManager();

        // Game entities
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.powerups = [];
        this.stars = [];

        // Game state
        this.level = 1;
        this.currentDifficulty = 'EASY';
        this.currentSpeed = this.config.DEFAULT_SPEED;
        this.speedMultiplier = this.config.GAME_SPEED[this.currentSpeed].multiplier;
        this.enemySpawnTimer = 0;
        this.lastSpawnTime = 0;

        // Active powerups
        this.activePowerups = {
            rapidFire: false,
            doublePoints: false
        };

        this.init();
    }

    init() {
        // Create starfield background
        this.createStars();

        // Setup input handlers
        this.inputManager.onShoot(() => this.handleShoot());
        this.inputManager.onPause(() => this.handlePause());

        // Setup UI event listeners
        this.setupUIListeners();

        // State change handler
        this.stateManager.onStateChange((newState) => this.handleStateChange(newState));
    }

    setupUIListeners() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Difficulty select
        const difficultyBtn = document.getElementById('difficulty-select');
        difficultyBtn.addEventListener('click', () => {
            const difficulties = ['EASY', 'MEDIUM', 'HARD'];
            const currentIndex = difficulties.indexOf(this.currentDifficulty);
            const nextIndex = (currentIndex + 1) % difficulties.length;
            this.currentDifficulty = difficulties[nextIndex];
            this.mathManager.setDifficulty(this.currentDifficulty);
            difficultyBtn.textContent = `Difficulty: ${this.config.DIFFICULTY[this.currentDifficulty].name}`;
        });

        // Speed select
        const speedBtn = document.getElementById('speed-select');
        speedBtn.addEventListener('click', () => {
            const speeds = ['SLOW', 'NORMAL', 'FAST', 'VERY_FAST'];
            const currentIndex = speeds.indexOf(this.currentSpeed);
            const nextIndex = (currentIndex + 1) % speeds.length;
            this.currentSpeed = speeds[nextIndex];
            this.speedMultiplier = this.config.GAME_SPEED[this.currentSpeed].multiplier;
            speedBtn.textContent = `Speed: ${this.config.GAME_SPEED[this.currentSpeed].name}`;
            this.updateSpeedDisplay();
        });

        // Instructions
        document.getElementById('instructions').addEventListener('click', () => {
            document.getElementById('instructions-panel').classList.toggle('hidden');
        });

        document.getElementById('close-instructions').addEventListener('click', () => {
            document.getElementById('instructions-panel').classList.add('hidden');
        });

        // Resume game
        document.getElementById('resume-game').addEventListener('click', () => {
            this.resumeGame();
        });

        // Quit to menu
        document.getElementById('quit-game').addEventListener('click', () => {
            this.quitToMenu();
        });

        // Play again
        document.getElementById('play-again').addEventListener('click', () => {
            this.startGame();
        });

        // Back to menu
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.quitToMenu();
        });
    }

    createStars() {
        for (let i = 0; i < this.config.RENDERING.STAR_COUNT; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Update config with actual canvas size
        this.config.CANVAS_WIDTH = this.canvas.width;
        this.config.CANVAS_HEIGHT = this.canvas.height;

        // Update player spawn position
        this.config.PLAYER.START_X = this.canvas.width / 2 - this.config.PLAYER.WIDTH / 2;
        this.config.PLAYER.START_Y = this.canvas.height - 100;
    }

    startGame() {
        // Reset game state
        this.enemies = [];
        this.projectiles = [];
        this.powerups = [];
        this.level = 1;
        this.scoreManager.reset();
        this.inputManager.reset();

        // Update displays
        document.getElementById('level').textContent = this.level;
        this.updateSpeedDisplay();

        // Create player
        this.player = new Player(
            this.config.PLAYER.START_X,
            this.config.PLAYER.START_Y,
            this.config
        );

        // Change state to playing
        this.stateManager.setState(this.config.STATES.PLAYING);
    }

    resumeGame() {
        this.stateManager.setState(this.config.STATES.PLAYING);
    }

    quitToMenu() {
        this.stateManager.setState(this.config.STATES.MENU);
    }

    handlePause() {
        if (this.stateManager.isState(this.config.STATES.PLAYING)) {
            this.stateManager.setState(this.config.STATES.PAUSED);
        } else if (this.stateManager.isState(this.config.STATES.PAUSED)) {
            this.resumeGame();
        }
    }

    handleShoot() {
        if (!this.stateManager.isState(this.config.STATES.PLAYING)) {
            return;
        }

        const answer = this.inputManager.getAnswer();

        if (answer === '' || answer === '-') {
            return;
        }

        // Create projectile with the answer
        const projectile = new Projectile(
            this.player.position.x + this.player.width / 2 - this.config.PROJECTILE.WIDTH / 2,
            this.player.position.y,
            this.config,
            parseInt(answer, 10)
        );

        this.projectiles.push(projectile);
        this.inputManager.clearAnswer();
        this.audioManager.shootSound();
    }

    handleStateChange(newState) {
        // Hide all screens
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('problem-display').classList.add('hidden');

        // Show appropriate screen
        switch (newState) {
            case this.config.STATES.MENU:
                document.getElementById('menu-screen').classList.remove('hidden');
                break;

            case this.config.STATES.PLAYING:
                document.getElementById('problem-display').classList.remove('hidden');
                break;

            case this.config.STATES.PAUSED:
                document.getElementById('pause-screen').classList.remove('hidden');
                break;

            case this.config.STATES.GAME_OVER:
                this.showGameOver();
                break;
        }
    }

    showGameOver() {
        const stats = this.scoreManager.getStats();
        document.getElementById('final-score').textContent = stats.score;
        document.getElementById('accuracy').textContent = stats.accuracy;
        document.getElementById('gameover-screen').classList.remove('hidden');
        this.audioManager.gameOverSound();
    }

    spawnEnemy() {
        if (this.enemies.length >= this.config.ENEMY.MAX_ON_SCREEN) {
            return;
        }

        const problem = this.mathManager.generateProblem(this.config);
        const x = randomInt(0, this.canvas.width - this.config.ENEMY.WIDTH);
        const enemy = new Enemy(x, -this.config.ENEMY.HEIGHT, this.config, problem);

        // Adjust speed based on difficulty
        const difficultyConfig = this.config.DIFFICULTY[this.currentDifficulty];
        enemy.velocity.y = difficultyConfig.enemySpeed;

        this.enemies.push(enemy);

        // Update problem display
        this.updateProblemDisplay(problem);
    }

    updateProblemDisplay(problem) {
        const problemText = document.getElementById('problem-text');
        if (problemText && problem) {
            problemText.textContent = problem.text;
        }
    }

    spawnPowerup(x, y) {
        if (Math.random() > this.config.POWERUP.SPAWN_CHANCE) {
            return;
        }

        const types = Object.keys(this.config.POWERUP.TYPES);
        const type = randomChoice(types);
        const powerup = new Powerup(x, y, this.config, type);
        this.powerups.push(powerup);
    }

    update() {
        if (!this.stateManager.isState(this.config.STATES.PLAYING)) {
            return;
        }

        // Update stars
        this.updateStars();

        // Update player
        this.player.update(this.inputManager, this.speedMultiplier);

        // Spawn enemies (adjust spawn rate based on speed)
        const now = Date.now();
        const baseSpawnRate = this.config.DIFFICULTY[this.currentDifficulty].spawnRate;
        const adjustedSpawnRate = baseSpawnRate / this.speedMultiplier;
        if (now - this.lastSpawnTime > adjustedSpawnRate) {
            this.spawnEnemy();
            this.lastSpawnTime = now;
        }

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.speedMultiplier);

            // Remove if off screen (reached bottom - player loses)
            if (enemy.position.y > this.canvas.height) {
                this.enemies.splice(i, 1);
                this.scoreManager.resetStreak();
                this.player.takeDamage();
                this.audioManager.errorSound();

                if (!this.player.isAlive()) {
                    this.stateManager.setState(this.config.STATES.GAME_OVER);
                }
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(this.speedMultiplier);

            // Remove if off screen
            if (projectile.isOffScreen(this.canvas.width, this.canvas.height)) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.update(this.speedMultiplier);

            // Remove if off screen
            if (powerup.isOffScreen(this.canvas.width, this.canvas.height)) {
                this.powerups.splice(i, 1);
            }
        }

        // Check collisions
        this.checkCollisions();

        // Update score display
        this.scoreManager.updateDisplay();
    }

    updateStars() {
        for (const star of this.stars) {
            star.y += star.speed * this.speedMultiplier;

            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }

    updateSpeedDisplay() {
        const speedDisplay = document.getElementById('speed-display');
        if (speedDisplay) {
            speedDisplay.textContent = `${this.speedMultiplier}x`;
        }
    }

    checkCollisions() {
        // Projectile-Enemy collisions
        const projectileEnemyCollisions = this.collisionManager.checkProjectileEnemyCollisions(
            this.projectiles,
            this.enemies
        );

        for (const collision of projectileEnemyCollisions) {
            const correctAnswer = collision.enemy.getProblem().answer;
            const projectileAnswer = collision.projectile.getAnswer();

            if (correctAnswer === projectileAnswer) {
                // Correct answer!
                this.enemies.splice(collision.enemyIndex, 1);
                this.projectiles.splice(collision.projectileIndex, 1);

                // Update score
                this.scoreManager.incrementStreak(this.config.SCORE.MAX_STREAK);
                const pointsEarned = this.scoreManager.addEnemyScore(
                    this.config.SCORE.ENEMY_DESTROY,
                    this.config.SCORE.STREAK_MULTIPLIER
                );

                // Spawn powerup chance
                this.spawnPowerup(collision.enemy.position.x, collision.enemy.position.y);

                this.audioManager.explosionSound();

                // Spawn next enemy if none left
                if (this.enemies.length === 0) {
                    this.spawnEnemy();
                }
            }
        }

        // Player-Enemy collisions
        const playerEnemyCollisions = this.collisionManager.checkPlayerEnemyCollisions(
            this.player,
            this.enemies
        );

        for (const collision of playerEnemyCollisions) {
            this.enemies.splice(collision.enemyIndex, 1);
            const damaged = this.player.takeDamage();

            if (damaged) {
                this.scoreManager.resetStreak();
                this.audioManager.errorSound();

                if (!this.player.isAlive()) {
                    this.stateManager.setState(this.config.STATES.GAME_OVER);
                }
            }
        }

        // Player-Powerup collisions
        const playerPowerupCollisions = this.collisionManager.checkPlayerPowerupCollisions(
            this.player,
            this.powerups
        );

        for (const collision of playerPowerupCollisions) {
            this.powerups.splice(collision.powerupIndex, 1);
            this.activatePowerup(collision.powerup);
        }
    }

    activatePowerup(powerup) {
        const type = powerup.getType();
        const typeData = powerup.getTypeData();

        this.audioManager.powerupSound();

        switch (type) {
            case 'SHIELD':
                this.player.activateShield(typeData.duration);
                break;

            case 'RAPID_FIRE':
                this.activePowerups.rapidFire = true;
                setTimeout(() => {
                    this.activePowerups.rapidFire = false;
                }, typeData.duration);
                break;

            case 'DOUBLE_POINTS':
                this.activePowerups.doublePoints = true;
                setTimeout(() => {
                    this.activePowerups.doublePoints = false;
                }, typeData.duration);
                break;

            case 'EXTRA_LIFE':
                this.player.addLife();
                break;
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars
        this.renderStars();

        if (this.stateManager.isState(this.config.STATES.PLAYING) ||
            this.stateManager.isState(this.config.STATES.PAUSED)) {
            // Render entities
            this.player.render(this.ctx);

            for (const enemy of this.enemies) {
                enemy.render(this.ctx);
            }

            for (const projectile of this.projectiles) {
                projectile.render(this.ctx);
            }

            for (const powerup of this.powerups) {
                powerup.render(this.ctx);
            }
        }
    }

    renderStars() {
        this.ctx.fillStyle = '#fff';
        for (const star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Main game loop
    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    // Start the game loop
    start() {
        this.loop();
    }
}
