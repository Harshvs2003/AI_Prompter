const { app, BrowserWindow, shell, clipboard, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

if (!app) {
  throw new Error('Electron app module is unavailable. Ensure ELECTRON_RUN_AS_NODE is not set to 1.');
}

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('use-gl', 'swiftshader');

const isDev = !!process.env.VITE_DEV_SERVER_URL;
const appName = 'AI Sidekick';

// Some locked-down Windows environments deny Electron's default cache location.
// We pin userData + cache to app-specific writable folders before app is ready.
function findWritableDataPath() {
  const candidates = [
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, appName) : null,
    path.join(os.tmpdir(), appName),
    path.join(process.cwd(), '.ai-sidekick-data')
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      fs.mkdirSync(candidate, { recursive: true });
      fs.accessSync(candidate, fs.constants.W_OK);
      return candidate;
    } catch {
      // Try next location.
    }
  }

  throw new Error('No writable directory found for Electron user data.');
}

const userDataPath = findWritableDataPath();
const sessionDataPath = path.join(userDataPath, 'session-data');
fs.mkdirSync(sessionDataPath, { recursive: true });
app.setPath('userData', userDataPath);
app.setPath('sessionData', sessionDataPath);

function createWindow() {
  const win = new BrowserWindow({
    width: 440,
    height: 760,
    minWidth: 360,
    minHeight: 520,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: true,
    frame: false,
    backgroundColor: '#0b1220',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Keep the app reliably visible as a sidekick window.
  const pinAlwaysOnTop = () => {
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  };

  win.on('ready-to-show', () => {
    pinAlwaysOnTop();
    win.show();
    win.focus();
  });

  win.on('show', pinAlwaysOnTop);
  win.on('restore', pinAlwaysOnTop);
  win.on('blur', pinAlwaysOnTop);

  return win;
}

app.whenReady().then(() => {
  ipcMain.handle('window:minimize', (event) => {
    const current = BrowserWindow.fromWebContents(event.sender);
    if (current) current.minimize();
  });

  ipcMain.handle('window:close', (event) => {
    const current = BrowserWindow.fromWebContents(event.sender);
    if (current) current.close();
  });

  ipcMain.handle('clipboard:readText', () => clipboard.readText());
  ipcMain.handle('clipboard:writeText', (_event, text) => {
    clipboard.writeText(String(text || ''));
    return true;
  });

  ipcMain.handle('external:open', async (_event, url) => {
    if (!url || typeof url !== 'string') return false;
    await shell.openExternal(url);
    return true;
  });

  const win = createWindow();

  // Bring sidekick back quickly from anywhere.
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (win.isMinimized()) win.restore();
    if (!win.isVisible()) win.show();
    win.focus();
    win.setAlwaysOnTop(true, 'screen-saver');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
