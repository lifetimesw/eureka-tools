<script setup lang="ts">
import type { EurekaAreaId } from '@renderer/types/eureka.type'
import { onUnmounted, reactive, ref, shallowRef, watch, type ComponentPublicInstance } from 'vue'
import WeatherForecast from '@renderer/components/Eorzea/WeatherForecast.vue'
import { useClockStore } from '@renderer/stores'
import { EorzeaClock } from '@renderer/utils/clock.util'
import { IPC_CHANNELS } from '@shared/channels'

interface WeatherForecastInstance extends ComponentPublicInstance {
  resize: () => void
}

const areaList = reactive<EurekaAreaId[]>(['area.EurekaAnemos', 'area.EurekaPagos', 'area.EurekaPyros', 'area.EurekaHydatos'])
const startTime = ref<string>('')
const endTime = ref<string>('')

const startClock = shallowRef<EorzeaClock>(new EorzeaClock())
const endClock = shallowRef<EorzeaClock>(new EorzeaClock())
const clockStore = useClockStore()
function setDefaultTimeRange(): void {
  const baseCock = clockStore.eorzeaClock.getWeatherBaseClock()
  startClock.value = baseCock.addHours(-6 * 8)
  endClock.value = baseCock.addHours(10 * 8)
}
function updateTimeRange(): void {
  const hasStart = !!startTime.value
  const hasEnd = !!endTime.value

  if (!hasStart && !hasEnd) {
    const baseCock = clockStore.eorzeaClock.getWeatherBaseClock()
    startClock.value = baseCock.addHours(-6 * 8)
    endClock.value = baseCock.addHours(10 * 8)
    return
  }

  let sDate: Date
  let eDate: Date
  const localTime = clockStore.eorzeaClock.getLocalTime()

  if (hasStart && hasEnd) {
    // 情况2：都有输入
    sDate = new Date(startTime.value)
    eDate = new Date(endTime.value)
    if (sDate >= eDate) {
      eDate.setHours(sDate.getHours() + 5)
    }
  } else if (hasStart) {
    sDate = new Date(startTime.value)
    const eDate1 = new Date(sDate.getTime())
    const eDate2 = new Date(localTime.getTime())
    eDate1.setHours(sDate.getHours() + 5)
    eDate2.setHours(localTime.getHours() + 5)
    eDate = eDate1.getTime() > eDate2.getTime() ? eDate1 : eDate2
  } else {
    eDate = new Date(endTime.value)
    const sDate1 = new Date(eDate.getTime())
    const sDate2 = new Date(localTime.getTime())
    sDate1.setHours(sDate1.getHours() - 2)
    sDate2.setHours(localTime.getHours() - 2)
    sDate = sDate1.getTime() < sDate2.getTime() ? sDate1 : sDate2
  }
  startClock.value = EorzeaClock.fromLocalTime(sDate)
  endClock.value = EorzeaClock.fromLocalTime(eDate)
}
function resetTime(): void {
  startTime.value = ''
  endTime.value = ''
  setDefaultTimeRange()
}
watch([startTime, endTime], () => {
  updateTimeRange()
})
setDefaultTimeRange()

watch(
  () => clockStore.eorzeaClock,
  (newClock: EorzeaClock, oldClock: EorzeaClock) => {
    if (!startTime.value && !endTime.value) {
      const newBaseClock = newClock.getWeatherBaseClock()
      const oldBaseClock = oldClock.getWeatherBaseClock()
      const newBaseSec = Math.floor(newBaseClock.getTime() / 1000)
      const oldBaseSec = Math.floor(oldBaseClock.getTime() / 1000)
      if (newBaseSec !== oldBaseSec) {
        updateTimeRange()
      }
    }
  }
)

const weatherRefs = shallowRef<WeatherForecastInstance[]>([])
function resize(): void {
  weatherRefs.value.forEach((item: WeatherForecastInstance) => {
    item.resize()
  })
}
const maximizeOff = window.electron.ipcRenderer.on(IPC_CHANNELS.WINDOW.MAXIMIZE, resize)

onUnmounted(() => {
  maximizeOff()
})
</script>

<template>
  <div class="h-full w-full">
    <div class="h-[2.5em] w-full f-center-center">
      <span>开始：</span>
      <input v-model="startTime" class="mr-1em normal-input-date" type="datetime-local" />
      <span>结束：</span>
      <input v-model="endTime" class="mr-1em normal-input-date" type="datetime-local" />
      <button class="normal-button" @click="resetTime">回到当前</button>
      <i v-title="'右键点击可复制天气'" class="ml-1em icon-l i-lucide:circle-question-mark"></i>
    </div>
    <div class="h-[calc(100%-3.5em)] w-full px-1em overflow-y-auto">
      <WeatherForecast v-for="item in areaList" ref="weatherRefs" :key="item" :area-id="item" :start-clock="startClock" :end-clock="endClock" />
    </div>
  </div>
</template>

<style lang="scss"></style>
