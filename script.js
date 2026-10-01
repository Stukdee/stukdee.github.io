/**
 * Stukdee · 个人主页
 * 三件小事：算准年龄、写对页脚年份、记住主题偏好。
 * 没有任何依赖，也不用 React / Babel，断网也能正常显示。
 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- 主题切换（沿用原来的 localStorage key） ---------- */
  var KEY = "stukdee_theme";
  var toggle = document.getElementById("theme-toggle");
  var icon = toggle && toggle.querySelector(".theme-icon");

  function paint() {
    if (icon) icon.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    paint();
  }

  // 也支持 ?theme=dark / ?theme=light 临时指定（方便分享链接）
  try {
    var want = (location.search.match(/[?&]theme=(dark|light)\b/) || [])[1];
    if (want) setTheme(want);
  } catch (e) {}

  paint();
  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }
  // 用户没手动选过时，跟随系统
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSystemChange = function (e) {
      if (!localStorage.getItem(KEY)) setTheme(e.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  } catch (e) {}

  /* ---------- 年龄：按生日当天进位 ---------- */
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
      if (age >= 0 && age < 200) ageEl.textContent = age + " 岁";
    }
  }

  /* ---------- 页脚年份 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 页脚颜文字偶尔换个心情 ---------- */
  var kao = document.getElementById("kaomoji");
  if (kao) {
    var faces = ["(๑•̀ㅂ•́)و✧", "( ´ ▽ ` )ﾉ", "=^･ω･^=", "(◍•ᴗ•◍)", "( づ ωど)", "＼(^o^)／"];
    var i = 0;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(function () {
        i = (i + 1) % faces.length;
        kao.textContent = faces[i];
        kao.classList.remove("swap");
        void kao.offsetWidth;   // 重新触发动画
        kao.classList.add("swap");
      }, 3500);
    }
  }
})();
