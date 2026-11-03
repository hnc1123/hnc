/* ==========================================================================
   声屿 SoundIsle · 播放器
   纯前端模拟播放：进度、切歌、唱片转动、收藏标记
   （第 4 天接入本地音频与歌词）
   ========================================================================== */

window.Player = (function () {
  "use strict";

  const { $, ICON, fmtTime, toast } = window.App;

  const state = {
    queue: [],
    index: -1,
    track: null,
    playing: false,
    time: 0,
    duration: 0,
    liked: false
  };

  let el = null;
  let timer = null;

  const TEMPLATE = [
    '<footer class="player" aria-label="播放器">',
    '  <div class="np">',
    '    <div class="np-cover" id="npCover"></div>',
    '    <div class="np-info">',
    '      <b id="npTitle">未在播放</b>',
    '      <span id="npArtist">选择一首歌开始</span>',
    '    </div>',
    '    <button class="icon-btn" id="likeBtn" title="喜欢" aria-label="喜欢" aria-pressed="false">' + ICON.heart + "</button>",
    "  </div>",
    '  <div class="center">',
    '    <div class="controls">',
    '      <button class="icon-btn" id="shuffleBtn" title="随机播放" aria-label="随机播放">',
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4l3 3-3 3"/><path d="M20 7H8a4 4 0 0 0-4 4"/><path d="M7 20l-3-3 3-3"/><path d="M4 17h12a4 4 0 0 0 4-4"/></svg>',
    "      </button>",
    '      <button class="icon-btn" id="prevBtn" title="上一首" aria-label="上一首">',
    '        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h2v14H7zM18 5.5v13L9.5 12z"/></svg>',
    "      </button>",
    '      <button class="play-main" id="playBtn" aria-label="播放">' + ICON.play + "</button>",
    '      <button class="icon-btn" id="nextBtn" title="下一首" aria-label="下一首">',
    '        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 5h2v14h-2zM6 5.5v13L14.5 12z"/></svg>',
    "      </button>",
    '      <button class="icon-btn on" id="repeatBtn" title="单曲循环" aria-label="单曲循环" aria-pressed="true">',
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4l3 3-3 3"/><path d="M20 7H8a4 4 0 0 0-4 4v1"/><path d="M7 20l-3-3 3-3"/><path d="M4 17h12a4 4 0 0 0 4-4v-1"/></svg>',
    "      </button>",
    "    </div>",
    '    <div class="progress-line">',
    '      <span class="time num" id="timeNow">00:00</span>',
    '      <div class="bar" id="bar" role="slider" tabindex="0" aria-label="播放进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">',
    '        <div class="bar-fill" id="barFill"></div>',
    "      </div>",
    '      <span class="time end num" id="timeTotal">00:00</span>',
    "    </div>",
    "  </div>",
    '  <div class="right">',
    '    <span class="quality" title="音质标识">SQ</span>',
    '    <div class="vol">',
    '      <button class="icon-btn" id="volBtn" title="音量" aria-label="音量">',
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3l4-3.2v11.4l-4-3.2H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.5a7.6 7.6 0 0 1 0 11"/></svg>',
    "      </button>",
    '      <div class="vol-bar" id="volBar"><i id="volFill"></i></div>',
    "    </div>",
    '    <button class="icon-btn" id="queueBtn" title="播放列表" aria-label="播放列表">',
    '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h12M4 12h12M4 17h7"/><path d="M18 15.5v4.2"/><circle cx="19.6" cy="14.6" r="1.4"/></svg>',
    "    </button>",
    '    <button class="icon-btn" id="lyricBtn" title="歌词" aria-label="歌词">',
    '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>',
    "    </button>",
    "  </div>",
    "</footer>"
  ].join("\n");

  function cache() {
    el = {
      cover: $("#npCover"),
      title: $("#npTitle"),
      artist: $("#npArtist"),
      like: $("#likeBtn"),
      play: $("#playBtn"),
      prev: $("#prevBtn"),
      next: $("#nextBtn"),
      shuffle: $("#shuffleBtn"),
      repeat: $("#repeatBtn"),
      timeNow: $("#timeNow"),
      timeTotal: $("#timeTotal"),
      bar: $("#bar"),
      fill: $("#barFill"),
      vol: $("#volBar"),
      volFill: $("#volFill"),
      volBtn: $("#volBtn")
    };
  }

  function render() {
    const t = state.track;
    el.title.textContent = t ? t.title : "未在播放";
    el.artist.textContent = t ? t.artist + (t.album ? " · " + t.album : "") : "选择一首歌开始";
    el.cover.className = "np-cover" + (t && t.cover ? " " + t.cover : "");
    el.play.innerHTML = state.playing ? ICON.pause : ICON.play;
    el.play.setAttribute("aria-label", state.playing ? "暂停" : "播放");
    el.timeNow.textContent = fmtTime(state.time);
    el.timeTotal.textContent = fmtTime(state.duration);
    const pct = state.duration ? (state.time / state.duration) * 100 : 0;
    el.fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
    el.bar.setAttribute("aria-valuenow", String(Math.round(pct)));

    const heroDisc = document.getElementById("heroDisc");
    if (heroDisc) {
      heroDisc.style.animationPlayState = state.playing ? "running" : "paused";
    }
    document.title = (t && state.playing ? "▶ " : "") + "声屿 SoundIsle · 发现音乐";
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      if (!state.playing) return;
      state.time += 1;
      if (state.time >= state.duration) {
        if (state.queue.length > 1) {
          next(true);
          return;
        }
        state.time = 0;
        state.playing = false;
      }
      render();
    }, 1000);
  }

  function load(track, options) {
    const opts = options || {};
    state.track = track;
    state.duration = track.duration || 240;
    state.time = 0;
    state.playing = opts.autoplay !== false;
    state.liked = false;
    el.like.classList.remove("on");
    el.like.setAttribute("aria-pressed", "false");
    render();
    if (state.playing) startTimer();
  }

  function setQueue(tracks, index, autoplay) {
    state.queue = Array.isArray(tracks) ? tracks.slice() : [];
    state.index = typeof index === "number" ? index : 0;
    if (!state.queue.length) return;
    load(state.queue[state.index], { autoplay: autoplay !== false });
  }

  function toggle() {
    if (!state.track) {
      const first = (window.DATA && window.DATA.hero && window.DATA.hero.track) || null;
      if (first) load(first);
      return;
    }
    state.playing = !state.playing;
    if (state.playing) startTimer(); else stopTimer();
    render();
  }

  function next(auto) {
    if (!state.queue.length) return;
    state.index = (state.index + 1) % state.queue.length;
    load(state.queue[state.index], { autoplay: true });
    if (!auto) toast("下一首：" + state.track.title);
  }

  function prev() {
    if (!state.queue.length) return;
    state.index = (state.index - 1 + state.queue.length) % state.queue.length;
    load(state.queue[state.index], { autoplay: true });
    toast("上一首：" + state.track.title);
  }

  function seek(pct) {
    if (!state.track) return;
    state.time = Math.round(Math.max(0, Math.min(1, pct)) * state.duration);
    render();
  }

  function bind() {
    el.play.addEventListener("click", toggle);
    el.next.addEventListener("click", () => next(false));
    el.prev.addEventListener("click", prev);

    el.bar.addEventListener("click", (e) => {
      const rect = el.bar.getBoundingClientRect();
      seek((e.clientX - rect.left) / rect.width);
    });
    el.bar.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { seek(Math.min(1, state.time / state.duration + 0.02)); e.preventDefault(); }
      if (e.key === "ArrowLeft") { seek(Math.max(0, state.time / state.duration - 0.02)); e.preventDefault(); }
    });

    el.like.addEventListener("click", () => {
      state.liked = !state.liked;
      el.like.classList.toggle("on", state.liked);
      el.like.setAttribute("aria-pressed", String(state.liked));
      toast(state.liked ? "已加入「我的收藏」" : "已取消收藏");
    });

    el.repeat.addEventListener("click", () => {
      const on = el.repeat.classList.toggle("on");
      el.repeat.setAttribute("aria-pressed", String(on));
      toast(on ? "单曲循环已开启" : "单曲循环已关闭");
    });

    el.shuffle.addEventListener("click", () => {
      if (!state.queue.length) { toast("先播放一首歌吧"); return; }
      const i = Math.floor(Math.random() * state.queue.length);
      state.index = i;
      load(state.queue[i], { autoplay: true });
      toast("随机播放：" + state.track.title);
    });

    el.volBtn.addEventListener("click", () => {
      const muted = el.volFill.style.width === "0%";
      el.volFill.style.width = muted ? "62%" : "0%";
      el.volBtn.classList.toggle("on", muted);
    });
    el.vol.addEventListener("click", (e) => {
      const rect = el.vol.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      el.volFill.style.width = (pct * 100) + "%";
    });

    document.addEventListener("keydown", (e) => {
      if (e.target.matches("input, textarea")) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
    });
  }

  function mount() {
    const root = document.getElementById("playerRoot");
    if (!root) return;
    root.innerHTML = TEMPLATE;
    cache();
    bind();

    // 初始展示首屏曲目，但不自动播放
    const initial = window.DATA && window.DATA.hero && window.DATA.hero.track;
    if (initial) {
      load(initial, { autoplay: false });
    } else {
      render();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  return {
    state,
    load,
    setQueue,
    toggle,
    next,
    prev,
    seek,
    mount
  };
})();
