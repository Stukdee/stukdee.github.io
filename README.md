# stukdee.github.io

> Stukdee 的个人主页，支持多主题配色与多语言切换，适配桌面端与移动端。

## 特性

- **响应式布局**：自动适配桌面、平板与手机屏幕
- **5 种颜色主题**：一键切换，每个主题拥有独立的配色、字体与视觉风格
- **5 种界面语言**：简体中文 / 繁體中文 / 日本語 / English / Русский
- **零依赖**：纯 HTML + CSS + JavaScript，无需构建工具

## 颜色主题

| 主题 | 配色源 | 风格 | 字体 |
|------|--------|------|------|
| 🌷 温暖柔粉 (oil6) | oil6.txt | 柔和圆润、温暖舒适 | Arial Unicode |
| 🌿 深绿自然 (ammo-8) | ammo-8.txt | 有机圆润、植物茎感 | Sky Heart Clear Serif TC |
| 🌸 柔和中性 (cc-29) | cc-29.txt | 现代简洁、中性调 | Lemi Xiaoyuti (乐迷小语体) |
| 🌌 赛博霓虹 (chasm) | chasm.txt | 科幻发光、像素等宽 | Fusion Pixel |
| 📜 复古怀旧 (vinik24) | vinik24.txt | 双线装饰、衬线经典 | Liyu Shoushu (李禹手书) |

配色源文件位于 `colors/*.txt`，每个主题独立的 CSS 文件位于 `colors/*.css`。

## 界面语言

下拉式语言菜单，每项显示「语言名 + 你好世界」翻译：

| 代码 | 语言 | 选项文字 |
|------|------|---------|
| `zh-CN` | 简体中文 | 简 · 你好世界 |
| `zh-TW` | 繁體中文 | 繁 · 你好世界 |
| `ja` | 日本語 | 日 · こんにちは世界 |
| `en` | English | EN · Hello World |
| `ru` | Русский | RU · Привет мир |

语言与主题选择均通过 `localStorage` 持久化保存。

## 页面结构

```
index.html
├── <header>  导航栏（Logo / 导航 / 主题切换器 / 语言切换器 / 移动端菜单）
├── #home     Hero 区域（头像 / 昵称 / 别称 / 标语）
├── #about    关于我（自我介绍）
├── #hobbies  我的爱好（5 张卡片：制作小游戏 / 画画 / 看电视 / 研究古籍 / 仍在寻找）
├── #social   找到我（6 个社交平台链接）
└── <footer>  页脚（版权信息）
```

## 项目结构

```
stukdee.github.io/
├── index.html            # 主页面
├── main.css              # 基础样式 + 布局 + 响应式
├── main.js               # 主题切换 + 移动端菜单交互
├── i18n.js               # 多语言翻译数据 + 切换逻辑
├── colors/               # 颜色主题
│   ├── oil6.css          # 温暖柔粉
│   ├── ammo-8.css        # 深绿自然
│   ├── cc-29.css         # 柔和中性
│   ├── chasm.css         # 赛博霓虹
│   ├── vinik24.css       # 复古怀旧
│   └── *.txt             # 各主题原始调色板
├── fonts/                # 自定义字体 (TTF)
│   ├── SkyHeartClearSerifTC-Regular.ttf
│   ├── fusion-pixel-10px-proportional-zh_hans.ttf
│   ├── lemixiaoyuti.ttf
│   ├── LiyuShoushu.ttf
│   └── Arial Unicode.ttf
├── icon/                 # 图标与头像
│   ├── logo.svg          # 网站图标
│   ├── head.PNG          # 头像
│   └── *.svg             # 各社交平台图标
└── about/
    └── index.txt         # 个人介绍数据
```

## 本地预览

由于浏览器对 `file://` 协议下的字体加载有限制，建议通过本地服务器预览：

```bash
# 任选其一，在项目根目录执行
python3 -m http.server 8000
# 或
npx serve .
```

然后浏览器访问 <http://localhost:8000/>。

## 社交账号

- **GitHub**：[@Stukdee](https://github.com/Stukdee/)
- **Bilibili**：[B站空间](https://space.bilibili.com/3546769633840089)
- **dev.to**：[@stukdee](https://dev.to/stukdee)
- **Pixiv**：[ID: 108207052](https://www.pixiv.net/users/108207052)
- **Twitter / X**：[@StukdeeGorye](https://x.com/StukdeeGorye)
- **itch.io**：[stukdee.itch.io](https://stukdee.itch.io/)

## 个人资料

- **昵称**：Stukdee
- **别称**：小克、果果、果子
- **爱好**：制作小游戏、画画、看电视、研究古籍

## License

© 2026 Stukdee. All rights reserved.
