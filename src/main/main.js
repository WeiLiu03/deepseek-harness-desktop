const { app, BrowserWindow, Menu, Tray, nativeImage } = require("electron");
const net = require("net");
const { spawn, spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORT = Number(process.env.DSH_PORT || 3080);
const TITLE = "DeepSeek Harness Desktop";
const SERVER_URL = "http://127.0.0.1:" + PORT;const BASE = app.isPackaged ? app.getAppPath() : path.join(__dirname, "..", "..");
const CLI = path.join(BASE, "node_modules", "@deepseek-ai", "dsh", "lib", "bin.js");

let win = null;
let tray = null;
let server = null;
let forceQuit = false;
function findSystemNode() {
  try {
    const cmd = process.platform === "win32" ? "where" : "which";
    const r = spawnSync(cmd, ["node"], { encoding: "utf8" });
    const p = (r.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);    return p.length ? p[0] : null;
  } catch (e) {
    return null;
  }
}

function checkPort(port) {
  return new Promise((resolve) => {
    const s = net.connect(port, "127.0.0.1");    s.setTimeout(700);
    s.on("connect", () => { s.destroy(); resolve(true); });
    s.on("timeout", () => { s.destroy(); resolve(false); });
    s.on("error", () => resolve(false));
  });
}

function createWindow() {
  win = new BrowserWindow({    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: TITLE,
    backgroundColor: "#0b1020",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });  win.setMenuBarVisibility(false);
  win.on("close", (e) => {
    if (!forceQuit && process.platform === "win32" && tray) {
      e.preventDefault();
      win.hide();
    }
  });
  loadStatePage();
}

function ensureTray() {
  if (tray) return;  const img = nativeImage.createFromPath(path.join(BASE, "resources", "tray.png"));
  tray = new Tray(img.isEmpty() ? nativeImage.createEmpty() : img);
  tray.setToolTip(TITLE);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Show DeepSeek Harness", click: () => { if (win) { win.show(); win.focus(); } } },    { label: "Restart dsh Server", click: () => startServer() },
    { label: "Reload", click: () => { if (win) win.loadURL(SERVER_URL); } },
    { type: "separator" },
    { label: "Quit", click: () => { forceQuit = true; app.quit(); } }
  ]));
  tray.on("click", () => { if (win) { win.show(); win.focus(); } });
}
async function startServer() {
  if (!win) return;
  const LOG = path.join(app.getPath("userData"), "dsh-server.log");
  if (await checkPort(PORT)) {
    win.loadURL(SERVER_URL);
    return;
  }
  if (server) {
    try { server.kill(); } catch (e) {}
    server = null;
  }  const sysNode = findSystemNode();
  const nodeBin = sysNode || process.execPath;
  const env = sysNode ? process.env : Object.assign({}, process.env, { ELECTRON_RUN_AS_NODE: "1" });
  try { fs.appendFileSync(LOG, "[desktop] spawning dsh via " + nodeBin + "\n"); } catch (e) {}  server = spawn(nodeBin, ["--expose-internals", CLI, "web", "--port", String(PORT)], { env: env, stdio: ["ignore", "pipe", "pipe"] });
  server.stdout.on("data", (d) => { try { fs.appendFileSync(LOG, d); } catch (e) {} });
  server.stderr.on("data", (d) => { try { fs.appendFileSync(LOG, d); } catch (e) {} });  server.on("error", (e) => { try { fs.appendFileSync(LOG, "[desktop] spawn error: " + e.message + "\n"); } catch (err) {} });
  server.on("exit", (code) => { try { fs.appendFileSync(LOG, "[desktop] server exited code=" + code + "\n"); } catch (err) {} });
  loadStatePage();
  const startedAt = Date.now();  const timer = setInterval(async () => {
    if (await checkPort(PORT)) {
      clearInterval(timer);
      if (win) win.loadURL(SERVER_URL);
      return;
    }
    if (Date.now() - startedAt > 180000) {
      clearInterval(timer);      if (win) win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(FAIL_PAGE));
    }
  }, 800);
}

app.whenReady().then(() => {
  ensureTray();
  createWindow();
  startServer();  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      startServer();
    } else if (win) {
      win.show();
    }
  });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => {
  forceQuit = true;
  if (server) { try { server.kill(); } catch (e) {} }
});

function loadStatePage() {
  if (!win) return;  const html = LOAD_PAGE.replace(/%%PORT%%/g, String(PORT));
  win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
}

const FAIL_PAGE = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;background:#0b1020;color:#dfe6f3;font-family:sans-serif}p{color:#8b96ad}</style></head><body><h1>Failed to start dsh server</h1><p>Check dsh-server.log in the app data folder, use Restart dsh Server from the tray menu, or run dsh web in a terminal.</p></body></html>";

const LOAD_PAGE = [
"<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>DeepSeek Harness Desktop</title><style>",
"html,body{margin:0;height:100%}body{display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0b1020;color:#dfe6f3;font-family:Segoe UI,system-ui,sans-serif}.ring{width:54px;height:54px;border-radius:50%;border:3px solid #1e2a4a;border-top-color:#4db8ff;animation:spin .9s linear infinite;margin-bottom:28px}","@keyframes spin{to{transform:rotate(360deg)}}h1{font-size:20px;font-weight:600;margin:0 0 10px}p{color:#8b96ad;font-size:14px;margin:4px 0}.mono{font-family:Consolas,monospace;color:#4db8ff}</style></head><body>",
"<div class=\"ring\">","<div class=\"ring\"></div><h1>DeepSeek Harness Desktop</h1><p id=\"s\">Booting dsh server...</p><p class=\"mono\">http://127.0.0.1:%%PORT%%</p><script>",
"var t0=Date.now();var iv=setInterval(function(){fetch(\"http://127.0.0.1:%%PORT%%/\",{mode:\"no-cors\",cache:\"no-store\"}).then(function(){clearInterval(iv);location.href=\"http://127.0.0.1:%%PORT%%/\";},function(){",
"var s=Math.round((Date.now()-t0)/1000);document.getElementById(\"s\").textContent=\"Booting dsh server... \"+s+\"s\";",
"if(s>180){clearInterval(iv);document.getElementById(\"s\").textContent=\"Startup timed out. Use the tray menu to restart the server.\"}",
].join("");
