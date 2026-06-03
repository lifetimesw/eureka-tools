import { app, shell, BrowserWindow, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { IpcHandlers, StoreHandler } from './handlers'

function createWindow(): void {
  const savedConfig = StoreHandler.getWindowConfig()
  const mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 760,
    width: savedConfig?.width || 1024,
    height: savedConfig?.height || 768,
    x: savedConfig?.x,
    y: savedConfig?.y,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })
  if (savedConfig?.isMaximized) {
    mainWindow.maximize()
  }

  IpcHandlers.registerAll(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const allowedCSP = [
      "default-src 'self'",
      "connect-src 'self' http://localhost:* https://xivapi-v2.xivcdn.com https://universalis.app https://garlandtools.cn", // ⭐ 添加允许的域名
      "script-src 'self' 'unsafe-inline'", // 开发环境可能需要
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
    ].join('; ')

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [allowedCSP],
      },
    })
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].focus()
    } else {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
