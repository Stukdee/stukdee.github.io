#!/usr/bin/env python3
"""生成分享到 X / Telegram / Discord 等平台时显示的预览大图（1200×630）。

原理：把 .og-template.html 里的字体、logo、头像都内联好，交给无头 Chrome
渲染成 PNG，输出到 icon/og-cover.png。这样图片不依赖任何外部资源，
按钮文案改了也不用重新截图。

用法：
    python3 build-og-image.py

依赖：本机装了 Google Chrome（脚本会自动找常见路径）。
"""

from __future__ import annotations

import base64
import importlib.util
import os
import re
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TEMPLATE = ROOT / ".og-template.html"
OUT = ROOT / "icon" / "og-cover.png"
FONT = ROOT / "font" / "arial-unicode-subset.woff2"
LOGO = ROOT / "icon" / "logo.svg"
AVATAR = ROOT / "icon" / "head.PNG"

WIDTH, HEIGHT = 1200, 630
CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]


def find_chrome() -> str | None:
    for p in CHROME_CANDIDATES:
        if Path(p).exists():
            return p
    return None


def load_inliner():
    """复用 build-inline-icons.py 里的 logo 解析 / 清理工具。"""
    spec = importlib.util.spec_from_file_location(
        "inline_icons", ROOT / "build-inline-icons.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def data_uri(path: Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def build_html() -> str:
    if not TEMPLATE.exists():
        sys.exit(f"找不到模板 {TEMPLATE}")
    html = TEMPLATE.read_text(encoding="utf-8")

    # 字体内联：file:// 页面里 @font-face 直接引本地文件会被当作跨源，必须走 data URI
    if not FONT.exists():
        sys.exit(f"找不到 {FONT}，先跑 build-font-subset.py")
    html = html.replace("__FONT_DATA_URI__", data_uri(FONT, "font/woff2"))

    # logo 内联（顺便借包围盒重算 viewBox）
    bi = load_inliner()
    root_tag, body = bi.split_root(bi.read_svg(LOGO), LOGO)
    bbox = bi.ink_bbox(body)
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = max(x1 - x0, y1 - y0) * 0.05
        viewbox = f"{x0 - pad:.2f} {y0 - pad:.2f} {x1 - x0 + pad * 2:.2f} {y1 - y0 + pad * 2:.2f}"
    else:
        viewbox = bi.viewbox_of(root_tag)
    html = html.replace("__LOGO_VIEWBOX__", viewbox)
    html = html.replace("__LOGO_BODY__", bi.clean_body(body))

    # 头像：同一目录下用相对路径，Chrome 允许 file:// 页面加载同目录资源
    html = html.replace("__AVATAR_SRC__", AVATAR.relative_to(ROOT).as_posix())
    return html


def main() -> int:
    chrome = find_chrome()
    if not chrome:
        sys.exit("没找到 Chrome，请自己用浏览器打开 .og-render.html 截图 1200×630 后另存为 icon/og-cover.png")

    render = ROOT / ".og-render.html"
    render.write_text(build_html(), encoding="utf-8")
    profile = ROOT / ".chrome-profile"

    if OUT.exists():
        OUT.unlink()

    cmd = [
        chrome,
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-crash-reporter",
        "--disable-breakpad",
        "--no-first-run",
        "--hide-scrollbars",
        f"--user-data-dir={profile}",
        f"--crash-dumps-dir={profile / 'crash'}",
        "--force-device-scale-factor=1",
        "--virtual-time-budget=6000",
        f"--window-size={WIDTH},{HEIGHT}",
        f"--screenshot={OUT}",
        render.as_uri(),
    ]
    print("正在渲染", WIDTH, "×", HEIGHT, "…")
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Chrome 截图后会一直挂着不退，轮询文件出现即可收工
    deadline = time.time() + 60
    while time.time() < deadline:
        if OUT.exists() and OUT.stat().st_size > 0:
            time.sleep(0.4)          # 等文件写完整
            break
        if proc.poll() is not None:
            break
        time.sleep(0.3)
    else:
        print("等待 Chrome 超时", file=sys.stderr)

    if proc.poll() is None:
        proc.send_signal(signal.SIGTERM)
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()

    if not OUT.exists() or OUT.stat().st_size == 0:
        print("渲染失败，没拿到 PNG", file=sys.stderr)
        return 1

    print(f"已生成 {OUT.relative_to(ROOT)}（{OUT.stat().st_size / 1024:.1f} KB，"
          f"{WIDTH}×{HEIGHT}）")
    print("提示：X 会缓存旧预览，换图后到 https://cards-dev.twitter.com/validator 或"
          "加 ?v=2 重新抓取。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
