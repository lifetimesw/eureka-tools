import { MessageOptions, MessageType, MessageInstance, MessageFn } from '@renderer/types/message.type'
import MessageComponent from './message.vue'
import { createVNode, render, nextTick, isVNode, VNode } from 'vue'

const MESSAGE_GAP = 10
const DEFAULT_OFFSET = 40

function isObject(obj: unknown): obj is Record<string, unknown> {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

let seed = 1
const messageTypes: MessageType[] = ['text', 'success', 'warning', 'info', 'error']
const messageQueue: MessageInstance[] = []

function normalizeOptions(options: string | VNode | MessageOptions): MessageOptions {
  if (typeof options === 'string' || isVNode(options)) {
    return { content: options }
  } else if (isObject(options)) {
    return { ...options }
  }
  return {}
}

function createSlots(options: MessageOptions): Record<string, () => VNode> {
  const slots: Record<string, () => VNode> = {}
  if (options.content && isVNode(options.content)) {
    slots.default = () => options.content as VNode
  }
  if (options.iconRender && isVNode(options.iconRender)) {
    slots.icon = () => options.iconRender as VNode
  }
  return slots
}

function calculateTopPosition(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element)
  const defaultTopMatch = computedStyle.getPropertyValue('top').match(/\d+/)
  let top = defaultTopMatch ? Number(defaultTopMatch[0]) : DEFAULT_OFFSET
  messageQueue.forEach((item) => {
    const itemRect = item.el.getBoundingClientRect()
    top += itemRect.height + MESSAGE_GAP
  })
  return top
}

function removeMessageFromDOM(id: string, userOnClose?: () => void): void {
  const index = messageQueue.findIndex((vm) => id === vm.id)
  if (index === -1) return

  const message = messageQueue[index]
  const element = message.el
  const removedHeight = (element.offsetHeight || 0) + MESSAGE_GAP

  messageQueue.splice(index, 1)
  userOnClose?.()
  for (let i = index; i < messageQueue.length; i++) {
    const item = messageQueue[i]
    if (item && item.el) {
      const currentTop = parseInt(item.el.style['top'], 10) || 0
      item.el.style['top'] = `${currentTop - removedHeight}px`
    }
  }
}

const Message = function (options: string | VNode | MessageOptions = {}) {
  // 标准化参数
  const rawOptions = normalizeOptions(options)
  const userOnClose = rawOptions.onClose
  const messageId = `message_${seed++}`

  const handleClose = function (): void {
    removeMessageFromDOM(messageId, userOnClose)
  }

  const finalOptions: MessageOptions = {
    ...rawOptions,
    onClose: handleClose,
  }
  const slots: Record<string, () => VNode> = createSlots(finalOptions)

  // 创建容器
  const container = document.createElement('div')
  container.className = `stone-message-container_${messageId}`

  const vm = createVNode(MessageComponent, finalOptions, slots)
  vm.props = vm.props || {}
  vm.props.onDestroy = () => {
    render(null, container)
  }

  render(vm, container)

  const instance = vm.component

  if (!instance) {
    console.error('[Message] Failed to create component instance')
    return { close: () => {} }
  }
  const exposed = instance.exposed
  if (exposed) {
    exposed.close()
  }
  nextTick(() => {
    const el = container.firstElementChild as HTMLElement
    if (!el) return

    document.body.appendChild(el)

    const messageInstance: MessageInstance = { id: messageId, el, component: instance, close: handleClose }

    const top = calculateTopPosition(el)
    el.style.top = `${top}px`
    messageQueue.push(messageInstance)

    if (exposed) {
      exposed.open()
    }
  })
  return {
    close: () => {
      if (exposed) {
        exposed.close()
      }
    },
  }
} as MessageFn

messageTypes.forEach((type) => {
  Message[type] = (options: string | VNode | MessageOptions) => {
    if (isObject(options) && !isVNode(options)) {
      return Message({
        ...options,
        type,
      })
    }
    return Message({
      type,
      content: options,
    })
  }
})

Message.clear = function () {
  messageQueue.forEach((item) => {
    item.close()
  })
}

export default Message
