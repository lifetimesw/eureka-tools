import type { EurekaAreaId, ForecastItem, ForecastResult, Weather } from '@renderer/types/eureka.type'
import { EorzeaClock } from '@renderer/utils/clock.util'
import { nextTick, onMounted, Ref, ComputedRef, ShallowReactive, computed, ref, watch, shallowReactive, Reactive, reactive } from 'vue'
import { Eureka } from '@renderer/utils/eureka.util'
import { EorzeaWeather } from '@renderer/utils/weather.util'
import { useClockStore } from '@renderer/stores'
import StoneMessage from '@renderer/components/base/message'

export const FORECAST_STATUS = {
  BEFORE: 0,
  CURRENT: 1,
  AFTER: 2,
}
export type ForecastType = 'start' | 'end' | 'middle' | 'single'
export interface WeatherForecastProps {
  areaId: EurekaAreaId
  startClock: EorzeaClock // 预报开始时间
  endClock: EorzeaClock // 预报结束时间
}
interface ProcessedForecastItem extends ForecastItem {
  show: boolean
  type: ForecastType
}

interface WeatherForecastReturn {
  weatherLock: Reactive<Weather[]>
  forecastResult: Ref<ForecastResult | null>
  weatherRefMap: ShallowReactive<Record<number, HTMLElement | null>>
  areaName: ComputedRef<string>
  forecastComputed: ComputedRef<ProcessedForecastItem[]>
  getForecastStatus: (item: ProcessedForecastItem) => number
  setWeatherRef: (el: unknown, forecast: ForecastItem) => void
  calculateForecast: () => void
  copyForeastWeather: () => void
  copyWeather: (item: ProcessedForecastItem, index: number) => void
  getWeatherProgress: (item: ProcessedForecastItem) => number
  handleLock: (weather: Weather) => void
  resize: (isSilent: boolean) => void
}

