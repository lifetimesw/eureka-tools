import { IPC_CHANNELS } from './channels'
import { IpcResponse } from './response'

export interface IPCMap {
  [IPC_CHANNELS.CLIPBOARD.WRITE_TEXT]: [params: { text: string }, result: IpcResponse]
  [IPC_CHANNELS.CLIPBOARD.READ_TEXT]: [params: void, result: IpcResponse<string>]
}
