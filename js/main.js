// Main entry point
import { Game } from './game.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Create and start the game
    const game = new Game(canvas);
    game.start();

    console.log('Math Blaster initialized!');
    console.log('Controls:');
    console.log('- Arrow Keys or A/D: Move');
    console.log('- Type numbers: Enter answer');
    console.log('- Enter: Shoot');
    console.log('- P or Escape: Pause');
});
