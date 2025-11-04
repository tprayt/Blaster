// State Manager - Manages game states
export class StateManager {
    constructor(initialState) {
        this.currentState = initialState;
        this.previousState = null;
        this.stateChangeCallbacks = [];
    }

    // Change to a new state
    setState(newState) {
        if (newState !== this.currentState) {
            this.previousState = this.currentState;
            this.currentState = newState;
            this.triggerStateChange(newState, this.previousState);
        }
    }

    // Get current state
    getState() {
        return this.currentState;
    }

    // Get previous state
    getPreviousState() {
        return this.previousState;
    }

    // Check if in a specific state
    isState(state) {
        return this.currentState === state;
    }

    // Register state change callback
    onStateChange(callback) {
        this.stateChangeCallbacks.push(callback);
    }

    // Trigger state change callbacks
    triggerStateChange(newState, oldState) {
        this.stateChangeCallbacks.forEach(callback => {
            callback(newState, oldState);
        });
    }
}
