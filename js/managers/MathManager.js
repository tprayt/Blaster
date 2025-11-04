// Math Manager - Generates math problems based on difficulty
import { randomInt, randomChoice } from '../utils/helpers.js';

export class MathManager {
    constructor(difficulty = 'EASY') {
        this.difficulty = difficulty;
        this.currentProblem = null;
    }

    // Set difficulty level
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    // Generate a new math problem
    generateProblem(config) {
        const difficultyConfig = config.DIFFICULTY[this.difficulty];
        const operation = randomChoice(difficultyConfig.operations);

        let num1, num2, answer, problemText;

        switch (operation) {
            case 'addition':
                num1 = randomInt(1, difficultyConfig.maxNumber);
                num2 = randomInt(1, difficultyConfig.maxNumber);
                answer = num1 + num2;
                problemText = `${num1} + ${num2}`;
                break;

            case 'subtraction':
                num1 = randomInt(1, difficultyConfig.maxNumber);
                num2 = randomInt(1, num1); // Ensure positive result
                answer = num1 - num2;
                problemText = `${num1} - ${num2}`;
                break;

            case 'multiplication':
                num1 = randomInt(1, 12);
                num2 = randomInt(1, 12);
                answer = num1 * num2;
                problemText = `${num1} × ${num2}`;
                break;

            case 'division':
                // Generate division that results in whole number
                num2 = randomInt(1, 12);
                answer = randomInt(1, 12);
                num1 = num2 * answer;
                problemText = `${num1} ÷ ${num2}`;
                break;

            default:
                num1 = randomInt(1, 10);
                num2 = randomInt(1, 10);
                answer = num1 + num2;
                problemText = `${num1} + ${num2}`;
        }

        this.currentProblem = {
            text: problemText,
            answer: answer,
            operation: operation
        };

        return this.currentProblem;
    }

    // Check if provided answer is correct
    checkAnswer(userAnswer) {
        if (!this.currentProblem) {
            return false;
        }

        const numericAnswer = parseInt(userAnswer, 10);
        return numericAnswer === this.currentProblem.answer;
    }

    // Get current problem
    getCurrentProblem() {
        return this.currentProblem;
    }

    // Clear current problem
    clearProblem() {
        this.currentProblem = null;
    }
}
