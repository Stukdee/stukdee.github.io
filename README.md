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
| `icon/` | 头像 `head.PNG`、`logo.svg`、各个社交图标 |
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
```

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
