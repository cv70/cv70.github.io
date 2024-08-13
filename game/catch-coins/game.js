const CatchCoins = {
    canvas: null, ctx: null, animationId: null,
    isRunning: false, score: 0, lives: 3, speed: 3, spawnRate: 60, frameCount: 0,
    player: { x: 175, y: 450, width: 50, height: 30 },
    items: [], keys: { left: false, right: false },
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bindEvents();
    },
    
    bindEvents() {
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = true;
        });
        document.addEventListener('keyup', e => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = false;
        });
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    },
    
    startGame() {
        if (this.isRunning) return;
        this.score = 0; this.lives = 3; this.speed = 3; this.spawnRate = 60;
        this.items = []; this.player.x = 175;
        this.updateUI();
        this.isRunning = true;
        document.getElementById('start-btn').textContent = '重新开始';
        this.gameLoop();
    },
    
    gameLoop() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },
    
    update() {
        this.frameCount++;
        if (this.keys.left && this.player.x > 0) this.player.x -= this.speed;
        if (this.keys.right && this.player.x < this.canvas.width - this.player.width) this.player.x += this.speed;
        
        if (this.frameCount % this.spawnRate === 0) {
            const isBomb = Math.random() > 0.8;
            this.items.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                type: isBomb ? 'bomb' : 'coin',
                size: isBomb ? 25 : 20
            });
        }
        
        this.items.forEach((item, i) => {
            item.y += this.speed;
            
            if (item.y + item.size > this.player.y && item.y < this.player.y + this.player.height &&
                item.x + item.size > this.player.x && item.x < this.player.x + this.player.width) {
                if (item.type === 'coin') {
                    this.score += 10;
                    if (this.score % 100 === 0) { this.speed += 0.5; this.spawnRate = Math.max(20, this.spawnRate - 5); }
                } else {
                    this.lives--;
                    if (this.lives <= 0) this.gameOver();
                }
                this.items.splice(i, 1);
                this.updateUI();
            } else if (item.y > this.canvas.height) {
                this.items.splice(i, 1);
            }
        });
    },
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#f1c40f';
        this.items.filter(i => i.type === 'coin').forEach(item => {
            this.ctx.beginPath();
            this.ctx.arc(item.x + item.size/2, item.y + item.size/2, item.size/2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.items.filter(i => i.type === 'bomb').forEach(item => {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.beginPath();
            this.ctx.arc(item.x + item.size/2, item.y + item.size/2, item.size/2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px Arial';
            this.ctx.fillText('💣', item.x + 2, item.y + 18);
        });
        
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    },
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    },
    
    gameOver() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        ScoreBoard.showScoreBoard('catch-coins', this.score, () => this.startGame());
    }
};

document.addEventListener('DOMContentLoaded', () => CatchCoins.init());
