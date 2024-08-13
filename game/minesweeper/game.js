const Minesweeper = {
    difficulty: {
        easy: { rows: 9, cols: 9, mines: 10 },
        medium: { rows: 16, cols: 16, mines: 40 },
        hard: { rows: 16, cols: 30, mines: 99 }
    },
    
    grid: [],
    revealed: [],
    flagged: [],
    minePositions: [],
    gameOver: false,
    firstClick: true,
    timerInterval: null,
    time: 0,
    currentDifficulty: 'easy',
    
    init() {
        this.bindEvents();
        this.startGame();
    },
    
    bindEvents() {
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.startGame();
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.startGame();
        });
    },
    
    startGame() {
        this.stopTimer();
        this.time = 0;
        this.gameOver = false;
        this.firstClick = true;
        this.grid = [];
        this.revealed = [];
        this.flagged = [];
        this.minePositions = [];
        
        document.getElementById('timer').textContent = '000';
        document.getElementById('status-message').textContent = '';
        document.getElementById('status-message').className = '';
        
        const config = this.difficulty[this.currentDifficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.mines = config.mines;
        
        document.getElementById('mine-count').textContent = this.mines;
        
        this.createGrid();
        this.renderGrid();
    },
    
    createGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            this.revealed[r] = [];
            this.flagged[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = 0;
                this.revealed[r][c] = false;
                this.flagged[r][c] = false;
            }
        }
    },
    
    placeMines(excludeRow, excludeCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            
            if (this.grid[r][c] !== -1 && !this.isNearExcluded(r, c, excludeRow, excludeCol)) {
                this.grid[r][c] = -1;
                this.minePositions.push({ r, c });
                minesPlaced++;
            }
        }
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] !== -1) {
                    this.grid[r][c] = this.countNeighbors(r, c);
                }
            }
        }
    },
    
    isNearExcluded(r, c, excludeRow, excludeCol) {
        const dr = Math.abs(r - excludeRow);
        const dc = Math.abs(c - excludeCol);
        return dr <= 1 && dc <= 1;
    },
    
    countNeighbors(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    if (this.grid[nr][nc] === -1) count++;
                }
            }
        }
        return count;
    },
    
    renderGrid() {
        const gridEl = document.getElementById('grid');
        gridEl.innerHTML = '';
        gridEl.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                cell.addEventListener('click', (e) => {
                    if (e.button === 0) this.handleClick(r, c);
                });
                
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(r, c);
                });
                
                gridEl.appendChild(cell);
            }
        }
    },
    
    handleClick(row, col) {
        if (this.gameOver || this.flagged[row][col]) return;
        
        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(row, col);
            this.startTimer();
        }
        
        if (this.grid[row][col] === -1) {
            this.revealMines();
            this.gameOver = true;
            this.stopTimer();
            document.getElementById('status-message').textContent = '游戏结束！你踩到雷了！';
            document.getElementById('status-message').className = 'lose';
        } else {
            this.reveal(row, col);
            this.checkWin();
        }
    },
    
    handleRightClick(row, col) {
        if (this.gameOver || this.revealed[row][col]) return;
        
        this.flagged[row][col] = !this.flagged[row][col];
        
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.toggle('flagged');
        
        const flagCount = this.flagged.flat().filter(f => f).length;
        document.getElementById('mine-count').textContent = this.mines - flagCount;
    },
    
    reveal(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
        if (this.revealed[row][col] || this.flagged[row][col]) return;
        
        this.revealed[row][col] = true;
        
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('revealed');
        
        if (this.grid[row][col] > 0) {
            cell.textContent = this.grid[row][col];
            cell.dataset.num = this.grid[row][col];
        } else {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    this.reveal(row + dr, col + dc);
                }
            }
        }
    },
    
    revealMines() {
        this.minePositions.forEach(({ r, c }) => {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            cell.classList.add('revealed', 'mine');
        });
    },
    
    checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.revealed[r][c]) revealedCount++;
            }
        }
        
        if (revealedCount === this.rows * this.cols - this.mines) {
            this.gameOver = true;
            this.stopTimer();
            document.getElementById('status-message').textContent = '恭喜你！扫雷成功！';
            document.getElementById('status-message').className = 'win';
            
            const score = (this.rows * this.cols - this.mines) * 10 - this.time;
            ScoreBoard.showScoreBoard('minesweeper', Math.max(score, 10), () => {
                this.startGame();
            });
        }
    },
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.time++;
            document.getElementById('timer').textContent = String(this.time).padStart(3, '0');
        }, 1000);
    },
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Minesweeper.init();
});
