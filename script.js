/* ============================================================
 * Stukdee 的精神小屋 —— 3D 卡片翻转轮播
 * ============================================================ */

/* ---------- 卡片数据 ---------- */
const INFO_CARDS = [
  {
    type: "hero",
    emoji: "✨",
    title: "Stukdee的精神小屋",
    subtitle: "(｡･ω･｡)ﾉ♡ 欢迎光临～",
  },
  {
    type: "info",
    emoji: "🏷️",
    title: "昵称 & 别称",
    html:
      '本名 <strong>Stukdee</strong><br/>小名：<strong>小克 / 果果 / 果子</strong><br/>(´･ω･`)？随便叫哪个都行啦～',
  },
  {
    type: "info",
    emoji: "🎨",
    title: "爱做的事",
    html:
      '制作小游戏 🎮 · 画画 🖼️<br/>看电视 📺 · 研究古籍 📜<br/>（仍在寻找中…）(｡◕‿◕｡)✧',
  },
  {
    type: "info",
    emoji: "🥛",
    title: "特仑苏信仰",
    html:
      '是 <strong>特仑苏🥛</strong> 的忠实粉丝！<br/>不是所有牛奶都叫特仑苏～<br/>(￣▽￣)ゞ 咕咚咕咚',
  },
  {
    type: "info",
    emoji: "🍫",
    title: "明治巧克力控",
    html:
      '<strong>明治巧克力🍫</strong> 忠实粉丝报到！<br/>特浓牛奶味最好吃！(¯﹃¯)<br/>谁赞成？谁反对？ヾ(≧▽≦*)o',
  },
  {
    type: "info",
    emoji: "🐱",
    title: "猫咪统治世界！",
    html:
      '喜欢猫咪 🐱<br/><strong>猫咪快点统治世界吧！！！</strong><br/>(=^･ω･^=) 喵～',
  },
  {
    type: "info",
    emoji: "🤝",
    title: "一起交朋友呀！",
    html:
      '在这里遇到就是缘分 ✨<br/>一起来交朋友吧！<br/>(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 拉钩～',
  },
];

const ACCOUNTS = [
  { name: "GitHub", icon: "github.svg", handle: "Stukdee", url: "https://github.com/Stukdee/" },
  { name: "Bilibili", icon: "bilibili.svg", handle: "space.bilibili.com/3546769633840089", url: "https://space.bilibili.com/3546769633840089" },
  { name: "抖音", icon: "tik-tok-outlined.svg", handle: "抖音号：81963247021", url: "" },
  { name: "Dev.to", icon: "dev.svg", handle: "dev.to/stukdee", url: "https://dev.to/stukdee" },
  { name: "Pixiv", icon: "pixiv.svg", handle: "pixiv.net/users/108207052", url: "https://www.pixiv.net/users/108207052" },
  { name: "X (Twitter)", icon: "x.svg", handle: "@StukdeeGorye", url: "https://x.com/StukdeeGorye" },
  { name: "itch.io", icon: "itch-io.svg", handle: "stukdee.itch.io", url: "https://stukdee.itch.io/" },
  { name: "Bluesky", icon: "bluesky.svg", handle: "stukdee.bsky.social", url: "https://bsky.app/profile/stukdee.bsky.social" },
  { name: "Reddit", icon: "reddit.svg", handle: "u/StukdeeGorye", url: "https://www.reddit.com/user/StukdeeGorye/" },
  { name: "Discord", icon: "discord.svg", handle: "Stukdee Gorye · discord.gg/nq7uBq2M", url: "https://discord.gg/nq7uBq2M" },
  { name: "Hugging Face", icon: "huggingface.svg", handle: "huggingface.co/Stukdee", url: "https://huggingface.co/Stukdee" },
];

/* ---------- DOM ---------- */
const ring = document.getElementById("ring");
const carousel = document.getElementById("carousel");
const themeToggle = document.getElementById("themeToggle");
const progress = document.getElementById("progress");
const scrollHint = document.getElementById("scrollHint");

/* ---------- 状态 ---------- */
let cards = []; // {el, data}
let angleStep = 0;
let radius = 600;
let targetRotation = 0;
let currentRotation = 0;
let activeIndex = 0;
let snapTimer = null;
let hasInteracted = false;

/* ---------- 加载账号 SVG 图标 ---------- */
async function loadIconSvg(name) {
  try {
    const res = await fetch("icon/" + name);
    if (!res.ok) throw new Error("not found");
    const svg = await res.text();
    // 内嵌时移除固定 width/height，让 CSS 控制
    return svg
      .replace(/width="[^"]*"/, 'width="100%"')
      .replace(/height="[^"]*"/, 'height="100%"');
  } catch (e) {
    // fallback：使用 img 标签
    return `<img src="icon/${name}" alt="${name}" style="width:100%;height:100%" />`;
  }
}

