const GravityBall = {
    canvas: null,
    ctx: null,
    width: 500,
    height: 600,
    animationId: null,
    isRunning: false,

    ball: {
        x: 250,
        y: 500,
        vx: 0,
        vy: 0,
        radius: 15,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        hasLaunched: false
    },

    targets: [],
    obstacles: [],
    particles: [],

    score: 0,
    level: 1,

    GRAVITY: 0.4,
    FRICTION: 0.99,
    BOUNCE: 0.7,
    MAX_SPEED: 15,

    levels: [
        { targets: [{ x: 250, y: 100, radius: 20 }], obstacles: [] },
        { targets: [{ x: 150, y: 150, radius: 20 }, { x: 350, y: 150, radius: 20 }], obstacles: [] },
        { targets: [{ x: 250, y: 80, radius: 25 }], obstacles: [{ x: 250, y: 300, width: 100, height: 20 }] },
        { targets: [{ x: 100, y: 100, radius: 20 }, { x: 250, y: 150, radius: 20 }, { x: 400, y: 100, radius: 20 }], obstacles: [{ x: 175, y: 250, width: 150, height: 20 }] },
        { targets: [{ x: 100, y: 80, radius: 15 }, { x: 200, y: 120, radius: 15 }, { x: 300, y: 120, radius: 15 }, { x: 400, y: 80, radius: 15 }], obstacles: [
            { x: 150, y: 200, width: 80, height: 20 },
            { x: 270, y: 300, width: 80, height: 20 }
        ]}
    ],

    colors: {
        ball: '#e74c3c',
        target: '#2ecc71',
        obstacle: '#3498db',
        trail: 'rgba(231, 76, 60, 0.3)'
    },

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.bindEvents();
        this.loadLevel(0);
    },

    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', () => this.handleDragEnd());

        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleDragStart({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (this.ball.isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleDragMove({ clientX: touch.clientX, clientY: touch.clientY });
            }
        }, { passive: false });

        document.addEventListener('touchend', () => this.handleDragEnd());

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });
    },

    handleDragStart(e) {
        if (!this.isRunning || this.ball.hasLaunched) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - this.ball.x;
        const dy = y - this.ball.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.ball.radius * 2) {
            this.ball.isDragging = true;
            this.ball.dragStartX = x;
            this.ball.dragStartY = y;
        }
    },

    handleDragMove(e) {
        if (!this.ball.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ball.dragStartX = x;
        this.ball.dragStartY = y;
    },

    handleDragEnd() {
        if (!this.ball.isDragging) return;

        const dx = this.ball.x - this.ball.dragStartX;
        const dy = this.ball.y - this.ball.dragStartY;

        const power = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, this.MAX_SPEED);
        const angle = Math.atan2(dy, dx);

        this.ball.vx = Math.cos(angle) * power;
        this.ball.vy = Math.sin(angle) * power;
        this.ball.isDragging = false;
        this.ball.hasLaunched = true;
    },

    loadLevel(levelIndex) {
        const level = this.levels[Math.min(levelIndex, this.levels.length - 1)];

        // 重置球
        this.ball.x = 250;
        this.ball.y = 500;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.isDragging = false;
        this.ball.hasLaunched = false;

        // 创建目标
        this.targets = level.targets.map(t => ({
            ...t,
            collected: false,
            pulse: 0
        }));

        // 创建障碍物
        this.obstacles = level.obstacles.map(o => ({ ...o }));

        this.particles = [];
        this.isRunning = true;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop();
    },

    resetGame() {
        this.score = 0;
        this.level = 1;
        this.loadLevel(0);
        this.hideMessage();
    },

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },

    update() {
        if (!this.ball.hasLaunched || this.ball.isDragging) {
            this.updateParticles();
            return;
        }

        // 应用重力
        this.ball.vy += this.GRAVITY;

        // 应用摩擦力
        this.ball.vx *= this.FRICTION;
        this.ball.vy *= this.FRICTION;

        // 限制最大速度
        const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
        if (speed > this.MAX_SPEED) {
            this.ball.vx = (this.ball.vx / speed) * this.MAX_SPEED;
            this.ball.vy = (this.ball.vy / speed) * this.MAX_SPEED;
        }

        // 更新位置
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // 边界碰撞
        if (this.ball.x - this.ball.radius < 0) {
            this.ball.x = this.ball.radius;
            this.ball.vx *= -this.BOUNCE;
            this.spawnWallParticles(this.ball.x, this.ball.y);
        }
        if (this.ball.x + this.ball.radius > this.width) {
            this.ball.x = this.width - this.ball.radius;
            this.ball.vx *= -this.BOUNCE;
            this.spawnWallParticles(this.ball.x, this.ball.y);
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.y = this.ball.radius;
            this.ball.vy *= -this.BOUNCE;
            this.spawnWallParticles(this.ball.x, this.ball.y);
        }

        // 底部检测 - 球掉出
        if (this.ball.y - this.ball.radius > this.height) {
            this.gameOver();
            return;
        }

        // 障碍物碰撞
        this.obstacles.forEach(obs => {
            if (this.checkObstacleCollision(this.ball, obs)) {
                this.resolveObstacleCollision(obs);
            }
        });

        // 目标碰撞
        this.targets.forEach(target => {
            if (!target.collected && this.checkTargetCollision(this.ball, target)) {
                target.collected = true;
                this.score += 100;
                this.spawnCollectParticles(target.x, target.y, target.radius);
                this.updateScore();

                // 检查是否收集完所有目标
                if (this.targets.every(t => t.collected)) {
                    this.levelComplete();
                }
            }
        });

        // 更新目标脉动效果
        this.targets.forEach(target => {
            target.pulse = (target.pulse + 0.1) % (Math.PI * 2);
        });

        this.updateParticles();
    },

    checkObstacleCollision(ball, obstacle) {
        const closestX = Math.max(obstacle.x, Math.min(ball.x, obstacle.x + obstacle.width));
        const closestY = Math.max(obstacle.y, Math.min(ball.y, obstacle.y + obstacle.height));

        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < ball.radius;
    },

    resolveObstacleCollision(obstacle) {
        // 简化的碰撞响应
        const ballCenterX = this.ball.x;
        const ballCenterY = this.ball.y;

        const closestX = Math.max(obstacle.x, Math.min(ballCenterX, obstacle.x + obstacle.width));
        const closestY = Math.max(obstacle.y, Math.min(ballCenterY, obstacle.y + obstacle.height));

        const dx = ballCenterX - closestX;
        const dy = ballCenterY - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        // 根据碰撞面反弹
        if (Math.abs(dx) > Math.abs(dy)) {
            this.ball.vx *= -this.BOUNCE;
            this.ball.x += dx > 0 ? ball.radius - distance : -ball.radius + distance;
        } else {
            this.ball.vy *= -this.BOUNCE;
            this.ball.y += dy > 0 ? ball.radius - distance : -ball.radius + distance;
        }

        this.spawnWallParticles(closestX, closestY);
    },

    checkTargetCollision(ball, target) {
        const dx = ball.x - target.x;
        const dy = ball.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < ball.radius + target.radius;
    },

    spawnWallParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                color: 'rgba(255, 255, 255, 0.8)',
                life: 0.5
            });
        }
    },

    spawnCollectParticles(x, y, radius) {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 / 15) * i;
            const speed = Math.random() * 3 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                color: this.colors.target,
                life: 1
            });
        }
    },

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制背景网格
        this.drawBackground();

        // 绘制拖拽线
        if (this.ball.isDragging) {
            this.drawDragLine();
        }

        // 绘制障碍物
        this.obstacles.forEach(obs => {
            this.drawObstacle(obs);
        });

        // 绘制目标
        this.targets.forEach(target => {
            if (!target.collected) {
                this.drawTarget(target);
            }
        });

        // 绘制球
        this.drawBall();

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

        for (let x = 0; x < this.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    },

    drawDragLine() {
        const dx = this.ball.x - this.ball.dragStartX;
        const dy = this.ball.y - this.ball.dragStartY;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, this.MAX_SPEED);

        this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(power / this.MAX_SPEED, 1)})`;
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.ball.x, this.ball.y);
        this.ctx.lineTo(this.ball.dragStartX, this.ball.dragStartY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 绘制箭头
        const angle = Math.atan2(dy, dx);
        const arrowSize = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(this.ball.x, this.ball.y);
        this.ctx.lineTo(
            this.ball.x - arrowSize * Math.cos(angle - Math.PI / 6),
            this.ball.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(this.ball.x, this.ball.y);
        this.ctx.lineTo(
            this.ball.x - arrowSize * Math.cos(angle + Math.PI / 6),
            this.ball.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    },

    drawObstacle(obstacle) {
        this.ctx.fillStyle = this.colors.obstacle;
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    },

    drawTarget(target) {
        const pulse = 1 + Math.sin(target.pulse) * 0.1;

        this.ctx.fillStyle = this.colors.target;
        this.ctx.beginPath();
        this.ctx.arc(target.x, target.y, target.radius * pulse, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(target.x - target.radius * 0.3, target.y - target.radius * 0.3, target.radius * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
    },

    drawBall() {
        // 发光效果
        const gradient = this.ctx.createRadialGradient(
            this.ball.x, this.ball.y, 0,
            this.ball.x, this.ball.y, this.ball.radius * 2
        );
        gradient.addColorStop(0, 'rgba(231, 76, 60, 0.3)');
        gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 球体
        this.ctx.fillStyle = this.colors.ball;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(
            this.ball.x - this.ball.radius * 0.3,
            this.ball.y - this.ball.radius * 0.3,
            this.ball.radius * 0.3,
            0, Math.PI * 2
        );
        this.ctx.fill();
    },

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
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

    levelComplete() {
        this.isRunning = false;
        this.level++;

        if (this.level > this.levels.length) {
            this.showMessage(`恭喜通关！\n最终得分: ${this.score}\n点击新游戏重新开始`);
        } else {
            setTimeout(() => {
                this.loadLevel(this.level - 1);
                this.hideMessage();
            }, 1000);
            this.showMessage(`关卡完成！\n进入第 ${this.level} 关`);
        }
    },

    gameOver() {
        this.isRunning = false;
        this.showMessage(`游戏结束！\n得分: ${this.score}\n关卡: ${this.level}\n点击新游戏重新开始`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GravityBall.init();
});
