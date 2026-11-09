# routine

一个原生 HTML / CSS / JavaScript 的小型个人网站，包含：

- 首页（Hero 图片 + 简介）
- 语录页（名言收藏）
- 项目页（项目点子清单）
- 《回声花园 / Echo Garden》HTML5 Canvas 单文件小游戏

## 在线访问

部署到 GitHub Pages 后：

- 网站首页：https://gms0717.github.io/routine/
- 《回声花园》小游戏：https://gms0717.github.io/routine/machine.html

## 《回声花园 / Echo Garden》

直接打开 `machine.html` 即可游玩，无需安装依赖或启动服务器。

一个关于「声音」的静谧解谜游戏：花园睡着了，你只有**一只铃**、**一道回声**。
转动镜面，让一次敲响的回声唤醒每一朵花。

- 点击镜子：翻转镜面方向（`/` ↔ `\`）
- 点击铃（或按空格）：敲响；回声沿直线传播，遇镜面 90° 反射
- 回声穿过花朵即「唤醒」它；一响唤醒全部花朵即可过关
- 5 个手工关卡，星级按敲响次数评定（一响三星）
- 支持鼠标与触摸，进度保存在浏览器 localStorage

游戏逻辑、关卡数据、渲染、音效都在 `machine.html` 内，方便直接分享或单独部署。

## 本地预览

直接双击 `index.html` 或 `machine.html`，或使用任意静态文件服务器。
