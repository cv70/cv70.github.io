const BulletDodge = {
    canvas: null,
    ctx: null,
    width: 500,
    height: 600,
    animationId: null,
    isRunning: false,

    player: {
        x: 250,
        y: 500,
        radius: 15,
        speed: 5,
        hasShield: false,
        shieldTime: 0,
        invincible: false,
        invincibleTime: 0
    },

    bullets: [],
    powerups: [],
    particles: [],

    keys: { up: false, down: false, left: false, right: false },

    lives: 3,
    score: 0, // 生存时间（秒）
    best: parseInt(localStorage.getItem('bestBulletDodge')) || 0,

    startTime: 0,
    bulletSpawnRate: 200, // 毫秒
    lastBulletSpawn: 0,

    difficulty: 1,
    waveTime: 0,

    colors: {
        player: '#00d4ff',
        bullet: '#e74c3c',
        bulletWave: '#9b59b6',
        powerupShield: '#22c55e',
        powerupSpeed: '#f59e0b'
    },

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.bindEvents();
        this.updateBest();
        this.draw();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.up = true;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.down = true;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = true;
                    e.preventDefault();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.down = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = false;
                    break;
            }
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // 触摸控制
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            if (!this.isRunning) return;
            e.preventDefault();

            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.isRunning) return;
            e.preventDefault();

            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;

            this.player.x += dx * 0.5;
            this.player.y += dy * 0.5;

            // 边界限制
            this.player.x = Math.max(this.player.radius, Math.min(this.width - this.player.radius, this.player.x));
            this.player.y = Math.max(this.player.radius, Math.min(this.height - this.player.radius, this.player.y));

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: false });
    },

    startGame() {
        this.isRunning = true;
        this.player.x = this.width / 2;
        this.player.y = this.height - 100;
        this.player.hasShield = false;
        this.player.shieldTime = 0;
        this.player.invincible = false;

        this.bullets = [];
        this.powerups = [];
        this.particles = [];

        this.lives = 3;
        this.score = 0;
        this.startTime = Date.now();
        this.difficulty = 1;
        this.waveTime = 0;
        this.bulletSpawnRate = 200;
        this.lastBulletSpawn = 0;

        this.updateUI();
        this.hideMessage();

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
        const now = Date.now();

        // 更新生存时间
        this.score = Math.floor((now - this.startTime) / 1000);

        // 更新难度
        this.waveTime++;
        if (this.waveTime >= 600) { // 每10秒增加难度
            this.difficulty++;
            this.waveTime = 0;
            this.bulletSpawnRate = Math.max(50, this.bulletSpawnRate - 20);
        }

        // 玩家移动
        const speed = this.player.speed + (this.player.hasShield ? 1 : 0);
        if (this.keys.up && this.player.y > this.player.radius) {
            this.player.y -= speed;
        }
        if (this.keys.down && this.player.y < this.height - this.player.radius) {
            this.player.y += speed;
        }
        if (this.keys.left && this.player.x > this.player.radius) {
            this.player.x -= speed;
        }
        if (this.keys.right && this.player.x < this.width - this.player.radius) {
            this.player.x += speed;
        }

        // 更新无敌状态
        if (this.player.invincible && now > this.player.invincibleTime) {
            this.player.invincible = false;
        }

        // 更新护盾
        if (this.player.hasShield && now > this.player.shieldTime) {
            this.player.hasShield = false;
            this.updatePowerupStatus();
        }

        // 生成弹幕
        if (now - this.lastBulletSpawn > this.bulletSpawnRate) {
            this.spawnBullets();
            this.lastBulletSpawn = now;
        }

        // 生成道具
        if (Math.random() < 0.003) {
            this.spawnPowerup();
        }

        // 更新弹幕
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;

            // 检查碰撞
            if (this.checkPlayerCollision(bullet)) {
                this.bullets.splice(i, 1);
                this.handleHit();
                continue;
            }

            // 移除出界弹幕
            if (bullet.x < -20 || bullet.x > this.width + 20 ||
                bullet.y < -20 || bullet.y > this.height + 20) {
                this.bullets.splice(i, 1);
            }
        }

        // 更新道具
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.y += 1;

            // 检查碰撞
            const dx = this.player.x - powerup.x;
            const dy = this.player.y - powerup.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.player.radius + powerup.radius) {
                this.collectPowerup(powerup);
                this.powerups.splice(i, 1);
                continue;
            }

            // 移除出界道具
            if (powerup.y > this.height + 20) {
                this.powerups.splice(i, 1);
            }
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        this.updateUI();
    },

    spawnBullets() {
        const pattern = Math.floor(Math.random() * 5);
        const baseSpeed = 2 + this.difficulty * 0.5;

        switch(pattern) {
            case 0: // 从上方随机发射
                this.bullets.push({
                    x: Math.random() * this.width,
                    y: -10,
                    vx: 0,
                    vy: baseSpeed,
                    radius: 5
                });
                break;

            case 1: // 从左右发射
                const side = Math.random() > 0.5 ? 'left' : 'right';
                const startX = side === 'left' ? -10 : this.width + 10;
                const targetX = this.player.x + (Math.random() - 0.5) * 200;
                const targetY = this.player.y + (Math.random() - 0.5) * 200;
                const angle = Math.atan2(targetY - 0, targetX - startX);
                this.bullets.push({
                    x: startX,
                    y: Math.random() * 200,
                    vx: Math.cos(angle) * baseSpeed,
                    vy: Math.sin(angle) * baseSpeed,
                    radius: 5
                });
                break;

            case 2: // 扇形发射
                const centerX = Math.random() * this.width;
                for (let i = 0; i < 5; i++) {
                    const angle = Math.PI / 2 + (i - 2) * 0.3;
                    this.bullets.push({
                        x: centerX,
                        y: -10,
                        vx: Math.cos(angle) * baseSpeed,
                        vy: Math.sin(angle) * baseSpeed,
                        radius: 5
                    });
                }
                break;

            case 3: // 螺旋发射
                const spiralX = Math.random() * this.width;
                const spiralAngle = (Date.now() / 200) % (Math.PI * 2);
                this.bullets.push({
                    x: spiralX,
                    y: -10,
                    vx: Math.cos(spiralAngle) * baseSpeed * 0.5,
                    vy: baseSpeed,
                    radius: 6,
                    color: this.colors.bulletWave
                });
                break;

            case 4: // 追踪弹幕
                this.bullets.push({
                    x: Math.random() * this.width,
                    y: -10,
                    vx: 0,
                    vy: baseSpeed * 0.8,
                    radius: 7,
                    tracking: true,
                    color: this.colors.bulletWave
                });
                break;
        }
    },

    spawnPowerup() {
        const type = Math.random() > 0.5 ? 'shield' : 'speed';
        this.powerups.push({
            x: Math.random() * (this.width - 40) + 20,
            y: -20,
            radius: 15,
            type: type,
            pulse: 0
        });
    },

    checkPlayerCollision(bullet) {
        if (this.player.invincible) return false;

        const dx = this.player.x - bullet.x;
        const dy = this.player.y - bullet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.player.radius + bullet.radius;
    },

    handleHit() {
        if (this.player.hasShield) {
            // 护盾抵挡
            this.player.hasShield = false;
            this.player.invincible = true;
            this.player.invincibleTime = Date.now() + 1000;
            this.updatePowerupStatus();
            this.spawnHitParticles();
        } else {
            // 受伤
            this.lives--;
            this.player.invincible = true;
            this.player.invincibleTime = Date.now() + 2000;
            this.spawnHitParticles();

            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    },

    collectPowerup(powerup) {
        if (powerup.type === 'shield') {
            this.player.hasShield = true;
            this.player.shieldTime = Date.now() + 8000;
        } else if (powerup.type === 'speed') {
            this.player.speed = 7;
            setTimeout(() => {
                this.player.speed = 5;
            }, 5000);
        }

        this.updatePowerupStatus();
        this.spawnCollectParticles(powerup.x, powerup.y, powerup.type);
    },

    spawnHitParticles() {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 / 15) * i;
            const speed = Math.random() * 4 + 2;
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 5 + 2,
                color: '#e74c3c',
                life: 1
            });
        }
    },

    spawnCollectParticles(x, y, type) {
        const color = type === 'shield' ? this.colors.powerupShield : this.colors.powerupSpeed;
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 / 10) * i;
            const speed = Math.random() * 3 + 1;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1
            });
        }
    },

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制背景
        this.drawBackground();

        // 绘制道具
        this.powerups.forEach(powerup => {
            this.drawPowerup(powerup);
        });

        // 绘制弹幕
        this.bullets.forEach(bullet => {
            this.drawBullet(bullet);
        });

        // 绘制玩家
        this.drawPlayer();

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
        // 网格背景
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
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

    drawPlayer() {
        // 无敌闪烁
        if (this.player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        // 护盾
        if (this.player.hasShield) {
            this.ctx.beginPath();
            this.ctx.arc(this.player.x, this.player.y, this.player.radius + 10, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // 护盾粒子效果
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i + Date.now() / 500;
                const r = this.player.radius + 10;
                this.ctx.beginPath();
                this.ctx.arc(
                    this.player.x + Math.cos(angle) * r,
                    this.player.y + Math.sin(angle) * r,
                    3, 0, Math.PI * 2
                );
                this.ctx.fillStyle = '#22c55e';
                this.ctx.fill();
            }
        }

        // 玩家发光效果
        const gradient = this.ctx.createRadialGradient(
            this.player.x, this.player.y, 0,
            this.player.x, this.player.y, this.player.radius * 2
        );
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 玩家主体
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 玩家高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x - this.player.radius * 0.3,
            this.player.y - this.player.radius * 0.3,
            this.player.radius * 0.3,
            0, Math.PI * 2
        );
        this.ctx.fill();
    },

    drawBullet(bullet) {
        this.ctx.fillStyle = bullet.color || this.colors.bullet;
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 弹幕发光
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, bullet.radius + 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    },

    drawPowerup(powerup) {
        powerup.pulse = (powerup.pulse + 0.1) % (Math.PI * 2);
        const scale = 1 + Math.sin(powerup.pulse) * 0.2;

        this.ctx.save();
        this.ctx.translate(powerup.x, powerup.y);
        this.ctx.scale(scale, scale);

        if (powerup.type === 'shield') {
            // 护盾图标
            this.ctx.fillStyle = this.colors.powerupShield;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, powerup.radius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🛡️', 0, 0);
        } else {
            // 速度图标
            this.ctx.fillStyle = this.colors.powerupSpeed;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, powerup.radius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('⚡', 0, 0);
        }

        this.ctx.restore();
    },

    updateUI() {
        document.getElementById('score').textContent = this.score + 's';
        document.getElementById('lives').textContent = this.lives;

        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('bestBulletDodge', this.best);
            this.updateBest();
        }
    },

    updatePowerupStatus() {
        const status = document.getElementById('shield-status');
        if (this.player.hasShield) {
            status.textContent = '激活';
            status.classList.add('active');
        } else {
            status.textContent = '无';
            status.classList.remove('active');
        }
    },

    updateBest() {
        document.getElementById('best').textContent = this.best + 's';
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
        this.showMessage(`游戏结束！\n生存时间: ${this.score}秒\n难度等级: ${this.difficulty}\n点击重新开始`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BulletDodge.init();
});
