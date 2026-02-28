const URLParamValidator = {
    init() {
        this.urlInput = document.getElementById('url-input');
        this.paramsContainer = document.getElementById('params-container');
        this.resultSection = document.getElementById('result-section');
        this.statusMessage = document.getElementById('status-message');
        
        document.getElementById('parse-btn').addEventListener('click', () => this.parseURL());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('remove-all-btn').addEventListener('click', () => this.removeAll());
        document.getElementById('sort-btn').addEventListener('click', () => this.sortParams());
    },
    
    parseURL() {
        const url = this.urlInput.value;
        
        if (!url) {
            this.showStatus('请输入 URL', 'error');
            return;
        }
        
        try {
            const urlObj = new URL(url);
            
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                this.showStatus('URL 需要以 http:// 或 https:// 开头');
                return;
            }
            
            const params = [];
            
            for (const [key, value] of urlObj.entries()) {
                params.push({
                    key,
                    value,
                    valid: true
                });
            }
            
            if (params.length === 0) {
                this.paramsContainer.innerHTML = '<p style="color: #666;">没有发现参数</p>';
            } else {
                this.paramsContainer.innerHTML = `<p>发现 ${params.length} 个参数:</p>';
                
                params.forEach((param, index) => {
                    const paramDiv = document.createElement('div');
                    paramDiv.className = 'param';
                    paramDiv.style.display = 'flex';
                    paramDiv.style.marginTop = '10px';
                    
                    paramDiv.innerHTML = `
                        <input type="text" value="${param.key}" placeholder="Key" style="width: 30%; padding: 5px; border: 1px solid #ddd; font-family: monospace; margin-right: 5px; font-size: 12px;"> =
                        <input type="text" value="${param.value}" placeholder="Value" style="width: 50%; padding: 5px; border: 1px solid #ddd; font-family: monospace; font-size: 12px;">
                        <button onclick="URLParamValidator.removeParam(${index})" style="padding: 5px 10px; margin: 0 5px; background-color: #f44336; color: white; border: none; cursor: pointer; border-radius: 4px;">删除</button>
                    `;
                    
                    this.paramsContainer.appendChild(paramDiv);
                });
                
                this.paramsContainer.innerHTML += `<p style="color: #666;">参数已复制到剪贴板</p>`;
            }
            
            this.resultSection.style.display = 'block';
            
        } catch (e) {
            this.showStatus('URL 格式无效: ' + e.message, 'error');
        }
    },
    
    removeParam(index) {
        const params = Array.from(this.paramsContainer.querySelectorAll('.param'));
        
        if (index >= 0 && index < params.length) {
            params[index].remove();
        }
    },
    
    copy() {
        const url = this.urlInput.value;
        if (!url) return;
        
        navigator.clipboard.writeText(url).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => {
                btn.textContent = '复制';
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1500);
        });
    },
    
    removeAll() {
        this.paramsContainer.innerHTML = '<p style="color: #666;">已清除所有参数</p>';
    },
    
    sortParams() {
        // TODO: Implement parameter sorting
    },
    
    clear() {
        this.urlInput.value = '';
        this.paramsContainer.innerHTML = '<p style="color: #666;">解析结果将显示在这里...</p>';
        this.resultSection.style.display = 'none';
    },
    
    showStatus(message, type) {
        this.statusMessage.textContent = message;
        if (type === 'error') {
            this.statusMessage.style.color = 'red';
        } else {
            this.statusMessage.style.color = 'green';
        }
        setTimeout(() => {
            this.statusMessage.textContent = '';
            this.statusMessage.style.color = 'green';
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    URLParamValidator.init();
});
