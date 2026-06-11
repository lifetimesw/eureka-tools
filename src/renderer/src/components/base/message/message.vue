<script lang="ts" setup>
interface Props {
  duration?: number
  content?: string | object
  type?: string
  customClass?: string
  showClose?: boolean
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  content: '',
  type: 'text',
  customClass: '',
  showClose: false,
})

const emit = defineEmits<{
  destroy: []
}>()

const timer = ref<ReturnType<typeof setTimeout> | null>(null)
const visible = ref(false)
const isHover = ref(false)

function open(): void {
  visible.value = true
}
function close(): void {
  visible.value = false
}

function handleEnter(): void {
  isHover.value = true
  clearTimer()
}

function handleLeave(): void {
  isHover.value = false
  startTimer()
}

function startTimer(): void {
  if (props.duration > 0) {
    timer.value = setTimeout(() => {
      if (visible.value) {
        close()
      }
    }, props.duration)
  }
}

function clearTimer(): void {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
}

watch(visible, (newValue) => {
  if (newValue) {
    startTimer()
  }
})

defineExpose({ open, close })
</script>
<template>
  <transition name="stone-message-fade" @before-leave="onClose" @after-leave="emit('destroy')">
    <div v-show="visible" class="stone-message" :class="customClass" @mouseenter="handleEnter" @mouseleave="handleLeave">
      <div v-if="type !== 'text'" class="message-icon">
        <slot name="icon">
          <i v-if="type === 'info'">
            <svg class="message-icon-info" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path
                d="M512 74.666667c241.066667 0 437.333333 196.266667 437.333333 437.333333S753.066667 949.333333 512 949.333333 74.666667 753.066667 74.666667 512 270.933333 74.666667 512 74.666667z m0 341.333333c-17.066667 0-32 14.933333-32 32v300.8c2.133333 17.066667 14.933333 29.866667 32 29.866667s32-14.933333 32-32V445.866667c-2.133333-17.066667-14.933333-29.866667-32-29.866667z m0-160c-23.466667 0-42.666667 19.2-42.666667 42.666667s19.2 42.666667 42.666667 42.666666 42.666667-19.2 42.666667-42.666666-19.2-42.666667-42.666667-42.666667z" />
            </svg>
          </i>
          <i v-else-if="type === 'success'">
            <svg class="message-icon-success" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path
                d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m238.933333 349.866666l-2.133333 2.133334-277.333333 277.333333c-10.666667 10.666667-29.866667 12.8-42.666667 2.133333L426.666667 704l-149.333334-149.333333c-12.8-12.8-12.8-32 0-44.8 10.666667-10.666667 29.866667-12.8 42.666667-2.133334l2.133333 2.133334 125.866667 125.866666 253.866667-253.866666c10.666667-10.666667 29.866667-12.8 42.666666-2.133334l2.133334 2.133334c12.8 12.8 12.8 32 4.266666 42.666666z" />
            </svg>
          </i>
          <i v-else-if="type === 'error'">
            <svg class="message-icon-error" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path
                d="M512 85.333333C277.333333 85.333333 85.333333 277.333333 85.333333 512s192 426.666667 426.666667 426.666667c234.666667 0 426.666667-192 426.666667-426.666667S746.666667 85.333333 512 85.333333zM554.666667 725.333333l-85.333333 0 0-85.333333 85.333333 0L554.666667 725.333333zM554.666667 554.666667l-85.333333 0L469.333333 298.666667l85.333333 0L554.666667 554.666667z" />
            </svg>
          </i>
          <i v-else-if="type === 'warning'">
            <svg class="message-icon-warning" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path
                d="M934.4 770.133333L605.866667 181.333333C586.666667 147.2 550.4 128 512 128s-74.666667 21.333333-93.866667 53.333333L89.6 770.133333c-19.2 34.133333-19.2 76.8 0 110.933334S145.066667 938.666667 183.466667 938.666667h657.066666c40.533333 0 74.666667-21.333333 93.866667-57.6 19.2-34.133333 19.2-76.8 0-110.933334zM480 362.666667c0-17.066667 14.933333-32 32-32s29.866667 12.8 32 29.866666V640c0 17.066667-14.933333 32-32 32s-29.866667-12.8-32-29.866667V362.666667zM512 832c-23.466667 0-42.666667-19.2-42.666667-42.666667s19.2-42.666667 42.666667-42.666666 42.666667 19.2 42.666667 42.666666-19.2 42.666667-42.666667 42.666667z" />
            </svg>
          </i>
        </slot>
      </div>
      <slot>
        <p class="message-text">
          {{ content }}
        </p>
      </slot>
      <div v-if="showClose" class="message-option">
        <i class="message-close" @click="close">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path
              d="M556.8 512L832 236.8c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0L512 467.2l-275.2-277.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l275.2 277.333333-277.333333 275.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333L512 556.8 787.2 832c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8L556.8 512z" />
          </svg>
        </i>
      </div>
    </div>
  </transition>
</template>
