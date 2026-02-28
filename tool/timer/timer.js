const Timer = {
    timerId: null,
    startTime: null,
    elapsedTime: 0,
    isRunning: false,
    isCountdown: false,
    remainingTime: 0,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('start-countdown-btn').addEventListener('click', () => this.startCountdown());
        document.getElementById('clear-history-btn').addEventListener('click', () => this.clearHistory());
        document.getElementById('countdown-hours').addEventListener('input', () => this.updateRemainingDisplay());
        document.getElementById('countdown-minutes').addEventListener('input', () => this.updateRemainingDisplay());
        document.getElementById('countdown-seconds').addEventListener('input', () => this.updateRemainingDisplay());
        document.getElementById('countdown-hours').addEventListener('keydown', (e) => this.handleNumberInput(e, 'hours'));
        document.getElementById('countdown-minutes').addEventListener('keydown', (e) => this.handleNumberInput(e, 'minutes'));
        document.getElementById('countdown-seconds').addEventListener('keydown', (e) => this.handleNumberInput(e, 'seconds'));
    },

    start() {
        if (this.isRunning) return;
        
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        this.updateButtons();
        
        this.timerId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
            this.updateRemainingDisplay();
        }, 10);
    },

    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.elapsedTime = Date.now() - this.startTime;
        this.updateButtons();
    },

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.updateDisplay();
        document.getElementById('timer-label').textContent = '秒表';
    },

    startCountdown() {
        this.pause();
        
        const hours = parseInt(document.getElementById('countdown-hours').value) || 0;
        const minutes = parseInt(document.getElementById('countdown-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('countdown-seconds').value) || 0;
        
        this.remainingTime = (hours * 3600) + (minutes * 60) + seconds;
        
        if (this.remainingTime <= 0) {
            alert('请输入有效时间');
            return;
        }
        
        this.isCountdown = true;
        this.isRunning = true;
        this.startTime = Date.now();
        this.updateButtons();
        
        this.timerId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.remainingTime -= 0.01;
            
            if (this.remainingTime <= 0) {
                this.pause();
                alert('⏰ 时间到！');
                this.remainingTime = 0;
            }
            
            this.updateDisplay();
            this.updateRemainingDisplay();
        }, 10);
    },

    updateDisplay() {
        const totalSeconds = this.elapsedTime / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);
        
        document.getElementById('time').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    },

    updateRemainingDisplay() {
        if (!this.isCountdown) {
            document.getElementById('timer-label').textContent = '倒计时';
            document.getElementById('timer-label').textContent += ` 剩余: ' + this.formatRemainingTime(this.remainingTime);
        }
    },

    formatRemainingTime(time) {
        const totalSeconds = Math.ceil(time);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    updateButtons() {
        document.getElementById('start-btn').disabled = this.isRunning;
        document.getElementById('pause-btn').disabled = !this.isRunning;
        document.getElementById('reset-btn').disabled = !this.isRunning;
    },

    clearHistory() {
        document.getElementById('history-list').innerHTML = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Timer.init();
});
