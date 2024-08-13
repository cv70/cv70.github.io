const RandomGenerator = {
    init() {
        document.getElementById('generate-btn').addEventListener('click', () => this.generate());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
    },
    
    generate() {
        const min = parseInt(document.getElementById('min-value').value) || 1;
        const max = parseInt(document.getElementById('max-value').value) || 100;
        const count = parseInt(document.getElementById('count').value) || 1;
        const unique = document.getElementById('unique').checked;
        const sort = document.getElementById('sort').checked;
        
        if (min > max) { alert('最小值不能大于最大值'); return; }
        if (unique && count > max - min + 1) { alert('不重复模式下，数量不能超过范围'); return; }
        
        let numbers = [];
        if (unique) {
            const pool = [];
            for (let i = min; i <= max; i++) pool.push(i);
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * pool.length);
                numbers.push(pool.splice(idx, 1)[0]);
            }
        } else {
            for (let i = 0; i < count; i++) {
                numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
            }
        }
        
        if (sort) numbers.sort((a, b) => a - b);
        
        document.getElementById('result').value = numbers.join('\n');
    },
    
    copy() {
        const text = document.getElementById('result').value;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制结果', 1500);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => RandomGenerator.init());