export function useWeatherForecast(props: WeatherForecastProps): WeatherForecastReturn {
  const weatherLock = reactive<Weather[]>([])
  const forecastResult = ref<ForecastResult | null>(null)
  const weatherRefMap = shallowReactive<Record<number, HTMLElement | null>>({})
  const clockStore = useClockStore()

  const areaName = computed(() => {
    return Eureka.getAreaName(props.areaId)
  })
  const forecastComputed = computed(() => {
    if (!forecastResult.value) return []

    const processed: ProcessedForecastItem[] = forecastResult.value.forecasts.map((item) => ({
      ...item,
      show: true,
      type: 'single',
    }))

    if (weatherLock.length) {
      processed.forEach((item) => {
        item.show = weatherLock.includes(item.weather)
      })
    }
    processed.forEach((item, index) => {
      const prevItem = index > 0 ? processed[index - 1] : null
      const nextItem = index < processed.length - 1 ? processed[index + 1] : null
      const isConnectedToPrev = prevItem && item.startTimestamp === prevItem.endTimestamp && item.weather === prevItem.weather
      const isConnectedToNext = nextItem && nextItem.startTimestamp === item.endTimestamp && item.weather === nextItem.weather
      if (isConnectedToPrev && isConnectedToNext) {
        item.type = 'middle'
      } else if (isConnectedToPrev) {
        item.type = 'end'
      } else if (isConnectedToNext) {
        item.type = 'start'
      }
    })

    return processed
  })

  function getForecastStatus(item: ProcessedForecastItem): number {
    const now = clockStore.eorzeaClock.getTime()
    if (now >= item.startTimestamp && now < item.endTimestamp) {
      return FORECAST_STATUS.CURRENT
    }
    return now < item.startTimestamp ? FORECAST_STATUS.AFTER : FORECAST_STATUS.BEFORE
  }

  function setWeatherRef(el: unknown, forecast: ForecastItem): void {
    if (el instanceof HTMLElement) {
      weatherRefMap[forecast.period] = el
    } else {
      weatherRefMap[forecast.period] = null
    }
  }

  function calculateForecast(): void {
    const areaName = Eureka.getAreaName(props.areaId)
    // 边界检查：如果开始时间晚于结束时间，返回空结果
    if (props.startClock.getTime() >= props.endClock.getTime()) {
      forecastResult.value = {
        areaId: props.areaId,
        areaName,
        currentTime: clockStore.eorzeaTimeStr,
        forecasts: [],
        timeRange: { start: '', end: '' },
        generatedAt: new Date(),
      }
    }

    // 生成预报项
    const forecasts: ForecastItem[] = EorzeaWeather.getForecastByRange(props.areaId, props.startClock, props.endClock)

    forecastResult.value = {
      areaId: props.areaId,
      areaName,
      currentTime: clockStore.eorzeaTimeStr,
      forecasts,
      timeRange: {
        start: forecasts[0]?.time || '',
        end: forecasts[forecasts.length - 1]?.time || '',
      },
      generatedAt: new Date(),
    }
  }

  function copyForeastWeather(): void {
    const startClock = new EorzeaClock()
    const wForecast = EorzeaWeather.getExtendedForecast(props.areaId, startClock, 5, 0)
    const weathers = wForecast.map((item, index) => {
      if (index === 0) {
        const timeRemaining = new EorzeaClock(item.endTimestamp).getLocalTime().getTime() - new Date().getTime()
        const minute = Math.floor(timeRemaining / 1000 / 60)
        const second = Math.floor((timeRemaining / 1000) % 60)
        return `【**${item.name}** 剩余${minute}分${second}秒】`
      }
      return `【${item.name} ${item.localTimeStr} (${item.time})】`
    })
    const weatherStr = `【${areaName.value}】${weathers.join('')}`
    window.api.clipboard.writeText(weatherStr)
    StoneMessage.success(`${areaName.value}当前天气复制成功`)
  }

  function copyWeather(item: ProcessedForecastItem, index: number): void {
    const { name, type } = item
    let startItem = item
    let endItem = item
    let sIndex = index
    let eIndex = index
    if (type === 'middle') {
      while (startItem.type !== 'start') {
        startItem = forecastComputed.value[--sIndex]
      }
      while (endItem.type !== 'end') {
        endItem = forecastComputed.value[++eIndex]
      }
    } else if (type === 'start') {
      while (endItem.type !== 'end') {
        endItem = forecastComputed.value[++eIndex]
      }
    } else if (type === 'end') {
      while (startItem.type !== 'start') {
        startItem = forecastComputed.value[--sIndex]
      }
    }

    const startClock = new EorzeaClock(startItem.startTimestamp)
    const startLocalTime = startClock.getLocalTime()
    const startDateStr = startLocalTime.toLocaleDateString()
    const startTimeStr = startLocalTime.toLocaleTimeString()
    const startET = startClock.toHourMinuteString()
    const endClock = new EorzeaClock(endItem.endTimestamp)
    const endLocalTime = endClock.getLocalTime()
    const endTimeStr = endLocalTime.toLocaleTimeString()
    const endET = endClock.toHourMinuteString()
    const count = eIndex - sIndex + 1

    const weatherStr = `【${areaName.value} - ${name}${count > 1 ? `${count}连` : ''} - ${startDateStr}】 ${startTimeStr} (${startET}) - ${endTimeStr} (${endET})`
    window.api.clipboard.writeText(weatherStr)
    StoneMessage.success(`${name}天气复制成功`)
  }
  function getWeatherProgress(item: ProcessedForecastItem): number {
    const now = clockStore.eorzeaClock.getTime()
    if (getForecastStatus(item) !== FORECAST_STATUS.CURRENT) {
      return 0
    }

    const totalDuration = item.endTimestamp - item.startTimestamp
    const elapsed = now - item.startTimestamp

    if (totalDuration <= 0) return 0

    const progress = (elapsed / totalDuration) * 100
    return Math.min(Math.max(progress, 0), 100)
  }
  function resize(isSilent: boolean = false): void {
    nextTick(() => {
      if (forecastComputed.value.length === 0) {
        return
      }
      const currentTs = clockStore.eorzeaClock.getTime()
      const currentForecast = forecastComputed.value.find((f: ForecastItem) => f.endTimestamp > currentTs)

      let targetEl: HTMLElement | null = null
      if (currentForecast) {
        targetEl = weatherRefMap[currentForecast.period]
      } else {
        targetEl = weatherRefMap[forecastComputed.value[0].period]
      }
      if (targetEl) {
        let scrollContainer: HTMLElement | null = targetEl.parentElement

        while (scrollContainer) {
          const style = window.getComputedStyle(scrollContainer)
          if (style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflow === 'auto' || style.overflow === 'scroll') {
            break
          }
          // 如果到了 body 或 html 还没找到，就停止，避免无限循环
          if (scrollContainer.tagName === 'BODY' || scrollContainer.tagName === 'HTML') {
            scrollContainer = null
            break
          }
          scrollContainer = scrollContainer.parentElement
        }

        if (scrollContainer) {
          if (isSilent && scrollContainer) {
            const originalBehavior = scrollContainer.style.scrollBehavior
            scrollContainer.style.scrollBehavior = 'auto'
            targetEl.scrollIntoView({ behavior: 'auto', inline: 'center' })
            scrollContainer.style.scrollBehavior = originalBehavior
          } else {
            const scrollRect = scrollContainer.getBoundingClientRect()
            const targetRect = targetEl.getBoundingClientRect()
            const targetCenterRelativeToLeft = targetRect.left + targetRect.width / 2 - scrollRect.left
            const targetCenter = scrollRect.width / 2
            const delta = targetCenterRelativeToLeft - targetCenter
            const newScrollLeft = scrollContainer.scrollLeft + delta

            scrollContainer.scrollTo({
              left: newScrollLeft,
              behavior: 'auto',
            })
          }
        }
      }
    })
  }

  function handleLock(weather: Weather): void {
    if (weatherLock.includes(weather)) {
      weatherLock.splice(weatherLock.indexOf(weather), 1)
    } else {
      weatherLock.push(weather)
    }
    resize(true)
  }

  onMounted(() => {
    calculateForecast()
    resize()
  })

  watch(
    () => [props.areaId, props.startClock.getTime(), props.endClock.getTime()],
    ([, newStartTs, newEndTs]) => {
      if (newStartTs <= newEndTs) {
        calculateForecast()
        nextTick(() => resize())
      }
    },
    { deep: true }
  )

  return {
    weatherLock,
    areaName,
    forecastResult,
    forecastComputed,
    weatherRefMap,
    getForecastStatus,
    setWeatherRef,
    calculateForecast,
    copyForeastWeather,
    copyWeather,
    getWeatherProgress,
    handleLock,
    resize,
  }
}