/* ---------- 渲染单张卡片 ---------- */
function buildCardHTML(card, index, iconSvg) {
  const idx2 = String(index + 1).padStart(2, "0");

  if (card.type === "hero") {
    return `
      <div class="card card--hero" data-index="${index}">
        <span class="card__badge">★</span>
        <img src="icon/head.PNG" alt="Stukdee" class="avatar" />
        <h2 class="card__title">${card.title}</h2>
        <p class="card__subtitle">${card.subtitle}</p>
      </div>`;
  }

  if (card.type === "account") {
    const clickable = card.url ? "card--account" : "card--account card--no-link";
    return `
      <div class="card ${clickable}" data-index="${index}" data-url="${card.url || ""}">
        <span class="card__badge">${idx2}</span>
        <div class="account-icon">${iconSvg}</div>
        <h3 class="account-name">${card.name}</h3>
        <p class="account-handle">${card.handle}</p>
        <span class="account-cta">${card.url ? "前往 →" : "记下它 📝"}</span>
      </div>`;
  }

  return `
    <div class="card card--info" data-index="${index}">
      <span class="card__badge">${idx2}</span>
      <div class="card__emoji">${card.emoji}</div>
      <h3 class="card__title">${card.title}</h3>
      <p class="card__text">${card.html}</p>
    </div>`;
}

/* ---------- 初始化卡片 ---------- */
async function initCards() {
  // 合并所有卡片
  const all = [...INFO_CARDS];
  for (const acc of ACCOUNTS) {
    const svg = await loadIconSvg(acc.icon);
    all.push({ type: "account", ...acc, _svg: svg });
  }

  cards = all.map((data, index) => {
    const el = document.createElement("div");
    el.innerHTML = buildCardHTML(
      data,
      index,
      data._svg
    );
    const cardEl = el.firstElementChild;
    ring.appendChild(cardEl);
    return { el: cardEl, data, index };
  });

  layout();
  buildProgress();
  bindCardClicks();
}

/* ---------- 布局：计算角度、半径、定位 ---------- */
function layout() {
  const count = cards.length;
  angleStep = 360 / count;
  // 直接读取 CSS 计算后的实际尺寸（CSS 用 clamp+vmin 动态调整）
  const cardH = ring.offsetHeight;
  // 不穿模条件：相邻卡片弦长 2R·sin(step/2) ≥ cardH
  const stepRad = (angleStep * Math.PI) / 180;
  const minRadius = cardH / (2 * Math.sin(stepRad / 2));
  // perspective 远大于 radius，避免正面卡片被放大太多
  radius = Math.max(450, minRadius * 1.15);

  cards.forEach(({ el }, i) => {
    const angle = -i * angleStep;
    el.style.transform = `rotateX(${angle}deg) translateZ(${radius}px)`;
  });

  applyRotation();
  updateCardStates();
}

/* ---------- 应用旋转 ---------- */
function applyRotation() {
  ring.style.transform = `rotateX(${currentRotation}deg)`;
}

/* ---------- 更新卡片可见状态 / 当前聚焦 ---------- */
function updateCardStates() {
  // 卡片 i 总旋转 = -i*step + currentRotation；正面时 = 0 → currentRotation = i*step
  let idx = Math.round(currentRotation / angleStep);
  idx = ((idx % cards.length) + cards.length) % cards.length;

  if (idx !== activeIndex) {
    activeIndex = idx;
    updateProgress();
  }

  cards.forEach(({ el }, i) => {
    // 该卡片相对正面的角度差
    let diff = (currentRotation - i * angleStep) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const absDiff = Math.abs(diff);

    // 背面或远侧面 → 淡化
    if (absDiff > 70) {
      el.classList.add("far");
    } else {
      el.classList.remove("far");
    }
    if (i === activeIndex) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

/* ---------- 进度指示 ---------- */
function buildProgress() {
  progress.innerHTML = "";
  cards.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "progress__dot";
    dot.addEventListener("click", () => goTo(i));
    progress.appendChild(dot);
  });
  updateProgress();
}

function updateProgress() {
  const dots = progress.querySelectorAll(".progress__dot");
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === activeIndex);
  });
}

/* ---------- 跳转到指定卡片 ---------- */
function goTo(index) {
  // 选择最短路径
  const currentIdx = activeIndex;
  let delta = index - currentIdx;
  if (delta > cards.length / 2) delta -= cards.length;
  if (delta < -cards.length / 2) delta += cards.length;
  targetRotation += delta * angleStep;
  markInteracted();
  scheduleSnap(0);
}

