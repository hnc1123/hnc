/* ==========================================================================
   留白 WHITE SPACE · 系列详情
   pages/series.html?id=s1
   ========================================================================== */

(function () {
  "use strict";

  const { $, esc, photoFrame, Lightbox, revealInit } = window.App;
  const DATA = window.DATA;

  const params = new URLSearchParams(window.location.search);
  const wanted = params.get("id");
  const s = DATA.seriesById[wanted] || DATA.series[0];
  const photos = DATA.photosOf(s.id);

  document.title = s.title + " · 留白 WHITE SPACE";

  const set = (sel, text) => { const n = $(sel); if (n) n.textContent = text; };
  set("#sEn", s.en);
  set("#sTitle", s.title);
  set("#sDesc", s.desc);
  set("#sYear", s.year);
  set("#sPlace", s.place);
  set("#sCount", photos.length + " 张作品");

  const grid = $("#seriesGrid");
  photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "work reveal";
    fig.style.transitionDelay = Math.min(i, 6) * 45 + "ms";
    fig.innerHTML = photoFrame(p) +
      '<figcaption><b>' + esc(p.title) + "</b><span>" + esc(p.year) + "</span></figcaption>";
    const frame = fig.querySelector(".frame");
    if (frame) frame.style.aspectRatio = p.ratio;
    fig.addEventListener("click", () => Lightbox.open(photos, i));
    grid.appendChild(fig);
  });

  const index = DATA.series.findIndex((x) => x.id === s.id);
  const prev = DATA.series[(index - 1 + DATA.series.length) % DATA.series.length];
  const next = DATA.series[(index + 1) % DATA.series.length];

  const prevLink = $("#prevSeries");
  const nextLink = $("#nextSeries");
  if (prevLink) { prevLink.href = "series.html?id=" + prev.id; prevLink.textContent = "← " + prev.title; }
  if (nextLink) { nextLink.href = "series.html?id=" + next.id; nextLink.textContent = next.title + " →"; }

  revealInit();
})();
