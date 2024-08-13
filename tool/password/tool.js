const PasswordGenerator = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: '0O1lI',
    
    init() {
        this.lengthInput = document.getElementById('length');
        this.lengthValue = document.getElementById('length-value');
        this.output = document.getElementById('password-output');
        this.strengthFill = document.getElementById('strength-fill');
        this.strengthText = document.getElementById('strength-text');
        
        this.bindEvents();
        this.generate();
    },
    
    bindEvents() {
        document.getElementById('generate-btn').addEventListener('click', () => this.generate());
        document.getElementById('regenerate-btn').addEventListener('click', () => this.generate());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        
        this.lengthInput.addEventListener('input', (e) => {
            this.lengthValue.textContent = e.target.value;
            this.generate();
        });
        
        ['use-uppercase', 'use-lowercase', 'use-numbers', 'use-symbols', 'exclude-ambiguous'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.generate());
        });
    },
    
    generate() {
        let chars = '';
        
        if (document.getElementById('use-uppercase').checked) {
            chars += this.uppercase;
        }
        if (document.getElementById('use-lowercase').checked) {
            chars += this.lowercase;
        }
        if (document.getElementById('use-numbers').checked) {
            chars += this.numbers;
        }
        if (document.getElementById('use-symbols').checked) {
            chars += this.symbols;
        }
        
        if (chars === '') {
            this.output.value = '';
            this.updateStrength(0);
            return;
        }
        
        if (document.getElementById('exclude-ambiguous').checked) {
            chars = chars.split('').filter(c => !this.ambiguous.includes(c)).join('');
        }
        
        const length = parseInt(this.lengthInput.value);
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        this.output.value = password;
        this.updateStrength(this.calculateStrength(password));
    },
    
    calculateStrength(password) {
        if (password.length === 0) return 0;
        
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;
        
        return score;
    },
    
    updateStrength(score) {
        this.strengthFill.className = '';
        
        if (score <= 2) {
            this.strengthFill.classList.add('weak');
            this.strengthText.textContent = '密码强度: 弱';
            this.strengthText.style.color = '#e74c3c';
        } else if (score <= 4) {
            this.strengthFill.classList.add('medium');
            this.strengthText.textContent = '密码强度: 中等';
            this.strengthText.style.color = '#f39c12';
        } else if (score <= 5) {
            this.strengthFill.classList.add('strong');
            this.strengthText.textContent = '密码强度: 强';
            this.strengthText.style.color = '#2ecc71';
        } else {
            this.strengthFill.classList.add('very-strong');
            this.strengthText.textContent = '密码强度: 非常强';
            this.strengthText.style.color = '#27ae60';
        }
    },
    
    copy() {
        const password = this.output.value;
        if (!password) return;
        
        navigator.clipboard.writeText(password).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '✓';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = '📋';
                btn.classList.remove('copied');
            }, 1500);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    PasswordGenerator.init();
});
