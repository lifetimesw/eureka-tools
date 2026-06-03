import { ElectronAPI } from '@electron-toolkit/preload'
import { OnTopLevel } from '@shared/channels'
import { HttpResponse } from '@shared/httpRequest'

export interface App {
  getAppName: () => Promise<string>
  getVersion: () => Promise<string>
}
export interface AppWindow {
  isAlwaysOnTop: () => Promise<IpcResponse<boolean>>
  setAlwaysOnTop: (isTop: boolean, level?: OnTopLevel) => Promise<IpcResponse>
  maximize: () => Promise<IpcResponse>
  minimize: () => Promise<IpcResponse>
  close: () => Promise<IpcResponse>
}
export interface Clipboard {
  writeText: (text: string) => Promise<IpcResponse>
  readText: () => Promise<IpcResponse>
  writeHTML: (text: string) => Promise<IpcResponse>
  readHTML: () => Promise<IpcResponse>
  clear: () => Promise<IpcResponse>
}
export interface Store {
  get: (key: string) => Promise<IpcResponse>
  set: (key: string, value: unknown) => Promise<IpcResponse>
}
export interface Shell {
  openExternal: (url: string) => Promise<IpcResponse>
}
export interface Update {
  checkForUpdates: () => Promise<IpcResponse>
  downloadUpdate: () => Promise<IpcResponse>
  quitAndInstall: () => Promise<IpcResponse>
}
export interface Http {
  request: (config: CustomRequestConfig) => Promise<HttpResponse>
  get: (url: string, params?: unknown, config?: CustomRequestConfig) => Promise<HttpResponse>
  post: (url: string, data?: unknown, config?: CustomRequestConfig) => Promise<HttpResponse>
  put: (url: string, data?: unknown, config?: CustomRequestConfig) => Promise<HttpResponse>
  delete: (url: string, params?: unknown, config?: CustomRequestConfig) => Promise<HttpResponse>
  cancel: (requestKey: string) => Promise<IpcResponse>
  clear: () => Promise<IpcResponse>
}

export interface CustomAPI {
  ipcRenderer: IpcRenderer
  app: App
  appWindow: AppWindow
  clipboard: Clipboard
  store: Store
  shell: Shell
  update: Update
  http: Http
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
