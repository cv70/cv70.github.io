class Game2048 {
    constructor() {
        this.gridSize = 4;
        this.grid = [];
        this.score = 0;
        this.best = parseInt(localStorage.getItem('best2048')) || 0;
        this.gameOver = false;
        this.won = false;
        this.gridContainer = document.getElementById('grid-container');
        this.scoreElement = document.getElementById('score');
        this.bestElement = document.getElementById('best');
        this.messageElement = document.getElementById('game-message');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.init();
    }
    
    init() {
        this.createGridBackground();
        this.bindEvents();
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.startNewGame();
    }
    
    createGridBackground() {
        const gridBg = document.createElement('div');
        gridBg.className = 'grid-background';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            gridBg.appendChild(cell);
        }
        this.gridContainer.appendChild(gridBg);
        this.tileContainer = document.createElement('div');
        this.tileContainer.className = 'tile-container';
        this.gridContainer.appendChild(this.tileContainer);
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            let moved = false;
            switch(e.key) {
                case 'ArrowUp': moved = this.moveUp(); break;
                case 'ArrowDown': moved = this.moveDown(); break;
                case 'ArrowLeft': moved = this.moveLeft(); break;
                case 'ArrowRight': moved = this.moveRight(); break;
                default: return;
            }
            if (moved) { e.preventDefault(); this.afterMove(); }
        });
        
        let touchStartX = 0, touchStartY = 0;
        this.gridContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });
        
        this.gridContainer.addEventListener('touchend', (e) => {
            if (this.gameOver) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            let moved = false;
            const threshold = 30;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > threshold) moved = dx > 0 ? this.moveRight() : this.moveLeft();
            } else {
                if (Math.abs(dy) > threshold) moved = dy > 0 ? this.moveDown() : this.moveUp();
            }
            if (moved) { e.preventDefault(); this.afterMove(); }
        }, { passive: false });
    }
    
    startNewGame() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0; this.gameOver = false; this.won = false;
        this.updateScore(); this.clearMessage(); this.tileContainer.innerHTML = '';
        this.addRandomTile(); this.addRandomTile(); this.render();
    }
    
    addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === 0) emptyCells.push({ row, col });
            }
        }
        if (emptyCells.length === 0) return;
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
    
    render() {
        this.tileContainer.innerHTML = '';
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const value = this.grid[row][col];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = 'tile tile-' + (value > 2048 ? 'super' : value);
                    tile.textContent = value;
                    const gap = 10;
                    const tileSize = window.innerWidth <= 520 ? 60 : 87.5;
                    const left = col * (tileSize + gap) + gap;
                    const top = row * (tileSize + gap) + gap;
                    tile.style.left = left + 'px';
                    tile.style.top = top + 'px';
                    this.tileContainer.appendChild(tile);
                }
            }
        }
    }
    
    moveLeft() {
        let moved = false;
        for (let row = 0; row < this.gridSize; row++) {
            const newRow = this.grid[row].filter(v => v !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    if (newRow[i] === 2048 && !this.won) { this.won = true; this.showMessage('恭喜你达到 2048！继续挑战吧！'); }
                    newRow.splice(i + 1, 1);
                }
            }
            while (newRow.length < this.gridSize) newRow.push(0);
            if (JSON.stringify(this.grid[row]) !== JSON.stringify(newRow)) moved = true;
            this.grid[row] = newRow;
        }
        return moved;
    }
    
    moveRight() {
        let moved = false;
        for (let row = 0; row < this.gridSize; row++) {
            const newRow = this.grid[row].filter(v => v !== 0);
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    if (newRow[i] === 2048 && !this.won) { this.won = true; this.showMessage('恭喜你达到 2048！继续挑战吧！'); }
                    newRow.splice(i - 1, 1); i--;
                }
            }
            while (newRow.length < this.gridSize) newRow.unshift(0);
            if (JSON.stringify(this.grid[row]) !== JSON.stringify(newRow)) moved = true;
            this.grid[row] = newRow;
        }
        return moved;
    }
    
    moveUp() { return this.moveVertical((c, r) => this.grid[r][c], (c, r, v) => { this.grid[r][c] = v; }, -1); }
    moveDown() { return this.moveVertical((c, r) => this.grid[r][c], (c, r, v) => { this.grid[r][c] = v; }, 1); }
    
    moveVertical(getCell, setCell, direction) {
        for (let col = 0; col < this.gridSize; col++) {
            const values = [];
            for (let row = 0; row < this.gridSize; row++) values.push(getCell(col, row));
            const filtered = values.filter(v => v !== 0);
            const start = direction === -1 ? 0 : filtered.length - 1;
            const step = direction === -1 ? 1 : -1;
            for (let i = start; direction === -1 ? i < filtered.length - 1 : i > 0; i += step) {
                if (filtered[i] === filtered[i + step]) {
                    filtered[i] *= 2;
                    this.score += filtered[i];
                    if (filtered[i] === 2048 && !this.won) { this.won = true; this.showMessage('恭喜你达到 2048！继续挑战吧！'); }
                    filtered.splice(i + step, 1);
                    if (direction === 1) i -= 2;
                }
            }
            const result = Array(this.gridSize).fill(0);
            if (direction === -1) {
                for (let i = 0; i < filtered.length; i++) result[i] = filtered[i];
            } else {
                for (let i = 0; i < filtered.length; i++) result[this.gridSize - 1 - i] = filtered[filtered.length - 1 - i];
            }
            for (let row = 0; row < this.gridSize; row++) setCell(col, row, result[row]);
        }
        this.updateScore();
        return true;
    }
    
    afterMove() {
        this.updateScore(); this.addRandomTile(); this.render();
        if (this.checkGameOver()) { this.gameOver = true; this.showMessage('游戏结束！点击新游戏重新开始'); }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.best) { this.best = this.score; localStorage.setItem('best2048', this.best); }
        this.bestElement.textContent = this.best;
    }
    
    checkGameOver() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === 0) return false;
            }
        }
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const current = this.grid[row][col];
                if (col < this.gridSize - 1 && current === this.grid[row][col + 1]) return false;
                if (row < this.gridSize - 1 && current === this.grid[row + 1][col]) return false;
            }
        }
        return true;
    }
    
    showMessage(msg) { this.messageElement.textContent = msg; }
    clearMessage() { this.messageElement.textContent = ''; }
}

let game2048;
document.addEventListener('DOMContentLoaded', () => { game2048 = new Game2048(); });
