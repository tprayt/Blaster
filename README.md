# Math Blaster - Browser Edition

A modern, browser-based reimagining of the classic Math Blaster educational game. Solve math problems to destroy enemies and progress through increasingly challenging levels!

## Features

- **Space-themed shooter gameplay** - Control a spaceship and blast enemies with correct answers
- **Multiple difficulty levels** - Easy, Medium, and Hard with different math operations
- **Educational** - Practice addition, subtraction, multiplication, and division
- **Power-ups** - Collect shields, rapid fire, double points, and extra lives
- **Score tracking** - Build streaks for bonus points
- **Responsive design** - Works on desktop, tablet, and mobile devices
- **Pure vanilla JavaScript** - No frameworks required

## How to Play

### Controls

- **Arrow Keys** or **A/D** - Move your spaceship left and right
- **Number Keys** - Type your answer to the math problem
- **Enter** - Shoot your answer
- **Backspace** - Delete last digit
- **P** or **Escape** - Pause the game

### Gameplay

1. Enemies will descend from the top of the screen, each displaying a math problem
2. Type the correct answer to the problem shown
3. Press Enter to shoot your answer
4. If your answer is correct, the enemy is destroyed and you earn points
5. Build up a streak of correct answers for bonus points
6. Avoid letting enemies reach the bottom or collide with your ship
7. Collect power-ups for special abilities

### Difficulty Levels

- **Easy**: Addition and subtraction with numbers 0-20
- **Medium**: Addition, subtraction, and multiplication with numbers 0-50
- **Hard**: All operations including division with numbers 0-100

### Power-ups

- **🛡 Shield** - Temporary invincibility
- **⚡ Rapid Fire** - Faster shooting
- **2x Double Points** - Earn twice the points
- **❤ Extra Life** - Gain an additional life

## Installation

Simply open `index.html` in a modern web browser. No build process or dependencies required!

For local development with a web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with npx)
npx http-server

# Then open http://localhost:8000 in your browser
```

## Project Structure

```
math-blaster/
├── index.html              # Main HTML entry point
├── css/
│   └── styles.css          # All game styling
├── js/
│   ├── main.js             # Game initialization
│   ├── game.js             # Main game class and loop
│   ├── config.js           # Game configuration constants
│   ├── entities/           # Game entities
│   │   ├── Entity.js       # Base entity class
│   │   ├── Player.js       # Player spaceship
│   │   ├── Enemy.js        # Enemy with math problem
│   │   ├── Projectile.js   # Player's shot
│   │   └── Powerup.js      # Power-up items
│   ├── managers/           # Game systems
│   │   ├── InputManager.js     # Keyboard input handling
│   │   ├── MathManager.js      # Math problem generation
│   │   ├── CollisionManager.js # Collision detection
│   │   ├── ScoreManager.js     # Score and statistics
│   │   ├── StateManager.js     # Game state management
│   │   └── AudioManager.js     # Sound effects (placeholder)
│   └── utils/              # Utility functions
│       ├── Vector2D.js     # 2D vector math
│       └── helpers.js      # Helper functions
└── assets/                 # Game assets (currently empty)
    ├── images/
    ├── audio/
    └── fonts/
```

## Game Architecture

### Entity System
All game objects (Player, Enemy, Projectile, Powerup) inherit from a base `Entity` class that provides:
- Position and velocity
- Update and render methods
- Boundary checking
- Lifecycle management

### Manager Pattern
Game systems are organized into managers:
- **InputManager** - Handles keyboard input and answer typing
- **MathManager** - Generates math problems based on difficulty
- **CollisionManager** - Detects and handles entity collisions
- **ScoreManager** - Tracks score, streaks, and statistics
- **StateManager** - Manages game states (Menu, Playing, Paused, Game Over)
- **AudioManager** - Placeholder for sound effects

### Game Loop
The main game loop runs at 60 FPS using `requestAnimationFrame`:
1. Update all entities
2. Check for collisions
3. Spawn new enemies
4. Render everything to canvas
5. Repeat

## Future Enhancements

Potential features for future versions:

- [ ] Boss battles with multi-step problems
- [ ] Level progression system
- [ ] Actual sound effects and music
- [ ] Touch controls for mobile
- [ ] Local high score leaderboard
- [ ] Different enemy types and movement patterns
- [ ] Story mode with missions
- [ ] Achievement system
- [ ] Particle effects and visual polish
- [ ] Adaptive difficulty based on performance
- [ ] Multiple player ships to unlock

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES6+ module support.

## License

MIT License - Feel free to use and modify for educational purposes.

## Credits

Inspired by the classic Math Blaster educational game series.
Built with vanilla JavaScript and HTML5 Canvas.
