/* ===========================
   main.js - 交互逻辑
   功能: 主题切换、移动端菜单、平滑滚动
   =========================== */

(function () {
    "use strict";

    // ---- 主题管理 ----
    var THEMES = ["ammo-8", "cc-29", "chasm", "oil6", "vinik24"];
    var DEFAULT_THEME = "oil6";
    var STORAGE_KEY = "stukdee-theme";

    // 获取已保存的主题，若无则使用默认
    function getSavedTheme() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && THEMES.indexOf(saved) !== -1) {
                return saved;
            }
        } catch (e) {
            // localStorage 不可用时静默失败
        }
        return DEFAULT_THEME;
    }

    // 应用主题
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        // 更新按钮激活状态
        var buttons = document.querySelectorAll(".theme-btn");
        buttons.forEach(function (btn) {
            if (btn.getAttribute("data-theme") === theme) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // 保存主题
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // 忽略写入失败
        }
    }

    // 切换主题
    function switchTheme(theme) {
        if (THEMES.indexOf(theme) === -1) return;
        applyTheme(theme);
        saveTheme(theme);
    }

    // ---- 移动端菜单 ----
    function toggleMenu() {
        var menuToggle = document.querySelector(".menu-toggle");
        var navLinks = document.querySelector(".nav-links");
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.toggle("open");
        navLinks.classList.toggle("open");
    }

    function closeMenu() {
        var menuToggle = document.querySelector(".menu-toggle");
        var navLinks = document.querySelector(".nav-links");
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.remove("open");
        navLinks.classList.remove("open");
    }

    // ---- 初始化 ----
    function init() {
        // 应用已保存的主题
        applyTheme(getSavedTheme());

        // 主题按钮事件
        var themeButtons = document.querySelectorAll(".theme-btn");
        themeButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var theme = btn.getAttribute("data-theme");
                switchTheme(theme);
            });
        });

        // 移动端菜单按钮
        var menuToggle = document.querySelector(".menu-toggle");
        if (menuToggle) {
            menuToggle.addEventListener("click", toggleMenu);
        }

        // 点击导航链接后关闭移动端菜单
        var navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // 点击页面其他区域关闭菜单
        document.addEventListener("click", function (e) {
            var nav = document.querySelector("nav");
            var navLinks = document.querySelector(".nav-links");
            if (
                nav &&
                navLinks &&
                navLinks.classList.contains("open") &&
                !nav.contains(e.target)
            ) {
                closeMenu();
            }
        });
    }

    // DOM 就绪后初始化
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
