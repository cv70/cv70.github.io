const Calculator = {
    display: '',
    history: [],
    
    init() {
        this.displayEl = document.getElementById('display');
        this.historyList = document.getElementById('history-list');
        
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleClick(btn.dataset.value));
        });
        
        document.addEventListener('keydown', (e) => this.handleKey(e));
        document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
    },
    
    handleClick(value) {
        switch (value) {
            case 'clear': this.display = ''; break;
            case 'backspace': this.display = this.display.slice(0, -1); break;
            case '=': this.calculate(); break;
            case 'sqrt': this.display = Math.sqrt(eval(this.display) || 0).toString(); break;
            default: this.display += value;
        }
        this.updateDisplay();
    },
    
    handleKey(e) {
        if (/[\d\+\-\*\/\.\%]/.test(e.key)) this.handleClick(e.key);
        if (e.key === 'Enter') this.calculate();
        if (e.key === 'Backspace') this.handleClick('backspace');
        if (e.key === 'Escape') this.handleClick('clear');
    },
    
    calculate() {
        try {
            const result = eval(this.display);
            if (!isNaN(result)) {
                this.history.push(`${this.display} = ${result}`);
                this.display = result.toString();
                this.updateDisplay();
                this.updateHistory();
            }
        } catch (e) {
            this.display = 'Error';
            this.updateDisplay();
            setTimeout(() => { this.display = ''; this.updateDisplay(); }, 1500);
        }
    },
    
    updateDisplay() {
        this.displayEl.value = this.display;
    },
    
    updateHistory() {
        this.historyList.innerHTML = this.history.slice(-10).reverse().map(h => `<div class="history-item">${h}</div>`).join('');
    },
    
    clearHistory() {
        this.history = [];
        this.historyList.innerHTML = '';
    }
};

document.addEventListener('DOMContentLoaded', () => Calculator.init());
