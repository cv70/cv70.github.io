const ScoreBoard = {
    STORAGE_KEY: 'game_scores',
    
    getScores(gameName) {
        const allScores = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        return allScores[gameName] || [];
    },
    
    saveScore(gameName, score) {
        const allScores = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        if (!allScores[gameName]) {
            allScores[gameName] = [];
        }
        
        const date = new Date().toLocaleString('zh-CN');
        allScores[gameName].push({ score, date });
        
        allScores[gameName].sort((a, b) => b.score - a.score);
        allScores[gameName] = allScores[gameName].slice(0, 10);
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allScores));
        
        const rank = allScores[gameName].findIndex(s => s.score === score && s.date === date) + 1;
        return rank;
    },
    
    getTopScore(gameName) {
        const scores = this.getScores(gameName);
        return scores.length > 0 ? scores[0].score : 0;
    },
    
    showScoreBoard(gameName, currentScore, onRestart) {
        const scores = this.getScores(gameName);
        const topScore = this.getTopScore(gameName);
        const isNewRecord = currentScore >= topScore && currentScore > 0;
        
        let rank = 0;
        if (currentScore > 0) {
            rank = this.saveScore(gameName, currentScore);
        }
        
        const modal = document.createElement('div');
        modal.id = 'scoreboard-modal';
        modal.innerHTML = `
            <div class="scoreboard-content">
                <h2>${isNewRecord ? '🎉 新纪录！' : '游戏结束'}</h2>
                <div class="current-score">本次得分: <strong>${currentScore}</strong></div>
                ${rank > 0 ? `<div class="rank">排名: 第 <strong>${rank}</strong> 名</div>` : ''}
                <div class="top-score">最高分: <strong>${topScore}</strong></div>
                
                <div class="score-list">
                    <h3>排行榜 Top 10</h3>
                    <ol>
                        ${scores.slice(0, 10).map((s, i) => `
                            <li ${s.score === currentScore && s.date === new Date().toLocaleString('zh-CN') ? 'class="current"' : ''}>
                                <span class="score-value">${s.score}</span>
                                <span class="score-date">${s.date}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
                
                <button id="score-restart-btn">再来一局</button>
                <button id="score-close-btn">关闭</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('score-restart-btn').onclick = () => {
            modal.remove();
            if (onRestart) onRestart();
        };
        
        document.getElementById('score-close-btn').onclick = () => {
            modal.remove();
        };
    }
};

window.ScoreBoard = ScoreBoard;
