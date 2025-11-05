// Main Game class
import { CONFIG } from './config.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Projectile } from './entities/Projectile.js';
import { Powerup } from './entities/Powerup.js';
import { createExplosion } from './entities/Particle.js';
import { FloatingText } from './entities/FloatingText.js';
import { InputManager } from './managers/InputManager.js';
import { MathManager } from './managers/MathManager.js';
import { CollisionManager } from './managers/CollisionManager.js';
import { ScoreManager } from './managers/ScoreManager.js';
import { StateManager } from './managers/StateManager.js';
import { AudioManager } from './managers/AudioManager.js';
import { HighScoreManager } from './managers/HighScoreManager.js';
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
        this.highScoreManager = new HighScoreManager(10);

        // Game entities
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.powerups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.stars = [];

        // Visual effects
        this.screenShake = { x: 0, y: 0, intensity: 0 };

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
            const speeds = ['SUPER_SLOW', 'VERY_SLOW', 'SLOW', 'MEDIUM', 'NORMAL', 'FAST'];
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

        // Submit score
        document.getElementById('submit-score').addEventListener('click', () => {
            this.submitHighScore();
        });

        // Allow Enter key in name input to submit
        document.getElementById('player-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitHighScore();
            }
        });
    }

    createStars() {
        // Create 3 layers of stars for parallax effect
        const layerCount = this.config.RENDERING.STAR_COUNT / 3;

        // Layer 1: Far stars (small, slow, blue tint)
        for (let i = 0; i < layerCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 0.5 + 0.5,
                speed: (Math.random() * 0.2 + 0.1) * 0.4,
                color: 'rgba(150, 180, 255, 0.6)',
                layer: 1
            });
        }

        // Layer 2: Mid stars (medium, medium speed, cyan tint)
        for (let i = 0; i < layerCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1 + 1,
                speed: (Math.random() * 0.3 + 0.2) * 0.7,
                color: 'rgba(200, 230, 255, 0.8)',
                layer: 2
            });
        }

        // Layer 3: Near stars (large, fast, white)
        for (let i = 0; i < layerCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 1.5,
                speed: (Math.random() * 0.5 + 0.3) * 1.0,
                color: 'rgba(255, 255, 255, 1)',
                layer: 3
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
        this.particles = [];
        this.floatingTexts = [];
        this.screenShake = { x: 0, y: 0, intensity: 0 };
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
                // Update high scores display
                this.highScoreManager.displayHighScores('highscores-display');
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

        // Check if this is a high score
        const isHighScore = this.highScoreManager.isHighScore(stats.score);
        const nameEntryContainer = document.getElementById('name-entry-container');
        const highScoreMessage = document.getElementById('highscore-message');

        if (isHighScore) {
            // Show name entry form
            nameEntryContainer.classList.remove('hidden');
            highScoreMessage.classList.add('hidden');

            // Clear previous name and focus input
            const nameInput = document.getElementById('player-name-input');
            nameInput.value = '';
            setTimeout(() => nameInput.focus(), 100);
        } else {
            // Hide name entry form
            nameEntryContainer.classList.add('hidden');
            highScoreMessage.classList.add('hidden');
        }

        // Display missed problems
        const missedProblemsContainer = document.getElementById('missed-problems-list');
        if (missedProblemsContainer) {
            if (stats.missedProblems.length === 0) {
                missedProblemsContainer.innerHTML = '<p style="color: #00ff00;">Perfect! No problems missed!</p>';
            } else {
                let html = '<h3>Problems to Practice:</h3><ul>';
                stats.missedProblems.forEach((item, index) => {
                    html += `<li><span class="problem">${item.problem}</span> = <span class="answer">${item.answer}</span></li>`;
                });
                html += '</ul>';
                missedProblemsContainer.innerHTML = html;
            }
        }

        document.getElementById('gameover-screen').classList.remove('hidden');
        this.audioManager.gameOverSound();
    }

    submitHighScore() {
        const nameInput = document.getElementById('player-name-input');
        const name = nameInput.value.trim() || 'Anonymous';
        const stats = this.scoreManager.getStats();

        // Add score to high scores
        const success = this.highScoreManager.addScore(name, stats.score, stats.accuracy);

        if (success) {
            // Get the rank
            const rank = this.highScoreManager.getRank(stats.score);

            // Hide name entry form
            document.getElementById('name-entry-container').classList.add('hidden');

            // Show success message
            const highScoreMessage = document.getElementById('highscore-message');
            highScoreMessage.textContent = `🏆 High Score! You ranked #${rank}! 🏆`;
            highScoreMessage.classList.remove('hidden');

            // Play a success sound (reuse powerup sound)
            this.audioManager.powerupSound();
        }
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
                // Track missed problem
                const problem = enemy.getProblem();
                this.scoreManager.addMissedProblem(problem.text, problem.answer);

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

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(this.speedMultiplier);

            // Remove if inactive
            if (!particle.isActive()) {
                this.particles.splice(i, 1);
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            text.update();

            // Remove if inactive
            if (!text.isActive()) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // Update screen shake
        if (this.screenShake.intensity > 0) {
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.intensity *= 0.9; // Decay
            if (this.screenShake.intensity < 0.1) {
                this.screenShake.intensity = 0;
                this.screenShake.x = 0;
                this.screenShake.y = 0;
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
                // Create explosion at enemy position
                const explosionX = collision.enemy.position.x + collision.enemy.width / 2;
                const explosionY = collision.enemy.position.y + collision.enemy.height / 2;
                const explosionParticles = createExplosion(explosionX, explosionY, collision.enemy.color, 25);
                this.particles.push(...explosionParticles);

                this.enemies.splice(collision.enemyIndex, 1);
                this.projectiles.splice(collision.projectileIndex, 1);

                // Update score
                this.scoreManager.incrementStreak(this.config.SCORE.MAX_STREAK);
                const pointsEarned = this.scoreManager.addEnemyScore(
                    this.config.SCORE.ENEMY_DESTROY,
                    this.config.SCORE.STREAK_MULTIPLIER
                );

                // Create floating text to show points earned
                const streakBonus = this.scoreManager.getStreak();
                let floatingTextColor = '#ffff00'; // Yellow for normal
                let displayText = `+${pointsEarned}`;

                if (streakBonus >= 5) {
                    floatingTextColor = '#ff8800'; // Orange for 5+ streak
                    displayText += ` x${streakBonus}!`;
                } else if (streakBonus >= 3) {
                    floatingTextColor = '#ffaa00'; // Light orange for 3+ streak
                }

                const floatingText = new FloatingText(explosionX, explosionY, displayText, floatingTextColor);
                this.floatingTexts.push(floatingText);

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
            // Track missed problem
            const problem = collision.enemy.getProblem();
            this.scoreManager.addMissedProblem(problem.text, problem.answer);

            // Create explosion
            const explosionX = collision.enemy.position.x + collision.enemy.width / 2;
            const explosionY = collision.enemy.position.y + collision.enemy.height / 2;
            const explosionParticles = createExplosion(explosionX, explosionY, '#ff0000', 20);
            this.particles.push(...explosionParticles);

            this.enemies.splice(collision.enemyIndex, 1);
            const damaged = this.player.takeDamage();

            if (damaged) {
                this.scoreManager.resetStreak();
                this.audioManager.errorSound();

                // Screen shake on damage
                this.screenShake.intensity = 8;

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

        // Apply screen shake
        this.ctx.save();
        this.ctx.translate(this.screenShake.x, this.screenShake.y);

        // Draw stars
        this.renderStars();

        if (this.stateManager.isState(this.config.STATES.PLAYING) ||
            this.stateManager.isState(this.config.STATES.PAUSED)) {
            // Render particles first (behind everything)
            for (const particle of this.particles) {
                particle.render(this.ctx);
            }

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

            // Render floating texts (on top)
            for (const text of this.floatingTexts) {
                text.render(this.ctx);
            }
        }

        // Restore canvas state (remove screen shake)
        this.ctx.restore();
    }

    renderStars() {
        for (const star of this.stars) {
            this.ctx.fillStyle = star.color;
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
