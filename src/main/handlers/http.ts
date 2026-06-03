import { ipcMain } from 'electron'
import axios from 'axios'
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { IPC_CHANNELS } from '@shared/channels'
import { CustomRequestConfig, HttpResponse } from '@shared/httpRequest'

const requestControllerMap = new Map<string, AbortController>()
const service: AxiosInstance = axios.create({
  // timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig & CustomRequestConfig) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

export class HttpHandler {
  static register(): void {
    ipcMain.handle(IPC_CHANNELS.HTTP.REQUEST, async (_, config: CustomRequestConfig) => HttpHandler.axiosRequest(config))
    ipcMain.handle(IPC_CHANNELS.HTTP.CANCEL, async (_, requestKey: string) => HttpHandler.cancel(requestKey))
    ipcMain.handle(IPC_CHANNELS.HTTP.CLEAR, async () => HttpHandler.clear())
  }

  private static axiosRequest = async (config: CustomRequestConfig): Promise<HttpResponse> => {
    const { url, method, data, params, headers, deduplicate } = config

    const controller = config.controller || new AbortController()

    let requestKey: string | false = config.requestKey || false
    if (!requestKey && deduplicate) {
      if (typeof deduplicate === 'function') {
        requestKey = deduplicate(config)
      } else {
        const dataStr = config.data instanceof FormData ? 'FormData' : JSON.stringify(config.data)
        const paramsStr = JSON.stringify(config.params || {})
        requestKey = `${config.method}:${config.url}:${paramsStr}:${dataStr}`
      }
    }
    if (requestKey) {
      requestControllerMap.set(requestKey, controller)
    }

    try {
      const config: AxiosRequestConfig = {
        url,
        method,
        data,
        params,
        headers,
        signal: controller.signal,
      }

      const response = await service.request(config)
      return {
        success: true,
        data: response.data,
        status: response.status,
        requestKey: requestKey || '',
      }
    } catch (error: unknown) {
      if (axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')) {
        return {
          success: false,
          cancelled: true,
          message: '请求已取消',
          requestKey: requestKey || '',
        }
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        cancelled: false,
        message: errorMessage,
        requestKey: requestKey || '',
      }
    } finally {
      if (requestKey) {
        requestControllerMap.delete(requestKey)
      }
    }
  }
  private static cancel = (requestKey: string): void => {
    const controller = requestControllerMap.get(requestKey)
    if (controller) {
      controller.abort()
    }
  }
  private static clear = (): void => {
    requestControllerMap.forEach((controller) => controller?.abort())
    requestControllerMap.clear()
  }
}
