import type { TimePeriod } from '@renderer/types/eureka.type'

export class EorzeaClock {
  // 艾欧泽亚时间流速比率: 艾欧泽亚 1440 分钟 = 现实 70 分钟
  static readonly RATIO = 1440 / 70
  // private static readonly MS_PER_SECOND = 1000
  private static readonly MS_PER_MINUTE = 60 * 1000
  private static readonly MS_PER_HOUR = 60 * 60 * 1000
  private static readonly MS_PER_DAY = 24 * 60 * 60 * 1000

  private _date: Date

  constructor(ts?: number | Date) {
    if (ts instanceof Date) {
      this._date = new Date(ts.getTime())
    } else if (typeof ts === 'number') {
      this._date = new Date(ts)
    } else {
      // 默认当前艾欧泽亚时间: 现实时间 * 比率
      this._date = new Date(Date.now() * EorzeaClock.RATIO)
    }
  }

  /**
   * 获取艾欧泽亚时间的小时 (0-23)
   */
  getHours(): number {
    return this._date.getUTCHours()
  }

  /**
   * 获取艾欧泽亚时间的分钟 (0-59)
   */
  getMinutes(): number {
    return this._date.getUTCMinutes()
  }

  /**
   * 获取艾欧泽亚时间的秒数 (0-59)
   */
  getSeconds(): number {
    return this._date.getUTCSeconds()
  }

  /**
   * 获取艾欧泽亚时间的天数戳 (从纪元开始的天数)
   */
  getDays(): number {
    return Math.floor(this._date.getTime() / EorzeaClock.MS_PER_DAY)
  }

  /* 获取所属时段 */
  getPried(): TimePeriod {
    const hour = this.getHours()
    return hour < 6 || hour >= 18 ? 'moon' : 'sun'
  }

  /**
   * 增加指定小时数
   */
  addHours(hours: number): EorzeaClock {
    return new EorzeaClock(this._date.getTime() + hours * EorzeaClock.MS_PER_HOUR)
  }

  /**
   * 增加指定分钟数
   */
  addMinutes(minutes: number): EorzeaClock {
    return new EorzeaClock(this._date.getTime() + minutes * EorzeaClock.MS_PER_MINUTE)
  }

  /**
   * 转换为对应的现实世界时间
   */
  getLocalTime(): Date {
    return new Date(this.getTime() / EorzeaClock.RATIO)
  }

  /**
   * 获取内部时间戳 (艾欧泽亚时间戳)
   */
  getTime(): number {
    return this._date.getTime()
  }

  /**
   * 格式化为 HH:mm 字符串
   */
  toHourMinuteString(): string {
    const hour = this.getHours().toString().padStart(2, '0')
    const minute = this.getMinutes().toString().padStart(2, '0')
    return `${hour}:${minute}`
  }

  /**
   * 格式化为完整字符串
   */
  toString(): string {
    const localTime = this.getLocalTime()
    return `艾: ${this.toHourMinuteString()} (本: ${localTime.toLocaleString()})`
  }

  /**
   * 获取当前时间对应的天气基准时钟 (对齐到最近的 8 小时整点)
   * 这是为了配合 FF14 天气每 8 小时变化一次的机制
   */
  getWeatherBaseClock(): EorzeaClock {
    const baseClock = new EorzeaClock(this.getTime())
    const currentHour = baseClock.getHours()
    const baseHour = currentHour - (currentHour % 8)

    baseClock._date.setUTCHours(baseHour, 0, 0)
    return baseClock
  }

  /**
   * 从现实时间创建艾欧泽亚时钟
   */
  static fromLocalTime(localTime: Date | number): EorzeaClock {
    const ts = localTime instanceof Date ? localTime.getTime() : localTime
    return new EorzeaClock(ts * EorzeaClock.RATIO)
  }
}
