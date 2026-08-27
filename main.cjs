// LNX Browser — Electron Main Process
//
// Responsibilities:
//   1. Boots the local Express backend (dist/server.cjs) that the React UI
//      talks to (search, AI copilot, update-status endpoints).
//   2. Creates the main BrowserWindow and loads the UI.
//   3. Enables the native <webview> tag so the renderer can host *real*
//      Chromium page navigation (the actual "engine") instead of the
//      dev-mode server-side HTML proxy.
//   4. Wires up basic native menu / window controls (back, forward, reload,
//      new window, devtools, zoom).

const { app, BrowserWindow, Menu, shell, ipcMain, session } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const isDev = !app.isPackaged;
const BACKEND_PORT = process.env.LNX_PORT || 3000;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

let mainWindow = null;
let backendProcess = null;

// --- Single instance lock (avoid multiple LNX windows fighting over the same port) ---
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function startBackend() {
  return new Promise((resolve) => {
    if (isDev) {
      // In dev mode the backend is started separately via `npm run electron:dev`
      // (concurrently runs `vite`/`tsx server.ts` alongside electron).
      resolve();
      return;
    }

    const serverEntry = path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'server.cjs');
    const fallbackEntry = path.join(__dirname, '..', 'dist', 'server.cjs');
    const fs = require('fs');
    const entry = fs.existsSync(serverEntry) ? serverEntry : fallbackEntry;

    backendProcess = spawn(process.execPath, [entry], {
      env: { ...process.env, NODE_ENV: 'production', PORT: String(BACKEND_PORT), ELECTRON_RUN_AS_NODE: '1' },
      stdio: 'inherit',
    });

    backendProcess.on('error', (err) => {
      console.error('LNX backend failed to start:', err);
    });

    // Give the server a brief moment to bind before we point the window at it.
    setTimeout(resolve, 700);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0a0a0a',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // This is what gives LNX Browser its real engine: the <webview> tag
      // in the renderer hosts an actual, separate Chromium instance for
      // whichever site the user navigates to.
      webviewTag: true,
      spellcheck: true,
    },
  });

  // In dev, `npm run electron:dev` runs `tsx server.ts` on BACKEND_PORT
  // (it serves the Vite dev middleware itself — see server.ts), so both
  // dev and production point at the same local backend URL.
  const startUrl = process.env.LNX_DEV_URL || BACKEND_URL;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Open target="_blank" links from the shell UI itself (not page content,
  // which lives inside <webview> and handles its own popups) in the
  // OS default browser instead of a new Electron window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function buildMenu() {
  const template = [
    {
      label: 'LNX Browser',
      submenu: [
        { label: 'Yeni Pencere', accelerator: 'CmdOrCtrl+N', click: () => createWindow() },
        { type: 'separator' },
        { role: 'reload', label: 'Yenile' },
        { role: 'forceReload', label: 'Zorla Yenile' },
        { role: 'toggleDevTools', label: 'Geliştirici Araçları' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Yakınlaştırmayı Sıfırla' },
        { role: 'zoomIn', label: 'Yakınlaştır' },
        { role: 'zoomOut', label: 'Uzaklaştır' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tam Ekran' },
        { type: 'separator' },
        { role: 'quit', label: 'Çıkış' },
      ],
    },
    {
      label: 'Düzen',
      submenu: [
        { role: 'undo', label: 'Geri Al' },
        { role: 'redo', label: 'Yinele' },
        { type: 'separator' },
        { role: 'cut', label: 'Kes' },
        { role: 'copy', label: 'Kopyala' },
        { role: 'paste', label: 'Yapıştır' },
        { role: 'selectAll', label: 'Tümünü Seç' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
  // Allow the <webview> engine to actually navigate anywhere (this is a
  // browser, after all) while still keeping renderer-side Node integration
  // off for security.
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    // Camera / mic / geolocation prompts are forwarded to the OS-level
    // Electron permission UI; deny anything else by default.
    const allowed = ['media', 'geolocation', 'notifications', 'fullscreen'];
    callback(allowed.includes(permission));
  });

  buildMenu();
  await startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    try { backendProcess.kill(); } catch (_) { /* noop */ }
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (backendProcess) {
    try { backendProcess.kill(); } catch (_) { /* noop */ }
  }
});
