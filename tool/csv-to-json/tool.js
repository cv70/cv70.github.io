const CSVToJSON = {
    init() {
        this.inputText = document.getElementById('input-text');
        this.outputText = document.getElementById('output-text');
        this.statsSpan = document.getElementById('stats');
        
        document.getElementById('convert-btn').addEventListener('click', () => this.convert());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
        document.getElementById('download-btn').addEventListener('click', () => this.download());
        
        this.inputText.addEventListener('input', () => this.updateStats());
    },
    
    convert() {
        const csv = this.inputText.value;
        
        if (!csv.trim()) {
            this.outputText.value = '错误: 没有输入数据';
            return;
        }
        
        try {
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            const json = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const row = {};
                
                headers.forEach((header, i) => {
                    row[header] = values[i] || '';
                });
                
                return row;
            });
            
            this.outputText.value = JSON.stringify(json, null, 2);
        } catch (e) {
            this.outputText.value = '错误: ' + e.message;
        }
        
        this.updateStats();
    },
    
    copy() {
        const text = this.outputText.value;
        if (!text) return;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制结果', 1500);
        });
    },
    
    download() {
        const text = this.outputText.value;
        if (!text) return;
        
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    clear() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.updateStats();
    },
    
    updateStats() {
        const text = this.inputText.value;
        if (!text) {
            this.statsSpan.textContent = '字符: 0 | 行数: 0';
            return;
        }
        
        const chars = text.length;
        const lines = text.split('\n').length;
        this.statsSpan.textContent = `字符: ${chars} | 行数: ${lines}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CSVToJSON.init();
});
