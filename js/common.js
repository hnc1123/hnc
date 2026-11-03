/* ==========================================================================
   声屿 SoundIsle · 公共工具
   选择器 / 提示条 / 格式化 / 收藏与最近播放 / 列表行组件
   ========================================================================== */

window.App = (function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* 站点根路径：页面在 pages/ 下时 body[data-base] 为 "../" */
  const base = (document.body && document.body.dataset.base) || "";
  const url = (path) => base + path;

  /* 秒 -> mm:ss */
  function fmtTime(total) {
    const s = Math.max(0, Math.floor(total || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
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
      } catch (err) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
      catch (err) { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (err) { /* ignore */ }
    }
  };

  /* ----------------------------- 收藏 ----------------------------- */
  const FAV_KEY = "favorites";
  function readFav() {
    const raw = store.get(FAV_KEY, null);
    return {
      songs: Array.isArray(raw && raw.songs) ? raw.songs : [],
      playlists: Array.isArray(raw && raw.playlists) ? raw.playlists : []
    };
  }
  function writeFav(fav) { store.set(FAV_KEY, fav); }

  const fav = {
    all: readFav,
    songs() { return readFav().songs; },
    playlists() { return readFav().playlists; },
    hasSong(id) { return readFav().songs.indexOf(id) !== -1; },
    hasPlaylist(id) { return readFav().playlists.indexOf(id) !== -1; },
    toggleSong(id) {
      const f = readFav();
      const i = f.songs.indexOf(id);
      if (i === -1) f.songs.unshift(id); else f.songs.splice(i, 1);
      writeFav(f);
      return i === -1;
    },
    togglePlaylist(id) {
      const f = readFav();
      const i = f.playlists.indexOf(id);
      if (i === -1) f.playlists.unshift(id); else f.playlists.splice(i, 1);
      writeFav(f);
      return i === -1;
    },
    removeSong(id) {
      const f = readFav();
      f.songs = f.songs.filter((x) => x !== id);
      writeFav(f);
    },
    removePlaylist(id) {
      const f = readFav();
      f.playlists = f.playlists.filter((x) => x !== id);
      writeFav(f);
    },
    clear() { store.remove(FAV_KEY); }
  };

  /* ----------------------------- 最近播放 ----------------------------- */
  const RECENT_KEY = "recent";
  const recent = {
    list() {
      const raw = store.get(RECENT_KEY, []);
      return Array.isArray(raw) ? raw : [];
    },
    add(id) {
      if (!id) return;
      const list = recent.list().filter((x) => x !== id);
      list.unshift(id);
      store.set(RECENT_KEY, list.slice(0, 30));
    },
    clear() { store.remove(RECENT_KEY); }
  };

  /* ----------------------------- 图标 ----------------------------- */
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.1A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4c0 4.8-7 9.1-7 9.1z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.1A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4c0 4.8-7 9.1-7 9.1z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L5 13h5l-1 9 8-11h-5z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.3L21 9l-4.8 4.4L17.5 20 12 16.7 6.5 20l1.3-6.6L3 9l6.4-.7z"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 18.5A2.5 2.5 0 1 1 7.5 16c.5 0 1 .15 1.5.45V6l9-2v3.2l-7 1.55v9.75z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3l1.6 2h8.4a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/></svg>'
  };

  /* ----------------------------- 列表组件 ----------------------------- */
  function songRow(song, index, options) {
    const opts = options || {};
    const liked = opts.liked != null ? opts.liked : fav.hasSong(song.id);
    const trend = opts.trend;
    const third = trend
      ? '<span class="t-album"><span class="trend ' + esc(trend.type || "") + '">' + esc(trend.text) + "</span></span>"
      : '<span class="t-album">' + esc(song.album) + "</span>";
    return (
      '<div class="track" data-song="' + esc(song.id) + '" data-index="' + index + '">' +
        '<span class="t-idx num">' + String(index + 1).padStart(2, "0") + "</span>" +
        '<div class="t-main"><b>' + esc(song.title) + "</b><span>" + esc(song.artist) + "</span></div>" +
        third +
        '<span class="t-dur num">' + fmtTime(song.duration) + "</span>" +
        '<button class="t-like' + (liked ? " on" : "") + '" data-like aria-label="收藏 ' + esc(song.title) + '" aria-pressed="' + (liked ? "true" : "false") + '">' +
          (liked ? ICON.heartFill : ICON.heart) +
        "</button>" +
      "</div>"
    );
  }

  function playlistCard(p) {
    return (
      '<article class="card" data-playlist="' + esc(p.id) + '">' +
        '<div class="cover ' + esc(p.cover) + '">' +
          '<span class="plays num">' + ICON.play + esc(p.plays) + "</span>" +
          '<button class="play" data-play aria-label="播放歌单 ' + esc(p.title) + '">' + ICON.play + "</button>" +
        "</div>" +
        '<p class="card-title">' + esc(p.title) + "</p>" +
        '<p class="card-meta">' + esc(p.author) + ' <span class="tag">' + esc(p.tag) + "</span></p>" +
      "</article>"
    );
  }

  function todo(page) {
    toast("「" + page + "」将在后续提交中开放");
  }

  return {
    $, $$, base, url, fmtTime, esc, toast, store,
    fav, recent, ICON, songRow, playlistCard, todo
  };
})();
