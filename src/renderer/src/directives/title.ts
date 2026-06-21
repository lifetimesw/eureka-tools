// src/components/directives/title.ts
import type { App, Directive, DirectiveBinding } from 'vue'

declare global {
  interface HTMLElement {
    _eventCleanup?: () => void
    _titleValue?: string
    _position?: Placement
    _hasTitleDirective?: boolean
    _interactive?: boolean
    _template?: boolean
  }
}
type Placement = 'top' | 'bottom' | 'left' | 'right'
interface GlobalToolTip {
  tooltip: HTMLDivElement | null
  owner: HTMLElement | null
  timeout: number
}
const globalToolTip: GlobalToolTip = {
  tooltip: null,
  owner: null,
  timeout: 0,
}

export const vTitle: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (el._hasTitleDirective) {
      unbindEvents(el)
    }
    el._position = binding.arg as Placement
    el._titleValue = binding.value
    el._hasTitleDirective = true
    el._interactive = binding.modifiers.interactive || false
    el._template = binding.modifiers.template || false
    bindEvents(el)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const oldValue = el._titleValue
    el._titleValue = binding.value

    if (oldValue !== binding.value && globalToolTip.owner === el) {
      updateCurrentTooltip(binding.value)
    }
  },
  unmounted(el: HTMLElement) {
    if (globalToolTip.owner === el) {
      destroyTooltip()
    }
    el._hasTitleDirective = false
    el._titleValue = undefined
    unbindEvents(el)
  },
}

function onTooltipMouseEnter(): void {
  if (globalToolTip.timeout) {
    clearTimeout(globalToolTip.timeout)
    globalToolTip.timeout = 0
  }
}

function destroyTooltip(): void {
  if (globalToolTip.tooltip) {
    if (globalToolTip.tooltip.parentNode) {
      globalToolTip.tooltip.parentNode.removeChild(globalToolTip.tooltip)
    }
    globalToolTip.tooltip.removeEventListener('mouseenter', onTooltipMouseEnter)
    globalToolTip.tooltip.removeEventListener('mouseleave', hideTooltip)
    globalToolTip.tooltip = null
    globalToolTip.owner = null
  }

  if (globalToolTip.timeout) {
    clearTimeout(globalToolTip.timeout)
    globalToolTip.timeout = 0
  }
}

function hideTooltip(): void {
  if (globalToolTip.timeout) {
    clearTimeout(globalToolTip.timeout)
    globalToolTip.timeout = 0
  }
  if (globalToolTip.tooltip) {
    const timeout = setTimeout(() => {
      destroyTooltip()
    }, 150) as unknown as number
    globalToolTip.timeout = timeout
  }
}

function bindEvents(el: HTMLElement): void {
  const showTooltip = (): void => {
    if (globalToolTip.tooltip) {
      clearTimeout(globalToolTip.timeout)
      globalToolTip.timeout = 0
      globalToolTip.owner = el
      updateCurrentTooltip(el._titleValue ?? '')
      return
    } else if (globalToolTip.owner === el) {
      clearTimeout(globalToolTip.timeout)
      globalToolTip.timeout = 0
      return
    }

    const value = el._titleValue
    if (!value) {
      return
    }

    const tooltip = document.createElement('div')
    tooltip.className = el._interactive ? 'stone-title-tooltip tooltip-interactive' : 'stone-title-tooltip'
    const arrow = document.createElement('div')
    arrow.className = 'stone-title-tooltip-arrow'
    tooltip.appendChild(arrow)

    const templateContent = document.createElement('div')
    templateContent.className = 'stone-title-tooltip-template'
    const textContent = document.createElement('div')
    textContent.className = 'stone-title-tooltip-text'
    if (el._template) {
      templateContent.innerHTML = value
      tooltip.appendChild(templateContent)
    } else {
      textContent.textContent = value
      tooltip.appendChild(textContent)
    }

    tooltip.style.opacity = '0'
    tooltip.style.visibility = 'hidden'
    tooltip.style.position = 'fixed'
    tooltip.style.transition = 'opacity 0.2s, visibility 0.2s'
    tooltip.style.zIndex = '9999'

    document.body.appendChild(tooltip)
    globalToolTip.tooltip = tooltip
    globalToolTip.owner = el
    if (el._interactive) {
      tooltip.addEventListener('mouseenter', onTooltipMouseEnter)
      tooltip.addEventListener('mouseleave', hideTooltip)
    }

    requestAnimationFrame(() => {
      if (!globalToolTip.tooltip) {
        return
      }
      calculateAndShow(el, tooltip)
    })
  }

  el.addEventListener('mouseenter', showTooltip)
  el.addEventListener('mouseleave', hideTooltip)

  el._eventCleanup = () => {
    el.removeEventListener('mouseenter', showTooltip)
    el.removeEventListener('mouseleave', hideTooltip)

    if (globalToolTip.tooltip && globalToolTip.owner === el) {
      destroyTooltip()
    }
  }
}

