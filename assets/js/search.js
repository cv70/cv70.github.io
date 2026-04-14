// FlexSearch Search Engine
const SearchEngine = {
    index: null,
    data: [
        { id: 0, title: '贪吃蛇', url: '/game/snake/', category: '游戏', desc: '经典贪吃蛇游戏，控制蛇吃食物' },
        { id: 1, title: '2048', url: '/game/2048/', category: '游戏', desc: '经典数字消除游戏，合并相同数字' },
        { id: 2, title: '俄罗斯方块', url: '/game/tetris/', category: '游戏', desc: '经典俄罗斯方块游戏' },
        { id: 3, title: '飞机大战', url: '/game/plane/', category: '游戏', desc: '射击类飞机大战游戏' },
        { id: 4, title: '五子棋', url: '/game/five-chess/', category: '游戏', desc: '经典五子棋对弈游戏' },
        { id: 5, title: '打地鼠', url: '/game/gopher-mole/', category: '游戏', desc: '打地鼠趣味游戏' },
        { id: 6, title: '连线画布', url: '/game/canvas/', category: '游戏', desc: '创意连线画布工具' },
        { id: 7, title: '扫雷', url: '/game/minesweeper/', category: '游戏', desc: '经典扫雷逻辑游戏' },
        { id: 8, title: '打砖块', url: '/game/breakout/', category: '游戏', desc: '经典弹球打砖块游戏' },
        { id: 9, title: '井字棋', url: '/game/tictactoe/', category: '游戏', desc: '简单井字棋双人游戏' },
        { id: 10, title: '滑块拼图', url: '/game/slide-puzzle/', category: '游戏', desc: '益智滑块拼图游戏' },
        { id: 11, title: '接金币', url: '/game/catch-coins/', category: '游戏', desc: '接金币游戏，接炸弹扣分' },
        { id: 12, title: '反应测试', url: '/game/reaction-test/', category: '游戏', desc: '测试反应速度游戏' },
        { id: 13, title: '记忆匹配', url: '/game/memory-match/', category: '游戏', desc: '翻牌配对记忆游戏' },
        { id: 14, title: '打字游戏', url: '/game/typing/', category: '游戏', desc: '打字练习游戏' },
        { id: 15, title: '数独', url: '/game/sudoku/', category: '游戏', desc: '经典数独益智游戏' },
        { id: 16, title: '推箱子', url: '/game/sokoban/', category: '游戏', desc: '经典推箱子益智游戏' },
        { id: 17, title: '序列记忆', url: '/game/sequence-memory.html', category: '游戏', desc: '数字序列记忆训练' },
        { id: 18, title: '视觉记忆', url: '/game/visual-memory.html', category: '游戏', desc: '视觉记忆训练游戏' },
        { id: 19, title: 'JSON 工具', url: '/tool/json/', category: '工具', desc: 'JSON 格式化、验证、压缩' },
        { id: 20, title: 'HTML 工具', url: '/tool/html/', category: '工具', desc: 'HTML 编码解码工具' },
        { id: 21, title: 'Markdown 工具', url: '/tool/md/', category: '工具', desc: 'Markdown 编辑预览工具' },
        { id: 22, title: '密码生成器', url: '/tool/password/', category: '工具', desc: '随机安全密码生成' },
        { id: 23, title: '二维码生成器', url: '/tool/qrcode/', category: '工具', desc: '文本生成二维码' },
        { id: 24, title: '颜色转换器', url: '/tool/color/', category: '工具', desc: 'HEX/RGB/HSL 颜色互转' },
        { id: 25, title: '时间戳转换', url: '/tool/timestamp/', category: '工具', desc: 'Unix 时间戳转换' },
        { id: 26, title: 'Base64 编码', url: '/tool/base64/', category: '工具', desc: 'Base64 编码解码' },
        { id: 27, title: 'URL 编码', url: '/tool/url-encode/', category: '工具', desc: 'URL 编码解码工具' },
        { id: 28, title: 'UUID 生成器', url: '/tool/uuid/', category: '工具', desc: '生成唯一标识符' },
        { id: 29, title: '计算器', url: '/tool/calculator/', category: '工具', desc: '基础和科学计算器' },
        { id: 30, title: '随机数生成器', url: '/tool/random/', category: '工具', desc: '随机数生成工具' },
        { id: 31, title: '计时器', url: '/tool/timer/', category: '工具', desc: '计时器和秒表工具' },
        { id: 32, title: '文本统计', url: '/tool/text-stats/', category: '工具', desc: '文本字数统计工具' },
        { id: 33, title: '大小写转换', url: '/tool/case-convert/', category: '工具', desc: '文本大小写转换工具' },
        { id: 34, title: 'CSV 转 JSON', url: '/tool/csv-to-json/', category: '工具', desc: 'CSV 数据转 JSON' },
        { id: 35, title: 'SQL 格式化', url: '/tool/sql-formatter/', category: '工具', desc: 'SQL 语句格式化' },
        { id: 36, title: 'JSON 代码生成', url: '/tool/json-to-code/', category: '工具', desc: 'JSON 转代码工具' },
        { id: 37, title: 'AI应用开发修炼手册', url: '/course/ai-app-dev/', category: '课程', desc: '从零到实战的AI开发课程' },
        { id: 38, title: 'AI产品经理修炼手册', url: '/course/ai-pm/', category: '课程', desc: '从产品思维到AI落地的全能型AI产品经理课程' },
        { id: 39, title: '投资人修炼手册', url: '/course/investor-manual/', category: '课程', desc: '从投资基础到实战专家的完整学习路径' },
        { id: 40, title: '创业者修炼手册', url: '/course/startup-manual/', category: '课程', desc: '从创业思维到融资退出的创业全流程指南' },
        { id: 41, title: '芯片设计修炼手册', url: '/course/chip-design/', category: '课程', desc: '数字芯片设计从入门到精通' },
        { id: 42, title: '嵌入式硬件开发修炼手册', url: '/course/hardware-dev/', category: '课程', desc: '嵌入式硬件开发完整课程体系' },
        { id: 43, title: '嵌入式软件开发修炼手册', url: '/course/embedded-dev/', category: '课程', desc: '嵌入式C语言与驱动开发实战' },
        { id: 44, title: '量化交易开发修炼手册', url: '/course/quant-trading/', category: '课程', desc: '量化交易策略与系统开发' },
        { id: 45, title: '全栈应用开发修炼手册', url: '/course/node-ts-fullstack/', category: '课程', desc: 'TypeScript + NestJS 全栈课程' },
        { id: 46, title: '节奏大师', url: '/game/rhythm-master/', category: '游戏', desc: '跟着音乐节奏，挑战反应速度' },
        { id: 47, title: '音游练习', url: '/game/music-practice/', category: '游戏', desc: '简单有趣的钢琴音游，练习节奏感' },
        { id: 48, title: '弹射球', url: '/game/gravity-ball/', category: '游戏', desc: '重力物理模拟，精准弹射挑战' },
        { id: 49, title: '弹幕躲避', url: '/game/bullet-dodge/', category: '游戏', desc: '在弹幕中生存，挑战反应极限' },
        { id: 50, title: '堆叠游戏', url: '/game/stack-tower/', category: '游戏', desc: '精准堆叠，建造高塔' },
    ],

    // 创建 FlexSearch 索引
    createIndex() {
        // FlexSearch Worker 模式
        this.index = new FlexSearch.Document({
            document: {
                id: 'id',
                index: ['title', 'desc', 'category'],
                store: ['title', 'desc', 'category', 'url']
            },
            tokenize: 'full',
            threshold: 1,
            depth: 3,
            resolution: 9,
            optimize: true,
            context: {
                resolution: 9,
                depth: 3,
                threshold: 1
            },
            // 中文分词配置
            charset: 'latin:simple',
            rtl: false,
            // 模糊搜索配置
            fuzzy: function (value) {
                // 允许最多 2 个字符的差异
                if (value.length < 3) return 0;
                if (value.length < 5) return 1;
                return 2;
            },
            // 词干处理
            stemmer: {
                // 简单的中文词干处理
                '的': '',
                '了': '',
                '和': '',
                '与': '',
                '或': '',
                '在': ''
            }
        });

        // 将数据添加到索引
        this.data.forEach(item => {
            this.index.add(item);
        });
    },

    // 搜索方法
    search(query) {
        if (!this.index) this.createIndex();
        if (!query || query.length < 1) return [];

        const results = this.index.search({
            field: ['title', 'desc', 'category'],
            query: query,
            limit: 20,
            suggest: true // 启用建议，提供更智能的结果
        });

        // 处理搜索结果并去重
        const resultMap = new Map();
        results.forEach(resultSet => {
            resultSet.result.forEach(id => {
                if (!resultMap.has(id)) {
                    const item = this.data.find(d => d.id === id);
                    if (item) {
                        resultMap.set(id, item);
                    }
                }
            });
        });

        return Array.from(resultMap.values());
    },

    // 高亮匹配文本
    highlight(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    // 初始化
    init() {
        this.createIndex();
        this.bindEvents();
    },

    // 绑定事件
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

    // 显示搜索结果
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
