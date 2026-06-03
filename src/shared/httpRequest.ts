import { AxiosRequestConfig } from 'axios'

export interface CustomRequestConfig extends AxiosRequestConfig {
  loading?: boolean
  /**
   * 去重策略
   * - true: 默认策略
   * - function: 自定义生成 Key
   */
  deduplicate?: boolean | ((config: CustomRequestConfig) => string | false)
  requestKey?: string
  controller?: AbortController
  isUpload?: boolean
}

export interface HttpResponse<T = unknown> {
  success: boolean
  requestKey: string
  data?: T
  status?: number
  cancelled?: boolean
  message?: string
}
