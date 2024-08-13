const SearchEngine = {
    data: [
        { title: '贪吃蛇', url: '/game/snake/', category: '游戏', desc: '经典贪吃蛇游戏，控制蛇吃食物' },
        { title: '2048', url: '/game/2048/', category: '游戏', desc: '经典数字消除游戏，合并相同数字' },
        { title: '俄罗斯方块', url: '/game/tetris/', category: '游戏', desc: '经典俄罗斯方块游戏' },
        { title: '飞机大战', url: '/game/plane/', category: '游戏', desc: '射击类飞机大战游戏' },
        { title: '五子棋', url: '/game/five-chess/', category: '游戏', desc: '经典五子棋对弈游戏' },
        { title: '打地鼠', url: '/game/gopher-mole/', category: '游戏', desc: '打地鼠趣味游戏' },
        { title: '连线画布', url: '/game/canvas/', category: '游戏', desc: '创意连线画布工具' },
        { title: '扫雷', url: '/game/minesweeper/', category: '游戏', desc: '经典扫雷逻辑游戏' },
        { title: '打砖块', url: '/game/breakout/', category: '游戏', desc: '经典弹球打砖块游戏' },
        { title: '井字棋', url: '/game/tictactoe/', category: '游戏', desc: '简单井字棋双人游戏' },
        { title: '滑块拼图', url: '/game/slide-puzzle/', category: '游戏', desc: '益智滑块拼图游戏' },
        { title: '接金币', url: '/game/catch-coins/', category: '游戏', desc: '接金币游戏，接炸弹扣分' },
        { title: '反应测试', url: '/game/reaction-test/', category: '游戏', desc: '测试反应速度游戏' },
        { title: '记忆匹配', url: '/game/memory-match/', category: '游戏', desc: '翻牌配对记忆游戏' },
        { title: '打字游戏', url: '/game/typing/', category: '游戏', desc: '打字练习游戏' },
        { title: 'JSON 工具', url: '/tool/json/', category: '工具', desc: 'JSON 格式化、验证、压缩' },
        { title: 'HTML 工具', url: '/tool/html/', category: '工具', desc: 'HTML 编码解码工具' },
        { title: 'Markdown 工具', url: '/tool/md/', category: '工具', desc: 'Markdown 编辑预览工具' },
        { title: '密码生成器', url: '/tool/password/', category: '工具', desc: '随机安全密码生成' },
        { title: '二维码生成器', url: '/tool/qrcode/', category: '工具', desc: '文本生成二维码' },
        { title: '颜色转换器', url: '/tool/color/', category: '工具', desc: 'HEX/RGB/HSL 颜色互转' },
        { title: '时间戳转换', url: '/tool/timestamp/', category: '工具', desc: 'Unix 时间戳转换' },
        { title: 'Base64 编码', url: '/tool/base64/', category: '工具', desc: 'Base64 编码解码' },
        { title: 'URL 编码', url: '/tool/url-encode/', category: '工具', desc: 'URL 编码解码工具' },
        { title: '计算器', url: '/tool/calculator/', category: '工具', desc: '基础和科学计算器' },
        { title: '随机数生成器', url: '/tool/random/', category: '工具', desc: '随机数生成工具' },
        { title: '计时器', url: '/tool/timer/', category: '工具', desc: '计时器和秒表工具' },
        { title: '文本统计', url: '/tool/text-stats/', category: '工具', desc: '文本字数统计工具' },
        { title: '大小写转换', url: '/tool/case-convert/', category: '工具', desc: '文本大小写转换工具' },
    ],
    
    search(query) {
        if (!query || query.length < 1) return [];
        const q = query.toLowerCase();
        return this.data.filter(item => 
            item.title.toLowerCase().includes(q) || 
            item.desc.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
    },
    
    highlight(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },
    
    init() {
        this.createSearchUI();
        this.bindEvents();
    },
    
    createSearchUI() {
        const searchBox = document.createElement('div');
        searchBox.id = 'search-container';
        searchBox.innerHTML = `
            <div class="search-wrapper">
                <input type="text" id="global-search" placeholder="搜索游戏或工具... (Ctrl+K)" autocomplete="off">
                <button id="search-btn">🔍</button>
            </div>
            <div id="search-results"></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            #search-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 999;
                width: 320px;
            }
            .search-wrapper {
                display: flex;
                gap: 8px;
            }
            #global-search {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #ddd;
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s;
                background: #fff;
            }
            #global-search:focus {
                border-color: #3498db;
                box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
            }
            .dark-mode #global-search {
                background: #2c3e50;
                border-color: #34495e;
                color: #ecf0f1;
            }
            #search-btn {
                padding: 12px 16px;
                border: none;
                border-radius: 50%;
                background: #3498db;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }
            #search-btn:hover {
                background: #2980b9;
            }
            #search-results {
                display: none;
                position: absolute;
                top: 50px;
                left: 0;
                right: 0;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                max-height: 400px;
                overflow-y: auto;
            }
            .dark-mode #search-results {
                background: #2c3e50;
            }
            .search-result-item {
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                transition: background 0.2s;
            }
            .dark-mode .search-result-item {
                border-bottom-color: #34495e;
            }
            .search-result-item:hover {
                background: #f8f9fa;
            }
            .dark-mode .search-result-item:hover {
                background: #34495e;
            }
            .search-result-item:last-child {
                border-bottom: none;
            }
            .search-result-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 4px;
            }
            .dark-mode .search-result-title {
                color: #ecf0f1;
            }
            .search-result-title mark {
                background: #fff3cd;
                color: #333;
                padding: 0 2px;
                border-radius: 2px;
            }
            .search-result-desc {
                font-size: 12px;
                color: #7f8c8d;
            }
            .search-result-category {
                display: inline-block;
                font-size: 10px;
                padding: 2px 8px;
                background: #3498db;
                color: white;
                border-radius: 10px;
                margin-left: 8px;
            }
            .search-no-result {
                padding: 20px;
                text-align: center;
                color: #7f8c8d;
            }
            @media (max-width: 768px) {
                #search-container {
                    top: 60px;
                    right: 10px;
                    left: 10px;
                    width: auto;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(searchBox);
    },
    
    bindEvents() {
        const input = document.getElementById('global-search');
        const results = document.getElementById('search-results');
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                this.showResults(query);
            } else {
                results.style.display = 'none';
            }
        });
        
        input.addEventListener('focus', () => {
            if (input.value.trim().length > 0) {
                this.showResults(input.value.trim());
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#search-container')) {
                results.style.display = 'none';
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
            }
            if (e.key === 'Escape') {
                results.style.display = 'none';
                input.blur();
            }
        });
    },
    
    showResults(query) {
        const results = document.getElementById('search-results');
        const items = this.search(query);
        
        if (items.length === 0) {
            results.innerHTML = '<div class="search-no-result">没有找到相关内容</div>';
        } else {
            results.innerHTML = items.map(item => `
                <a href="${item.url}" class="search-result-item">
                    <div class="search-result-title">
                        ${this.highlight(item.title, query)}
                        <span class="search-result-category">${item.category}</span>
                    </div>
                    <div class="search-result-desc">${this.highlight(item.desc, query)}</div>
                </a>
            `).join('');
        }
        
        results.style.display = 'block';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SearchEngine.init();
});

window.SearchEngine = SearchEngine;
