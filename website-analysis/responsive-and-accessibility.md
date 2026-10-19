# 响应式与可访问性

## 响应式

| 宽度/条件 | 变化 | 证据 |
|---|---|---|
| 移动端 UA | `body.mobile`、DPR 上限 2、移动相机 FOV、移动 UI 纹理 | JS |
| max-width 780 | 首页 h1/h2/p 缩小并居中，Info 按钮居中 | CSS |
| max-width 512 | 项目条 3px，hover/selected 展开 100px，标题 11px | CSS |
| max-width 1200 / landscape | About 第二栏隐藏、credits 缩小或隐藏、文本强制 10px | CSS |
| portrait/landscape | 独立菜单、教程、通知布局 | CSS |

## 可访问性观察

- 3D canvas 无文本替代；正文加载后为空，屏幕阅读器只能依赖后续 DOM。[已观察]
- 视口 `user-scalable=no`，可能限制缩放。[已观察]
- 键盘路径存在：Q/D 或左右键切项目，F 互动，Escape 相关 UI 类名存在。[静态]
- 表单标签未观察到；通知/教程的语义层级待运行完成后确认。[待确认]
- 资产加载黑屏超过 20 秒，缺少可见进度文本/百分比；加载体验可访问性差。[已观察]
