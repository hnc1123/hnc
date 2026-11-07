/* ==========================================================================
   留白 WHITE SPACE · 公共工具
   路径 / 图片占位 / 灯箱 / 轻提示 / 滚动淡入
   ========================================================================== */

window.App = (function () {
  "use strict";

  const base = (document.body && document.body.dataset.base) || "";
  const url = (path) => base + path;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* 图片加载失败（还没放照片）时隐藏 img，露出下面的同色系渐变 */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img && img.tagName === "IMG") img.classList.add("is-missing");
  }, true);

  /* 脚本执行前就已经加载失败的图片，补一次检查 */
  function markMissing() {
    Array.prototype.forEach.call(document.querySelectorAll("img"), (img) => {
      if (img.complete && img.naturalWidth === 0) img.classList.add("is-missing");
    });
  }
  if (document.readyState === "complete") markMissing();
  else window.addEventListener("load", markMissing);

  function frameStyle(photo) {
    const tone = photo.tone || ["#3a3e46", "#1a1c21"];
    return "style=\"--a:" + tone[0] + ";--b:" + tone[1] + "\"";
  }

  function srcOf(photo) {
    return photo.url || url("assets/photos/" + photo.file);
  }

  function photoFrame(photo, extraClass) {
    return (
      '<div class="frame ' + (extraClass || "") + '" ' + frameStyle(photo) + ">" +
        '<img src="' + esc(srcOf(photo)) + '" alt="' + esc(photo.title) + '" loading="lazy" decoding="async">' +
        (photo.local ? '<span class="badge-local">本地</span>' : "") +
      "</div>"
    );
  }

  /* ----------------------------- 轻提示 ----------------------------- */
  let toastTimer = null;
  function toast(message) {
    let node = $("#appToast");
    if (!node) {
      node = document.createElement("div");
      node.id = "appToast";
      node.className = "toast";
      node.setAttribute("role", "status");
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("is-show"), 2600);
  }

  /* ----------------------------- 灯箱 ----------------------------- */
  const Lightbox = (function () {
    let el = null;
    let img = null;
    let figure = null;
    let capTitle = null;
    let capMeta = null;
    let shotLine = null;
    let count = null;
    let frame = null;
    let list = [];
    let index = 0;
    let token = 0;

    function build() {
      if (el) return;
      el = document.createElement("div");
      el.className = "lightbox";
      el.id = "lightbox";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML =
        '<span class="lb-count"></span>' +
        '<button class="lb-close" aria-label="关闭">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
        "</button>" +
        '<button class="lb-nav lb-prev" aria-label="上一张">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M15 4l-8 8 8 8"/></svg>' +
        "</button>" +
        '<button class="lb-nav lb-next" aria-label="下一张">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 4l8 8-8 8"/></svg>' +
        "</button>" +
        '<div class="lb-figure">' +
          '<div class="lb-frame"><img alt=""></div>' +
          '<div class="lb-caption"><b></b><span></span></div>' +
          '<div class="lb-shot"></div>' +
        "</div>";

      document.body.appendChild(el);
      img = $(".lb-frame img", el);
      frame = $(".lb-frame", el);
      figure = $(".lb-figure", el);
      capTitle = $(".lb-caption b", el);
      capMeta = $(".lb-caption span", el);
      shotLine = $(".lb-shot", el);
      count = $(".lb-count", el);

      $(".lb-close", el).addEventListener("click", close);
      $(".lb-prev", el).addEventListener("click", () => step(-1));
      $(".lb-next", el).addEventListener("click", () => step(1));
      el.addEventListener("click", (e) => { if (e.target === el) close(); });

      let startX = null;
      el.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", (e) => {
        if (startX == null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
        startX = null;
      }, { passive: true });

      document.addEventListener("keydown", (e) => {
        if (!el.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      });
    }

    function show(i) {
      index = (i + list.length) % list.length;
      const p = list[index];
      const tone = p.tone || ["#3a3e46", "#1a1c21"];
      frame.style.setProperty("--a", tone[0]);
      frame.style.setProperty("--b", tone[1]);

      const series = window.DATA && window.DATA.seriesById ? window.DATA.seriesById[p.series] : null;
      capTitle.textContent = p.title;
      capMeta.textContent = (series ? series.title : "我的照片") + " · " + p.year;
      shotLine.textContent = (window.DATA && window.DATA.shotOf) ? window.DATA.shotOf(p.id) : "";
      count.textContent = String(index + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0");

      const my = ++token;
      img.classList.add("is-fading");
      img.classList.remove("is-missing");

      const pre = new Image();
      pre.onload = () => {
        if (my !== token) return;
        img.src = pre.src;
        requestAnimationFrame(() => img.classList.remove("is-fading"));
      };
      pre.onerror = () => {
        if (my !== token) return;
        img.removeAttribute("src");
        img.classList.add("is-missing");
        img.classList.remove("is-fading");
      };
      pre.src = srcOf(p);
    }

    function open(items, i) {
      build();
      list = items || [];
      if (!list.length) return;
      show(i || 0);
      el.classList.add("is-open");
      el.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
    }

    function close() {
      if (!el) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
    }

    function step(delta) {
      if (!el || !el.classList.contains("is-open")) return;
      show(index + delta);
    }

    return { open, close, step };
  })();

  /* ----------------------------- 滚动淡入 ----------------------------- */
  let observer = null;
  function revealInit() {
    const items = $$(".reveal:not(.in)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("in"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    }
    items.forEach((n) => observer.observe(n));
  }

  return { base, url, $, $$, esc, photoFrame, frameStyle, srcOf, Lightbox, revealInit, toast, reduceMotion };
})();
