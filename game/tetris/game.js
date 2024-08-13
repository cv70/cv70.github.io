// 俄罗斯方块游戏
class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.startBtn = document.getElementById('startBtn');
        
        this.gridWidth = 10;
        this.gridHeight = 20;
        this.blockSize = 30;
        
        this.board = this.createBoard();
        this.score = 0;
        this.gameInterval = null;
        this.isGameOver = false;
        this.isPaused = false;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.colors = [
            null,
            '#FF0D72', // T - 紫红
            '#0DC2FF', // O - 蓝
            '#0DFF72', // L - 绿
            '#F538FF', // J - 粉
            '#FF8E0D', // I - 橙
            '#FFE138', // S - 黄
            '#3877FF', // Z - 靛蓝
        ];
        
        this.init();
    }
    
    createBoard() {
        return Array.from({ length: this.gridHeight }, () => 
            Array(this.gridWidth).fill(0)
        );
    }
    
    init() {
        this.bindEvents();
        this.startBtn.addEventListener('click', () => this.startGame());
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver || !this.currentPiece || this.isPaused) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.move(-1);
                    break;
                case 'ArrowRight':
                    this.move(1);
                    break;
                case 'ArrowDown':
                    this.move(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
    }
    
    startGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        
        this.board = this.createBoard();
        this.score = 0;
        this.dropInterval = 1000;
        this.isGameOver = false;
        this.isPaused = false;
        this.updateScore(0);
        
        this.currentPiece = this.randomPiece();
        this.nextPiece = this.randomPiece();
        
        this.draw();
        this.drawNext();
        
        this.startBtn.textContent = '重新开始';
        
        this.gameInterval = setInterval(() => {
            if (!this.isPaused && !this.isGameOver) {
                this.drop();
            }
        }, 50);
    }
    
    togglePause() {
        if (this.isGameOver) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('已暂停', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    randomPiece() {
        const pieces = 'ILJOTSZ';
        const type = pieces[Math.floor(Math.random() * pieces.length)];
        return {
            type: type,
            matrix: this.getPieceMatrix(type),
            x: Math.floor(this.gridWidth / 2) - 1,
            y: 0,
        };
    }
    
    getPieceMatrix(type) {
        const matrices = {
            'I': [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
            'L': [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ],
            'J': [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ],
            'O': [
                [4, 4],
                [4, 4],
            ],
            'Z': [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ],
            'S': [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ],
            'T': [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ],
        };
        return matrices[type];
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制已固定的方块
        this.drawBoard();
        
        // 绘制当前方块
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }
    }
    
    drawBoard() {
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.drawBlock(this.ctx, x, y, this.colors[value]);
                }
            });
        });
    }
    
    drawPiece(piece) {
        piece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.drawBlock(this.ctx, piece.x + x, piece.y + y, this.colors[value]);
                }
            });
        });
    }
    
    drawBlock(ctx, x, y, color) {
        const size = this.blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x * size, y * size, size, size);
        
        // 绘制边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * size, y * size, size, size);
        
        // 绘制内部阴影效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x * size + 2, y * size + 2, size - 4, 4);
        ctx.fillRect(x * size + 2, y * size + 2, 4, size - 4);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x * size + size - 6, y * size + 2, 4, size - 4);
        ctx.fillRect(x * size + 2, y * size + size - 6, size - 4, 4);
    }
    
    drawNext() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            // 计算居中位置
            const offsetX = (this.nextCanvas.width / this.blockSize - this.nextPiece.matrix[0].length) / 2;
            const offsetY = (this.nextCanvas.height / this.blockSize - this.nextPiece.matrix.length) / 2;
            
            this.nextPiece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value > 0) {
                        this.drawBlock(this.nextCtx, x + offsetX, y + offsetY, this.colors[value]);
                    }
                });
            });
        }
    }
    
    move(dirX, dirY = 0) {
        this.currentPiece.x += dirX;
        this.currentPiece.y += dirY;
        
        if (this.collide()) {
            this.currentPiece.x -= dirX;
            this.currentPiece.y -= dirY;
            
            if (dirY > 0) {
                this.lockPiece();
            }
            return false;
        }
        
        this.draw();
        return true;
    }
    
    rotate() {
        const piece = this.currentPiece;
        const matrix = piece.matrix;
        const N = matrix.length;
        
        // 创建旋转后的矩阵
        const rotated = matrix.map((row, i) =>
            row.map((val, j) => matrix[N - 1 - j][i])
        );
        
        const originalMatrix = piece.matrix;
        piece.matrix = rotated;
        
        // 碰撞检测和踢墙
        if (this.collide()) {
            // 尝试向左踢墙
            piece.x -= 1;
            if (this.collide()) {
                // 尝试向右踢墙
                piece.x += 2;
                if (this.collide()) {
                    // 恢复原状
                    piece.x -= 1;
                    piece.matrix = originalMatrix;
                    return;
                }
            }
        }
        
        this.draw();
    }
    
    collide() {
        const piece = this.currentPiece;
        const matrix = piece.matrix;
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] > 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    // 检查边界
                    if (boardX < 0 || boardX >= this.gridWidth || boardY >= this.gridHeight) {
                        return true;
                    }
                    
                    // 检查是否与已固定的方块碰撞
                    if (boardY >= 0 && this.board[boardY][boardX] > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    lockPiece() {
        const piece = this.currentPiece;
        const matrix = piece.matrix;
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] > 0) {
                    const boardY = piece.y + y;
                    if (boardY < 0) {
                        this.gameOver();
                        return;
                    }
                    this.board[boardY][piece.x + x] = matrix[y][x];
                }
            }
        }
        
        this.checkLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.randomPiece();
        this.drawNext();
        
        if (this.collide()) {
            this.gameOver();
        }
    }
    
    checkLines() {
        let linesCleared = 0;
        
        for (let y = this.gridHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell > 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.gridWidth).fill(0));
                linesCleared++;
                y++; // 检查同一行（因为上面的行会下移）
            }
        }
        
        if (linesCleared > 0) {
            // 计算分数：1行100，2行300，3行500，4行800
            const scores = [0, 100, 300, 500, 800];
            this.updateScore(this.score + scores[linesCleared]);
            
            // 增加难度
            this.dropInterval = Math.max(100, 1000 - this.score / 5);
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => {
                if (!this.isPaused && !this.isGameOver) {
                    this.drop();
                }
            }, 50);
        }
    }
    
    updateScore(newScore) {
        this.score = newScore;
        this.scoreElement.textContent = this.score;
    }
    
    drop() {
        this.dropCounter++;
        if (this.dropCounter > this.dropInterval / 50) {
            this.dropCounter = 0;
            this.move(0, 1);
        }
    }
    
    hardDrop() {
        while (!this.collide()) {
            this.move(0, 1);
        }
        this.move(0, -1); // 恢复最后一步
        this.lockPiece();
    }
    
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameInterval);
        
        // 显示游戏结束弹窗
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="game-over-content">
                <h2>游戏结束</h2>
                <p>最终得分: ${this.score}</p>
                <button onclick="this.parentElement.parentElement.remove(); tetris.startGame()">重新开始</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// 启动游戏
let tetris;
document.addEventListener('DOMContentLoaded', () => {
    tetris = new Tetris();
});