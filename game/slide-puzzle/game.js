const SlidePuzzle = {
    size: 4,
    tiles: [],
    emptyRow: 3,
    emptyCol: 3,
    moves: 0,
    time: 0,
    timerInterval: null,
    history: [],
    isRunning: false,
    solved: false,
    
    init() {
        this.puzzle = document.getElementById('puzzle');
        this.movesDisplay = document.getElementById('moves');
        this.timeDisplay = document.getElementById('time');
        this.message = document.getElementById('message');
        
        this.bindEvents();
        this.newGame();
    },
    
    bindEvents() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        
        document.getElementById('size-select').addEventListener('change', (e) => {
            this.size = parseInt(e.target.value);
            this.newGame();
        });
    },
    
    newGame() {
        this.stopTimer();
        this.moves = 0;
        this.time = 0;
        this.history = [];
        this.solved = false;
        this.isRunning = true;
        
        this.movesDisplay.textContent = '0';
        this.timeDisplay.textContent = '00:00';
        this.message.textContent = '';
        this.message.className = '';
        document.getElementById('undo-btn').disabled = true;
        
        this.createTiles();
        this.shuffle();
        this.render();
        this.startTimer();
    },
    
    createTiles() {
        this.tiles = [];
        let num = 1;
        for (let r = 0; r < this.size; r++) {
            this.tiles[r] = [];
            for (let c = 0; c < this.size; c++) {
                if (r === this.size - 1 && c === this.size - 1) {
                    this.tiles[r][c] = 0;
                    this.emptyRow = r;
                    this.emptyCol = c;
                } else {
                    this.tiles[r][c] = num++;
                }
            }
        }
    },
    
    shuffle() {
        for (let i = 0; i < 1000; i++) {
            const neighbors = this.getNeighbors(this.emptyRow, this.emptyCol);
            const random = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.swap(random.r, random.c, this.emptyRow, this.emptyCol, false);
        }
    },
    
    getNeighbors(row, col) {
        const neighbors = [];
        if (row > 0) neighbors.push({r: row - 1, c: col});
        if (row < this.size - 1) neighbors.push({r: row + 1, c: col});
        if (col > 0) neighbors.push({r: row, c: col - 1});
        if (col < this.size - 1) neighbors.push({r: row, c: col + 1});
        return neighbors;
    },
    
    swap(r1, c1, r2, c2, saveHistory = true) {
        if (saveHistory) {
            this.history.push({
                r1, c1, r2, c2,
                emptyRow: this.emptyRow,
                emptyCol: this.emptyCol
            });
        }
        
        [this.tiles[r1][c1], this.tiles[r2][c2]] = [this.tiles[r2][c2], this.tiles[r1][c1]];
        
        if (this.tiles[r1][c1] === 0) {
            this.emptyRow = r1;
            this.emptyCol = c1;
        } else if (this.tiles[r2][c2] === 0) {
            this.emptyRow = r2;
            this.emptyCol = c2;
        }
    },
    
    handleClick(row, col) {
        if (!this.isRunning || this.solved) return;
        
        const tile = this.tiles[row][col];
        if (tile === 0) return;
        
        const dr = Math.abs(row - this.emptyRow);
        const dc = Math.abs(col - this.emptyCol);
        
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            this.swap(row, col, this.emptyRow, this.emptyCol);
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            document.getElementById('undo-btn').disabled = false;
            
            this.render();
            this.checkWin();
        }
    },
    
    undo() {
        if (this.history.length === 0) return;
        
        const last = this.history.pop();
        this.swap(last.r1, last.c1, last.r2, last.c2, false);
        this.emptyRow = last.emptyRow;
        this.emptyCol = last.emptyCol;
        
        this.moves--;
        this.movesDisplay.textContent = this.moves;
        
        if (this.history.length === 0) {
            document.getElementById('undo-btn').disabled = true;
        }
        
        this.render();
    },
    
    render() {
        const tileSize = Math.min(80, (window.innerWidth - 60) / this.size);
        
        this.puzzle.style.gridTemplateColumns = `repeat(${this.size}, ${tileSize}px)`;
        this.puzzle.style.gridTemplateRows = `repeat(${this.size}, ${tileSize}px)`;
        
        this.puzzle.innerHTML = '';
        
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = document.createElement('div');
                const num = this.tiles[r][c];
                
                tile.className = 'tile' + (num === 0 ? ' empty' : '');
                tile.textContent = num === 0 ? '' : num;
                
                if (num !== 0 && num === r * this.size + c + 1) {
                    tile.classList.add('correct');
                }
                
                tile.addEventListener('click', () => this.handleClick(r, c));
                
                this.puzzle.appendChild(tile);
            }
        }
    },
    
    checkWin() {
        let num = 1;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (r === this.size - 1 && c === this.size - 1) {
                    if (this.tiles[r][c] !== 0) return;
                } else {
                    if (this.tiles[r][c] !== num++) return;
                }
            }
        }
        
        this.solved = true;
        this.stopTimer();
        this.isRunning = false;
        
        this.message.textContent = '🎉 恭喜完成！';
        this.message.className = 'win';
        
        const score = Math.max(1000 - this.moves * 5 - this.time, 10);
        ScoreBoard.showScoreBoard('slide-puzzle', score, () => {
            this.newGame();
        });
    },
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.time++;
            const mins = Math.floor(this.time / 60).toString().padStart(2, '0');
            const secs = (this.time % 60).toString().padStart(2, '0');
            this.timeDisplay.textContent = `${mins}:${secs}`;
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
    SlidePuzzle.init();
});
