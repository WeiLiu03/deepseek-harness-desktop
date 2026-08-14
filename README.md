<div align="center">

# DeepSeek Harness Desktop

**Everything is a Plugin - now in one native window.**

An unofficial desktop app for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), the open-source, plugin-first AI agent runtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-4db8ff.svg)](./LICENSE)
[![dsh](https://img.shields.io/badge/dsh-0.1.0--rc.6-0b1020.svg)](https://www.npmjs.com/package/@deepseek-ai/dsh)

[Download](https://github.com/WeiLiu03/deepseek-harness-desktop/releases) · [Report Bug](https://github.com/WeiLiu03/deepseek-harness-desktop/issues)

</div>

---

## What is this?

**DeepSeek Harness** is DeepSeek's open-source agent runtime: `Agent = Model + Harness`. It ships as a CLI (`dsh web`) that serves a local web UI, by default on port 3080.

**DeepSeek Harness Desktop** wraps that runtime in a native window:

- Bundles `@deepseek-ai/dsh` - double-click to launch, no terminal required
- Boots the local dsh server automatically, with a live startup screen
- Reuses an already-running `dsh web` on the same port (dev-friendly)
- System tray: show window / restart server / reload / quit
- Windows, Linux and macOS builds (Electron)

## Quick start

### Option 1 - Download a prebuilt binary

Grab the latest installer from the [Releases](https://github.com/WeiLiu03/deepseek-harness-desktop/releases) page:

- **Windows**: NSIS setup exe, or a portable exe
- **Linux**: AppImage / deb
- **macOS**: dmg

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

Artifacts are written to `dist/`.

## Configuration

| Env var | Default | Description |
| --- | --- | --- |
| `DSH_PORT` | `3080` | Port of the dsh web server the app connects to / starts |

> **Note:** dsh requires Node.js >= 22.6. Having a modern `node` on your PATH is recommended; the bundled fallback uses Electron's Node runtime.

## How it works

1. On launch, the app probes the configured port.
2. If something is already listening there (your own `dsh web`), it is loaded directly.3. Otherwise it spawns the bundled `dsh web` (using the system Node.js when available, falling back to Electron's Node runtime) and polls until the server is ready.
4. When the app quits, the spawned server is terminated.

## Roadmap

- [ ] First-run onboarding (model API key setup)- [ ] Auto-update
- [ ] Profile support (`dsh --profile`)
- [ ] Built-in server log viewer

## Contributing

Issues and pull requests are welcome. Development requires Node.js 20+:

```bash
npm install
npm start
```

## Disclaimer

This is an unofficial community project. DeepSeek Harness itself is developed by DeepSeek-AI and released under the MIT License.

## Star History

If this saves you a terminal window, consider giving it a star - it helps more developers find the Harness ecosystem.

## License

MIT (c) DeepSeek Harness Desktop contributors
