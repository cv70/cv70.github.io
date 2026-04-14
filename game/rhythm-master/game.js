const RhythmGame = {
    canvas: null,
    ctx: null,
    width: 400,
    height: 500,
    animationId: null,
    isRunning: false,

    tracks: 4,
    trackWidth: 100,
    targetY: 400,
    hitZoneSize: 50,

    notes: [],
    score: 0,
    combo: 0,
    maxCombo: 0,
    best: parseInt(localStorage.getItem('bestRhythmMaster')) || 0,

    difficulty: 'easy',
    difficulties: {
        easy: { speed: 3, spawnRate: 1500 },
        normal: { speed: 5, spawnRate: 1000 },
        hard: { speed: 7, spawnRate: 700 }
    },

    lastSpawnTime: 0,
    gameStartTime: 0,
    gameDuration: 60000, // 60秒

    trackColors: [
        'rgba(231, 76, 60, 0.8)',
        'rgba(241, 196, 15, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(52, 152, 219, 0.8)'
    ],

    trackKeys: ['d', 'f', 'j', 'k'],
    keyPressed: [false, false, false, false],

    audioContext: null,

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.bindEvents();
        this.initAudio();
        this.updateBest();
        this.draw();
    },

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },

    playHitSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    },

    playMissSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    },

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;

            const keyIndex = this.trackKeys.indexOf(e.key.toLowerCase());
            if (keyIndex !== -1) {
                e.preventDefault();
                this.keyPressed[keyIndex] = true;
                this.hitNote(keyIndex);
            }
        });

        document.addEventListener('keyup', (e) => {
            const keyIndex = this.trackKeys.indexOf(e.key.toLowerCase());
            if (keyIndex !== -1) {
                this.keyPressed[keyIndex] = false;
            }
        });

        // 难度选择
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.diff;
            });
        });

        // 开始按钮
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            if (!this.isRunning) return;
            e.preventDefault();

            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const trackIndex = Math.floor(x / this.trackWidth);

            if (trackIndex >= 0 && trackIndex < this.tracks) {
                this.keyPressed[trackIndex] = true;
                this.hitNote(trackIndex);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.keyPressed = [false, false, false, false];
        });
    },

    startGame() {
        this.isRunning = true;
        this.notes = [];
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.lastSpawnTime = 0;
        this.gameStartTime = Date.now();

        this.updateScore();
        this.hideMessage();

        // 恢复音频上下文
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        document.getElementById('start-btn').textContent = '重新开始';

        this.gameLoop();
    },

    hitNote(track) {
        const now = Date.now();
        const diffConfig = this.difficulties[this.difficulty];

        // 找到该轨道最接近判定线的音符
        const noteIndex = this.notes.findIndex(note => {
            return note.track === track &&
                   Math.abs(note.y - this.targetY) < this.hitZoneSize * 2 &&
                   !note.hit;
        });

        if (noteIndex !== -1) {
            const note = this.notes[noteIndex];
            const distance = Math.abs(note.y - this.targetY);
            note.hit = true;

            this.playHitSound();

            if (distance < this.hitZoneSize * 0.3) {
                // Perfect
                this.score += 100 + this.combo * 10;
                this.combo++;
                this.showJudge('perfect');
            } else if (distance < this.hitZoneSize) {
                // Good
                this.score += 50 + this.combo * 5;
                this.combo++;
                this.showJudge('good');
            } else {
                // Miss
                this.combo = 0;
                this.showJudge('miss');
            }

            this.maxCombo = Math.max(this.maxCombo, this.combo);
            this.updateScore();
        }
    },

    spawnNote() {
        const track = Math.floor(Math.random() * this.tracks);
        this.notes.push({
            track: track,
            y: -50,
            hit: false,
            color: this.trackColors[track]
        });
    },

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },

    update() {
        const now = Date.now();
        const elapsed = now - this.gameStartTime;
        const diffConfig = this.difficulties[this.difficulty];

        // 检查游戏是否结束
        if (elapsed >= this.gameDuration) {
            this.gameOver();
            return;
        }

        // 生成音符
        if (now - this.lastSpawnTime > diffConfig.spawnRate) {
            this.spawnNote();
            this.lastSpawnTime = now;
        }

        // 更新音符位置
        const speed = diffConfig.speed;
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            note.y += speed;

            // Miss检测
            if (!note.hit && note.y > this.targetY + this.hitZoneSize) {
                note.hit = true;
                this.combo = 0;
                this.playMissSound();
                this.showJudge('miss');
                this.updateScore();
            }

            // 移除已处理的音符
            if (note.hit && (note.y > this.height || note.y > this.targetY + this.hitZoneSize)) {
                this.notes.splice(i, 1);
            }
        }
    },

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制轨道
        this.drawTracks();

        // 绘制判定线
        this.drawHitZone();

        // 绘制音符
        this.notes.forEach(note => {
            if (!note.hit || note.y <= this.targetY + this.hitZoneSize) {
                this.drawNote(note);
            }
        });

        // 绘制按键指示器
        this.drawKeyIndicators();

        // 绘制时间进度
        this.drawProgress();
    },

    drawTracks() {
        for (let i = 0; i < this.tracks; i++) {
            const x = i * this.trackWidth;

            // 轨道背景
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            this.ctx.fillRect(x, 0, this.trackWidth, this.height);

            // 轨道分隔线
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // 右边界
        this.ctx.beginPath();
        this.ctx.moveTo(this.width, 0);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.stroke();
    },

    drawHitZone() {
        const y = this.targetY;

        // 判定区域背景
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.fillRect(0, y - this.hitZoneSize / 2, this.width, this.hitZoneSize);

        // 判定线
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();

        // Perfect区域指示
        this.ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, y - this.hitZoneSize * 0.3);
        this.ctx.lineTo(this.width, y - this.hitZoneSize * 0.3);
        this.ctx.moveTo(0, y + this.hitZoneSize * 0.3);
        this.ctx.lineTo(this.width, y + this.hitZoneSize * 0.3);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    },

    drawNote(note) {
        const x = note.track * this.trackWidth;
        const noteWidth = this.trackWidth - 10;
        const noteHeight = 20;

        // 音符发光效果
        const gradient = this.ctx.createRadialGradient(
            x + noteWidth / 2, note.y, 0,
            x + noteWidth / 2, note.y, noteHeight * 1.5
        );
        gradient.addColorStop(0, note.color);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x + 5, note.y - noteHeight, noteWidth, noteHeight * 2);

        // 音符主体
        this.ctx.fillStyle = note.color;
        this.ctx.fillRect(x + 5, note.y - noteHeight / 2, noteWidth, noteHeight);

        // 音符边框
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 5, note.y - noteHeight / 2, noteWidth, noteHeight);
    },

    drawKeyIndicators() {
        for (let i = 0; i < this.tracks; i++) {
            const x = i * this.trackWidth + this.trackWidth / 2;
            const y = this.height - 50;

            // 按键背景
            this.ctx.fillStyle = this.keyPressed[i] ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 25, 0, Math.PI * 2);
            this.ctx.fill();

            // 按键边框
            this.ctx.strokeStyle = this.keyPressed[i] ? 'rgba(0, 212, 255, 1)' : 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = this.keyPressed[i] ? 3 : 2;
            this.ctx.stroke();

            // 按键文字
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.trackKeys[i].toUpperCase(), x, y);
        }
    },

    drawProgress() {
        const elapsed = Date.now() - this.gameStartTime;
        const progress = elapsed / this.gameDuration;

        // 进度条背景
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, this.height - 5, this.width, 5);

        // 进度条
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
        this.ctx.fillRect(0, this.height - 5, this.width * progress, 5);
    },

    showJudge(judge) {
        const display = document.getElementById('judge-display');
        display.textContent = judge.toUpperCase();
        display.className = judge;

        display.classList.add('show');

        setTimeout(() => {
            display.classList.remove('show');
        }, 200);
    },

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('combo').textContent = this.combo;

        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('bestRhythmMaster', this.best);
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
        this.showMessage(`游戏结束！\n分数: ${this.score}\n最大连击: ${this.maxCombo}\n点击重新开始继续挑战`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    RhythmGame.init();
});
