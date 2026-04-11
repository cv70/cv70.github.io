/**
 * 页面组件加载器
 * 动态加载页眉和页脚
 */
(function() {
    // 加载页眉
    fetch('/header.html')
        .then(response => response.text())
        .then(html => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = html;
            }
        })
        .catch(err => console.error('加载页眉失败:', err));

    // 加载页脚
    fetch('/footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(err => console.error('加载页脚失败:', err));
})();
