/* ==========================================================================
   声屿 SoundIsle · 首页逻辑
   渲染推荐歌单与榜单、首屏交互、导航占位
   ========================================================================== */

(function () {
  "use strict";

  const { $, $$, esc, fmtTime, toast, ICON, todo } = window.App;
  const D = window.DATA;

  /* ----------------------------- 推荐歌单 ----------------------------- */
  function renderPlaylists() {
    const grid = $("#playlistGrid");
    if (!grid) return;

    grid.innerHTML = D.playlists.map((p) => (
      '<article class="card" data-playlist="' + esc(p.id) + '">' +
        '<div class="cover ' + esc(p.cover) + '">' +
          '<span class="plays num">' + ICON.play + esc(p.plays) + "</span>" +
          '<button class="play" data-play aria-label="播放歌单 ' + esc(p.title) + '">' + ICON.play + "</button>" +
        "</div>" +
        '<p class="card-title">' + esc(p.title) + "</p>" +
        '<p class="card-meta">' + esc(p.author) + ' <span class="tag">' + esc(p.tag) + "</span></p>" +
      "</article>"
    )).join("");
  }

  /* ----------------------------- 排行榜 ----------------------------- */
  function renderCharts() {
    const wrap = $("#chartsGrid");
    if (!wrap) return;

    wrap.innerHTML = D.charts.map((chart) => (
      '<div class="panel" data-chart="' + esc(chart.id) + '">' +
        '<div class="panel-head">' +
          '<span class="spark' + (chart.id === "fresh" ? " violet" : "") + '">' + (chart.icon === "star" ? ICON.star : ICON.bolt) + "</span>" +
          "<h3>" + esc(chart.title) + "</h3>" +
          '<a href="#" data-more="' + esc(chart.title) + '">更多</a>' +
        "</div>" +
        chart.songs.map((s, i) => (
          '<div class="row" data-song="' + esc(s.id) + '" data-index="' + i + '">' +
            '<span class="idx">' + (i + 1) + "</span>" +
            '<div class="song"><b>' + esc(s.title) + "</b><span>" + esc(s.artist) + "</span></div>" +
            '<span class="trend ' + esc(s.trendType) + '">' + esc(s.trend) + "</span>" +
            '<span class="dur num">' + fmtTime(s.duration) + "</span>" +
          "</div>"
        )).join("") +
      "</div>"
    )).join("");
  }

  /* 播放队列：首屏歌曲 + 两个榜单，保证切歌有内容 */
  function buildQueue() {
    const all = [D.hero.track];
    D.charts.forEach((c) => c.songs.forEach((s) => all.push(s)));
    return all;
  }

  function playSong(song, queue, index) {
    Player.setQueue(queue, index, true);
    toast("正在播放：" + song.title + " — " + song.artist);
  }

  /* ----------------------------- 事件 ----------------------------- */
  function bindPlaylists() {
    const grid = $("#playlistGrid");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const id = card.dataset.playlist;
      const list = D.playlists.find((p) => p.id === id);
      if (!list) return;

      if (e.target.closest("[data-play]")) {
        e.stopPropagation();
        const queue = buildQueue();
        Player.setQueue(queue, 0, true);
        toast("开始播放歌单：" + list.title);
        return;
      }
      todo("歌单「" + list.title + "」");
    });
  }

  function bindCharts() {
    const wrap = $("#chartsGrid");
    if (!wrap) return;

    wrap.addEventListener("click", (e) => {
      const more = e.target.closest("[data-more]");
      if (more) {
        e.preventDefault();
        todo("榜单「" + more.dataset.more + "」");
        return;
      }
      const row = e.target.closest(".row");
      if (!row) return;
      const panel = row.closest(".panel");
      const chart = D.charts.find((c) => c.id === panel.dataset.chart);
      if (!chart) return;
      const i = Number(row.dataset.index);
      playSong(chart.songs[i], chart.songs, i);
    });
  }

  function bindHero() {
    const dateEl = $("#heroDate");
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = (now.getMonth() + 1) + " 月 " + now.getDate() + " 日";
    }

    const playBtn = $("#heroPlay");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        const queue = buildQueue();
        Player.setQueue(queue, 0, true);
        toast("开始播放：深夜电台 Vol.24");
      });
    }

    const favBtn = $("#heroFav");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        const on = favBtn.classList.toggle("on");
        toast(on ? "已收藏：深夜电台 Vol.24" : "已取消收藏");
      });
    }
  }

  function bindNav() {
    $$(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const page = item.dataset.page;
        if (!page) return;
        e.preventDefault();
        $$(".nav-item").forEach((n) => n.classList.remove("active"));
        item.classList.add("active");
        todo(page);
      });
    });
  }

  function bindSearch() {
    const input = $("#searchInput");
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = input.value.trim();
      if (!q) return;
      todo("搜索「" + q + "」");
      input.blur();
    });
  }

  function bindMisc() {
    const back = $("#backBtn");
    if (back) back.addEventListener("click", () => history.back());

    const login = $("#loginBtn");
    if (login) login.addEventListener("click", () => toast("登录功能为纯前端模拟，第 7 天补充"));

    const avatar = $(".avatar");
    if (avatar) avatar.addEventListener("click", () => toast("访客模式 · 收藏保存在本机"));
  }

  function init() {
    renderPlaylists();
    renderCharts();
    bindPlaylists();
    bindCharts();
    bindHero();
    bindNav();
    bindSearch();
    bindMisc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
