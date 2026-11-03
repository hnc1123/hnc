/* ==========================================================================
   声屿 SoundIsle · 歌单详情
   ?id=p1 -> 渲染封面、信息、歌曲列表；支持整单播放与收藏
   ========================================================================== */

(function () {
  "use strict";

  const { $, esc, toast, fav, ICON, songRow } = window.App;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const list = window.DATA.playlist(id) || window.DATA.playlists[0];
  const songs = window.DATA.playlistSongs(list.id);

  document.title = list.title + " · 声屿 SoundIsle";

  function favButtonText() {
    return fav.hasPlaylist(list.id) ? "已收藏" : "收藏歌单";
  }

  function render() {
    const root = $("#playlistPage");
    root.innerHTML =
      '<section class="detail">' +
        '<div class="detail-cover ' + esc(list.cover) + '" role="img" aria-label="' + esc(list.title) + ' 封面"></div>' +
        '<div class="detail-info">' +
          '<p class="kicker">PLAYLIST · 歌单</p>' +
          "<h1>" + esc(list.title) + "</h1>" +
          '<div class="detail-meta">' +
            "<span>" + esc(list.author) + "</span>" +
            '<span class="dot"></span>' +
            "<span>" + songs.length + " 首</span>" +
            '<span class="dot"></span>' +
            "<span>" + esc(list.plays) + " 次播放</span>" +
            '<span class="tag">' + esc(list.tag) + "</span>" +
          "</div>" +
          '<p class="detail-desc">' + esc(list.desc) + "</p>" +
          '<div class="detail-actions">' +
            '<button class="btn-primary" id="playAll">' + ICON.play + "播放全部</button>" +
            '<button class="btn-line" id="favBtn">' + ICON.heart + "<span>" + favButtonText() + "</span></button>" +
          "</div>" +
        "</div>" +
      "</section>" +
      '<div class="page-head"><h1>歌曲列表</h1><span class="sub">共 ' + songs.length + " 首</span></div>" +
      '<div class="track-list" id="trackList">' +
        songs.map((s, i) => songRow(s, i)).join("") +
      "</div>";

    bind();
  }

  function bind() {
    const playAll = $("#playAll");
    if (playAll) {
      playAll.addEventListener("click", () => {
        Player.setQueue(songs, 0, true);
        toast("开始播放：" + list.title);
        markPlaying(0);
      });
    }

    const favBtn = $("#favBtn");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        const on = fav.togglePlaylist(list.id);
        favBtn.querySelector("span").textContent = favButtonText();
        favBtn.classList.toggle("on", on);
        toast(on ? "已收藏歌单：" + list.title : "已取消收藏");
      });
    }

    const wrap = $("#trackList");
    wrap.addEventListener("click", (e) => {
      const like = e.target.closest("[data-like]");
      const row = e.target.closest(".track");
      if (!row) return;
      const i = Number(row.dataset.index);

      if (like) {
        e.stopPropagation();
        const on = fav.toggleSong(songs[i].id);
        like.classList.toggle("on", on);
        like.innerHTML = on ? ICON.heartFill : ICON.heart;
        like.setAttribute("aria-pressed", String(on));
        toast(on ? "已加入「我的收藏」" : "已取消收藏");
        document.dispatchEvent(new CustomEvent("fav:change"));
        return;
      }

      Player.setQueue(songs, i, true);
      markPlaying(i);
      toast("正在播放：" + songs[i].title + " — " + songs[i].artist);
    });
  }

  function markPlaying(index) {
    document.querySelectorAll("#trackList .track").forEach((tr, i) => {
      tr.classList.toggle("playing", i === index);
    });
  }

  render();
})();
