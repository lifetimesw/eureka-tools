import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS, OnTopLevel } from '@shared/channels'
import { CustomRequestConfig } from '@shared/httpRequest'

// Custom APIs for renderer
const api = {
  app: {
    getAppName: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_APP_NAME),
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_VERSION),
  },
  appWindow: {
    isAlwaysOnTop: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.IS_ALWAYS_ON_TOP),
    setAlwaysOnTop: (flag: boolean, level?: OnTopLevel) => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.SET_ALWAYS_ON_TOP, flag, level),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.MAXIMIZE),
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.MINIMIZE),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.CLOSE),
  },
  clipboard: {
    writeText: (text: string) => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD.WRITE_TEXT, text),
    readText: () => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD.READ_TEXT),
    writeHTML: (html: string) => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD.WRITE_HTML, html),
    readHTML: () => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD.READ_HTML),
    clear: () => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD.CLEAR),
  },
  store: {
    get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.STORE.GET, key),
    set: (key: string, value: unknown) => ipcRenderer.invoke(IPC_CHANNELS.STORE.SET, key, value),
  },
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.SHELL.OPEN_EXTERNAL, url),
  },
  update: {
    checkForUpdates: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATE.CHECK),
    downloadUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATE.DOWNLOAD),
    quitAndInstall: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATE.INSTALL),
  },
  http: {
    request: (config: CustomRequestConfig) => ipcRenderer.invoke(IPC_CHANNELS.HTTP.REQUEST, config),
    cancel: (requestKey: string) => ipcRenderer.invoke(IPC_CHANNELS.HTTP.CANCEL, requestKey),
    clear: () => ipcRenderer.invoke(IPC_CHANNELS.HTTP.CLEAR),
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
