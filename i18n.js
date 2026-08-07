/* ===========================
   i18n.js - 多语言切换
   支持: 简体 / 繁體 / EN / RU / 日本語
   =========================== */

(function () {
    "use strict";

    var LANGS = ["zh-CN", "zh-TW", "ja", "en", "ru"];
    var DEFAULT_LANG = "zh-CN";
    var STORAGE_KEY = "stukdee-lang";

    var translations = {
        "zh-CN": {
            "page.title": "Stukdee 的个人主页",
            "meta.desc": "Stukdee 的个人主页 - 制作小游戏、画画、看电视、研究古籍",
            "nav.about": "关于我",
            "nav.hobbies": "爱好",
            "nav.contact": "联系方式",
            "hero.greeting": '你好，我是 <span class="nickname">Stukdee</span> 👋',
            "hero.nicknames": "别称：小克 / 果果 / 果子",
            "hero.tagline": "热爱生活，热爱创作",
            "about.title": "关于我",
            "about.p1": "大家好！我是 Stukdee，一个喜欢创造和探索的人。我热衷于将想法变成现实，无论是通过代码、画笔还是其他方式。",
            "about.p2": "欢迎来到我的个人主页，在这里你可以了解我的爱好，找到我的各种平台账号，和我一起交流分享！",
            "hobbies.title": "我的爱好",
            "hobby.game.title": "制作小游戏",
            "hobby.game.desc": "喜欢用代码创造有趣的游戏体验，将想象变成可互动的作品。",
            "hobby.art.title": "画画",
            "hobby.art.desc": "用画笔记录生活和灵感，享受创作过程中的宁静与快乐。",
            "hobby.tv.title": "看电视",
            "hobby.tv.desc": "通过影视作品放松身心，从不同的故事中获得启发和感动。",
            "hobby.books.title": "研究古籍",
            "hobby.books.desc": "探索古籍中的智慧与文字之美，在历史的长河中寻找启示。",
            "hobby.search.title": "仍在寻找",
            "hobby.search.desc": "生活充满可能，我还在探索更多有趣的事物...",
            "social.title": "找到我",
            "social.desc": "欢迎在以下平台关注我，一起交流！",
            "social.bilibili": "B站空间",
            "footer.rights": "© 2026 Stukdee. All rights reserved.",
            "footer.made": "Made with ❤️",
            "alt.avatar": "Stukdee 的头像",
            "alt.github": "Github 图标",
            "alt.bilibili": "Bilibili 图标",
            "alt.devto": "devto 图标",
            "alt.pixiv": "Pixiv 图标",
            "alt.twitter": "Twitter/X 图标",
            "alt.itch": "itch.io 图标",
            "theme.oil6": "温暖柔粉",
            "theme.ammo8": "深绿自然",
            "theme.cc29": "柔和中性",
            "theme.chasm": "赛博霓虹",
            "theme.vinik24": "复古怀旧",
            "menu.label": "菜单",
            "lang.label.zh-CN": "简体中文",
            "lang.label.zh-TW": "繁體中文",
            "lang.label.ja": "日本語",
            "lang.label.en": "English",
            "lang.label.ru": "Русский",
            "lang.hello.zh-CN": "你好世界",
            "lang.hello.zh-TW": "你好世界",
            "lang.hello.ja": "こんにちは世界",
            "lang.hello.en": "Hello World",
            "lang.hello.ru": "Привет мир"
        },
        "zh-TW": {
            "page.title": "Stukdee 的個人主頁",
            "meta.desc": "Stukdee 的個人主頁 - 製作小遊戲、畫畫、看電視、研究古籍",
            "nav.about": "關於我",
            "nav.hobbies": "興趣",
            "nav.contact": "聯絡方式",
            "hero.greeting": '你好，我是 <span class="nickname">Stukdee</span> 👋',
            "hero.nicknames": "別稱：小克 / 果果 / 果子",
            "hero.tagline": "熱愛生活，熱愛創作",
            "about.title": "關於我",
            "about.p1": "大家好！我是 Stukdee，一個喜歡創造和探索的人。我熱衷於將想法變成現實，無論是通過程式碼、畫筆還是其他方式。",
            "about.p2": "歡迎來到我的個人主頁，在這裡你可以了解我的興趣，找到我的各種平台帳號，和我一起交流分享！",
            "hobbies.title": "我的興趣",
            "hobby.game.title": "製作小遊戲",
            "hobby.game.desc": "喜歡用程式碼創造有趣的遊戲體驗，將想像變成可互動的作品。",
            "hobby.art.title": "畫畫",
            "hobby.art.desc": "用畫筆記錄生活和靈感，享受創作過程中的寧靜與快樂。",
            "hobby.tv.title": "看電視",
            "hobby.tv.desc": "通過影視作品放鬆身心，從不同的故事中獲得啟發和感動。",
            "hobby.books.title": "研究古籍",
            "hobby.books.desc": "探索古籍中的智慧與文字之美，在歷史的長河中尋找啟示。",
            "hobby.search.title": "仍在尋找",
            "hobby.search.desc": "生活充滿可能，我還在探索更多有趣的事物...",
            "social.title": "找到我",
            "social.desc": "歡迎在以下平台關注我，一起交流！",
            "social.bilibili": "B站空間",
            "footer.rights": "© 2026 Stukdee. All rights reserved.",
            "footer.made": "Made with ❤️",
            "alt.avatar": "Stukdee 的頭像",
            "alt.github": "Github 圖標",
            "alt.bilibili": "Bilibili 圖標",
            "alt.devto": "devto 圖標",
            "alt.pixiv": "Pixiv 圖標",
            "alt.twitter": "Twitter/X 圖標",
            "alt.itch": "itch.io 圖標",
            "theme.oil6": "溫暖柔粉",
            "theme.ammo8": "深綠自然",
            "theme.cc29": "柔和中性",
            "theme.chasm": "賽博霓虹",
            "theme.vinik24": "復古懷舊",
            "menu.label": "選單",
            "lang.label.zh-CN": "简体中文",
            "lang.label.zh-TW": "繁體中文",
            "lang.label.ja": "日本語",
            "lang.label.en": "English",
            "lang.label.ru": "Русский",
            "lang.hello.zh-CN": "你好世界",
            "lang.hello.zh-TW": "你好世界",
            "lang.hello.ja": "こんにちは世界",
            "lang.hello.en": "Hello World",
            "lang.hello.ru": "Привет мир"
        },
        "en": {
            "page.title": "Stukdee's Homepage",
            "meta.desc": "Stukdee's homepage - making games, drawing, watching TV, studying classics",
            "nav.about": "About",
            "nav.hobbies": "Hobbies",
            "nav.contact": "Contact",
            "hero.greeting": 'Hello, I\'m <span class="nickname">Stukdee</span> 👋',
            "hero.nicknames": "Aliases: Xiao Ke / Guo Guo / Guo Zi",
            "hero.tagline": "Love life, love creation",
            "about.title": "About Me",
            "about.p1": "Hello everyone! I'm Stukdee, someone who loves to create and explore. I'm passionate about turning ideas into reality, whether through code, brushes, or other means.",
            "about.p2": "Welcome to my personal homepage! Here you can learn about my hobbies, find my social media accounts, and connect with me!",
            "hobbies.title": "My Hobbies",
            "hobby.game.title": "Making Games",
            "hobby.game.desc": "I enjoy creating fun game experiences with code, turning imagination into interactive works.",
            "hobby.art.title": "Drawing",
            "hobby.art.desc": "Recording life and inspiration with brushes, enjoying the peace and joy of the creative process.",
            "hobby.tv.title": "Watching TV",
            "hobby.tv.desc": "Relaxing through films and shows, gaining inspiration and emotion from different stories.",
            "hobby.books.title": "Studying Classics",
            "hobby.books.desc": "Exploring the wisdom and beauty of text in ancient books, seeking enlightenment in the river of history.",
            "hobby.search.title": "Still Searching",
            "hobby.search.desc": "Life is full of possibilities, I'm still exploring more interesting things...",
            "social.title": "Find Me",
            "social.desc": "Follow me on these platforms, let's connect!",
            "social.bilibili": "Bilibili Space",
            "footer.rights": "© 2026 Stukdee. All rights reserved.",
            "footer.made": "Made with ❤️",
            "alt.avatar": "Stukdee's avatar",
            "alt.github": "Github icon",
            "alt.bilibili": "Bilibili icon",
            "alt.devto": "devto icon",
            "alt.pixiv": "Pixiv icon",
            "alt.twitter": "Twitter/X icon",
            "alt.itch": "itch.io icon",
            "theme.oil6": "Warm Pink",
            "theme.ammo8": "Deep Green",
            "theme.cc29": "Soft Neutral",
            "theme.chasm": "Cyber Neon",
            "theme.vinik24": "Retro Vintage",
            "menu.label": "Menu",
            "lang.label.zh-CN": "简体中文",
            "lang.label.zh-TW": "繁體中文",
            "lang.label.ja": "日本語",
            "lang.label.en": "English",
            "lang.label.ru": "Русский",
            "lang.hello.zh-CN": "你好世界",
            "lang.hello.zh-TW": "你好世界",
            "lang.hello.ja": "こんにちは世界",
            "lang.hello.en": "Hello World",
            "lang.hello.ru": "Привет мир"
        },
        "ru": {
            "page.title": "Главная страница Stukdee",
            "meta.desc": "Главная страница Stukdee - создание игр, рисование, просмотр ТВ, изучение классики",
            "nav.about": "Обо мне",
            "nav.hobbies": "Увлечения",
            "nav.contact": "Контакты",
            "hero.greeting": 'Привет, я <span class="nickname">Stukdee</span> 👋',
            "hero.nicknames": "Прозвища: Сяо Кэ / Го Го / Го Цзы",
            "hero.tagline": "Люблю жизнь, люблю творчество",
            "about.title": "Обо мне",
            "about.p1": "Всем привет! Я Stukdee, человек, который любит создавать и исследовать. Я страстно превращаю идеи в реальность, будь то через код, кисть или другие средства.",
            "about.p2": "Добро пожаловать на мою личную страницу! Здесь вы можете узнать о моих увлечениях, найти мои аккаунты в социальных сетях и пообщаться со мной!",
            "hobbies.title": "Мои увлечения",
            "hobby.game.title": "Создание игр",
            "hobby.game.desc": "Мне нравится создавать увлекательные игровые опыты с помощью кода, превращая воображение в интерактивные произведения.",
            "hobby.art.title": "Рисование",
            "hobby.art.desc": "Записываю жизнь и вдохновение кистью, наслаждаюсь спокойствием и радостью творческого процесса.",
            "hobby.tv.title": "Просмотр ТВ",
            "hobby.tv.desc": "Расслабляюсь через фильмы и шоу, получая вдохновение и эмоции из разных историй.",
            "hobby.books.title": "Изучение классики",
            "hobby.books.desc": "Исследую мудрость и красоту текста в древних книгах, ищу просветление в реке истории.",
            "hobby.search.title": "Всё ещё ищу",
            "hobby.search.desc": "Жизнь полна возможностей, я всё ещё исследую больше интересного...",
            "social.title": "Найти меня",
            "social.desc": "Подписывайтесь на меня на этих платформах, давайте общаться!",
            "social.bilibili": "Bilibili",
            "footer.rights": "© 2026 Stukdee. Все права защищены.",
            "footer.made": "Сделано с ❤️",
            "alt.avatar": "Аватар Stukdee",
            "alt.github": "Иконка Github",
            "alt.bilibili": "Иконка Bilibili",
            "alt.devto": "Иконка devto",
            "alt.pixiv": "Иконка Pixiv",
            "alt.twitter": "Иконка Twitter/X",
            "alt.itch": "Иконка itch.io",
            "theme.oil6": "Тёплый розовый",
            "theme.ammo8": "Тёмно-зелёный",
            "theme.cc29": "Мягкий нейтральный",
            "theme.chasm": "Кибер неон",
            "theme.vinik24": "Ретро винтаж",
            "menu.label": "Меню",
            "lang.label.zh-CN": "简体中文",
            "lang.label.zh-TW": "繁體中文",
            "lang.label.ja": "日本語",
            "lang.label.en": "English",
            "lang.label.ru": "Русский",
            "lang.hello.zh-CN": "你好世界",
            "lang.hello.zh-TW": "你好世界",
            "lang.hello.ja": "こんにちは世界",
            "lang.hello.en": "Hello World",
            "lang.hello.ru": "Привет мир"
        },
        "ja": {
            "page.title": "Stukdeeのホームページ",
            "meta.desc": "Stukdeeのホームページ - ゲーム制作、絵画、テレビ鑑賞、古籍研究",
            "nav.about": "私について",
            "nav.hobbies": "趣味",
            "nav.contact": "連絡先",
            "hero.greeting": 'こんにちは、<span class="nickname">Stukdee</span>です 👋',
            "hero.nicknames": "別名：小克 / 果果 / 果子",
            "hero.tagline": "生活を愛し、創作を愛する",
            "about.title": "私について",
            "about.p1": "皆さんこんにちは！私はStukdeeです。創造と探求を愛する人です。コード、筆、その他の方法を問わず、アイデアを現実にすることに情熱を注いでいます。",
            "about.p2": "私の個人ホームページへようこそ！ここで私の趣味を知り、様々なプラットフォームのアカウントを見つけて、交流しましょう！",
            "hobbies.title": "私の趣味",
            "hobby.game.title": "ゲーム制作",
            "hobby.game.desc": "コードで楽しいゲーム体験を作り、想像をインタラクティブな作品に変えるのが好きです。",
            "hobby.art.title": "絵を描くこと",
            "hobby.art.desc": "筆で生活とインスピレーションを記録し、創作過程の静けさと喜びを楽しみます。",
            "hobby.tv.title": "テレビを見ること",
            "hobby.tv.desc": "映画や番組でリラックスし、様々な物語からインスピレーションと感動を得ます。",
            "hobby.books.title": "古籍の研究",
            "hobby.books.desc": "古籍の知恵と文字の美しさを探求し、歴史の長い流れの中で啓示を探します。",
            "hobby.search.title": "まだ探している",
            "hobby.search.desc": "人生は可能性に満ちており、もっと面白いことを探求し続けています...",
            "social.title": "私を見つけて",
            "social.desc": "以下のプラットフォームでフォローして、交流しましょう！",
            "social.bilibili": "Bilibiliスペース",
            "footer.rights": "© 2026 Stukdee. All rights reserved.",
            "footer.made": "❤️で作成",
            "alt.avatar": "Stukdeeのアバター",
            "alt.github": "Githubアイコン",
            "alt.bilibili": "Bilibiliアイコン",
            "alt.devto": "devtoアイコン",
            "alt.pixiv": "Pixivアイコン",
            "alt.twitter": "Twitter/Xアイコン",
            "alt.itch": "itch.ioアイコン",
            "theme.oil6": "ウォームピンク",
            "theme.ammo8": "ディープグリーン",
            "theme.cc29": "ソフトニュートラル",
            "theme.chasm": "サイバーネオン",
            "theme.vinik24": "レトロヴィンテージ",
            "menu.label": "メニュー",
            "lang.label.zh-CN": "简体中文",
            "lang.label.zh-TW": "繁體中文",
            "lang.label.ja": "日本語",
            "lang.label.en": "English",
            "lang.label.ru": "Русский",
            "lang.hello.zh-CN": "你好世界",
            "lang.hello.zh-TW": "你好世界",
            "lang.hello.ja": "こんにちは世界",
            "lang.hello.en": "Hello World",
            "lang.hello.ru": "Привет мир"
        }
    };

    // 获取已保存的语言
    function getSavedLang() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && LANGS.indexOf(saved) !== -1) return saved;
        } catch (e) {}
        return DEFAULT_LANG;
    }

    // 保存语言
    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
    }

    // 翻译函数
    function t(lang, key) {
        var dict = translations[lang] || translations[DEFAULT_LANG];
        return dict[key] || translations[DEFAULT_LANG][key] || key;
    }

    // 关闭下拉菜单
    function closeDropdown() {
        var switcher = document.getElementById("lang-switcher");
        var trigger = document.getElementById("lang-trigger");
        if (switcher) switcher.classList.remove("open");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
    }

    // 切换下拉菜单开关
    function toggleDropdown(e) {
        e.stopPropagation();
        var switcher = document.getElementById("lang-switcher");
        var trigger = document.getElementById("lang-trigger");
        if (!switcher || !trigger) return;
        var isOpen = switcher.classList.toggle("open");
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    // 更新下拉选项内容
    function updateDropdownOptions(lang) {
        // 按 LANGS 顺序更新各选项的 label/hello 文本
        var options = document.querySelectorAll(".lang-option");
        options.forEach(function (opt) {
            var code = opt.getAttribute("data-lang");
            if (!code) return;
            var labelSpan = opt.querySelector(".lang-option-label");
            var helloSpan = opt.querySelector(".lang-option-hello");
            if (labelSpan) labelSpan.textContent = t(lang, "lang.label." + code);
            if (helloSpan) helloSpan.textContent = t(lang, "lang.hello." + code);

            var isActive = code === lang;
            opt.setAttribute("aria-selected", isActive ? "true" : "false");
            if (isActive) {
                opt.classList.add("active");
            } else {
                opt.classList.remove("active");
            }
        });

        // 更新触发器上当前语言显示
        var triggerText = document.getElementById("lang-trigger-text");
        if (triggerText) {
            triggerText.textContent = t(lang, "lang.label." + lang);
        }
    }

    // 应用语言
    function applyLang(lang) {
        // 更新 html lang 属性
        document.documentElement.setAttribute("lang", lang);

        // 更新页面标题和 meta
        document.title = t(lang, "page.title");
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", t(lang, "meta.desc"));

        // 更新所有 data-i18n 文本
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            el.textContent = t(lang, key);
        });

        // 更新所有 data-i18n-html HTML 内容
        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            var key = el.getAttribute("data-i18n-html");
            el.innerHTML = t(lang, key);
        });

        // 更新 alt 属性
        document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
            var key = el.getAttribute("data-i18n-alt");
            el.setAttribute("alt", t(lang, key));
        });

        // 更新主题按钮 title 和 aria-label
        var themeKeys = {
            "oil6": "theme.oil6",
            "ammo-8": "theme.ammo8",
            "cc-29": "theme.cc29",
            "chasm": "theme.chasm",
            "vinik24": "theme.vinik24"
        };
        document.querySelectorAll(".theme-btn").forEach(function (btn) {
            var themeName = btn.getAttribute("data-theme");
            var key = themeKeys[themeName];
            if (key) {
                var text = t(lang, key);
                btn.setAttribute("title", text);
                btn.setAttribute("aria-label", lang === "zh-CN" ? "切换到" + text + "主题" : text);
            }
        });

        // 更新菜单按钮 aria-label
        var menuToggle = document.querySelector(".menu-toggle");
        if (menuToggle) {
            menuToggle.setAttribute("aria-label", t(lang, "menu.label"));
        }

        // 更新下拉菜单内容
        updateDropdownOptions(lang);
    }

    // 切换语言
    function switchLang(lang) {
        if (LANGS.indexOf(lang) === -1) return;
        applyLang(lang);
        saveLang(lang);
        closeDropdown();
    }

    // 初始化
    function init() {
        // 应用已保存的语言
        applyLang(getSavedLang());

        // 触发器按钮：切换下拉
        var trigger = document.getElementById("lang-trigger");
        if (trigger) {
            trigger.addEventListener("click", toggleDropdown);
        }

        // 选项点击：切换语言
        document.querySelectorAll(".lang-option").forEach(function (opt) {
            opt.addEventListener("click", function () {
                var code = opt.getAttribute("data-lang");
                if (code) switchLang(code);
            });
        });

        // 点击页面外部关闭下拉
        document.addEventListener("click", function (e) {
            var switcher = document.getElementById("lang-switcher");
            if (switcher && !switcher.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
