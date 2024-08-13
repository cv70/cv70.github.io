const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('#score-value');
const timeBoard = document.querySelector('#time-value');
const startBtn = document.querySelector('#start-btn');

let lastHole;
let timeUp = false;
let score = 0;
let gameTime = 30;
let timerInterval;
let moleTimeout;

// 使用Go Gopher表情符号作为地鼠图标
const GOPPER_EMOJI = '🐹';

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(400, 1000);
    const hole = randomHole(holes);
    
    hole.classList.add('up');
    hole.classList.remove('bonked');
    
    moleTimeout = setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeBoard.textContent = gameTime;
    score = 0;
    timeUp = false;
    startBtn.disabled = true;
    startBtn.textContent = '游戏中...';
    
    // 启动计时器
    let timeLeft = gameTime;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeBoard.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeUp = true;
            clearTimeout(moleTimeout);
            startBtn.disabled = false;
            startBtn.textContent = '游戏结束 - 重新开始';
            setTimeout(() => {
                alert(`游戏结束！你的最终得分是: ${score}`);
                startBtn.textContent = '开始游戏';
            }, 100);
        }
    }, 1000);
    
    // 开始地鼠出现
    peep();
}

function bonk(e) {
    if (!e.isTrusted) return; // 防止作弊
    
    const hole = this.parentNode;
    
    // 只有当地鼠处于升起状态且未被击中时才计分
    if (hole.classList.contains('up') && !hole.classList.contains('bonked')) {
        score++;
        this.parentNode.classList.add('bonked');
        scoreBoard.textContent = score;
        
        // 0.2秒后地鼠缩回
        setTimeout(() => {
            hole.classList.remove('up');
            hole.classList.remove('bonked');
        }, 200);
    }
}

holes.forEach(hole => {
    const mole = hole.querySelector('.mole');
    mole.addEventListener('click', bonk);
    hole.addEventListener('click', bonk);
});

startBtn.addEventListener('click', startGame);