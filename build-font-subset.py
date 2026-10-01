#!/usr/bin/env python3
"""从 font/Arial Unicode.ttf 抽取本站实际用到的字符，生成体积很小的 woff2 网页字体。

- 输入：index.html 里出现的所有可打印字符（去重）＋ 下面 EXTRA 里补充的常用字，
  这样以后在页面上小改文案不至于立刻缺字。
- 输出：font/arial-unicode-subset.woff2（Arial Unicode MS 是 Monotype 商业字体，
  这里只做“按需子集化”用于自己的站点；如需商用请自行确认授权。）

依赖（仓库内虚拟环境）：
    python3 -m venv .tools-venv && .tools-venv/bin/pip install fonttools brotli
用法：
    .tools-venv/bin/python build-font-subset.py
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC_FONT = ROOT / "font" / "Arial Unicode.ttf"
OUT_FONT = ROOT / "font" / "arial-unicode-subset.woff2"
HTML = ROOT / "index.html"
SCRIPT = ROOT / "script.js"

# 页面上暂时没出现、但八成会用到的字（改文案时不容易马上缺字）
EXTRA = (
    "的了吗呢吧啊呀哦嗯"
    "我你他她它们"
    "一二三四五六七八九十百千万"
    "今天昨年月份日星期"
    "游戏画画音乐电影动画漫画阅读摄影编程学习工作"
    "朋友家人同学老师"
    "喜欢讨厌最爱"
    "欢迎关注联系邮箱网站主页简介资料"
    "谢谢感谢支持加油"
)


def page_chars() -> set[str]:
    html = HTML.read_text(encoding="utf-8")
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", "", html)
    text = (
        text.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&copy;", "©")
    )
    # CSS 里 content: "aka " 之类也补上
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    text += " " + "".join(re.findall(r'content:\s*"([^"]*)"', css))
    # script.js 里的颜文字 / 动态文案也算上
    if SCRIPT.exists():
        text += " " + SCRIPT.read_text(encoding="utf-8")
    return {c for c in text if c.isprintable() and not c.isspace()}


def main() -> int:
    if not SRC_FONT.exists():
        print(f"找不到源字体：{SRC_FONT}", file=sys.stderr)
        return 1

    chars = page_chars() | set(EXTRA)
    text = "".join(sorted(chars))
    print(f"字符数：{len(chars)}")

    cmd = [
        sys.executable, "-m", "fontTools.subset", str(SRC_FONT),
        f"--text={text}",
        "--layout-features=*",          # 保留字距等排版特性
        "--name-IDs=*",                 # 保留字体名（浏览器识别用）
        "--drop-tables+=DSIG",
        "--flavor=woff2",
        f"--output-file={OUT_FONT}",
    ]
    print("运行：", " ".join(cmd[1:3]), "...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stdout, res.stderr, sep="\n", file=sys.stderr)
        return res.returncode

    size = OUT_FONT.stat().st_size
    print(f"已生成 {OUT_FONT.relative_to(ROOT)}（{size / 1024:.1f} KB，"
          f"原字体 {SRC_FONT.stat().st_size / 1024 / 1024:.1f} MB）")
    print("提示：改了页面文案后重新跑一次本脚本即可。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
