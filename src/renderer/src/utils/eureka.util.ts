import type { EurekaAreaId, Variant, WeatherRate } from '@renderer/types/eureka.type'
import { eurekaAreaNames, eurekaAreaVariants, eurekaAreaWeatherRates } from '@renderer/data/eureka.data'

export class Eureka {
  static getAreaWeather(areaId: EurekaAreaId): WeatherRate[] {
    return eurekaAreaWeatherRates[areaId]
  }

  static getAreaName(areaId: EurekaAreaId): string {
    return eurekaAreaNames[areaId]
  }

  static getAreaVariant(areaId: EurekaAreaId): Variant[] {
    return eurekaAreaVariants[areaId]
  }
}
