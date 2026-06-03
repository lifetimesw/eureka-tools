import { IPC_CHANNELS } from '@shared/channels'
import { app, ipcMain } from 'electron'

export class AppHandler {
  static register(): void {
    ipcMain.handle(IPC_CHANNELS.APP.GET_VERSION, () => app.getVersion())
    ipcMain.handle(IPC_CHANNELS.APP.GET_APP_NAME, () => app.getName())
  }
}
