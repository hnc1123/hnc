/* ==========================================================================
   声屿 SoundIsle · 专辑页
   ?name=夜航&artist=林雾 -> 封面、信息、曲目列表
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, esc, toast, fav, ICON, songRow } = window.App;
  const D = window.DATA;

  const params = new URLSearchParams(location.search);
  const album = D.album(params.get("name"), params.get("artist")) || D.albums()[0];
  const songs = album.songs;
  const minutes = Math.round(songs.reduce((n, s) => n + s.duration, 0) / 60);

  document.title = album.name + " · 声屿 SoundIsle";

  function render() {
    $("#albumPage").innerHTML =
      '<section class="detail">' +
        '<div class="detail-cover ' + esc(album.cover) + '" role="img" aria-label="' + esc(album.name) + ' 封面"></div>' +
        '<div class="detail-info">' +
          '<p class="kicker">ALBUM · 专辑</p>' +
          "<h1>" + esc(album.name) + "</h1>" +
          '<div class="detail-meta">' +
            '<a class="link-inline" href="' + url("pages/artist.html?name=" + encodeURIComponent(album.artist)) + '">' + esc(album.artist) + "</a>" +
            '<span class="dot"></span>' +
            "<span>" + songs.length + " 首</span>" +
            '<span class="dot"></span>' +
            "<span>约 " + minutes + " 分钟</span>" +
          "</div>" +
          '<p class="detail-desc">《' + esc(album.name) + "》是 " + esc(album.artist) + " 的一张虚构专辑，共收录 " + songs.length + " 首歌，总时长约 " + minutes + " 分钟。</p>" +
          '<div class="detail-actions">' +
            '<button class="btn-primary" id="playAll">' + ICON.play + "播放全部</button>" +
            '<a class="btn-line" href="' + url("pages/artist.html?name=" + encodeURIComponent(album.artist)) + '">查看歌手</a>' +
          "</div>" +
        "</div>" +
      "</section>" +
      '<div class="page-head"><h1>曲目列表</h1><span class="sub">共 ' + songs.length + " 首</span></div>" +
      '<div class="track-list" id="albumTracks">' + songs.map((s, i) => songRow(s, i)).join("") + "</div>";

    bind();
  }

  function markPlaying(index) {
    document.querySelectorAll("#albumTracks .track").forEach((tr, i) => {
      tr.classList.toggle("playing", i === index);
    });
  }

  function bind() {
    $("#playAll").addEventListener("click", () => {
      Player.setQueue(songs, 0, true);
      markPlaying(0);
      toast("开始播放专辑：" + album.name);
    });

    $("#albumTracks").addEventListener("click", (e) => {
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
      markPlaying(i);
      toast("正在播放：" + songs[i].title + " — " + songs[i].artist);
    });
  }

  render();
})();
