const MemoryMatch = {
    emojis: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🥑', '🍑', '🥥', '🍋'],
    cards: [], flipped: [], matched: 0, moves: 0, timer: 0, interval: null,
    
    init() {
        this.board = document.getElementById('game-board');
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('difficulty').addEventListener('change', () => this.newGame());
        this.newGame();
    },
    
    newGame() {
        this.stopTimer();
        this.moves = 0; this.matched = 0; this.timer = 0; this.flipped = [];
        document.getElementById('moves').textContent = '0';
        document.getElementById('time').textContent = '00:00';
        
        const pairs = parseInt(document.getElementById('difficulty').value);
        const selected = this.emojis.slice(0, pairs);
        this.cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
        
        const cols = pairs <= 6 ? 4 : 5;
        this.board.style.gridTemplateColumns = `repeat(${cols}, 70px)`;
        this.board.innerHTML = '';
        
        this.cards.forEach((emoji, i) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = i;
            card.textContent = '?';
            card.addEventListener('click', () => this.flip(card, i));
            this.board.appendChild(card);
        });
        
        this.startTimer();
    },
    
    flip(card, index) {
        if (this.flipped.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        card.textContent = this.cards[index];
        this.flipped.push({ card, index });
        
        if (this.flipped.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            this.checkMatch();
        }
    },
    
    checkMatch() {
        const [a, b] = this.flipped;
        
        if (this.cards[a.index] === this.cards[b.index]) {
            a.card.classList.add('matched');
            b.card.classList.add('matched');
            this.matched++;
            this.flipped = [];
            
            if (this.matched === this.cards.length / 2) {
                this.stopTimer();
                const score = Math.max(1000 - this.moves * 10 - this.timer, 10);
                setTimeout(() => ScoreBoard.showScoreBoard('memory-match', score, () => this.newGame()), 500);
            }
        } else {
            setTimeout(() => {
                a.card.classList.remove('flipped');
                b.card.classList.remove('flipped');
                a.card.textContent = '?';
                b.card.textContent = '?';
                this.flipped = [];
            }, 800);
        }
    },
    
    startTimer() {
        this.interval = setInterval(() => {
            this.timer++;
            const m = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const s = (this.timer % 60).toString().padStart(2, '0');
            document.getElementById('time').textContent = `${m}:${s}`;
        }, 1000);
    },
    
    stopTimer() {
        if (this.interval) clearInterval(this.interval);
    }
};

document.addEventListener('DOMContentLoaded', () => MemoryMatch.init());
