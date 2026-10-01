#!/usr/bin/env python3
"""由 icon/logo.svg 生成网页图标 icon/favicon.svg（构建脚本，可重复运行）。

logo.svg 是 Inkscape 按 A4 画布 + 毫米单位导出的：直接丢给浏览器当 favicon，
会整张 A4 缩进 16×16 的格子里 —— 结果又小又糊。这里重新处理：

1. 按图形实际范围裁 viewBox（复用 build-inline-icons.py 里的包围盒计算）；
2. 补一层浅色/深色都能看清的圆形底，免得深色标签栏里白底变黑洞；
3. 原图线宽是"毫米"级的，缩到 16~32px 几乎看不见，这里统一加粗到 8 用户单位。

用法：python3 build-favicon.py
"""

from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "icon" / "logo.svg"
OUT = ROOT / "icon" / "favicon.svg"

# 小尺寸下的线宽（用户单位；裁切后的画布大约 254×248）
STROKE = 8
# 圆形底
BG_FILL = "#fff6f9"      # 与首页 --page 同色
BG_STROKE = "#ff8fab"


def load_inliner():
    """借用 build-inline-icons.py 里的 SVG 读取 / 包围盒工具，避免复制一份。"""
    spec = importlib.util.spec_from_file_location(
        "inline_icons", ROOT / "build-inline-icons.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def thicken(body: str, stroke: float) -> str:
    """给所有描边元素统一线宽：改 style 里的 stroke-width，没有就补一个属性。"""
    def fix_style(m: re.Match[str]) -> str:
        style = m.group("style")
        if re.search(r"stroke-width\s*:", style):
            style = re.sub(r"stroke-width\s*:[^;]*", f"stroke-width:{stroke}", style)
        elif "stroke:" in style:          # 有描边色才需要线宽
            style = style.rstrip(";") + f";stroke-width:{stroke}"
        return f'style="{style}"'

    body = re.sub(r'style="(?P<style>[^"]*)"', fix_style, body)
    # 用 stroke-width 属性而不是 style 的（旧式 SVG）
    return re.sub(r'stroke-width="[^"]*"', f'stroke-width="{stroke}"', body)


def main() -> int:
    if not SRC.exists():
        print(f"找不到 {SRC}", file=sys.stderr)
        return 1
    bi = load_inliner()

    root, body = bi.split_root(bi.read_svg(SRC), SRC)
    bbox = bi.ink_bbox(body)
    if bbox is None:
        print("算不出图形范围，放弃", file=sys.stderr)
        return 1
    x0, y0, x1, y1 = bbox
    pad = max(x1 - x0, y1 - y0) * 0.06
    # 图标要是正方形，水平/垂直各取较长边，保证等比不变形
    w, h = x1 - x0 + pad * 2, y1 - y0 + pad * 2
    side = max(w, h)
    vx = x0 - pad - (side - w) / 2
    vy = y0 - pad - (side - h) / 2

    inner = bi.clean_body(thicken(body, STROKE))
    bg = (
        f'<circle cx="{vx + side / 2:.2f}" cy="{vy + side / 2:.2f}" '
        f'r="{side / 2 - STROKE / 4:.2f}" fill="{BG_FILL}" stroke="{BG_STROKE}" '
        f'stroke-width="{STROKE / 2}" />'
    )
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="{vx:.2f} {vy:.2f} {side:.2f} {side:.2f}" '
        'width="64" height="64" role="img" aria-label="Stukdee">\n'
        f"  {bg}\n"
        f"  <g>{inner}</g>\n"
        "</svg>\n"
    )
    OUT.write_text(svg, encoding="utf-8")
    print(f"已生成 {OUT.relative_to(ROOT)}（viewBox={vx:.2f} {vy:.2f} {side:.2f} {side:.2f}，"
          f"线宽={STROKE}，{OUT.stat().st_size / 1024:.1f} KB）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
