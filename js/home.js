/* ==========================================================================
   留白 WHITE SPACE · 首页
   精选系列 / 最新作品 / 灯箱
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, esc, photoFrame, Lightbox, revealInit } = window.App;
  const D = window.DATA;

  const HOME_WORKS = ["p01", "p06", "p11", "p09", "p16", "p13"];

  function renderSeries() {
    const grid = $("#seriesGrid");
    const list = D.series.slice(0, 3);

    grid.innerHTML = list.map((s) => {
      const cover = D.coverOf(s.id);
      const count = D.photosOf(s.id).length;
      return (
        '<a class="series-card reveal" href="' + url("pages/series.html?id=" + s.id) + '">' +
          photoFrame(cover) +
          '<span class="count">' + count + " 张</span>" +
          "<h3>" + esc(s.title) + "</h3>" +
          '<p class="meta">' + esc(s.en) + " · " + esc(s.year) + " · " + esc(s.place) + "</p>" +
        "</a>"
      );
    }).join("");
  }

  function renderWorks() {
    const grid = $("#worksGrid");
    const list = HOME_WORKS.map((id) => D.photoById[id]).filter(Boolean);

    grid.innerHTML = list.map((p, i) => {
      const series = D.seriesById[p.series];
      return (
        '<figure class="work reveal" data-index="' + i + '">' +
          photoFrame(p) +
          "<figcaption><b>" + esc(p.title) + "</b><span>" + esc(series ? series.title : "") + " · " + esc(p.year) + "</span></figcaption>" +
        "</figure>"
      );
    }).join("");

    Array.prototype.slice.call(grid.querySelectorAll(".work img"), 0, 3).forEach((img) => {
      img.loading = "eager";
      img.decoding = "sync";
    });

    grid.addEventListener("click", (e) => {
      const item = e.target.closest("[data-index]");
      if (!item) return;
      Lightbox.open(list, Number(item.dataset.index));
    });
  }

  function init() {
    renderSeries();
    renderWorks();
    revealInit();
  }

  init();
})();
