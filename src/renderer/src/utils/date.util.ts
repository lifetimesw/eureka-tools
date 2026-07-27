import dayjs from 'dayjs'
export interface Day {
  year: number
  month: number
  day: number
  week: number
  date: string
  weekOfYear: number
  isCurrentMonth: boolean
}
export function getDaysOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/* 获取当天是星期几，0是周日，month从1开始 */
export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay()
}

/* 计算周数 */
export function getWeekByDays(days: number): number {
  return Math.ceil(days / 7)
}

/**
 * 获取日历
 * @param {Number} year
 * @param {Number} month
 */
export function createCalendar(year: number, month: number): Day[][] {
  // 上一个月最后一天在当年第几天
  let daysOfYearOfPreMonth = 0
  for (let i = 1; i < month; i++) {
    daysOfYearOfPreMonth += getDaysOfMonth(year, i)
  }

  // 当年1号是周几
  const weekOfFirstDayOfYear = getDayOfWeek(year, 1, 1)
  // 当月1号是周几
  const weekOfFirstDayOfMonth = getDayOfWeek(year, month, 1)
  // 当月天数
  const daysOfMonth = getDaysOfMonth(year, month)

  // 当月日历
  const calendar: Day[][] = [[]]

  // 当月第几周
  let weeksOfMonth = 0
  // 周几
  let week = 0

  // 上一个月
  if (weekOfFirstDayOfMonth > 0) {
    const preMonth = month === 1 ? 12 : month - 1
    const preYear = preMonth === 12 ? year - 1 : year
    const preDays = getDaysOfMonth(preYear, preMonth)

    for (let day = preDays + 1 - weekOfFirstDayOfMonth; day <= preDays; day++, week++) {
      const weekOfYear = getWeekByDays(daysOfYearOfPreMonth + weekOfFirstDayOfYear - preDays + day)
      const date = dayjs(new Date(preYear, preMonth - 1, day)).format('YYYY-MM-DD')
      calendar[weeksOfMonth][week] = {
        year: preYear,
        month: preMonth,
        day,
        week,
        weekOfYear,
        date,
        isCurrentMonth: false,
      }
    }
  }

  // 当月
  for (let day = 1; day <= daysOfMonth; day++, week++) {
    if (week > 6) {
      week = 0
      weeksOfMonth++
      calendar[weeksOfMonth] = []
    }
    const weekOfYear = getWeekByDays(daysOfYearOfPreMonth + weekOfFirstDayOfYear + day)
    const date = dayjs(new Date(year, month - 1, day)).format('YYYY-MM-DD')
    calendar[weeksOfMonth][week] = {
      year,
      month,
      day,
      week,
      weekOfYear,
      date,
      isCurrentMonth: true,
    }
  }

  // 下一个月
  if (week <= 6 || weeksOfMonth < 5) {
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = nextMonth === 1 ? year + 1 : year
    const nextDays = getDaysOfMonth(nextYear, nextMonth)

    for (let day = 1; day <= nextDays; day++, week++) {
      if (week > 6) {
        week = 0
        weeksOfMonth++
        if (weeksOfMonth > 5) {
          break
        }
        calendar[weeksOfMonth] = []
      }
      const date = dayjs(new Date(nextYear, nextMonth - 1, day)).format('YYYY-MM-DD')
      const weekOfYear = getWeekByDays(daysOfYearOfPreMonth + weekOfFirstDayOfYear + daysOfMonth + day)
      calendar[weeksOfMonth][week] = {
        year: nextYear,
        month: nextMonth,
        day,
        week,
        date,
        weekOfYear,
        isCurrentMonth: false,
      }
    }
  }
  // if (week <= 6) {
  //   const nextMonth = month === 12 ? 1 : month + 1
  //   const nextYear = nextMonth === 1 ? year + 1 : year
  //   for (let day = 1; week <= 6; day++, week++) {
  //     const date = dayjs().format('YYYY-MM-DD')
  //     const weekOfYear = getWeekByDays(daysOfYearOfPreMonth + weekOfFirstDayOfYear + daysOfMonth + day)
  //     calendar[weeksOfMonth][week] = {
  //       year: nextYear,
  //       month: nextMonth,
  //       day,
  //       week,
  //       date,
  //       weekOfYear,
  //       isCurrentMonth: false,
  //     }
  //   }
  // }
  return calendar
}
