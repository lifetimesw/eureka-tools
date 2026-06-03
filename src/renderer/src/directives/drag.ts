import type { Directive } from 'vue'

interface DragElement extends HTMLElement {
  _dragStartX?: number
  _dragStartY?: number
  _initialLeft?: number
  _initialTop?: number
  _parentWidth?: number
  _parentHeight?: number
  _elementWidth?: number
  _elementHeight?: number
}
let currentDraggingEl: DragElement | null = null

function handleMouseMove(e: MouseEvent): void {
  if (!currentDraggingEl) {
    return
  }

  const el = currentDraggingEl
  const { _dragStartX, _dragStartY, _initialLeft, _initialTop, _parentWidth, _parentHeight, _elementWidth, _elementHeight } = el

  if (_dragStartX === undefined || _dragStartY === undefined || _initialLeft === undefined || _initialTop === undefined) {
    return
  }

  const deltaX = e.clientX - _dragStartX
  const deltaY = e.clientY - _dragStartY

  let newLeft = _initialLeft + deltaX
  let newTop = _initialTop + deltaY

  if (newLeft < 0) {
    newLeft = 0
  }
  if (_parentWidth && _elementWidth && newLeft + _elementWidth > _parentWidth) {
    newLeft = _parentWidth - _elementWidth
  }
  if (newTop < 0) {
    newTop = 0
  }
  if (_parentHeight && _elementHeight && newTop + _elementHeight > _parentHeight) {
    newTop = _parentHeight - _elementHeight
  }
  el.style.left = `${newLeft}px`
  el.style.top = `${newTop}px`

  el.style.right = 'auto'
  el.style.bottom = 'auto'
}

function handleMouseUp(): void {
  if (currentDraggingEl) {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = ''
    currentDraggingEl = null
  }
}

export const vDrag: Directive = {
  mounted(el: DragElement) {
    const position = window.getComputedStyle(el).position
    if (position === 'static') {
      el.style.position = 'absolute'
    }
    el.onmousedown = function (e) {
      const rect = el.getBoundingClientRect()
      const parentEl = el.offsetParent

      const parentWidth = parentEl?.scrollWidth || window.innerWidth
      const parentHeight = parentEl?.scrollHeight || window.innerHeight
      el._dragStartX = e.clientX
      el._dragStartY = e.clientY
      el._initialLeft = el.offsetLeft
      el._initialTop = el.offsetTop
      el._parentWidth = parentWidth
      el._parentHeight = parentHeight
      el._elementWidth = rect.width
      el._elementHeight = rect.height
      currentDraggingEl = el
      e.preventDefault()

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  },
  unmounted(el: DragElement) {
    el.onmousedown = null

    if (currentDraggingEl === el) {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      currentDraggingEl = null
    }
  },
}
