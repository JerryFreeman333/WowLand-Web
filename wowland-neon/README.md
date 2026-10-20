# 温州奶龙大学 WowLand — 赛博朋克内容站

参考 `samsy.ninja` 的红色霓虹、黑色底、扫描线、网格与终端式信息层级制作的静态站点。

## 文件
- `index.html`：页面结构
- `styles.css`：视觉系统与响应式
- `app.js`：渲染、导航、粒子、公告/记录切换与模板入口
- `data.js`：所有可编辑内容
- `assets/`：三校图片（含优化 webp）
- `screenshots/`：桌面/平板/手机预览，含 `desktop-qr.png` 二维码弹窗

## 动效系统（ouke.club 风格）
- 触发：元素露出约 30% 时进场（`IntersectionObserver threshold:.3`）
- 缓动：`cubic-bezier(.16,1,.3,1)` expo-out，入场 0.95s
- 错峰：同组卡片按 0.06s 逐步延迟，上限 0.18s（`--d` 变量）
- 悬浮：入场完成后切换 `cubic-bezier(.34,1.56,.64,1)` 弹簧曲线，卡片上浮 + 双色描边光晕
- 赛博装饰：数据流 ticker、HUD 边角框、电路走线动画、故障闪烁标题、终端光标
- 无障碍：`prefers-reduced-motion` 下全部动画禁用

## 全页粒子背景
`#fx` 画布从 Hero 提升为 `position:fixed` 的全视口共享背景层，滚动全程保持连续一致；粒子数量按视口自适应（手机 64 / 桌面 150），页面加载与窗口变化时重新铺点。Hero 的不透明底渐变已移除，让粒子层透出；页脚半透明，背景粒子隐约延续。

## 滚动色彩流
`.hero-mesh` 升级为全页固定的环境色场，随滚动在 Hero 配色（红为主 + 青/紫辅助）与内容区配色（紫/青为主 + 红收束）之间按视口高度关键帧插值，rAF 逐帧缓动（lerp 0.09），实现 Hero → 社群定位的平滑色彩过渡；`prefers-reduced-motion` 下直接跳至目标色。

## WowWall 留言墙
原「官方视觉与说明物料」区已替换为 WowWall 留言墙：大屏展示用户提供的 WowWall 海报（`assets/brand/wowwall-poster.webp`），「前往留言」按钮跳转 `https://wall.qianc.ltd/`。链接与文案在 `data.js` 的 `wall` 字段维护；首屏迷你海报与导航均已指向留言墙。

## 未来编辑入口
1. 公告：编辑 `data.js` → `notices`
2. 活动记录：编辑 `data.js` → `logs`；页面空态也提供“填入活动记录模板”
3. 三校信息：`data.js` → `networks`
4. 活动品牌：`data.js` → `brands`
5. 资源与 FAQ：`data.js` → `resources` / `faq`

## 赛博朋克交互美术升级（CYBER ART LAYER 3.0）
- **全站 HUD 框架**：固定四角框线、右侧滚动进度、底部遥测条（节点状态 / 当前区块 / 指针坐标 / 本地时间），导航下方常驻数据流。
- **自定义霓虹光标**：菱形锁定框、悬停扫描标签与点击锁定涟漪；触摸设备自动回退系统光标。
- **区块专属艺术母题**：关于页身份档案、活动品牌全息卡片、参与路径电路节点、公告板 LIVE FEED、活动记录 CRT 信号屏、留言墙 CAM 监控框、往期回顾档案环。
- **卡片交互**：指针跟随聚光、3D 倾斜、扫描线、四角 HUD 标记与故障标题。
- **终端式细节**：开机启动日志、区块编号与 ACCESS GRANTED 读数、页脚幽灵字、二维码弹窗 NODE 标签与扫描解码。
- **无障碍**：`prefers-reduced-motion` 下关闭动画与自定义光标；保留键盘焦点、菜单 `Esc` 关闭和二维码焦点陷阱。

## 本地预览
直接双击 `index.html`，或：
```bash
python3 -m http.server 8080
# 打开 http://127.0.0.1:8080
```

## 正式接入建议
- 报名表单：替换 `#joinForm` 或把提交地址改为抖音群/问卷链接
- 视频：将 `brands` 中增加 `video` 字段后扩展渲染
- 部署：纯静态，可直接放 GitHub Pages / Vercel / Nginx
