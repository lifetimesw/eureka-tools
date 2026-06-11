import { EorzeaClock } from '@renderer/utils/clock.util'
import { defineStore } from 'pinia'

export const useClockStore = defineStore('clock', () => {
  const eorzeaClock = shallowRef<EorzeaClock>(new EorzeaClock())

  const eorzeaTimeStr = computed(() => eorzeaClock.value.toHourMinuteString())
  const localTimeStr = computed(() => eorzeaClock.value.getLocalTime().toLocaleString())

  function tick(date: Date | number = Date.now()): void {
    eorzeaClock.value = EorzeaClock.fromLocalTime(date)
  }
  return {
    eorzeaClock,
    eorzeaTimeStr,
    localTimeStr,
    tick,
  }
})
