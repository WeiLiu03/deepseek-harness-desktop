<div align='center'>

![DeepSeek Harness Desktop](./docs/banner.svg)

# DeepSeek Harness Desktop

**Everything is a Plugin - now in one native window.**

An unofficial desktop app for **DeepSeek Harness** (dsh), the open-source, plugin-first AI agent runtime by DeepSeek.
Install once, double-click, and get the full dsh web experience - no terminal required.

[![GitHub Repo stars](https://img.shields.io/github/stars/WeiLiu03/deepseek-harness-desktop?style=social)](https://github.com/WeiLiu03/deepseek-harness-desktop)
[![GitHub Downloads](https://img.shields.io/github/downloads/WeiLiu03/deepseek-harness-desktop/total?color=4db8ff)](https://github.com/WeiLiu03/deepseek-harness-desktop/releases)
[![GitHub Release](https://img.shields.io/github/v/release/WeiLiu03/deepseek-harness-desktop?color=4db8ff)](https://github.com/WeiLiu03/deepseek-harness-desktop/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-4db8ff.svg)](./LICENSE)

[Download](https://github.com/WeiLiu03/deepseek-harness-desktop/releases) · [中文文档](./README_zh.md) · [Report Bug](https://github.com/WeiLiu03/deepseek-harness-desktop/issues) · [Upstream: deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)

</div>

---

## What is DeepSeek Harness Desktop?

**DeepSeek Harness** is DeepSeek's open-source AI agent runtime built around a simple formula: *Agent = Model + Harness* - and the conviction that *Everything is a Plugin*. It ships as a CLI (dsh) whose dsh web command serves a local web UI, by default on port 3080.

**DeepSeek Harness Desktop** packages that runtime into a native desktop application, so you can run the DeepSeek agent runtime with a double-click:

- Bundles @deepseek-ai/dsh (0.1.0-rc.6) - no npm install, no terminal
- Auto-boots the local dsh server with a live startup screen
- Reuses an already-running dsh web on the same port (dev-friendly)
- System tray: show window / restart dsh server / reload / quit
- Windows NSIS installer + portable exe; Linux & macOS build configs included
- Writes a detailed server log (dsh-server.log) for easy troubleshooting

## Downloads

Grab the latest installer from the [Releases](https://github.com/WeiLiu03/deepseek-harness-desktop/releases) page:

| File | Platform | Notes |
| --- | --- | --- |
| DeepSeek-Harness-Desktop-Setup-x.x.x.exe | Windows 10/11 (x64) | NSIS installer |
| DeepSeek-Harness-Desktop-x.x.x.exe | Windows 10/11 (x64) | Portable, no install |

> **Notes:** Unsigned community build - Windows SmartScreen may warn (click More info > Run anyway). dsh requires Node.js >= 22.6 on your PATH.

## Quick start

### Option 1 - Prebuilt release (recommended)

1. Download the installer from [Releases](https://github.com/WeiLiu03/deepseek-harness-desktop/releases).
2. Install (or just run the portable exe).
3. Launch - the app boots dsh web and opens http://127.0.0.1:3080 automatically.

### Option 2 - Run from source

```bash
git clone https://github.com/WeiLiu03/deepseek-harness-desktop
cd deepseek-harness-desktop
npm install
npm start
```

### Option 3 - Build your own installer

```bash
npm run dist        # current platform
npm run dist:win    # Windows: NSIS setup + portable
```

Artifacts are written to dist/. An afterPack hook (scripts/after-pack.js) restores the implicit workspace-style dependencies of dsh, so the packaged app just works.

## Configuration

| Env var | Default | Description |
| --- | --- | --- |
| `DSH_PORT` | `3080` | Port of the dsh web server the app connects to / starts |

> **Note:** Having a modern node (>= 22.6) on your PATH is recommended; the app prefers the system Node.js and falls back to Electron's bundled Node runtime.

## How it works

1. On launch, the app probes the configured port (default 3080).
2. If your own dsh web is already listening there, it is loaded directly.
3. Otherwise it spawns the bundled dsh web (system Node.js first, Electron runtime as fallback) and polls until the server is ready.
4. When the app quits, the spawned dsh server is terminated.

## FAQ

**Is this an official DeepSeek product?**
No. This is an unofficial community project. DeepSeek Harness itself is developed by DeepSeek-AI: [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness).

**Which port does it use?**
3080 by default, override with `DSH_PORT`.

**Where is the server log?**
Windows: %APPDATA%/DeepSeek Harness Desktop/dsh-server.log (also reachable via the tray menu workflow).

**Can I use my own dsh install?**
Yes - start dsh web yourself; the app detects it on the port and connects instead of spawning a second server.

**Why does dsh need Node.js >= 22.6?**
dsh uses newer Node APIs (e.g. stripTypeScriptCodes) that older runtimes do not provide.

## Roadmap

- [ ] First-run onboarding (model API key setup)
- [ ] Auto-update
- [ ] Profile support (dsh --profile)
- [ ] Built-in server log viewer

## Related

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) - the upstream agent runtime
- [@deepseek-ai/dsh](https://www.npmjs.com/package/@deepseek-ai/dsh) - the official npm package

## Contributing

Issues and pull requests are welcome! Development needs Node.js 20+: npm install, then npm start to hack on the Electron shell.

## Support & Star

If DeepSeek Harness Desktop saves you a terminal window, please give it a Star - 多多支持！Stars help more developers discover the DeepSeek Harness ecosystem when searching for deepseek harness, and they keep this project moving. Star, fork, share - all appreciated!

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=WeiLiu03/deepseek-harness-desktop&type=Date)](https://star-history.com/#WeiLiu03/deepseek-harness-desktop&Date)

## Disclaimer

Unofficial community project. DeepSeek Harness is developed by DeepSeek-AI under the MIT License.

## License

MIT (c) DeepSeek Harness Desktop contributors
