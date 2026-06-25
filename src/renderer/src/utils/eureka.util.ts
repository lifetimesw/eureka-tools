import type { EurekaAreaId, Variant, Weather, WeatherInfo, WeatherRate } from '@renderer/types/eureka.type'
import { eurekaAreaNames, eurekaAreaVariants, eurekaAreaWeatherRates, eurekaWeatherMap } from '@renderer/data/eureka.data'

export class Eureka {
  static getWeatherInfo(weather: Weather): WeatherInfo {
    return eurekaWeatherMap[weather]
  }
  static getAreaWeather(areaId: EurekaAreaId): (WeatherInfo & WeatherRate)[] {
    return eurekaAreaWeatherRates[areaId].map((item) => {
      const weatherInfo = Eureka.getWeatherInfo(item.weather)
      return {
        ...item,
        ...weatherInfo,
      }
    })
  }

  static getAreaName(areaId: EurekaAreaId): string {
    return eurekaAreaNames[areaId]
  }

  static getAreaVariant(areaId: EurekaAreaId): Variant[] {
    return eurekaAreaVariants[areaId]
  }
}
