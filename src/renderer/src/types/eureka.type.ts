/* 风、冰、火、水岛 */
export type EurekaAreaId = 'area.EurekaAnemos' | 'area.EurekaPagos' | 'area.EurekaPyros' | 'area.EurekaHydatos'
export type TimePeriod = 'sun' | 'moon' | 'sun-moon'
export type VariantElement = 'fire' | 'wind' | 'lightning' | 'water' | 'ice' | 'earth'
export type VariantType = 'adaptation' | 'mutation'
export type Weather =
  | 'fairSkies'
  | 'gales'
  | 'showers'
  | 'snow'
  | 'fog'
  | 'heatWaves'
  | 'thunder'
  | 'blizzards'
  | 'umbralWind'
  | 'gloom'
  | 'thunderstorms'
  | 'unknown'

/* 天气概率 */
export interface WeatherRate {
  rate: number // 概率
  name: string // 天气名称
  weather: Weather // 天气名称
  color: string // 天气颜色
}

/* 区域Fate */
export interface Fate {
  name: string
  title: string
  level: number
  aliases: string[]
  triggerCondition: {
    monster: string
    night: boolean
    weather: { name: string; weather: Weather } | null
  }
  description: string
  triggerTime?: string
  normalRewards: {
    name: string
    icon?: string
    quantity: number
  }[]
  specialRewards?: {
    name: string
    icon?: string
  }[]
}

/* 预测天气 */
export interface ForecastItem {
  time: string
  name: string
  period: number
  localTime: Date
  localTimeStr: string
  localDateStr: string
  weather: Weather
  startTimestamp: number
  endTimestamp: number
}
/* 区域天气预测结果*/
export interface ForecastResult {
  areaId: EurekaAreaId
  areaName: string
  currentTime: string
  forecasts: ForecastItem[]
  timeRange: {
    start: string
    end: string
    // totalHours: number
    // hoursBefore: number
    // hoursAfter: number
  }
  generatedAt: Date
}

/* 变异怪物 */
export interface Variant {
  level: number | string
  name: string
  type: VariantType
  element: VariantElement[]
  timePeriod: TimePeriod
  weather: Weather[]
  remark?: string
}

/* 文理碎晶 */
export interface LogosCrystal {
  name: string
  icon: string
  logos: {
    name: string
    icon: string
  }[]
}

/* 文理 */
export interface Logos {
  order: number
  icon: string
  name: string
  description: string
  synthesisRecipes: string[][]
  type: string
  castTime: number
  recastTime: number
  range: number
  radius: number
  uses: number
}
