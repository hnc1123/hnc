/* ==========================================================================
   声屿 SoundIsle · 精选歌单
   卡片网格，点击进入详情
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, toast, playlistCard } = window.App;
  const lists = window.DATA.playlists;

  function render() {
    $("#allPlaylists").innerHTML = lists.map(playlistCard).join("");
  }

  function bind() {
    $("#allPlaylists").addEventListener("click", (e) => {
      const card = e.target.closest("[data-playlist]");
      if (!card) return;
      const list = window.DATA.playlist(card.dataset.playlist);
      if (!list) return;

      if (e.target.closest("[data-play]")) {
        e.stopPropagation();
        Player.setQueue(window.DATA.playlistSongs(list.id), 0, true);
        toast("开始播放歌单：" + list.title);
        return;
      }
      location.href = url("pages/playlist.html?id=" + encodeURIComponent(list.id));
    });
  }

  render();
  bind();
})();
