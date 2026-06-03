// 请求/响应类型
export interface IpcRequest<T = unknown> {
  id?: string
  data: T
  timestamp: number
}

export interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}
// 辅助函数：统一成功响应
export const successResponse = <T = void>(data?: T): IpcResponse<T> => ({
  success: true,
  data,
  timestamp: Date.now(),
})
// 辅助函数：统一失败响应
export const errorResponse = <T = void>(error: unknown, defaultData?: T): IpcResponse<T> => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`Clipboard operation failed: ${message}`, error)
  return {
    success: false,
    data: defaultData as T,
    error: message,
    timestamp: Date.now(),
  }
}
