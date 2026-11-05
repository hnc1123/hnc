/* ==========================================================================
   声屿 SoundIsle · 站点数据
   全部内容均为虚构，仅用于课程作业演示；不含任何真实平台或歌手信息。
   纯前端静态数据：不请求服务器，各页面共用这一份。
   ========================================================================== */

window.DATA = (function () {
  "use strict";

  /* 曲库：详情页、榜单、收藏都从这里取 */
  const songs = [
    { id: "s1",  title: "晚风寄信",       artist: "林雾",         album: "夜航",       duration: 222, cover: "c1" },
    { id: "s2",  title: "潮汐信号",       artist: "岛屿电台",     album: "潮汐",       duration: 245, cover: "c2" },
    { id: "s3",  title: "失重花园",       artist: "银河快递",     album: "失重花园",   duration: 198, cover: "c3" },
    { id: "s4",  title: "凌晨四点的便利店", artist: "陈一野",     album: "夜班",       duration: 271, cover: "c4" },
    { id: "s5",  title: "雾中列车",       artist: "白鹿川",       album: "雾中列车",   duration: 236, cover: "c5" },
    { id: "s6",  title: "热汤",           artist: "深夜食堂乐队", album: "深夜食堂",   duration: 209, cover: "c6" },
    { id: "s7",  title: "玻璃海",         artist: "南屿",         album: "玻璃海",     duration: 252, cover: "c7" },
    { id: "s8",  title: "第七个路口",     artist: "言川",         album: "城市切片",   duration: 227, cover: "c8" },
    { id: "s9",  title: "慢速生长",       artist: "苔原",         album: "苔原",       duration: 301, cover: "c1" },
    { id: "s10", title: "晚安，陌生人",   artist: "许听",         album: "晚安",       duration: 213, cover: "c3" },
    { id: "s11", title: "霓虹乘客",       artist: "岛屿电台",     album: "潮汐",       duration: 232, cover: "c2" },
    { id: "s12", title: "旧磁带",         artist: "拾光机",       album: "1998",       duration: 244, cover: "c5" },
    { id: "s13", title: "雨停之前",       artist: "窗边座位",     album: "天气",       duration: 218, cover: "c6" },
    { id: "s14", title: "把耳机借给月亮", artist: "月台 3 号",    album: "夜行列车",   duration: 256, cover: "c7" },
    { id: "s15", title: "通勤",           artist: "早班地铁",     album: "环线",       duration: 187, cover: "c4" },
    { id: "s16", title: "白噪音",         artist: "白噪音小组",   album: "专注",       duration: 320, cover: "c8" },
    { id: "s17", title: "凌晨两点",       artist: "晚风电台",     album: "城市夜行",   duration: 241, cover: "c1" },
    { id: "s18", title: "回南天",         artist: "南屿",         album: "玻璃海",     duration: 229, cover: "c2" }
  ];

  const byId = {};
  songs.forEach((s) => { byId[s.id] = s; });

  const playlists = [
    {
      id: "p1", title: "凌晨两点的城市", author: "晚风电台", tag: "氛围",
      plays: "32.6万", cover: "c1",
      desc: "路灯把影子拉得很长，便利店还亮着。这张歌单给所有还没回家的人。",
      songIds: ["s17", "s1", "s4", "s11", "s10", "s8", "s5", "s2"]
    },
    {
      id: "p2", title: "把耳机借给月亮", author: "岛屿唱片", tag: "治愈",
      plays: "18.2万", cover: "c2",
      desc: "适合躺在床上、关掉大灯之后听的一组歌，音量调到刚好听见呼吸。",
      songIds: ["s14", "s10", "s7", "s9", "s13", "s5"]
    },
    {
      id: "p3", title: "通勤路上的三十分钟", author: "早班地铁", tag: "轻快",
      plays: "56.9万", cover: "c3",
      desc: "从进站到出站，刚好三十分钟。鼓点比闹钟温柔一点。",
      songIds: ["s15", "s8", "s3", "s11", "s1", "s6"]
    },
    {
      id: "p4", title: "写代码时不要切歌", author: "白噪音小组", tag: "专注",
      plays: "9.4万", cover: "c4",
      desc: "没有突然的高音，也没有突然的安静，适合一口气写完一个模块。",
      songIds: ["s16", "s9", "s3", "s12", "s17"]
    },
    {
      id: "p5", title: "旧磁带里的夏天", author: "拾光机", tag: "怀旧",
      plays: "41.7万", cover: "c5",
      desc: "卡带机转动的沙沙声，是这张歌单的底色。",
      songIds: ["s12", "s13", "s14", "s7", "s10"]
    },
    {
      id: "p6", title: "雨天限定歌单", author: "窗边座位", tag: "安静",
      plays: "27.3万", cover: "c6",
      desc: "窗外在下雨的时候，适合把这张歌单从头放到尾。",
      songIds: ["s13", "s5", "s9", "s10", "s2", "s6"]
    }
  ];

  const charts = [
    {
      id: "rising", title: "飙升榜", icon: "bolt", update: "每小时更新",
      songIds: ["s1", "s2", "s3", "s4", "s5"]
    },
    {
      id: "fresh", title: "新声榜", icon: "star", update: "每周一更新",
      songIds: ["s6", "s7", "s8", "s9", "s10"]
    }
  ];

  /* 歌曲在榜单里的趋势标记 */
  const trends = {
    s1: { text: "↑ 128%", type: "up" },
    s2: { text: "↑ 76%", type: "up" },
    s3: { text: "↑ 51%", type: "up" },
    s4: { text: "—", type: "flat" },
    s5: { text: "↑ 22%", type: "up" },
    s6: { text: "NEW", type: "new" },
    s7: { text: "NEW", type: "new" },
    s8: { text: "↑ 34%", type: "up" },
    s9: { text: "—", type: "flat" },
    s10: { text: "↑ 12%", type: "up" }
  };

  function song(id) { return byId[id] || null; }
  function songList(ids) { return (ids || []).map(song).filter(Boolean); }
  function playlist(id) { return playlists.find((p) => p.id === id) || null; }
  function chart(id) { return charts.find((c) => c.id === id) || null; }
  function playlistSongs(id) {
    const p = playlist(id);
    return p ? songList(p.songIds) : [];
  }

  /* ----------------------------- 歌手 / 专辑（由曲库推导） ----------------------------- */
  const artistIndex = {};
  songs.forEach((s) => {
    if (!artistIndex[s.artist]) artistIndex[s.artist] = { name: s.artist, songs: [], cover: s.cover };
    artistIndex[s.artist].songs.push(s);
  });

  Object.keys(artistIndex).forEach((name) => {
    const a = artistIndex[name];
    const map = {};
    a.songs.forEach((s) => {
      if (!map[s.album]) map[s.album] = { name: s.album, artist: name, cover: s.cover, songs: [] };
      map[s.album].songs.push(s);
    });
    a.albums = Object.keys(map).map((k) => map[k]);
    a.duration = a.songs.reduce((n, s) => n + s.duration, 0);
  });

  function artists() { return Object.keys(artistIndex).map((k) => artistIndex[k]); }
  function artist(name) { return artistIndex[name] || null; }

  function albums() {
    return artists().reduce((all, a) => all.concat(a.albums), []);
  }
  function album(name, artistName) {
    return albums().find((al) => al.name === name && (!artistName || al.artist === artistName)) || null;
  }

  return {
    site: { name: "声屿", en: "SoundIsle", slogan: "把喜欢的歌，留在自己的岛上" },
    songs,
    playlists,
    charts,
    trends,
    hero: {
      desc: "深夜电台第 24 期：九首适合独自走回家的歌，从霓虹路口一路放到楼下。",
      trackId: "s1"
    },
    song,
    songList,
    playlist,
    playlistSongs,
    chart,
    artists,
    artist,
    albums,
    album
  };
})();
