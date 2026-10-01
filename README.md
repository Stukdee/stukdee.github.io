# stukdee.github.io

> Stukdee 的个人主页 · **小克 / 果果 / 果子**

线上地址：<https://stukdee.is-a.dev/>

## 页面结构

首页是纯静态 HTML + CSS + 一点点原生 JS，不依赖 React / Babel / CDN，
断网也能正常打开。布局照着草图来：**左边一个粉色圆环头像 + 右边 3 条资料 + 1 条大自我介绍**。

| 文件 | 说明 |
| --- | --- |
| `index.html` | 首页（图标 SVG 已内联，颜色跟随主题） |
| `styles.css` | 全部样式：浅色 / 深色、电脑 / 手机适配、打印样式 |
| `script.js` | 主题切换、年龄计算、页脚年份、颜文字轮播 |
| `about/index.txt` | 个人资料原稿（改文案从这里开始） |
| `icon/` | 头像 `head.PNG`、`logo.svg`、网页图标 `favicon.svg`、分享大图 `og-cover.png`、各个社交图标 |
| `font/arial-unicode-subset.woff2` | 只含本站用字的网页字体（约 91 KB） |

### 手机适配

- `> 900px`：左右两栏（头像在左，资料在右）
- `≤ 900px`：改成上下堆叠，头像居中在上
- `≤ 620px`：收紧间距、缩小圆环、账号两列
- `≤ 380px`：账号图标一行两个

深色模式：跟着系统走，也可以在右上角按钮手动切换
（存在 `localStorage.stukdee_theme`，也支持 `?theme=dark` / `?theme=light` 直接打开）。

## 重新构建

网页字体是从 22MB 的 `Arial Unicode.ttf` 里**抽取本站用到的字**生成的。
改了页面文案以后，重新跑一次即可：

```bash
# 1. 安装依赖（仓库内虚拟环境，不会污染系统）
python3 -m venv .tools-venv
.tools-venv/bin/pip install fonttools brotli

# 2. 把原始字体放回 font/Arial Unicode.ttf（22MB，未入库）
#    然后重新生成子集
.tools-venv/bin/python build-font-subset.py

# 3. 新增/替换图标后，重新内联 SVG
python3 build-inline-icons.py

# 4. logo.svg 有改动时，重新生成网页图标
python3 build-favicon.py

# 5. 改了首页文案 / 头像 / logo 后，重新生成分享预览大图
python3 build-og-image.py
```

### 网页图标

浏览器标签页上的图标由 `icon/favicon.svg` 提供，它**由 `icon/logo.svg` 生成**
（`build-favicon.py`）：裁掉 A4 空白、补一层浅色圆形底、把"毫米级"的线宽加粗到
小尺寸能看清的程度。所以改 logo 之后记得重跑一次 `build-favicon.py`。
`icon/head.PNG` 作为 `rel="alternate icon"` 保留，给不支持 SVG 图标的极老浏览器兜底。

### 分享到 X（推特）

链接发到 X 上会显示成**大图卡片**，靠的就是 `index.html` 里这几行：

```html
<meta property="og:image" content="https://stukdee.is-a.dev/icon/og-cover.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

三个要点：

1. **图片必须是绝对 URL**（`https://…`），相对路径 X 抓不到；
2. **横图 1200×630** 才会显示成大图。用方图 + `summary` 只会缩成角落里的小方图；
3. **X 会缓存旧预览**，换图后不会立刻更新，等几分钟到几小时，或者用
   [Card Validator](https://cards-dev.twitter.com/validator) / 在链接后加 `?v=2` 强制重抓。

`icon/og-cover.png` 由 `build-og-image.py` 生成：它把字体、logo、头像全部内联进
`.og-template.html`（模板在脚本里的同名文件），再用无头 Chrome 渲染成 1200×630。
改版式就改模板，改完重跑脚本。想快速自查效果，把链接发到 Telegram 的「Saved Messages」
或 Discord，它们抓取快、不缓存。

## 个人资料

- **昵称**：Stukdee
- **别称**：小克、果果、果子
- **生日**：2010 年 9 月 6 日（处女座）
- **爱好**：制作小游戏、画画、看电视、研究古籍
- 特仑苏 🥛 与明治巧克力 🍫 的忠实粉丝，坚定的猫派 🐱

## License

© 2026 Stukdee. All rights reserved.

`Arial Unicode MS` 是 Monotype 的商业字体，这里只做「按需子集化」用于本站展示；
如需商用请自行确认授权。
