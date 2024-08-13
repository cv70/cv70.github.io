const Breakout = {
    canvas: null,
    ctx: null,
    animationId: null,
    isRunning: false,
    isPaused: false,
    
    paddle: { x: 0, y: 0, width: 100, height: 15, speed: 8 },
    ball: { x: 0, y: 0, radius: 8, dx: 4, dy: -4, speed: 5 },
    bricks: [],
    
    score: 0,
    level: 1,
    lives: 3,
    
    keys: { left: false, right: false },
    
    brickColors: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'],
    
    levels: [
        { rows: 3, cols: 8 },
        { rows: 4, cols: 8 },
        { rows: 5, cols: 10 },
        { rows: 6, cols: 10 }
    ],
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resetPaddle();
        this.resetBall();
        this.bindEvents();
        this.createBricks();
        this.draw();
    },
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
        });
        
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            
            if (x < this.canvas.width / 2) {
                this.keys.left = true;
                this.keys.right = false;
            } else {
                this.keys.left = false;
                this.keys.right = true;
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.left = false;
            this.keys.right = false;
        });
    },
    
    resetPaddle() {
        this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        this.paddle.y = this.canvas.height - 30;
    },
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.dx = this.ball.speed * (Math.random() > 0.5 ? 1 : -1);
        this.ball.dy = -this.ball.speed;
    },
    
    createBricks() {
        const levelConfig = this.levels[Math.min(this.level - 1, this.levels.length - 1)];
        const padding = 10;
        const offsetTop = 30;
        const offsetLeft = 35;
        
        const brickWidth = (this.canvas.width - offsetLeft * 2 - padding * (levelConfig.cols - 1)) / levelConfig.cols;
        const brickHeight = 20;
        
        this.bricks = [];
        for (let r = 0; r < levelConfig.rows; r++) {
            for (let c = 0; c < levelConfig.cols; c++) {
                this.bricks.push({
                    x: offsetLeft + c * (brickWidth + padding),
                    y: offsetTop + r * (brickHeight + padding),
                    width: brickWidth,
                    height: brickHeight,
                    status: 1,
                    color: this.brickColors[r % this.brickColors.length]
                });
            }
        }
    },
    
    startGame() {
        if (this.isRunning) return;
        
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        
        this.resetPaddle();
        this.resetBall();
        this.createBricks();
        
        this.updateUI();
        
        this.isRunning = true;
        this.isPaused = false;
        document.getElementById('start-btn').textContent = '重新开始';
        
        this.gameLoop();
    },
    
    togglePause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        
        const overlay = document.getElementById('pause-overlay');
        if (!overlay) {
            this.createPauseOverlay();
        }
        
        if (this.isPaused) {
            document.getElementById('pause-overlay').classList.add('show');
        } else {
            document.getElementById('pause-overlay').classList.remove('show');
            this.gameLoop();
        }
    },
    
    createPauseOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pause-overlay';
        overlay.innerHTML = `
            <div class="pause-content">
                <h2>游戏暂停</h2>
                <button id="resume-btn">继续游戏</button>
                <button id="restart-pause-btn">重新开始</button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-pause-btn').addEventListener('click', () => {
            overlay.classList.remove('show');
            this.startGame();
        });
    },
    
    gameLoop() {
        if (!this.isRunning || this.isPaused) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },
    
    update() {
        if (this.keys.left && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys.right && this.paddle.x + this.paddle.width < this.canvas.width) {
            this.paddle.x += this.paddle.speed;
        }
        
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy = -this.ball.dy;
        }
        
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.y - this.ball.radius < this.paddle.y + this.paddle.height &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width) {
            
            this.ball.dy = -Math.abs(this.ball.dy);
            
            const hitPoint = (this.ball.x - this.paddle.x) / this.paddle.width;
            this.ball.dx = (hitPoint - 0.5) * 8;
        }
        
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.lives--;
            this.updateUI();
            
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.resetBall();
                this.resetPaddle();
            }
        }
        
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];
            if (brick.status === 1) {
                if (this.ball.x > brick.x && 
                    this.ball.x < brick.x + brick.width &&
                    this.ball.y > brick.y && 
                    this.ball.y < brick.y + brick.height) {
                    
                    this.ball.dy = -this.ball.dy;
                    brick.status = 0;
                    this.score += 10;
                    this.updateUI();
                    
                    if (this.score % 100 === 0) {
                        this.ball.speed = Math.min(this.ball.speed + 0.5, 10);
                    }
                }
            }
        }
        
        const activeBricks = this.bricks.filter(b => b.status === 1);
        if (activeBricks.length === 0) {
            this.levelUp();
        }
    },
    
    levelUp() {
        this.level++;
        this.updateUI();
        
        this.ball.speed = Math.min(this.ball.speed + 0.5, 10);
        
        this.resetBall();
        this.resetPaddle();
        this.createBricks();
    },
    
    gameOver() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        
        ScoreBoard.showScoreBoard('breakout', this.score, () => {
            this.startGame();
        });
    },
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#34495e';
        this.bricks.forEach(brick => {
            if (brick.status === 1) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        this.ctx.closePath();
    },
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = this.lives;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Breakout.init();
});
