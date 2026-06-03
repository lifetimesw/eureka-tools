import { useRequestStore } from '@renderer/stores'
import { CustomRequestConfig, HttpResponse } from '@shared/httpRequest'

async function axiosRequest<T = unknown>(config: CustomRequestConfig): Promise<T> {
  const requestStore = useRequestStore()
  if (config.loading) {
    requestStore.startLoading()
  }
  const response = (await window.api.http.request(config)) as HttpResponse<T>
  if (config.loading) {
    requestStore.endLoading()
  }
  if (response.success) {
    return response.data as T
  }
  return null as T
}
axiosRequest.get = <T = unknown>(url: string, params?: unknown, config?: CustomRequestConfig): Promise<T> => {
  return axiosRequest<T>({ loading: true, deduplicate: true, ...config, method: 'get', url, params })
}

axiosRequest.post = <T = unknown>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<T> => {
  return axiosRequest<T>({ loading: true, deduplicate: true, ...config, method: 'post', url, data })
}

axiosRequest.cancel = (requestKey: string): void => {
  window.api.http.cancel(requestKey)
}
axiosRequest.clear = (): void => {
  window.api.http.clear()
}

export { axiosRequest }
