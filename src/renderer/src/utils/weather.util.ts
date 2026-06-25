import type { EorzeaClock } from './clock.util'
import type { EurekaAreaId, ForecastItem, WeatherRate } from '@renderer/types/eureka.type'
import { Eureka } from './eureka.util'

// 艾欧泽亚时间每8小时为一个天气周期
const WEATHER_PERIOD_HOURS = 8

// 天气计算
export class EorzeaWeather {
  /**
   * 计算基准时钟 (对齐到当前天气周期的开始时间，即整8点)
   */
  static calcBaseClock(clock: EorzeaClock): EorzeaClock {
    return clock.getWeatherBaseClock()
  }

  /**
   * 计算单个时间点的天气种子
   * @param clock 艾欧泽亚时钟
   */
  private static calcSingleSeed(clock: EorzeaClock): number {
    const adjustedHour = (clock.getHours() + 8 - (clock.getHours() % 8)) % 24
    const seedValue = clock.getDays() * 100 + adjustedHour

    const step1 = ((seedValue << 11) ^ seedValue) >>> 0
    const step2 = ((step1 >>> 8) ^ step1) >>> 0
    return step2 % 100
  }

  /**
   * 【核心】根据种子和区域数据获取具体天气
   */
  private static getWeatherBySeed(areaWeather: WeatherRate[], seed: number): WeatherRate {
    let remainingSeed = seed
    for (const rateInfo of areaWeather) {
      if (rateInfo.rate === -1) {
        return rateInfo
      }
      if (remainingSeed < rateInfo.rate) {
        return rateInfo
      }
      remainingSeed -= rateInfo.rate
    }
    return { rate: 0, weather: 'unknown' }
  }

  /**
   * 获取指定时间点的天气详情
   */
  static getWeatherAtTime(areaId: EurekaAreaId, clock: EorzeaClock): ForecastItem | null {
    const areaWeather = Eureka.getAreaWeather(areaId)
    if (!areaWeather) {
      return null
    }

    const baseClock = clock.getWeatherBaseClock()

    const seed = this.calcSingleSeed(clock)

    const weatherRate = this.getWeatherBySeed(areaWeather, seed)
    const weatherInfo = Eureka.getWeatherInfo(weatherRate.weather)

    const endTimeClock = baseClock.addHours(8)
    const localTime = baseClock.getLocalTime()
    const localTimeStr = localTime.toLocaleTimeString()
    const localDateStr = localTime.toLocaleDateString().slice(5)

    return {
      time: baseClock.toHourMinuteString(),
      name: weatherInfo.name,
      weather: weatherRate.weather,
      icon: weatherInfo.icon,
      period: 0,
      localTime: baseClock.getLocalTime(),
      localTimeStr: localTimeStr,
      localDateStr: localDateStr,
      startTimestamp: baseClock.getTime(),
      endTimestamp: endTimeClock.getTime(),
    }
  }

  /**
   * 获取指定时间范围内的天气预报
   */
  static getForecastByRange(areaId: EurekaAreaId, startClock: EorzeaClock, endClock: EorzeaClock): ForecastItem[] {
    const forecasts: ForecastItem[] = []
    let baseClock = startClock.getWeatherBaseClock()
    let maxIterations = 1000
    let period = 0
    while (baseClock.getTime() <= endClock.getTime() && maxIterations > 0) {
      maxIterations--
      const item = this.getWeatherAtTime(areaId, baseClock)
      if (item) {
        item.period = period
        forecasts.push(item)
        period++
      }
      // 跳转到下一个周期
      baseClock = baseClock.addHours(8)
    }
    return forecasts
  }

  /**
   * 获取未来多个周期的天气预报
   */
  static getExtendedForecast(areaId: EurekaAreaId, startTime: EorzeaClock, hourAfter: number = 12, hourBefore: number = 6): ForecastItem[] {
    // 计算起止时间戳
    const startClock = startTime.getWeatherBaseClock().addHours(-hourBefore * WEATHER_PERIOD_HOURS)
    const endClock = startTime.getWeatherBaseClock().addHours(hourAfter * WEATHER_PERIOD_HOURS)

    const forecasts = this.getForecastByRange(areaId, startClock, endClock)

    return forecasts
  }

  /**
   * 查找特定天气出现的时间
   */
  static findWeather(areaId: EurekaAreaId, targetWeather: string, fromTime: EorzeaClock, maxPeriods: number = 24): ForecastItem[] {
    const forecasts = this.getExtendedForecast(areaId, fromTime, maxPeriods)
    return forecasts.filter((item: ForecastItem): boolean => item.weather === targetWeather)
  }
}
