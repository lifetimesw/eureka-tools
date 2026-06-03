import { AppHandler } from './app'
import { WindowHandler } from './window'
import { UpdateHandler } from './update'
import { ClipboardHandler } from './clipboard'
import { StoreHandler } from './store'
import { ShellHandler } from './shell'
import { HttpHandler } from './http'
import { BrowserWindow } from 'electron'

export class IpcHandlers {
  static registerAll(mainWindow: BrowserWindow): void {
    console.log('Registering all IPC handlers...')

    // 注册各个模块的 handlers
    WindowHandler.register(mainWindow)
    UpdateHandler.register(mainWindow)
    AppHandler.register()
    HttpHandler.register()
    ShellHandler.register()
    ClipboardHandler.register()
    StoreHandler.register()

    console.log(' All IPC handlers registered successfully')
  }
  // 按需注册
  static registerByModule(moduleName: string, mainWindow: BrowserWindow): void {
    const modules: Record<string, () => void> = {
      app: () => AppHandler.register(),
      window: () => WindowHandler.register(mainWindow),
      clipboard: () => ClipboardHandler.register(),
      store: () => StoreHandler.register(),
      shell: () => ShellHandler.register(),
      http: () => HttpHandler.register(),
      update: () => UpdateHandler.register(mainWindow),
    }

    if (modules[moduleName]) {
      modules[moduleName]()
      console.log(`${moduleName} handlers registered`)
    } else {
      console.warn(`Unknown module: ${moduleName}`)
    }
  }
}
export { StoreHandler }
