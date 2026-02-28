const PasswordGenerator = {
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
    upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',

    init() {
        this.history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
        this.elements = {
            lengthInput: document.getElementById('password-length'),
            includeLower: document.getElementById('include-lower'),
            includeUpper: document.getElementById('include-upper'),
            includeDigits: document.getElementById('include-digits'),
            includeSpecial: document.getElementById('include-special'),
            resultInput: document.getElementById('result'),
            generateBtn: document.getElementById('generate-btn'),
            copyBtn: document.getElementById('copy-btn'),
            historyList: document.getElementById('history-list'),
            clearHistoryBtn: document.getElementById('clear-history-btn'),
            history: document.getElementById('history'),
        };

        this.renderHistory();
        this.bindEvents();
    },

    bindEvents() {
        this.elements.generateBtn.addEventListener('click', () => this.generatePassword());
        this.elements.copyBtn.addEventListener('click', () => this.copyPassword();
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory();
    },

    generatePassword() {
        const length = parseInt(this.elements.lengthInput.value) || 16;
        let charset = '';
        if (this.elements.includeLower.checked) charset += this.lowerCase;
        if (this.elements.includeUpper.checked) charset += this.upperCase;
        if (this.elements.includeDigits.checked) charset += this.digits;
        if (this.elements.includeSpecial.checked) charset += this.specialChars;

        if (charset.length === 0) charset = this.lowerCase;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        this.elements.resultInput.value = password;
        this.addToHistory(password);
    },

    copyPassword() {
        const password = this.elements.resultInput.value;
        if (password) {
            navigator.clipboard.writeText(password);
            this.elements.copyBtn.textContent = '已复制';
            setTimeout(() => this.elements.copyBtn.textContent = '复制';
            this.addToHistory(password);
        }
    },

    addToHistory(password) {
        if (password && !this.history.includes(password)) {
            this.history.unshift(password);
            if (this.history.length > 10) this.history.pop();
            localStorage.setItem('passwordHistory', JSON.stringify(this.history));
            this.renderHistory();
        }
    },

    renderHistory() {
        const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
        this.elements.historyList.innerHTML = history.length
            ? history.map(password => `
                <div class="history-item">
                    <span>${password}</span>
                    <div class="actions">
                        <button onclick="PasswordGenerator.usePassword('${password}')">使用</button>
                        <button onclick="PasswordGenerator.removeHistoryItem(this)">删除</button>
                    </div>
                </div>`
            ).join('');
        this.elements.history.style.display = history.length ? 'block' : 'none';
    },

    usePassword(password) {
        this.elements.resultInput.value = password;
        this.elements.copyBtn.textContent = '已复制';
    },

    removeHistoryItem(element) {
        const password = element.parentElement.parentElement.firstElementChild.textContent;
        this.history = this.history.filter(item => item !== password);
        localStorage.setItem('passwordHistory', JSON.stringify(this.history));
        this.renderHistory();
    },

    clearHistory() {
        this.history = [];
        localStorage.removeItem('passwordHistory');
        this.renderHistory();
        this.elements.history.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    PasswordGenerator.init();
});