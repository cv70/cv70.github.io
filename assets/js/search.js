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
        { title: '数独', url: '/game/sudoku/', category: '游戏', desc: '经典数独益智游戏' },
        { title: '推箱子', url: '/game/sokoban/', category: '游戏', desc: '经典推箱子益智游戏' },
        { title: '序列记忆', url: '/game/sequence-memory.html', category: '游戏', desc: '数字序列记忆训练' },
        { title: '视觉记忆', url: '/game/visual-memory.html', category: '游戏', desc: '视觉记忆训练游戏' },
        { title: 'JSON 工具', url: '/tool/json/', category: '工具', desc: 'JSON 格式化、验证、压缩' },
        { title: 'HTML 工具', url: '/tool/html/', category: '工具', desc: 'HTML 编码解码工具' },
        { title: 'Markdown 工具', url: '/tool/md/', category: '工具', desc: 'Markdown 编辑预览工具' },
        { title: '密码生成器', url: '/tool/password/', category: '工具', desc: '随机安全密码生成' },
        { title: '二维码生成器', url: '/tool/qrcode/', category: '工具', desc: '文本生成二维码' },
        { title: '颜色转换器', url: '/tool/color/', category: '工具', desc: 'HEX/RGB/HSL 颜色互转' },
        { title: '时间戳转换', url: '/tool/timestamp/', category: '工具', desc: 'Unix 时间戳转换' },
        { title: 'Base64 编码', url: '/tool/base64/', category: '工具', desc: 'Base64 编码解码' },
        { title: 'URL 编码', url: '/tool/url-encode/', category: '工具', desc: 'URL 编码解码工具' },
        { title: 'UUID 生成器', url: '/tool/uuid/', category: '工具', desc: '生成唯一标识符' },
        { title: '计算器', url: '/tool/calculator/', category: '工具', desc: '基础和科学计算器' },
        { title: '随机数生成器', url: '/tool/random/', category: '工具', desc: '随机数生成工具' },
        { title: '计时器', url: '/tool/timer/', category: '工具', desc: '计时器和秒表工具' },
        { title: '文本统计', url: '/tool/text-stats/', category: '工具', desc: '文本字数统计工具' },
        { title: '大小写转换', url: '/tool/case-convert/', category: '工具', desc: '文本大小写转换工具' },
        { title: 'CSV 转 JSON', url: '/tool/csv-to-json/', category: '工具', desc: 'CSV 数据转 JSON' },
        { title: 'SQL 格式化', url: '/tool/sql-formatter/', category: '工具', desc: 'SQL 语句格式化' },
        { title: 'JSON 代码生成', url: '/tool/json-to-code/', category: '工具', desc: 'JSON 转代码工具' },
        { title: 'AI应用开发修炼手册', url: '/course/ai-app-dev/', category: '课程', desc: '从零到实战的AI开发课程' },
        { title: 'AI产品经理修炼手册', url: '/course/ai-pm/', category: '课程', desc: '从产品思维到AI落地的全能型AI产品经理课程' },
        { title: '全栈应用开发修炼手册', url: '/course/node-ts-fullstack/', category: '课程', desc: 'TypeScript + NestJS 全栈课程' },
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
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const input = document.getElementById('global-search');
        const results = document.getElementById('search-results');

        if (!input || !results) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                this.showResults(query, results);
            } else {
                results.style.display = 'none';
            }
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length > 0) {
                this.showResults(input.value.trim(), results);
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#global-search') && !e.target.closest('#search-results')) {
                results.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
                input.select();
            }
            if (e.key === 'Escape') {
                results.style.display = 'none';
                input.blur();
            }
        });
    },

    showResults(query, resultsEl) {
        const items = this.search(query);

        if (items.length === 0) {
            resultsEl.innerHTML = '<div class="search-no-result">没有找到相关内容</div>';
        } else {
            resultsEl.innerHTML = items.map(item => `
                <a href="${item.url}" class="search-result-item">
                    <div class="search-result-title">
                        ${this.highlight(item.title, query)}
                        <span class="search-result-category">${item.category}</span>
                    </div>
                    <div class="search-result-desc">${this.highlight(item.desc, query)}</div>
                </a>
            `).join('');
        }

        resultsEl.style.display = 'block';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SearchEngine.init();
});

window.SearchEngine = SearchEngine;
