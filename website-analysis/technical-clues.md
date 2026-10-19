# 技术线索

| ID | 类型 | 观察 | 含义 | 状态 |
|---|---|---|---|---|
| T-001 | 构建产物 | Vite 风格 `main-[hash].js/css`，ESM，modulepreload polyfill | Vite/Rollup 打包 | [已确认] |
| T-002 | 渲染 | canvas `data-engine="three.js r182dev webgpu"` | Three.js r182dev + WebGPU，回退 WebGL2 | [已确认] |
| T-003 | 动画 | GSAP 3.13.0 | 状态与相机过渡 | [已确认] |
| T-004 | 模型 | VRM 1.0/three-vrm、GLTFLoader、Draco/meshopt 扩展 | 化身与场景 | [已确认] |
| T-005 | 网络 | Reconnecting WebSocket | PartyKit 多人状态 | [已确认] |
| T-006 | CDN | `smsygen02.b-cdn.net` | 大资产 CDN | [已确认] |
| T-007 | 统计 | GA4 `G-T6R7J0D4NK` | 页面与滚动事件 | [已确认] |
| T-008 | Worker | `baker.worker-5z1EDtsg.js` URL 计算 | VRM GPU 烘焙 worker；20 秒内未观察到该请求，静态路径直取 404，部署/加载路径待确认 | [待确认] |
| T-009 | UI | scoped CSS + Vue 风格多组件 | 组件框架痕迹，但框架名未确认 | [推测] |
| T-010 | 调试 | `?debug&samsy&editor&stats&cdn&gameboy&webwork&fps=...` | 运行模式开关 | [已确认] |
