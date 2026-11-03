/* ==========================================================================
   声屿 SoundIsle · 公共外壳
   侧栏 + 顶栏注入、导航高亮、返回/前进、搜索框
   页面只需要放 <aside id="sidebarMount"> 和 <header id="topbarMount">
   ========================================================================== */

(function () {
  "use strict";

  const { $, url, toast } = window.App;

  const I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z"/></svg>',
    charts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 19V11M12 19V5M19 19v-5"/><path d="M3 19h18" opacity=".45"/></svg>',
    playlist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h10M4 11h10M4 16h6"/><path d="M17.5 9.5v7.2a2 2 0 1 1-1-1.7"/><circle cx="19" cy="9" r="1.6"/></svg>',
    local: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3l1.6 2h8.4a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19.5s-7-4.3-7-9.1A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4c0 4.8-7 9.1-7 9.1z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 1.8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
  };

  const NAV = [
    {
      title: "发现",
      items: [
        { page: "home", label: "发现音乐", href: "index.html", icon: I.home },
        { page: "charts", label: "排行榜", href: "pages/charts.html", icon: I.charts },
        { page: "playlists", label: "精选歌单", href: "pages/playlists.html", icon: I.playlist, badge: "NEW" },
        { page: "local", label: "本地音乐", href: "pages/local.html", icon: I.local }
      ]
    },
    {
      title: "我的",
      items: [
        { page: "favorites", label: "我的收藏", href: "pages/favorites.html", icon: I.heart },
        { page: "recent", label: "最近播放", href: "pages/recent.html", icon: I.clock },
        { page: "created", label: "创建的歌单", href: "#", icon: I.plus, todo: true }
      ]
    }
  ];

  function brand() {
    return (
      '<a class="brand" href="' + url("index.html") + '" aria-label="声屿首页">' +
        '<span class="brand-mark" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="#06121a" stroke-width="1.9" stroke-linecap="round">' +
            '<path d="M4 15.5c2.2-3.6 4.4-3.6 6.6 0s4.4 3.6 6.6 0"/>' +
            '<path d="M4 10.5c2.2-3.6 4.4-3.6 6.6 0s4.4 3.6 6.6 0" opacity=".55"/>' +
            '<circle cx="18.4" cy="5.4" r="1.5" fill="#06121a" stroke="none"/>' +
          "</svg>" +
        "</span>" +
        "<span><span class=\"brand-name\">声屿</span><span class=\"brand-sub\">SOUND ISLE</span></span>" +
      "</a>"
    );
  }

  function navGroup(group, active) {
    return (
      '<nav class="nav-group" aria-label="' + group.title + '">' +
        '<p class="nav-title">' + group.title + "</p>" +
        group.items.map((item) => {
          const cls = "nav-item" + (item.page === active ? " active" : "");
          const badge = item.badge ? '<span class="nav-badge">' + item.badge + "</span>" : "";
          const href = item.todo ? "#" : url(item.href);
          return '<a class="' + cls + '" href="' + href + '"' +
            (item.todo ? ' data-todo="' + item.label + '"' : "") +
            ">" + item.icon + "<span>" + item.label + "</span>" + badge + "</a>";
        }).join("") +
      "</nav>"
    );
  }

  function renderSidebar(active) {
    const mount = $("#sidebarMount");
    if (!mount) return;
    mount.innerHTML =
      brand() +
      NAV.map((g) => navGroup(g, active)).join("") +
      '<div class="side-foot"><p><b>纯静态演示</b><br>无服务器 · 数据保存在本地</p></div>';
  }

  function renderTopbar() {
    const mount = $("#topbarMount");
    if (!mount) return;
    mount.innerHTML =
      '<button class="circle-btn" id="backBtn" title="后退" aria-label="后退">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6l-6 6 6 6"/></svg>' +
      "</button>" +
      '<button class="circle-btn" id="fwdBtn" title="前进" aria-label="前进">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6l6 6-6 6"/></svg>' +
      "</button>" +
      '<div class="search">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.4"/><path d="M16 16l4 4"/></svg>' +
        '<input id="searchInput" type="search" placeholder="搜索歌曲、歌手或歌单" aria-label="搜索">' +
      "</div>" +
      '<div class="top-right">' +
        '<button class="ghost-btn" id="loginBtn">登录</button>' +
        '<div class="avatar" title="访客">屿</div>' +
      "</div>";

    const back = $("#backBtn");
    const fwd = $("#fwdBtn");
    if (back) back.addEventListener("click", () => history.back());
    if (fwd) fwd.addEventListener("click", () => history.forward());

    const login = $("#loginBtn");
    if (login) login.addEventListener("click", () => toast("登录功能为纯前端模拟，第 7 天补充"));

    const avatar = $(".avatar");
    if (avatar) avatar.addEventListener("click", () => toast("访客模式 · 收藏保存在本机"));

    const input = $("#searchInput");
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        const q = input.value.trim();
        if (!q) return;
        toast("搜索「" + q + "」将在第 5 天开放");
        input.blur();
      });
    }
  }

  function bindTodoLinks() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-todo]");
      if (!link) return;
      e.preventDefault();
      toast("「" + link.dataset.todo + "」将在后续提交中开放");
    });
  }

  function init() {
    const active = (document.body && document.body.dataset.page) || "";
    renderSidebar(active);
    renderTopbar();
    bindTodoLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
