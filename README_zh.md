# DeepSeek Harness Desktop

> Everything is a Plugin —— 现在装进一个原生窗口。

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的非官方桌面版：把 DeepSeek 开源的插件化 AI Agent 运行时打包成双击即用的桌面应用。

## 功能特性

- 内置 `@deepseek-ai/dsh`，双击即用，无需命令行
- 自动启动本地 dsh 服务，启动过程有实时状态页
- 若同端口已有 `dsh web` 在运行，则直接复用（方便开发者）
- 系统托盘：显示窗口 / 重启服务 / 刷新 / 退出
- 支持 Windows、Linux、macOS（Electron 构建）

## 快速开始

### 方式一：下载安装包

前往 [Releases](https://github.com/WeiLiu03/deepseek-harness-desktop/releases) 下载对应平台的安装包（Windows 安装版/便携版、Linux AppImage/deb、macOS dmg）。

### 方式二：源码运行

```bash
git clone https://github.com/WeiLiu03/deepseek-harness-desktop
cd deepseek-harness-desktop
npm install
npm start
```

### 方式三：自行打包

```bash
npm run dist:win   # Windows 安装包，产物在 dist/ 目录
```

## 配置

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `DSH_PORT` | `3080` | dsh Web 服务端口 |

> **注意**：dsh 需要 Node.js >= 22.6，建议 PATH 中有较新的 `node`；未找到时将回退到 Electron 内置 Node 运行时。

## 运行原理

启动时先探测端口：若已有 `dsh web` 在监听则直接加载；否则拉起内置的 dsh（优先使用系统 Node.js，找不到时回退到 Electron 的 Node 运行时），轮询就绪后加载界面；退出时自动关闭由本应用拉起的服务进程。

## 参与贡献

欢迎提交 Issue 和 PR。开发需要 Node.js 20+，`npm install` 后执行 `npm start` 即可调试。

## 免责声明

本项目为非官方社区项目。DeepSeek Harness 由 DeepSeek-AI 开发并以 MIT 协议开源。

## Star 支持

如果这个项目对你有帮助，欢迎多多支持，点一个 Star！你的 Star 能让更多开发者发现 DeepSeek Harness 生态。也欢迎提交 Issue 和 PR。

## 许可证

MIT (c) DeepSeek Harness Desktop contributors
