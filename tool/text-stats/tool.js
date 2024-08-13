const TextStats = {
    init() {
        const input = document.getElementById('text-input');
        input.addEventListener('input', () => this.calculate());
        this.calculate();
    },
    
    calculate() {
        const text = document.getElementById('text-input').value;
        
        document.getElementById('char-with-space').textContent = text.length;
        document.getElementById('char-no-space').textContent = text.replace(/\s/g, '').length;
        
        const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        document.getElementById('chinese-count').textContent = chinese;
        
        const english = (text.match(/[a-zA-Z]/g) || []).length;
        document.getElementById('english-count').textContent = english;
        
        const numbers = (text.match(/\d/g) || []).length;
        document.getElementById('number-count').textContent = numbers;
        
        const lines = text.split('\n').length;
        document.getElementById('line-count').textContent = lines;
        
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
        document.getElementById('paragraph-count').textContent = paragraphs;
        
        const sentences = (text.match(/[.!?。！？]+/g) || []).length || (text.trim() ? 1 : 0);
        document.getElementById('sentence-count').textContent = sentences;
    }
};

document.addEventListener('DOMContentLoaded', () => TextStats.init());
