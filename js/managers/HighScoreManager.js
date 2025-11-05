// High Score Manager
export class HighScoreManager {
    constructor(maxScores = 10) {
        this.maxScores = maxScores;
        this.storageKey = 'mathBlasterHighScores';
        this.highScores = this.loadHighScores();
    }

    loadHighScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading high scores:', error);
        }
        return [];
    }

    saveHighScores() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.highScores));
            return true;
        } catch (error) {
            console.error('Error saving high scores:', error);
            return false;
        }
    }

    isHighScore(score) {
        // If we have less than max scores, any score qualifies
        if (this.highScores.length < this.maxScores) {
            return true;
        }

        // Check if score is higher than the lowest high score
        const lowestHighScore = this.highScores[this.highScores.length - 1].score;
        return score > lowestHighScore;
    }

    addScore(name, score, accuracy) {
        // Create score entry
        const scoreEntry = {
            name: name.trim() || 'Anonymous',
            score: score,
            accuracy: accuracy,
            date: new Date().toISOString()
        };

        // Add to high scores
        this.highScores.push(scoreEntry);

        // Sort by score (descending)
        this.highScores.sort((a, b) => b.score - a.score);

        // Keep only top N scores
        this.highScores = this.highScores.slice(0, this.maxScores);

        // Save to localStorage
        return this.saveHighScores();
    }

    getHighScores(count = null) {
        const limit = count || this.maxScores;
        return this.highScores.slice(0, limit);
    }

    getRank(score) {
        // Find what rank this score would be
        for (let i = 0; i < this.highScores.length; i++) {
            if (score > this.highScores[i].score) {
                return i + 1;
            }
        }

        // If we haven't filled all slots yet
        if (this.highScores.length < this.maxScores) {
            return this.highScores.length + 1;
        }

        return null; // Not a high score
    }

    clearHighScores() {
        this.highScores = [];
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing high scores:', error);
            return false;
        }
    }

    displayHighScores(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.highScores.length === 0) {
            container.innerHTML = '<p style="color: #888;">No high scores yet. Be the first!</p>';
            return;
        }

        let html = '<h3>HIGH SCORES</h3><ol>';
        this.highScores.forEach((entry) => {
            html += `
                <li>
                    <span class="highscore-name">${this.escapeHtml(entry.name)}</span>
                    <span class="highscore-score">${entry.score.toLocaleString()}</span>
                </li>
            `;
        });
        html += '</ol>';

        container.innerHTML = html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
