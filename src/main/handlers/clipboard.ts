import { ipcMain, clipboard } from 'electron'
import { IPC_CHANNELS } from '@shared/channels'
import { IpcResponse, errorResponse, successResponse } from '@shared/response'

export class ClipboardHandler {
  static register(): void {
    ipcMain.handle(IPC_CHANNELS.CLIPBOARD.WRITE_TEXT, (_, text: unknown) => ClipboardHandler.writeText(text))
    ipcMain.handle(IPC_CHANNELS.CLIPBOARD.READ_TEXT, () => ClipboardHandler.readText())
    ipcMain.handle(IPC_CHANNELS.CLIPBOARD.WRITE_HTML, (_, html: unknown) => ClipboardHandler.writeHTML(html))
    ipcMain.handle(IPC_CHANNELS.CLIPBOARD.READ_HTML, () => ClipboardHandler.readHTML())
    ipcMain.handle(IPC_CHANNELS.CLIPBOARD.CLEAR, () => ClipboardHandler.clear())
    ipcMain.handle(IPC_CHANNELS.CLIPBOARD.AVAILABLE_FORMATS, () => ClipboardHandler.availableFormats())
  }

  private static writeText = async (text: unknown): Promise<IpcResponse> => {
    try {
      if (typeof text !== 'string') {
        throw new Error('Text must be a string')
      }

      clipboard.writeText(text.trim())
      return successResponse()
    } catch (error) {
      return errorResponse(error)
    }
  }
  /**
   * 读取纯文本
   */
  private static readText = async (): Promise<IpcResponse<string>> => {
    try {
      const text = clipboard.readText()

      return successResponse(text)
    } catch (error) {
      return errorResponse(error, '')
    }
  }

  /**
   * 写入 HTML
   */
  private static writeHTML = async (html: unknown): Promise<IpcResponse> => {
    try {
      if (typeof html !== 'string') {
        throw new TypeError('Input must be a string')
      }
      clipboard.writeHTML(html)
      return successResponse()
    } catch (error) {
      return errorResponse(error)
    }
  }
  /**
   * 读取 HTML
   */
  private static readHTML = async (): Promise<IpcResponse<string>> => {
    try {
      const html = clipboard.readHTML()
      return successResponse(html)
    } catch (error) {
      return errorResponse(error, '')
    }
  }

  /**
   * 清空剪贴板
   */
  private static clear = async (): Promise<IpcResponse> => {
    try {
      clipboard.clear()
      return successResponse()
    } catch (error) {
      return errorResponse(error)
    }
  }

  /**
   * 获取可用格式
   */
  private static availableFormats = async (): Promise<IpcResponse<string[]>> => {
    try {
      const formats = clipboard.availableFormats()
      return successResponse(formats)
    } catch (error) {
      return errorResponse(error, [])
    }
  }
}
