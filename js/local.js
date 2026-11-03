/* ==========================================================================
   声屿 SoundIsle · 本地音乐
   选择或拖入音频文件 -> URL.createObjectURL -> 用播放器真实播放
   文件不上传、不写入磁盘；刷新后列表清空
   ========================================================================== */

(function () {
  "use strict";

  const { $, esc, fmtTime, toast, ICON } = window.App;

  const COVERS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"];
  const items = [];
  let seq = 0;

  const dropzone = $("#dropzone");
  const input = $("#fileInput");

  function isAudio(file) {
    return (file.type && file.type.indexOf("audio/") === 0) ||
      /\.(mp3|wav|ogg|m4a|aac|flac|opus|wma)$/i.test(file.name);
  }

  function formatSize(bytes) {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(1) + " MB" : Math.max(1, Math.round(bytes / 1024)) + " KB";
  }

  function ext(name) {
    const i = name.lastIndexOf(".");
    return i > 0 ? name.slice(i + 1).toUpperCase() : "AUDIO";
  }

  function readDuration(item) {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.addEventListener("loadedmetadata", () => {
      if (isFinite(probe.duration) && probe.duration > 0) {
        item.duration = Math.round(probe.duration);
        renderList();
      }
      probe.removeAttribute("src");
    });
    probe.addEventListener("error", () => {
      item.duration = 0;
      renderList();
    });
    probe.src = item.src;
  }

  function addFiles(fileList) {
    const files = Array.from(fileList || []).filter(isAudio);
    if (!files.length) {
      toast("没有找到可播放的音频文件");
      return;
    }

    files.forEach((file) => {
      seq += 1;
      const item = {
        id: "local-" + seq,
        title: file.name.replace(/\.[^.]+$/, ""),
        artist: "本地文件",
        album: formatSize(file.size),
        duration: 0,
        size: file.size,
        format: ext(file.name),
        cover: COVERS[seq % COVERS.length],
        src: URL.createObjectURL(file)
      };
      items.push(item);
      readDuration(item);
    });

    renderList();
    toast("已导入 " + files.length + " 个文件");
  }

  function renderList() {
    const count = $("#fileCount");
    const box = $("#localList");

    count.textContent = items.length
      ? "共 " + items.length + " 个文件 · " + formatSize(items.reduce((n, i) => n + i.size, 0))
      : "还没有导入文件";

    if (!items.length) {
      box.innerHTML = "";
      return;
    }

    box.innerHTML =
      '<div class="track-list" style="margin-top:18px" id="localTracks">' +
      items.map((it, i) => (
        '<div class="track" data-index="' + i + '">' +
          '<span class="t-idx num">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<div class="t-main"><b>' + esc(it.title) + "</b><span>本地文件 · " + esc(it.format) + "</span></div>" +
          '<span class="t-album">' + esc(it.album) + "</span>" +
          '<span class="t-dur num">' + (it.duration ? fmtTime(it.duration) : "--:--") + "</span>" +
          '<button class="t-like" data-remove aria-label="移除 ' + esc(it.title) + '">' + ICON.trash + "</button>" +
        "</div>"
      )).join("") +
      "</div>";
  }

  function markPlaying(index) {
    document.querySelectorAll("#localTracks .track").forEach((tr, i) => {
      tr.classList.toggle("playing", i === index);
    });
  }

  function playAt(index) {
    if (!items.length) { toast("先导入音频文件"); return; }
    Player.setQueue(items, index, true);
    markPlaying(index);
    toast("正在播放：" + items[index].title);
  }

  /* ----------------------------- 事件 ----------------------------- */
  function bind() {
    dropzone.addEventListener("click", () => input.click());
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.code === "Space") { e.preventDefault(); input.click(); }
    });

    input.addEventListener("change", () => {
      addFiles(input.files);
      input.value = "";
    });

    ["dragenter", "dragover"].forEach((type) => {
      dropzone.addEventListener(type, (e) => {
        e.preventDefault();
        dropzone.classList.add("drag");
      });
    });
    ["dragleave", "drop"].forEach((type) => {
      dropzone.addEventListener(type, (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag");
      });
    });
    dropzone.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

    $("#playLocal").addEventListener("click", () => playAt(0));

    $("#clearLocal").addEventListener("click", () => {
      if (!items.length) { toast("列表本来就是空的"); return; }
      items.forEach((it) => URL.revokeObjectURL(it.src));
      items.length = 0;
      renderList();
      toast("已清空本地列表");
    });

    $("#localList").addEventListener("click", (e) => {
      const row = e.target.closest(".track");
      if (!row) return;
      const i = Number(row.dataset.index);

      if (e.target.closest("[data-remove]")) {
        e.stopPropagation();
        const [removed] = items.splice(i, 1);
        URL.revokeObjectURL(removed.src);
        renderList();
        toast("已移除：" + removed.title);
        return;
      }
      playAt(i);
    });
  }

  renderList();
  bind();
})();