function next() {
  targetRotation += angleStep;
  markInteracted();
  scheduleSnap();
}
function prev() {
  targetRotation -= angleStep;
  markInteracted();
  scheduleSnap();
}

/* ---------- 吸附到最近卡片 ---------- */
function scheduleSnap(delay = 140) {
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => {
    const nearest = Math.round(targetRotation / angleStep) * angleStep;
    targetRotation = nearest;
  }, delay);
}

/* ---------- 标记已交互（隐藏提示） ---------- */
function markInteracted() {
  if (hasInteracted) return;
  hasInteracted = true;
  scrollHint.classList.add("hide");
}

/* ---------- 事件：滚轮 ---------- */
function onWheel(e) {
  e.preventDefault();
  // 向下滚 deltaY>0 → rotation 增大 → 下一张
  targetRotation += e.deltaY * 0.45;
  markInteracted();
  scheduleSnap();
}

/* ---------- 事件：触摸 ---------- */
let touchStartY = 0;
let touchStartRotation = 0;
let touchActive = false;

function onTouchStart(e) {
  touchStartY = e.touches[0].clientY;
  touchStartRotation = targetRotation;
  touchActive = true;
  clearTimeout(snapTimer);
  markInteracted();
}

function onTouchMove(e) {
  if (!touchActive) return;
  e.preventDefault();
  const dy = touchStartY - e.touches[0].clientY; // 手指上滑为正 → 下一张
  targetRotation = touchStartRotation + dy * 0.5;
}

function onTouchEnd() {
  if (!touchActive) return;
  touchActive = false;
  scheduleSnap();
}

/* ---------- 事件：键盘 ---------- */
function onKey(e) {
  if (e.key === "ArrowDown" || e.key === "PageDown") {
    e.preventDefault();
    next();
  } else if (e.key === "ArrowUp" || e.key === "PageUp") {
    e.preventDefault();
    prev();
  } else if (e.key === "Home") {
    e.preventDefault();
    goTo(0);
  } else if (e.key === "End") {
    e.preventDefault();
    goTo(cards.length - 1);
  }
}

/* ---------- 事件：卡片点击（账号跳转） ---------- */
function bindCardClicks() {
  cards.forEach(({ el, data }) => {
    if (data.type !== "account") return;
    el.addEventListener("click", () => {
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    });
  });
}

/* ---------- 事件：拖拽（鼠标） ---------- */
let dragStartY = 0;
let dragStartRotation = 0;
let dragging = false;

function onMouseDown(e) {
  dragging = true;
  dragStartY = e.clientY;
  dragStartRotation = targetRotation;
  clearTimeout(snapTimer);
  markInteracted();
  document.body.style.cursor = "grabbing";
}

function onMouseMove(e) {
  if (!dragging) return;
  const dy = dragStartY - e.clientY; // 鼠标向上拖为正 → 下一张
  targetRotation = dragStartRotation + dy * 0.5;
}

function onMouseUp() {
  if (!dragging) return;
  dragging = false;
  document.body.style.cursor = "";
  scheduleSnap();
}

/* ---------- 事件：主题切换 ---------- */
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

/* ---------- 动画循环 ---------- */
function animate() {
  const diff = targetRotation - currentRotation;
  if (Math.abs(diff) < 0.02) {
    currentRotation = targetRotation;
  } else {
    currentRotation += diff * 0.16;
  }
  applyRotation();
  updateCardStates();
  requestAnimationFrame(animate);
}

/* ---------- 绑定事件 ---------- */
function bindEvents() {
  // 滚轮
  const stage = document.querySelector(".stage");
  stage.addEventListener("wheel", onWheel, { passive: false });
  // 触摸
  stage.addEventListener("touchstart", onTouchStart, { passive: false });
  stage.addEventListener("touchmove", onTouchMove, { passive: false });
  stage.addEventListener("touchend", onTouchEnd);
  // 鼠标拖拽
  stage.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  // 键盘
  window.addEventListener("keydown", onKey);
  // 主题
  themeToggle.addEventListener("click", toggleTheme);
  // 窗口尺寸
  window.addEventListener("resize", () => {
    layout();
  });
  // 防止页面整体滚动
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.target.closest(".stage")) e.preventDefault();
    },
    { passive: false }
  );
}

/* ---------- 启动 ---------- */
(async function start() {
  initTheme();
  await initCards();
  bindEvents();
  requestAnimationFrame(animate);
})();
