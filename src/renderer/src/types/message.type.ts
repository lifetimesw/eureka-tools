import { App, ComponentInternalInstance, VNode } from 'vue'

export type MessageType = 'text' | 'success' | 'warning' | 'info' | 'error'

export interface MessageOptions {
  content?: string | VNode
  iconRender?: VNode
  type?: MessageType
  duration?: number
  showClose?: boolean
  customClass?: string
  onClose?: () => void
  [key: string]: unknown
}
export interface MessageInstance {
  id: string
  el: HTMLElement
  component: ComponentInternalInstance | null
  close: () => void
}
export interface MessageFn {
  (options?: string | VNode | MessageOptions): { close: () => void }
  clear(): void
  text(options?: string | VNode | MessageOptions): { close: () => void }
  success(options?: string | VNode | MessageOptions): { close: () => void }
  warning(options?: string | VNode | MessageOptions): { close: () => void }
  info(options?: string | VNode | MessageOptions): { close: () => void }
  error(options?: string | VNode | MessageOptions): { close: () => void }
  install(app: App): void
}
