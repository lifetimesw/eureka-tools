import { IPC_CHANNELS, OnTopLevel } from '@shared/channels'
import { BrowserWindow, ipcMain } from 'electron'

export class WindowHandler {
  static register(mainWindow: BrowserWindow): void {
    mainWindow.on('maximize', () => {
      mainWindow?.webContents.send(IPC_CHANNELS.WINDOW.MAXIMIZE, true)
    })
    mainWindow.on('unmaximize', () => {
      mainWindow?.webContents.send(IPC_CHANNELS.WINDOW.MAXIMIZE, false)
    })
    mainWindow.on('minimize', () => {
      mainWindow?.webContents.send(IPC_CHANNELS.WINDOW.MINIMIZE, true)
    })
    mainWindow.on('restore', () => {
      mainWindow?.webContents.send(IPC_CHANNELS.WINDOW.MINIMIZE, false)
    })
    mainWindow.on('always-on-top-changed', (_, isAlwaysOnTop) => {
      mainWindow?.webContents.send(IPC_CHANNELS.WINDOW.ALWAYS_ON_TOP_CHANGED, isAlwaysOnTop)
    })
    ipcMain.handle(IPC_CHANNELS.WINDOW.IS_ALWAYS_ON_TOP, () => mainWindow.isAlwaysOnTop())
    ipcMain.handle(IPC_CHANNELS.WINDOW.SET_ALWAYS_ON_TOP, (_, flag: boolean, level?: OnTopLevel) => mainWindow.setAlwaysOnTop(flag, level))
    ipcMain.handle(IPC_CHANNELS.WINDOW.MAXIMIZE, () => {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    })
    ipcMain.handle(IPC_CHANNELS.WINDOW.MINIMIZE, () => mainWindow.minimize())
    ipcMain.handle(IPC_CHANNELS.WINDOW.CLOSE, () => mainWindow.close())
  }
}
