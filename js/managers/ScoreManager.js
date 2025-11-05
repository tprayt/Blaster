// Score Manager - Handles score and statistics
export class ScoreManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.totalAnswered = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.enemiesDestroyed = 0;
        this.missedProblems = []; // Track problems that were missed
    }

    // Add score for destroying an enemy
    addEnemyScore(baseScore, streakMultiplier) {
        const streakBonus = this.streak * streakMultiplier;
        const totalScore = baseScore + streakBonus;
        this.score += totalScore;
        this.enemiesDestroyed++;
        return totalScore;
    }

    // Increment streak on correct answer
    incrementStreak(maxStreak) {
        this.streak++;
        this.correctAnswers++;
        this.totalAnswered++;

        if (this.streak > this.maxStreak) {
            this.maxStreak = this.streak;
        }

        // Cap streak at max
        if (this.streak > maxStreak) {
            this.streak = maxStreak;
        }
    }

    // Reset streak on wrong answer
    resetStreak() {
        this.streak = 0;
        this.wrongAnswers++;
        this.totalAnswered++;
    }

    // Add a missed problem
    addMissedProblem(problemText, correctAnswer) {
        this.missedProblems.push({
            problem: problemText,
            answer: correctAnswer
        });
    }

    // Get missed problems
    getMissedProblems() {
        return this.missedProblems;
    }

    // Get current score
    getScore() {
        return this.score;
    }

    // Get current streak
    getStreak() {
        return this.streak;
    }

    // Get accuracy percentage
    getAccuracy() {
        if (this.totalAnswered === 0) {
            return 0;
        }
        return Math.round((this.correctAnswers / this.totalAnswered) * 100);
    }

    // Get statistics object
    getStats() {
        return {
            score: this.score,
            streak: this.streak,
            maxStreak: this.maxStreak,
            totalAnswered: this.totalAnswered,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            accuracy: this.getAccuracy(),
            enemiesDestroyed: this.enemiesDestroyed,
            missedProblems: this.missedProblems
        };
    }

    // Update UI display
    updateDisplay() {
        const scoreElement = document.getElementById('score');
        const streakElement = document.getElementById('streak');

        if (scoreElement) {
            scoreElement.textContent = this.score;
        }

        if (streakElement) {
            streakElement.textContent = this.streak;
        }
    }
}
