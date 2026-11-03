/* ==========================================================================
   声屿 SoundIsle · 公共工具
   选择器 / 提示条 / 时间格式化 / 本地存储 / 常用图标
   ========================================================================== */

window.App = (function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* 秒 -> mm:ss */
  function fmtTime(total) {
    const s = Math.max(0, Math.floor(total || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  /* 简易转义，渲染用户输入前使用 */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  /* 底部提示条 */
  let toastTimer = null;
  function toast(message) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* localStorage 封装：隐私模式或禁用时静默降级 */
  const PREFIX = "sy_";
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (err) {
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(PREFIX + key);
      } catch (err) { /* ignore */ }
    }
  };

  /* 内联图标：统一 24 网格，描边 1.8 */
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.1A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4c0 4.8-7 9.1-7 9.1z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L5 13h5l-1 9 8-11h-5z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.3L21 9l-4.8 4.4L17.5 20 12 16.7 6.5 20l1.3-6.6L3 9l6.4-.7z"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h1v-7H6v-1a6 6 0 0 1 12 0v1h-2v7h1a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };

  /* 统一的“页面未开放”提示，后续提交里替换为真实跳转 */
  function todo(page) {
    toast("「" + page + "」将在后续提交中开放");
  }

  return { $, $$, fmtTime, esc, toast, store, ICON, todo };
})();
