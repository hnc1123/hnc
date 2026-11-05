/* ==========================================================================
   声屿 SoundIsle · 歌手页
   ?name=林雾 -> 头像、统计、热门单曲、专辑列表
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, esc, fmtTime, toast, fav, ICON, songRow } = window.App;
  const D = window.DATA;

  const name = new URLSearchParams(location.search).get("name");
  const artist = D.artist(name) || D.artists()[0];
  const songs = artist.songs;

  document.title = artist.name + " · 声屿 SoundIsle";

  function albumCard(al) {
    return (
      '<article class="card" data-album="' + esc(al.name) + '" data-artist="' + esc(al.artist) + '">' +
        '<div class="cover ' + esc(al.cover) + '">' +
          '<span class="plays num">' + al.songs.length + " 首</span>" +
          '<button class="play" data-play-album aria-label="播放专辑 ' + esc(al.name) + '">' + ICON.play + "</button>" +
        "</div>" +
        '<p class="card-title">' + esc(al.name) + "</p>" +
        '<p class="card-meta">' + esc(al.artist) + "</p>" +
      "</article>"
    );
  }

  function render() {
    const minutes = Math.round(artist.duration / 60);
    $("#artistPage").innerHTML =
      '<section class="artist-head">' +
        '<div class="artist-avatar ' + esc(artist.cover) + '" role="img" aria-label="' + esc(artist.name) + '">' + esc(artist.name.slice(0, 1)) + "</div>" +
        '<div class="artist-info">' +
          '<p class="kicker">ARTIST · 歌手</p>' +
          "<h1>" + esc(artist.name) + "</h1>" +
          '<div class="detail-meta">' +
            "<span>" + songs.length + " 首歌</span>" +
            '<span class="dot"></span>' +
            "<span>" + artist.albums.length + " 张专辑</span>" +
            '<span class="dot"></span>' +
            "<span>总时长 " + minutes + " 分钟</span>" +
          "</div>" +
          '<div class="artist-actions">' +
            '<button class="btn-primary" id="playAll">' + ICON.play + "播放全部</button>" +
            '<button class="btn-line" id="followBtn">关注歌手</button>' +
          "</div>" +
        "</div>" +
      "</section>" +
      '<div class="page-head"><h1>热门单曲</h1><span class="sub">共 ' + songs.length + " 首</span></div>" +
      '<div class="track-list" id="artistTracks">' +
        songs.map((s, i) => songRow(s, i)).join("") +
      "</div>" +
      '<section class="section">' +
        '<div class="section-head"><h2>专辑</h2><span class="sub">共 ' + artist.albums.length + " 张</span></div>" +
        '<div class="grid" id="artistAlbums">' + artist.albums.map(albumCard).join("") + "</div>" +
      "</section>";

    bind();
  }

  function markPlaying(index) {
    document.querySelectorAll("#artistTracks .track").forEach((tr, i) => {
      tr.classList.toggle("playing", i === index);
    });
  }

  function bind() {
    $("#playAll").addEventListener("click", () => {
      Player.setQueue(songs, 0, true);
      markPlaying(0);
      toast("开始播放：" + artist.name);
    });

    $("#followBtn").addEventListener("click", function () {
      const on = this.classList.toggle("on");
      this.textContent = on ? "已关注" : "关注歌手";
      toast(on ? "已关注：" + artist.name : "已取消关注");
    });

    $("#artistTracks").addEventListener("click", (e) => {
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

    $("#artistAlbums").addEventListener("click", (e) => {
      const card = e.target.closest("[data-album]");
      if (!card) return;
      const al = D.album(card.dataset.album, card.dataset.artist);
      if (!al) return;

      if (e.target.closest("[data-play-album]")) {
        e.stopPropagation();
        Player.setQueue(al.songs, 0, true);
        toast("开始播放专辑：" + al.name);
        return;
      }
      location.href = url("pages/album.html?name=" + encodeURIComponent(al.name) + "&artist=" + encodeURIComponent(al.artist));
    });
  }

  render();
  console.log("artist", artist.name, fmtTime(artist.duration));
})();
