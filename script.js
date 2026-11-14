/**
 * Stukdee · 个人主页
 * 主题切换、动效开关、年龄计算、页脚年份、颜文字轮播，
 * 外加一整套小互动：字母弹跳、3D 倾斜、鼠标星尘、点击爱心、戳头像撒猫猫。
 * 没有任何依赖，也不用 React / Babel，断网也能正常显示。
 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ======================================================================
     0. 通用小工具 & 动效状态
     ====================================================================== */

  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fineMQ = window.matchMedia("(hover: hover) and (pointer: fine)");

  var MOTION_KEY = "stukdee_motion";
  var hasSavedMotion = false;
  var motionOff = reduceMQ.matches;

  try {
    var savedMotion = localStorage.getItem(MOTION_KEY);
    if (savedMotion === "off") {
      motionOff = true;
      hasSavedMotion = true;
    } else if (savedMotion === "on") {
      motionOff = false;
      hasSavedMotion = true;
    }
  } catch (e) {}

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(list) {
    return list[(Math.random() * list.length) | 0];
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  var live = document.getElementById("live");

  /* ======================================================================
     1. 粒子：点击爆开的小爱心 + 鼠标划过的星尘
     ====================================================================== */

  var FX = {
    click: ["♡", "✦", "✧", "🌸", "🐾", "⭐", "💖", "🎀"],
    avatar: ["🐱", "🐾", "💖", "♡", "🎀", "⭐", "🍫", "🥛"],
    theme: ["🌙", "☀️", "✦", "⭐", "♡"],
    motion: ["✨", "⭐", "♡", "✦"],
    kao: ["♡", "💕", "✨", "🎀", "🐾"]
  };

  var fxLayer = null;

  function ensureFx() {
    if (motionOff) return null;
    if (!fxLayer) {
      fxLayer = document.createElement("div");
      fxLayer.className = "fx-layer";
      fxLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(fxLayer);
    }
    return fxLayer;
  }

  function clearFx() {
    if (fxLayer) fxLayer.textContent = "";
  }

  function makeParticle(layer, x, y, opts) {
    var emojis = opts.emojis || FX.click;
    var el = document.createElement("span");
    el.className = "fx";
    el.textContent = pick(emojis);
    el.style.fontSize = rand(opts.sizeMin || 12, opts.sizeMax || 20).toFixed(1) + "px";
    el.style.color = "var(--spark)";

    var angle = rand(0, Math.PI * 2);
    var dist = rand(opts.spreadMin || 34, opts.spreadMax || 92);
    var dx = Math.cos(angle) * dist;
    var dy = Math.sin(angle) * dist - rand(10, 34);

    el.style.setProperty("--x", x.toFixed(1) + "px");
    el.style.setProperty("--y", y.toFixed(1) + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", Math.round(rand(-200, 200)) + "deg");
    el.style.setProperty("--s", rand(0.7, 1.35).toFixed(2));
    el.style.setProperty("--dur", Math.round(rand(720, 1150)) + "ms");

    layer.appendChild(el);
    el.addEventListener("animationend", function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    return el;
  }

  function burst(x, y, opts) {
    opts = opts || {};
    var layer = ensureFx();
    if (!layer) return;

    var count = opts.count || 7;
    // 粒子别无限堆，超过 90 个就先清掉最老的
    while (layer.childElementCount > 90 && layer.firstChild) {
      layer.removeChild(layer.firstChild);
    }

    for (var i = 0; i < count; i++) {
      makeParticle(layer, x, y, {
        emojis: opts.emojis,
        spreadMin: opts.spreadMin || 30,
        spreadMax: opts.spreadMax || 88,
        sizeMin: opts.sizeMin || 12,
        sizeMax: opts.sizeMax || 20
      });
    }
  }

  function spark(x, y) {
    var layer = ensureFx();
    if (!layer) return;
    if (layer.childElementCount > 60 && layer.firstChild) {
      layer.removeChild(layer.firstChild);
    }
    var el = document.createElement("span");
    el.className = "fx";
    el.textContent = Math.random() < 0.55 ? "✦" : "♡";
    el.style.fontSize = rand(9, 14).toFixed(1) + "px";
    el.style.color = "var(--spark)";
    el.style.setProperty("--x", x.toFixed(1) + "px");
    el.style.setProperty("--y", y.toFixed(1) + "px");
    el.style.setProperty("--dx", rand(-12, 12).toFixed(1) + "px");
    el.style.setProperty("--dy", rand(-34, -18).toFixed(1) + "px");
    el.style.setProperty("--rot", Math.round(rand(-90, 90)) + "deg");
    el.style.setProperty("--s", "0.45");
    el.style.setProperty("--dur", Math.round(rand(620, 900)) + "ms");
    layer.appendChild(el);
    el.addEventListener("animationend", function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  /* ======================================================================
     2. 动效开关（右上角 ✨）
     ====================================================================== */

  var motionToggle = document.getElementById("motion-toggle");
  var motionIcon = motionToggle && motionToggle.querySelector(".motion-icon");

  function paintMotion() {
    if (!motionToggle) return;
    // aria-pressed = 「页面动效」是否开启；暂停时 icon 变成 💤
    motionToggle.setAttribute("aria-pressed", motionOff ? "false" : "true");
    motionToggle.setAttribute("aria-label", "页面动效");
    motionToggle.title = motionOff ? "开启动效" : "暂停动效";
    if (motionIcon) motionIcon.textContent = motionOff ? "💤" : "✨";
  }

  function startMotionLoops() {
    startKaomoji();
    startStatus();
    startAmbient();
    startCatWalk();
  }

  function applyMotion() {
    root.setAttribute("data-motion", motionOff ? "off" : "on");
    paintMotion();
    if (motionOff) {
      clearFx();
      stopKaomoji();
      stopStatus();
      stopAmbient();
      stopCatRain();
      stopCatWalk();
      hidePet();
      root.style.setProperty("--par-x", "0");
      root.style.setProperty("--par-y", "0");
    }
  }

  applyMotion();

  if (motionToggle) {
    motionToggle.addEventListener("click", function () {
      motionOff = !motionOff;
      hasSavedMotion = true;
      try { localStorage.setItem(MOTION_KEY, motionOff ? "off" : "on"); } catch (e) {}
      applyMotion();

      if (motionIcon) {
        motionIcon.classList.remove("wiggle-once");
        void motionIcon.offsetWidth;
        motionIcon.classList.add("wiggle-once");
        window.setTimeout(function () {
          motionIcon.classList.remove("wiggle-once");
        }, 700);
      }

      if (!motionOff) {
        var rect = motionToggle.getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 12,
          emojis: FX.motion,
          spreadMin: 30,
          spreadMax: 80
        });
        startMotionLoops();
      }
    });
  }

  if (reduceMQ.addEventListener) {
    reduceMQ.addEventListener("change", function (e) {
      // 用户自己选过就听用户的，没选过就跟系统走
      if (hasSavedMotion) return;
      motionOff = e.matches;
      applyMotion();
      if (!motionOff) startMotionLoops();
    });
  } else if (reduceMQ.addListener) {
    reduceMQ.addListener(function (e) {
      if (hasSavedMotion) return;
      motionOff = e.matches;
      applyMotion();
      if (!motionOff) startMotionLoops();
    });
  }

  /* ======================================================================
     3. 主题切换
     ====================================================================== */

  var KEY = "stukdee_theme";
  var toggle = document.getElementById("theme-toggle");
  var icon = toggle && toggle.querySelector(".theme-icon");

  function paintTheme() {
    if (icon) icon.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }

  function applyTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    paintTheme();
  }

  function themeBurst() {
    if (!toggle || motionOff) return;
    var rect = toggle.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      count: 10,
      emojis: FX.theme,
      spreadMin: 24,
      spreadMax: 66
    });
  }

  function setTheme(next, celebrate) {
    if (!celebrate) {
      applyTheme(next);
      return;
    }

    if (icon) {
      icon.classList.remove("spin-once");
      void icon.offsetWidth;
      icon.classList.add("spin-once");
      window.setTimeout(function () { icon.classList.remove("spin-once"); }, 700);
    }

    if (!motionOff && document.startViewTransition && toggle) {
      var rect = toggle.getBoundingClientRect();
      root.style.setProperty("--vt-x", (rect.left + rect.width / 2).toFixed(1) + "px");
      root.style.setProperty("--vt-y", (rect.top + rect.height / 2).toFixed(1) + "px");
      var applied = false;
      var applyOnce = function () {
        if (applied) return;
        applied = true;
        applyTheme(next);
      };
      try {
        var vt = document.startViewTransition(applyOnce);
        if (vt && vt.finished) {
          vt.finished.then(themeBurst).catch(themeBurst);
        }
      } catch (err) {
        applyOnce();
        themeBurst();
      }
    } else {
      applyTheme(next);
      themeBurst();
    }
  }

  // 也支持 ?theme=dark / ?theme=light 临时指定（方便分享链接）
  try {
    var want = (location.search.match(/[?&]theme=(dark|light)\b/) || [])[1];
    if (want) setTheme(want, false);
  } catch (e) {}

  paintTheme();
  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }
  // 用户没手动选过时，跟随系统
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSystemChange = function (e) {
      if (!localStorage.getItem(KEY)) setTheme(e.matches ? "dark" : "light", false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  } catch (e) {}

  /* ======================================================================
     4. 名字逐字拆开：渐变 + 悬停弹跳
     ====================================================================== */

  var title = document.querySelector(".card-title");
  if (title) {
    var name = (title.textContent || "").trim();
    if (name) {
      title.setAttribute("aria-label", name);
      title.textContent = "";
      var frag = document.createDocumentFragment();
      for (var n = 0; n < name.length; n++) {
        var letter = document.createElement("span");
        letter.className = "letter";
        letter.setAttribute("aria-hidden", "true");
        letter.style.setProperty("--i", n);
        letter.textContent = name.charAt(n);
        frag.appendChild(letter);
      }
      var titleSpark = document.createElement("span");
      titleSpark.className = "title-spark";
      titleSpark.setAttribute("aria-hidden", "true");
      titleSpark.textContent = "✦";
      frag.appendChild(titleSpark);
      title.appendChild(frag);
    }
  }

  /* ======================================================================
     5. 年龄：按生日当天进位，顺便从 10 数到真实年龄
     ====================================================================== */

  var ageEl = document.getElementById("age");
  if (ageEl) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ageEl.getAttribute("data-birthday") || "");
    if (m) {
      var y = +m[1], mo = +m[2], d = +m[3];
      var now = new Date();
      var age = now.getFullYear() - y;
      var passed = now.getMonth() + 1 > mo ||
        (now.getMonth() + 1 === mo && now.getDate() >= d);
      if (!passed) age -= 1;

      if (age >= 0 && age < 200) {
        if (motionOff) {
          ageEl.textContent = age + " 岁";
        } else {
          var from = Math.max(0, age - 6);
          var start = performance.now();
          var duration = 900;
          var tick = function (nowTs) {
            var t = Math.min(1, (nowTs - start) / duration);
            var eased = 1 - Math.pow(1 - t, 3);
            ageEl.textContent = Math.round(from + (age - from) * eased) + " 岁";
            if (t < 1) requestAnimationFrame(tick);
            else ageEl.textContent = age + " 岁";
          };
          requestAnimationFrame(tick);
        }
      }
    }
  }

  /* ======================================================================
     6. 页脚年份
     ====================================================================== */

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ======================================================================
     7. 颜文字：自动换 + 点一下就换 + 撒爱心
     ====================================================================== */

  var kao = document.getElementById("kaomoji");
  var faces = [
    "(๑•̀ㅂ•́)و✧",
    "( ´ ▽ ` )ﾉ",
    "=^･ω･^=",
    "(◍•ᴗ•◍)",
    "( づ ωど)",
    "＼(^o^)／",
    "(｡･ω･｡)ﾉ♡",
    "(๑>ᴗ<๑)"
  ];
  var faceIndex = 0;
  var kaoTimer = null;

  function swapKaomoji(byUser) {
    if (!kao) return;
    faceIndex = (faceIndex + 1) % faces.length;
    kao.textContent = faces[faceIndex];
    kao.classList.remove("swap");
    void kao.offsetWidth;   // 重新触发动画
    kao.classList.add("swap");
    window.setTimeout(function () { kao.classList.remove("swap"); }, 520);

    if (byUser && !motionOff) {
      var rect = kao.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
        count: 9,
        emojis: FX.kao,
        spreadMin: 22,
        spreadMax: 64,
        sizeMin: 11,
        sizeMax: 18
      });
    }
  }

  function stopKaomoji() {
    if (kaoTimer) {
      window.clearInterval(kaoTimer);
      kaoTimer = null;
    }
  }

  function startKaomoji() {
    if (!kao || motionOff) return;
    stopKaomoji();
    kaoTimer = window.setInterval(function () { swapKaomoji(false); }, 3500);
  }

  if (kao) {
    startKaomoji();
    kao.addEventListener("click", function () {
      swapKaomoji(true);
      startKaomoji();   // 刚点完别马上又自动换
    });
  }

  /* ======================================================================
     7.5 状态牌：打字机 + 点击换一句 + 被别的互动插播
     ====================================================================== */

  var nowCard = document.getElementById("now-card");
  var nowText = document.getElementById("now-text");
  var nowEmoji = document.getElementById("now-emoji");
  var STATUS = [
    { e: "🐱", t: "喵～ 欢迎！" },
    { e: "🎮", t: "正在做小游戏…" },
    { e: "🎨", t: "画画中，勿扰～" },
    { e: "📺", t: "电视时间！" },
    { e: "📜", t: "研究古籍中…" },
    { e: "🥛", t: "特仑苏，续杯！" },
    { e: "🍫", t: "明治特浓牛奶味最好吃" },
    { e: "🐾", t: "猫咪巡逻中…" },
    { e: "💖", t: "一起交朋友呀！" },
    { e: "✨", t: "仍在寻找新爱好…" }
  ];
  var statusIndex = 0;
  var statusTypeTimer = null;
  var statusHoldTimer = null;
  var statusStarted = false;

  function statusEmoji(e) {
    if (nowEmoji) nowEmoji.textContent = e;
  }

  function statusLabel(text) {
    if (nowCard) {
      nowCard.setAttribute("aria-label", "果果的状态：" + text + "，点一下换一个");
    }
  }

  function typeStatus(item) {
    if (!nowText || !nowCard) return;
    window.clearInterval(statusTypeTimer);
    statusTypeTimer = null;
    statusEmoji(item.e);

    if (motionOff) {
      nowText.textContent = item.t;
      statusLabel(item.t);
      return;
    }

    nowText.textContent = "";
    var i = 0;
    statusTypeTimer = window.setInterval(function () {
      i++;
      nowText.textContent = item.t.slice(0, i);
      if (i >= item.t.length) {
        window.clearInterval(statusTypeTimer);
        statusTypeTimer = null;
        statusLabel(item.t);
      }
    }, 38);
  }

  function holdStatus(ms) {
    window.clearTimeout(statusHoldTimer);
    statusHoldTimer = window.setTimeout(function () {
      if (!motionOff) nextStatus();
    }, ms);
  }

  function renderStatus(item, hold) {
    typeStatus(item);
    holdStatus(hold || 6500);
  }

  function nextStatus() {
    statusIndex = (statusIndex + 1) % STATUS.length;
    renderStatus(STATUS[statusIndex], 6500);
  }

  // 别的互动可以插播一句，过几秒再回到轮播
  function sayStatus(emoji, text) {
    if (!nowCard) return;
    window.clearTimeout(statusHoldTimer);
    typeStatus({ e: emoji, t: text });
    holdStatus(4200);
  }

  function startStatus() {
    if (!nowCard || motionOff) return;
    if (!statusStarted) {
      statusStarted = true;
      statusIndex = 0;
      renderStatus(STATUS[0], 6500);
    } else {
      renderStatus(STATUS[statusIndex], 6500);
    }
  }

  function stopStatus() {
    window.clearInterval(statusTypeTimer);
    window.clearTimeout(statusHoldTimer);
    statusTypeTimer = null;
    statusHoldTimer = null;
    if (nowCard && nowText) {
      var item = STATUS[statusIndex];
      nowText.textContent = item.t;
      statusEmoji(item.e);
      statusLabel(item.t);
    }
  }

  if (nowCard) {
    nowCard.addEventListener("click", function (e) {
      nextStatus();
      if (motionOff) return;
      nowCard.classList.remove("pop");
      void nowCard.offsetWidth;
      nowCard.classList.add("pop");
      window.setTimeout(function () { nowCard.classList.remove("pop"); }, 500);
      var rect = nowCard.getBoundingClientRect();
      burst(e.clientX || (rect.left + rect.width / 2),
            e.clientY || (rect.top + rect.height / 2), {
        count: 7,
        emojis: ["✨", "♡", "🐾", "🐱"],
        spreadMin: 22,
        spreadMax: 60,
        sizeMin: 10,
        sizeMax: 17
      });
    });
  }

  /* ======================================================================
     8. 社交账号的入场序号（让它们一个接一个蹦出来）
     ====================================================================== */

  var socialItems = document.querySelectorAll(".socials li");
  for (var s = 0; s < socialItems.length; s++) {
    socialItems[s].style.setProperty("--i", s);
  }

  /* ======================================================================
     9. 3D 倾斜 + 跟随鼠标的柔光
     ====================================================================== */

  if (fineMQ.matches) {
    var tiltEls = document.querySelectorAll(".card, .profile");
    Array.prototype.forEach.call(tiltEls, function (el) {
      var ticking = false;
      var lastX = 0;
      var lastY = 0;

      el.addEventListener("pointerenter", function (e) {
        if (motionOff) return;
        // 进来的第一帧就把光斑放在鼠标处，不要从中心滑过来
        var rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });

      el.addEventListener("pointermove", function (e) {
        if (motionOff) return;
        lastX = e.clientX;
        lastY = e.clientY;
        if (ticking) return;
        ticking = true;
        // 一帧只更新一次，别让鼠标移动把整块面板重绘到卡顿
        requestAnimationFrame(function () {
          ticking = false;
          // 如果鼠标已经离开，就别再把手抖后的最后一帧写回去
          if (!el.matches(":hover")) return;
          var rect = el.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          var px = (lastX - rect.left) / rect.width;
          var py = (lastY - rect.top) / rect.height;

          el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--my", (py * 100).toFixed(1) + "%");

          if (!el.classList.contains("card")) return;
          el.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
          el.style.setProperty("--ry", ((px - 0.5) * 5).toFixed(2) + "deg");
        });
      });

      el.addEventListener("pointerleave", function () {
        // 只把倾斜扶正；--mx/--my 留在最后的位置，
        // 让柔光在原地淡出，而不是先跳回中心再消失。
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ======================================================================
     10. 鼠标星尘（只在鼠标设备上，慢慢跟着走）
     ====================================================================== */

  var lastTrailX = 0;
  var lastTrailY = 0;
  var lastTrailAt = 0;

  if (fineMQ.matches) {
    document.addEventListener("pointermove", function (e) {
      if (motionOff) return;
      var now = Date.now();
      if (now - lastTrailAt < 70) return;
      var dx = e.clientX - lastTrailX;
      var dy = e.clientY - lastTrailY;
      if (dx * dx + dy * dy < 900) return;   // 移动超过 30px 才撒一颗
      lastTrailX = e.clientX;
      lastTrailY = e.clientY;
      lastTrailAt = now;
      spark(e.clientX, e.clientY);
    }, { passive: true });
  }

  /* ======================================================================
     9.5 鼠标视差：头像、光斑和涂鸦有不同深度
     ====================================================================== */

  if (fineMQ.matches) {
    var parNX = 0;
    var parNY = 0;
    var parRaf = 0;

    document.addEventListener("pointermove", function (e) {
      if (motionOff) return;
      parNX = (e.clientX / window.innerWidth - 0.5) * 2;
      parNY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (parRaf) return;
      parRaf = requestAnimationFrame(function () {
        parRaf = 0;
        root.style.setProperty("--par-x", parNX.toFixed(3));
        root.style.setProperty("--par-y", parNY.toFixed(3));
      });
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      if (parRaf) {
        cancelAnimationFrame(parRaf);
        parRaf = 0;
      }
      root.style.setProperty("--par-x", "0");
      root.style.setProperty("--par-y", "0");
    });
  }

  /* ======================================================================
     10. 猫猫光标伙伴：跟着鼠标走，点一下就“喵”
     ====================================================================== */

  var pet = null;
  var petX = 0;
  var petY = 0;
  var petTX = 0;
  var petTY = 0;
  var petRaf = 0;
  var petHasPos = false;
  var petIdleTimer = null;

  function createPet() {
    if (pet || !fineMQ.matches) return;
    pet = document.createElement("div");
    pet.className = "pet";
    pet.setAttribute("aria-hidden", "true");
    var body = document.createElement("span");
    body.className = "pet-body";
    body.textContent = "🐱";
    pet.appendChild(body);
    document.body.appendChild(pet);
  }

  function petMoveTo(x, y) {
    if (motionOff || !fineMQ.matches) return;
    createPet();
    if (!pet) return;
    petTX = clamp(x + 24, 20, window.innerWidth - 58);
    petTY = clamp(y + 20, 20, window.innerHeight - 58);
    if (!petHasPos) {
      petX = petTX;
      petY = petTY;
      petHasPos = true;
      pet.style.transform = "translate3d(" + petX.toFixed(1) + "px," + petY.toFixed(1) + "px,0)";
    }
    pet.classList.add("is-on");
    schedulePetHide();
    if (!petRaf) petRaf = requestAnimationFrame(petTick);
  }

  function petTick() {
    petRaf = 0;
    if (!pet || !petHasPos || motionOff) return;
    var dx = petTX - petX;
    var dy = petTY - petY;
    petX += dx * 0.22;
    petY += dy * 0.22;
    var tilt = clamp(dx * 0.35, -14, 14);
    pet.style.transform = "translate3d(" + petX.toFixed(1) + "px," + petY.toFixed(1) + "px,0) rotate(" + tilt.toFixed(1) + "deg)";
    if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
      petRaf = requestAnimationFrame(petTick);
    }
  }

  function petPop() {
    if (!pet || motionOff || !pet.classList.contains("is-on")) return;
    pet.classList.remove("pet-pop");
    void pet.offsetWidth;
    pet.classList.add("pet-pop");
    window.setTimeout(function () { pet.classList.remove("pet-pop"); }, 460);

    var say = document.createElement("span");
    say.className = "pet-say";
    say.textContent = pick(["喵！", "咪～", "喵呜", "果果在！", "♡"]);
    pet.appendChild(say);
    window.setTimeout(function () {
      if (say.parentNode) say.parentNode.removeChild(say);
    }, 950);
  }

  // 停下来两秒多就让猫猫悄悄溜走，别挡着看介绍
  function schedulePetHide() {
    if (petIdleTimer) window.clearTimeout(petIdleTimer);
    petIdleTimer = window.setTimeout(function () {
      if (pet) pet.classList.remove("is-on");
      petIdleTimer = null;
    }, 2300);
  }

  function hidePet() {
    if (petRaf) {
      cancelAnimationFrame(petRaf);
      petRaf = 0;
    }
    if (petIdleTimer) {
      window.clearTimeout(petIdleTimer);
      petIdleTimer = null;
    }
    if (pet) pet.classList.remove("is-on");
  }

  if (fineMQ.matches) {
    document.addEventListener("pointermove", function (e) {
      if (motionOff) return;
      petMoveTo(e.clientX, e.clientY);
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      if (petIdleTimer) {
        window.clearTimeout(petIdleTimer);
        petIdleTimer = null;
      }
      if (pet) pet.classList.remove("is-on");
    });

    document.addEventListener("pointerenter", function () {
      if (pet && petHasPos && !motionOff) {
        pet.classList.add("is-on");
        schedulePetHide();
      }
    });
  }

  /* ======================================================================
     10.5 头像周围时不时冒出的环境爱心
     ====================================================================== */

  var ambientTimer = null;

  function ambientHeart() {
    if (motionOff || document.hidden || !avatarRing) return;
    var layer = ensureFx();
    if (!layer) return;
    var rect = avatarRing.getBoundingClientRect();
    var el = document.createElement("span");
    el.className = "fx";
    el.textContent = pick(["♡", "💖", "✨", "🐾", "⭐"]);
    el.style.fontSize = rand(10, 16).toFixed(1) + "px";
    el.style.color = "var(--spark)";
    el.style.setProperty("--x", (rect.left + rect.width * rand(0.25, 0.75)).toFixed(1) + "px");
    el.style.setProperty("--y", (rect.top + rect.height * rand(0.55, 0.85)).toFixed(1) + "px");
    el.style.setProperty("--dx", rand(-14, 14).toFixed(1) + "px");
    el.style.setProperty("--dy", rand(-90, -50).toFixed(1) + "px");
    el.style.setProperty("--rot", Math.round(rand(-90, 90)) + "deg");
    el.style.setProperty("--s", rand(0.6, 1).toFixed(2));
    el.style.setProperty("--dur", Math.round(rand(1600, 2600)) + "ms");
    layer.appendChild(el);
    el.addEventListener("animationend", function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function startAmbient() {
    if (ambientTimer || motionOff) return;
    ambientTimer = window.setInterval(ambientHeart, 4200);
  }

  function stopAmbient() {
    if (ambientTimer) {
      window.clearInterval(ambientTimer);
      ambientTimer = null;
    }
  }

  /* ======================================================================
     10.55 偶尔从面板底部散步过去的猫猫
     ====================================================================== */

  var catWalkTimer = null;
  var catWalkStartTimer = null;
  var catWalkRemoveTimer = null;
  var panelCatEl = null;

  function removePanelCat() {
    if (catWalkRemoveTimer) {
      window.clearTimeout(catWalkRemoveTimer);
      catWalkRemoveTimer = null;
    }
    if (panelCatEl && panelCatEl.parentNode) panelCatEl.parentNode.removeChild(panelCatEl);
    panelCatEl = null;
  }

  function walkCat() {
    if (motionOff || document.hidden || panelCatEl) return;
    var profile = document.querySelector(".profile");
    if (!profile || typeof profile.animate !== "function") return;

    panelCatEl = document.createElement("span");
    panelCatEl.className = "panel-cat";
    panelCatEl.setAttribute("aria-hidden", "true");
    var inner = document.createElement("span");
    inner.textContent = "🐈";
    panelCatEl.appendChild(inner);
    profile.appendChild(panelCatEl);

    var width = profile.clientWidth;
    var anim = panelCatEl.animate([
      { transform: "translateX(-32px)" },
      { transform: "translateX(" + (width - 20) + "px)" }
    ], { duration: 9000, easing: "linear", fill: "forwards" });

    if (anim && anim.onfinish !== undefined) anim.onfinish = removePanelCat;
    catWalkRemoveTimer = window.setTimeout(removePanelCat, 9400);
  }

  function startCatWalk() {
    if (motionOff) return;
    if (catWalkStartTimer) window.clearTimeout(catWalkStartTimer);
    if (catWalkTimer) window.clearInterval(catWalkTimer);
    catWalkStartTimer = window.setTimeout(walkCat, 9000);
    catWalkTimer = window.setInterval(walkCat, 24000);
  }

  function stopCatWalk() {
    if (catWalkStartTimer) {
      window.clearTimeout(catWalkStartTimer);
      catWalkStartTimer = null;
    }
    if (catWalkTimer) {
      window.clearInterval(catWalkTimer);
      catWalkTimer = null;
    }
    removePanelCat();
  }

  /* ======================================================================
     10.6 猫猫雨：连戳 5 下头像的彩蛋
     ====================================================================== */

  var rainLayer = null;
  var rainHideTimer = null;
  var rainRemoveTimer = null;

  function stopCatRain() {
    window.clearTimeout(rainHideTimer);
    window.clearTimeout(rainRemoveTimer);
    rainHideTimer = null;
    rainRemoveTimer = null;
    if (rainLayer && rainLayer.parentNode) rainLayer.parentNode.removeChild(rainLayer);
    rainLayer = null;
    if (live) live.textContent = "";
  }

  function catRain() {
    if (motionOff) return;
    stopCatRain();
    var layer = document.createElement("div");
    layer.className = "cat-rain";
    layer.setAttribute("aria-hidden", "true");

    var emojis = ["🐱", "🐾", "💖", "⭐", "🍫", "🥛", "🎀"];
    var count = window.innerWidth < 620 ? 18 : 32;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.textContent = pick(emojis);
      s.style.setProperty("--x", rand(1, 99).toFixed(1) + "vw");
      s.style.setProperty("--s", Math.round(rand(14, 30)) + "px");
      s.style.setProperty("--dur", rand(2.2, 4.2).toFixed(2) + "s");
      s.style.setProperty("--delay", rand(0, 1.1).toFixed(2) + "s");
      s.style.setProperty("--rot", Math.round(rand(-320, 320)) + "deg");
      layer.appendChild(s);
    }

    var banner = document.createElement("div");
    banner.className = "cat-rain__banner";
    var card = document.createElement("div");
    card.className = "cat-rain__card";
    var rainTitle = document.createElement("strong");
    rainTitle.className = "cat-rain__title";
    rainTitle.textContent = "猫咪快点统治世界吧！！！";
    var sub = document.createElement("span");
    sub.className = "cat-rain__sub";
    sub.textContent = "🐱👑 " + pick(["第 5 次戳戳达成！", "果果说到做到！", "喵喵喵！", "小克 / 果果 / 果子 敬上"]);
    card.appendChild(rainTitle);
    card.appendChild(sub);
    banner.appendChild(card);
    layer.appendChild(banner);
    document.body.appendChild(layer);
    rainLayer = layer;

    if (live) live.textContent = "猫咪快点统治世界吧！！！";

    rainHideTimer = window.setTimeout(function () {
      if (rainLayer) rainLayer.classList.add("is-out");
      rainRemoveTimer = window.setTimeout(stopCatRain, 450);
    }, 3900);
  }

  /* ======================================================================
     10.7 点一点爱好和生日卡片
     ====================================================================== */

  var chipNodes = document.querySelectorAll(".chip");
  Array.prototype.forEach.call(chipNodes, function (chip) {
    chip.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        chip.click();
      }
    });

    chip.addEventListener("click", function (e) {
      var emoji = chip.getAttribute("data-emoji") || "✨";
      var text = chip.getAttribute("data-say");
      if (!text) {
        text = pick(["也许… 学做甜点？", "要不要试试摄影？", "养一盆花？", "学一门乐器？", "去画一只猫？"]);
      }
      sayStatus(emoji, text);
      if (motionOff) return;
      var rect = chip.getBoundingClientRect();
      burst(e.clientX || (rect.left + rect.width / 2),
            e.clientY || (rect.top + rect.height / 2), {
        count: 8,
        emojis: [emoji, "♡", "✨", "🐾"],
        spreadMin: 24,
        spreadMax: 64,
        sizeMin: 10,
        sizeMax: 17
      });
    });
  });

  var birthdayCard = document.querySelector(".card--birthday");
  if (birthdayCard) {
    birthdayCard.addEventListener("click", function (e) {
      sayStatus("🎂", "9 月 6 日，蛋糕日！");
      if (motionOff) return;
      var rect = birthdayCard.getBoundingClientRect();
      burst(e.clientX || (rect.left + rect.width / 2),
            e.clientY || (rect.top + rect.height / 2), {
        count: 12,
        emojis: ["🎂", "🍰", "🎉", "✨", "♡"],
        spreadMin: 34,
        spreadMax: 92,
        sizeMin: 13,
        sizeMax: 22
      });
    });
  }

  /* ======================================================================
     11. 点到哪，哪就开花
     ====================================================================== */

  document.addEventListener("pointerdown", function (e) {
    if (motionOff || e.button !== 0) return;
    petPop();

    var target = e.target;
    if (!target || !target.closest) return;
    var hit = target.closest("a, button, .badge, .chip, .card");

    // 点空白处也撒几颗小星星：整张页面都是可以戳的
    if (!hit) {
      burst(e.clientX, e.clientY, {
        count: 3,
        emojis: ["✦", "✧", "♡"],
        spreadMin: 14,
        spreadMax: 38,
        sizeMin: 8,
        sizeMax: 13
      });
      return;
    }

    // 这几个有自己的专属特效，别再重复撒一遍
    if (hit.id === "avatar-ring" || hit.id === "motion-toggle" ||
        hit.id === "theme-toggle" || hit.id === "kaomoji" ||
        hit.id === "now-card" || hit.classList.contains("chip") ||
        hit.classList.contains("card--birthday")) return;

    var count = hit.closest(".socials") ? 5 : 7;
    burst(e.clientX, e.clientY, {
      count: count,
      spreadMin: 26,
      spreadMax: 62,
      sizeMin: 10,
      sizeMax: 17
    });
  }, { passive: true });

  /* ======================================================================
     12. 戳一戳头像：猫咪们飞出来
     ====================================================================== */

  var avatarRing = document.getElementById("avatar-ring");
  var avatarHint = document.getElementById("avatar-hint");
  var avatarClicks = 0;
  var avatarResetTimer = null;

  if (avatarRing) {
    avatarRing.addEventListener("click", function (e) {
      avatarClicks++;

      if (avatarHint) {
        avatarHint.textContent = avatarClicks >= 5
          ? "喵喵喵！♡"
          : "再戳 " + (5 - avatarClicks) + " 下…";
      }
      window.clearTimeout(avatarResetTimer);

      if (avatarClicks >= 5) {
        avatarClicks = 0;
        catRain();
        if (live) live.textContent = "猫咪快点统治世界吧！！！";
        avatarResetTimer = window.setTimeout(function () {
          if (avatarHint) avatarHint.textContent = "戳戳我 ♡";
        }, 4600);
      } else {
        avatarResetTimer = window.setTimeout(function () {
          avatarClicks = 0;
          if (avatarHint) avatarHint.textContent = "戳戳我 ♡";
        }, 8000);
      }

      sayStatus("🐱", pick(["喵！", "摸摸头～", "果果在这里！", "喵呜～"]));

      if (motionOff) return;

      avatarRing.classList.remove("boop");
      void avatarRing.offsetWidth;
      avatarRing.classList.add("boop");
      window.setTimeout(function () { avatarRing.classList.remove("boop"); }, 760);

      var rect = avatarRing.getBoundingClientRect();
      var x = e.clientX || (rect.left + rect.width / 2);
      var y = e.clientY || (rect.top + rect.height / 2);
      burst(x, y, {
        count: 14,
        emojis: FX.avatar,
        spreadMin: 46,
        spreadMax: 118,
        sizeMin: 14,
        sizeMax: 24
      });
    });
  }

  /* 一切就绪后启动常驻的小循环（关闭动效时保持静态） */
  if (!motionOff) {
    startStatus();
    startAmbient();
    startCatWalk();
  }
})();
