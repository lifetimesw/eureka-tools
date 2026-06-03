import { ipcMain } from 'electron'
import { Conf } from 'electron-conf/main'
import { IPC_CHANNELS } from '@shared/channels'
import { IpcResponse, errorResponse, successResponse } from '@shared/response'

interface WindowConfig {
  width: number
  height: number
  x?: number
  y?: number
  isMaximized?: boolean
}

const store = new Conf({
  name: 'app-data',
})

export class StoreHandler {
  static register(): void {
    ipcMain.handle(IPC_CHANNELS.STORE.GET, async (_, key: string) => StoreHandler.get(key))
    ipcMain.handle(IPC_CHANNELS.STORE.SET, async (_, key: string, value: unknown) => StoreHandler.set(key, value))
  }
  private static async get(key: string): Promise<IpcResponse<unknown>> {
    try {
      // 简单的参数校验
      if (!key || typeof key !== 'string') {
        throw new Error('无效的键名')
      }

      // 从 store 中获取数据
      // 如果 key 不存在，get 会返回 undefined，我们可以选择返回空字符串或特定错误
      const content = store.get(key)

      return successResponse(content)
    } catch (error) {
      return errorResponse(error, '')
    }
  }

  private static async set(key: string, value: unknown): Promise<IpcResponse<string>> {
    try {
      // 简单的参数校验
      if (!key || typeof key !== 'string') {
        throw new Error('无效的键名')
      }

      // 将数据存入 store
      store.set(key, value)

      return successResponse()
    } catch (error) {
      return errorResponse(error)
    }
  }
  static getWindowConfig(): WindowConfig {
    return store.get('windowConfig') as WindowConfig
  }
  static setWindowConfig(config: Partial<WindowConfig>): void {
    const currentConfig = store.get('windowConfig') as WindowConfig
    store.set('windowConfig', { ...currentConfig, ...config })
  }
}
