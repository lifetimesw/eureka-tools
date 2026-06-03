import { IPC_CHANNELS } from '@shared/channels'
import { IpcResponse, errorResponse, successResponse } from '@shared/response'
import { ipcMain, shell } from 'electron'

export class ShellHandler {
  static register(): void {
    ipcMain.handle(IPC_CHANNELS.SHELL.OPEN_EXTERNAL, async (_, url: string) => ShellHandler.openExternal(url))
  }

  private static openExternal = async (url: string): Promise<IpcResponse> => {
    try {
      await shell.openExternal(url)
      return successResponse()
    } catch (error) {
      return errorResponse(error)
    }
  }
}
