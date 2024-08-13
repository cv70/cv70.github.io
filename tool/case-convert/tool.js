const CaseConverter = {
    init() {
        this.input = document.getElementById('input-text');
        this.output = document.getElementById('output-text');
        
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => this.convert(btn.dataset.action));
        });
        
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('clear-btn').addEventListener('click', () => { this.input.value = ''; this.output.value = ''; });
    },
    
    convert(action) {
        const text = this.input.value;
        if (!text) return;
        
        let result;
        switch (action) {
            case 'upper': result = text.toUpperCase(); break;
            case 'lower': result = text.toLowerCase(); break;
            case 'title': result = text.replace(/\b\w/g, c => c.toUpperCase()); break;
            case 'toggle': result = text.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''); break;
            case 'sentence': result = text.toLowerCase().replace(/(^\s*|[.!?。！？]\s+)([a-z])/g, (m, p, c) => p + c.toUpperCase()); break;
        }
        this.output.value = result;
    },
    
    copy() {
        if (!this.output.value) return;
        navigator.clipboard.writeText(this.output.value).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制结果', 1500);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => CaseConverter.init());
