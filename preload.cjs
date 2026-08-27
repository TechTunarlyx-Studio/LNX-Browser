// Preload script — runs in an isolated context with access to Node APIs,
// and exposes only a minimal, explicit surface to the renderer (the React
// app). contextIsolation stays on and nodeIntegration stays off in the
// renderer itself, so page content and app UI never get raw Node access.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lnxNative', {
  isElectron: true,
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
});
