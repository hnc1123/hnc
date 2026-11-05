/* ==========================================================================
   声屿 SoundIsle · 搜索
   ?q=关键词 -> 在本地数据里匹配单曲 / 歌单 / 歌手
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, esc, toast, fav, ICON, songRow, playlistCard } = window.App;
  const D = window.DATA;

  const HOT = ["晚风", "岛屿", "雨天", "通勤", "深夜", "月亮"];

  const params = new URLSearchParams(location.search);
  const q = (params.get("q") || "").trim();
  const key = q.toLowerCase();

  let results = { songs: [], lists: [], artists: [] };

  if ($("#qInput")) $("#qInput").value = q;
  if ($("#searchInput")) $("#searchInput").value = q;

  function search() {
    if (!key) return;
    results.songs = D.songs.filter((s) =>
      (s.title + " " + s.artist + " " + s.album).toLowerCase().indexOf(key) !== -1
    );
    results.lists = D.playlists.filter((p) =>
      (p.title + " " + p.author + " " + p.tag).toLowerCase().indexOf(key) !== -1
    );

    const map = {};
    D.songs.forEach((s) => {
      const hit = (s.title + " " + s.artist + " " + s.album).toLowerCase().indexOf(key) !== -1;
      if (!hit) return;
      if (!map[s.artist]) map[s.artist] = { name: s.artist, cover: s.cover, songs: [] };
      map[s.artist].songs.push(s);
    });
    results.artists = Object.keys(map).map((k) => map[k]);
  }

  function hotChips() {
    return (
      '<div class="chips">' +
        HOT.map((h) => '<a class="chip" href="' + url("pages/search.html?q=" + encodeURIComponent(h)) + '">' + esc(h) + "</a>").join("") +
      "</div>"
    );
  }

  function emptyState(title, text) {
    return (
      '<div class="empty">' +
        '<div class="empty-art">' + ICON.note + "</div>" +
        "<h3>" + esc(title) + "</h3>" +
        "<p>" + text + "</p>" +
        hotChips() +
      "</div>"
    );
  }

  function sectionHead(title, count, extra) {
    return (
      '<div class="section-head">' +
        "<h2>" + esc(title) + "</h2>" +
        '<span class="sub">' + count + " 个结果</span>" +
        (extra || "") +
      "</div>"
    );
  }

  function renderSongs() {
    const playAll = '<button class="btn-line" data-play-songs style="margin-left:auto">' + ICON.play + "播放全部</button>";
    return (
      '<section class="section">' +
        sectionHead("单曲", results.songs.length, playAll) +
        '<div class="track-list" id="songResults">' +
          results.songs.map((s, i) => songRow(s, i)).join("") +
        "</div>" +
      "</section>"
    );
  }

  function renderLists() {
    return (
      '<section class="section">' +
        sectionHead("歌单", results.lists.length) +
        '<div class="grid" id="listResults">' + results.lists.map(playlistCard).join("") + "</div>" +
      "</section>"
    );
  }

  function renderArtists() {
    return (
      '<section class="section">' +
        sectionHead("歌手", results.artists.length) +
        '<div class="artist-chips">' +
          results.artists.map((a) => (
            '<button class="artist-chip" data-artist="' + esc(a.name) + '">' +
              '<span class="dot ' + esc(a.cover) + '">' + esc(a.name.slice(0, 1)) + "</span>" +
              "<span>" + esc(a.name) + "<em>" + a.songs.length + " 首</em></span>" +
            "</button>"
          )).join("") +
        "</div>" +
      "</section>"
    );
  }

  function render() {
    const body = $("#searchBody");

    if (!q) {
      body.innerHTML = emptyState("想听点什么？", "输入歌名、歌手或歌单名试试，<br>也可以从下面的关键词开始。");
      return;
    }

    search();
    const total = results.songs.length + results.lists.length + results.artists.length;
    if (!total) {
      body.innerHTML = emptyState("没有找到「" + q + "」", "换个关键词试试，或者看看这些：");
      return;
    }

    body.innerHTML =
      '<p class="search-meta">「' + esc(q) + "」共找到 " + total + " 个结果</p>" +
      (results.songs.length ? renderSongs() : "") +
      (results.artists.length ? renderArtists() : "") +
      (results.lists.length ? renderLists() : "");
  }

  function bind() {
    const form = $("#searchForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = $("#qInput").value.trim();
      if (!v) { $("#qInput").focus(); return; }
      location.href = url("pages/search.html?q=" + encodeURIComponent(v));
    });

    $("#searchBody").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) return; // 交给链接默认跳转

      if (e.target.closest("[data-play-songs]")) {
        Player.setQueue(results.songs, 0, true);
        toast("开始播放搜索结果");
        return;
      }

      const artist = e.target.closest("[data-artist]");
      if (artist) {
        location.href = url("pages/artist.html?name=" + encodeURIComponent(artist.dataset.artist));
        return;
      }

      const card = e.target.closest("[data-playlist]");
      if (card) {
        const list = D.playlist(card.dataset.playlist);
        if (!list) return;
        if (e.target.closest("[data-play]")) {
          e.stopPropagation();
          Player.setQueue(D.playlistSongs(list.id), 0, true);
          toast("开始播放歌单：" + list.title);
          return;
        }
        location.href = url("pages/playlist.html?id=" + encodeURIComponent(list.id));
        return;
      }

      const row = e.target.closest(".track");
      if (!row) return;
      const i = Number(row.dataset.index);

      const like = e.target.closest("[data-like]");
      if (like) {
        e.stopPropagation();
        const on = fav.toggleSong(results.songs[i].id);
        like.classList.toggle("on", on);
        like.innerHTML = on ? ICON.heartFill : ICON.heart;
        like.setAttribute("aria-pressed", String(on));
        toast(on ? "已加入「我的收藏」" : "已取消收藏");
        return;
      }

      Player.setQueue(results.songs, i, true);
      toast("正在播放：" + results.songs[i].title + " — " + results.songs[i].artist);
    });
  }

  render();
  bind();
})();
