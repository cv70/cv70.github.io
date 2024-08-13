const TicTacToe = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true,
    mode: 'pvp',
    scores: { X: 0, O: 0 },
    
    winPatterns: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ],
    
    init() {
        this.cells = document.querySelectorAll('.cell');
        this.status = document.getElementById('status');
        
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleClick(cell));
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('game-mode').addEventListener('change', (e) => {
            this.mode = e.target.value;
            this.restart();
        });
    },
    
    handleClick(cell) {
        const index = parseInt(cell.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive) return;
        
        this.makeMove(index);
        
        if (this.gameActive && this.mode === 'ai' && this.currentPlayer === 'O') {
            setTimeout(() => this.aiMove(), 500);
        }
    },
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase(), 'taken');
        
        if (this.checkWin()) {
            this.gameActive = false;
            this.status.textContent = `玩家 ${this.currentPlayer} 获胜！`;
            this.scores[this.currentPlayer]++;
            this.updateScore();
            
            const winnerPattern = this.getWinnerPattern();
            winnerPattern.forEach(i => {
                this.cells[i].classList.add('winner');
            });
            
            ScoreBoard.showScoreBoard('tictactoe', this.scores[this.currentPlayer] * 10, () => {
                this.restart();
            });
            return;
        }
        
        if (this.checkDraw()) {
            this.gameActive = false;
            this.status.textContent = '平局！';
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.status.textContent = this.mode === 'ai' 
            ? (this.currentPlayer === 'X' ? '你的回合' : 'AI 思考中...')
            : `玩家 ${this.currentPlayer} 的回合`;
    },
    
    checkWin() {
        return this.winPatterns.some(pattern => {
            return pattern.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    },
    
    getWinnerPattern() {
        for (const pattern of this.winPatterns) {
            if (pattern.every(index => this.board[index] === this.currentPlayer)) {
                return pattern;
            }
        }
        return [];
    },
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    },
    
    aiMove() {
        let move;
        
        move = this.findBestMove();
        
        if (move !== -1) {
            this.makeMove(move);
        }
    },
    
    findBestMove() {
        for (const pattern of this.winPatterns) {
            const [a, b, c] = pattern;
            const values = [this.board[a], this.board[b], this.board[c]];
            const oCount = values.filter(v => v === 'O').length;
            const emptyCount = values.filter(v => v === '').length;
            
            if (oCount === 2 && emptyCount === 1) {
                if (this.board[a] === '') return a;
                if (this.board[b] === '') return b;
                if (this.board[c] === '') return c;
            }
        }
        
        for (const pattern of this.winPatterns) {
            const [a, b, c] = pattern;
            const values = [this.board[a], this.board[b], this.board[c]];
            const xCount = values.filter(v => v === 'X').length;
            const emptyCount = values.filter(v => v === '').length;
            
            if (xCount === 2 && emptyCount === 1) {
                if (this.board[a] === '') return a;
                if (this.board[b] === '') return b;
                if (this.board[c] === '') return c;
            }
        }
        
        if (this.board[4] === '') return 4;
        
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        const available = this.board.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
        return available[Math.floor(Math.random() * available.length)];
    },
    
    updateScore() {
        document.getElementById('score-x').textContent = this.scores.X;
        document.getElementById('score-o').textContent = this.scores.O;
    },
    
    restart() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.status.textContent = this.mode === 'ai' ? '你的回合' : '玩家 X 的回合';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    TicTacToe.init();
});
