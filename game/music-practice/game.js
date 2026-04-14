const MusicPractice = {
    canvas: null,
    ctx: null,
    width: 700,
    height: 400,
    animationId: null,
    isRunning: false,

    keys: ['a', 's', 'd', 'f', 'g', 'h', 'j'],
    keyPressed: [false, false, false, false, false, false, false],
    keyPressTime: [0, 0, 0, 0, 0, 0, 0],

    notes: [],
    fallingNotes: [],
    particles: [],

    score: 0,
    hits: 0,
    misses: 0,
    best: parseInt(localStorage.getItem('bestMusicPractice')) || 0,

    mode: 'practice', // 'practice' or 'melody'
    noteSpeed: 2,
    targetY: 300,
    hitZoneSize: 40,

    keyColors: [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
        '#3498db', '#9b59b6', '#e91e63'
    ],

    // 音符频率 (C大调: C D E F G A B)
    noteFrequencies: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88],
    noteNames: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],

    // 预设旋律 (小星星)
    melody: [
        0, 0, 4, 4, 5, 5, 4, null,
        3, 3, 2, 2, 1, 1, 0, null,
        4, 4, 3, 3, 2, 2, 1, null,
        4, 4, 3, 3, 2, 2, 1, null,
        0, 0, 4, 4, 5, 5, 4, null,
        3, 3, 2, 2, 1, 1, 0
    ],
    melodyIndex: 0,
    lastMelodyNote: 0,

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

    playNote(noteIndex) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(this.noteFrequencies[noteIndex], this.audioContext.currentTime);
        oscillator.type = 'sine';

        const attack = 0.01;
        const decay = 0.3;
        const sustain = 0.7;
        const release = 0.2;

        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + attack);
        gainNode.gain.linearRampToValueAtTime(0.3 * sustain, now + attack + decay);
        gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + release);

        oscillator.start(now);
        oscillator.stop(now + attack + decay + release + 0.1);
    },

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            const keyIndex = this.keys.indexOf(e.key.toLowerCase());
            if (keyIndex !== -1) {
                e.preventDefault();
                if (!this.keyPressed[keyIndex]) {
                    this.keyPressed[keyIndex] = true;
                    this.keyPressTime[keyIndex] = Date.now();
                    this.handleKeyPress(keyIndex);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            const keyIndex = this.keys.indexOf(e.key.toLowerCase());
            if (keyIndex !== -1) {
                this.keyPressed[keyIndex] = false;
            }
        });

        // 模式选择
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.mode = btn.dataset.mode;
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
            const keyWidth = this.width / this.keys.length;
            const keyIndex = Math.floor(x / keyWidth);

            if (keyIndex >= 0 && keyIndex < this.keys.length) {
                if (!this.keyPressed[keyIndex]) {
                    this.keyPressed[keyIndex] = true;
                    this.keyPressTime[keyIndex] = Date.now();
                    this.handleKeyPress(keyIndex);
                }
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.keyPressed = [false, false, false, false, false, false, false];
        });
    },

    handleKeyPress(keyIndex) {
        this.playNote(keyIndex);
        this.spawnKeyParticles(keyIndex);

        if (this.mode === 'practice') {
            // 练习模式：随机生成音符
            this.spawnFallingNote(keyIndex);
        } else {
            // 旋律模式：检查是否按对
            const expectedNote = this.melody[this.melodyIndex];
            if (expectedNote === keyIndex) {
                this.score += 100;
                this.hits++;
                this.showFeedback('hit');
                this.melodyIndex++;

                if (this.melodyIndex >= this.melody.length) {
                    this.gameComplete();
                    return;
                }

                this.spawnFallingNote(this.melody[this.melodyIndex]);
            } else {
                this.misses++;
                this.showFeedback('miss');
            }

            this.updateScore();
        }
    },

    spawnFallingNote(keyIndex) {
        const keyWidth = this.width / this.keys.length;
        this.fallingNotes.push({
            x: keyIndex * keyWidth + keyWidth / 2,
            y: -30,
            keyIndex: keyIndex,
            color: this.keyColors[keyIndex],
            hit: false
        });
    },

    startGame() {
        this.isRunning = true;
        this.notes = [];
        this.fallingNotes = [];
        this.particles = [];
        this.score = 0;
        this.hits = 0;
        this.misses = 0;

        if (this.mode === 'melody') {
            this.melodyIndex = 0;
            this.spawnFallingNote(this.melody[0]);
        }

        this.updateScore();
        this.hideMessage();

        // 恢复音频上下文
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

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
        // 更新下落音符
        for (let i = this.fallingNotes.length - 1; i >= 0; i--) {
            const note = this.fallingNotes[i];
            note.y += this.noteSpeed;

            // Miss检测
            if (note.y > this.targetY + this.hitZoneSize && !note.hit) {
                if (this.mode === 'practice') {
                    this.misses++;
                    this.showFeedback('miss');
                    this.updateScore();
                }
                note.hit = true;
            }

            // 移除音符
            if (note.y > this.height) {
                this.fallingNotes.splice(i, 1);
            }
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制钢琴键
        this.drawKeys();

        // 绘制目标区域
        this.drawTargetZone();

        // 绘制下落音符
        this.fallingNotes.forEach(note => {
            if (!note.hit || note.y < this.height) {
                this.drawFallingNote(note);
            }
        });

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

    drawKeys() {
        const keyWidth = this.width / this.keys.length;

        for (let i = 0; i < this.keys.length; i++) {
            const x = i * keyWidth;

            // 键背景
            const gradient = this.ctx.createLinearGradient(x, this.targetY, x, this.height);
            if (this.keyPressed[i]) {
                gradient.addColorStop(0, this.keyColors[i]);
                gradient.addColorStop(1, this.keyColors[i]);
            } else {
                gradient.addColorStop(0, '#34495e');
                gradient.addColorStop(1, '#2c3e50');
            }

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.targetY, keyWidth, this.height - this.targetY);

            // 键边框
            this.ctx.strokeStyle = this.keyPressed[i] ? '#fff' : 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = this.keyPressed[i] ? 3 : 1;
            this.ctx.strokeRect(x, this.targetY, keyWidth, this.height - this.targetY);

            // 键文字
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 20px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.keys[i].toUpperCase(), x + keyWidth / 2, this.targetY + 30);

            // 音名
            this.ctx.font = '16px sans-serif';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillText(this.noteNames[i], x + keyWidth / 2, this.targetY + 60);
        }
    },

    drawTargetZone() {
        // 目标区域背景
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.fillRect(0, this.targetY - this.hitZoneSize / 2, this.width, this.hitZoneSize);

        // 目标线
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.targetY);
        this.ctx.lineTo(this.width, this.targetY);
        this.ctx.stroke();
    },

    drawFallingNote(note) {
        const keyWidth = this.width / this.keys.length;
        const noteWidth = keyWidth - 10;
        const noteHeight = 25;

        // 发光效果
        const gradient = this.ctx.createRadialGradient(
            note.x, note.y, 0,
            note.x, note.y, noteHeight
        );
        gradient.addColorStop(0, note.color);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(note.x - noteWidth / 2, note.y - noteHeight / 2, noteWidth, noteHeight * 2);

        // 音符主体
        this.ctx.fillStyle = note.color;
        this.ctx.fillRect(note.x - noteWidth / 2, note.y - noteHeight / 2, noteWidth, noteHeight);

        // 音符边框
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(note.x - noteWidth / 2, note.y - noteHeight / 2, noteWidth, noteHeight);
    },

    spawnKeyParticles(keyIndex) {
        const keyWidth = this.width / this.keys.length;
        const x = keyIndex * keyWidth + keyWidth / 2;
        const y = this.targetY + 20;

        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 / 10) * i;
            const speed = Math.random() * 3 + 1;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: Math.random() * 4 + 2,
                color: this.keyColors[keyIndex],
                life: 1
            });
        }
    },

    showFeedback(type) {
        const display = document.getElementById('feedback-display');
        display.textContent = type.toUpperCase();
        display.className = type;
        display.classList.add('show');

        setTimeout(() => {
            display.classList.remove('show');
        }, 200);
    },

    updateScore() {
        document.getElementById('score').textContent = this.score;

        const total = this.hits + this.misses;
        const accuracy = total > 0 ? Math.round((this.hits / total) * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy + '%';

        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('bestMusicPractice', this.best);
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

    gameComplete() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        const total = this.hits + this.misses;
        const accuracy = total > 0 ? Math.round((this.hits / total) * 100) : 0;
        this.showMessage(`旋律完成！\n分数: ${this.score}\n准确率: ${accuracy}%\n点击重新开始`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MusicPractice.init();
});
