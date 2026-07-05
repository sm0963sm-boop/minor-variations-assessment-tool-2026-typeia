// Electron main process — spawns the built Nitro (Node) server locally,
// then opens a BrowserWindow pointing at it. Runs fully offline.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

const PORT = process.env.MVAT_PORT || "43117";
let serverProc = null;

function startServer() {
  const serverEntry = path.join(__dirname, "..", "dist-electron", "server", "index.mjs");
  serverProc = spawn(process.execPath, [serverEntry], {
    env: { ...process.env, PORT, HOST: "127.0.0.1", NODE_ENV: "production" },
    stdio: "inherit",
  });
  serverProc.on("exit", (code) => {
    console.error("[mvat] local server exited:", code);
  });
}

function waitForServer(url, timeoutMs = 15000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - started > timeoutMs) return reject(new Error("server timeout"));
        setTimeout(tick, 250);
      });
    };
    tick();
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    title: "MVAT Assessment",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  const url = `http://127.0.0.1:${PORT}/`;
  try {
    await waitForServer(url);
  } catch (e) {
    console.error("[mvat] failed waiting for local server", e);
  }
  win.loadURL(url);
}

app.whenReady().then(() => {
  startServer();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (serverProc) try { serverProc.kill(); } catch {}
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (serverProc) try { serverProc.kill(); } catch {}
});
