const UUIDGenerator = {
    init() {
        this.countInput = document.getElementById('count');
        this.bracesCheckbox = document.getElementById('braces');
        this.uppercaseCheckbox = document.getElementById('uppercase');
        this.resultText = document.getElementById('result');
        
        document.getElementById('generate-btn').addEventListener('click', () => this.generate());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('download-btn').addEventListener('click', () => this.download());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
    },
    
    generate() {
        const count = parseInt(this.countInput.value) || 1;
        const includeBraces = this.bracesCheckbox.checked;
        const uppercase = this.uppercaseCheckbox.checked;
        
        const uuids = [];
        
        for (let i = 0; i < count; i++) {
            let uuid = 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            
            if (!includeBraces) {
                uuid = uuid.replace(/[{}]/g, '');
            }
            
            if (uppercase) {
                uuid = uuid.toUpperCase();
            }
            
            uuids.push(uuid);
        }
        
        this.resultText.value = uuids.join('\n');
    },
    
    copy() {
        const text = this.resultText.value;
        if (!text) return;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制结果', 1500);
        });
    },
    
    download() {
        const text = this.resultText.value;
        if (!text) return;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uuids.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    clear() {
        this.countInput.value = 10;
        this.bracesCheckbox.checked = true;
        this.uppercaseCheckbox.checked = false;
        this.resultText.value = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UUIDGenerator.init();
});
