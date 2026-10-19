# 视觉系统与组件

## 视觉变量

| 类别 | 变量 | 值 | 证据 |
|---|---|---|---|
| 主色 | `--brand-red` | `#ff0033` / `#f03` | CSS |
| 背景 | 基础黑 | `#000` | meta theme-color + CSS |
| 悬停背景 | 红 75% | `#ff0033bf` | CSS |
| 声音关闭背景 | 红 50% | `#ff003380` | CSS |
| 正文/UI 字体 | Forma DJR Display | `forma-djr-display` | Typekit + CSS |
| BMFont | Aeonik Bold / Avenir Bold / Forma DJR | `assets/bmfont/*` | JS |
| 通知圆角 | 5px | `.notification-wrapper` | CSS |
| 菜单按钮圆角 | 30px | `.surround` | CSS |
| 声音按钮圆角 | 8px | `#soundtoggle` | CSS |
| 主要过渡 | 0.3s ease / 0.1s ease | UI 与动画条 | CSS |

## 主要组件

| ID | 组件 | 位置 | 结构/内容 | 状态 | 交互 | 证据 |
|---|---|---|---|---|---|---|
| C-001 | 顶部状态菜单 | 全局 | WORKS / INFO / ABOUT 三个 pill | 默认、hover、selected | 状态切换 | CSS + 状态枚举 |
| C-002 | 声音按钮 | 右下 | 50×35 红底、5 根音频条 | on / off / hover | 播放或暂停音频 | CSS |
| C-003 | Works 底栏 | Works | 25 个项目条、项目名、提示 | 默认、hover、selected | 滚动与点击定位 | CSS + JS |
| C-004 | 项目信息面板 | Info/Works | CLONEX / INFOS / VISIT 三段文本 | 进入/退出、hover | 外链/详情 | JS |
| C-005 | 移动摇杆 | 移动端 | 外圈、内点、Jump 圆钮 | 待机、拖动、按下 | 控制角色 | JS |
| C-006 | 通知 | 右上 | 70×70 图标区 + 标题与说明 | 出现/消失 | 自动提示 | CSS |
| C-007 | 教程/跳过 | 底部中央 | 操作提示 + Skip | 可跳过 | 键鼠教程 | CSS |
| C-008 | About 覆盖层 | About | 黑色 75% 背景和大标题 | 显示淡入 3s | 链接 | CSS |
| C-009 | 3D 化身 | IDLE | VRM 模型、脸部表情、拖影、动画 | idle/walk/run/jump/fall/waving/talking | WASD/F/跳 | JS |
| C-010 | 作品视频屏 | Works | 视频纹理 + 噪声转场 | current / next / loading | 滚动键盘切换 | JS |

## 资产清单

- 2 个 VRM：`owo3.vrm`（拖影）、`owo7.vrm`（主化身）
- 1 个场景 kit：`models/cyberfix.glb`
- 25 个项目 MP4/WebM + loading.mp4
- 8 个 BMFont JSON/PNG 资产
- UI 纹理：`interaction/ui2.png`、`interaction/mobileui.png`
- 纹理：faces8、noisebake、atlasemoji、bump-floor、up
- 完整线索见 `assets/asset-urls.txt`
