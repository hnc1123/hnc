/* ==========================================================================
   留白 WHITE SPACE · 作品数据
   全部为虚构的拍摄计划与作品信息，仅用于课程作业演示。
   照片文件放在 assets/photos/，按 file 字段命名即可自动显示；
   文件不存在时，页面会用同色系渐变占位，不会出现破图。
   ========================================================================== */

window.DATA = (function () {
  "use strict";

  const series = [
    {
      id: "s1",
      title: "山与雾",
      en: "MOUNTAIN MIST",
      year: "2025",
      place: "川西",
      tone: ["#48515b", "#24282f"],
      desc: "连续三年在同一片山谷等待起雾。雾把山脊化简成几层灰，剩下的只有等待和呼吸。"
    },
    {
      id: "s2",
      title: "夜行城市",
      en: "NIGHT WALK",
      year: "2024",
      place: "上海",
      tone: ["#463c38", "#241f1e"],
      desc: "末班地铁之后，城市换了一副表情。这组照片拍的都是凌晨零点到三点之间，还在街上的人。"
    },
    {
      id: "s3",
      title: "潮间带",
      en: "INTERTIDAL",
      year: "2025",
      place: "福建",
      tone: ["#49555b", "#24292e"],
      desc: "退潮之后，礁石、盐田和搁浅的贝壳构成一张临时的地图，下一次涨潮就会把它擦掉。"
    },
    {
      id: "s4",
      title: "静物与手",
      en: "OBJECTS & HANDS",
      year: "2026",
      place: "工作室",
      tone: ["#554f46", "#272421"],
      desc: "在被拍摄之前，物件先被手触摸过很多次。这组照片关于光线、灰尘和留下的痕迹。"
    }
  ];

  const photos = [
    { id: "p01", title: "雾起时", series: "s1", category: "landscape", year: "2025", file: "p01.jpg", ratio: "4/5", tone: ["#48515b", "#24282f"] },
    { id: "p02", title: "垭口", series: "s1", category: "landscape", year: "2025", file: "p02.jpg", ratio: "3/2", tone: ["#5e6672", "#282c34"] },
    { id: "p03", title: "冷杉线", series: "s1", category: "landscape", year: "2025", file: "p03.jpg", ratio: "4/5", tone: ["#364648", "#1f2727"] },
    { id: "p04", title: "雪线以上", series: "s1", category: "landscape", year: "2025", file: "p04.jpg", ratio: "3/2", tone: ["#757f89", "#2c3138"] },
    { id: "p05", title: "云海", series: "s1", category: "landscape", year: "2025", file: "p05.jpg", ratio: "1/1", tone: ["#535f6c", "#252b38"] },

    { id: "p06", title: "末班地铁", series: "s2", category: "street", year: "2024", file: "p06.jpg", ratio: "4/5", tone: ["#463c38", "#241f1e"] },
    { id: "p07", title: "便利店", series: "s2", category: "street", year: "2024", file: "p07.jpg", ratio: "3/2", tone: ["#5e4e3e", "#282421"] },
    { id: "p08", title: "天桥", series: "s2", category: "street", year: "2024", file: "p08.jpg", ratio: "4/5", tone: ["#3c414c", "#1f2229"] },
    { id: "p09", title: "霓虹雨", series: "s2", category: "street", year: "2024", file: "p09.jpg", ratio: "3/2", tone: ["#5f3c66", "#27212c"] },
    { id: "p10", title: "出租车", series: "s2", category: "street", year: "2024", file: "p10.jpg", ratio: "1/1", tone: ["#4c463e", "#242221"] },

    { id: "p11", title: "退潮", series: "s3", category: "landscape", year: "2025", file: "p11.jpg", ratio: "3/2", tone: ["#49555b", "#24292e"] },
    { id: "p12", title: "礁石", series: "s3", category: "landscape", year: "2025", file: "p12.jpg", ratio: "4/5", tone: ["#44515e", "#22282e"] },
    { id: "p13", title: "盐田", series: "s3", category: "landscape", year: "2025", file: "p13.jpg", ratio: "3/2", tone: ["#616872", "#2b2f35"] },
    { id: "p14", title: "海雾", series: "s3", category: "landscape", year: "2025", file: "p14.jpg", ratio: "1/1", tone: ["#515e69", "#252b32"] },
    { id: "p15", title: "拾贝", series: "s3", category: "still", year: "2025", file: "p15.jpg", ratio: "4/5", tone: ["#534e46", "#272522"] },

    { id: "p16", title: "侧光", series: "s4", category: "portrait", year: "2026", file: "p16.jpg", ratio: "4/5", tone: ["#5e4f48", "#292422"] },
    { id: "p17", title: "窗边", series: "s4", category: "still", year: "2026", file: "p17.jpg", ratio: "3/2", tone: ["#4e525b", "#25282e"] },
    { id: "p18", title: "旧信", series: "s4", category: "still", year: "2026", file: "p18.jpg", ratio: "4/5", tone: ["#554f46", "#272421"] }
  ];

  const categories = [
    { id: "all", label: "全部" },
    { id: "landscape", label: "风景" },
    { id: "street", label: "街头" },
    { id: "still", label: "静物" },
    { id: "portrait", label: "人像" }
  ];

  const seriesById = {};
  series.forEach((s) => { seriesById[s.id] = s; });

  const photoById = {};
  photos.forEach((p) => { photoById[p.id] = p; });

  function photosOf(seriesId) {
    return photos.filter((p) => p.series === seriesId);
  }

  function coverOf(seriesId) {
    return photosOf(seriesId)[0] || null;
  }

  return {
    site: {
      name: "留白",
      en: "WHITE SPACE",
      slogan: "把光留在空白处",
      email: "hello@whitespace.studio"
    },
    series,
    photos,
    categories,
    seriesById,
    photoById,
    photosOf,
    coverOf
  };
})();
