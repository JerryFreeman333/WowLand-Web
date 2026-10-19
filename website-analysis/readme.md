# samsy.ninja 拆解记录

本目录按《网站拆解工作流.md》整理。观察时间：2026-10-18 08:30–09:10 America/New_York。
环境：macOS + Headless Chromium 155.0.8059.82，桌面视口 1440×900，语言 en-US / zh-cn 两轮，减少动态效果。

## 证据来源

- REA `capture_browser_scenario`：首次入口截图、DOM、可访问性、网络事件与存储清单。
- 浏览器运行时观察：页面标题、最终 DOM、performance resource timing、cookie。
- 静态产物：`captures/home.html`、`captures/main-ITpbzWAg.js`、`captures/main-rb3R8F1q.css`。
- REA JavaScript CLI：`captures/rea-jsapp.json`。注意该工具报告 JavaScript 语法解析失败，因此其静态语义图为空，不能作为不存在结论。
- 项目数据提取：`assets/projects.json`、`assets/projects-index.json`。

## 限制

- 首页预加载极慢，20 秒后仍为黑屏 preloader；未完成交互流程。
- 未登录/登录差异、角色权限、移动端真实交互、多玩家网络消息 payload 未覆盖。
- Google Analytics 参数包含时间与客户端标识，报告仅保留测量 ID，未复制完整标识参数。
