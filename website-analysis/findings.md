# 结论、问题与后续计划

## 重要结论

### 1. 产品定位

结论：这是一个以“3D 多人漫游作品集”呈现的创意图形工程师个人品牌站。
证据：标题/描述、`SMSY` + `CREATIVE DEVELOPMENT & EXPERIENCE DESIGNER` 3D 文本、25 个 WebGL/WebGPU 项目数据、PartyKit 多人系统。
证据类型：[已观察]+[已观察] 静态
影响：复现时应优先做 3D 世界和作品叙事，而不是普通静态 portfolio。

### 2. 信息架构是单 URL 状态机

结论：核心页面状态为 `VOID → IDLE → WORKS/INFO/ABOUT`，不使用独立路由。
证据：状态枚举 + URL 始终 `/`。
证据类型：[已观察]
影响：刷新不能恢复 Works/项目；复现可考虑把项目 slug 写入 hash/query 作为增强。

### 3. Works 数据完整内嵌

结论：25 个项目、视频、标签、角色、奖项、详情和外链全部作为 JSON 内嵌在 bundle 中。
证据：`assets/projects.json` 提取自 bundle。
证据类型：[已观察]
影响：可先静态复现内容层，再接 3D 视频 screen。

### 4. 项目切换是确定性 1.2 秒转场

结论：滚动/键盘触发当前与下一视频纹理混合，1.2 秒过渡与冷却，并预载 +2 项目。
证据：`transitionDuration=1200`、`scrollCooldown=1200`、`loadVideoIfNeeded(current+2)`。
证据类型：[已观察] 静态
影响：复现时保持速度和冷却，避免连续滚动抖动。

### 5. 多人空间实时同步

结论：默认房间 `portfolio-world`，join/leave/update 消息同步化身位置、动画、方向、颜色、脸部状态。
证据：PartyKit URL 与消息类型。
证据类型：[已观察] 静态
影响：若目标是无后端复现，应明确降级为单机。

### 6. 性能问题

结论：入口资产重，主 JS 3.6MB 源文件/853KB transfer，20 秒后仍黑屏。
证据：resource timing + 页面 DOM。
证据类型：[已观察]
影响：流失风险高；建议加载进度、可跳过、关键路径拆分。

## 问题清单

| ID | 问题 | 影响 | 优先级 |
|---|---|---|---|
| F-001 | 20 秒仍黑屏，无可见进度或跳过入口 | 高流失 | 高 |
| F-002 | 静态计算的 worker URL 需运行时确认；直接猜测请求返回 404 | 无法判断 VRM GPU 烘焙是否失败 | 中 |
| F-003 | WebGPU 不可用时回退 WebGL2，但入口仍等待大资产 | 性能不一致 | 中 |
| F-004 | `user-scalable=no` | 可访问性 | 中 |
| F-005 | 项目状态不进 URL | 分享/恢复弱 | 中 |
| F-006 | bundle 无公开 source map，REA JS 语义解析失败 | 还原成本高 | 低 |
| F-007 | Typekit 首次加载约 30 秒 | 首屏阻塞 | 中 |

## 后续验证计划

1. 等待 2–5 分钟或用真实桌面 GPU 完整进入 IDLE，截图菜单/Works/About。
2. 捕获 PartyKit WebSocket payload，验证颜色/表情字段和重连策略。
3. 在 1920、1200、780、512、390 宽度实测菜单、摇杆、About 和项目条。
4. 用屏幕阅读器/键盘遍历教程、Works、Infos、Visit 和 About 链接。
5. 确认 worker 部署路径与 404 是否只影响当前环境。
6. 联系站点所有者或获取授权后再做更深部署/源码验证。
