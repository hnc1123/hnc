/* ==========================================================================
   声屿 SoundIsle · 排行榜
   每个榜单一个区块，显示趋势；支持整榜播放与单曲收藏
   ========================================================================== */

(function () {
  "use strict";

  const { $, esc, toast, fav, ICON, songRow } = window.App;

  const charts = window.DATA.charts.map((c) => ({
    meta: c,
    songs: window.DATA.songList(c.songIds)
  }));

  function render() {
    $("#chartsBody").innerHTML = charts.map((chart) => (
      '<section class="section" data-chart="' + esc(chart.meta.id) + '">' +
        '<div class="section-head">' +
          "<h2>" + esc(chart.meta.title) + "</h2>" +
          '<span class="sub">' + esc(chart.meta.update) + " · 共 " + chart.songs.length + " 首</span>" +
          '<button class="btn-line" data-chart-play style="margin-left:auto">' + ICON.play + "播放全部</button>" +
        "</div>" +
        '<div class="track-list">' +
          chart.songs.map((s, i) => songRow(s, i, { trend: window.DATA.trends[s.id] })).join("") +
        "</div>" +
      "</section>"
    )).join("");
  }

  function bind() {
    $("#chartsBody").addEventListener("click", (e) => {
      const section = e.target.closest("[data-chart]");
      if (!section) return;
      const chart = charts.find((c) => c.meta.id === section.dataset.chart);

      if (e.target.closest("[data-chart-play]")) {
        Player.setQueue(chart.songs, 0, true);
        toast("开始播放：" + chart.meta.title);
        return;
      }

      const row = e.target.closest(".track");
      if (!row) return;
      const i = Number(row.dataset.index);

      const like = e.target.closest("[data-like]");
      if (like) {
        e.stopPropagation();
        const on = fav.toggleSong(chart.songs[i].id);
        like.classList.toggle("on", on);
        like.innerHTML = on ? ICON.heartFill : ICON.heart;
        like.setAttribute("aria-pressed", String(on));
        toast(on ? "已加入「我的收藏」" : "已取消收藏");
        return;
      }

      Player.setQueue(chart.songs, i, true);
      document.querySelectorAll(".track").forEach((tr) => tr.classList.remove("playing"));
      row.classList.add("playing");
      toast("正在播放：" + chart.songs[i].title + " — " + chart.songs[i].artist);
    });
  }

  render();
  bind();
})();
