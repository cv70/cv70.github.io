/**
 * 课程侧边栏加载器
 * 动态加载课程目录侧边栏
 */
(function() {
    // 检测当前页面相对于课程根目录的深度
    var pathParts = window.location.pathname.split('/');
    var courseIndex = pathParts.indexOf('node-ts-fullstack');
    var isInChapterDir = courseIndex >= 0 && pathParts.length > courseIndex + 2;

    var sidebarPath = isInChapterDir ? '../sidebar.html' : 'sidebar.html';
    var linkPrefix = isInChapterDir ? '../' : '';

    // 加载侧边栏
    fetch(sidebarPath)
        .then(function(response) { return response.text(); })
        .then(function(html) {
            // 注入桌面端侧边栏
            var sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = html;

                // 调整链接路径（章节子目录中的页面需要加 ../ 前缀）
                if (linkPrefix) {
                    sidebarContainer.querySelectorAll('.toc-nav a').forEach(function(a) {
                        var href = a.getAttribute('href');
                        if (href && href !== '#' && !href.startsWith('http')) {
                            a.setAttribute('href', linkPrefix + href);
                        }
                    });
                }

                // 高亮当前页面的链接
                var currentPath = decodeURIComponent(window.location.pathname);
                sidebarContainer.querySelectorAll('.toc-nav a').forEach(function(a) {
                    var href = a.getAttribute('href');
                    if (href && href !== '#' && !href.startsWith('http')) {
                        try {
                            var linkUrl = new URL(href, window.location.href);
                            if (currentPath === decodeURIComponent(linkUrl.pathname)) {
                                a.classList.add('active');
                            }
                        } catch(e) {}
                    }
                });

                // 折叠目录：点击章节标题切换展开/收起
                sidebarContainer.querySelectorAll('.toc-section-title').forEach(function(title) {
                    title.addEventListener('click', function() {
                        this.parentElement.classList.toggle('open');
                    });
                });

                // 自动展开当前页面所在的章节
                var activeLink = sidebarContainer.querySelector('.toc-nav a.active');
                if (activeLink) {
                    var activeSection = activeLink.closest('.toc-section');
                    if (activeSection) activeSection.classList.add('open');
                }
            }

            // 生成移动端目录弹窗
            var desktopNav = document.querySelector('#sidebar-container .toc-nav');
            if (desktopNav) {
                // 创建移动端目录按钮
                var mobileBtn = document.createElement('button');
                mobileBtn.className = 'mobile-toc-btn';
                mobileBtn.textContent = '\uD83D\uDCCD'; // 📑
                mobileBtn.onclick = toggleMobileToc;
                document.body.appendChild(mobileBtn);

                // 创建移动端目录弹窗
                var mobileModal = document.createElement('div');
                mobileModal.className = 'mobile-toc-modal';
                mobileModal.id = 'mobileTocModal';
                mobileModal.innerHTML =
                    '<div class="mobile-toc-content">' +
                    '  <div class="mobile-toc-header">' +
                    '    <h3>课程目录</h3>' +
                    '    <button class="mobile-toc-close" onclick="toggleMobileToc()">\u2715</button>' +
                    '  </div>' +
                    '</div>';

                // 克隆目录内容到移动端弹窗
                var mobileNav = desktopNav.cloneNode(true);
                // 为移动端链接添加点击关闭弹窗
                mobileNav.querySelectorAll('a').forEach(function(a) {
                    a.addEventListener('click', function() {
                        toggleMobileToc();
                    });
                });

                // 移动端折叠目录：点击章节标题切换展开/收起
                mobileNav.querySelectorAll('.toc-section-title').forEach(function(title) {
                    title.addEventListener('click', function() {
                        this.parentElement.classList.toggle('open');
                    });
                });

                // 移动端自动展开当前页面所在的章节
                var mobileActive = mobileNav.querySelector('a.active');
                if (mobileActive) {
                    var mobileActiveSection = mobileActive.closest('.toc-section');
                    if (mobileActiveSection) mobileActiveSection.classList.add('open');
                }
                mobileModal.querySelector('.mobile-toc-content').appendChild(mobileNav);
                document.body.appendChild(mobileModal);
            }
        })
        .catch(function(err) { console.error('加载侧边栏失败:', err); });

    // 移动端目录切换
    window.toggleMobileToc = function() {
        var modal = document.getElementById('mobileTocModal');
        if (modal) modal.classList.toggle('open');
    };
})();
