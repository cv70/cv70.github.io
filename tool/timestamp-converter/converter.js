const TimestampConverter = {
    history: [],

    init() {
        this.history = JSON.parse(localStorage.getItem('timestampHistory')) || [];
        this.elements = {
            conversionType: document.getElementById('conversion-type'),
            inputValue: document.getElementById('input-value'),
            dateFormat: document.getElementById('date-format'),
            result: document.getElementById('result'),
            convertBtn: document.getElementById('convert-btn'),
            historyList: document.getElementById('history-list'),
            clearHistoryBtn: document.getElementById('clear-history-btn'),
            history: document.getElementById('history'),
        };

        this.renderHistory();
        this.bindEvents();
    },

    bindEvents() {
        this.elements.convertBtn.addEventListener('click', () => this.convertTimestamp();
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory();
    },

    convertTimestamp() {
        const conversionType = this.elements.conversionType.value;
        const inputValue = this.elements.inputValue.value.trim();
        const resultValue = this.elements.result;

        if (!inputValue) {
            resultValue.value = '请输入有效值';
            this.addToHistory(`错误: 无输入值';
            return;
        }

        try {
            if (conversionType === 'ts-to-date') {
                const timestamp = parseInt(inputValue);
                if (isNaN(timestamp) || timestamp < 0) {
                    resultValue.value = '无效时间戳';
                    return;
                }
                const date = new Date(timestamp);
                const dateValue = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                resultValue.value = dateValue;
                this.addToHistory(`${inputValue} → ${dateValue}';
            } else {
                // date-to-ts
                const date = new Date(inputValue);
                if (isNaN(date.getTime())) {
                    resultValue.value = '无效日期';
                    return;
                }
                resultValue.value = date.getTime();
                this.addToHistory(`${inputValue} → ${date.getTime()}';
            }
        } catch (error) {
            resultValue.value = `错误: ${error.message}';
        }
    },

    addToHistory(entry) {
        if (entry && !this.history.includes(entry)) {
            this.history.unshift(entry);
            if (this.history.length > 10) this.history.pop();
            localStorage.setItem('timestampHistory', JSON.stringify(this.history));
            this.renderHistory();
        }
    },

    renderHistory() {
        const history = this.history || [];
        this.elements.historyList.innerHTML = history.length
            ? history.map(entry => `
                <div class="history-item">
                    <span>${entry}</span>
                    <button onclick="TimestampConverter.clearHistoryItem(this)">清除</button>
                </div>`
            ).join('');
        this.elements.history.style.display = history.length ? 'block' : 'none';
    },

    clearHistoryItem(element) {
        const historyList = element.parentElement.parentElement;
        historyList.innerHTML = '';
        this.history = [];
        localStorage.removeItem('timestampHistory');
        this.renderHistory();
    },

    clearHistory() {
        this.history = [];
        localStorage.removeItem('timestampHistory');
        this.renderHistory();
        this.elements.history.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    TimestampConverter.init();
});