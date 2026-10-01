#!/usr/bin/env python3
"""就地内联 index.html 中的图标 SVG（构建脚本，可重复运行）。

1. <img class="ico" src="icon/xxx.svg"> → <svg class="ico" ...>
   内联后 fill="currentColor" 能跟随 CSS 颜色，也少了一堆网络请求。
2. <img class="logo" src="icon/logo.svg"> → 换算掉毫米单位、按图形内容重新裁 viewBox，
   这样放大缩小都不会被 A4 画布挤在中间。

用法：python3 build-inline-icons.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "index.html"

IMG_RE = re.compile(
    r'<img class="(?P<cls>[^"]*)" src="(?P<src>icon/[^"]+\.svg)"(?P<attrs>[^>]*?)>'
)
NUM = r"-?\d+(?:\.\d+)?(?:[eE]-?\d+)?"
# 一段路径命令：命令字母 + 后面跟着的参数
SEG_RE = r"[MmZzLlHhVvCcSsQqTtAa][^MmZzLlHhVvCcSsQqTtAa]*"


def read_svg(path: Path) -> str:
    svg = path.read_text(encoding="utf-8")
    svg = re.sub(r"<\?xml.*?\?>", "", svg, flags=re.S)
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
    return svg.strip()


def split_root(src: str, path: Path) -> tuple[str, str]:
    """返回 (根标签, 内部内容)。"""
    root = re.search(r"<svg\b[^>]*>", src, flags=re.S)
    if not root:
        raise ValueError(f"{path}: 找不到 <svg> 根元素")
    body = src[root.end():].rsplit("</svg>", 1)[0].strip()
    return root.group(0), body


def viewbox_of(tag: str) -> str:
    vb = re.search(r'viewBox="([^"]+)"', tag)
    if vb:
        return vb.group(1)
    w = re.search(r'width="([\d.]+)', tag)
    h = re.search(r'height="([\d.]+)', tag)
    return f"0 0 {w.group(1) if w else 24} {h.group(1) if h else 24}"


def ink_bbox(body: str) -> tuple[float, float, float, float] | None:
    """估算图形包围盒（用于给 logo 重新裁 viewBox）。

    - 相对命令（小写）会累加当前点，否则 Inkscape 里的 `l -0.24,57.9` 会被当成
      绝对坐标，把 viewBox 撑到离谱；
    - 曲线直接用控制点近似（控制多边形一定包住曲线，框只会略大一点点）；
    - 每个 <path> 都要把当前点和子路径起点归零，不能跨元素累积。

    另外 `\\bd=` 必须带词边界，不然 groupmode="layer"、id="xxx" 也会被当成路径数据。
    """
    xs: list[float] = []
    ys: list[float] = []

    def note(x: float, y: float) -> None:
        xs.append(x)
        ys.append(y)

    for d in re.findall(r'\bd="([^"]+)"', body):
        cur = (0.0, 0.0)     # 当前点
        start = (0.0, 0.0)   # 子路径起点（Z 之后回到这里）

        for seg in re.findall(SEG_RE, d):
            cmd, args = seg[0], [float(n) for n in re.findall(NUM, seg[1:])]
            rel = cmd.islower()
            c = cmd.upper()

            def pt(i: int) -> tuple[float, float]:
                """第 i 组坐标换算成绝对坐标。"""
                x, y = args[i], args[i + 1]
                if rel:
                    x, y = cur[0] + x, cur[1] + y
                return x, y

            if c == "M":
                for i in range(0, len(args) - 1, 2):
                    p = pt(i)
                    if i == 0:
                        start = p
                    cur = p
                    note(*p)
            elif c == "L":
                for i in range(0, len(args) - 1, 2):
                    cur = pt(i)
                    note(*cur)
            elif c == "H":
                for i in range(len(args)):
                    cur = (args[i] + cur[0] if rel else args[i], cur[1])
                    note(*cur)
            elif c == "V":
                for i in range(len(args)):
                    cur = (cur[0], args[i] + cur[1] if rel else args[i])
                    note(*cur)
            elif c in "CSQ":
                step = 6 if c == "C" else 4
                for i in range(0, len(args) - step + 1, step):
                    for j in range(0, step - 2, 2):
                        note(*pt(i + j))
                    cur = pt(i + step - 2)
            elif c == "T":
                for i in range(0, len(args) - 1, 2):
                    cur = pt(i)
                    note(*cur)
            elif c == "A":
                for i in range(0, len(args) - 6, 7):
                    cur = pt(i + 5)
                    note(*cur)
                    # 圆弧用它自己的半径保守外扩一下
                    r = args[i]
                    xs.extend([cur[0] - r, cur[0] + r])
                    ys.extend([cur[1] - r, cur[1] + r])
            elif c == "Z":
                cur = start

    for el in re.findall(r"<(?:ellipse|circle)\b[^>]*>", body):
        # 只认绝对坐标属性（本仓库 logo.svg 用的是绝对 cx/cy/rx/ry）
        def g(attr: str) -> float:
            m = re.search(rf'\b{attr}="({NUM})"', el)
            return float(m.group(1)) if m else 0.0

        if el.startswith("<ellipse"):
            cx, cy, rx, ry = g("cx"), g("cy"), g("rx"), g("ry")
        else:
            cx, cy = g("cx"), g("cy")
            rx = ry = g("r")
        xs.extend([cx - rx, cx + rx])
        ys.extend([cy - ry, cy + ry])

    if not xs or not ys:
        return None
    return min(xs), min(ys), max(xs), max(ys)


def clean_body(body: str) -> str:
    """丢掉 Inkscape 的编辑器元数据，并去掉 id（同一个 logo 内联两次会撞 id）。"""
    body = re.sub(r"<(sodipodi|inkscape):[a-zA-Z-]+\b[^>]*/>", "", body)
    body = re.sub(r"<(sodipodi|inkscape):[a-zA-Z-]+\b[^>]*>.*?</\1:[a-zA-Z-]+>", "", body, flags=re.S)
    body = re.sub(r'\s(?:id|inkscape:label|inkscape:groupmode|sodipodi:nodetypes|sodipodi:docname)="[^"]*"', "", body)
    body = re.sub(r"\n\s+", " ", body)
    body = re.sub(r"\s{2,}", " ", body)
    return body.strip()


def tag(attrs: str) -> str:
    """拼属性时顺手去重，避免同名属性出现两次。"""
    seen: set[str] = set()
    out = []
    for name, value in re.findall(r'([a-zA-Z-]+)="([^"]*)"', attrs):
        if name in seen:
            continue
        seen.add(name)
        out.append(f'{name}="{value}"')
    return (" " + " ".join(out)) if out else ""


def icon_svg(path: Path, cls: str, extra: str) -> str:
    root, body = split_root(read_svg(path), path)
    attrs = (f'class="{cls}" viewBox="{viewbox_of(root)}" aria-hidden="true"'
             f' focusable="false" data-icon="{path.name}"{extra}')
    return f"<svg{tag(attrs)}>{clean_body(body)}</svg>"


def logo_svg(path: Path, cls: str, extra: str) -> str:
    root, body = split_root(read_svg(path), path)
    vb = [float(x) for x in viewbox_of(root).split()]
    bbox = ink_bbox(body)
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = max(x1 - x0, y1 - y0) * 0.05
        x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    else:
        x0, y0 = vb[0], vb[1]
        x1, y1 = vb[0] + vb[2], vb[1] + vb[3]
    attrs = (f'class="{cls}" viewBox="{x0:.2f} {y0:.2f} {x1 - x0:.2f} {y1 - y0:.2f}"'
             f' preserveAspectRatio="xMidYMid meet" aria-hidden="true"'
             f' focusable="false" data-icon="{path.name}"{extra}')
    return f"<svg{tag(attrs)}>{clean_body(body)}</svg>"

def main() -> int:
    html = HTML.read_text(encoding="utf-8")
    cache: dict[tuple[str, str, str], str] = {}

    def repl(m: re.Match[str]) -> str:
        cls, src, attrs = m.group("cls"), m.group("src"), m.group("attrs")
        path = ROOT / src
        if not path.exists():
            print(f"  ! 缺少文件 {src}，跳过", file=sys.stderr)
            return m.group(0)
        keep = "".join(
            f' {a}="{v}"'
            for a, v in re.findall(r'([a-zA-Z-]+)="([^"]*)"', attrs)
            if a in {"width", "height", "loading", "decoding", "fetchpriority"}
        )
        key = (src, cls, keep)
        if key not in cache:
            fn = logo_svg if path.name == "logo.svg" else icon_svg
            cache[key] = fn(path, cls, keep)
        return cache[key]

    out, n = IMG_RE.subn(repl, html)
    if n == 0:
        print('没有找到可内联的 <img src="icon/*.svg">（可能已经内联过了）')
        return 0
    HTML.write_text(out, encoding="utf-8")
    print(f"已内联 {n} 处 SVG 图标 → index.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
