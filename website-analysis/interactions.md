# 交互与状态矩阵

| 交互 | 页面 | 输入 | 结果 | 证据 |
|---|---|---|---|---|
| I-001 | IDLE | WASD / 方向 | 化身移动并切换 walk/run 动画 | JS 动画枚举 |
| I-002 | IDLE | 跳跃 | 单跳/双跳动画与速度更新 | JS |
| I-003 | IDLE | 停留 6 秒 | 化身看向镜头并挥手 | JS 阈值 6 秒 |
| I-004 | IDLE | 靠近可交互角色 | 显示 F 按钮提示；F 触发动作 | JS |
| I-005 | WORKS | 滚动 | 1.2 秒视频/文字过渡，1.2 秒冷却 | JS |
| I-006 | WORKS | Q/左 或 D/右 | 前/后项目切换 | JS |
| I-007 | WORKS | 点击项目条 | 定位项目并反向过渡 | JS |
| I-008 | WORKS | Visit | `_blank` 打开外链 | JS |
| I-009 | 全局 | 声音按钮 | sound_toggle 事件 | JS |
| I-010 | ABOUT | 菜单 | 过滤 GLB kit 中 id=about 实例 | JS |

## 状态矩阵

| 功能 | 默认 | 加载 | 空/失败 | 成功 | 禁用/冷却 | 证据 |
|---|---|---|---|---|---|---|
| 入口资产 | 黑屏 | 请求 VRM/GLB/视频/音频 | WebGPU 不可用回退 WebGL2 | preloader 移除 | 未观察 | [已观察] |
| 项目视频 | 首个项目 | loading.mp4 替代 | 未观察 | 当前+下一项播放 | 1.2 秒滚动冷却 | JS |
| 多人连接 | 未连接 | Reconnecting WebSocket | TIMED OUT / error | join + 状态同步 | 未观察 | JS |
| 音频授权 | suspended | 等待用户手势 | unsupported | running | 移动端强制需手势 | JS |
