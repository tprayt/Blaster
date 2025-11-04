// Input Manager - Handles keyboard input
export class InputManager {
    constructor() {
        this.keys = {};
        this.answerBuffer = '';
        this.listeners = {
            shoot: [],
            pause: []
        };

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;

        // Handle number input for answers
        if (e.key >= '0' && e.key <= '9') {
            this.answerBuffer += e.key;
            this.updateAnswerDisplay();
        }

        // Handle negative sign
        if (e.key === '-' && this.answerBuffer.length === 0) {
            this.answerBuffer = '-';
            this.updateAnswerDisplay();
        }

        // Handle backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.answerBuffer = this.answerBuffer.slice(0, -1);
            this.updateAnswerDisplay();
        }

        // Handle enter (shoot)
        if (e.key === 'Enter') {
            e.preventDefault();
            this.triggerShoot();
        }

        // Handle pause (p or escape)
        if (e.key === 'p' || e.key === 'Escape') {
            e.preventDefault();
            this.triggerPause();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    // Check if a key is currently pressed
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    // Get current answer buffer
    getAnswer() {
        return this.answerBuffer;
    }

    // Clear answer buffer
    clearAnswer() {
        this.answerBuffer = '';
        this.updateAnswerDisplay();
    }

    // Update answer display in UI
    updateAnswerDisplay() {
        const answerText = document.getElementById('answer-text');
        if (answerText) {
            answerText.textContent = this.answerBuffer || '';
        }
    }

    // Register shoot event listener
    onShoot(callback) {
        this.listeners.shoot.push(callback);
    }

    // Register pause event listener
    onPause(callback) {
        this.listeners.pause.push(callback);
    }

    // Trigger shoot event
    triggerShoot() {
        this.listeners.shoot.forEach(callback => callback());
    }

    // Trigger pause event
    triggerPause() {
        this.listeners.pause.forEach(callback => callback());
    }

    // Get movement direction based on arrow keys or WASD
    getMovementDirection() {
        let x = 0;
        let y = 0;

        if (this.isKeyPressed('arrowleft') || this.isKeyPressed('a')) {
            x = -1;
        }
        if (this.isKeyPressed('arrowright') || this.isKeyPressed('d')) {
            x = 1;
        }
        if (this.isKeyPressed('arrowup') || this.isKeyPressed('w')) {
            y = -1;
        }
        if (this.isKeyPressed('arrowdown') || this.isKeyPressed('s')) {
            y = 1;
        }

        return { x, y };
    }

    // Reset input state
    reset() {
        this.keys = {};
        this.answerBuffer = '';
        this.updateAnswerDisplay();
    }
}
