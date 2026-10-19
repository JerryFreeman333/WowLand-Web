# 接口、数据与资产流

## 初始化请求

| ID | 方法 | URL / 类型 | 用途 | 证据 |
|---|---|---|---|---|
| API-001 | GET | `/assets/js/main-ITpbzWAg.js` | 主应用 bundle，3.6MB 源文件 / 853KB transfer | [已观察] |
| API-002 | GET | `/assets/css/main-rb3R8F1q.css` | UI 样式，47KB 源文件 / 8.5KB transfer | [已观察] |
| API-003 | GET | `https://use.typekit.net/twe8lcf.css` | Forma DJR Display | [已观察] |
| API-004 | GET | Google tag script + collect | GA4 `G-T6R7J0D4NK` | [已观察] |
| API-005 | Fetch | `/vrm/owo7.vrm?gpu=true&QM%20eA` | GPU 化主化身 | REA 网络 |
| API-006 | Fetch | `/models/cyberfix.glb` | 场景 kit | REA 网络 |
| API-007 | Fetch | `smsygen02.b-cdn.net/slugabedsky.opus` | 背景音乐 | REA 网络 |
| API-008 | Fetch | `smsygen02.b-cdn.net/derivative.webm` | 装饰视频 | REA 网络 |
| API-009 | Fetch | `smsygen02.b-cdn.net/akira.webm` | 首个项目视频 | REA 网络 |
| API-010 | GET | `/textures/noisebake.png`、`faces8.png` | 转场和表情纹理 | REA 网络 |
| API-011 | WS | `https://tongue-require.samsy.partykit.dev/` | 多人同步 | JS |

## 项目数据模型

| 字段 | 类型 | 用途 |
|---|---|---|
| url | string/null | Visit 外链 |
| classname | `"light"` 等 | 样式/主题 |
| title | string | 项目标题，含 `\n` 分行 |
| subtitle | string | 客户/项目类型 |
| tags | string | 技术标签 |
| description | string | 角色与贡献 |
| video | string | CDN / videos 视频文件 |
| short | string | 底栏短名与定位 ID |
| prices | string | FWA/Awwwards 等奖项 |
| custom | `{text,link}/null` | 额外按钮 |
| infos.text | string | 详情长说明 |

## 缓存策略

- 项目视频懒加载：当前、下一项、+2 项；未激活视频暂停。[已观察] 静态
- VRM GPU 队列按 URL + plugin string 缓存，避免重复转换。[已观察] 静态
- 动画 worker 池：桌面 8、移动 4。[已观察] 静态
