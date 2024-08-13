const TypingGame = {
    words: ['apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'lemon', 'cherry', 'melon', 'berry', 'robot', 'code', 'game', 'web', 'html', 'css', 'java', 'python', 'script', 'mouse', 'keyboard', 'screen', 'pixel', 'data', 'cloud', 'server', 'client', 'network', 'input', 'output'],
    currentWord: '', score: 0, correct: 0, total: 0, isRunning: false, startTime: 0,
    
    init() {
        this.display = document.getElementById('word-display');
        this.input = document.getElementById('word-input');
        this.input.addEventListener('input', () => this.check());
        this.input.addEventListener('keypress', e => { if (e.key === 'Enter') this.check(); });
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    },
    
    startGame() {
        this.score = 0; this.correct = 0; this.total = 0;
        this.isRunning = true; this.startTime = Date.now();
        this.updateUI();
        this.input.value = '';
        this.input.focus();
        this.nextWord();
    },
    
    nextWord() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.display.innerHTML = this.currentWord.split('').map(c => `<span>${c}</span>`).join('');
        this.input.value = '';
    },
    
    check() {
        if (!this.isRunning) return;
        
        const typed = this.input.value;
        this.total++;
        
        const spans = this.display.querySelectorAll('span');
        let allCorrect = true;
        
        spans.forEach((span, i) => {
            if (i < typed.length) {
                if (typed[i] === this.currentWord[i]) {
                    span.classList.add('correct');
                    span.classList.remove('wrong');
                } else {
                    span.classList.add('wrong');
                    span.classList.remove('correct');
                    allCorrect = false;
                }
            } else {
                span.classList.remove('correct', 'wrong');
            }
        });
        
        if (typed === this.currentWord) {
            this.correct++;
            this.score += this.currentWord.length * 10;
            this.updateUI();
            this.nextWord();
        }
        
        this.updateStats();
    },
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
    },
    
    updateStats() {
        const elapsed = (Date.now() - this.startTime) / 60000;
        const speed = elapsed > 0 ? Math.round(this.correct / elapsed) : 0;
        const accuracy = this.total > 0 ? Math.round((this.correct / this.total) * 100) : 100;
        
        document.getElementById('speed').textContent = speed;
        document.getElementById('accuracy').textContent = accuracy;
    },
    
    gameOver() {
        this.isRunning = false;
        ScoreBoard.showScoreBoard('typing', this.score, () => this.startGame());
    }
};

document.addEventListener('DOMContentLoaded', () => TypingGame.init());