function calculateAndShow(el: HTMLElement, tooltip: HTMLDivElement): void {
  const elRect = el.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect() // 此时可能还没渲染准确，先估算或强制重排

  const arrow = tooltip.querySelector('.stone-title-tooltip-arrow') as HTMLDivElement

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const gap = 6 // 间距

  let top = 0
  let left = 0
  let placement: Placement = 'top'

  const headerHeight = 40
  const spaceTop = elRect.top - headerHeight // 减去Header高度
  const spaceLeft = elRect.left
  const spaceBottom = viewportHeight - elRect.bottom
  const spaceRight = viewportWidth - elRect.right

  const positions = {
    top: {
      top: elRect.top - tooltipRect.height - gap,
      left: elRect.left + elRect.width / 2 - tooltipRect.width / 2,
      fits: spaceTop >= tooltipRect.height + gap,
    },
    bottom: {
      top: elRect.bottom + gap,
      left: elRect.left + elRect.width / 2 - tooltipRect.width / 2,
      fits: spaceBottom >= tooltipRect.height + gap,
    },
    right: {
      top: elRect.top + elRect.height / 2 - tooltipRect.height / 2,
      left: elRect.right + gap,
      fits: spaceRight >= tooltipRect.width + gap,
    },
    left: {
      top: elRect.top + elRect.height / 2 - tooltipRect.height / 2,
      left: elRect.left - tooltipRect.width - gap,
      fits: spaceLeft >= tooltipRect.width + gap,
    },
  }
  const preferredOrder: Placement[] = ['top', 'right', 'bottom', 'left']
  if (el._position) {
    preferredOrder.unshift(el._position)
  }
  const bestFit = preferredOrder.find((dir) => positions[dir].fits)
  if (bestFit) {
    placement = bestFit
    top = Math.max(positions[bestFit].top, headerHeight)
    left = positions[bestFit].left
  } else {
    // 如果所有方向都放不下，选择空间最大的方向作为兜底
    const spaces = {
      top: spaceTop,
      bottom: spaceBottom,
      right: spaceRight,
      left: spaceLeft,
    }

    // 找出空间最大的键
    placement = (Object.keys(spaces) as Array<keyof typeof spaces>).reduce((a, b) => (spaces[a] > spaces[b] ? a : b))

    top = positions[placement].top
    left = positions[placement].left
  }
  // 水平修正
  if (left < 0) {
    left = 0
  } else if (left + tooltipRect.width > viewportWidth) {
    left = viewportWidth - tooltipRect.width
  }
  // 垂直修正
  if (top < 0) {
    top = 0
  } else if (top + tooltipRect.height > viewportHeight) {
    top = viewportHeight - tooltipRect.height
  }

  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`

  if (arrow) {
    arrow.classList.remove('top', 'bottom', 'left', 'right')
    arrow.classList.add(placement)
    const elCenterX = elRect.left + elRect.width / 2
    const elCenterY = elRect.top + elRect.height / 2
    const arrowRect = arrow.getBoundingClientRect()

    // 重置箭头样式
    arrow.style.top = ''
    arrow.style.left = ''
    arrow.style.bottom = ''
    arrow.style.right = ''

    if (placement === 'top' || placement === 'bottom') {
      const offsetLeft = elCenterX - left

      const clampedOffsetLeft = Math.max(0, Math.min(offsetLeft, tooltipRect.width - arrowRect.width))

      arrow.style.left = `${clampedOffsetLeft}px`

      if (placement === 'top') {
        arrow.style.bottom = '-5px'
      } else {
        arrow.style.top = '-10px'
      }
    } else {
      const offsetTop = elCenterY - top
      const clampedOffsetTop = Math.max(0, Math.min(offsetTop, tooltipRect.height - arrowRect.height))

      arrow.style.top = `${clampedOffsetTop}px`

      // 水平方向
      if (placement === 'left') {
        arrow.style.right = '-10px'
      } else {
        arrow.style.left = '-10px'
      }
    }
  }

  // 显示动画
  // 稍微延迟一点添加 visible，确保 transition 生效
  setTimeout(() => {
    if (globalToolTip.tooltip) {
      globalToolTip.tooltip.style.visibility = 'visible'
      globalToolTip.tooltip.style.opacity = '1'
    }
  }, 0)
}

function updateCurrentTooltip(newValue: string): void {
  if (!globalToolTip.tooltip || !globalToolTip.owner) {
    return
  }

  if (newValue === '') {
    destroyTooltip()
    return
  }

  if (globalToolTip.owner._template) {
    const templateContent = globalToolTip.tooltip.querySelector('.stone-title-tooltip-template')
    if (templateContent) {
      templateContent.innerHTML = newValue
    }
  } else {
    const textContent = globalToolTip.tooltip.querySelector('.stone-title-tooltip-text')
    if (textContent) {
      textContent.textContent = newValue
    }
  }

  requestAnimationFrame(() => {
    if (globalToolTip.tooltip && globalToolTip.owner) {
      globalToolTip.tooltip.classList.remove('top', 'bottom', 'left', 'right')
      calculateAndShow(globalToolTip.owner, globalToolTip.tooltip)
    }
  })
}

function unbindEvents(el: HTMLElement): void {
  if (el._eventCleanup) {
    el._eventCleanup()
    el._eventCleanup = undefined
  }
}

export default {
  install(app: App) {
    app.directive('title', vTitle)
  },
}
