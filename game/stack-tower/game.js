const StackGame = {
    canvas: null,
    ctx: null,
    width: 400,
    height: 600,
    animationId: null,
    isRunning: false,

    blocks: [],
    currentBlock: null,
    particles: [],

    score: 0,
    best: parseInt(localStorage.getItem('bestStackTower')) || 0,
    direction: 1,
    speed: 3,
    baseSpeed: 3,
    blockHeight: 30,
    baseWidth: 200,

    colors: [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
        '#3498db', '#9b59b6', '#1abc9c', '#e91e63'
    ],

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.bindEvents();
        this.updateBest();
        this.startGame();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.placeBlock();
            }
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        // 点击画布放置方块
        this.canvas.addEventListener('click', () => {
            this.placeBlock();
        });

        // 触摸支持
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.placeBlock();
        }, { passive: false });
    },

    startGame() {
        this.isRunning = true;
        this.blocks = [];
        this.particles = [];
        this.score = 0;
        this.speed = this.baseSpeed;
        this.direction = 1;

        this.updateScore();
        this.hideMessage();

        // 创建基座
        const baseBlock = {
            x: (this.width - this.baseWidth) / 2,
            y: this.height - this.blockHeight - 20,
            width: this.baseWidth,
            height: this.blockHeight,
            color: this.colors[0],
            isBase: true
        };
        this.blocks.push(baseBlock);

        // 创建第一个方块
        this.createNewBlock();

        // 开始游戏循环
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop();
    },

    createNewBlock() {
        const prevBlock = this.blocks[this.blocks.length - 1];
        const colorIndex = this.blocks.length % this.colors.length;

        this.currentBlock = {
            x: -this.baseWidth,
            y: prevBlock.y - this.blockHeight,
            width: prevBlock.width,
            height: this.blockHeight,
            color: this.colors[colorIndex],
            isMoving: true
        };
    },

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },

    update() {
        if (!this.currentBlock || !this.currentBlock.isMoving) return;

        // 移动方块
        this.currentBlock.x += this.speed * this.direction;

        // 边界检测
        if (this.currentBlock.x <= 0 || this.currentBlock.x + this.currentBlock.width >= this.width) {
            this.direction *= -1;
        }

        // 更新粒子
        this.updateParticles();
    },

    placeBlock() {
        if (!this.isRunning || !this.currentBlock || !this.currentBlock.isMoving) return;

        const prevBlock = this.blocks[this.blocks.length - 1];

        // 计算重叠
        const overlap = this.calculateOverlap(prevBlock, this.currentBlock);

        if (overlap <= 0) {
            // 游戏结束
            this.gameOver();
            return;
        }

        // 切割超出部分
        const cutAmount = (prevBlock.width + this.currentBlock.width) / 2 - overlap;
        const newX = Math.min(prevBlock.x, this.currentBlock.x);

        // 创建切割的粒子效果
        if (cutAmount > 0) {
            this.spawnCutParticles(
                newX + (this.currentBlock.x > prevBlock.x ? overlap : 0),
                this.currentBlock.y,
                cutAmount,
                this.currentBlock.height,
                this.currentBlock.color
            );
        }

        // 更新当前方块
        this.currentBlock.x = newX;
        this.currentBlock.width = overlap;
        this.currentBlock.isMoving = false;

        // 完美放置检测
        const isPerfect = Math.abs(this.currentBlock.x - prevBlock.x) < 5;
        if (isPerfect) {
            this.currentBlock.x = prevBlock.x;
            this.currentBlock.width = prevBlock.width;
            this.spawnPerfectParticles();
            this.score += 2; // 完美放置额外加分
        }

        // 添加到块列表
        this.blocks.push(this.currentBlock);
        this.score++;
        this.updateScore();

        // 增加速度
        this.speed = Math.min(this.baseSpeed + this.score * 0.15, 8);

        // 移动相机
        if (this.blocks.length > 8) {
            const offset = (this.blocks.length - 8) * this.blockHeight;
            this.blocks.forEach(block => {
                block.y += offset;
            });
        }

        // 创建新方块
        if (this.currentBlock.width > 10) {
            this.createNewBlock();
        } else {
            this.gameOver();
        }
    },

    calculateOverlap(block1, block2) {
        const left = Math.max(block1.x, block2.x);
        const right = Math.min(block1.x + block1.width, block2.x + block2.width);
        return Math.max(0, right - left);
    },

    spawnCutParticles(x, y, width, height, color) {
        const particleCount = Math.floor(width / 5) + 3;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x + Math.random() * width,
                y: y + Math.random() * height,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 + 2,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1
            });
        }
    },

    spawnPerfectParticles() {
        const block = this.currentBlock;
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const speed = Math.random() * 3 + 2;
            this.particles.push({
                x: block.x + block.width / 2,
                y: block.y + block.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 6 + 3,
                color: '#fff',
                life: 1
            });
        }
    },

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // 重力
            p.life -= 0.03;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制背景网格
        this.drawBackground();

        // 绘制所有方块
        this.blocks.forEach(block => {
            this.drawBlock(block);
        });

        // 绘制当前方块
        if (this.currentBlock && this.currentBlock.isMoving) {
            this.drawBlock(this.currentBlock);
        }

        // 绘制粒子
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    },

    drawBackground() {
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    },

    drawBlock(block) {
        // 主体
        this.ctx.fillStyle = block.color;
        this.ctx.fillRect(block.x, block.y, block.width, block.height);

        // 边框
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(block.x, block.y, block.width, block.height);

        // 高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(block.x, block.y, block.width, block.height / 3);
    },

    updateScore() {
        document.getElementById('score').textContent = this.score;

        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('bestStackTower', this.best);
            this.updateBest();
        }
    },

    updateBest() {
        document.getElementById('best').textContent = this.best;
    },

    showMessage(msg) {
        const messageEl = document.getElementById('game-message');
        messageEl.textContent = msg;
        messageEl.classList.add('show');
    },

    hideMessage() {
        const messageEl = document.getElementById('game-message');
        messageEl.classList.remove('show');
    },

    gameOver() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        this.showMessage(`游戏结束！\n高度: ${this.score}\n点击新游戏重新开始`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    StackGame.init();
});
