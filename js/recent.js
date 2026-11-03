/* ==========================================================================
   声屿 SoundIsle · 最近播放
   读取 localStorage 中的播放记录并渲染列表
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, toast, fav, recent, ICON, songRow } = window.App;

  let songs = [];

  function render() {
    songs = window.DATA.songList(recent.list());

    if (!songs.length) {
      $("#recentBody").innerHTML =
        '<div class="empty">' +
          '<div class="empty-art">' + ICON.clock + "</div>" +
          "<h3>还没有播放记录</h3>" +
          "<p>随便播放一首歌，这里就会自动记下来。</p>" +
          '<a class="btn-primary" href="' + url("index.html") + '">' + ICON.play + "去发现音乐</a>" +
        "</div>";
      return;
    }

    $("#recentBody").innerHTML =
      '<div class="track-list" id="recentList">' +
        songs.map((s, i) => songRow(s, i)).join("") +
      "</div>";
  }

  function bind() {
    $("#recentBody").addEventListener("click", (e) => {
      const row = e.target.closest(".track");
      if (!row) return;
      const i = Number(row.dataset.index);

      const like = e.target.closest("[data-like]");
      if (like) {
        e.stopPropagation();
        const on = fav.toggleSong(songs[i].id);
        like.classList.toggle("on", on);
        like.innerHTML = on ? ICON.heartFill : ICON.heart;
        like.setAttribute("aria-pressed", String(on));
        toast(on ? "已加入「我的收藏」" : "已取消收藏");
        return;
      }

      Player.setQueue(songs, i, true);
      document.querySelectorAll(".track").forEach((tr) => tr.classList.remove("playing"));
      row.classList.add("playing");
      toast("正在播放：" + songs[i].title + " — " + songs[i].artist);
    });

    $("#clearRecent").addEventListener("click", () => {
      if (!songs.length) { toast("没有可清空的记录"); return; }
      recent.clear();
      render();
      toast("已清空播放记录");
    });
  }

  render();
  bind();
})();
