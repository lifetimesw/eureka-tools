// src/components/directives/title.ts
import type { Directive, DirectiveBinding } from 'vue'

declare global {
  interface HTMLElement {
    _tooltipCleanup?: () => void
    _currentTooltip?: HTMLDivElement
    _titleValue?: string
    _position?: Placement
    _hasTitleDirective?: boolean
    _hideTimeout?: number
    _interactive?: boolean
    _template?: boolean
  }
}
type Placement = 'top' | 'bottom' | 'left' | 'right'

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
    // 1. 更新存储的值
    const oldValue = el._titleValue
    el._titleValue = binding.value
    // 如果值变空，隐藏 Tooltip
    if (!binding.value) {
      if (el._currentTooltip) {
        if (el._currentTooltip) {
          if (el._currentTooltip.parentNode) {
            el._currentTooltip.parentNode.removeChild(el._currentTooltip)
          }
          el._currentTooltip = undefined
        }
      }
      return
    }

    if (oldValue !== binding.value && el._currentTooltip) {
      updateCurrentTooltip(el, binding.value)
    }
  },
  unmounted(el: HTMLElement) {
    unbindEvents(el)
    el._hasTitleDirective = false
    el._currentTooltip = undefined
    el._titleValue = undefined
    el._tooltipCleanup = undefined
  },
}
function bindEvents(el: HTMLElement): void {
  const showTooltip = (): void => {
    if (el._hideTimeout) {
      clearTimeout(el._hideTimeout)
      el._hideTimeout = undefined
      return
    }
    if (el._currentTooltip) {
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
    if (el._template) {
      const content = document.createElement('div')
      content.className = 'stone-title-tooltip-template'
      content.innerHTML = value
      tooltip.appendChild(content)
    } else {
      const content = document.createElement('div')
      content.className = 'stone-title-tooltip-text'
      content.textContent = value
      content.style.whiteSpace = 'pre-line'
      tooltip.appendChild(content)
    }

    tooltip.style.opacity = '0'
    tooltip.style.visibility = 'hidden'
    tooltip.style.position = 'fixed'
    tooltip.style.transition = 'opacity 0.2s, visibility 0.2s'
    tooltip.style.zIndex = '9999'

    document.body.appendChild(tooltip)
    el._currentTooltip = tooltip
    if (el._interactive) {
      tooltip.addEventListener('mouseenter', onTooltipMouseEnter)
      tooltip.addEventListener('mouseleave', hideTooltip)
    }

    requestAnimationFrame(() => {
      if (!el._currentTooltip) {
        return
      }
      calculateAndShow(el, tooltip)
    })
  }
  const hideTooltip = (): void => {
    if (el._hideTimeout) {
      clearTimeout(el._hideTimeout)
    }
    if (el._currentTooltip) {
      el._hideTimeout = setTimeout(() => {
        if (el._currentTooltip && el._currentTooltip.parentNode) {
          el._currentTooltip.removeEventListener('mouseenter', onTooltipMouseEnter)
          el._currentTooltip.removeEventListener('mouseleave', hideTooltip)
          el._currentTooltip.parentNode.removeChild(el._currentTooltip)
        }
        if (el._currentTooltip?.parentNode === null) {
          el._currentTooltip = undefined
        }
        el._hideTimeout = undefined
      }, 100) as unknown as number
    }
  }
  const onTooltipMouseEnter = (): void => {
    if (el._hideTimeout) {
      clearTimeout(el._hideTimeout)
      el._hideTimeout = undefined
    }
  }
  const onScrollOrResize = (): void => {
    if (el._currentTooltip) {
      // 强制销毁
      if (el._currentTooltip.parentNode) {
        el._currentTooltip.parentNode.removeChild(el._currentTooltip)
      }
      el._currentTooltip = undefined
    }
  }
  el.addEventListener('mouseenter', showTooltip)
  el.addEventListener('mouseleave', hideTooltip)
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)

  el._tooltipCleanup = () => {
    el.removeEventListener('mouseenter', showTooltip)
    el.removeEventListener('mouseleave', hideTooltip)

    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)

    if (el._currentTooltip && el._currentTooltip.parentNode) {
      el._currentTooltip.removeEventListener('mouseenter', onTooltipMouseEnter)
      el._currentTooltip.removeEventListener('mouseleave', hideTooltip)
      el._currentTooltip.parentNode.removeChild(el._currentTooltip)
    }
    el._currentTooltip = undefined
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
  // 3. 按照指定优先级选择方向: 上 -> 右 -> 下 -> 左
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
  arrow.classList.remove('top', 'bottom', 'left', 'right')
  arrow.classList.add(placement)

  if (arrow) {
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
    if (el._currentTooltip) {
      el._currentTooltip.style.visibility = 'visible'
      el._currentTooltip.style.opacity = '1'
    }
  }, 0)
}

function updateCurrentTooltip(el: HTMLElement, newValue: string): void {
  if (!el._currentTooltip) {
    return
  }

  el._currentTooltip.textContent = newValue

  requestAnimationFrame(() => {
    if (el._currentTooltip) {
      el._currentTooltip.classList.remove('top', 'bottom', 'left', 'right')
      calculateAndShow(el, el._currentTooltip)
    }
  })
}

function unbindEvents(el: HTMLElement): void {
  if (el._tooltipCleanup) {
    el._tooltipCleanup()
    el._tooltipCleanup = undefined
  }
}
