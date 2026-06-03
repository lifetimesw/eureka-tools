export type OnTopLevel = 'normal' | 'floating' | 'torn-off-menu' | 'modal-panel' | 'main-menu' | 'status' | 'pop-up-menu' | 'screen-saver'

export const IPC_CHANNELS = {
  // 剪切板
  CLIPBOARD: {
    WRITE_TEXT: 'clipboard:write-text',
    READ_TEXT: 'clipboard:read-text',
    WRITE_HTML: 'clipboard:write-html',
    READ_HTML: 'clipboard:read-html',
    CLEAR: 'clipboard:clear',
    AVAILABLE_FORMATS: 'clipboard:available-formats',
  },
  // 存储
  STORE: {
    GET: 'store:get',
    SET: 'store:set',
  },
  // 对话框
  DIALOG: {
    SHOW_OPEN: 'dialog:show-open',
    SHOW_SAVE: 'dialog:show-save',
    SHOW_MESSAGE: 'dialog:show-message',
    SHOW_ERROR: 'dialog:show-error',
  },
  // 窗口控制
  WINDOW: {
    IS_ALWAYS_ON_TOP: 'window:is-always-on-top',
    SET_ALWAYS_ON_TOP: 'window:set-always-on-top',
    ALWAYS_ON_TOP_CHANGED: 'window:always-on-top-changed',
    MINIMIZE: 'window:minimize',
    MAXIMIZE: 'window:maximize',
    CLOSE: 'window:close',
    RESTORE: 'window:restore',
    IS_MAXIMIZED: 'window:is-maximized',
    SET_TITLE: 'window:set-title',
    SET_SIZE: 'window:set-size',
  },
  // 系统信息
  SYSTEM: {
    GET_INFO: 'system:get-info',
    GET_PLATFORM: 'system:get-platform',
    GET_VERSION: 'system:get-version',
  },
  /*  */
  SHELL: {
    OPEN_EXTERNAL: 'shell:open-external',
  },
  /* 更新 */
  UPDATE: {
    STATUS: 'update:status',
    CHECK: 'update:check',
    DOWNLOAD: 'update:download',
    INSTALL: 'update:install',
  },
  // 应用控制
  APP: {
    QUIT: 'app:quit',
    RELOAD: 'app:reload',
    GET_PATH: 'app:get-path',
    SHOW_IN_FOLDER: 'app:show-in-folder',
    GET_VERSION: 'app:get-version',
    GET_APP_NAME: 'app:get-app-name',
  },
  // Axios请求
  HTTP: {
    REQUEST: 'http:request',
    CANCEL: 'http:cancel',
    CLEAR: 'http:clear',
  },
} as const

// 类型定义
export type IpcChannel =
  | (typeof IPC_CHANNELS.CLIPBOARD)[keyof typeof IPC_CHANNELS.CLIPBOARD]
  | (typeof IPC_CHANNELS.STORE)[keyof typeof IPC_CHANNELS.STORE]
  | (typeof IPC_CHANNELS.DIALOG)[keyof typeof IPC_CHANNELS.DIALOG]
  | (typeof IPC_CHANNELS.WINDOW)[keyof typeof IPC_CHANNELS.WINDOW]
  | (typeof IPC_CHANNELS.SYSTEM)[keyof typeof IPC_CHANNELS.SYSTEM]
  | (typeof IPC_CHANNELS.APP)[keyof typeof IPC_CHANNELS.APP]
  | (typeof IPC_CHANNELS.SHELL)[keyof typeof IPC_CHANNELS.SHELL]
  | (typeof IPC_CHANNELS.UPDATE)[keyof typeof IPC_CHANNELS.UPDATE]
  | (typeof IPC_CHANNELS.HTTP)[keyof typeof IPC_CHANNELS.HTTP]
