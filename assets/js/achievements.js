const Achievements = {
    STORAGE_KEY: 'game_achievements',
    unlocked: [],
    
    achievements: {
        // Game completion achievements
        first_game: { id: 'first_game', name: '新 Player', description: '完成你的第一个游戏', game: 'any' },
        ten_games: { id: 'ten_games', name: 'Game Enthusiast', description: '完成 10 个游戏', game: 'any' },
        hundred_games: { id: 'hundred_games', name: 'Master Gamer', description: '完成 100 个游戏', game: 'any' },
        
        // Speed achievements
        fast_snake: { id: 'fast_snake', name: 'Speedy Snake', description: '贪吃蛇得分超过 100 分', game: 'snake' },
        fast_tetris: { id: 'fast_tetris', name: 'Block Master', description: '俄罗斯方块得分超过 500 分', game: 'tetris' },
        fast_minesweeper: { id: 'fast_minesweeper', name: 'Clearer', description: '扫雷时间少于 60 秒', game: 'minesweeper' },
        
        // Category achievements
        arcade_lover: { id: 'arcade_lover', name: 'Arcade Fan', description: '玩 5 个 Arcade 游戏', game: 'any' },
        puzzle_master: { id: 'puzzle_master', name: 'Puzzle Master', description: '完成 10 个益智游戏', game: 'any' },
        board_games: { id: 'board_games', name: 'Board Game', description: '完成 5 个棋盘游戏', game: 'any' },
        
        // Difficulty achievements
        difficulty: { id: 'difficulty', name: 'Difficulty', description: '完成 3 个不同难度', game: 'any' },
        
        // Specific game achievements
        minesweeper: { id: 'minesweeper', name: 'Minesweeper', description: '完成扫雷', game: 'minesweeper' },
        snake: { id: 'snake', name: 'Snake', description: '完成贪吃蛇', game: 'snake' },
        tetris: { id: 'snake', name: 'Tetris', description: '完成俄罗斯方块', game: 'tetris' },
        twenty forty eight: { id: 'twenty forty eight', name: 'Twenty Forty Eight', description: '完成 2048', game: '2048' },
        gopher: { id: 'gopher', name: 'Gopher', description: '完成打地鼠', game: 'gopher' },
        breakout: { id: 'breakout', name: 'Breakout', description: '完成打砖块', game: 'breakout' },
        tictactoe: { id: 'tictactoe', name: 'Tic Tac Toe', description: '完成井字棋', game: 'tictactoe' },
        slidepuzzle: { id: 'slidepuzzle', name: 'Slide Puzzle', description: '完成滑块拼图', game: 'slide-puzzle' },
        catchcoins: { id: 'catchcoins', name: 'Catch Coins', description: '完成接金币', game: 'catch-coins' },
        reactiontest: { id: 'reactiontest', name: 'Reaction Test', description: '完成反应测试', game: 'reaction-test' },
        memorymatch: { id: 'memorymatch', name: 'Memory Match', description: '完成记忆匹配', game: 'memory-match' },
        typing: { id: 'typing', name: 'Typing', description: '完成打字游戏', game: 'typing' },
        fivechess: { id: 'fivechess', name: 'Five Chess', description: '完成五子棋', game: 'five-chess' },
        plane: { id: 'plane', name: 'Plane', description: '完成飞机大战', game: 'plane' },
        canvas: { id: 'canvas', name: 'Canvas', description: '完成连线画布', game: 'canvas' },
        gophermole: { id: 'gophermole', name: 'Gopher Mole', description: '完成打地鼠', game: 'gopher-mole' },
        
        // Bonus achievements
        bonus: { id: 'bonus', name: 'Bonus', description: '完成额外成就', game: 'any' }
    },
    
    init() {
        this.loadAchievements();
    },
    
    loadAchievements() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            this.unlocked = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load achievements:', e);
            this.unlocked = [];
        }
    },
    
    saveAchievements() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.unlocked));
        } catch (e) {
            console.error('Failed to save achievements:', e);
        }
    },
    
    unlock(achievementId) {
        if (!this.unlocked.includes(achievementId)) {
            this.unlocked.push(achievementId);
            this.saveAchievements();
            
            const achievement = this.achievements[achievementId];
            this.showNotification(achievement);
            
            return true;
        }
        return false;
    },
    
    check(gameName, score) {
        if (gameName === 'snake') {
            if (score > 100) this.unlock('fast_snake');
            this.unlock('snake');
            if (this.unlocked.length % 10 === 0) this.unlock('ten_games');
            if (this.unlocked.length % 100 === 0) this.unlock('hundred_games');
        } else if (gameName === 'minesweeper') {
            if (score > 500) this.unlock('fast_minesweeper');
            this.unlock('minesweeper');
            this.unlock('minesweeper');
            if (this.unlocked.length % 10 === 0) this.unlock('ten_games');
            if (this.unlocked.length % 100 === 0) this.unlock('hundred_games');
        }
    },
    
    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content'>
                <h3 class="achievement-name">${achievement.name}</h3>
                <p class="achievement-desc">${achievement.description}</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Achievements.init();
});
