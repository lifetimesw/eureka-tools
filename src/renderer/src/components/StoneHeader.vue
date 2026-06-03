<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useClockStore } from '@renderer/stores'
import { IPC_CHANNELS } from '@shared/channels'

interface UpdateStatusResult {
  type: 'checking' | 'available' | 'unavailable' | 'downloading' | 'downloaded' | 'error'
  data?: {
    version: string
    percent: number
    total: number
  }
}

const clockStore = useClockStore()

const isMaximized = ref<boolean>(false)
const isOnTop = ref<boolean>(false)
const version = ref<string>('')
const updateInfo = reactive({
  available: false,
  version: '',
  downloading: false,
  downloaded: false,
  progress: 0,
  total: 0,
})

function handleUpdateClick(): void {
  if (updateInfo.available) {
    if (updateInfo.downloading) {
      return
    } else if (updateInfo.downloaded) {
      window.api.update.quitAndInstall()
    } else {
      window.api.update.downloadUpdate()
    }
  }
}
async function initWinControl(): Promise<void> {
  isOnTop.value = await window.api.appWindow.isAlwaysOnTop()
  window.electron.ipcRenderer.on(IPC_CHANNELS.WINDOW.ALWAYS_ON_TOP_CHANGED, (_: unknown, isTop: boolean) => {
    isOnTop.value = isTop
  })
  window.electron.ipcRenderer.on(IPC_CHANNELS.WINDOW.MAXIMIZE, (_: unknown, isMax: boolean) => {
    isMaximized.value = isMax
  })
}
async function winPin(): Promise<void> {
  if (isOnTop.value) {
    window.api.appWindow.setAlwaysOnTop(false)
    isOnTop.value = await window.api.appWindow.isAlwaysOnTop()
  } else {
    window.api.appWindow.setAlwaysOnTop(true, 'screen-saver')
    isOnTop.value = await window.api.appWindow.isAlwaysOnTop()
  }
}
function minimize(): void {
  window.api.appWindow.minimize()
}
function miximize(): void {
  window.api.appWindow.maximize()
}
function close(): void {
  window.api.appWindow.close()
}
async function initUpdater(): Promise<void> {
  version.value = await window.api.app.getVersion()
  window.electron.ipcRenderer.on('update:status', (_: unknown, result: UpdateStatusResult) => {
    const { type, data } = result
    switch (type) {
      case 'checking': {
        break
      }
      case 'available': {
        updateInfo.available = true
        updateInfo.version = data?.version || ''
        break
      }
      case 'unavailable': {
        updateInfo.available = false
        updateInfo.version = ''
        updateInfo.downloading = false
        updateInfo.downloaded = false
        break
      }
      case 'downloading': {
        updateInfo.downloading = true
        updateInfo.progress = Number(data?.percent.toFixed(2))
        updateInfo.total = data?.total || 0
        break
      }
      case 'downloaded': {
        updateInfo.downloading = false
        updateInfo.downloaded = true
        break
      }
      case 'error': {
        updateInfo.downloading = false
        updateInfo.downloaded = false
        break
      }
    }
  })
  window.api.update.checkForUpdates()
}
const updateBtnText = computed(() => {
  let text = `更新至v${updateInfo.version}`
  if (updateInfo.downloading) {
    return text + ` (${updateInfo.progress}%)`
  } else if (updateInfo.downloaded) {
    return text + ' (已下载，点击更新)'
  }
  return text
})

let interval: number = 0
onMounted(() => {
  initWinControl()
  initUpdater()
  interval = window.setInterval(() => {
    clockStore.tick()
  }, 500)
})
onUnmounted(() => {
  window.clearInterval(interval)
})
</script>

<template>
  <div class="stone-header">
    <div class="stone-app-bar">
      <div class="min-w-300px f-center-start">
        <i class="icon icon-l i-svg:ff14"></i>
        <span class="ml-1 text-4">Eureka Tools</span>
        <span class="ml-1 text-3">v{{ version }}</span>
        <button
          v-if="updateInfo.available"
          class="cursor-pointer bg-blue-400 ml-1em py-1 px-1 normal-button [-webkit-app-region:none] lh-1em"
          :disabled="updateInfo.downloading"
          @click="handleUpdateClick">
          {{ updateBtnText }}
        </button>
      </div>
      <div class="gap-2 f-center-center">
        <span class="font-500 c-blue">{{ clockStore.eorzeaTimeStr }}</span>
        <span class="text-gray text-4">|</span>
        <span class="text-gray text-4">{{ clockStore.localTimeStr }}</span>
      </div>
      <div class="min-w-300px f-center-end">
        <button class="win-min" @click="winPin()">
          <i class="icon-s i-lucide:pin" :class="{ 'text-blue': isOnTop }"></i>
        </button>
        <button class="win-min" @click="minimize()">
          <i class="icon-s i-lucide:minus"></i>
        </button>
        <button class="win-max" @click="miximize()">
          <i v-if="isMaximized" class="icon-m i-lucide:minimize"></i>
          <i v-else class="icon-s i-lucide:maximize"></i>
        </button>
        <button class="win-close" @click="close">
          <i class="icon-s i-lucide:x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stone-header {
  height: 40px;
  width: 100%;
  position: relative;

  .stone-app-bar {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    -webkit-app-region: drag;
    @include flex(center, space-between);
    z-index: 1001;
  }
}
</style>
