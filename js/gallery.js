/* ==========================================================================
   留白 WHITE SPACE · 作品集
   筛选 / 瀑布流 / 自己的照片（本地库）/ 灯箱
   ========================================================================== */

(function () {
  "use strict";

  const { $, $$, esc, photoFrame, Lightbox, revealInit, toast } = window.App;
  const DATA = window.DATA;

  const grid = $("#grid");
  const filtersBox = $("#filters");
  const fileInput = $("#fileInput");
  const addBtn = $("#addPhoto");

  const TONES = [
    ["#4b5563", "#171b20"], ["#4d3d33", "#17120f"], ["#48525c", "#161b20"],
    ["#5b3b62", "#1b1322"], ["#5b4a3f", "#1b1613"], ["#4f5761", "#181d22"]
  ];

  let local = [];
  let current = "all";

  const pad = (n) => String(n).padStart(2, "0");
  const all = () => DATA.photos.concat(local);

  function filtered() {
    if (current === "all") return all();
    if (current === "local") return local.slice();
    return all().filter((p) => p.series === current);
  }

  function metaOf(p) {
    if (p.local) return "本地 · " + p.year;
    const s = DATA.seriesById[p.series];
    return (s ? s.title : "") + " · " + p.year;
  }

  function hashOf(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  /* ----------------------------- 筛选 ----------------------------- */
  function renderFilters() {
    const items = [{ id: "all", label: "全部", n: all().length }];
    DATA.series.forEach((s) => {
      items.push({ id: s.id, label: s.title, n: all().filter((p) => p.series === s.id).length });
    });
    if (local.length) items.push({ id: "local", label: "我的照片", n: local.length });

    filtersBox.innerHTML = "";
    items.forEach((it) => {
      const b = document.createElement("button");
      b.className = "filter" + (current === it.id ? " active" : "");
      b.innerHTML = esc(it.label) + '<span class="n">' + pad(it.n) + "</span>";
      b.addEventListener("click", () => {
        if (current === it.id) return;
        current = it.id;
        renderFilters();
        switchTo();
      });
      filtersBox.appendChild(b);
    });
  }

  function switchTo() {
    grid.classList.add("is-switching");
    window.setTimeout(() => {
      render();
      grid.classList.remove("is-switching");
    }, 160);
  }

  /* ----------------------------- 网格 ----------------------------- */
  function render() {
    const list = filtered();
    grid.innerHTML = "";

    if (!list.length) {
      grid.innerHTML = '<p class="grid-empty">这个系列还没有照片。</p>';
      return;
    }

    list.forEach((p, i) => {
      const fig = document.createElement("figure");
      fig.className = "work reveal";
      fig.dataset.work = p.id;
      fig.style.transitionDelay = Math.min(i, 8) * 45 + "ms";
      fig.innerHTML =
        photoFrame(p) +
        '<figcaption><b>' + esc(p.title) + "</b><span>" + esc(metaOf(p)) + "</span></figcaption>" +
        (p.local ? '<button class="work-remove" type="button" aria-label="移除这张照片">×</button>' : "");

      const frame = fig.querySelector(".frame");
      if (frame) frame.style.aspectRatio = p.ratio;

      fig.addEventListener("click", (e) => {
        if (e.target.closest(".work-remove")) return;
        Lightbox.open(list, i);
      });

      const rm = fig.querySelector(".work-remove");
      if (rm) rm.addEventListener("click", (e) => {
        e.stopPropagation();
        removeLocal(p);
      });

      grid.appendChild(fig);
    });

    const counter = $("#totalCount");
    if (counter) counter.textContent = all().length;

    revealInit();
  }

  /* ----------------------------- 添加 / 移除 ----------------------------- */
  async function handleFiles(fileList) {
    const files = Array.prototype.slice.call(fileList || []).filter((f) => /^image\//.test(f.type));
    if (!files.length) { toast("请选择图片文件"); return; }

    let added = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 15 * 1024 * 1024) continue;
      try {
        let ratio = "4/5";
        try {
          const bmp = await createImageBitmap(file);
          ratio = bmp.width + "/" + bmp.height;
          if (bmp.close) bmp.close();
        } catch (e) { /* 读不到尺寸就用默认比例 */ }

        const rec = {
          id: "u" + Date.now() + "-" + i,
          title: "我的照片 " + pad(local.length + added + 1),
          year: String(new Date().getFullYear()),
          ratio: ratio,
          type: file.type,
          blob: file,
          createdAt: Date.now()
        };

        if (Library.supported) {
          try { await Library.add(rec); } catch (e) { /* 存不进就只在本次显示 */ }
        }

        local.unshift(Object.assign({}, rec, {
          url: URL.createObjectURL(file),
          local: true,
          tone: TONES[hashOf(rec.id) % TONES.length]
        }));
        added++;
      } catch (e) { /* 跳过坏文件 */ }
    }

    if (!added) { toast("添加失败，换一张试试"); return; }
    current = "local";
    renderFilters();
    render();
    toast("已添加 " + added + " 张" + (Library.supported ? "，刷新后仍然保留" : ""));
  }

  async function removeLocal(p) {
    local = local.filter((x) => x.id !== p.id);
    if (p.url) URL.revokeObjectURL(p.url);
    if (Library.supported) { try { await Library.remove(p.id); } catch (e) { /* ignore */ } }
    if (!local.length) current = "all";
    renderFilters();
    render();
    toast("已移除");
  }

  /* ----------------------------- 启动 ----------------------------- */
  if (addBtn && fileInput) {
    addBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      handleFiles(fileInput.files);
      fileInput.value = "";
    });
  }

  renderFilters();
  render();
  revealInit();

  if (Library.supported) {
    Library.all().then((recs) => {
      if (!recs || !recs.length) return;
      local = recs
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .map((r) => Object.assign({}, r, {
          url: URL.createObjectURL(r.blob),
          local: true,
          tone: TONES[hashOf(r.id) % TONES.length]
        }));
      renderFilters();
      render();
    }).catch(() => { /* 无痕模式等情况下静默降级 */ });
  }
})();
