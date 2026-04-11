/**
 * 全局暗黑模式切换模块
 * 自动检测用户偏好，提供统一的切换按钮
 */

(function() {
    'use strict';

    // 检测系统偏好
    function getSystemPreference() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 获取存储的偏好
    function getStoredPreference() {
        return localStorage.getItem('darkMode');
    }

    // 应用暗黑模式
    function applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // 创建切换按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', '切换深色模式');
        button.setAttribute('title', '切换深色模式');

        // 根据当前状态设置图标
        const isDark = document.body.classList.contains('dark-mode');
        button.innerHTML = isDark ? '☀️' : '🌙';

        // 点击切换
        button.addEventListener('click', function() {
            const isCurrentlyDark = document.body.classList.contains('dark-mode');
            applyDarkMode(!isCurrentlyDark);
            localStorage.setItem('darkMode', !isCurrentlyDark);
            button.innerHTML = !isCurrentlyDark ? '☀️' : '🌙';
        });

        document.body.appendChild(button);
    }

    // 初始化
    function init() {
        // 检查存储的偏好，如果没有则使用系统偏好
        const stored = getStoredPreference();
        let isDark;

        if (stored !== null) {
            isDark = stored === 'true';
        } else {
            isDark = getSystemPreference();
        }

        // 应用模式
        applyDarkMode(isDark);

        // 创建切换按钮
        createToggleButton();

        // 监听系统偏好变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                // 只有当用户没有手动设置偏好时才跟随系统
                if (getStoredPreference() === null) {
                    applyDarkMode(e.matches);
                    const button = document.querySelector('.dark-mode-toggle');
                    if (button) {
                        button.innerHTML = e.matches ? '☀️' : '🌙';
                    }
                }
            });
        }
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
