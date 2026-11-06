/* ==========================================================================
   留白 WHITE SPACE · 公共外壳
   顶部导航 + 页脚；页面只需放 #navMount / #footerMount
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, esc } = window.App;

  const LINKS = [
    { page: "home", label: "首页", href: "index.html" },
    { page: "gallery", label: "作品集", href: "pages/gallery.html" },
    { page: "teach", label: "教学", href: "pages/teach.html" },
    { page: "about", label: "关于", href: "pages/about.html" }
  ];

  function activePage() {
    return (document.body && document.body.dataset.page) || "";
  }

  function renderNav() {
    const mount = $("#navMount");
    if (!mount) return;
    const current = activePage();
    const isSeries = current === "series";

    mount.innerHTML =
      '<nav class="nav" id="siteNav" aria-label="主导航">' +
        '<div class="nav-inner">' +
          '<a class="brand" href="' + url("index.html") + '">' +
            '<span class="zh">留白</span>' +
            '<span class="en">WHITE SPACE</span>' +
          "</a>" +
          '<div class="nav-links">' +
            LINKS.map((l) => {
              const on = l.page === current || (isSeries && l.page === "gallery");
              return '<a href="' + url(l.href) + '"' + (on ? ' class="active"' : "") +
                ' data-nav="' + esc(l.page) + '">' + esc(l.label) + "</a>";
            }).join("") +
          "</div>" +
          '<button class="nav-immerse" id="navImmerse" type="button" title="全屏看图">沉浸</button>' +
        "</div>" +
      "</nav>";

    const nav = $("#siteNav");
    const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const btn = $("#navImmerse");
    if (btn) {
      btn.addEventListener("click", () => {
        const first = document.querySelector("[data-work]");
        if (first) { first.click(); return; }
        window.location.href = url("pages/gallery.html");
      });
    }
  }

  function renderFooter() {
    const mount = $("#footerMount");
    if (!mount) return;

    mount.innerHTML =
      '<footer class="site-footer">' +
        '<div class="footer-inner">' +
          '<div class="footer-brand">' +
            '<div class="zh">留白</div>' +
            "<p>一个关于自然、城市与静物的长期拍摄计划。照片与文字均为课程作业虚构，不涉及任何真实人物或机构。</p>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>浏览</h4>" +
            '<a href="' + url("pages/gallery.html") + '">作品集</a>' +
            '<a href="' + url("pages/teach.html") + '">拍摄笔记</a>' +
            '<a href="' + url("index.html#series") + '">系列</a>' +
            '<a href="' + url("pages/about.html") + '">关于</a>' +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>联系</h4>" +
            '<a href="mailto:hello@whitespace.studio">hello@whitespace.studio</a>' +
            '<a href="#" onclick="return false">Instagram</a>' +
            '<a href="#" onclick="return false">小红书</a>' +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>© 2026 留白 WHITE SPACE</span>" +
          "<span>课程作业演示 · 无任何真实人物与机构</span>" +
        "</div>" +
      "</footer>";
  }

  renderNav();
  renderFooter();
})();
