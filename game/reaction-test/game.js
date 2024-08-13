const ReactionTest = {
    state: 'idle', startTime: 0, timeoutId: null,
    attempts: 0, times: [], maxAttempts: 5,
    
    init() {
        this.area = document.getElementById('test-area');
        this.area.addEventListener('click', () => this.handleClick());
        document.getElementById('start-btn').addEventListener('click', () => this.startTest());
    },
    
    startTest() {
        this.attempts = 0; this.times = [];
        this.updateUI();
        this.nextTest();
    },
    
    nextTest() {
        if (this.attempts >= this.maxAttempts) {
            this.showResults();
            return;
        }
        
        this.state = 'waiting';
        this.area.className = 'waiting';
        this.area.textContent = '等待变绿...';
        
        const delay = 1500 + Math.random() * 2000;
        this.timeoutId = setTimeout(() => {
            this.state = 'ready';
            this.area.className = 'ready';
            this.area.textContent = '点击!';
            this.startTime = Date.now();
        }, delay);
    },
    
    handleClick() {
        if (this.state === 'waiting') {
            clearTimeout(this.timeoutId);
            this.state = 'result';
            this.area.className = 'result';
            this.area.textContent = '太早了! 重新测试';
            setTimeout(() => this.nextTest(), 1500);
        } else if (this.state === 'ready') {
            const time = Date.now() - this.startTime;
            this.times.push(time);
            this.attempts++;
            this.updateUI();
            
            this.state = 'result';
            this.area.className = 'result';
            this.area.textContent = `${time}ms - 点击继续`;
            
            setTimeout(() => this.nextTest(), 1000);
        } else if (this.state === 'result' && this.attempts < this.maxAttempts) {
            this.nextTest();
        }
    },
    
    updateUI() {
        document.getElementById('attempts').textContent = this.attempts;
        if (this.times.length > 0) {
            const avg = Math.round(this.times.reduce((a, b) => a + b, 0) / this.times.length);
            document.getElementById('avg-time').textContent = avg;
        }
    },
    
    showResults() {
        const avg = Math.round(this.times.reduce((a, b) => a + b, 0) / this.times.length);
        this.state = 'idle';
        this.area.className = '';
        this.area.textContent = `测试完成! 平均反应时间: ${avg}ms`;
        
        const history = document.getElementById('history');
        history.innerHTML = this.times.map((t, i) => `<div class="history-item">第${i+1}次: ${t}ms</div>`).join('');
        
        const score = Math.max(1000 - avg, 10);
        ScoreBoard.showScoreBoard('reaction-test', score, () => this.startTest());
    }
};

document.addEventListener('DOMContentLoaded', () => ReactionTest.init());
