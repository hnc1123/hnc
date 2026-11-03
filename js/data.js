/* ==========================================================================
   声屿 SoundIsle · 站点数据
   全部内容均为虚构，仅用于课程作业演示；不含任何真实平台或歌手信息。
   纯前端静态数据：不请求服务器，后续页面共用这一份。
   ========================================================================== */

window.DATA = {
  site: {
    name: "声屿",
    en: "SoundIsle",
    slogan: "把喜欢的歌，留在自己的岛上"
  },

  /* 首屏 */
  hero: {
    desc: "深夜电台第 24 期：九首适合独自走回家的歌，从霓虹路口一路放到楼下。",
    track: {
      id: "t-hero",
      title: "晚风寄信",
      artist: "林雾",
      album: "深夜电台 Vol.24",
      duration: 222,
      cover: "c1"
    }
  },

  /* 推荐歌单 */
  playlists: [
    { id: "p1", title: "凌晨两点的城市", author: "晚风电台", tag: "氛围", plays: "32.6万", cover: "c1" },
    { id: "p2", title: "把耳机借给月亮", author: "岛屿唱片", tag: "治愈", plays: "18.2万", cover: "c2" },
    { id: "p3", title: "通勤路上的三十分钟", author: "早班地铁", tag: "轻快", plays: "56.9万", cover: "c3" },
    { id: "p4", title: "写代码时不要切歌", author: "白噪音小组", tag: "专注", plays: "9.4万", cover: "c4" },
    { id: "p5", title: "旧磁带里的夏天", author: "拾光机", tag: "怀旧", plays: "41.7万", cover: "c5" },
    { id: "p6", title: "雨天限定歌单", author: "窗边座位", tag: "安静", plays: "27.3万", cover: "c6" }
  ],

  /* 排行榜 */
  charts: [
    {
      id: "rising",
      title: "飙升榜",
      icon: "bolt",
      songs: [
        { id: "s1", title: "晚风寄信", artist: "林雾", duration: 222, trend: "↑ 128%", trendType: "up", cover: "c1" },
        { id: "s2", title: "潮汐信号", artist: "岛屿电台", duration: 245, trend: "↑ 76%", trendType: "up", cover: "c2" },
        { id: "s3", title: "失重花园", artist: "银河快递", duration: 198, trend: "↑ 51%", trendType: "up", cover: "c3" },
        { id: "s4", title: "凌晨四点的便利店", artist: "陈一野", duration: 271, trend: "—", trendType: "flat", cover: "c4" },
        { id: "s5", title: "雾中列车", artist: "白鹿川", duration: 236, trend: "↑ 22%", trendType: "up", cover: "c5" }
      ]
    },
    {
      id: "fresh",
      title: "新声榜",
      icon: "star",
      songs: [
        { id: "s6", title: "热汤", artist: "深夜食堂乐队", duration: 209, trend: "NEW", trendType: "new", cover: "c6" },
        { id: "s7", title: "玻璃海", artist: "南屿", duration: 252, trend: "NEW", trendType: "new", cover: "c7" },
        { id: "s8", title: "第七个路口", artist: "言川", duration: 227, trend: "↑ 34%", trendType: "up", cover: "c8" },
        { id: "s9", title: "慢速生长", artist: "苔原", duration: 301, trend: "—", trendType: "flat", cover: "c1" },
        { id: "s10", title: "晚安，陌生人", artist: "许听", duration: 213, trend: "↑ 12%", trendType: "up", cover: "c3" }
      ]
    }
  ]
};
