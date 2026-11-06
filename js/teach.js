/* ==========================================================================
   留白 WHITE SPACE · 拍摄笔记
   三个分类 × 三条最基础的笔记；每条都能打开对应照片对照
   ========================================================================== */

(function () {
  "use strict";

  const { $, esc, Lightbox, revealInit } = window.App;
  const DATA = window.DATA;

  const LESSONS = {
    compose: {
      label: "构图", en: "FRAME",
      intro: "先把画面切好，再考虑别的。",
      cards: [
        { n: "01", title: "三分法", photo: "p01",
          text: "把画面横竖各切两刀，主体放在四条线的交点上。拍山、拍人、拍静物都能先用这一招，比居中更耐看。" },
        { n: "02", title: "引导线", photo: "p13",
          text: "路、栏杆、田埂、光斑都能当线用。线从画面一角出发，指向你想让人看的地方，视线就会跟着走。" },
        { n: "03", title: "负空间", photo: "p11",
          text: "留白不是浪费。主体越小、空白越大，照片越安静。先学会删，再学会加。" }
      ]
    },
    light: {
      label: "光线", en: "LIGHT",
      intro: "光从哪来，决定照片长什么样。",
      cards: [
        { n: "04", title: "低照度", photo: "p06",
          text: "室内和夜里，先保证快门不糊：1/60 以上，ISO 不够就继续加。噪点可以后期，糊片不行。" },
        { n: "05", title: "混合色温", photo: "p09",
          text: "冷暖光同时出现时，别急着统一白平衡。保留冲突，照片才有夜晚的味道。" },
        { n: "06", title: "侧逆光", photo: "p16",
          text: "让光从斜后方来，物体边缘会亮起一道线。轮廓光是免费的高级感，等光比换镜头有用。" }
      ]
    },
    params: {
      label: "参数", en: "SETTINGS",
      intro: "三个数字够用了：光圈、快门、ISO。",
      cards: [
        { n: "07", title: "光圈与景深", photo: "p16",
          text: "想背景糊成一片用 f/1.8–f/2.8；想风景从近到远都清楚，收到 f/8–f/11。光圈越小，景深越深。" },
        { n: "08", title: "快门与动静", photo: "p06",
          text: "拍走动的人 1/125 起步；想拍出雨丝的拖影，降到 1/15 并屏住呼吸，最好找地方靠着。" },
        { n: "09", title: "ISO 与噪点", photo: "p09",
          text: "宁可高 ISO 拿到能用的照片，也不要为了干净而拍糊。噪点能修，手抖修不回来。" }
      ]
    }
  };

  const tabsBox = $("#tabs");
  const listBox = $("#lessons");
  let current = "compose";

  function renderTabs() {
    tabsBox.innerHTML = "";
    Object.keys(LESSONS).forEach((key) => {
      const t = LESSONS[key];
      const b = document.createElement("button");
      b.className = "tab" + (current === key ? " is-on" : "");
      b.innerHTML = esc(t.label) + '<span class="en">' + esc(t.en) + "</span>";
      b.addEventListener("click", () => {
        if (current === key) return;
        current = key;
        renderTabs();
        renderList();
      });
      tabsBox.appendChild(b);
    });
  }

  function renderList() {
    const t = LESSONS[current];
    const intro = $("#lessonIntro");
    if (intro) intro.textContent = t.intro;

    listBox.innerHTML = "";
    t.cards.forEach((c, i) => {
      const row = document.createElement("article");
      row.className = "lesson reveal";
      row.style.transitionDelay = i * 60 + "ms";
      row.innerHTML =
        '<span class="num">' + esc(c.n) + "</span>" +
        '<div class="body"><h3>' + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></div>" +
        '<button class="link" type="button">对照照片 <span>→</span></button>';

      row.querySelector(".link").addEventListener("click", () => {
        const idx = DATA.photos.findIndex((p) => p.id === c.photo);
        Lightbox.open(DATA.photos, idx < 0 ? 0 : idx);
      });
      listBox.appendChild(row);
    });

    revealInit();
  }

  renderTabs();
  renderList();
  revealInit();
})();
