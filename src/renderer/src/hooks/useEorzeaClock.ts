import { EorzeaClock } from '@renderer/utils/clock.util'
import type { Ref } from 'vue'

interface UseEorzeaClockReturn {
  eorzeaClock: Ref<EorzeaClock>
  updateEorzeaClock: (date?: number | Date) => void
}
export function useEorzeaClock(localTime: number | Date | undefined): UseEorzeaClockReturn {
  const eorzeaClock = shallowRef<EorzeaClock>(
    localTime ? EorzeaClock.fromLocalTime(localTime instanceof Date ? localTime : new Date(localTime)) : new EorzeaClock()
  )

  const updateEorzeaClock = (date?: number | Date): void => {
    let targetDate: Date
    if (date !== undefined) {
      targetDate = date instanceof Date ? date : new Date(date)
    } else if (localTime !== undefined) {
      targetDate = localTime instanceof Date ? localTime : new Date(localTime)
    } else {
      targetDate = new Date()
    }
    eorzeaClock.value = EorzeaClock.fromLocalTime(targetDate)
  }

  return {
    eorzeaClock,
    updateEorzeaClock,
  }
}
