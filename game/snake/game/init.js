const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameRunning = false;
let isPaused = false;
let gameSpeed = 100;
let timeoutId = null;

const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const difficultySelect = document.getElementById('difficulty');

const difficultySettings = {
    easy: 150,
    normal: 100,
    hard: 60
};

function init() {
    snake = [
        {x: 5, y: 5},
        {x: 4, y: 5},
        {x: 3, y: 5}
    ];
    generateFood();
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameSpeed = difficultySettings[difficultySelect.value];
    scoreElement.textContent = `得分: ${score}`;
    gameRunning = true;
    isPaused = false;
    restartBtn.textContent = '重新开始';
    pauseBtn.style.display = 'inline-block';
    pauseBtn.textContent = '暂停';
}

function startGame() {
    if (gameRunning && !isPaused) {
        init();
    }
    if (timeoutId) clearTimeout(timeoutId);
    gameLoop();
}

function togglePause() {
    if (!gameRunning) return;
    
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.textContent = '继续';
        if (timeoutId) clearTimeout(timeoutId);
    } else {
        pauseBtn.textContent = '暂停';
        gameLoop();
    }
}

function gameOver() {
    gameRunning = false;
    if (timeoutId) clearTimeout(timeoutId);
    
    ScoreBoard.showScoreBoard('snake', score, () => {
        init();
        gameLoop();
    });
}

function gameLoop() {
    if (!gameRunning || isPaused) return;

    timeoutId = setTimeout(() => {
        updateSnake();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        gameLoop();
    }, gameSpeed);
}

function updateSnake() {
    direction = nextDirection;
    
    const head = {x: snake[0].x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0),
                  y: snake[0].y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0)};

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `得分: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            return;
        }
    }
}

function drawFood() {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

restartBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

difficultySelect.addEventListener('change', (e) => {
    gameSpeed = difficultySettings[e.target.value];
});

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

init();
