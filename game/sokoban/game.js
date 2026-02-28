const Sokoban = {
    canvas: null, ctx: null, animationId: null,
    isRunning: false, level: 1, steps: 0, time: 0, totalSteps: 0,
    levels: [
        [
            [2,2,2,2,2,2,2,2,2,2],
            [2,0,0,0,0,0,0,0,0,2],
            [2,0,1,0,0,0,0,0,0,2],
            [2,0,3,4,0,0,0,0,2],
            [2,0,0,1,3,0,0,0,2],
            [2,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,2],
            [2,2,2,2,2,2,2,2,2,2]
        ]
    ],
    player: { x: 1, y: 2 },
    items: [],
    history: [],
    colors: {
        wall: '#34495e',
        floor: '#ecf0f1',
        target: '#e74c3c',
        box: '#f1c40f',
        boxTarget: '#27ae60',
        player: '#3498db',
        boxColor: '#f1c40f'
    },
    tileSize: 50,
    keyMap: {
        'ArrowUp': { x: 0, y: -1 }, 'w': { x: 0, y: -1 },
        'ArrowDown': { x: 0, y: 1 }, 's': { x: 0, y: 1 },
        'ArrowLeft': { x: -1, y: 0 }, 'a': { x: -1, y: 0 },
        'ArrowRight': { x: 1, y: 0 }, 'd': { x: 1, y: 0 }
    },

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('keydown', e => this.handleInput(e));
        document.getElementById('restart-btn').addEventListener('click', () => this.restartLevel());
    },

    startGame() {
        this.level = 1;
        this.steps = 0;
        this.time = 0;
        this.totalSteps = 0;
        this.startTimer();
        this.loadLevel(0);
    },

    loadLevel(levelIdx) {
        this.history = [];
        const levelData = this.levels[levelIdx];
        this.items = [];
        this.totalSteps = 0;
        this.drawLevel(levelData);
    },

    startTimer() {
        setInterval(() => {
            this.time++;
            const mins = Math.floor(this.time / 60).toString().padStart(2, '0');
            const secs = (this.time % 60).toString().padStart(2, '0');
            document.getElementById('time').textContent = `${mins}:${secs}`;
        }, 1000);
    },

    restartLevel() {
        this.history = [];
        this.loadLevel(this.level - 1);
        document.getElementById('steps').textContent = this.steps;
    },

    saveState() {
        this.history.push(JSON.stringify({
            player: { ...this.player },
            items: JSON.parse(JSON.stringify(this.items))
        }));
        if (this.history.length > 50) this.history.shift();
    },

    undo() {
        if (this.history.length > 0) {
            const lastState = JSON.parse(this.history.pop());
            this.player = lastState.player;
            this.items = lastState.items;
            this.drawLevel(this.levels[this.level - 1]);
        }
    },

    handleInput(e) {
        if (!this.isRunning) return;
        const direction = this.keyMap[e.key];
        if (direction) {
            e.preventDefault();
            const newX = this.player.x + direction.x;
            const newY = this.player.y + direction.y;

            // Check wall collision
            const levelData = this.levels[this.level - 1];
            if (levelData[newY][newX] === 2) return;

            this.saveState();

            // Check if pushing a box
            const itemIndex = this.items.findIndex(item => item.x === newX && item.y === newY);
            if (itemIndex !== -1) {
                const boxNewX = newX + direction.x;
                const boxNewY = newY + direction.y;

                // Check if box can be pushed
                if (levelData[boxNewY][boxNewX] !== 2) {
                    const boxBlocked = this.items.some(item => item.x === boxNewX && item.y === boxNewY);
                    if (!boxBlocked) {
                        this.items[itemIndex] = { ...this.items[itemIndex], x: boxNewX, y: boxNewY };
                        this.steps++;
                        this.totalSteps++;
                    }
                }
            } else {
                this.player.x = newX;
                this.player.y = newY;
                this.steps++;
                this.totalSteps++;
                document.getElementById('steps').textContent = this.steps;
            }

            this.checkWin();
            this.drawLevel(this.levels[this.level - 1]);
        }
    },

    drawLevel(levelData) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw map
        for (let y = 0; y < levelData.length; y++) {
            for (let x = 0; x < levelData[y].length; x++) {
                const cell = levelData[y][x];
                const px = x * this.tileSize;
                const py = y * this.tileSize;

                if (cell === 2) {
                    this.ctx.fillStyle = this.colors.wall;
                    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
                } else if (cell === 3) {
                    this.ctx.fillStyle = this.colors.floor;
                    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
                    this.ctx.fillStyle = this.colors.target;
                    this.ctx.beginPath();
                    this.ctx.arc(px + this.tileSize / 2, py + this.tileSize / 2, this.tileSize / 4, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (cell === 4) {
                    this.ctx.fillStyle = this.colors.floor;
                    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
                    this.ctx.fillStyle = this.colors.player;
                    this.ctx.beginPath();
                    this.ctx.arc(px + this.tileSize / 2, py + this.tileSize / 2, this.tileSize / 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // Draw items (boxes)
        this.items.forEach(item => {
            const px = item.x * this.tileSize;
            const py = item.y * this.tileSize;

            // Check if box on target
            if (levelData[item.y][item.y] === 3) {
                this.ctx.fillStyle = this.colors.boxTarget;
                this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            } else {
                this.ctx.fillStyle = this.colors.box;
                this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            }

            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.strokeRect(px, py, this.tileSize, this.tileSize);
        });

        // Draw player
        const playerX = this.player.x * this.tileSize;
        const playerY = this.player.y * this.tileSize;
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(playerX + this.tileSize / 2, playerY + this.tileSize / 2, this.tileSize / 3, 0, Math.PI * 2);
        this.ctx.fill();
    },

    checkWin() {
        const levelData = this.levels[this.level - 1];
        const targets = levelData.flat().filter(cell => cell === 3).length;
        const boxesOnTargets = this.items.filter(item => {
            const itemCell = levelData[item.y][item.y];
            return itemCell === 3;
        }).length;

        if (boxesOnTargets === targets) {
            this.isRunning = false;
            setTimeout(() => {
                document.getElementById('game-status').textContent = `🎉 第 ${this.level} 关完成！`;
                this.level++;
                if (this.level > this.levels.length) {
                    document.getElementById('game-status').textContent = '🎉 所有关卡完成！';
                    this.level = 1;
                }
                this.loadLevel(this.level - 1);
            }, 1000);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Sokoban.init();
    Sokoban.startGame();
});