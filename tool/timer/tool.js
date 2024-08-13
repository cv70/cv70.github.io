const TimerApp = {
    stopwatchRunning: false,
    stopwatchTime: 0,
    stopwatchInterval: null,
    lapCount: 0,
    
    timerRunning: false,
    timerTime: 0,
    timerInterval: null,
    
    init() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        document.getElementById('start-stopwatch').addEventListener('click', () => this.toggleStopwatch());
        document.getElementById('lap-stopwatch').addEventListener('click', () => this.addLap());
        document.getElementById('reset-stopwatch').addEventListener('click', () => this.resetStopwatch());
        
        document.getElementById('start-timer').addEventListener('click', () => this.startTimer());
        document.getElementById('pause-timer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('reset-timer').addEventListener('click', () => this.resetTimer());
        
        document.querySelectorAll('.presets button').forEach(btn => {
            btn.addEventListener('click', () => this.setPreset(btn.dataset.time));
        });
    },
    
    switchTab(tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        document.getElementById(tab).style.display = 'block';
    },
    
    toggleStopwatch() {
        if (this.stopwatchRunning) {
            clearInterval(this.stopwatchInterval);
            document.getElementById('start-stopwatch').textContent = '继续';
        } else {
            this.stopwatchInterval = setInterval(() => {
                this.stopwatchTime += 10;
                this.updateStopwatchDisplay();
            }, 10);
            document.getElementById('start-stopwatch').textContent = '暂停';
        }
        this.stopwatchRunning = !this.stopwatchRunning;
    },
    
    updateStopwatchDisplay() {
        const ms = Math.floor((this.stopwatchTime % 1000) / 10);
        const s = Math.floor((this.stopwatchTime / 1000) % 60);
        const m = Math.floor((this.stopwatchTime / 60000) % 60);
        const h = Math.floor(this.stopwatchTime / 3600000);
        document.getElementById('stopwatch-display').textContent = 
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },
    
    addLap() {
        if (!this.stopwatchRunning && this.stopwatchTime === 0) return;
        this.lapCount++;
        const laps = document.getElementById('laps');
        laps.innerHTML = `<div class="lap-item"><span>计次 ${this.lapCount}</span><span>${document.getElementById('stopwatch-display').textContent}</span></div>` + laps.innerHTML;
    },
    
    resetStopwatch() {
        clearInterval(this.stopwatchInterval);
        this.stopwatchRunning = false;
        this.stopwatchTime = 0;
        this.lapCount = 0;
        this.updateStopwatchDisplay();
        document.getElementById('start-stopwatch').textContent = '开始';
        document.getElementById('laps').innerHTML = '';
    },
    
    setPreset(seconds) {
        this.timerTime = parseInt(seconds) * 1000;
        this.updateTimerDisplay();
    },
    
    startTimer() {
        if (this.timerRunning) return;
        if (this.timerTime === 0) {
            const min = parseInt(document.getElementById('timer-min').value) || 0;
            const sec = parseInt(document.getElementById('timer-sec').value) || 0;
            this.timerTime = (min * 60 + sec) * 1000;
        }
        this.timerRunning = true;
        this.timerInterval = setInterval(() => {
            this.timerTime -= 1000;
            this.updateTimerDisplay();
            if (this.timerTime <= 0) {
                this.pauseTimer();
                alert('时间到！');
            }
        }, 1000);
    },
    
    pauseTimer() {
        clearInterval(this.timerInterval);
        this.timerRunning = false;
    },
    
    resetTimer() {
        this.pauseTimer();
        this.timerTime = 0;
        this.updateTimerDisplay();
        document.getElementById('timer-min').value = 5;
        document.getElementById('timer-sec').value = 0;
    },
    
    updateTimerDisplay() {
        const sec = Math.floor((this.timerTime / 1000) % 60);
        const m = Math.floor((this.timerTime / 60000));
        document.getElementById('timer-display').textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
};

document.addEventListener('DOMContentLoaded', () => TimerApp.init());
