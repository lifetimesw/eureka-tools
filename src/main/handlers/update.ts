import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater, ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater'
import log from 'electron-log'
import { IPC_CHANNELS } from '@shared/channels'
import { errorResponse, successResponse } from '@shared/response'
import path from 'node:path'

autoUpdater.logger = log
log.transports.file.level = 'info'

if (!app.isPackaged) {
  Object.defineProperty(app, 'isPackaged', {
    get: () => true,
  })
  autoUpdater.updateConfigPath = path.join(process.cwd(), 'dev-app-update.yml')
}

export class UpdateHandler {
  private static mainWindow: BrowserWindow | undefined
  static register(mainWindow: BrowserWindow): void {
    UpdateHandler.mainWindow = mainWindow
    UpdateHandler.setupAutoUpdater()
    UpdateHandler.setupHandlers()
  }

  private static sendStatus(type: string, data?: unknown): void {
    UpdateHandler.mainWindow?.webContents.send(IPC_CHANNELS.UPDATE.STATUS, { type, data })
  }
  private static setupAutoUpdater(): void {
    autoUpdater.autoDownload = false
    autoUpdater.removeAllListeners()
    /* 更新监听 */
    autoUpdater.on('checking-for-update', () => {
      UpdateHandler.sendStatus('checking')
    })
    autoUpdater.on('update-available', (info: UpdateInfo) => {
      this.sendStatus('available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes,
      })
    })
    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
      this.sendStatus('unavailable', { version: info.version })
    })
    autoUpdater.on('download-progress', (progress: ProgressInfo) => {
      this.sendStatus('downloading', {
        percent: progress.percent,
        bytesPerSecond: progress.bytesPerSecond,
        transferred: progress.transferred,
        total: progress.total,
      })
    })
    autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
      this.sendStatus('downloaded', {
        version: event.version,
        releaseNotes: event.releaseNotes,
      })
    })
    autoUpdater.on('error', (error: Error) => {
      console.error('update error:', error)
      this.sendStatus('error', { message: error.message })
    })
  }
  private static setupHandlers(): void {
    ipcMain.handle(IPC_CHANNELS.UPDATE.CHECK, async () => {
      try {
        const result = await autoUpdater.checkForUpdates()
        return successResponse(result?.updateInfo)
      } catch (error) {
        return errorResponse(error as Error)
      }
    })
    ipcMain.handle(IPC_CHANNELS.UPDATE.DOWNLOAD, () => {
      autoUpdater.downloadUpdate()
      return successResponse()
    })
    ipcMain.handle(IPC_CHANNELS.UPDATE.INSTALL, () => {
      autoUpdater.quitAndInstall(true, true)
    })
  }
}
