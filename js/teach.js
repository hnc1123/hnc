/* ==========================================================================
   留白 WHITE SPACE · 拍摄笔记
   三个分类 × 三条笔记；每条带「常见错误」和「一个小练习」
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
          text: "把画面横竖各切两刀，主体放在四条线的交点上。拍山、拍人、拍静物都能先用这一招，比居中更耐看。",
          mistake: "主体永远压在正中间，四个交点全是空的。",
          drill: "同一场景拍三张，分别把主体放左上、右下、正中，回看哪张更稳。" },
        { n: "02", title: "引导线", photo: "p13",
          text: "路、栏杆、田埂、光斑都能当线用。线从画面一角出发，指向你想让人看的地方，视线就会跟着走。",
          mistake: "线从画面中间横着穿过，或者指向画面外。",
          drill: "找一条路或栏杆，蹲低一点，让线从角落进入并指向远处的人。" },
        { n: "03", title: "负空间", photo: "p11",
          text: "留白不是浪费。主体越小、空白越大，照片越安静。先学会删，再学会加。",
          mistake: "空白里塞满杂物，主体又太小，两头不靠。",
          drill: "找一面纯色墙或一片天，只留一个主体，拍三张不同留白比例。" }
      ]
    },
    light: {
      label: "光线", en: "LIGHT",
      intro: "光从哪来，决定照片长什么样。",
      cards: [
        { n: "04", title: "低照度", photo: "p06",
          text: "室内和夜里，先保证快门不糊：1/60 以上，ISO 不够就继续加。噪点可以后期，糊片不行。",
          mistake: "为了降噪把 ISO 压到 400，结果整张糊掉。",
          drill: "夜里在室内拍走动的人，ISO 从 800 试到 6400，看哪一档还能接受。" },
        { n: "05", title: "混合色温", photo: "p09",
          text: "冷暖光同时出现时，别急着统一白平衡。保留冲突，照片才有夜晚的味道。",
          mistake: "一上来就调白平衡，把夜晚调成了白天。",
          drill: "找冷暖光交界的地方，自动白平衡和日光白平衡各拍一张。" },
        { n: "06", title: "侧逆光", photo: "p16",
          text: "让光从斜后方来，物体边缘会亮起一道线。轮廓光是免费的高级感，等光比换镜头有用。",
          mistake: "正面补光太狠，边缘那条线被补没了。",
          drill: "傍晚背对太阳拍一个人或一个杯子，让边缘亮起来。" }
      ]
    },
    params: {
      label: "参数", en: "SETTINGS",
      intro: "三个数字够用了：光圈、快门、ISO。",
      cards: [
        { n: "07", title: "光圈与景深", photo: "p16",
          text: "想背景糊成一片用 f/1.8–f/2.8；想风景从近到远都清楚，收到 f/8–f/11。光圈越小，景深越深。",
          mistake: "拍风景全程 f/1.8，只有中间一小块是清楚的。",
          drill: "同一朵花，用 f/2.8 和 f/11 各拍一张，对比背景差多少。" },
        { n: "08", title: "快门与动静", photo: "p06",
          text: "拍走动的人 1/125 起步；想拍出雨丝的拖影，降到 1/15 并屏住呼吸，最好找地方靠着。",
          mistake: "手持 1/15 拍走动的人，回来一看全糊。",
          drill: "让朋友走过画面，用 1/1000、1/125、1/15 各拍一张。" },
        { n: "09", title: "ISO 与噪点", photo: "p09",
          text: "宁可高 ISO 拿到能用的照片，也不要为了干净而拍糊。噪点能修，手抖修不回来。",
          mistake: "一味追求画面干净，错过了该按快门的瞬间。",
          drill: "同一处暗光场景，ISO 1600 和 6400 各拍一张，放大看噪点。" }
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
        '<div class="body">' +
          "<h3>" + esc(c.title) + "</h3>" +
          "<p>" + esc(c.text) + "</p>" +
          '<div class="lesson-extra">' +
            "<p><b>常见错误</b>" + esc(c.mistake) + "</p>" +
            "<p><b>练一练</b>" + esc(c.drill) + "</p>" +
          "</div>" +
        "</div>" +
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
