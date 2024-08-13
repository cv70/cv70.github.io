const Base64Tool = {
    init() {
        this.inputText = document.getElementById('input-text');
        this.outputText = document.getElementById('output-text');
        
        document.getElementById('encode-btn').addEventListener('click', () => this.encode());
        document.getElementById('decode-btn').addEventListener('click', () => this.decode());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
    },
    
    encode() {
        const text = this.inputText.value;
        if (!text) {
            alert('请输入要编码的文本');
            return;
        }
        try {
            this.outputText.value = btoa(unescape(encodeURIComponent(text)));
        } catch (e) {
            alert('编码失败: ' + e.message);
        }
    },
    
    decode() {
        const text = this.inputText.value;
        if (!text) {
            alert('请输入要解码的Base64字符串');
            return;
        }
        try {
            this.outputText.value = decodeURIComponent(escape(atob(text)));
        } catch (e) {
            alert('解码失败: 无效的Base64字符串');
        }
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
    
    clear() {
        this.inputText.value = '';
        this.outputText.value = '';
    }
};

document.addEventListener('DOMContentLoaded', () => Base64Tool.init());
