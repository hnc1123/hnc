/* ==========================================================================
   声屿 SoundIsle · 我的收藏
   单曲 / 歌单两个分页签，数据来自 localStorage；可播放、取消收藏、清空
   ========================================================================== */

(function () {
  "use strict";

  const { $, $$, url, toast, fav, ICON, songRow, playlistCard } = window.App;

  let tab = "songs";
  let songs = [];
  let lists = [];

  function readData() {
    songs = window.DATA.songList(fav.songs());
    lists = fav.playlists().map((id) => window.DATA.playlist(id)).filter(Boolean);
  }

  function stats() {
    $("#statSongs").textContent = songs.length;
    $("#statLists").textContent = lists.length;
  }

  function emptySongs() {
    return (
      '<div class="empty">' +
        '<div class="empty-art">' + ICON.heart + "</div>" +
        "<h3>还没有收藏的单曲</h3>" +
        "<p>在歌曲列表或播放器上点一下心形，<br>喜欢的歌就会出现在这里。</p>" +
        '<a class="btn-primary" href="' + url("index.html") + '">' + ICON.play + "去发现音乐</a>" +
      "</div>"
    );
  }

  function emptyLists() {
    return (
      '<div class="empty">' +
        '<div class="empty-art">' + ICON.note + "</div>" +
        "<h3>还没有收藏的歌单</h3>" +
        "<p>打开任意歌单详情，点「收藏歌单」即可收入这里。</p>" +
        '<a class="btn-primary" href="' + url("pages/playlists.html") + '">' + ICON.play + "浏览精选歌单</a>" +
      "</div>"
    );
  }

  function renderSongs() {
    if (!songs.length) return emptySongs();
    return (
      '<div class="track-list" id="songList">' +
        songs.map((s, i) => songRow(s, i, { liked: true })).join("") +
      "</div>"
    );
  }

  function renderLists() {
    if (!lists.length) return emptyLists();
    return '<div class="grid" id="listGrid">' + lists.map(playlistCard).join("") + "</div>";
  }

  function render() {
    readData();
    stats();
    $("#favBody").innerHTML = tab === "songs" ? renderSongs() : renderLists();

    $$(".tab").forEach((t) => {
      const on = t.dataset.tab === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
    });
  }

  function playAll() {
    if (!songs.length) { toast("还没有收藏的单曲"); return; }
    Player.setQueue(songs, 0, true);
    toast("开始播放收藏的 " + songs.length + " 首歌");
  }

  function bind() {
    $$(".tab").forEach((t) => {
      t.addEventListener("click", () => { tab = t.dataset.tab; render(); });
    });

    $("#playAllBtn").addEventListener("click", playAll);

    $("#clearBtn").addEventListener("click", () => {
      if (!songs.length && !lists.length) { toast("收藏本来就是空的"); return; }
      if (!window.confirm("确定清空全部收藏吗？此操作不可撤销。")) return;
      fav.clear();
      render();
      toast("已清空收藏");
    });

    $("#favBody").addEventListener("click", (e) => {
      const card = e.target.closest("[data-playlist]");
      if (card) {
        location.href = url("pages/playlist.html?id=" + encodeURIComponent(card.dataset.playlist));
        return;
      }

      const row = e.target.closest(".track");
      if (!row) return;
      const i = Number(row.dataset.index);

      const like = e.target.closest("[data-like]");
      if (like) {
        e.stopPropagation();
        const song = songs[i];
        fav.removeSong(song.id);
        toast("已从收藏中移除：" + song.title);
        render();
        return;
      }

      Player.setQueue(songs, i, true);
      toast("正在播放：" + songs[i].title + " — " + songs[i].artist);
    });

    document.addEventListener("fav:change", () => {
      if (tab === "songs") render();
      else stats();
    });
  }

  render();
  bind();
})();
