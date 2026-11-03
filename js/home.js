/* ==========================================================================
   声屿 SoundIsle · 首页逻辑
   渲染推荐歌单与榜单；点击卡片进入歌单详情
   ========================================================================== */

(function () {
  "use strict";

  const { $, esc, fmtTime, toast, url, playlistCard } = window.App;
  const D = window.DATA;

  /* ----------------------------- 推荐歌单 ----------------------------- */
  function renderPlaylists() {
    $("#playlistGrid").innerHTML = D.playlists.map(playlistCard).join("");
  }

  /* ----------------------------- 排行榜 ----------------------------- */
  function renderCharts() {
    const wrap = $("#chartsGrid");
    wrap.innerHTML = D.charts.map((chart) => {
      const songs = D.songList(chart.songIds);
      return (
        '<div class="panel" data-chart="' + esc(chart.id) + '">' +
          '<div class="panel-head">' +
            '<span class="spark' + (chart.id === "fresh" ? " violet" : "") + '">' +
              (chart.icon === "star" ? window.App.ICON.star : window.App.ICON.bolt) +
            "</span>" +
            "<h3>" + esc(chart.title) + "</h3>" +
            '<a href="' + url("pages/charts.html") + '">更多</a>' +
          "</div>" +
          songs.map((s, i) => {
            const trend = D.trends[s.id] || { text: "—", type: "flat" };
            return (
              '<div class="row" data-index="' + i + '">' +
                '<span class="idx">' + (i + 1) + "</span>" +
                '<div class="song"><b>' + esc(s.title) + "</b><span>" + esc(s.artist) + "</span></div>" +
                '<span class="trend ' + esc(trend.type) + '">' + esc(trend.text) + "</span>" +
                '<span class="dur num">' + fmtTime(s.duration) + "</span>" +
              "</div>"
            );
          }).join("") +
        "</div>"
      );
    }).join("");
  }

  /* 首屏队列：本期歌曲 + 两个榜单 */
  function heroQueue() {
    return [D.song(D.hero.trackId)].concat(D.songList(D.charts[0].songIds));
  }

  /* ----------------------------- 事件 ----------------------------- */
  function bindPlaylists() {
    $("#playlistGrid").addEventListener("click", (e) => {
      const card = e.target.closest("[data-playlist]");
      if (!card) return;
      const list = D.playlist(card.dataset.playlist);
      if (!list) return;

      if (e.target.closest("[data-play]")) {
        e.stopPropagation();
        Player.setQueue(D.playlistSongs(list.id), 0, true);
        toast("开始播放歌单：" + list.title);
        return;
      }
      location.href = url("pages/playlist.html?id=" + encodeURIComponent(list.id));
    });
  }

  function bindCharts() {
    $("#chartsGrid").addEventListener("click", (e) => {
      const row = e.target.closest(".row");
      if (!row) return;
      const panel = row.closest(".panel");
      const chart = D.chart(panel.dataset.chart);
      if (!chart) return;
      const songs = D.songList(chart.songIds);
      const i = Number(row.dataset.index);
      Player.setQueue(songs, i, true);
      toast("正在播放：" + songs[i].title + " — " + songs[i].artist);
    });
  }

  function bindHero() {
    const now = new Date();
    $("#heroDate").textContent = (now.getMonth() + 1) + " 月 " + now.getDate() + " 日";
    $("#heroDesc").textContent = D.hero.desc;

    $("#heroPlay").addEventListener("click", () => {
      Player.setQueue(heroQueue(), 0, true);
      toast("开始播放：深夜电台 Vol.24");
    });

    $("#heroFav").addEventListener("click", () => {
      const on = $("#heroFav").classList.toggle("on");
      toast(on ? "已收藏：深夜电台 Vol.24" : "已取消收藏");
    });
  }

  function init() {
    renderPlaylists();
    renderCharts();
    bindPlaylists();
    bindCharts();
    bindHero();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
